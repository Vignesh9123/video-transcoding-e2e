import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { VideoIcon } from 'lucide-react'; // optional icon for dropdown label

const HLSTestPlayer = ({ src, width = '100%', height = 'auto' }) => {
  const videoRef = useRef(null);

  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1);
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
      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        video.play();
        setLevels(data.levels);
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

  useEffect(()=>{
    if(!window) return;
    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [])

  const handleKeyPress = (e: KeyboardEvent) => {
    if(e.code == "KeyF"){
      if(videoRef.current){
        videoRef.current.requestFullscreen();
      }
    }
  }
  const handleQualityChange = (e) => {
    const level = parseInt(e.target.value);
    hlsRef.current.currentLevel = level;
    setCurrentLevel(level);
  };

  return (
    <>
  <div className="w-full max-w-4xl mx-auto p-4 bg-zinc-900 rounded-xl shadow-md">
      <video
        ref={videoRef}
        controls
        className="w-full rounded-lg shadow-inner bg-black"
      />

      {levels.length > 0 && (
        <div className="mt-4 flex items-center gap-3 text-white">
          <VideoIcon className="w-5 h-5 text-zinc-300" />
          <label htmlFor="quality" className="text-sm">
            Select Quality:
          </label>
          <select
            id="quality"
            value={currentLevel}
            onChange={handleQualityChange}
            className="bg-zinc-800 text-white text-sm px-3 py-1 rounded-lg border border-zinc-700 focus:outline-none"
          >
            <option value={-1}>Auto</option>
            {levels.map((level, index) => (
              <option key={index} value={index}>
                {level.height}p
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
      </>
  );
};

export default HLSTestPlayer;
