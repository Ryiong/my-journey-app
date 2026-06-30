import React, { useState } from 'react';

export default function BottomSheet({ isOpen, onClose, onSave }) {
  const [caption, setCaption] = useState('');
  const [selectedCol, setSelectedCol] = useState('Minimalist Living');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!caption.trim()) return alert("Vui lòng ghi lại vài dòng suy nghĩ!");
    onSave({ caption, collection: selectedCol });
    setCaption('');
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/20 z-40 transition-opacity"></div>
      <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-card border-t border-surface-container-highest stitch-shadow z-50 p-6 transform translate-y-0 transition-transform duration-300 max-w-md mx-auto">
        <div className="w-12 h-1 bg-surface-container-highest rounded-full mx-auto mb-4"></div>
        <h3 className="text-lg font-bold mb-4">Lưu khoảnh khắc</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-outline uppercase mb-1">Caption</label>
            <textarea 
              value={caption} 
              onChange={(e) => setCaption(e.target.value)} 
              rows="2" 
              className="w-full bg-surface border-none focus:ring-2 focus:ring-primary rounded-xl text-sm p-3 outline-none" 
              placeholder="Ghi lại vài suy nghĩ lúc này..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-outline uppercase mb-2">Chọn bộ sưu tập</label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {['Minimalist Living', 'Mountain Retreat', 'Coffee Study'].map(col => (
                <button 
                  key={col} 
                  onClick={() => setSelectedCol(col)} 
                  className={`px-3 py-1.5 text-xs font-bold rounded-full shrink-0 transition-colors ${selectedCol === col ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 text-sm font-bold bg-surface-container rounded-lg text-on-surface-variant">Hủy</button>
            <button onClick={handleConfirm} className="flex-1 py-3 text-sm font-bold bg-primary text-white rounded-lg active:bg-primary/90">Đăng lên Timeline</button>
          </div>
        </div>
      </div>
    </>
  );
}