import React, { useState } from 'react';
import CameraView from './components/CameraView';
import EditorView from './components/EditorView';
import Timeline from './components/Timeline';
import CollectionView from './components/CollectionView';
import Navbar from './components/Navbar';

export default function App() {
  const [currentTab, setCurrentTab] = useState('camera');
  const [editorImage, setEditorImage] = useState(null); // Kiểm soát việc chuyển sang màn hình Editor
  const [collections, setCollections] = useState(['Minimalist Living', 'Mountain Retreat', 'Coffee Study']);
  const [timelineItems, setTimelineItems] = useState([
    {
      id: 1,
      time: "Hôm nay, 08:32",
      img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=500",
      caption: "Góc làm việc buổi sáng ngập nắng mát lành 🌿",
      collection: "Minimalist Living"
    }
  ]);

  const handleAddCollection = (name) => {
    if (!collections.includes(name)) setCollections([...collections, name]);
  };

  const handleCaptured = (dataUrl) => {
    setEditorImage(dataUrl); // Nhận ảnh và kích hoạt màn Editor chuyên sâu
  };

  const handleSaveMoment = ({ caption, collection }) => {
    const now = new Date();
    const timeString = `Hôm nay, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newItem = {
      id: Date.now(),
      time: timeString,
      img: editorImage,
      caption,
      collection
    };

    setTimelineItems([newItem, ...timelineItems]);
    setEditorImage(null);
    setCurrentTab('timeline'); // Điều hướng thẳng đến dòng thời gian để review
  };

  return (
    <div className="fixed inset-0 bg-surface flex flex-col pt-4 h-screen max-h-[100dvh] overflow-hidden select-none pb-[calc(64px+env(safe-area-inset-bottom,16px))] pt-[calc(env(safe-area-inset-top,16px)+12px)]">

      <header className="p-4 pt-[calc(env(safe-area-inset-top)+8px)] flex items-center justify-between bg-surface/80 backdrop-blur-md z-30 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm stitch-shadow">J</div>
          <h1 className="text-lg font-black tracking-tight">Journey</h1>
        </div>
        <span className="material-symbols-outlined text-outline text-xl">account_circle</span>
      </header>

      <main className="flex-1 px-4 overflow-hidden relative">
        {editorImage ? (
          <EditorView 
            image={editorImage} 
            collections={collections} 
            onAddCollection={handleAddCollection}
            onSave={handleSaveMoment}
            onCancel={() => setEditorImage(null)}
          />
        ) : (
          <>
            {currentTab === 'camera' && <CameraView onCapture={handleCaptured} />}
            {currentTab === 'timeline' && (
              <div className="h-full overflow-y-auto no-scrollbar pb-6">
                <Timeline items={timelineItems} />
              </div>
            )}
            {currentTab === 'collection' && (
              <CollectionView 
                collections={collections} 
                onAddCollection={handleAddCollection} 
                timelineItems={timelineItems}
              />
            )}
          </>
        )}
      </main>

      {!editorImage && <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />}
    </div>
  );
}