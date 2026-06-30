import React, { useState } from 'react';

export default function CollectionView({ collections, onAddCollection, timelineItems }) {
  const [newCollectionName, setNewCollectionName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    onAddCollection(newCollectionName.trim());
    setNewCollectionName('');
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto no-scrollbar pb-10">
      <form onSubmit={handleSubmit} className="flex gap-2 shrink-0">
        <input 
          type="text"
          value={newCollectionName}
          onChange={e => setNewCollectionName(e.target.value)}
          placeholder="Tên bộ sưu tập mới..."
          className="flex-1 bg-white border border-surface-container-highest rounded-xl text-xs p-3 outline-none focus:ring-1 focus:ring-primary shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
        />
        <button type="submit" className="px-4 bg-primary text-white font-bold text-xs rounded-xl active:scale-95 transition-transform">
          Tạo
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4">
        {collections.map(folderName => {
         
          const folderItems = timelineItems.filter(item => item.collection === folderName);
          const count = folderItems.length;
          
          const coverImage = count > 0 ? folderItems[0].img : null;

          return (
            <div key={folderName} className="bg-white p-3 rounded-card border border-surface-container-highest stitch-shadow flex flex-col space-y-3 active:scale-[0.99] transition-transform">
              <div className="aspect-square w-full bg-neutral-100 rounded-xl overflow-hidden relative border border-neutral-200/50">
                {coverImage ? (
                  <img src={coverImage} alt={folderName} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-outline/40 space-y-1">
                    <span className="material-symbols-outlined text-2xl">folder_open</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white font-black text-[9px] px-2 py-0.5 rounded-full">
                  {count} ẢNH
                </div>
              </div>

              <div className="px-1">
                <h3 className="text-xs font-black tracking-tight truncate text-on-surface">{folderName}</h3>
                <p className="text-[10px] text-outline font-medium">
                  {count > 0 ? 'Đang hoạt động' : 'Chưa có khoảnh khắc'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}