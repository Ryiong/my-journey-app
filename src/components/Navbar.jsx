import React from 'react';

export default function Navbar({ currentTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-surface-container-highest max-w-md mx-auto grid grid-cols-2 z-30 pb-5">
      <button onClick={() => onTabChange('camera')} class={`flex flex-col items-center justify-center p-3 ${currentTab === 'camera' ? 'text-primary' : 'text-outline opacity-60'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: currentTab === 'camera' ? "'FILL' 1" : "'FILL' 0" }}>photo_camera</span>
        <span className="text-[10px] font-bold mt-0.5">Ống kính</span>
      </button>
      <button onClick={() => onTabChange('timeline')} class={`flex flex-col items-center justify-center p-3 ${currentTab === 'timeline' ? 'text-primary' : 'text-outline opacity-60'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: currentTab === 'timeline' ? "'FILL' 1" : "'FILL' 0" }}>auto_stories</span>
        <span className="text-[10px] font-bold mt-0.5">Dòng thời gian</span>
      </button>
    </nav>
  );
}