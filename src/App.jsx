import React, { useState } from 'react';
import CameraView from './components/CameraView';
import Timeline from './components/Timeline';
import BottomSheet from './components/BottomSheet';
import Navbar from './components/Navbar';

export default function App() {
  const [currentTab, setCurrentTab] = useState('camera');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [timelineItems, setTimelineItems] = useState([
    {
      id: 1,
      time: "Hôm nay, 08:32",
      img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=500",
      caption: "Góc làm việc buổi sáng ngập nắng mát lành 🌿",
      collection: "Minimalist Living"
    }
  ]);

  const handleCaptureImage = (dataUrl) => {
    setTempImage(dataUrl);
    setIsSheetOpen(true);
  };

  const handleSaveMoment = ({ caption, collection }) => {
    const now = new Date();
    const timeString = `Hôm nay, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newItem = {
      id: Date.now(),
      time: timeString,
      img: tempImage,
      caption,
      collection
    };

    setTimelineItems([newItem, ...timelineItems]);
    setIsSheetOpen(false);
    setCurrentTab('timeline'); // Lưu xong tự chuyển sang Tab Timeline để xem
  };

  return (
    <div class="flex flex-col min-h-screen pb-24">
      {/* TOP HEADER */}
      <header class="p-4 pt-8 flex items-center justify-between bg-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg stitch-shadow">J</div>
          <h1 class="text-xl font-extrabold tracking-tight">Journey</h1>
        </div>
        <button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-full">
          <span class="material-symbols-outlined">account_circle</span>
        </button>
      </header>

      {/* CORE PAGES */}
      <main class="flex-1 px-4 max-w-md mx-auto w-full mt-2">
        {currentTab === 'camera' && <CameraView onCapture={handleCaptureImage} />}
        {currentTab === 'timeline' && <Timeline items={timelineItems} />}
      </main>

      {/* COMPONENT TRƯỢT SỐ LƯU NỘI DUNG */}
      <BottomSheet 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)} 
        onSave={handleSaveMoment} 
      />

      {/* NAVIGATION BAR */}
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}