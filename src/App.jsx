import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import CameraView from './components/CameraView';
import EditorView from './components/EditorView';
import Timeline from './components/Timeline';
import CollectionView from './components/CollectionView';
import Navbar from './components/Navbar';
import Login from './components/Login';
import { useEffect } from 'react';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('camera');
  const [editorImage, setEditorImage] = useState(null);
  const [collections, setCollections] = useState(null);
  const [timelineItems, setTimelineItems] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchMoments = async () => {
      const { data, error } = await supabase.from('moments').select('*').order('created_at', { ascending: false});

      if (!error && data) {
        const formattedData = data.map(item => ({
          id: item.id,
          time: new Date(item.created_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'}),
          img: item.img_url,
          caption: item.caption,
          collection: item.collection
        }));
        setTimelineItems(formattedData);

        const defaultCollections = ['Test Collection'];

        const dbCollections = data
        .map(item => item.collection)
        .filter(name => name && name.trim() !== '');

        const finalCollections = Array.from(new Set([...defaultCollections, ...dbCollections]));
        setCollections(finalCollections);
      }
    };

    fetchMoments();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (!user) {
    return <Login onLoginSuccess={setUser} />;
  }

  // const handleAddCollection = (name) => {
  //   if (!collections.includes(name)) setCollections([...collections, name]);
  // };

  // const handleCaptured = (dataUrl) => {
  //   setEditorImage(dataUrl); // Nhận ảnh và kích hoạt màn Editor chuyên sâu
  // };

  // const handleSaveMoment = ({ caption, collection }) => {
  //   const now = new Date();
  //   const timeString = `Hôm nay, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
  //   const newItem = {
  //     id: Date.now(),
  //     time: timeString,
  //     img: editorImage,
  //     caption,
  //     collection
  //   };

  //   setTimelineItems([newItem, ...timelineItems]);
  //   setEditorImage(null);
  //   setCurrentTab('timeline'); // Điều hướng thẳng đến dòng thời gian để review
  // };

  return (
    <div className="fixed inset-0 bg-surface flex flex-col h-screen max-h-[100dvh] overflow-hidden select-none pb-[calc(64px+env(safe-area-inset-bottom,16px))]">
      <header className="p-4 pt-[calc(env(safe-area-inset-top,16px)+8px)] flex items-center justify-between bg-surface/80 backdrop-blur-md z-30 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm stitch-shadow">J</div>
          <h1 className="text-lg font-black tracking-tight">Journey</h1>
        </div>
        {/* Nút đăng xuất nhỏ gọn góc phải trên cùng thế vào icon cá nhân cũ */}
        <button onClick={handleLogout} className="material-symbols-outlined text-outline text-xl active:scale-90 transition-transform">
          logout
        </button>
      </header>

      <main className="flex-1 px-4 overflow-hidden relative">
        {editorImage ? (
          <EditorView 
            image={editorImage} 
            collections={collections} 
            onAddCollection={(name) => !collections.includes(name) && setCollections([...collections, name])}
            onSave={async ({ caption, collection }) => {
              // ... Giữ nguyên hàm logic upload ảnh lên Storage & DB đã viết ở bước trước ...
            }}
            onCancel={() => setEditorImage(null)}
          />
        ) : (
          <>
            {currentTab === 'camera' && <CameraView onCapture={(url) => setEditorImage(url)} />}
            {currentTab === 'timeline' && (
              <div className="h-full overflow-y-auto no-scrollbar pb-6">
                <Timeline items={timelineItems} />
              </div>
            )}
            {currentTab === 'collection' && (
              <CollectionView 
                collections={collections} 
                onAddCollection={(name) => !collections.includes(name) && setCollections([...collections, name])} 
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