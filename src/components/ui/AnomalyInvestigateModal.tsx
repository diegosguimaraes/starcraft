
import React from 'react';
import Modal from '../Modal'; // Path is correct if Modal.tsx is in src/components/
import { AnomalyEvent } from '../../types';

interface AnomalyInvestigateModalProps {
  isOpen: boolean;
  anomalyEvent: AnomalyEvent | null;
  onClose: () => void;
  onInvestigate: () => void;
}

const AnomalyInvestigateModal: React.FC<AnomalyInvestigateModalProps> = ({ isOpen, anomalyEvent, onClose, onInvestigate }) => {
  if (!isOpen || !anomalyEvent) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sinal Não Identificado">
      <div className="space-y-6 font-sans">
        <div className="relative group overflow-hidden rounded-2xl bg-slate-900 border border-white/5 p-8">
           <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] -translate-y-1/2 translate-x-1/2"></div>
           
           <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-amber-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                 </svg>
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-technical uppercase tracking-[0.4em] text-amber-500/70">Alerta de Proximidade</span>
                 <h4 className="text-xl font-display font-black text-white italic tracking-tight uppercase leading-none">Anomalia Estelar</h4>
              </div>
           </div>

           <p className="text-lg text-slate-300 italic leading-relaxed font-display border-l-2 border-amber-500/30 pl-6 py-2 mb-4">
             "{anomalyEvent.description}"
           </p>
           
           <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none">
             Sensores detectam assinaturas energéticas instáveis. Proceder com cautela extrema.
           </p>
        </div>

        <div className="flex gap-3">
          <button 
              onClick={onInvestigate} 
              className="flex-1 group relative overflow-hidden py-4 px-6 rounded-xl bg-amber-500 text-slate-950 font-display font-black uppercase tracking-[0.2em] text-xs transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
          >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]"></div>
              Iniciar Investigação
          </button>
          <button 
              onClick={onClose}
              className="px-6 rounded-xl border border-slate-800 text-slate-500 font-technical uppercase tracking-widest text-[10px] hover:bg-slate-900 transition-all active:scale-95"
          >
              Ignorar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AnomalyInvestigateModal;