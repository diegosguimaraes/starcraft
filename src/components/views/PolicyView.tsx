
import React from 'react';
import { PlayerState, PolicyDefinition, ActivePolicy } from '../../types';
import { Icons } from '../../icons'; // Corrected path
import { POLICY_DEFINITIONS, MAX_ACTIVE_POLICIES } from '../../constants';
import LoadingSpinner from '../LoadingSpinner';

interface PolicyViewProps {
  playerState: PlayerState | null;
  onActivatePolicy: (policyId: string) => void;
  onDeactivatePolicy: (policyId: string) => void;
  isLoading: boolean; // For any async operations if needed in the future
}

const PolicyView: React.FC<PolicyViewProps> = ({
  playerState,
  onActivatePolicy,
  onDeactivatePolicy,
  isLoading,
}) => {
  if (!playerState) return <LoadingSpinner message="Carregando políticas..." />;

  const getPolicyIcon = (iconName?: string): React.ReactNode => {
    if (!iconName) return <div className="w-5 h-5 text-gray-400"><Icons.Skills /></div>; // Default icon
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <div className="w-5 h-5"><IconComponent /></div> : <div className="w-5 h-5 text-gray-400"><Icons.Skills /></div>;
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-1 md:p-6 h-full">
      <div className="p-8 glass-panel rounded-3xl shadow-xl text-gray-200 min-h-full flex flex-col border-sky-500/10 relative overflow-hidden backdrop-blur-xl mb-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

        <div className="mb-8 pb-6 border-b border-slate-700/50 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h2 className="text-4xl font-display font-bold text-sky-400 tracking-tight glow-text-cyan uppercase italic">Diretrizes de Comando</h2>
            <p className="text-[10px] font-technical text-slate-500 uppercase tracking-[0.3em] mt-1">Sistemas de Governança Estratégica • Protocolos Ativos: {playerState.activePolicies.length} / {MAX_ACTIVE_POLICIES}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
            <span className="text-[10px] font-technical text-slate-400 uppercase tracking-widest">Estabilidade do Sistema: Nominal</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          {/* Políticas Disponíveis */}
          <div className="flex flex-col h-full">
            <h3 className="text-xs font-display font-bold text-sky-300 uppercase tracking-widest mb-4 flex items-center">
              <div className="w-1 h-3 bg-sky-500 mr-2"></div> Arquivo de Diretrizes
            </h3>
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-grow max-h-[500px] lg:max-h-none">
            {POLICY_DEFINITIONS.map(policy => {
              const isAlreadyActive = playerState.activePolicies.some(ap => ap.policyId === policy.id);
              const canActivateMore = playerState.activePolicies.length < MAX_ACTIVE_POLICIES;
              
              let canAfford = true;
              let costElements = [];
              if (policy.activationCost?.credits) {
                  costElements.push({ label: 'CR', value: policy.activationCost.credits, affordable: playerState.credits >= policy.activationCost.credits });
                  if (playerState.credits < policy.activationCost.credits) canAfford = false;
              }
              if (policy.activationCost?.researchPoints) {
                  costElements.push({ label: 'RP', value: policy.activationCost.researchPoints, affordable: playerState.researchPoints >= policy.activationCost.researchPoints });
                  if (playerState.researchPoints < policy.activationCost.researchPoints) canAfford = false;
              }

              return (
                <div key={policy.id} className={`group p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden
                    ${isAlreadyActive 
                        ? 'bg-emerald-500/5 border-emerald-500/30 opacity-60' 
                        : 'bg-slate-900/40 border-slate-800 hover:border-sky-500/30'}`}>
                  
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isAlreadyActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-950 text-sky-500 border border-slate-800 group-hover:border-sky-500/30'} transition-all`}>
                        {getPolicyIcon(policy.icon)}
                      </div>
                      <div>
                        <span className={`text-sm font-display font-bold uppercase tracking-wide ${isAlreadyActive ? 'text-emerald-400' : 'text-slate-100 group-hover:text-sky-400'} transition-colors`}>{policy.name}</span>
                        <span className="block text-[8px] font-technical text-slate-500 uppercase tracking-widest">{policy.category || 'Geral'}</span>
                      </div>
                    </div>
                    {isAlreadyActive && (
                      <span className="text-[8px] font-technical bg-emerald-500 text-slate-950 px-2 py-0.5 rounded uppercase tracking-widest font-bold">Ativa</span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{policy.description}</p>
                  
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/50 mb-4">
                    <span className="text-[8px] font-technical font-bold text-slate-500 uppercase tracking-widest block mb-1">Impacto Executivo</span>
                    <p className="text-[10px] text-sky-400 leading-tight italic">"{policy.effectDescription}"</p>
                  </div>

                  {!isAlreadyActive && (
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="flex gap-2">
                        {costElements.length > 0 ? costElements.map(cost => (
                          <span key={cost.label} className={`text-[10px] font-technical ${cost.affordable ? 'text-slate-300' : 'text-rose-500'}`}>
                            {cost.value} {cost.label}
                          </span>
                        )) : <span className="text-[10px] font-technical text-slate-500 uppercase">Sem Custo</span>}
                      </div>
                      <button
                        onClick={() => onActivatePolicy(policy.id)}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-display font-bold uppercase tracking-[0.2em] transition-all
                                    ${canActivateMore && canAfford ? 'bg-sky-500/10 border border-sky-500/40 text-sky-400 hover:bg-sky-500 hover:text-slate-900' : 'bg-slate-950 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'}`}
                        disabled={isLoading || !canActivateMore || !canAfford}
                        title={!canActivateMore ? 'Capacidade máxima atingida.' : !canAfford ? 'Créditos ou Dados insuficientes.' : `Ativar ${policy.name}`}
                      >
                        Autorizar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Políticas Ativas */}
        <div className="flex flex-col h-full overflow-hidden">
           <h3 className="text-xs font-display font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center">
            <div className="w-1 h-3 bg-emerald-500 mr-2"></div> Protocolos em Execução
          </h3>
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
            {playerState.activePolicies.length > 0 ? (
              <div className="space-y-4">
                {playerState.activePolicies.map(activePolicy => {
                  const policyDef = POLICY_DEFINITIONS.find(p => p.id === activePolicy.policyId);
                  if (!policyDef) return null;

                  return (
                    <div key={activePolicy.policyId} className="p-6 bg-slate-900/60 border border-emerald-500/20 rounded-3xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {getPolicyIcon(policyDef.icon)}
                        </div>
                        <div>
                          <span className="block text-base font-display font-black text-white uppercase italic tracking-tight">{policyDef.name}</span>
                          <span className="block text-[8px] font-technical text-slate-500 uppercase tracking-[0.2em]">Tick de Ativação: #{activePolicy.activationTick}</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-slate-950/40 rounded-xl border border-emerald-500/10 mb-6">
                        <p className="text-[10px] text-emerald-400 leading-tight italic">"{policyDef.effectDescription}"</p>
                      </div>

                      <button
                        onClick={() => onDeactivatePolicy(activePolicy.policyId)}
                        className="w-full py-2.5 rounded-xl text-[9px] font-display font-bold uppercase tracking-[0.2em] bg-rose-500/5 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                        disabled={isLoading}
                      >
                        Revogar Diretriz
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl opacity-30 text-center p-6">
                <Icons.Skills className="w-10 h-10 mb-3" />
                <p className="text-[10px] font-technical uppercase tracking-widest italic">Nenhum protocolo de governança ativo no setor</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 p-4 bg-slate-900/40 rounded-2xl border border-slate-800/50">
            <p className="text-[9px] font-technical text-slate-500 uppercase tracking-widest leading-relaxed">
              * Nota: A revogação de uma política é instantânea, mas o custo de ativação original não é reembolsado pela administração central.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default PolicyView;
