module.exports = {
    apps: [
      {
        name: 'sf-backend',
        cwd: '/home/ubuntu/video-transcoding-e2e/primary-backend',
        script: 'npm',
        args: 'start',
        exec_mode: 'cluster',
        instances: 1,
      },
      {
        name: 'sf-poller',
        cwd: '/home/ubuntu/video-transcoding-e2e/poller',
        script: 'npm',
        args: 'start',
        exec_mode: 'cluster',
        instances: 1,
      },
      {
        name: 'sf-websocket',
        cwd: '/home/ubuntu/video-transcoding-e2e/progress-tracker',
        script: 'npm',
        args: 'start',
        exec_mode: 'cluster',
        instances: 1,
      },
    ],
  };