import React from 'react';

export default function Navbar({ currentTab, onTabChange }) {
  const tabs = [
    { id: 'collection', icon: 'stack' },
    { id: 'camera', icon: 'photo_camera' },
    { id: 'timeline', icon: 'timeline' } 
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 max-w-2xs mx-auto px-4 pointer-events-none ">
      <nav className="w-full bg-white/80 backdrop-blur-xl border border-surface-container-highest rounded-full flex justify-around items-center shadow-[0_8px_32px_rgba(45,55,50,0.08)] pointer-events-auto h-15">
        {tabs.map(tab => {
          const isActive = currentTab === tab.id;
          return (
            <button 
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center justify-center h-12 transition-all duration-300 relative ${
                isActive
                  ? 'bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.06)] px-6 text-primary scale-105'
                  : 'text-outline opacity-40 px-4'
              }`}
            >
              <span 
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400" }}
              >
                {tab.icon}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}