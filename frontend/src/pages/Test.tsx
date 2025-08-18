import  { useEffect, useState } from 'react';

import Navbar from '@/components/layout/Navbar';
import HLSTestPlayer from '@/components/HLSTestPlayer';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
const Test = () => {
 const [searchParams, setSearchParams] = useSearchParams()
 const [url, setUrl] = useState("") 
 const [inputUrl, setInputUrl] = useState("")


 useEffect(() => {
  setUrl(searchParams.get("url") || "")
 }, [searchParams])
  return (
    <>
    <Navbar />
    <div className='container mx-auto px-4 py-8 flex-grow'>

    <div className='flex gap-2'>

    <Input className='bg-muted' placeholder='Enter URL of the video here' value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} />
    <Button onClick={() => setSearchParams((prev)=> {
        prev.set("url", inputUrl)
        setInputUrl("")
        return prev
    })}>Submit</Button>
    </div>
      <HLSTestPlayer src={url} />
    </div>
    </>
  );
}

export default Test