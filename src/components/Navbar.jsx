import React from 'react';

export default function Navbar({ currentTab, onTabChange }) {
  const tabs = [
    { id: 'collection', icon: 'folder' },
    { id: 'camera', icon: 'photo_camera' },
    { id: 'timeline', icon: 'auto_stories' }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-xl border-t border-surface-container-highest max-w-md mx-auto flex justify-around items-center z-40 pt-2 shadow-[0_-4px_24px_rgba(45,55,50,0.04)] pb-[env(safe-area-inset-bottom,16px)] h-[calc(56px+env(safe-area-inset-bottom,16px))]">
      {tabs.map(tab => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`p-3 rounded-full transition-all duration-300 relative ${isActive ? 'text-primary scale-110' : 'text-outline opacity-40'}`}
          >
            <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
              {tab.icon}
            </span>
            {isActive && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>}
          </button>
        );
      })}
    </nav>
  );
}