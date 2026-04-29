
import React from 'react';
import { PlayerState, FactionInfo, DiplomaticStatus, DiplomaticAction, TreatyType, ActiveTreaty } from '../../types';
import { BASIC_DIPLOMATIC_ACTIONS, ALL_FACTIONS_DATA } from '../../constants'; // Corrected path
import LoadingSpinner from '../LoadingSpinner';
import { Icons } from '../../icons'; // Corrected path

interface DiplomacyViewProps {
  playerState: PlayerState | null;
  allFactions: FactionInfo[];
  getDiplomaticStatus: (reputation: number) => DiplomaticStatus;
  onPerformAction: (factionId: string, actionId: string) => void;
  selectedFaction: FactionInfo | null;
  onSelectFaction: (faction: FactionInfo | null) => void;
  isLoading: boolean;
  gameTickCounter: number;
}

const DiplomacyView: React.FC<DiplomacyViewProps> = ({
  playerState,
  allFactions,
  getDiplomaticStatus,
  onPerformAction,
  selectedFaction,
  onSelectFaction,
  isLoading,
  gameTickCounter,
}) => {
  if (!playerState) return <LoadingSpinner message="Carregando dados diplomáticos..." />;

  const getStatusColor = (status: DiplomaticStatus): string => {
    switch (status) {
      case DiplomaticStatus.War: return 'text-red-400';
      case DiplomaticStatus.Hostile: return 'text-orange-400';
      case DiplomaticStatus.Neutral: return 'text-yellow-300';
      case DiplomaticStatus.Friendly: return 'text-green-400';
      case DiplomaticStatus.Alliance: return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  const getActiveTreatiesWithFaction = (factionId: string): ActiveTreaty[] => {
    return playerState.activeTreaties.filter(treaty => treaty.factionId === factionId);
  };

  const availableActions = selectedFaction ? BASIC_DIPLOMATIC_ACTIONS.filter(action => {
      const currentReputation = playerState.factionReputations[selectedFaction.id] || 0;
      const currentStatus = getDiplomaticStatus(currentReputation);
      if (action.requiresStatus && !action.requiresStatus.includes(currentStatus)) return false;
      if (action.unavailableIfStatus && action.unavailableIfStatus.includes(currentStatus)) return false;
      if (action.requiresNoActiveTreatyOfType) {
          const existingTreaty = playerState.activeTreaties.find(
              t => t.factionId === selectedFaction.id && t.type === action.requiresNoActiveTreatyOfType
          );
          if (existingTreaty) return false;
      }
      return true;
  }) : [];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-1 md:p-6 h-full">
      <div className="p-8 glass-panel rounded-3xl shadow-xl text-gray-200 min-h-full flex flex-col border-sky-500/10 relative overflow-hidden backdrop-blur-xl mb-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

        <div className="mb-8 pb-6 border-b border-slate-700/50">
          <h2 className="text-4xl font-display font-bold text-sky-400 tracking-tight glow-text-cyan uppercase italic flex items-center">
            <Icons.Diplomacy className="w-10 h-10 mr-4 text-sky-500" />
            Relações Diplomáticas
          </h2>
          <p className="text-[10px] font-technical text-slate-500 uppercase tracking-[0.3em] mt-1 ml-14">Intercâmbio de Protocolos Interestelares • Ciclo: {gameTickCounter}</p>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 gap-8 overflow-hidden min-h-0">
          {/* Lista de Facções */}
          <div className="w-full lg:w-1/3 flex flex-col space-y-4">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-widest pl-4 flex items-center">
              <div className="w-1 h-3 bg-sky-500 mr-2"></div>
              Entidades Conhecidas
            </h3>
            <div className="flex-grow space-y-3 overflow-y-auto pr-2 custom-scrollbar max-h-[300px] lg:max-h-none">
            {allFactions.map(faction => {
              const reputation = playerState.factionReputations[faction.id] || 0;
              const status = getDiplomaticStatus(reputation);
              const colorBase = faction.colorClass.split(' ')[3]?.replace('text-', '') || 'slate';

              return (
                <button
                  key={faction.id}
                  onClick={() => onSelectFaction(faction)}
                  className={`w-full group p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden
                    ${selectedFaction?.id === faction.id
                        ? `bg-slate-900/60 border-${colorBase}-500/50 shadow-[0_0_20px_rgba(var(--color-${colorBase}-500),0.1)]`
                        : `bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40`}
                  `}
                  aria-pressed={selectedFaction?.id === faction.id}
                >
                  {selectedFaction?.id === faction.id && (
                    <div className={`absolute left-0 top-0 w-1 h-full bg-${colorBase}-500 shadow-[0_0_10px_#${colorBase}]`}></div>
                  )}
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`text-sm font-display font-bold uppercase tracking-wide group-hover:text-white transition-colors ${selectedFaction?.id === faction.id ? 'text-white' : 'text-slate-300'}`}>
                        {faction.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-[8px] font-technical uppercase tracking-tighter px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-800 ${getStatusColor(status).replace('text-', 'text- opacity-100')}`}>
                          {status}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">REP: {reputation.toFixed(0)}</span>
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${status === DiplomaticStatus.War ? 'bg-red-500 animate-pulse' : status === DiplomaticStatus.Friendly || status === DiplomaticStatus.Alliance ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detalhes da Facção Selecionada */}
        <div className="flex-grow flex flex-col">
          {selectedFaction ? (
            <div className="flex flex-col h-full glass-panel-heavy p-8 rounded-3xl border-slate-800/50 shadow-2xl overflow-y-auto custom-scrollbar relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Icons.Diplomacy className="w-32 h-32" />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className={`text-3xl font-display font-black uppercase tracking-tight italic ${selectedFaction.colorClass.split(' ')[3]}`}>
                      {selectedFaction.name}
                    </h3>
                    <div className="h-0.5 w-24 bg-gradient-to-r from-sky-500/50 to-transparent mt-2"></div>
                  </div>
                  <div className="px-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col items-end">
                    <span className="text-[8px] font-technical text-slate-500 uppercase tracking-widest leading-none mb-1">Status de Protocolo</span>
                    <span className={`text-xs font-display font-bold uppercase tracking-wider ${getStatusColor(getDiplomaticStatus(playerState.factionReputations[selectedFaction.id] || 0))}`}>
                      {getDiplomaticStatus(playerState.factionReputations[selectedFaction.id] || 0)}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-2xl">{selectedFaction.description}</p>

                {getActiveTreatiesWithFaction(selectedFaction.id).length > 0 && (
                    <div className="mb-8 p-6 bg-purple-500/5 border border-purple-500/20 rounded-2xl">
                        <p className="text-[10px] font-display font-bold text-purple-400 uppercase tracking-widest mb-4 flex items-center">
                          <Icons.System className="w-3 h-3 mr-2" />
                          Tratados Ativos no Setor
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {getActiveTreatiesWithFaction(selectedFaction.id).map(treaty => (
                              <div key={treaty.type} className="flex justify-between items-center p-3 bg-slate-950/40 rounded-xl border border-slate-800">
                                 <span className="text-xs text-white uppercase font-bold tracking-wide">{treaty.type}</span>
                                 <div className="text-right">
                                   <div className="text-[8px] font-technical text-slate-500 uppercase">Expiração</div>
                                   <div className="text-[10px] font-mono text-purple-400">{Math.max(0, treaty.durationTicks - gameTickCounter)} Ciclos</div>
                                 </div>
                              </div>
                          ))}
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                  <h4 className="text-[10px] font-display font-bold text-white uppercase tracking-widest flex items-center">
                    <div className="w-1 h-2 bg-sky-500 mr-2"></div>
                    Comandos Diplomáticos Disponíveis
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableActions.length > 0 ? (
                      availableActions.map(action => (
                        <button
                          key={action.id}
                          onClick={() => onPerformAction(selectedFaction.id, action.id)}
                          className={`group text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden
                            ${(action.cost && playerState.credits < action.cost) || isLoading 
                                ? 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed' 
                                : 'bg-slate-900/40 border-slate-800 hover:border-sky-500/50 hover:bg-slate-900/60'}`}
                          disabled={isLoading || (action.cost && playerState.credits < action.cost)}
                          title={action.cost && playerState.credits < action.cost ? `Requer ${action.cost} CR` : action.description}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-display font-bold text-white group-hover:text-sky-400 transition-colors uppercase tracking-wide">{action.name}</span>
                            {action.cost && (
                              <span className={`text-[10px] font-mono ${playerState.credits >= action.cost ? 'text-amber-500' : 'text-red-500'}`}>
                                {action.cost} CR
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors leading-relaxed mb-3">{action.description}</p>
                          <div className="flex items-center text-[9px] font-technical text-emerald-500/80 uppercase tracking-widest">
                            <Icons.ShipInfo className="w-3 h-3 mr-1.5 opacity-50" />
                            Impacto: {action.reputationEffect > 0 ? `+${action.reputationEffect}` : action.reputationEffect} RP
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="col-span-full p-10 bg-slate-950/40 rounded-2xl border-2 border-dashed border-slate-800 flex items-center justify-center text-slate-600">
                        <p className="text-xs font-technical uppercase tracking-widest italic">Nenhuma ação disponível para o status atual</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 bg-slate-950/20 rounded-3xl border-2 border-dashed border-slate-800 shadow-inner p-10">
                <div className="w-20 h-20 mb-6 opacity-10 animate-pulse-slow">
                  <Icons.Diplomacy className="w-full h-full" />
                </div>
                <p className="text-xs font-technical uppercase tracking-[0.4em] text-center max-w-xs leading-relaxed">Selecione uma facção no console lateral para estabelecer canal de comunicação</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default DiplomacyView;
