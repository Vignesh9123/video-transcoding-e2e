import { GetObjectCommand, S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import dotenv from 'dotenv';
// import { exec } from "child_process";
// import path from 'path';
import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs'
dotenv.config();
const imageName = "video-transcoder";


const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

const sqsClient = new SQSClient({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

const ecsClient = new ECSClient({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

async function init() {
    try {
        const command = new ReceiveMessageCommand({
            QueueUrl: process.env.SQS_URL,
            MaxNumberOfMessages: 1,
            VisibilityTimeout: 400, 
            WaitTimeSeconds: 10,
        });
        console.log('Waiting for messages');
    
        while (true) {
            console.log('Waiting for messages 2');
            const response = await sqsClient.send(command);
            if (response.Messages) {
                const message = response.Messages[0];
                // console.log(message);
                // console.log(message.Body)
    
                // Validation
                //  const validExtensions = ['.mp4', '.mkv'];
                const record = JSON.parse(message.Body!).Records?.[0]
                if (!record) {
                    continue;
                }
                console.log(JSON.parse(message.Body!).Records?.[0].s3)
                if (JSON.parse(message.Body!).Event == 's3:TestEvent') {
                    console.log('Test event or invalid file type');
                    continue;
                }
                const bucket = record.s3.bucket.name
                const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '))
                const command = new HeadObjectCommand({
                    Bucket: bucket,
                    Key: key
                })
                const metadata = await s3Client.send(command)
                console.log('metadata', metadata)
                const contentType = metadata.ContentType
                const allowedContentTypes = ['video/mp4', 'video/quicktime', 'video/webm']
                if (!contentType || !allowedContentTypes.includes(contentType)) {
                    console.log('Invalid file type');
                    continue;
                }
    
                // Spin up containers in ECS fargate cluster by the image in ECR 
                // const bucket = record.s3.bucket.name
                // const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '))
    
                console.log(`Creating run task for ${key}`)
                const runTaskCommand = new RunTaskCommand({
                    taskDefinition: process.env.AWS_VIDEO_TRANSCODER_TASK_DEFINITION_ARN!,
                    cluster: process.env.AWS_VIDEO_TRANSCODER_CLUSTER_ARN!,
                    launchType: 'FARGATE',
                    networkConfiguration: {
                        awsvpcConfiguration: {
                            subnets: [
                                'subnet-01304b94777acb1fe',
                                'subnet-01d340e9a61571300',
                                'subnet-001581a0ddf2be787'
                            ],
                            securityGroups: [
                                'sg-007453b984f369ffa'
                            ],
                            assignPublicIp: 'ENABLED' // For production, public ip can be used to access the container
                        }
                    },
                    overrides: {
                        containerOverrides: [
                            {
                                name: imageName,
                                environment: [
                                    {
                                        name: 'AWS_ACCESS_KEY_ID',
                                        value: process.env.AWS_ACCESS_KEY_ID // TODO: Use ECS IAM instead
                                    },
                                    {
                                        name: 'AWS_SECRET_ACCESS_KEY',
                                        value: process.env.AWS_SECRET_ACCESS_KEY // TODO: Use ECS IAM instead
                                    },
                                    {
                                        name: 'AWS_REGION',
                                        value: 'ap-south-1'
                                    },
                                    {
                                        name: 'BUCKET',
                                        value: bucket
                                    },
                                    {
                                        name: 'KEY',
                                        value: key
                                    },
                                    {
                                        name: 'AWS_TRANSCODED_OUTPUT_BUCKET_NAME',
                                        value: process.env.AWS_TRANSCODED_OUTPUT_BUCKET_NAME
                                    },
                                    {
                                        name:'DATABASE_URL',
                                        value: process.env.DATABASE_URL
                                    },
                                    {
                                        name:'SENDER_EMAIL',
                                        value: process.env.SENDER_EMAIL
                                    },
                                    {
                                        name:'MAIL_APP_PASSWORD',
                                        value: process.env.MAIL_APP_PASSWORD
                                    },
                                    {
                                        name:'REDIS_URL',
                                        value: process.env.REDIS_URL
                                    }
                                ]
                            }
                        ]
                    }
                })
    
                console.log('Starting container');
                await ecsClient.send(runTaskCommand)
                    .then((data) => {
                        console.log(data);
                        console.log('Container started successfully');
                    }).catch((err) => {
                        console.error('Error starting container', err);
                    })
                    .finally(async () => {
                        console.log('Deleting message from SQS');
                        const deleteMessageCommand = new DeleteMessageCommand({
                            QueueUrl: process.env.SQS_URL,
                            ReceiptHandle: message.ReceiptHandle
                        });
                        await sqsClient.send(deleteMessageCommand);
                        console.log('Message deleted successfully from SQS');
                    });
                // Spin up containers locally
                // const dockercommand = `docker run --rm \
                // -e AWS_ACCESS_KEY_ID=${process.env.AWS_ACCESS_KEY_ID} \
                // -e AWS_SECRET_ACCESS_KEY=${process.env.AWS_SECRET_ACCESS_KEY} \
                // -e AWS_REGION=${'ap-south-1'} \
                // -e BUCKET=${bucket} \
                // -e KEY="${key}" \
                // -e DATABASE_URL=${process.env.DATABASE_URL} \
                // --network host \
                // -e AWS_TRANSCODED_OUTPUT_BUCKET_NAME=${process.env.AWS_TRANSCODED_OUTPUT_BUCKET_NAME} \
                // -v ${path.join(process.cwd(), 'transcoding-container', 'videos')}:/app/videos \
                // -v ${path.join(process.cwd(), 'transcoding-container', 'transcoded')}:/app/transcoded \
                // ${imageName}`;
                // // Remove the volume mapping (Used for local testing)
                //         // console.log('Running command', dockercommand)
                // const containerProcess = exec(dockercommand);
    
                // containerProcess.stdout?.on('data', (data) => { // Used for real time logs from the container as in exec(dockercommand, (err, stdout, stderr) => {}), stdout and stderr are shown after the container exits
    
                //     console.log('Container output:', data.toString());
                // });
    
                // containerProcess.stderr?.on('data', (data) => {
                //     console.log('Container error:', data.toString());
                // });
    
                // containerProcess.on('exit', async(code, signal) => {
                //     if(code === 0){
                //         console.log('Container exited successfully');
                //         const deleteCommand = new DeleteMessageCommand({
                //             QueueUrl: process.env.SQS_URL,
                //             ReceiptHandle: message.ReceiptHandle
                //         })
                //         await sqsClient.send(deleteCommand)
                //     }
                //     else{
                //         console.log('Container exited with error', code, signal);
                //     }
                // })
                //     .on('error', (error) => {
                //         console.log('Container Error', error);
                //     })
                //     .on('close', (m) => {
                //         console.log('Container closed', m);
                //     })
    
            }
    
    
            else {
                console.log('No messages in queue');
                continue
            }
        }
    }
    catch (error) {
        console.log(error)
    }
}
init()
