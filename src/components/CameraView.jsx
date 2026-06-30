import React, { useEffect, useRef, useState } from 'react';

export default function CameraView({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isFlash, setIsFlash] = useState(false);
  const [isFlashMode, setIsFlashMode] = useState(false);
  const [hasCamPermission, setHasCamPermission] = useState(true); // Khai báo đầy đủ state kiểm tra quyền

  useEffect(() => {
    // Sửa lỗi gõ nhầm navigation thành navigator
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasCamPermission(false);
      return;
    }

    navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }, // Sử dụng camera sau cho iPhone
      audio: false
    })
    .then(stream => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    })
    .catch(err => {
      console.error("Cannot access camera:", err);
      setHasCamPermission(false);
    });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const triggerCapture = () => {
    setIsFlash(true);
    setTimeout(() => setIsFlash(false), 150); // Sửa lỗi flase thành false

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Không cần lật ngược mirror đối với camera sau (environment)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/jpeg');
      onCapture(dataUrl);
    }
  };

  if (!hasCamPermission) {
    return (
      <section className="bg-white rounded-card p-6 border border-surface-container-highest stitch-shadow text-center space-y-4">
        <span className="material-symbols-outlined text-4xl text-red-500">no_photography</span>
        <h2 className="text-base font-bold text-on-surface">Không thể mở Camera</h2>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          iOS yêu cầu kết nối bảo mật bằng <b className="text-primary">HTTPS</b> mới cho phép mở camera. 
          Vui lòng sử dụng <b className="text-primary">Ngrok</b> hoặc deploy lên <b className="text-primary">Vercel</b> để lấy link bảo mật nha!
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-card p-4 border border-surface-container-highest stitch-shadow space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-outline">Ống kính thực tế</h2>
        <button 
          onClick={() => setIsFlashMode(!isFlashMode)} 
          className={`p-2 rounded-full transition-colors ${isFlashMode ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined text-sm">{isFlashMode ? 'flash_on' : 'flash_off'}</span>
        </button>
      </div>
      
      <div className="relative aspect-[4/3] bg-neutral-900 rounded-xl overflow-hidden flex items-center justify-center">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
        <canvas ref={canvasRef} className="hidden"></canvas>
        
        {isFlash && <div className="absolute inset-0 bg-white transition-opacity duration-75 z-50"></div>}
        
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
          <div className="border-b border-r border-white"></div>
          <div className="border-b border-r border-white"></div>
          <div className="border-b border-white"></div>
          <div className="border-b border-r border-white"></div>
          <div className="border-b border-r border-white"></div>
          <div className="border-b border-white"></div>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <button onClick={triggerCapture} className="w-16 h-16 rounded-full bg-white border-4 border-primary p-1 flex items-center justify-center active:scale-90 transition-transform">
          <div className="w-full h-full bg-primary-container rounded-full"></div>
        </button>
      </div>
    </section>
  );
}