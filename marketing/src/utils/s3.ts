function uploadToS3PresignedUrl(file: File, presignedUrl: string, key: string, xhrRef: React.RefObject<XMLHttpRequest>, setProgress: React.Dispatch<React.SetStateAction<number>>): Promise<void> {
    return new Promise(async(resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', presignedUrl);
    
    xhr.setRequestHeader('Content-Type', file.type)
    xhr.setRequestHeader('key', key)
    
    xhrRef.current = xhr;
    
    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        console.log(`Upload Progress: ${percentComplete.toFixed(2)}%`);
        setProgress(percentComplete)
      }
    };
    
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log('Upload successful!');
        resolve();
      } else {
        reject(new Error('Upload failed with status ' + xhr.status));
      }
    };
    
    xhr.onerror = function () {
      reject(new Error('Network error'));
    };
    xhr.upload.onabort = function () {
      reject(new Error('Upload aborted'));
    };
    
    xhr.send(file);
    });
  }

  const abortUpload = (xhrRef: React.RefObject<XMLHttpRequest | null>) => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
  }