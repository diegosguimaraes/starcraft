
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
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4', // Ensure some margin for full-width modal on small screens
  };

  const backdropBaseClasses = "fixed inset-0 z-50 flex items-center justify-center bg-black p-4 transition-opacity duration-300 ease-out";
  const backdropAnimationClasses = (animationState === 'entered')
    ? 'bg-opacity-75 backdrop-blur-sm opacity-100'
    : 'bg-opacity-0 opacity-0 pointer-events-none'; // pointer-events-none when not fully visible
  
  const panelBaseClasses = `bg-gray-800 text-gray-100 p-6 rounded-lg shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out`;
  const panelAnimationClasses = (animationState === 'entered')
    ? 'opacity-100 scale-100'
    : 'opacity-0 scale-95 pointer-events-none'; // pointer-events-none when not fully visible


  return (
    <div 
      className={`${backdropBaseClasses} ${backdropAnimationClasses}`}
      onClick={onClose} // Click on backdrop closes modal
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-hidden={animationState !== 'entered'} // Corrected aria-hidden
    >
      <div 
        className={`${panelBaseClasses} ${panelAnimationClasses}`}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside panel from closing modal
      >
        {title && (
          <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
            <h2 id="modal-title" className="text-2xl font-semibold text-cyan-400">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="overflow-y-auto flex-grow custom-scrollbar">
          {children}
        </div>
         {!title && ( // This close button might be redundant if onClose is on backdrop, but keeping as per original structure
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
         )}
      </div>
    </div>
  );
};

export default Modal;
