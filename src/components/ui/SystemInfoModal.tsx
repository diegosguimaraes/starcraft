
import React from 'react';
import Modal from '../Modal'; // Path is correct if Modal.tsx is in src/components/
import { StarSystem, PlayerState, Planet, SpaceStation, DestinationType } from '../../types';
import { Icons } from '../../icons';
import { SCAN_SYSTEM_COST_CREDITS, TRAVEL_BASE_CREDIT_COST } from '../../constants'; 

interface SystemInfoModalProps {
  isOpen: boolean;
  systemInfo: StarSystem | null;
  playerState: PlayerState | null;
  discoveredPlanets: Planet[];
  discoveredStations: SpaceStation[];
  isLoading: boolean;
  onClose: () => void;
  onScanSystem: (system: StarSystem) => void;
  onTravelToSystem: (id: string, type: DestinationType) => void;
}

const SystemInfoModal: React.FC<SystemInfoModalProps> = ({
  isOpen,
  systemInfo,
  playerState,
  discoveredPlanets,
  discoveredStations,
  isLoading,
  onClose,
  onScanSystem,
  onTravelToSystem,
}) => {
  if (!isOpen || !systemInfo) return null;

  const isKnown = playerState?.knownSystemIds.includes(systemInfo.id);
  const planetsInSelectedSystem = discoveredPlanets.filter(p => p.systemId === systemInfo.id);
  const stationsInSelectedSystem = discoveredStations.filter(s => s.systemId === systemInfo.id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Exploração de Sistema: ${systemInfo.name}`} size="lg">
      <div className="space-y-6">
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-technical uppercase tracking-[0.2em] text-slate-500">Jurisdição de Facção</span>
            <span className="text-sm font-display font-bold text-sky-400 italic uppercase">{systemInfo.faction}</span>
          </div>
          <div>
            <span className="text-[10px] font-technical uppercase tracking-[0.2em] text-slate-500 block mb-2">Relatório de Inteligência</span>
            <p className="text-sm text-slate-400 italic leading-relaxed">"{systemInfo.description}"</p>
          </div>
        </div>
        
        {isKnown && (planetsInSelectedSystem.length > 0 || stationsInSelectedSystem.length > 0) ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></div>
              <h4 className="text-[10px] font-technical uppercase tracking-[0.3em] text-sky-400">Pontos de Interesse Identificados</h4>
            </div>
            
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {planetsInSelectedSystem.map(p => (
                <button 
                  key={p.id}
                  onClick={() => onTravelToSystem(p.id, 'planet')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/30 group transition-all"
                  disabled={playerState?.isTraveling || isLoading}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-slate-800 group-hover:border-sky-500/20">
                      <Icons.Planet className="w-4 h-4 text-sky-400/70" />
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-display font-bold text-white group-hover:text-sky-400 transition-colors uppercase italic">{p.name}</span>
                      <span className="block text-[8px] font-technical text-slate-600 uppercase tracking-widest">{p.biome} • Planeta Habidável</span>
                    </div>
                  </div>
                  <Icons.Travel className="w-3 h-3 text-slate-700 group-hover:text-sky-500 transition-colors" />
                </button>
              ))}
              {stationsInSelectedSystem.map(s => (
                <button 
                  key={s.id}
                  onClick={() => onTravelToSystem(s.id, 'station')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/30 group transition-all"
                  disabled={playerState?.isTraveling || isLoading}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-slate-800 group-hover:border-indigo-500/20">
                      <Icons.Colonies className="w-4 h-4 text-indigo-400/70" />
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-display font-bold text-white group-hover:text-indigo-400 transition-colors uppercase italic">{s.name}</span>
                      <span className="block text-[8px] font-technical text-slate-600 uppercase tracking-widest">Estalação Orbital • Estação Espacial</span>
                    </div>
                  </div>
                  <Icons.Travel className="w-3 h-3 text-slate-700 group-hover:text-indigo-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ) : isKnown ? (
          <div className="py-8 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-center opacity-40">
             <p className="text-[10px] font-technical uppercase tracking-[0.3em] italic">Nenhum dado tangível de superfície detectado</p>
          </div>
        ) : null}

        <div className="space-y-3 pt-4 border-t border-white/5">
          {!isKnown && (
            <button 
              onClick={() => onScanSystem(systemInfo)}
              className="w-full group relative overflow-hidden py-4 px-6 rounded-xl bg-emerald-500 text-slate-950 font-display font-bold uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              disabled={isLoading || (playerState && playerState.credits < SCAN_SYSTEM_COST_CREDITS) || playerState?.isTraveling}
            >
              <div className="flex items-center justify-center gap-3 relative z-10">
                <Icons.ScanSystem className="w-4 h-4" />
                Sincronizar Dados do Sistema ({SCAN_SYSTEM_COST_CREDITS} CR)
              </div>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]"></div>
            </button>
          )}
          <button 
              onClick={() => onTravelToSystem(systemInfo.id, 'system')}
              className={`w-full py-4 px-6 rounded-xl font-display font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 
                ${playerState?.currentSystemId === systemInfo.id ? 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50' : 'bg-slate-900 border border-sky-500/30 text-sky-400 hover:bg-sky-500/10 hover:border-sky-500 active:scale-95'}`}
              disabled={isLoading || (playerState && playerState.credits < TRAVEL_BASE_CREDIT_COST) || playerState?.isTraveling || playerState?.currentSystemId === systemInfo.id}
          >
              <Icons.Travel className="w-4 h-4" />
              {playerState?.currentSystemId === systemInfo.id ? 'Nave em Órbita Local' : `Iniciar Salto Hiperespacial (${TRAVEL_BASE_CREDIT_COST} CR)`}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SystemInfoModal;