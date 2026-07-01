import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import CameraView from './components/CameraView';
import EditorView from './components/EditorView';
import Timeline from './components/Timeline';
import CollectionView from './components/CollectionView';
import Navbar from './components/Navbar';
import Login from './components/Login';
import { useEffect } from 'react';

const base64ToBlob = (base64Data, contentType = 'image/jpeg') => {
  const byteCharacters = atob(base64Data.split(',')[1]);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
};

export default function App() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('camera');
  const [editorImage, setEditorImage] = useState(null);
  const [collections, setCollections] = useState([]);
  const [timelineItems, setTimelineItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from('moments')
        .select('id, created_at, img_url, caption, collection')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const formattedData = data.map(item => ({
          id: item.id,
          time: new Date(item.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          img: item.img_url,
          caption: item.caption,
          collection: item.collection || 'Chưa phân loại'
        }));
        setTimelineItems(formattedData);

        const dbCollections = data
          .map(item => item.collection || 'Chưa phân loại')
          .filter(name => name && name.trim() !== '');
        
        setCollections(Array.from(new Set(dbCollections)));
      }
    };

    fetchInitialData();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleAddCollectionLocal = (name) => {
    const trimmed = name.trim();
    if (trimmed) {
      setCollections(prev => prev.includes(trimmed) ? prev : [...prev, trimmed]);
    }
  };

  const handleSaveMoment = async ({ caption, collection }) => {
    if (!editorImage || isSaving) return;
    setIsSaving(true);

    try {
      const fileName = `${user.id}/${Date.now()}.jpg`;
      const blob = base64ToBlob(editorImage);

      const { error: storageError } = await supabase.storage
        .from('journey-photos') 
        .upload(fileName, blob, { contentType: 'image/jpeg', cacheControl: '3600' });

      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage
        .from('journey-photos')
        .getPublicUrl(fileName);

      const { data: dbData, error: dbError } = await supabase
        .from('moments')
        .insert([{ user_id: user.id, caption, collection, img_url: publicUrl }])
        .select();

      if (dbError) throw dbError;

      if (dbData?.[0]) {
        const newItem = {
          id: dbData[0].id,
          time: new Date(dbData[0].created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          img: publicUrl,
          caption: caption,
          collection: collection || 'Chưa phân loại'
        };

        setTimelineItems(prev => [newItem, ...prev]);
        if (collection) handleAddCollectionLocal(collection);
      }

      setEditorImage(null);

    } catch (error) {
      console.error("Lỗi hệ thống khi lưu:", error);
      alert("Không thể tải lên khoảnh khắc: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return <Login onLoginSuccess={setUser} />;
  }

  return (
    <div className="fixed inset-0 bg-surface flex flex-col h-screen max-h-[100dvh] overflow-hidden select-none pb-[calc(64px+env(safe-area-inset-bottom,16px))]">
      <header className="p-4 pt-[calc(env(safe-area-inset-top,16px)+8px)] flex items-center justify-between bg-surface/80 backdrop-blur-md z-30 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm stitch-shadow">J</div>
          <h1 className="text-lg font-black tracking-tight">Journey</h1>
        </div>
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
            onSave={handleSaveMoment}
            onCancel={() => setEditorImage(null)}
            isSaving={isSaving}
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
                onAddCollection={handleAddCollectionLocal}
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



