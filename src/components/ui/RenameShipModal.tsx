
import React from 'react';
import Modal from '../Modal'; // Path is correct if Modal.tsx is in src/components/

interface RenameShipModalProps {
  isOpen: boolean;
  currentName: string;
  renameInput: string;
  onRenameInputChange: (value: string) => void;
  onClose: () => void;
  onConfirmRename: () => void;
}

const RenameShipModal: React.FC<RenameShipModalProps> = ({ 
    isOpen, currentName, renameInput, onRenameInputChange, onClose, onConfirmRename 
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registro de Identificação">
      <div className="space-y-6 font-sans">
        <div className="relative group p-6 rounded-2xl bg-slate-900 border border-white/5 overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/50 to-transparent"></div>
           
           <div className="flex flex-col mb-4">
              <span className="text-[10px] font-technical uppercase tracking-[0.4em] text-slate-500 mb-1">Designação Atual</span>
              <h4 className="text-xl font-display font-black text-white italic tracking-tight uppercase leading-none opacity-40">{currentName}</h4>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-technical uppercase tracking-widest text-sky-500">Nova Identificação de Transponder</label>
              <input 
                type="text"
                value={renameInput}
                onChange={(e) => onRenameInputChange(e.target.value)}
                placeholder="Ex: VOID-RUNNER X"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-white font-display font-black uppercase tracking-widest placeholder:text-slate-700 transition-all outline-none"
              />
           </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button 
              onClick={onClose} 
              className="px-6 py-2 rounded-xl border border-slate-800 text-slate-500 font-technical uppercase tracking-widest text-[10px] hover:bg-slate-900 transition-all active:scale-95"
          >
              Cancelar
          </button>
          <button 
              onClick={onConfirmRename} 
              className="px-6 py-2 rounded-xl bg-sky-500 text-slate-950 font-display font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-sky-400 hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
          >
              Registrar Nome
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RenameShipModal;