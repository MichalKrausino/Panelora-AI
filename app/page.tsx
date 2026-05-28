"use client";

import React, { useState, useEffect } from 'react';

// --- STYLES & TYPES ---
interface Texture {
  id: string;
  name: string;
  desc: string;
  badge?: string;
  imageUrl?: string;
  bgClass: string; // tailwind gradient fallback for texture thumbnail
}

interface SampleRoom {
  id: string;
  name: string;
  url: string;
  type: string;
}

interface RoomType {
  id: string;
  name: string;
  desc: string;
}

// --- BUILT-IN SAMPLE ROOMS ---
const SAMPLE_ROOMS: SampleRoom[] = [
  {
    id: 'living-room',
    name: 'Obývací pokoj',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    type: 'living-room',
  },
  {
    id: 'bedroom',
    name: 'Ložnice',
    url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
    type: 'bedroom',
  },
];

// --- BUILT-IN PVC PANEL TEXTURES (17 MOTIFS) ---
const TEXTURES: Texture[] = [
  {
    id: 'bezovy_mramor',
    name: 'Béžový mramor',
    desc: 'Dokáže interiér zjemnit a zároveň mu dodat pocit přirozené noblesy a tepla.',
    badge: 'Populární',
    imageUrl: '/panely/bezovy-mramor.jpg',
    bgClass: 'bg-gradient-to-r from-[#d4cbbe] via-[#e4dccf] to-[#ebdccf]'
  },
  {
    id: 'cerny_mramor',
    name: 'Černý mramor',
    desc: 'Hluboký tmavý design s kontrastním světlým žilkováním pro dramatický a luxusní vzhled.',
    imageUrl: '/panely/cerny-mramor.JPG',
    bgClass: 'bg-gradient-to-r from-[#0d0d0d] via-[#1a1a1a] to-[#262626]'
  },
  {
    id: 'cisty_mramor',
    name: 'Čistý mramor',
    desc: 'Elegantní čistě bílý design doplněný jemným, vkusným mramorovým žilkováním.',
    badge: 'Skladem',
    imageUrl: '/panely/cisty-mramor.jpg',
    bgClass: 'bg-gradient-to-r from-[#eceef2] via-[#f6f7f9] to-[#e1e3e7]'
  },
  {
    id: 'kamen_svetly',
    name: 'Kámen světlý',
    desc: 'Světlý kamenný povrch přinášející do prostoru čistotu, světlo a moderní minimalismus.',
    imageUrl: '/panely/kamen-svetly.jpg',
    bgClass: 'bg-gradient-to-r from-[#d5d5d5] via-[#e2e2e2] to-[#ebebeb]'
  },
  {
    id: 'kamen_tmavy',
    name: 'Kámen tmavý',
    desc: 'Masivní tmavý kamenný dekor, ideální pro moderní industriální akcenty a stěny.',
    imageUrl: '/panely/kamen-tmavy.jpeg',
    bgClass: 'bg-gradient-to-r from-[#333333] via-[#4a4a4a] to-[#5c5c5c]'
  },
  {
    id: 'kralovska_modr',
    name: 'Královská modř',
    desc: 'Exkluzivní hluboký modrý tón s elegantní texturou pro odvážné a prémiové interiéry.',
    badge: 'Novinka',
    imageUrl: '/panely/kralovska-modr.jpg',
    bgClass: 'bg-gradient-to-r from-[#0c182b] via-[#1a2e4c] to-[#274066]'
  },
  {
    id: 'kremovy_kamen',
    name: 'Krémový kámen',
    desc: 'Hřejivý a měkký krémový odstín přírodního kamene, který zútulní jakoukoliv místnost.',
    imageUrl: '/panely/kremovy-kamen.jpg',
    bgClass: 'bg-gradient-to-r from-[#dfceba] via-[#eedec9] to-[#f5e8d6]'
  },
  {
    id: 'mramor_zlaty_dekor',
    name: 'Mramor se zlatým dekorem',
    desc: 'Exkluzivní bílý mramorový základ protkaný luxusními zářivými zlatými detaily.',
    badge: 'Bestseller',
    imageUrl: '/panely/mramor-zlaty-dekor.jpg',
    bgClass: 'bg-gradient-to-r from-[#eceef2] via-[#f6f7f9] to-[#e1e3e7]'
  },
  {
    id: 'namodraly_mramor',
    name: 'Namodralý mramor',
    desc: 'Unikátní design s jemným modrošedým nádechem a elegantní kresbou kamene.',
    imageUrl: '/panely/namodraly-mramor.jpg',
    bgClass: 'bg-gradient-to-r from-[#b4c2d4] via-[#cbd5e1] to-[#dfe5ed]'
  },
  {
    id: 'nocni_kamen',
    name: 'Noční kámen',
    desc: 'Tajemný tmavý dekor inspirovaný strukturou noční skály s jemným saténovým odleskem.',
    imageUrl: '/panely/nocni-kamen.jpg',
    bgClass: 'bg-gradient-to-r from-[#171717] via-[#262626] to-[#383838]'
  },
  {
    id: 'pisecny_dekor',
    name: 'Písečný dekor',
    desc: 'Jemná kombinace přírodně laděných odstínů, které vytvářejí hřejivý a nadčasový vzhled.',
    imageUrl: '/panely/pisecny-dekor.jpg',
    bgClass: 'bg-gradient-to-r from-[#cdbaa4] via-[#dbcbb7] to-[#ccbba6]'
  },
  {
    id: 'piskovcove_zily',
    name: 'Pískovcové žíly',
    desc: 'Přírodní zemité odstíny a měkké vrstvené linie navozující uklidňující pocit přírody.',
    imageUrl: '/panely/piskovcove-zily.jpeg',
    bgClass: 'bg-gradient-to-r from-[#d3c2aa] via-[#e2d3be] to-[#ebdcc8]'
  },
  {
    id: 'ruzovy_mramor',
    name: 'Růžový mramor',
    desc: 'Spojuje decentní pastelovou růžovou barevnost se světlými žilami pro romantický interiér.',
    imageUrl: '/panely/ruzovy-mramor.jpg',
    bgClass: 'bg-gradient-to-r from-[#f9a8d4] via-[#fbcfe8] to-[#fdf2f8]'
  },
  {
    id: 'ricni_kamen',
    name: 'Říční kámen',
    desc: 'Autentická a vyvážená struktura říčního sedimentu s jemnými šedými přechody.',
    imageUrl: '/panely/ricni-kamen.jpg',
    bgClass: 'bg-gradient-to-r from-[#78889e] via-[#94a3b8] to-[#b0bccd]'
  },
  {
    id: 'smaragd',
    name: 'Smaragd',
    desc: 'Nádherná, sytě hluboká smaragdově zelená textura ideální pro luxusní akcentní stěny.',
    badge: 'Luxusní',
    imageUrl: '/panely/smaragd.jpg',
    bgClass: 'bg-gradient-to-r from-[#052314] via-[#0d3c26] to-[#124b31]'
  },
  {
    id: 'svetla_skala',
    name: 'Světlá skála',
    desc: 'Vyvážené, jasné a čisté světlé tóny, které opticky projasní a zvětší každý interiér.',
    badge: 'Akce',
    imageUrl: '/panely/svetla-skala.jpg',
    bgClass: 'bg-gradient-to-r from-[#dbdedf] via-[#e9ebec] to-[#f0f2f3]'
  },
  {
    id: 'zlata_zila',
    name: 'Zlatá žíla',
    desc: 'Prémiový, dramatický mramorový dekor s dominantním a odvážným zlatým žilkováním.',
    badge: 'Prémiové',
    imageUrl: '/panely/zlata-zila.png',
    bgClass: 'bg-gradient-to-r from-[#fef08a] via-[#fef08a] to-[#fef9c3]'
  }
];

// --- ROOM TYPES FOR VIRTUAL STAGING ---
const ROOM_TYPES: RoomType[] = [
  { id: 'living-room', name: 'Obývák', desc: 'Moderní skandinávský obývací pokoj' },
  { id: 'bedroom', name: 'Ložnice', desc: 'Útulný a minimalistický ložnicový prostor' },
  { id: 'bathroom', name: 'Koupelna', desc: 'Luxusní koupelnový interiér s doplňky' },
  { id: 'rough', name: 'Hrubá stavba', desc: 'Surový betonový / nezařízený prostor' },
];

export default function Home() {
  // --- STATE ---
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);
  const [selectedTexture, setSelectedTexture] = useState<string>('cisty_mramor');
  const [selectedRoomType, setSelectedRoomType] = useState<string>('living-room');

  // App States: 'IDLE' | 'LOADING' | 'UNLOCKED'
  const [appState, setAppState] = useState<'IDLE' | 'LOADING' | 'UNLOCKED'>('IDLE');
  const [loadingStep, setLoadingStep] = useState<string>('Připravujeme nahrání...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasRunOnce, setHasRunOnce] = useState<boolean>(false);

  // Staged Image Output
  const [stagedImageUrl, setStagedImageUrl] = useState<string | null>(null);

  // Lead Magnet
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Slider Before/After
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  // Texture Zoom Close-Up Modal State
  const [activeZoomTexture, setActiveZoomTexture] = useState<Texture | null>(null);

  // Server-side rate limit error
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [remainingGenerations, setRemainingGenerations] = useState<number>(5);
  const MAX_GENERATIONS = 5;
  const isLimitReached = remainingGenerations <= 0 || !!rateLimitError;

  // --- 1. RECOVER STORED EMAIL ON MOUNT ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = localStorage.getItem('panelora_user_email');
      if (storedEmail) {
        setUserEmail(storedEmail);
        setEmail(storedEmail);
      }
    }
  }, []);

  // Fetch rate limit info on mount
  useEffect(() => {
    const fetchLimit = async () => {
      try {
        const res = await fetch('/api/segment');
        if (res.ok) {
          const data = await res.json();
          if (typeof data.remaining === 'number') {
            setRemainingGenerations(data.remaining);
            if (data.remaining <= 0) {
              setRateLimitError('Vyčerpali jste limit 5 vizualizací zdarma pro vaši domácnost.');
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch generation limit:', err);
      }
    };
    fetchLimit();
  }, []);



  // --- 2. HELPER: RESIZE UPLOADED IMAGE ---
  const processImageResize = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1024; // optimized resize resolution for faster API processing
          let w = img.width;
          let h = img.height;

          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = () => reject(new Error('Chyba při čtení obrázku.'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Chyba při nahrávání souboru.'));
      reader.readAsDataURL(file);
    });
  };

  // --- 3. CORE CONTROLLERS ---



  // Trigger Staging API (Requires verified email via OTP)
  const runWallSegmentation = async (base64Image: string, roomType: string, targetEmail: string) => {
    setAppState('LOADING');
    setErrorMessage(null);
    setRateLimitError(null);
    setLoadingStep('Načítáme fotografii textury panelu...');

    try {
      setLoadingStep('AI navrhuje design a vizualizuje obložení stěn (cca 10-15s)...');

      const res = await fetch('/api/segment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: base64Image,
          textureId: selectedTexture,
          roomType: roomType
        }),
      });

      const data = await res.json();

      // Handle server-side rate limit (429)
      if (res.status === 429) {
        setRateLimitError(data.error || 'Vyčerpali jste limit 5 vizualizací zdarma pro vaši domácnost.');
        setRemainingGenerations(0);
        setAppState('IDLE');
        return;
      }

      if (!res.ok || data.error || !data.stagedImageUrl) {
        throw new Error(data.details || data.error || 'Nebylo možné dokončit AI vizualizaci.');
      }

      if (typeof data.remaining === 'number') {
        setRemainingGenerations(data.remaining);
      }

      setStagedImageUrl(data.stagedImageUrl);
      setHasRunOnce(true);
      setAppState('UNLOCKED');

      // --- Background: email the visualization to the user ---
      if (targetEmail && data.stagedImageUrl) {
        const texName = TEXTURES.find(t => t.id === selectedTexture)?.name || selectedTexture;
        const roomName = ROOM_TYPES.find(r => r.id === roomType)?.name || roomType;

        console.log('[Email Delivery] Firing background request to:', targetEmail);

        fetch('/api/send-visualization', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: targetEmail,
            stagedImageUrl: data.stagedImageUrl,
            panelName: texName,
            roomType: roomName,
          }),
        }).catch(err => console.error('Background email send failed:', err));
      }

    } catch (err: any) {
      console.error("Virtual staging API error:", err);
      setErrorMessage(err.message || 'AI vizualizace selhala. Zkuste nahrát fotografii znovu.');
      setAppState('IDLE');
    }
  };

  // Handle Room Photo Upload (Doesn't call API automatically)
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setActiveSampleId(null);
      const resizedBase64 = await processImageResize(file);
      setSelectedImage(resizedBase64);
      setStagedImageUrl(null); // Reset staged image so user must click run button
      setAppState('IDLE');
    } catch (err: any) {
      setErrorMessage(err.message || 'Nepodařilo se zpracovat obrázek.');
      setAppState('IDLE');
    }
  };

  // Select Pre-made Sample Room (Doesn't call API automatically)
  const handleSelectSample = async (room: SampleRoom) => {
    try {
      setActiveSampleId(room.id);
      setAppState('LOADING');
      setLoadingStep('Stahujeme a připravujeme vzorovou místnost...');

      const response = await fetch(room.url);
      const blob = await response.blob();

      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Chyba při konverzi vzorové místnosti.'));
        reader.readAsDataURL(blob);
      });

      const base64Image = await base64Promise;
      setSelectedImage(base64Image);
      setStagedImageUrl(null); // Reset staged image

      let matchedRoomType = 'living-room';
      if (room.type === 'bedroom') matchedRoomType = 'bedroom';
      else if (room.type === 'living-room') matchedRoomType = 'living-room';
      setSelectedRoomType(matchedRoomType);

      setAppState('IDLE');
    } catch (err: any) {
      console.error("Error loading sample room:", err);
      setErrorMessage('Nepodařilo se načíst nebo zpracovat ukázkovou místnost.');
      setAppState('IDLE');
    }
  };

  // Drag and Drop events (Doesn't call API automatically)
  const [isDragOver, setIsDragOver] = useState(false);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      setActiveSampleId(null);
      const resizedBase64 = await processImageResize(file);
      setSelectedImage(resizedBase64);
      setStagedImageUrl(null); // Reset staged image
      setAppState('IDLE');
    } catch (err: any) {
      setErrorMessage(err.message || 'Nepodařilo se zpracovat soubor.');
      setAppState('IDLE');
    }
  };

  // Submit Email & Run Visualization
  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    let activeEmail = userEmail;

    if (!activeEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setEmailError('Zadejte prosím platnou e-mailovou adresu.');
        return;
      }
      const trimmedEmail = email.trim();
      activeEmail = trimmedEmail;
      setUserEmail(trimmedEmail);
      if (typeof window !== 'undefined') {
        localStorage.setItem('panelora_user_email', trimmedEmail);
      }
    }

    if (selectedImage && activeEmail) {
      runWallSegmentation(selectedImage, selectedRoomType, activeEmail);
    }
  };

  // Selector value modifications reset visualizer (Token saving flow)
  const selectTextureAndReset = (texId: string) => {
    setSelectedTexture(texId);
    setStagedImageUrl(null);
    setAppState('IDLE');
  };

  const selectRoomTypeAndReset = (typeId: string) => {
    setSelectedRoomType(typeId);
    setStagedImageUrl(null);
    setAppState('IDLE');
  };

  // Trigger Download
  const handleDownload = async () => {
    if (!stagedImageUrl) return;
    try {
      const response = await fetch(stagedImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.download = `panelora-virtual-staging-${selectedTexture}.png`;
      link.href = blobUrl;
      link.click();
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Direct download failed, falling back:", e);
      const link = document.createElement('a');
      link.download = `panelora-virtual-staging-${selectedTexture}.png`;
      link.href = stagedImageUrl;
      link.target = '_blank';
      link.click();
    }
  };

  // Reset visualizer
  const handleReset = () => {
    setSelectedImage(null);
    setActiveSampleId(null);
    setAppState('IDLE');
    setStagedImageUrl(null);
    setErrorMessage(null);
  };

  // Close-up Magnifier trigger
  const handleOpenZoom = (e: React.MouseEvent, tex: Texture) => {
    e.stopPropagation(); // Prevent card selection when clicking zoom
    setActiveZoomTexture(tex);
  };

  return (
    <div className="flex-1 bg-white text-slate-800 font-sans selection:bg-black selection:text-white pb-20 antialiased">

      {/* --- FLOATING HEADER --- */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-white font-black px-3.5 py-1.5 rounded-lg text-lg tracking-wider bg-black shadow-sm">
              PANELORA
            </div>
            <div className="h-6 w-[1px] bg-gray-200 hidden sm:block"></div>
            <span className="text-gray-500 text-xs font-medium hidden sm:block">
              AI interaktivní vizualizátor stěnových panelů
            </span>
          </div>

          {/* Stepper progress indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 select-none">
            <span className={`px-2 py-1 rounded-md transition-colors ${selectedImage ? 'text-black bg-gray-100' : 'text-gray-400'}`}>
              1. Výběr pokoje
            </span>
            <span className="text-gray-300">/</span>
            <span className={`px-2 py-1 rounded-md transition-colors ${selectedImage && !stagedImageUrl ? 'text-black bg-gray-100 font-bold border border-gray-200' : ''}`}>
              2. Konfigurace
            </span>
            <span className="text-gray-300">/</span>
            <span className={`px-2 py-1 rounded-md transition-colors ${appState === 'UNLOCKED' ? 'text-emerald-600 bg-emerald-50 font-bold border border-emerald-100' : ''}`}>
              3. Vizualizace
            </span>
          </div>
        </div>
      </header>

      {/* --- HERO / SUMMARY TITLE --- */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-6 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black mb-2">
          Proměňte svůj interiér s <span className="text-black underline decoration-gray-300 underline-offset-6 decoration-4">Panelorou</span>
        </h1>
        <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
          Vyfoťte jakoukoliv zeď, vyberte moderní PVC slat panely a sledujte okamžitou fotorealistickou transformaci vašeho domova v plné kvalitě.
        </p>
      </section>

      {/* --- MAIN TWO-COLUMN WORKSPACE --- */}
      <main className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-8 items-start">

        {/* ================= LEFT COLUMN: CONTROLS (Order 2 on mobile to stack below preview) ================= */}
        <section className="w-full lg:w-1/2 flex flex-col gap-6 order-2 lg:order-1">

          {/* STEP 1: ROOM SELECTION */}
          <div className="bg-[#F8FAFC] rounded-2xl border border-gray-200 p-5 shadow-sm transition-all duration-300">
            <h2 className="text-base font-bold text-black flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs font-extrabold">1</span>
              Výběr místnosti k vizualizaci
            </h2>

            {/* Drag & Drop Upload - Minimum 44px touch target area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 group flex flex-col items-center justify-center min-h-[110px] ${isDragOver
                ? 'border-black bg-white shadow-inner'
                : 'border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50/50'
                }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                aria-label="Nahrajte fotografii pokoje"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />

              <div className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-slate-950 group-hover:border-slate-400 transition-colors duration-300 mb-3 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
              </div>

              <p className="text-slate-800 text-sm font-semibold mb-0.5">
                Nahrajte fotografii pokoje
              </p>
              <p className="text-slate-500 text-[11px] px-4 leading-normal">
                PNG, JPG (max. 10 MB). Vyfoťte pokoj na šířku.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-3 bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2.5 rounded-lg flex items-start gap-2 animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008h-.008v-.008Z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}


            {/* Nový čistý podnadpis bez efektu tlačítka */}
            <p className="text-slate-400 text-xs font-medium mt-5 mb-3 text-left pl-1 select-none">
              Nebo pokračujte výběrem vzorového pokoje:
            </p>

            {/* Sample Rooms Grid - Touch targets min 44px */}
            <div className="grid grid-cols-2 gap-3">
              {SAMPLE_ROOMS.map((room) => (
                <button
                  key={room.id}
                  onClick={() => handleSelectSample(room)}
                  disabled={appState === 'LOADING'}
                  className={`group relative h-24 rounded-xl overflow-hidden border text-left transition-all duration-300 focus:outline-none min-h-[48px] cursor-pointer disabled:cursor-not-allowed ${activeSampleId === room.id
                    ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-md scale-[1.01]'
                    : 'border-slate-200 hover:border-slate-400 hover:scale-[1.01]'
                    }`}
                >
                  {/* Background Image */}
                  <img
                    src={room.url}
                    alt={room.name}
                    className="absolute inset-0 w-full h-full object-cover brightness-[0.7] group-hover:brightness-[0.8] transition-all duration-300"
                  />

                  {/* Bottom Text Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-2.5 pt-6 flex flex-col justify-end">
                    <span className="text-white text-xs font-bold tracking-wide drop-shadow truncate">
                      {room.name}
                    </span>
                  </div>

                  {/* Active Pin */}
                  {activeSampleId === room.id && (
                    <div className="absolute top-2 right-2 bg-slate-950 text-white p-1 rounded-full shadow">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: VIRTUAL STAGING SETTINGS (Room Type Config) */}
          <div className="bg-[#F8FAFC] rounded-2xl border border-gray-200 p-5 shadow-sm transition-all duration-300">
            <h2 className="text-base font-bold text-black flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs font-extrabold">2</span>
              Konfigurace virtuálního zařizování
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="room-type-select" className="text-xs font-bold text-slate-700">
                  Typ zařizované místnosti
                </label>
                <div className="relative">
                  <select
                    id="room-type-select"
                    value={selectedRoomType}
                    onChange={(e) => selectRoomTypeAndReset(e.target.value)}
                    disabled={appState === 'LOADING'}
                    className="w-full bg-white border border-gray-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black appearance-none cursor-pointer disabled:cursor-not-allowed transition-all duration-300 font-medium min-h-[44px]"
                  >
                    {ROOM_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} — {type.desc}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 leading-normal">
                  Zvolte požadovanou zařízenou scénu. Pokud je prostor prázdný, AI do něj automaticky vygeneruje odpovídající designový nábytek.
                </span>
              </div>
            </div>
          </div>

          {/* STEP 3: PVC PANEL TEXTURES (Scalable Registry) */}
          <div className="bg-[#F8FAFC] rounded-2xl border border-gray-200 p-5 shadow-sm transition-all duration-300">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-bold text-black flex items-center gap-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs font-extrabold">3</span>
                Materiál a design panelu
              </h2>
              <span className="text-[10px] text-gray-400 font-bold bg-white border border-gray-200/80 px-2 py-0.5 rounded-full">
                {TEXTURES.length} motivů
              </span>
            </div>

            {/* PC: Fixed Height Container with Custom Scrollbar, Grid of Cards. Touch target friendly. */}
            <div className="max-h-[460px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent scroll-smooth flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2.5">
                {TEXTURES.map((tex) => {
                  const isSelected = selectedTexture === tex.id;
                  return (
                    <div
                      key={tex.id}
                      onClick={() => selectTextureAndReset(tex.id)}
                      className={`group relative flex flex-col items-stretch p-2.5 rounded-xl border text-left transition-[transform,box-shadow,background-color] duration-200 bg-white hover:bg-slate-50/50 hover:scale-[1.02] hover:shadow-sm cursor-pointer select-none min-h-[140px] transform-gpu will-change-transform ${isSelected
                        ? 'border-black ring-1 ring-black shadow-sm'
                        : 'border-gray-200 hover:border-slate-300'
                        }`}
                    >
                      {/* Visual texture circular thumbnail */}
                      <div className={`relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-inner mb-2 flex-shrink-0 ${tex.bgClass}`}>

                        {tex.imageUrl && (
                          <img
                            src={tex.imageUrl}
                            alt={tex.name}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 w-full h-full object-cover z-0"
                          />
                        )}
                        <div className="w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-white/10 z-10 relative"></div>

                        {/* Zoom Magnifier Button - Optimized for Mobile touch target size min 44x44px wrapper */}
                        <button
                          onClick={(e) => handleOpenZoom(e, tex)}
                          title="Zvětšit detail textury"
                          aria-label={`Zvětšit detail textury ${tex.name}`}
                          className="absolute top-1 right-1 w-11 h-11 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-black hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-sm z-10 cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4 sm:w-3.5 sm:h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637ZM10.5 7.5v6m3-3h-6" />
                          </svg>
                        </button>

                        {/* Selected Indicator Badge */}
                        {isSelected && (
                          <span className="absolute top-1.5 left-1.5 bg-black text-white p-1 rounded-full shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="w-2.5 h-2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                          </span>
                        )}

                        {/* Badge (Bestseller, atd.) */}
                        {tex.badge && (
                          <span className={`absolute bottom-1.5 left-1.5 text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${tex.badge === 'Bestseller' ? 'bg-amber-500 text-white shadow-sm' : 'bg-emerald-500 text-white shadow-sm'
                            }`}>
                            {tex.badge}
                          </span>
                        )}
                      </div>

                      {/* Meta info */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <span className="text-slate-900 text-xs font-bold leading-tight block truncate">
                            {tex.name}
                          </span>
                          <p className="text-slate-500 text-[10px] line-clamp-2 leading-tight mt-0.5">
                            {tex.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI DISCLAIMER */}
          <p className="text-[10px] text-slate-400 text-center mt-4 px-2">
            Upozornění: Vygenerovaná 3D vizualizace je vytvořena umělou inteligencí a má pouze ilustrační charakter. Skutečná barevnost, odlesky a přesné proporce panelů se mohou v reálném prostoru mírně lišit.
          </p>

        </section>

        {/* ================= RIGHT COLUMN: VISUALIZER CONTAINER ================= */}
        <section className="w-full lg:w-1/2 relative lg:sticky lg:top-28 flex flex-col items-center justify-start min-h-[450px] sm:min-h-[500px] lg:min-h-[600px] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden order-1 lg:order-2">

          {/* STATE CONDITIONAL RENDERING */}
          {stagedImageUrl || appState === 'LOADING' ? (
            /* ACTIVE SCREEN: AI loading or Staged Image is present */
            <div className="relative w-full flex-1 flex flex-col min-h-0 select-none overflow-hidden">
              {appState === 'LOADING' ? (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-30 p-8 flex flex-col items-center justify-center text-center">
                  <div className="relative w-16 h-16 mb-5">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-black border-r-black/20 animate-spin"></div>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 mb-1.5 tracking-wide">
                    Umělá inteligence pracuje...
                  </h4>

                  <p className="text-slate-600 text-xs font-mono bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-lg animate-pulse max-w-sm">
                    {loadingStep}
                  </p>

                  <span className="text-[9px] text-slate-400 mt-5 font-bold tracking-wider uppercase select-none">
                    Zařizujeme prostor, obkládáme stěny a vyřezáváme stíny
                  </span>
                </div>
              ) : (
                <div className="relative w-full flex-1 flex flex-col min-h-0">
                  {/* Slider view container */}
                  <div className="relative w-full flex-1 min-h-0 overflow-hidden">
                    {/* A. Background Base Layer (Original room photo) */}
                    <img
                      src={selectedImage || undefined}
                      alt="Původní místnost"
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* B. Top Layer (Virtual Staging Output) */}
                    <div
                      className="absolute inset-0 w-full h-full"
                      style={{
                        clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                        willChange: 'clip-path'
                      }}
                    >
                      <img
                        src={stagedImageUrl || undefined}
                        alt="Vizualizovaný pokoj s obkladem"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* C. BEFORE/AFTER SLIDER BAR */}
                    <div
                      className="absolute top-0 bottom-0 z-20 pointer-events-none"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="w-[2px] h-full bg-slate-950 shadow-sm"></div>
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-slate-950 text-white border-2 border-white flex items-center justify-center shadow-lg cursor-ew-resize select-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                        </svg>
                      </div>
                      <span className="absolute top-4 right-3 bg-white/95 text-slate-900 border border-slate-200 text-[9px] font-black px-2 py-0.5 rounded shadow-sm tracking-widest uppercase">
                        Vizualizace
                      </span>
                      <span className="absolute top-4 left-3 -translate-x-full bg-white/95 text-slate-500 border border-slate-200 text-[9px] font-black px-2 py-0.5 rounded shadow-sm tracking-widest uppercase">
                        Původní
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPosition}
                      onChange={(e) => setSliderPosition(parseInt(e.target.value))}
                      aria-label="Nastavení rozdělení před a po"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 select-none"
                    />

                    {/* BLUR GATE OVERLAY */}
                    <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-xl z-30 flex flex-col items-center justify-center p-6 animate-fade-in">
                      <div className="bg-white/95 shadow-2xl rounded-2xl p-6 max-w-sm text-center border border-white/40 flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                          </svg>
                        </div>
                        <h3 className="text-base font-black text-black">Vizualizace odeslána na e-mail!</h3>
                        <p className="text-slate-500 text-xs leading-relaxed">
                          Na webu vidíte pouze rozostřený náhled. Váš hotový návrh v <strong>plné prémiové kvalitě</strong> spolu se slevovým kódem na nákup panelů vám právě přistál ve schránce.
                        </p>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full animate-pulse">
                          Zkontrolujte složku Doručená pošta / Spam
                        </span>
                        <p className="text-[11px] font-bold text-slate-500 mt-1 select-none">
                          Na vaši IP adresu zbývá ještě {remainingGenerations} z {MAX_GENERATIONS} vizualizací.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Toolbar */}
                  <div className="w-full bg-[#F8FAFC] border-t border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-20 flex-shrink-0">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={handleReset}
                        className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-slate-600 hover:text-black text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        Zkusit jiný pokoj
                      </button>
                      {userEmail && (
                        <div className="hidden sm:flex flex-col text-left">
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none">Účet</span>
                          <span className="text-black text-xs font-bold mt-0.5 truncate max-w-[155px]">{userEmail}</span>
                        </div>
                      )}
                    </div>

                    <a
                      href="https://eshop.panelora.cz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-3 bg-black hover:bg-neutral-900 text-white font-bold text-sm rounded-xl text-center flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      Pokračovat na e-shop Panelora →
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : selectedImage ? (
            /* PREVIEW SCREEN: User uploaded a room or selected a sample room */
            <div className="relative w-full flex-1 flex flex-col min-h-0 select-none overflow-hidden">
              <img
                src={selectedImage || undefined}
                alt="Původní místnost náhled"
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.95]"
              />

              {/* Floating Lead Form Overlay Card */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white/95 backdrop-blur shadow-xl rounded-xl p-4 z-20 border border-slate-200/85">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shadow-sm flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                      Místnost připravena k vizualizaci
                    </h3>
                    <p className="text-[10px] text-slate-500 truncate">
                      Vybraný panel: <strong className="text-slate-850">{TEXTURES.find(t => t.id === selectedTexture)?.name}</strong>
                    </p>
                  </div>
                </div>

                {/* Rate limit error banner */}
                {rateLimitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 rounded-lg mb-2.5 flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008h-.008v-.008Z" />
                    </svg>
                    <span>{rateLimitError}</span>
                  </div>
                )}

                <form onSubmit={handleConfirmSubmit} className="flex flex-col gap-2.5">
                  {!userEmail ? (
                    <>
                      <div className="relative text-left">
                        <label htmlFor="email" className="sr-only">E-mail</label>
                        <input
                          type="email"
                          id="email"
                          placeholder="zadejte@email.cz"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-10 bg-white border border-slate-200 focus:border-black text-black rounded-lg px-3 text-xs focus:outline-none focus:ring-2 focus:ring-black/5 transition-all duration-300 placeholder:text-gray-400"
                          required
                        />
                        {emailError && (
                          <span className="text-red-600 text-[10px] font-semibold block mt-1 px-1">
                            {emailError}
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] text-slate-500 leading-tight">
                        Na tento e-mail vám zašleme hotovou vizualizaci. Zadáním souhlasíte se zpracováním osobních údajů a zasíláním inspirace a nabídek e-shopu Panelora.
                      </p>
                    </>
                  ) : (
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg py-1.5 px-2.5">
                      <div className="flex flex-col text-left">
                        <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider leading-none">Váš e-mail</span>
                        <span className="text-slate-800 text-[11px] font-bold truncate max-w-[180px]">{userEmail}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUserEmail(null);
                          if (typeof window !== 'undefined') {
                            localStorage.removeItem('panelora_user_email');
                          }
                        }}
                        className="text-[10px] text-red-500 hover:text-red-700 underline font-medium cursor-pointer"
                      >
                        Změnit
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!!rateLimitError}
                    className={`w-full h-11 font-bold text-xs rounded-lg transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 border ${rateLimitError
                      ? 'bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed shadow-none'
                      : 'bg-black hover:bg-neutral-900 active:scale-[0.98] text-white cursor-pointer border-black/10'
                      }`}
                  >
                    {rateLimitError ? (
                      <span>Vyčerpali jste limit 5 vizualizací zdarma.</span>
                    ) : (
                      <>
                        <span>{hasRunOnce ? 'Aktualizovat AI vizualizaci' : 'Spustit AI vizualizaci'}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                          <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.63l-3-3a.75.75 0 1 1 1.06-1.06l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06l3-3H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </button>
                  <div className="mt-2 text-center flex flex-col gap-0.5 select-none">
                    <p className="text-[10px] text-slate-400">
                      Vizualizaci vám rovněž zašleme v plné kvalitě na e-mail.
                    </p>
                    <p className={`text-[11px] font-bold ${isLimitReached ? 'text-red-500' : 'text-slate-500'}`}>
                      {isLimitReached
                        ? 'Vyčerpali jste limit 5 vizualizací zdarma.'
                        : `Uživatelský limit: Zbývá vám ${remainingGenerations} z ${MAX_GENERATIONS} bezplatných pokusů.`}
                    </p>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* DEFAULT SCREEN: Initial placeholder state */
            <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center group">
              <div className="absolute w-[280px] h-[280px] rounded-full bg-slate-900/[0.02] blur-[80px] group-hover:bg-slate-900/[0.04] transition-all duration-1000"></div>

              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-800 mb-5 shadow-sm group-hover:scale-105 transition-all duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.096.813ZM19.5 5.25l-.45 2.55-2.55.45 2.55.45.45 2.55.45-2.55 2.55-.45-2.55-.45-.45-2.55ZM10.5 2.25l-.3.9-.9.3.9.3.3.9.3-.9.9-.3-.9-.3-.3-.9Z" />
                </svg>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 mb-1.5 tracking-tight">
                Zde uvidíte vaši AI vizualizaci
              </h3>
              <p className="text-slate-500 text-xs max-w-xs leading-relaxed mb-6">
                Nahrajte fotografii nebo vyberte vzorový pokoj vlevo.
              </p>

              {/* Čistý textový průvodce se šipkou dolů */}
              <p className="text-xs font-bold text-slate-400 select-none mt-2 tracking-wide animate-pulse">
                Nebo zvolte vzorový pokoj níže ↓
              </p>
            </div>
          )}

        </section>
      </main>

      {/* ================= TEXTURE CLOSE-UP ZOOM MODAL ================= */}
      {activeZoomTexture && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setActiveZoomTexture(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 flex flex-col scale-100 transition-all duration-300 max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button (Target min 44x44px for touch targets) */}
            <button
              onClick={() => setActiveZoomTexture(null)}
              aria-label="Zavřít detail"
              className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-slate-700 hover:text-black hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            {/* High-res Image preview from procedural canvas */}
            <div className="relative aspect-[4/3] w-full bg-slate-100 border-b border-slate-100 overflow-hidden flex items-center justify-center shadow-inner">
              <img
                src={activeZoomTexture.imageUrl || ''}
                alt={`Detail textury ${activeZoomTexture.name}`}
                className="w-full h-full object-cover"
              />
              {activeZoomTexture.badge && (
                <span className="absolute top-4 left-4 bg-black text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm select-none">
                  {activeZoomTexture.badge}
                </span>
              )}
            </div>

            {/* Info and action area */}
            <div className="p-6">
              <h3 className="text-lg font-black text-slate-900 leading-tight mb-1">
                {activeZoomTexture.name}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {activeZoomTexture.desc}
              </p>

              {/* Technical Specifications */}
              <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-50 rounded-xl p-3 border border-slate-100/60 text-left select-none">
                <div>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Materiál</span>
                  <span className="text-slate-800 text-xs font-bold">2D PVC Panel</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Vlastnosti</span>
                  <span className="text-slate-800 text-xs font-bold">100% voděodolné</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Instalace</span>
                  <span className="text-slate-800 text-xs font-bold">Lepidlem na zeď</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Akustika</span>
                  <span className="text-slate-800 text-xs font-bold">Velkoformát</span>
                </div>
              </div>

              {/* Choose from Modal button (Target min height 44px) */}
              <button
                onClick={() => {
                  selectTextureAndReset(activeZoomTexture.id);
                  setActiveZoomTexture(null);
                }}
                className="w-full h-11 bg-black hover:bg-neutral-900 active:scale-[0.98] text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Zvolit tuto texturu</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
