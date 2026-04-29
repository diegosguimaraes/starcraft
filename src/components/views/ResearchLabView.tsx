
import React from 'react';
import { PlayerState, Item } from '../../types';
import { Icons } from '../../icons'; // Corrected path
import LoadingSpinner from '../LoadingSpinner';

interface ResearchLabViewProps {
  playerState: PlayerState | null;
  onBack: () => void;
  isAnalyzingArtifact: boolean;
  onAnalyzeArtifact: (itemId: string) => void;
}

const ResearchLabView: React.FC<ResearchLabViewProps> = ({
    playerState,
    onBack,
    isAnalyzingArtifact,
    onAnalyzeArtifact
}) => {
  if (!playerState) return <LoadingSpinner message="Carregando dados do laboratório..." />;

  const unanalyzedArtifacts = playerState.craftedItems.filter(item => item.type === 'artifact' && !item.isAnalyzed);
  const analyzedArtifacts = playerState.craftedItems.filter(item => item.type === 'artifact' && item.isAnalyzed);
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-1 md:p-6 h-full">
      <div className="p-8 glass-panel rounded-3xl shadow-xl text-gray-200 min-h-full flex flex-col border-sky-500/10 relative overflow-hidden backdrop-blur-xl mb-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

        <div className="mb-8 pb-6 border-b border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <button
            onClick={onBack}
            className="group btn-scifi py-2 px-4 text-[10px] uppercase tracking-widest flex items-center border-slate-700 text-slate-400 hover:text-sky-400"
          >
            <div className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1">
              <Icons.Mission />
            </div>
            Retornar ao Porto
          </button>

          <div className="text-center">
            <h2 className="text-4xl font-display font-bold text-teal-400 tracking-tight glow-text-cyan uppercase italic">
              Laboratório de Bio-Matriz
            </h2>
            <p className="text-[10px] font-technical text-slate-500 uppercase tracking-[0.3em] mt-1">
              Análise de Artefatos Xenobiológicos • Frequência de Varredura Estabilizada
            </p>
          </div>

          <div className="bg-slate-900/60 border border-teal-500/20 px-6 py-2 rounded-xl flex flex-col items-end min-w-[160px]">
            <span className="text-[8px] font-technical text-slate-500 uppercase tracking-widest">
              Base de Dados de Pesquisa
            </span>
            <span className="text-xl font-display font-bold text-teal-400 tracking-tight">
              {playerState.researchPoints.toLocaleString()}{' '}
              <span className="text-[10px] text-slate-500 ml-1">RP</span>
            </span>
          </div>
        </div>

        {isAnalyzingArtifact && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center">
            <div className="glass-panel-heavy p-10 rounded-3xl border-teal-500/30 flex flex-col items-center">
              <div className="w-20 h-20 mb-6 bg-teal-500/20 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(20,184,166,0.2)]">
                <Icons.Tech className="w-10 h-10 text-teal-400" />
              </div>
              <LoadingSpinner message="Decriptando Matriz de Dados..." size="md" />
              <p className="text-[10px] font-technical text-slate-500 uppercase mt-4 tracking-widest">
                Não desconecte o terminal durante a análise
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          {/* Artefatos Não Analisados */}
          <div className="flex flex-col h-full">
            <h3 className="text-xs font-display font-bold text-sky-300 uppercase tracking-widest mb-4 flex items-center">
              <div className="w-1 h-3 bg-sky-500 mr-2"></div> Artefatos em Quarentena
            </h3>
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar max-h-[400px] lg:max-h-none">
              {unanalyzedArtifacts.length > 0 ? (
                <div className="grid gap-4">
                  {unanalyzedArtifacts.map((artifact) => (
                    <div
                      key={artifact.id}
                      className="group p-5 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-sky-500/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-sm font-display font-bold text-white uppercase italic tracking-tight group-hover:text-sky-400 transition-colors">
                            {artifact.name}
                          </h4>
                          <span className="text-[8px] font-technical text-slate-500 uppercase tracking-widest leading-none">
                            Classificação: Desconhecida
                          </span>
                        </div>
                        <div className="px-2 py-1 bg-sky-500/10 border border-sky-500/20 rounded text-[9px] font-technical font-bold text-sky-400 uppercase">
                          +{artifact.researchPointsYield || '??'} RP
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-6 italic">
                        "{artifact.description}"
                      </p>
                      <button
                        onClick={() => onAnalyzeArtifact(artifact.id)}
                        className="w-full btn-scifi-primary py-2.5 text-[9px] font-display font-bold uppercase tracking-[0.2em] shadow-lg shadow-sky-500/10 disabled:opacity-30"
                        disabled={isAnalyzingArtifact}
                      >
                        Processar Dados
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl opacity-30 text-center p-6">
                  <Icons.ResearchLab className="w-10 h-10 mb-3" />
                  <p className="text-[10px] font-technical uppercase tracking-widest italic leading-relaxed">
                    Baia de análise limpa. Explore o vácuo para recuperar dados perdidos.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Artefatos Analisados */}
          <div className="flex flex-col h-full overflow-hidden">
            <h3 className="text-xs font-display font-bold text-teal-400 uppercase tracking-widest mb-4 flex items-center">
              <div className="w-1 h-3 bg-teal-500 mr-2"></div> Registro de Descobertas
            </h3>
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
              {analyzedArtifacts.length > 0 ? (
                <div className="grid gap-3">
                  {analyzedArtifacts.map((artifact) => (
                    <div
                      key={artifact.id}
                      className="p-4 bg-slate-900/60 border border-teal-500/10 rounded-2xl flex justify-between items-center group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-teal-500/5 rounded-xl border border-teal-500/20 flex items-center justify-center group-hover:bg-teal-500/10 transition-colors">
                          <Icons.Tech className="w-5 h-5 text-teal-500/50 group-hover:text-teal-400 transition-colors" />
                        </div>
                        <div>
                          <span className="block text-xs font-display font-bold text-slate-200 uppercase tracking-tight italic">
                            {artifact.name}
                          </span>
                          <span className="text-[8px] font-technical text-slate-500 uppercase tracking-widest">
                            Matriz de Dados Extraída
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-[8px] font-technical text-teal-500 uppercase tracking-widest leading-none mb-1">
                          Rendimento
                        </span>
                        <span className="text-xs font-display font-bold text-teal-400">
                          +{artifact.researchPointsYield || 0}{' '}
                          <span className="text-[8px]">RP</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl opacity-30 text-center p-6 grayscale">
                  <Icons.Tech className="w-10 h-10 mb-3" />
                  <p className="text-[10px] font-technical uppercase tracking-widest italic">
                    Nenhum registro de decriptagem disponível nos servidores
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 p-5 bg-teal-500/5 border border-teal-500/10 rounded-2xl">
              <h4 className="text-[10px] font-display font-bold text-teal-400 uppercase tracking-widest mb-2 flex items-center">
                <Icons.Profile className="w-3 h-3 mr-2" /> Dica de Campo
              </h4>
              <p className="text-[11px] text-slate-400 italic leading-relaxed">
                Artefatos são janelas para eras passadas. A pesquisa nestes itens é a forma mais
                rápida de desbloquear tecnologias que podem redefinir o destino de sua jornada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchLabView;
