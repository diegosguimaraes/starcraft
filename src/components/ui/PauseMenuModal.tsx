
import React from 'react';
import Modal from '../Modal'; // Path is correct if Modal.tsx is in src/components/

interface PauseMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReturnToGame: () => void;
  onQuickSave: () => void;
  onLoadGame: () => void;
  onOpenProfile: () => void;
  onMainMenu: () => void;
  onOpenSettings: () => void;
}

const PauseMenuModal: React.FC<PauseMenuModalProps> = ({
  isOpen,
  onClose,
  onReturnToGame,
  onQuickSave,
  onLoadGame,
  onOpenProfile,
  onMainMenu,
  onOpenSettings,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Terminal de Pausa">
      <div className="space-y-3">
        <button onClick={onReturnToGame} className="w-full flex items-center justify-between group py-4 px-6 rounded-xl bg-sky-500 text-slate-950 font-display font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
          <span>Continuar Simulação</span>
          <span className="opacity-50 text-[8px] font-technical group-hover:translate-x-1 transition-transform">RESUME_PROC</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={onQuickSave} className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900 border border-emerald-500/20 text-emerald-400 font-display font-bold uppercase tracking-widest text-[10px] transition-all hover:bg-emerald-500/10 hover:border-emerald-500/40 active:scale-95 group">
             <span className="mb-1">Quick Save</span>
             <span className="text-[7px] font-technical opacity-40 group-hover:opacity-100 uppercase tracking-tighter transition-opacity">Salvamento Instantâneo</span>
          </button>
          <button onClick={onLoadGame} className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900 border border-amber-500/20 text-amber-500 font-display font-bold uppercase tracking-widest text-[10px] transition-all hover:bg-amber-500/10 hover:border-amber-500/40 active:scale-95 group">
             <span className="mb-1">Load Status</span>
             <span className="text-[7px] font-technical opacity-40 group-hover:opacity-100 uppercase tracking-tighter transition-opacity">Restaurar Registro</span>
          </button>
        </div>

        <button onClick={onOpenProfile} className="w-full py-4 px-6 rounded-xl bg-slate-900 border border-purple-500/20 text-purple-400 font-display font-bold uppercase tracking-widest text-xs transition-all hover:bg-purple-500/10 hover:border-purple-500/40 active:scale-95 group flex items-center justify-between">
           <span>Dossiê do Tripulante</span>
           <span className="text-[8px] font-technical opacity-40 group-hover:opacity-100">BIO_DATA</span>
        </button>

        <button onClick={onOpenSettings} className="w-full py-4 px-6 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 font-display font-bold uppercase tracking-widest text-xs transition-all hover:bg-slate-800 hover:text-white hover:border-slate-500 active:scale-95 group flex items-center justify-between">
           <span>Parâmetros de Sistema</span>
           <span className="text-[8px] font-technical opacity-40 group-hover:opacity-100">CONFIG</span>
        </button>

        <button onClick={onMainMenu} className="w-full py-4 px-6 rounded-xl border border-rose-500/20 text-rose-500/70 font-display font-bold uppercase tracking-widest text-[10px] transition-all hover:bg-rose-500 hover:text-white hover:border-rose-500 active:scale-95 mt-6">
           Abortar Operação (Menu Principal)
        </button>
      </div>
    </Modal>
  );
};

export default PauseMenuModal;