
import React from 'react';
import { Mission, PlayerState, MissionObjectiveType, FactionInfo } from '../../types';
import { Icons } from '../../icons'; // Corrected path
import LoadingSpinner from '../LoadingSpinner';
import { getResourceImagePath, ALL_FACTIONS_DATA } from '../../constants'; // Corrected path

interface MissionsViewProps {
  activeMissions: Mission[];
  onGenerateMission: (factionContextId?: string) => void; // Updated to accept optional faction context
  onCompleteMission: (missionId: string) => void;
  isLoading: boolean;
  playerState: PlayerState | null;
}

const MissionsView: React.FC<MissionsViewProps> = ({
  activeMissions,
  onGenerateMission,
  onCompleteMission,
  isLoading,
  playerState
}) => {
  if (!playerState) return <LoadingSpinner />;

  const active = activeMissions.filter(m => !m.isCompleted);
  const completed = activeMissions.filter(m => m.isCompleted);

  const getObjectiveText = (mission: Mission): string => {
    if (mission.objectiveDetails) {
        const details = mission.objectiveDetails;
        switch (details.type) {
            case MissionObjectiveType.SCAN_FOR_FACTION:
                return `Escanear ${details.targetPlanetId || 'sistema'} ${details.targetLocationName || details.targetSystemId}`;
            case MissionObjectiveType.TRANSPORT_FOR_FACTION:
                return `Transportar ${details.targetQuantity}x ${details.resourceToTransport} para ${details.targetLocationName || details.destinationStationId}`;
            case MissionObjectiveType.DELIVER:
                 return `Entregar ${details.targetQuantity}x ${details.targetItemName} para ${details.targetLocationName}`;
            default:
                return mission.objective; // Fallback to general objective text
        }
    }
    return mission.objective;
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-1 md:p-6 h-full">
      <div className="p-8 glass-panel rounded-3xl shadow-xl text-gray-200 min-h-full flex flex-col border-sky-500/10 relative overflow-hidden backdrop-blur-xl mb-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 pb-6 border-b border-slate-700/50">
            <div>
              <h2 className="text-4xl font-display font-bold text-sky-400 tracking-tight glow-text-cyan uppercase italic">Protocolos de Missão</h2>
              <p className="text-[10px] font-technical text-slate-500 uppercase tracking-[0.3em] mt-1">Diretivas da Central de Comando • Ativos: {active.length}</p>
            </div>
            
            <button
                onClick={() => onGenerateMission()}
                className="btn-scifi btn-scifi-primary py-3 px-6 text-[10px] uppercase tracking-[0.2em]"
                disabled={isLoading || playerState.isTraveling}
            >
                <div className="flex items-center">
                  <Icons.Mission className="w-4 h-4 mr-3" /> 
                  Sincronizar Novos Contratos
                </div>
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-6">
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-widest flex items-center">
                    <div className="w-1 h-3 bg-sky-500 mr-2"></div>
                    Objetivos em Andamento
                </h3>
                {active.length > 0 ? (
                    <div className="space-y-4">
                        {active.map(mission => {
                            const itemImagePath = mission.objectiveDetails?.targetItemName
                                                    ? getResourceImagePath(mission.objectiveDetails.targetItemName)
                                                    : null;
                            const issuerFaction = mission.issuerFactionId ? ALL_FACTIONS_DATA.find(f => f.id === mission.issuerFactionId) : null;
                            return (
                                <div key={mission.id} className="p-6 bg-slate-900/40 border border-slate-700/50 rounded-2xl hover:border-sky-500/30 transition-all duration-300 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-sky-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    <div className="flex items-start justify-between mb-4">
                                      <div>
                                        <h4 className="text-lg font-display font-bold text-white uppercase tracking-wide mb-1 group-hover:text-sky-400 transition-colors">{mission.title}</h4>
                                        {issuerFaction && (
                                            <div className="flex items-center text-[9px] font-technical uppercase tracking-widest text-slate-500">
                                              Emitido por: <span className={`ml-2 font-bold ${issuerFaction.colorClass.split(' ')[3]}`}>{issuerFaction.name}</span>
                                            </div>
                                        )}
                                      </div>
                                      <div className="text-[10px] font-technical uppercase text-sky-500/50 tracking-tighter">ID: {mission.id.substring(0, 8)}</div>
                                    </div>

                                    <p className="text-xs text-slate-400 mb-4 leading-relaxed line-clamp-2">{mission.description}</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                      <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
                                        <label className="block text-[8px] font-technical text-slate-500 uppercase tracking-widest mb-1">Parâmetros do Objetivo</label>
                                        <div className="text-[11px] text-sky-300 flex items-center">
                                          {itemImagePath && mission.objectiveDetails?.targetItemName && (
                                              <img src={itemImagePath} alt={mission.objectiveDetails.targetItemName} className="w-4 h-4 mr-2 object-contain" />
                                          )}
                                          {getObjectiveText(mission)}
                                        </div>
                                      </div>
                                      <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
                                        <label className="block text-[8px] font-technical text-slate-500 uppercase tracking-widest mb-1">Recompensas Estimadas</label>
                                        <div className="text-[11px] text-emerald-400 font-bold">
                                          {mission.rewardsString || "A ser determinado"}
                                          {mission.reputationReward && issuerFaction && (
                                            <span className="ml-2 text-[9px] text-emerald-500/60">(+{mission.reputationReward.amount} RP)</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <button
                                        onClick={() => onCompleteMission(mission.id)}
                                        className="w-full btn-scifi py-3 text-[10px] uppercase tracking-[0.2em] bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-900"
                                    >
                                        Confirmar Conclusão
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                  <div className="p-10 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-600">
                    <Icons.Mission className="w-10 h-10 mb-4 opacity-20" />
                    <p className="text-xs font-technical uppercase tracking-widest italic tracking-[0.3em]">Nenhuma diretiva operacional ativa</p>
                  </div>
                )}
            </div>

            <div className="space-y-6">
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-widest flex items-center opacity-60">
                    <div className="w-1 h-3 bg-slate-500 mr-2"></div>
                    Arquivos de Operações Concluídas
                </h3>
                {completed.length > 0 ? (
                     <div className="space-y-2">
                        {completed.map(mission => {
                            const issuerFaction = mission.issuerFactionId ? ALL_FACTIONS_DATA.find(f => f.id === mission.issuerFactionId) : null;
                            return (
                                <div key={mission.id} className="p-4 bg-slate-900/20 border border-slate-800/40 rounded-xl opacity-60 group hover:opacity-100 transition-opacity">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h4 className="text-sm font-display font-bold text-slate-400 line-through group-hover:text-slate-300 transition-colors font-italic">{mission.title}</h4>
                                        <div className="flex items-center space-x-3 mt-1">
                                          {issuerFaction && (
                                              <span className="text-[8px] font-technical uppercase text-slate-600">{issuerFaction.name}</span>
                                          )}
                                          <span className="text-[8px] font-mono text-emerald-500/60 uppercase">Efetivada</span>
                                        </div>
                                      </div>
                                      <div className="text-[10px] font-mono text-slate-600 italic">
                                        {mission.rewardsString?.substring(0, 15)}...
                                      </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                   <p className="text-[10px] font-technical uppercase tracking-[0.3em] text-slate-600 italic px-4">Nenhum registro histórico disponível</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MissionsView;
