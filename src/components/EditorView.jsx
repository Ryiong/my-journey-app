import React, { useState } from 'react';

export default function EditorView({ image, collections, onAddCollection, onSave, onCancel }) {
  const [caption, setCaption] = useState('');
  const [selectedCol, setSelectedCol] = useState(collections[0] || 'Chưa phân loại');
  const [isCreating, setIsCreating] = useState(false);
  const [newColName, setNewColName] = useState('');

  const handleCreateCol = () => {
    if (newColName.trim()) {
      onAddCollection(newColName.trim());
      setSelectedCol(newColName.trim());
      setNewColName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between py-2 space-y-3 overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold uppercase tracking-widest text-outline">Lưu khoảnh khắc</h2>
        <button onClick={onCancel} className="text-xs font-bold text-outline">Hủy</button>
      </div>

      <div className="bg-white rounded-card border border-surface-container-highest stitch-shadow overflow-hidden flex flex-col flex-1">
        <div className="relative aspect-[4/3] w-full bg-neutral-100">
          <img src={image} className="w-full h-full object-cover" alt="To be saved" />
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <label className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Cảm xúc của bạn</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full flex-1 bg-surface border-none focus:ring-1 focus:ring-primary rounded-xl text-xs p-3 outline-none resize-none"
            placeholder="Ghi lại vài suy nghĩ lúc này..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Bộ sưu tập</label>
          <button onClick={() => setIsCreating(!isCreating)} className="text-[11px] font-semibold text-primary flex items-center gap-0.5">
            <span className="material-symbols-outlined text-xs">add</span>Tạo mới
          </button>
        </div>

        {isCreating && (
          <div className="flex gap-2 p-1 bg-white rounded-xl border border-primary-container animate-fade-in">
            <input
              type="text"
              value={newColName}
              onChange={(e) => setNewColName(e.target.value)}
              placeholder="Tên bộ sưu tập..."
              className="flex-1 bg-transparent border-none text-xs px-2 outline-none focus:ring-0"
              autoFocus
            />
            <button onClick={handleCreateCol} className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-bold">Thêm</button>
          </div>
        )}

        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
          {collections.map(col => (
            <button
              key={col}
              onClick={() => setSelectedCol(col)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full shrink-0 transition-all ${selectedCol === col ? 'bg-primary text-white stitch-shadow' : 'bg-white border border-surface-container-highest text-on-surface-variant'}`}
            >
              {col}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onSave({ caption, collection: selectedCol })}
        className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-xs tracking-wider active:opacity-90 transition-opacity"
      >
        ĐĂNG LÊN TIMELINE
      </button>
    </div>
  );
}