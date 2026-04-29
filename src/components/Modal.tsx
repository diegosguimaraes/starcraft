
import React, { ReactNode, useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animationState, setAnimationState] = useState<'entering' | 'entered' | 'exiting' | 'exited'>(isOpen ? 'entered' : 'exited');

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setAnimationState('entering');
      const rafId = requestAnimationFrame(() => { // Use requestAnimationFrame for smoother start
        setAnimationState('entered');
      });
      return () => cancelAnimationFrame(rafId);
    } else {
      if (animationState === 'entered' || animationState === 'entering') { // Only animate out if it was open or opening
        setAnimationState('exiting');
        const timer = setTimeout(() => {
          setAnimationState('exited');
          setShouldRender(false);
        }, 300); // Duration matches Tailwind's duration-300
        return () => clearTimeout(timer);
      } else {
        // If already closing or closed, ensure it's not rendered
        if (animationState !== 'exited') setAnimationState('exited');
        if (shouldRender) setShouldRender(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // Removed animationState and shouldRender from deps as they are managed internally based on isOpen

  if (!shouldRender && animationState === 'exited') return null;

  const sizeClasses = {
    sm: 'max-w-sm mx-4',
    md: 'max-w-md mx-4',
    lg: 'max-w-lg mx-4',
    xl: 'max-w-xl mx-4',
    full: 'max-w-full mx-4', 
  };

  const backdropBaseClasses = "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out";
  const backdropAnimationClasses = (animationState === 'entered')
    ? 'bg-black/60 backdrop-blur-md opacity-100'
    : 'bg-black/0 backdrop-blur-none opacity-0 pointer-events-none';
  
  const panelBaseClasses = `glass-panel-heavy p-0 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col transform transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) border-white/10 group overflow-hidden`;
  const panelAnimationClasses = (animationState === 'entered')
    ? 'opacity-100 scale-100 translate-y-0 shadow-[0_0_40px_rgba(14,165,233,0.15)]'
    : 'opacity-0 scale-90 translate-y-12 pointer-events-none ring-0';


  return (
    <div 
      className={`${backdropBaseClasses} ${backdropAnimationClasses}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-hidden={animationState !== 'entered'}
      onMouseDown={onClose}
    >
      <div 
        className={`${panelBaseClasses} ${panelAnimationClasses}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Animated border highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-sky-500/50 to-transparent opacity-50"></div>
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-sky-500/20 to-transparent opacity-30"></div>
        
        {/* Corner Decorations */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-sky-500/20 rounded-tl-2xl pointer-events-none"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-sky-500/10 rounded-br-2xl pointer-events-none"></div>

        {title && (
          <div className="flex justify-between items-center px-10 py-8 border-b border-white/5 bg-slate-950/40 relative z-10">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse shadow-[0_0_10px_#0ea5e9]"></div>
                <h2 id="modal-title" className="text-3xl font-display font-black text-white italic tracking-tight uppercase leading-none">{title}</h2>
              </div>
              <span className="text-[9px] font-technical text-slate-500 uppercase tracking-[0.4em] ml-5">Protocolo de Visualização Ativo</span>
            </div>
            
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white transition-all p-3 rounded-full hover:bg-white/5 active:scale-95 group/close border border-white/5"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transition-transform group-hover/close:rotate-90">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="overflow-y-auto flex-grow custom-scrollbar px-10 py-8 relative z-10 bg-slate-950/20 bg-scanline">
          {children}
        </div>
         {!title && ( 
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-all p-3 rounded-full hover:bg-white/5 active:scale-95 z-[60] border border-white/5 backdrop-blur-md"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
         )}
      </div>
    </div>
  );
};

export default Modal;