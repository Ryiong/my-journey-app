import React, { useEffect, useRef, useState } from 'react';

export default function CameraView({onCapture}) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isFlash, setIsFlash] = useState(false);
    const [isFlashMode, setIsFlashMode] = useState(flase);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment'},
            audio: false
        })
        .then(stream => {
            if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Cannot access camera:", err));

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const triggerCapture = () => {
        setIsFlash(true);
        setTimeout(() => setIsFlash(flase), 150);

        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL('image/jpeg');
            onCapture(dataUrl);
        }
    };

    return (
    <section class="bg-white rounded-card p-4 border border-surface-container-highest stitch-shadow space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-bold uppercase tracking-wider text-outline">Ống kính thực tế</h2>
        <button 
          onClick={() => setIsFlashMode(!isFlashMode)} 
          class={`p-2 rounded-full transition-colors ${isFlashMode ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant'}`}
        >
          <span class="material-symbols-outlined text-sm">{isFlashMode ? 'flash_on' : 'flash_off'}</span>
        </button>
      </div>
      
      <div class="relative aspect-[4/3] bg-neutral-900 rounded-xl overflow-hidden flex items-center justify-center">
        <video ref={videoRef} autoPlay playsInline class="w-full h-full object-cover scale-x-[-1]"></video>
        <canvas ref={canvasRef} class="hidden"></canvas>
        
        {isFlash && <div class="absolute inset-0 bg-white transition-opacity duration-75 z-50"></div>}
        
        <div class="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
          <div class="border-b border-r border-white"></div>
          <div class="border-b border-r border-white"></div>
          <div class="border-b border-white"></div>
          <div class="border-b border-r border-white"></div>
          <div class="border-b border-r border-white"></div>
          <div class="border-b border-white"></div>
        </div>
      </div>

      <div class="flex justify-center pt-2">
        <button onClick={triggerCapture} class="w-16 h-16 rounded-full bg-white border-4 border-primary p-1 flex items-center justify-center active:scale-90 transition-transform">
          <div class="w-full h-full bg-primary-container rounded-full"></div>
        </button>
      </div>
    </section>
  );
}