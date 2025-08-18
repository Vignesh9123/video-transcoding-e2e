import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const HLSPlayer = ({ src, width = '100%', height = 'auto' }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if(src.includes(".m3u8")){
    if (Hls.isSupported()) {    
      const hls = new Hls();
      hlsRef.current = hls;
      console.log('HLS ',hls)
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
      hls.on(Hls.Events.LEVEL_SWITCHED, () => {
        console.log('Level Switched',hls.levels);
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
      
    } else {
      console.error('HLS is not supported in this browser.');
    }
    }
    else{
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
    }
  }, [src]);

  return (
    <>

    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      //   style={{ width: width, height: height }}
      className="size-full object-cover opacity-35 lg:opacity-75 dark:opacity-35 dark:lg:opacity-75"
      />
      {/* <button className="bg-black text-white" onClick={() => videoRef.current.play()}>Play</button>
      <button onClick={() => videoRef.current.pause()}>Pause</button>
      <button onClick={() => videoRef.current.requestFullscreen()}>Fullscreen</button>
      <button onClick={() => videoRef.current.currentTime += 10}>Forward 10s</button>
      <button onClick={() => videoRef.current.currentTime -= 10}>Backward 10s</button>
      <button onClick={() => hlsRef.current.levels.forEach((level, index) => {
        if(level.height === 360){
            hlsRef.current.currentLevel = index;
        }
      })}>360p</button>
      <button onClick={() => hlsRef.current.levels.forEach((level, index) => {
        if(level.height === 480){
            hlsRef.current.currentLevel = index;
        }
      })}>480p</button>
      <button onClick={() => hlsRef.current.levels.forEach((level, index) => {
        if(level.height === 720){
            hlsRef.current.currentLevel = index;
        }
      })}>720p</button>
      <button onClick={() => hlsRef.current.currentLevel = -1}>Auto</button> */}
      </>
  );
};

export default HLSPlayer;
