import { GetObjectCommand, S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import ffmpeg from 'fluent-ffmpeg'
import { PrismaClient } from '@prisma/client'
import { sendEmail } from './sendMail.js'
import RedisClient from 'ioredis'
const prisma = new PrismaClient()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

const redis = new RedisClient(process.env.REDIS_URL)



async function adaptiveBitrateStreaming() {
    const RESOLUTIONS = [
        // { name: '1080p', width: 1920, height: 1080 },
        { name: '720p', width: 1280, height: 720 },
        { name: '480p', width: 854, height: 480 },
        { name: '360p', width: 640, height: 360 }
    ]
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.BUCKET,
            Key: process.env.KEY
        })
        console.log(`Downloading ${process.env.KEY} from ${process.env.BUCKET}`)
        const response = await s3Client.send(command)
        console.log("Downloading completed", process.env.KEY)
        const body = await response.Body.transformToByteArray()
        console.log(`Writing file ${process.env.KEY}`)
        if (!fs.existsSync(path.join(__dirname, 'videos'))) {
            fs.mkdirSync(path.join(__dirname, 'videos'))
        }
        const file = fs.createWriteStream(path.join(__dirname, 'videos', process.env.KEY))
        file.write(body)
        file.end()
        console.log(`File written to ${path.join(__dirname, 'videos', process.env.KEY)}`)
        const videoPath = path.join(__dirname, 'videos', process.env.KEY)
        const promises = RESOLUTIONS.map((resolution) => {
            if (!fs.existsSync(path.join(__dirname, 'transcoded'))) {
                fs.mkdirSync(path.join(__dirname, 'transcoded'))
            }
            const outputPath = path.join(__dirname, 'transcoded', `${process.env.KEY.split('.')[0]}-${resolution.name}.mp4`)
            return new Promise((resolve, reject) => ffmpeg(videoPath)
                .output(outputPath)
                .videoCodec('libx264')
                .audioCodec('aac')
                .size(`${resolution.width}x${resolution.height}`)
                .on('end', () => {
                    console.log(`Video transcoded to ${outputPath}`)
                    resolve(outputPath)
                })
                .on('error', (err) => {
                    console.log(`Error transcoding video: ${err.message}`)
                })
                .format('mp4')
                .run()
            )
        })

        const results = await Promise.all(promises)

        results.forEach(async (result) => {
            const params = {
                Bucket: process.env.AWS_TRANSCODED_OUTPUT_BUCKET_NAME,
                Key: path.basename(result),
                Body: fs.createReadStream(result)
            }
            const command = new PutObjectCommand(params)
            await s3Client.send(command)
            console.log(`Video uploaded to ${params.Bucket}/${params.Key}`)

        })
    } catch (error) {
        console.log('Error in index', error)
    }

}

// adaptiveBitrateStreaming()

async function checkAndUpdateVideoStatusBeforeShutdown() {
  try {
    const video = await prisma.video.findUnique({
      where: {
        id: process.env.KEY
      }
    })
    if(!video) return
    if(video.status === "TRANSCODING") {
      await prisma.video.update({
        where: {
          id: process.env.KEY
        },
        data: {
          status: "FAILED"
        }
      })
      redis.publish(`video-progress:${process.env.KEY}`, JSON.stringify({ progress: 0, status: 'FAILED' }))

    }
  } catch (error) {
    console.log('Error while checking and updating status of video before shutdown', error)
  }
}
process.on("SIGABRT", () => checkAndUpdateVideoStatusBeforeShutdown());
process.on("SIGINT", () => checkAndUpdateVideoStatusBeforeShutdown());
process.on("SIGTERM", () => checkAndUpdateVideoStatusBeforeShutdown());


const getVideoDuration = (path) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(path, (err, metadata) => {
            if (err) return reject(err);
            resolve(metadata.format.duration);
        });
    });
};

async function createHLSStream(videoPath, outputPath, variantsRes) {
    const variants = [
        {
            resolution: { width: 1920, height: 1080 },
            bitrate: '5000k',
            name: '1080p',
            id: 5
        },
        {
            resolution: { width: 1280, height: 720 },
            bitrate: '3000k',
            name: '720p',
            id: 4
        },
        {
            resolution: { width: 854, height: 480 },
            bitrate: '1500k',
            name: '480p',
            id: 3
        },
        {
            resolution: { width: 640, height: 360 },
            bitrate: '500k',
            name: '360p',
            id: 2
        },
        {
            resolution: { width: 426, height: 240 },
            bitrate: '300k',
            name: '240p',
            id: 1
        },
        {
            resolution: { width: 256, height: 144 },
            bitrate: '150k',
            name: '144p',
            id: 0
        }
    ];
    const resolvedVariants = variants.filter(variant => variantsRes.includes(variant.name));

    resolvedVariants.sort((a, b) => {
        return a.id - b.id;
    });

    const hlsOutputPath = outputPath.replace('.mp4', '');
    const masterPlaylist = [];
    masterPlaylist.push('#EXTM3U');
    masterPlaylist.push('#EXT-X-VERSION:3');
    const totalDuration = await getVideoDuration(videoPath); 
    const variantProgress = new Array(resolvedVariants.length).fill(0); 

    const variantPromises = resolvedVariants.map((variant, index) => {
        return new Promise((resolve, reject) => {
            try {
                const variantPath = `${hlsOutputPath}/${variant.name}`;
                if (!fs.existsSync(variantPath)) fs.mkdirSync(variantPath, { recursive: true });

                masterPlaylist.push(`#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(variant.bitrate) * 1000},RESOLUTION=${variant.resolution.width}x${variant.resolution.height}`);
                masterPlaylist.push(`${variant.name}/playlist.m3u8`);

                let lastReportedStep = 0;

                ffmpeg(videoPath)
                    .output(`${variantPath}/playlist.m3u8`)
                    .videoCodec('libx264')
                    .audioCodec('aac')
                    .size(`${variant.resolution.width}x${variant.resolution.height}`)
                    .videoBitrate(variant.bitrate)
                    .addOptions([
                        '-hls_time', '10',
                        '-hls_list_size', '0',
                        '-hls_segment_type', 'mpegts',
                        '-hls_segment_filename', `${variantPath}/segment%d.ts`,
                        '-f', 'hls',
                        '-profile:v', 'main',
                        '-crf', '23',
                        '-preset', 'fast',
                        '-sc_threshold', '0',
                        '-g', '48',
                        '-keyint_min', '48',
                        '-hls_flags', 'delete_segments+append_list',
                    ])
                    .on('progress', (progress) => {
                        const timeParts = progress.timemark.split(':').map(parseFloat);
                        const seconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
                        const percent = Math.min(100, (seconds / totalDuration) * 100);
                        const currentStep = Math.floor(percent / 10);

                        if (currentStep > lastReportedStep) {
                            lastReportedStep = currentStep;
                            variantProgress[index] = percent;

                            const overallProgress = variantProgress.reduce((a, b) => a + b, 0) / resolvedVariants.length;

                            redis.publish(`video-progress:${process.env.KEY}`, JSON.stringify({ progress: overallProgress, status: overallProgress === 100 ? 'COMPLETED' : 'TRANSCODING' })).catch(e => console.error(`Redis progress publish failed`, e));
                        }
                    })
                    .on('end', () => {
                        console.log(`HLS variant ${variant.name} finished`);
                        variantProgress[index] = 100;

                        const overallProgress = variantProgress.reduce((a, b) => a + b, 0) / resolvedVariants.length;

                        redis.publish(`video-progress:${process.env.KEY}`, JSON.stringify({ progress: overallProgress , status: overallProgress === 100 ? 'COMPLETED' : 'TRANSCODING'})).catch(e => console.error(`Redis progress publish failed`, e));

                        resolve();
                    })
                    .on('error', async(err) => {
                        console.error(`Error transcoding ${variant.name}: ${err.message}`);
                        try {
                            const dbvideo = await prisma.video.update({
                                where: { id: process.env.KEY },
                                data: { status: 'FAILED' },
                                include: { User: true }
                            })
                            const message = `
                            <!DOCTYPE html>
                    <html lang="en">
                    <head>
                      <meta charset="UTF-8" />
                      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                      <title>Video Transcoding Complete</title>
                      <style>
                        body {
                          font-family: Arial, sans-serif;
                          background-color: #f4f4f4;
                          color: #333333;
                          margin: 0;
                          padding: 0;
                        }
                        .container {
                          max-width: 600px;
                          margin: 0 auto;
                          background-color: #ffffff;
                          padding: 20px;
                          border-radius: 8px;
                          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        }
                        .header {
                          font-size: 24px;
                          font-weight: bold;
                          text-align: center;
                          margin-bottom: 20px;
                        }
                        .content {
                          font-size: 16px;
                          line-height: 1.5;
                        }
                        .button {
                          display: inline-block;
                          background-color: #007BFF;
                          color: white;
                          padding: 12px 20px;
                          margin-top: 20px;
                          text-decoration: none;
                          border-radius: 5px;
                          font-weight: bold;
                          text-align: center;
                        }
                        .footer {
                          font-size: 12px;
                          color: #777;
                          margin-top: 30px;
                          text-align: center;
                        }
                      </style>
                    </head>
                    <body>
                      <div class="container">
                        <div class="header">Video Transcoding Failed</div>
                        <div class="content">
                          <p>Hello,</p>
                          <p>Your video titled <strong>${dbvideo.name}</strong> has failed to be transcoded.</p>
                          <p>Please check the raw video file for any errors.</p>
                          <p>If you did not initiate this task or believe this was an error, please disregard this message.</p>
                        </div>
                        <div class="footer">
                          <p>&copy; 2025 StreamForge. All rights reserved.</p>
                        </div>
                      </div>
                    </body>
                    </html>
                            `
                            await sendEmail({
                                email: dbvideo.User.email,
                                subject: `Video Transcoding Failed`,
                                message
                            })
                        } catch (error) {
                            console.error(`Failed to update video status:`, error);
                            const message = `
                            <!DOCTYPE html>
                    <html lang="en">
                    <head>
                      <meta charset="UTF-8" />
                      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                      <title>Video Transcoding Complete</title>
                      <style>
                        body {
                          font-family: Arial, sans-serif;
                          background-color: #f4f4f4;
                          color: #333333;
                          margin: 0;
                          padding: 0;
                        }
                        .container {
                          max-width: 600px;
                          margin: 0 auto;
                          background-color: #ffffff;
                          padding: 20px;
                          border-radius: 8px;
                          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        }
                        .header {
                          font-size: 24px;
                          font-weight: bold;
                          text-align: center;
                          margin-bottom: 20px;
                        }
                        .content {
                          font-size: 16px;
                          line-height: 1.5;
                        }
                        .button {
                          display: inline-block;
                          background-color: #007BFF;
                          color: white;
                          padding: 12px 20px;
                          margin-top: 20px;
                          text-decoration: none;
                          border-radius: 5px;
                          font-weight: bold;
                          text-align: center;
                        }
                        .footer {
                          font-size: 12px;
                          color: #777;
                          margin-top: 30px;
                          text-align: center;
                        }
                      </style>
                    </head>
                    <body>
                      <div class="container">
                        <div class="header">Video Transcoding Failed</div>
                        <div class="content">
                          <p>Hello,</p>
                          <p>Your video titled <strong>${dbvideo.name}</strong> has failed to be transcoded.</p>
                          <p>Please check the raw video file for any errors.</p>
                          <p>If you did not initiate this task or believe this was an error, please disregard this message.</p>
                        </div>
                        <div class="footer">
                          <p>&copy; 2025 StreamForge. All rights reserved.</p>
                        </div>
                      </div>
                    </body>
                    </html>
                            `
                            await sendEmail({
                                email: dbvideo.User.email,
                                subject: `Video Transcoding Failed`,
                                message
                            })
                        }
                        reject(err);
                    })
                    .run();
            } catch (error) {
                console.error(`Error transcoding ${variant.name}: ${error.message}`);
                reject(error);
            }
        });
    });


    try {
        await Promise.all(variantPromises);

        await fs.promises.writeFile(
            `${hlsOutputPath}/master.m3u8`,
            masterPlaylist.join('\n')
        );

        console.log('HLS transcoding completed with all variants');
        console.log(`Master playlist: ${hlsOutputPath}/master.m3u8`)
        return `${hlsOutputPath}`;
    } catch (error) {
        console.error('Error in HLS transcoding:', error);
        throw error;
    }
}

async function uploadDirectoryToS3(directoryPath, baseKey) {
    const files = await fs.promises.readdir(directoryPath, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(directoryPath, file.name);

        if (file.isDirectory()) {
            // Recursively upload subdirectories
            await uploadDirectoryToS3(fullPath, path.join(baseKey, file.name));
        } else {
            // Upload file
            const fileStream = fs.createReadStream(fullPath);
            const s3Key = path.join(baseKey, file.name);

            const params = {
                Bucket: process.env.AWS_TRANSCODED_OUTPUT_BUCKET_NAME,
                Key: s3Key.replace(/\\/g, '/'), // Ensure forward slashes for S3 keys
                Body: fileStream,
                ContentType: getContentType(file.name)
            };

            try {
                await s3Client.send(new PutObjectCommand(params));
                console.log(`Uploaded ${s3Key} to S3`);
            } catch (err) {
                console.error(`Error uploading ${s3Key}:`, err);
                throw err;
            }
        }
    }
}

function getContentType(filename) {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
        case '.m3u8':
            return 'application/x-mpegURL';
        case '.ts':
            return 'video/MP2T';
        default:
            return 'application/octet-stream';
    }
}

// HLSStreaming() is the function that takes a video file from S3 and transcodes it to HLS format (break the video into smaller chunks and different resolutions) and uploads it to S3
async function HLSStreaming() {
    try {
        const DBVideo = await prisma.video.update({
            where: {
                id: process.env.KEY
            },
            data: {
                status: 'TRANSCODING'
            }
        })
        if (!DBVideo) {
            console.log('Video not found')
            return
        }
        redis.publish(`video-progress:${process.env.KEY}`, JSON.stringify({ progress: 0, status: 'TRANSCODING' }))
        const command = new GetObjectCommand({
            Bucket: process.env.BUCKET,
            Key: process.env.KEY
        })
        console.log(`Downloading ${process.env.KEY} from ${process.env.BUCKET}`)
        const response = await s3Client.send(command)
        console.log("Downloading completed", process.env.KEY)
        const body = await response.Body.transformToByteArray()
        console.log(`Writing file ${process.env.KEY}`)
        if (!fs.existsSync(path.join(__dirname, 'videos'))) {
            fs.mkdirSync(path.join(__dirname, 'videos'))
        }
        const file = fs.createWriteStream(path.join(__dirname, 'videos', process.env.KEY))
        file.write(body)
        file.end()
        console.log(`File written to ${path.join(__dirname, 'videos', process.env.KEY)}`)
        const videoPath = path.join(__dirname, 'videos', process.env.KEY)
        const outputPath = path.join(__dirname, 'transcoded', `${process.env.KEY.split('.')[0]}.mp4`)
        const hlsPath = await createHLSStream(videoPath, outputPath, DBVideo.variants)
        const baseKey = `${path.basename(hlsPath)}`;

        await uploadDirectoryToS3(hlsPath, baseKey);
        console.log('Successfully uploaded all HLS files to S3');
        const updatedVideo = await prisma.video.update({
            where: {
                id: process.env.KEY
            },
            data: {
                status: 'COMPLETED',
                url: `https://${process.env.AWS_TRANSCODED_OUTPUT_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${process.env.KEY}/master.m3u8`
            },
            include: {
                User: true
            }

        })
        const message = `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Video Transcoding Complete</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    .header {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 20px;
    }
    .content {
      font-size: 16px;
      line-height: 1.5;
    }
    .button {
      display: inline-block;
      background-color: #007BFF;
      color: white;
      padding: 12px 20px;
      margin-top: 20px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      text-align: center;
    }
    .footer {
      font-size: 12px;
      color: #777;
      margin-top: 30px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Your Video Is Ready!</div>
    <div class="content">
      <p>Hello,</p>
      <p>Your video titled <strong>${updatedVideo.name}</strong> has been successfully transcoded and is now ready for viewing.</p>
      <p>You can access the video using the button below:</p>
      <a href="https://hlsjs.video-dev.org/demo/?src=${encodeURI(updatedVideo.url)}" class="button">View Video</a>
      <p>If you did not initiate this task or believe this was an error, please disregard this message.</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 StreamForge. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
        `
        await sendEmail({
            email: updatedVideo.User.email,
            subject: `Video Transcoded`,
            message
        })

        console.log('Video transcoded successfully', updatedVideo)
    }
    catch (error) {
        console.log(error)
        try {
          const dbvideo = await prisma.video.update({
              where: { id: process.env.KEY },
              data: { status: 'FAILED' },
              include: { User: true }
          })
          const message = `
          <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Video Transcoding Complete</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      .header {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
      }
      .content {
        font-size: 16px;
        line-height: 1.5;
      }
      .button {
        display: inline-block;
        background-color: #007BFF;
        color: white;
        padding: 12px 20px;
        margin-top: 20px;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        text-align: center;
      }
      .footer {
        font-size: 12px;
        color: #777;
        margin-top: 30px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Video Transcoding Failed</div>
      <div class="content">
        <p>Hello,</p>
        <p>Your video titled <strong>${dbvideo.name}</strong> has failed to be transcoded.</p>
        <p>Please check the raw video file for any errors.</p>
        <p>If you did not initiate this task or believe this was an error, please disregard this message.</p>
      </div>
      <div class="footer">
        <p>&copy; 2025 StreamForge. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
          `
          await sendEmail({
              email: dbvideo.User.email,
              subject: `Video Transcoding Failed`,
              message
          })
          redis.publish(`video-progress:${dbvideo.id}`, JSON.stringify({  status: 'FAILED' }))

      } catch (error) {
          console.error(`Failed to update video status:`, error);
      }
    }
    finally {
        console.log("Finally reached")
        redis.disconnect()
        process.exit(0)
    }
}

HLSStreaming()