import React, { useState } from 'react';

export default function CollectionView({ collections, onAddCollection, timelineItems }) {
  const [activeCol, setActiveCol] = useState(null); // Album nào đang được click mở rộng
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');

  const handleCreate = () => {
    if (name.trim()) {
      onAddCollection(name.trim());
      setName('');
      setIsCreating(false);
    }
  };

  // Lọc danh sách ảnh thuộc Album được mở
  const activePhotos = timelineItems.filter(item => item.collection === activeCol);

  if (activeCol) {
    return (
      <div className="h-full flex flex-col py-2 space-y-3">
        <div className="flex items-center gap-2 px-1">
          <button onClick={() => setActiveCol(null)} className="material-symbols-outlined text-on-surface">arrow_back_ios</button>
          <h2 className="text-sm font-bold text-on-surface">{activeCol}</h2>
          <span className="text-xs text-outline font-medium">({activePhotos.length} ảnh)</span>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {activePhotos.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-outline text-xs">Chưa có bức ảnh nào trong album này.</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {activePhotos.map(photo => (
                <div key={photo.id} className="aspect-square bg-surface-container rounded-lg overflow-hidden border border-surface-container-highest">
                  <img src={photo.img} className="w-full h-full object-cover" alt="Collection item" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col py-2 space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold uppercase tracking-widest text-outline">Bộ sưu tập</h2>
        <button onClick={() => setIsCreating(!isCreating)} className="text-xs font-bold text-primary flex items-center gap-0.5">
          <span className="material-symbols-outlined text-sm">add</span>Tạo Album
        </button>
      </div>

      {isCreating && (
        <div className="flex gap-2 p-2 bg-white rounded-xl border border-surface-container-highest stitch-shadow">
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tên Album mới..." className="flex-1 bg-surface border-none text-xs rounded-lg p-2 outline-none" />
          <button onClick={handleCreate} className="px-4 bg-primary text-white rounded-lg text-xs font-bold">Tạo</button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-2 gap-3 pb-4">
        {collections.map(col => {
          const count = timelineItems.filter(i => i.collection === col).length;
          return (
            <div key={col} onClick={() => setActiveCol(col)} className="bg-white p-4 rounded-card border border-surface-container-highest stitch-shadow flex flex-col justify-between h-28 active:scale-98 transition-transform cursor-pointer">
              <div className="flex justify-between items-start w-full">
                <span className="material-symbols-outlined text-primary text-2xl">folder_open</span>
                <span className="text-[10px] bg-secondary-container text-on-secondary-container font-bold px-2 py-0.5 rounded-full">{count} ảnh</span>
              </div>
              <span className="text-xs font-bold text-on-surface truncate">{col}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}