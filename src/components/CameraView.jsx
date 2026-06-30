import React, { useEffect, useRef, useState } from 'react';

export default function CameraView({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isFlash, setIsFlash] = useState(false);
  const [isFlashMode, setIsFlashMode] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const [hasCamPermission, setHasCamPermission] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startCameraStream = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasCamPermission(false);
      return;
    }

    navigator.mediaDevices.getUserMedia({
      video: { 
        facingMode: facingMode,
        width: { ideal: 1280 },
        height: { ideal: 960 }
      },
      audio: false
    })
    .then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      const track = stream.getVideoTracks()[0];
      if (track && track.getCapabilities?.().torch) {
        track.applyConstraints({ advanced: [{ torch: isFlashMode }] }).catch(() => {});
      }
    })
    .catch((err) => {
      console.error("Error starting camera:", err);
      setHasCamPermission(false);
    });
  };

  useEffect(() => {
    startCameraStream();

    return () => {
      stopCameraStream();
    };
  }, [facingMode, isFlashMode]);

  const triggerCapture = () => {
    setIsFlash(true);
    setTimeout(() => setIsFlash(false), 150);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      stopCameraStream();
      setPreviewImage(dataUrl);
    }
  };

  const handleRetake = () => {
    setPreviewImage(null);
    setTimeout(() => {
      startCameraStream();
    }, 50);
  };

  // if (!hasCamPermission) {
  //   return (
  //     <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
  //       <span className="material-symbols-outlined text-4xl text-red-400">no_photography</span>
  //       <h2 className="text-base font-bold">Yêu cầu kết nối bảo mật HTTPS</h2>
  //     </div>
  //   );
  // }

  return (
    <div className="h-full flex flex-col justify-between py-2">
      <div className="flex items-center justify-end px-2">
        {!previewImage && (
          <div className="flex gap-2">
            <button 
              onClick={() => setFacingMode(p => p === 'environment' ? 'user' : 'environment')} 
              className="w-9 h-9 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-sm">flip_camera_android</span>
            </button>
            <button 
              onClick={() => setIsFlashMode(!isFlashMode)} 
              className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform ${isFlashMode ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container'}`}
            >
              <span className="material-symbols-outlined text-sm">{isFlashMode ? 'flash_on' : 'flash_off'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="relative aspect-[3/4] w-5/6 mr-auto ml-auto mt-6 mb-6 bg-neutral-900 rounded-card overflow-hidden stitch-shadow">
        {previewImage ? (
          <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
        ) : (
          <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}></video>
        )}
        <canvas ref={canvasRef} className="hidden"></canvas>
        {isFlash && <div className="absolute inset-0 bg-white z-50"></div>}
      </div>

      <div className="flex justify-center items-center pt-2 grow">
        {previewImage ? (
          <div className="flex gap-4 w-full px-2">
            <button onClick={handleRetake} className="flex-1 py-3 text-xs font-bold bg-surface-container rounded-xl text-on-surface-variant flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">refresh</span> Chụp lại
            </button>
            <button onClick={() => onCapture(previewImage)} className="flex-1 py-3 text-xs font-bold bg-primary text-white rounded-xl flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">arrow_forward</span> Tiếp tục
            </button>
          </div>
        ) : (
          <button onClick={triggerCapture} className="w-20 h-20 rounded-full bg-white border-4 border-primary p-0.5 active:scale-95 transition-transform">
            <div className="w-full h-full bg-primary-container rounded-full"></div>
          </button>
        )}
      </div>
    </div>
  );
}