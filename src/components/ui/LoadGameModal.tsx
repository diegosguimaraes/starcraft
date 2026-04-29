
import React from 'react';
import Modal from '../Modal'; // Path is correct if Modal.tsx is in src/components/
import { SavedGameMeta } from '../../types';
import { Icons } from '../../icons';

interface LoadGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedGamesMeta: SavedGameMeta[];
  onLoadGame: (slotKey: string) => void;
  onDeleteGame: (slotKey: string) => void;
  onSaveNewSlot: () => void;
}

const LoadGameModal: React.FC<LoadGameModalProps> = ({
  isOpen,
  onClose,
  savedGamesMeta,
  onLoadGame,
  onDeleteGame,
  onSaveNewSlot,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registros de Memória" size="lg">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {savedGamesMeta.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center opacity-30 text-center">
            <div className="w-16 h-16 border border-slate-700 rounded-full flex items-center justify-center mb-4">
              <Icons.Inventory className="w-8 h-8" />
            </div>
            <p className="text-xs font-technical uppercase tracking-[0.3em] font-bold">Nenhum registro encontrado</p>
          </div>
        ) : (
          savedGamesMeta.map(meta => (
            <div key={meta.slotKey} className="group p-5 bg-slate-900 border border-white/5 rounded-2xl hover:border-sky-500/30 transition-all flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-sky-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-display font-black text-white italic tracking-wide group-hover:text-sky-400 transition-colors uppercase">{meta.characterName}</p>
                  <span className="text-[9px] font-technical text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 uppercase tracking-widest">{meta.currentShipName}</span>
                </div>
                <div className="flex items-center text-[10px] text-slate-500 font-technical uppercase tracking-widest">
                  <span className={meta.isQuickSave ? 'text-emerald-500/70 mr-2' : 'mr-2'}>
                    {meta.isQuickSave ? "[Q-SAVE]" : "[MANUAL]"}
                  </span>
                  <span className="opacity-40">•</span>
                  <span className="ml-2 italic">{meta.saveDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <button 
                  onClick={() => onLoadGame(meta.slotKey)} 
                  className="py-2.5 px-6 rounded-xl bg-sky-500/10 border border-sky-500/40 text-sky-400 font-display font-bold uppercase tracking-widest text-[10px] hover:bg-sky-500 hover:text-slate-950 transition-all shadow-[0_0_15px_rgba(14,165,233,0)] hover:shadow-[0_0_15px_rgba(14,165,233,0.3)] active:scale-95"
                >
                  Restaurar
                </button>
                <button 
                  onClick={() => onDeleteGame(meta.slotKey)} 
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800 text-rose-500/50 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/40 transition-all active:scale-90"
                  aria-label="Excluir Registro"
                >
                  <Icons.Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 pt-8 border-t border-white/5">
        <button 
            onClick={onSaveNewSlot} 
            className="w-full relative group overflow-hidden py-4 px-8 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 font-display font-bold uppercase tracking-[0.3em] text-[10px] transition-all hover:bg-slate-800 hover:text-white hover:border-slate-600 active:scale-95"
        >
            <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]"></div>
            Criar Novo Registro de Estado Manual
        </button>
      </div>
    </Modal>
  );
};

export default LoadGameModal;