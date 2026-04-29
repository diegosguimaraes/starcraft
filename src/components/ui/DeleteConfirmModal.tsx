
import React from 'react';
import Modal from '../Modal';// Path is correct if Modal.tsx is in src/components/

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, onConfirmDelete }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Protocolo de Exclusão">
      <div className="space-y-6 font-sans">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
           <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-500 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
           </div>
           <div className="flex flex-col">
              <span className="text-[10px] font-technical uppercase tracking-[0.4em] text-rose-500">Aviso Crítico</span>
              <p className="text-xs text-slate-300 font-display italic">A deleção de registros é irreversível e resultará em perda total de dados.</p>
           </div>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed px-2">
          Tem certeza que deseja deletar este registro de navegação? Todos os logs, créditos e progresso serão expurgados do mainframe central.
        </p>

        <div className="flex gap-3 justify-end pt-4">
          <button 
              onClick={onClose} 
              className="px-6 py-2 rounded-xl border border-slate-800 text-slate-500 font-technical uppercase tracking-widest text-[10px] hover:bg-slate-900 transition-all active:scale-95"
          >
              Abortar
          </button>
          <button 
              onClick={onConfirmDelete} 
              className="px-6 py-2 rounded-xl bg-rose-500 text-slate-950 font-display font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-rose-600 hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
          >
              Confirmar Purga
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;