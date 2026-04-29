
import React from 'react';
import { SpaceStation, GameView, PlayerState, FactionInfo } from '../../types';
import { ALL_FACTIONS_DATA } from '../../constants';
import { Icons } from '../../icons';

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
    <div className="flex-1 overflow-y-auto custom-scrollbar p-1 md:p-6 h-full">
        <div className="p-8 glass-panel rounded-3xl shadow-2xl text-gray-200 relative overflow-hidden backdrop-blur-xl border-sky-500/10 mb-4 min-h-full flex flex-col items-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        
        <button 
            onClick={onBack}
            className="group relative z-20 flex items-center bg-slate-900/60 hover:bg-sky-500/20 text-slate-400 hover:text-sky-400 font-technical text-[10px] uppercase tracking-widest py-2 px-4 rounded-xl border border-slate-700/50 hover:border-sky-500/50 transition-all duration-300"
            aria-label="Voltar"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 mr-2 transition-transform group-hover:-translate-x-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Retornar
        </button>

        <div className="mt-8 flex flex-col items-center">
            <div className="mb-8 w-full max-w-4xl relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 via-sky-500/40 to-sky-500/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                {selectedStation.imageUrl ? (
                  <img 
                    src={selectedStation.imageUrl} 
                    alt={selectedStation.name} 
                    className="relative rounded-2xl shadow-2xl w-full h-48 md:h-80 object-cover border border-slate-700/50 grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
                  />
                ) : (
                  <div className="relative w-full h-48 md:h-80 bg-slate-900/80 rounded-2xl border border-slate-700/50 flex items-center justify-center">
                    <Icons.System className="w-20 h-20 text-slate-800 animate-pulse-slow" />
                  </div>
                )}
                <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 z-10">
                  <div>
                    <span className="text-[10px] font-technical text-sky-400 uppercase tracking-[0.4em] mb-1 block glow-text-cyan">Posto Avançado Ativo</span>
                    <h2 className="text-4xl md:text-5xl font-display font-black text-white italic tracking-tighter uppercase">{selectedStation.name}</h2>
                  </div>
                  <div className="glass-panel px-4 py-2 rounded-xl border-sky-500/30 flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
                    <span className="text-[10px] font-technical uppercase text-slate-300 tracking-widest">Sistemas Operacionais</span>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent rounded-b-2xl"></div>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-panel-heavy p-8 rounded-3xl border-slate-700/50 bg-slate-900/20">
                  <h3 className="text-xs font-display font-bold text-white uppercase tracking-widest mb-4 flex items-center">
                    <div className="w-1 h-3 bg-sky-500 mr-2"></div>
                    Descrição da Estação
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{selectedStation.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                      <span className="block text-[8px] font-technical text-slate-500 uppercase tracking-widest mb-1">Classificação</span>
                      <div className="text-xs font-display font-bold text-sky-100 uppercase tracking-wide">
                        Estação {selectedStation.stationType}
                      </div>
                    </div>
                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                      <span className="block text-[8px] font-technical text-slate-500 uppercase tracking-widest mb-1">Soberania Local</span>
                      <div className={`text-xs font-display font-bold uppercase tracking-wide ${owningFactionInfo?.colorClass.split(' ')[3] || 'text-slate-100'}`}>
                        {owningFactionInfo?.name || selectedStation.faction}
                      </div>
                    </div>
                  </div>
                </div>

                {isAtWarWithOwningFaction && (
                  <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start space-x-4 animate-in fade-in slide-in-from-top-2">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-rose-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.34c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-display font-black text-rose-500 uppercase tracking-widest mb-1">PROTOCOLO DE HOSTILIDADE ATIVADO</h4>
                      <p className="text-xs text-rose-400 opacity-80 leading-relaxed">Sua reputação com a {owningFactionInfo?.name || selectedStation.faction} atingiu níveis críticos. Todos os serviços comerciais e laboratoriais foram suspensos indefinidamente nesta unidade.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-display font-bold text-white uppercase tracking-widest pl-2 flex items-center">
                  <div className="w-1 h-3 bg-sky-500 mr-2"></div>
                  Integração de Serviços
                </h3>
                
                <div className="flex flex-col gap-3">
                  {selectedStation.services.includes('shipyard') && (
                      <button 
                          onClick={() => onSetCurrentView('shipyard')}
                          className={`btn-scifi group p-4 flex items-center gap-4 transition-all
                                      ${isAtWarWithOwningFaction || playerState?.isTraveling ? 'opacity-30 cursor-not-allowed bg-slate-900 border-slate-800' : 'bg-blue-500/5 border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/10'}`}
                          disabled={isAtWarWithOwningFaction || playerState?.isTraveling}
                      >
                          <div className={`p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform`}>
                            <Icons.Shipyard className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <span className="block text-[10px] font-display font-bold text-white uppercase tracking-wider">Hangar do Estaleiro</span>
                            <span className="block text-[8px] font-technical text-slate-500 uppercase tracking-widest">Ajustes e Reparos</span>
                          </div>
                      </button>
                  )}
                  
                  {selectedStation.services.includes('missions_hub') && (
                       <button 
                          onClick={handleOpenMissionBoard} 
                          className={`btn-scifi group p-4 flex items-center gap-4 transition-all
                                      ${isAtWarWithOwningFaction || playerState?.isTraveling ? 'opacity-30 cursor-not-allowed bg-slate-900 border-slate-800' : 'bg-purple-500/5 border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/10'}`}
                          disabled={isAtWarWithOwningFaction || playerState?.isTraveling}
                      >
                          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                            <Icons.Mission className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <span className="block text-[10px] font-display font-bold text-white uppercase tracking-wider">Terminal de Contratos</span>
                            <span className="block text-[8px] font-technical text-slate-500 uppercase tracking-widest">Protocolos de Missão</span>
                          </div>
                      </button>
                  )}

                  {hasMarket && (
                       <button 
                          onClick={() => onOpenColonyMarket(selectedStation.id)}
                          className={`btn-scifi group p-4 flex items-center gap-4 transition-all
                                      ${isAtWarWithOwningFaction || playerState?.isTraveling ? 'opacity-30 cursor-not-allowed bg-slate-900 border-slate-800' : 'bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10'}`}
                          disabled={isAtWarWithOwningFaction || playerState?.isTraveling}
                      >
                          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                            <Icons.Inventory className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <span className="block text-[10px] font-display font-bold text-white uppercase tracking-wider">Mercado Setorial</span>
                            <span className="block text-[8px] font-technical text-slate-500 uppercase tracking-widest">Troca de Cargas</span>
                          </div>
                      </button>
                  )}

                  {selectedStation.services.includes('research_lab') && (
                      <button
                          onClick={() => onSetCurrentView('researchLabView')}
                          className={`btn-scifi group p-4 flex items-center gap-4 transition-all
                                      ${isAtWarWithOwningFaction || playerState?.isTraveling ? 'opacity-30 cursor-not-allowed bg-slate-900 border-slate-800' : 'bg-teal-500/5 border-teal-500/30 hover:border-teal-500/60 hover:bg-teal-500/10'}`}
                          disabled={isAtWarWithOwningFaction || playerState?.isTraveling}
                      >
                          <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400 group-hover:scale-110 transition-transform">
                            <Icons.ResearchLab className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <span className="block text-[10px] font-display font-bold text-white uppercase tracking-wider">Lab de Protótipos</span>
                            <span className="block text-[8px] font-technical text-slate-500 uppercase tracking-widest">Análise de Dados</span>
                          </div>
                      </button>
                  )}
                </div>
              </div>
            </div>
        </div>
    </div>
  </div>
  );
};

export default StationDetailsView;