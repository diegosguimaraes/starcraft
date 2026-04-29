
import React from 'react';
import { SpaceStation, GameView, PlayerState, FactionInfo } from '../../types';
import { ALL_FACTIONS_DATA } from '../../constants';
import { Icons } from '../../icons'; // Corrected path

interface StationDetailsViewProps {
  selectedStation: SpaceStation | null;
  onSetCurrentView: (view: GameView) => void;
  playerState: PlayerState | null;
  isAtWarWithOwningFaction: boolean;
  onOpenColonyMarket: (stationId: string) => void; 
  onBack: () => void; 
  onGenerateMission: (factionContextId?: string) => void; 
}

const StationDetailsView: React.FC<StationDetailsViewProps> = ({ 
    selectedStation, 
    onSetCurrentView, 
    playerState, 
    isAtWarWithOwningFaction,
    onOpenColonyMarket,
    onBack,
    onGenerateMission 
}) => {
  if (!selectedStation) return <div className="p-4 text-center text-gray-400">Nenhuma estação selecionada. Volte para a galáxia.</div>;

  const owningFactionInfo = ALL_FACTIONS_DATA.find(f => f.id === selectedStation.faction);
  const hasMarket = !!selectedStation.marketInventory && Object.keys(selectedStation.marketInventory).length > 0;

  const handleOpenMissionBoard = () => {
    if (selectedStation.faction) {
      onGenerateMission(selectedStation.faction); 
    } else {
      onGenerateMission(); 
    }
    onSetCurrentView('missions');
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex items-center gap-4">
        <button 
            onClick={onBack}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-white hover:border-slate-600 transition-all active:scale-95"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:-translate-x-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span className="text-[10px] font-technical uppercase tracking-widest">Retornar</span>
        </button>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Info Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative group overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl">
            {selectedStation.imageUrl ? (
              <img 
                src={selectedStation.imageUrl} 
                alt={selectedStation.name} 
                className="w-full aspect-video object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
            ) : (
              <div className="w-full aspect-video bg-slate-900 flex items-center justify-center">
                 <Icons.Colonies className="w-20 h-20 text-slate-800 animate-pulse" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
               <div className="flex items-center gap-3 mb-2">
                 <div className="px-2 py-1 bg-sky-500/20 border border-sky-500/30 rounded text-[9px] font-technical text-sky-400 uppercase tracking-widest">
                   Estação {selectedStation.stationType}
                 </div>
                 {owningFactionInfo && (
                    <div className="flex items-center gap-2 px-2 py-1 bg-slate-900/80 border border-white/5 rounded text-[9px] font-technical text-slate-400 uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                      Facção: {owningFactionInfo.name}
                    </div>
                 )}
               </div>
               <h2 className="text-5xl font-display font-black text-white italic tracking-tighter uppercase leading-none drop-shadow-2xl">{selectedStation.name}</h2>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[2rem] border-white/5">
             <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-8 bg-sky-500/50"></div>
                <h3 className="text-[10px] font-technical uppercase tracking-[0.4em] text-sky-500">Descrição Técnica da Instalação</h3>
             </div>
             <p className="text-lg text-slate-300 italic leading-relaxed font-display">"{selectedStation.description}"</p>
          </div>
        </div>

        {/* Sidebar / Services Column */}
        <div className="lg:col-span-4 space-y-6">
          {isAtWarWithOwningFaction && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-[2rem] text-rose-500 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                   <Icons.Combat className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-display font-black uppercase tracking-widest italic">Acesso Restrito</h4>
              </div>
              <p className="text-xs leading-relaxed opacity-80">Devido ao estado de guerra com a {(owningFactionInfo?.name || selectedStation.faction).toUpperCase()}, todos os protocolos de serviço foram suspensos para esta embarcação.</p>
            </div>
          )}

          <div className="glass-panel p-8 rounded-[2rem] border-white/5 flex flex-col gap-4">
            <h3 className="text-[10px] font-technical uppercase tracking-[0.4em] text-slate-500 mb-2">Protocolos de Serviço</h3>
            
            <div className="grid grid-cols-1 gap-3">
              {selectedStation.services.includes('shipyard') && (
                  <button 
                      onClick={() => onSetCurrentView('shipyard')}
                      className={`relative group flex items-center justify-between p-4 rounded-2xl transition-all border
                                  ${isAtWarWithOwningFaction || playerState?.isTraveling 
                                    ? 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed' 
                                    : 'bg-sky-500 text-slate-950 border-sky-400 hover:scale-[1.02] shadow-[0_0_20px_rgba(14,165,233,0.1)]'}`}
                      disabled={isAtWarWithOwningFaction || playerState?.isTraveling}
                  >
                      <div className="flex items-center gap-3">
                        <Icons.Shipyard className="w-5 h-5" />
                        <span className="text-xs font-display font-black uppercase tracking-widest">Estaleiro</span>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-950/20"></div>
                  </button>
              )}
              
              {selectedStation.services.includes('missions_hub') && (
                   <button 
                      onClick={handleOpenMissionBoard} 
                      className={`relative group flex items-center justify-between p-4 rounded-2xl transition-all border
                                  ${isAtWarWithOwningFaction || playerState?.isTraveling 
                                    ? 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed' 
                                    : 'bg-slate-900 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500 hover:scale-[1.02]'}`}
                      disabled={isAtWarWithOwningFaction || playerState?.isTraveling}
                  >
                      <div className="flex items-center gap-3">
                        <Icons.Mission className="w-5 h-5" />
                        <span className="text-xs font-display font-black uppercase tracking-widest">Métricas de Missão</span>
                      </div>
                      {!isAtWarWithOwningFaction && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_#6366f1]"></div>}
                  </button>
              )}

              {hasMarket && (
                   <button 
                      onClick={() => onOpenColonyMarket(selectedStation.id)}
                      className={`relative group flex items-center justify-between p-4 rounded-2xl transition-all border
                                  ${isAtWarWithOwningFaction || playerState?.isTraveling 
                                    ? 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed' 
                                    : 'bg-slate-900 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500 hover:scale-[1.02]'}`}
                      disabled={isAtWarWithOwningFaction || playerState?.isTraveling}
                  >
                      <div className="flex items-center gap-3">
                        <Icons.Inventory className="w-5 h-5" />
                        <span className="text-xs font-display font-black uppercase tracking-widest">Mercado Livre</span>
                      </div>
                      {!isAtWarWithOwningFaction && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>}
                  </button>
              )}

              {selectedStation.services.includes('research_lab') && (
                  <button
                      onClick={() => onSetCurrentView('researchLabView')}
                      className={`relative group flex items-center justify-between p-4 rounded-2xl transition-all border
                                  ${isAtWarWithOwningFaction || playerState?.isTraveling 
                                    ? 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed' 
                                    : 'bg-slate-900 border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:border-amber-500 hover:scale-[1.02]'}`}
                      disabled={isAtWarWithOwningFaction || playerState?.isTraveling}
                  >
                      <div className="flex items-center gap-3">
                        <Icons.ResearchLab className="w-5 h-5" />
                        <span className="text-xs font-display font-black uppercase tracking-widest">Lab de Dados</span>
                      </div>
                      {!isAtWarWithOwningFaction && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]"></div>}
                  </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationDetailsView;
