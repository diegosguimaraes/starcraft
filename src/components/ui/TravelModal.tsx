
import React from 'react';
import Modal from '../Modal'; // Path is correct if Modal.tsx is in src/components/
import LoadingSpinner from '../LoadingSpinner';
import { TravelDetails, Planet, SpaceStation, StarSystem } from '../../types';
import { Icons } from '../../icons';

interface TravelModalProps {
  isOpen: boolean;
  travelDetails: TravelDetails | null;
  gameTick: number;
  discoveredPlanets: Planet[];
  discoveredStations: SpaceStation[];
  starSystems: StarSystem[];
}

const TravelModal: React.FC<TravelModalProps> = ({ 
    isOpen, travelDetails, gameTick, discoveredPlanets, discoveredStations, starSystems 
}) => {
  if (!isOpen || !travelDetails) return null;

  const { destinationId, destinationType, arrivalTick, travelTicksTotal } = travelDetails;
  const ticksRemaining = Math.max(0, arrivalTick - gameTick);
  const progressPercent = travelTicksTotal > 0 ? Math.min(100, ((travelTicksTotal - ticksRemaining) / travelTicksTotal) * 100) : 100;

  let destinationName = destinationId;
    if (destinationType === 'planet') {
        destinationName = discoveredPlanets.find(p => p.id === destinationId)?.name || destinationId;
    } else if (destinationType === 'station') {
        destinationName = discoveredStations.find(s => s.id === destinationId)?.name || destinationId;
    } else if (destinationType === 'system') {
        destinationName = starSystems.find(s => s.id === destinationId)?.name || destinationId;
    }

  return (
    <Modal isOpen={true} onClose={() => { /* Cannot be closed by user */ }} title="Salto Hiperespacial em Curso">
      <div className="flex flex-col items-center justify-center text-center space-y-8 font-sans">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-sky-500/10 border-t-sky-500 animate-spin shadow-[0_0_20px_rgba(14,165,233,0.2)]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center shadow-inner">
                <Icons.Travel className="w-6 h-6 text-sky-500 animate-pulse" />
             </div>
          </div>
        </div>

        <div className="space-y-4 w-full">
          <div>
            <span className="text-[10px] font-technical uppercase tracking-[0.4em] text-slate-500 block mb-2">Coordenadas de Destino</span>
            <h3 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase">{destinationName}</h3>
            <span className="text-[9px] font-technical text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 uppercase tracking-widest mt-1 inline-block">
               Vector: {destinationType}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[9px] font-technical uppercase tracking-widest text-slate-500">
               <span>Estabilização de Motor</span>
               <span className="text-sky-400">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-slate-900/80 rounded-full h-2 relative overflow-hidden border border-white/5 p-[1px]">
              <div 
                className="bg-gradient-to-r from-sky-600 via-sky-400 to-sky-300 h-full rounded-full transition-all duration-1000 ease-linear shadow-[0_0_10px_#0ea5e9]" 
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute top-0 right-0 w-8 h-full bg-white/30 blur-sm animate-[pulse_1s_infinite]"></div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[9px] font-technical uppercase tracking-widest text-slate-500">
               <span>TICKS-REM: {ticksRemaining}</span>
               <span>AUTO_NAV_ACTIVE</span>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col items-center gap-2 opacity-60">
           <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '200ms' }}></div>
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '400ms' }}></div>
           </div>
           <span className="text-[8px] font-technical uppercase tracking-[0.5em] text-emerald-400 ml-2">Propulsores em Regime Nominal</span>
        </div>
      </div>
    </Modal>
  );
};

export default TravelModal;
