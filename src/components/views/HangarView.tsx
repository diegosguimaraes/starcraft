
import React from 'react';
import { PlayerState, Ship } from '../../types';
import { Icons } from '../../icons'; // Corrected path
import { SHIP_HULLS } from '../../constants'; // Corrected path
import { calculateShipStats } from '../../utils'; // Corrected path
import LoadingSpinner from '../LoadingSpinner';

interface HangarViewProps {
  playerState: PlayerState | null;
  onSetCurrentShip: (shipId: string) => void;
  onOpenRenameModal: (shipId: string) => void;
}

const HangarView: React.FC<HangarViewProps> = ({ playerState, onSetCurrentShip, onOpenRenameModal }) => {
  if (!playerState) return <LoadingSpinner />;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-1 md:p-6 h-full">
      <div className="p-8 glass-panel rounded-3xl shadow-xl text-gray-200 min-h-full flex flex-col border-sky-500/10 relative overflow-hidden backdrop-blur-xl mb-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

        <div className="mb-8 pb-6 border-b border-slate-700/50">
          <h2 className="text-4xl font-display font-bold text-sky-400 tracking-tight glow-text-cyan uppercase italic">Baia do Hangar</h2>
          <p className="text-[10px] font-technical text-slate-500 uppercase tracking-[0.3em] mt-1">Inventário de Frotas Ativas • Capacidade: {playerState.ownedShips.length}</p>
        </div>

        <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {playerState.ownedShips.map(ship => {
                const hullData = SHIP_HULLS.find(h => h.id === ship.hullTypeId);
                const shipStats = calculateShipStats(ship); 
                const isActive = ship.id === playerState.currentShipId;
                return (
                    <div key={ship.id} className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group
                        ${isActive 
                            ? 'bg-sky-500/10 border-sky-500/50 shadow-[0_0_20px_rgba(14,165,233,0.1)]' 
                            : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'}`}>
                        
                        {isActive && (
                            <div className="absolute top-0 right-0 p-4">
                                <span className="text-[8px] font-display font-bold bg-sky-500 text-slate-900 px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_10px_#0ea5e9]">Nave de Comando</span>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className={`text-2xl font-display font-black uppercase tracking-tight italic ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>{ship.name}</h3>
                                    <span className="text-[10px] font-technical text-slate-500 uppercase tracking-widest">({hullData?.name})</span>
                                </div>
                                <div className="h-0.5 w-16 bg-gradient-to-r from-sky-500 to-transparent mb-6"></div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/50 flex flex-col gap-1">
                                      <span className="text-[8px] font-technical text-slate-500 uppercase tracking-widest">Carga Máxima</span>
                                      <div className="flex items-center text-xs font-display font-bold text-sky-400">
                                        <Icons.Cargo className="w-3 h-3 mr-2 opacity-50" />
                                        {shipStats.totalCargoCapacity} <span className="text-[8px] ml-1 text-slate-600">UNIT</span>
                                      </div>
                                    </div>
                                    <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/50 flex flex-col gap-1">
                                      <span className="text-[8px] font-technical text-slate-500 uppercase tracking-widest">Impulsão</span>
                                      <div className="flex items-center text-xs font-display font-bold text-amber-400">
                                        <Icons.Speed className="w-3 h-3 mr-2 opacity-50" />
                                        {shipStats.totalSpeed} <span className="text-[8px] ml-1 text-slate-600">LY/H</span>
                                      </div>
                                    </div>
                                    <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/50 flex flex-col gap-1">
                                      <span className="text-[8px] font-technical text-slate-500 uppercase tracking-widest">Defesa de Escudo</span>
                                      <div className="flex items-center text-xs font-display font-bold text-blue-400">
                                        <Icons.Shield className="w-3 h-3 mr-2 opacity-50" />
                                        {shipStats.totalShieldStrength} <span className="text-[8px] ml-1 text-slate-600">MW</span>
                                      </div>
                                    </div>
                                    <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/50 flex flex-col gap-1">
                                      <span className="text-[8px] font-technical text-slate-500 uppercase tracking-widest">Integridade</span>
                                      <div className="flex items-center text-xs font-display font-bold text-emerald-400">
                                        <Icons.Hull className="w-3 h-3 mr-2 opacity-50" />
                                        {shipStats.totalHullIntegrity} <span className="text-[8px] ml-1 text-slate-600">HP</span>
                                      </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
                                {!isActive && (
                                    <button 
                                        onClick={() => onSetCurrentShip(ship.id)} 
                                        className="flex-1 btn-scifi-primary py-3 px-6 text-[10px] uppercase tracking-widest"
                                    >
                                        Ativar Nave
                                    </button>
                                )}
                                <button 
                                    onClick={() => onOpenRenameModal(ship.id)} 
                                    className="flex-1 btn-scifi py-3 px-6 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                                >
                                    <Icons.Rename className="w-4 h-4" />
                                    Renomear
                                </button>
                            </div>
                        </div>

                        <div className="mt-2 pt-4 border-t border-slate-800/50">
                            <h4 className="text-[9px] font-display font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Configuração de Módulos ({ship.modules.filter(m=>m).length}/{ship.maxModuleSlots})</h4>
                            <div className="flex flex-wrap gap-2">
                                {ship.modules.map((mod, idx) => mod ? (
                                    <div key={`${mod.id}-equipped-${idx}`} className="flex items-center px-4 py-1.5 bg-slate-950/80 border border-slate-800 rounded-full">
                                      <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mr-2 shadow-[0_0_5px_#0ea5e9]"></div>
                                      <span className="text-[9px] font-mono text-slate-300 uppercase">{mod.name}</span>
                                    </div>
                                ) : null)}
                                {ship.modules.filter(m=>m).length === 0 && (
                                  <span className="text-[9px] font-technical text-slate-600 uppercase tracking-widest italic">Nenhum módulo auxiliar instalado</span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default HangarView;
