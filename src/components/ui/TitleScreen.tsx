import React, { useState, useEffect } from 'react';
// import { generateTitleScreenImage } from '../../../services/llmService'; // No longer used for images
import LoadingSpinner from '../LoadingSpinner'; 
import { diegoDebugGameState, diegoDebugSaveSlotKey, diegoDebugSavedGameMeta } from '../../debug/diegoSave';
import { SAVE_METADATA_KEY } from '../../constants';
import { SavedGameMeta } from '../../types';


interface TitleScreenProps {
  onNewGame: () => void;
  onLoadGame: () => void;
  // onShowNotification: (message: string, duration?: number) => void; // Not used currently
  gameVersion: string;
  onOpenSettings: () => void; 
}

const FALLBACK_IMAGE_URL = 'https://i.imgur.com/0sVeemx.jpeg'; // Default space background

const TitleScreen: React.FC<TitleScreenProps> = ({ onNewGame, onLoadGame, gameVersion, onOpenSettings }) => {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>(FALLBACK_IMAGE_URL);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false); // Default to false as we use fallback

  const handleCreateDebugSave = () => {
    try {
      localStorage.setItem(diegoDebugSaveSlotKey, JSON.stringify(diegoDebugGameState));
      
      let metasJson = localStorage.getItem(SAVE_METADATA_KEY);
      let metas: SavedGameMeta[] = [];
      if (metasJson) {
        try {
            metas = JSON.parse(metasJson) as SavedGameMeta[];
        } catch (e) {
            console.error("Failed to parse existing save metadata, initializing new list.", e);
            metas = [];
        }
      }
      
      const existingMetaIndex = metas.findIndex(m => m.slotKey === diegoDebugSaveSlotKey);
      const newMetaEntry = { ...diegoDebugSavedGameMeta, timestamp: Date.now(), saveDate: new Date().toLocaleString('pt-BR') };


      if (existingMetaIndex > -1) {
        metas[existingMetaIndex] = newMetaEntry;
      } else {
        metas.push(newMetaEntry);
      }
      metas.sort((a,b) => b.timestamp - a.timestamp);
      localStorage.setItem(SAVE_METADATA_KEY, JSON.stringify(metas));
      alert('Save de Debug "Diego Max" criado/atualizado! Por favor, recarregue o jogo (se necessário) e vá para "Carregar Jogo".');
    } catch (e) {
      console.error("Falha ao criar save de debug:", e);
      alert('Erro ao criar save de debug. Veja o console.');
    }
  };


  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center text-white relative transition-all duration-1000 ease-in-out bg-scanline"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-label="Tela Inicial do StarCraft: Explorando o Universo"
    >
      {isLoadingImage && ( // This might be true if you add a preloader for the fallback
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10">
          <LoadingSpinner message="Carregando ambiente cósmico..." size="lg" />
        </div>
      )}
      <div className={`text-center mb-10 md:mb-16 mt-8 md:mt-0 transition-opacity duration-1000 ${isLoadingImage ? 'opacity-0' : 'opacity-100 flex flex-col items-center'}`}>
        <div className="relative group">
          <div className="absolute inset-0 bg-sky-500/20 blur-[100px] rounded-full group-hover:bg-sky-500/30 transition-all duration-700"></div>
          <h1 
              className="relative text-8xl md:text-[10rem] font-bold tracking-[0.1em] text-white italic drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] leading-none glow-text-cyan"
              style={{ fontFamily: '"Oxanium", sans-serif' }}
              aria-label="StarCraft"
          >
              STAR<span className="text-sky-500">CRAFT</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="h-[1px] w-12 bg-gradient-to-l from-sky-500 to-transparent"></div>
          <p 
              className="text-xs md:text-sm font-technical text-sky-400 uppercase tracking-[0.5em] opacity-80"
              aria-label="Subtítulo: Explorando o Universo"
          >
              Explorando o Universo
          </p>
          <div className="h-[1px] w-12 bg-gradient-to-r from-sky-500 to-transparent"></div>
        </div>
      </div>

      <div 
        className={`glass-panel-heavy p-1 md:p-1 rounded-3xl shadow-2xl w-full max-w-sm border-white/5 transition-all duration-500 ${isLoadingImage ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        role="menu"
      >
        <div className="bg-slate-950/80 rounded-[1.4rem] p-8 md:p-10 border border-white/5 space-y-4">
          <button 
            onClick={onNewGame}
            className="w-full relative group overflow-hidden py-4 px-6 rounded-xl bg-sky-500 text-slate-950 font-display font-bold uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(14,165,233,0.3)]"
            role="menuitem"
            aria-disabled={isLoadingImage}
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[-20deg]"></div>
            Novo Jogo
          </button>
          
          <button 
            onClick={onLoadGame}
            className="w-full py-4 px-6 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 font-display font-bold uppercase tracking-widest text-xs transition-all hover:bg-slate-800 hover:border-sky-500/30 active:scale-[0.98]"
            role="menuitem"
            aria-disabled={isLoadingImage}
          >
            Carregar Jogo
          </button>

          <button 
            onClick={onOpenSettings} 
            className="w-full py-4 px-6 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 font-display font-bold uppercase tracking-widest text-xs transition-all hover:bg-slate-800 hover:border-sky-500/30 active:scale-[0.98]"
            role="menuitem"
            aria-disabled={isLoadingImage}
          >
            Configurações
          </button>
          
          <div className="pt-4 border-t border-slate-800 mt-2">
            <button
              onClick={handleCreateDebugSave}
              className="w-full py-3 px-6 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-500/60 font-technical uppercase tracking-widest text-[9px] transition-all hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/40"
              role="menuitem"
              aria-label="Criar ou atualizar save de depuração com recursos máximos para Diego"
            >
              Protocolo: Diego Max
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity">
        <p 
          className="text-[10px] font-technical uppercase tracking-[0.3em] text-slate-500"
          aria-label={`Versão do jogo: ${gameVersion}`}
        >
          Build Version {gameVersion} • Established 2248
        </p>
      </div>
    </div>
  );
};

export default TitleScreen;