const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.video.createMany({ data: [
        { name: "Video 1", status: "PENDING" },
        { name: "Video 2", status: "TRANSCODING", progress: 50 },
        { name: "Video 3", status: "COMPLETED", url:"https://video-transcode-9123-outputs.s3.ap-south-1.amazonaws.com/K+For+Kabaradakkam/master.m3u8" },
        { name: "Video 4", status: "FAILED" }
    ]
    });
    console.log("Videos created successfully");

}

main()