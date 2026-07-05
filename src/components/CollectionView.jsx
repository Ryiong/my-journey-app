import React, { useState } from 'react';

export default function CollectionView({ collections, onAddCollection, timelineItems }) {
  const [newCollectionName, setNewCollectionName] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    onAddCollection(newCollectionName.trim());
    setNewCollectionName('');
  };

  if (selectedCollection) {
    const filteredItems = timelineItems.filter(item => item.collection === selectedCollection);

    return (
      <div className="h-full flex flex-col space-y-4 overflow-y-auto no-scrollbar pb-10">
        <div className="flex items-center gap-2 border-b border-surface-container-highest pb-3 shrink-0">
          <button 
            onClick={() => setSelectedCollection(null)} 
            className="material-symbols-outlined text-on-surface text-xl active:scale-90 transition-transform"
          >
            arrow_back
          </button>
          <div>
            <h2 className="text-sm font-black text-on-surface">{selectedCollection}</h2>
            <p className="text-[10px] text-outline font-semibold uppercase tracking-wider">
              {filteredItems.length} Khoảnh khắc
            </p>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-outline/50 py-12">
            <span className="material-symbols-outlined text-4xl mb-2">image_not_supported</span>
            <p className="text-xs font-semibold">Chưa có hình ảnh nào trong bộ sưu tập này</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className="aspect-square bg-surface-container rounded-xl overflow-hidden border border-surface-container-highest stitch-shadow relative group active:scale-95 transition-transform"
              >
                <img src={item.img} alt={item.caption} className="w-full h-full object-cover" />
                {item.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-[2px] p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[9px] text-white font-medium truncate">{item.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

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
            <div 
              key={folderName} 
              onClick={() => setSelectedCollection(folderName)}
              className="bg-white p-3 rounded-card border border-surface-container-highest stitch-shadow flex flex-col space-y-3 active:scale-[0.98] cursor-pointer transition-transform"
            >
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