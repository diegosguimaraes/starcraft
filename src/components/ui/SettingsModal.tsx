
import React from 'react';
import Modal from '../Modal'; // Path is correct if Modal.tsx is in src/components/

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundMusicVolume: number;
  onBackgroundMusicVolumeChange: (volume: number) => void;
  playerStateExists: boolean; // To disable slider if no player state
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  backgroundMusicVolume,
  onBackgroundMusicVolumeChange,
  playerStateExists,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Parâmetros de Sistema" size="md">
      <div className="space-y-8 font-sans">
        <div className="relative p-6 rounded-2xl bg-slate-900 border border-white/5 overflow-hidden">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V5.25L21 2.25" />
                 </svg>
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-technical uppercase tracking-[0.4em] text-slate-500">Módulos Auditivos</span>
                 <h4 className="text-xl font-display font-black text-white italic tracking-tight uppercase leading-none">Mixagem de Áudio</h4>
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-end mb-1">
                <label htmlFor="musicVolume" className="text-[10px] font-technical uppercase tracking-widest text-sky-500">
                  Amplitude da Trilha Sonora
                </label>
                <span className="text-xs font-technical font-bold text-white">
                  {playerStateExists ? `${Math.round(backgroundMusicVolume * 100)}%` : 'OFFLINE'}
                </span>
              </div>
              <input
                type="range"
                id="musicVolume"
                min="0"
                max="1"
                step="0.01"
                value={playerStateExists ? backgroundMusicVolume : 0.2}
                onChange={(e) => playerStateExists && onBackgroundMusicVolumeChange(parseFloat(e.target.value))}
                className={`w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-500 border border-white/5 ${!playerStateExists ? 'opacity-30 cursor-not-allowed' : ''}`}
                disabled={!playerStateExists}
              />
              {!playerStateExists && (
                <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                   <p className="text-[9px] font-technical text-amber-500/70 uppercase tracking-widest">Sincronização pendente: Inicialize o núcleo do jogo</p>
                </div>
              )}
           </div>
        </div>

        <button
          onClick={onClose}
          className="w-full relative group overflow-hidden py-4 px-8 rounded-2xl bg-indigo-600 text-white font-display font-black uppercase tracking-[0.3em] text-xs transition-all hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
        >
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]"></div>
          Salvar Configurações
        </button>
      </div>
    </Modal>
  );
};

export default SettingsModal;