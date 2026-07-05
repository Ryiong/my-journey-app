import React, { useState, useRef, useEffect } from 'react';

const FRAMES_CONFIG = {
  1: {
    id: 'single-1',
    name: 'Khổ ngang 1 ảnh (4x6")',
    width: 1800,
    height: 1200,
    defaultBg: '#34908B',
    slots: [{ x: 80, y: 80, w: 1640, h: 940 }],
  },
  4: {
    id: 'strip-4',
    name: 'Photostrip 4 ảnh dọc (2x6")',
    width: 600,
    height: 1800,
    defaultBg: '#34908B',
    slots: [
      { x: 40, y: 128, w: 520, h: 340 },
      { x: 40, y: 508, w: 520, h: 340 },
      { x: 40, y: 888, w: 520, h: 340 },
      { x: 40, y: 1268, w: 520, h: 340 }
    ]
  },
  6: {
    id: 'grid-6',
    name: 'Grid 6 ảnh (4x6")',
    width: 1200,
    height: 1800,
    defaultBg: '#34908B',
    slots: [
      { x: 30, y: 300, w: 560, h: 420 }, { x: 610, y: 300, w: 560, h: 420 },
      { x: 30, y: 780, w: 560, h: 420 }, { x: 610, y: 780, w: 560, h: 420 },
      { x: 30, y: 1260, w: 560, h: 420 }, { x: 610, y: 1260, w: 560, h: 420 }
    ]
  }
};

export default function PhotoboothView({ onSave, isSaving }) {
  const [step, setStep] = useState('select-qty');
  const [quantity, setQuantity] = useState(4);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [tempPhoto, setTempPhoto] = useState(null);
  const [customFrameSrc, setCustomFrameSrc] = useState(null);
  const [finalResult, setFinalResult] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { aspectRatio: 4 / 3, facingMode: 'user' },
        audio: false
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch (err) {
      console.error("Không thể khởi động camera photobooth:", err);
      alert("Vui lòng cấp quyền camera!");
    }
  };

  useEffect(() => {
    if (step === 'camera') {
      startCamera();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, [step]);

  const handleCustomFrameUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setCustomFrameSrc(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    setTempPhoto(canvas.toDataURL('image/jpeg'));
    setStep('preview-each');
  };

  const handleContinueEach = () => {
    const updatedPhotos = [...capturedPhotos, tempPhoto];
    setCapturedPhotos(updatedPhotos);
    setTempPhoto(null);

    if (updatedPhotos.length < quantity) {
      setCurrentIdx(updatedPhotos.length);
      setStep('camera');
    } else {
      
      renderFinalPhotobooth(updatedPhotos);
    }
  };

  const renderFinalPhotobooth = async (photos) => {
    const config = FRAMES_CONFIG[quantity];
    if (!config) return;

    const canvas = document.createElement('canvas');
    canvas.width = config.width;
    canvas.height = config.height;
    const ctx = canvas.getContext('2d');

    const loadImage = (src) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });

    try {
      const loadedPhotos = await Promise.all(photos.map(p => loadImage(p)));
      
      ctx.fillStyle = config.defaultBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      config.slots.forEach((slot, index) => {
        if (loadedPhotos[index]) {
          ctx.drawImage(loadedPhotos[index], slot.x, slot.y, slot.w, slot.h);
        }
      });

      if (customFrameSrc) {
        const customFrameImg = await loadImage(customFrameSrc);

        ctx.drawImage(customFrameImg, 0, 0, canvas.width, canvas.height);
      } else {
        
        config.drawFooter(ctx);
      }

      setFinalResult(canvas.toDataURL('image/jpeg', 0.95));
      setStep('final');
    } catch (error) {
      console.error("Lỗi trong quá trình render canvas:", error);
    }
  };

  const downloadImage = () => {
    if (!finalResult) return;
    const link = document.createElement('a');
    link.download = `Photobooth_${quantity}pics_${Date.now()}.jpg`;
    link.href = finalResult;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    setCapturedPhotos([]);
    setCurrentIdx(0);
    setTempPhoto(null);
    setFinalResult(null);
    setStep('select-qty');
  };

  return (
    <div className="h-full flex flex-col justify-between items-center bg-zinc-950 text-white rounded-3xl p-4 overflow-y-auto no-scrollbar">

      {step === 'select-qty' && (
        <div className="flex-1 flex flex-col justify-center items-center gap-6 w-full max-w-sm">
          <div className="text-center">
            <span className="material-symbols-outlined text-5xl text-primary animate-pulse">auto_awesome_motion</span>
            <h2 className="text-xl font-bold mt-2">Cấu Hình Photobooth</h2>
            <p className="text-zinc-400 text-xs">Hệ thống tự động áp dụng khung theo số ảnh bạn chọn</p>
          </div>

          <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wide">
              <span className="material-symbols-outlined text-sm text-cyan-400">upload_file</span> Sử dụng khung tự tải (Tùy chọn):
            </label>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => fileInputRef.current.click()}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-xl transition-transform active:scale-95 cursor-pointer"
              >
                {customFrameSrc ? 'Thay đổi khung ảnh' : 'Chọn tệp khung từ máy'}
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleCustomFrameUpload} 
              />
              {customFrameSrc && (
                <button 
                  onClick={() => setCustomFrameSrc(null)} 
                  className="material-symbols-outlined text-red-400 hover:text-red-300 transition-colors"
                >
                  delete
                </button>
              )}
            </div>
            {customFrameSrc && (
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">check_circle</span> Đã kích hoạt khung tùy biến thành công
              </p>
            )}
          </div>

          <div className="w-full text-left text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Chọn số lượng ô ảnh</div>
          <div className="grid grid-cols-3 gap-3 w-full">
            {[1, 4, 6].map((qty) => (
              <button
                key={qty}
                onClick={() => { setQuantity(qty); setStep('camera'); }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl py-6 flex flex-col items-center justify-center gap-1 hover:border-primary/60 hover:bg-primary/5 transition-all active:scale-95 group"
              >
                <span className="text-3xl font-black text-primary group-hover:scale-110 transition-transform">{qty}</span>
                <span className="text-xs text-zinc-400">Ảnh</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'camera' && (
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md gap-4">
          <div className="w-full flex justify-between items-center px-1">
            <span className="text-xs font-black bg-zinc-800 text-primary px-3 py-1 rounded-full">
              ĐANG CHỤP: {currentIdx + 1} / {quantity}
            </span>
            <button onClick={resetAll} className="material-symbols-outlined text-zinc-500 hover:text-white transition-colors">close</button>
          </div>

          <div className="w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden shadow-xl border-2 border-zinc-800 relative">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
          </div>

          <button 
            onClick={capturePhoto} 
            className="w-16 h-16 rounded-full border-4 border-white bg-primary flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-primary/40 mt-2"
          >
            <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
          </button>
        </div>
      )}

      {step === 'preview-each' && (
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md gap-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Kiểm tra ảnh tấm thứ {currentIdx + 1}</h3>
          
          <div className="w-full aspect-[4/3] bg-zinc-900 rounded-2xl overflow-hidden shadow-xl border-2 border-primary">
            <img src={tempPhoto} alt="Captured check" className="w-full h-full object-cover" />
          </div>

          <div className="flex gap-3 w-full px-2">
            <button 
              onClick={() => { setTempPhoto(null); setStep('camera'); }}
              className="flex-1 py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">refresh</span> Chụp lại
            </button>
            <button 
              onClick={handleContinueEach}
              className="flex-1 py-3 bg-primary text-white font-bold text-xs rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-1.5 shadow-md shadow-primary/20"
            >
              Đồng ý <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {step === 'final' && (
        <div className="flex-1 flex flex-col items-center justify-between w-full max-w-md gap-3 overflow-hidden">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1 shrink-0">
            <span className="material-symbols-outlined text-sm">check_circle</span> Hoàn thành tấm phim Photobooth!
          </h3>

          <div className="flex-1 w-full flex items-center justify-center p-2 bg-zinc-900 rounded-2xl overflow-y-auto max-h-[50dvh]">
            <img 
              src={finalResult} 
              alt="Final Photobooth Strip" 
              className="max-h-full max-w-full rounded shadow-2xl object-contain"
            />
          </div>

          <div className="flex flex-col gap-2 w-full px-1 mt-1 shrink-0">
            <button 
              onClick={downloadImage}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-md"
            >
              <span className="material-symbols-outlined text-sm">download</span> Tải ảnh kết quả về máy
            </button>

            <div className="flex gap-2 w-full">
              <button 
                onClick={resetAll}
                disabled={isSaving}
                className="flex-1 py-3 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold rounded-xl active:scale-95 transition-transform disabled:opacity-50"
              >
                Làm bản mới
              </button>
              <button 
                onClick={() => onSave({ caption: `📸 Photobooth (${quantity} ảnh)`, collection: 'Photobooth', imageBase64: finalResult })}
                disabled={isSaving}
                className="flex-2 py-3 bg-primary text-white text-xs font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10 disabled:opacity-50"
              >
                {isSaving ? (
                  <>Đang đồng bộ...</>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">cloud_upload</span> Lưu vào Timeline
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}