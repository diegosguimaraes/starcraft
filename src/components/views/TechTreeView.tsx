
import React from 'react';
import { PlayerState, TechNode } from '../../types';
import { Icons } from '../../icons'; // Corrected path
import { INITIAL_TECH_TREE } from '../../constants'; // Corrected path
import LoadingSpinner from '../LoadingSpinner';

interface TechTreeViewProps {
  playerState: PlayerState | null;
  onUnlockTech: (techId: string) => void;
  onNavigateToProfile: () => void;
  isLoading: boolean;
}

const TechTreeView: React.FC<TechTreeViewProps> = ({ playerState, onUnlockTech, onNavigateToProfile, isLoading }) => {
  if (!playerState) return <LoadingSpinner />;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-1 md:p-6 h-full">
      <div className="p-8 glass-panel rounded-3xl shadow-xl text-gray-200 min-h-full flex flex-col border-sky-500/10 relative overflow-hidden backdrop-blur-xl mb-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

        <div className="mb-8 pb-6 border-b border-slate-700/50 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h2 className="text-4xl font-display font-bold text-sky-400 tracking-tight glow-text-cyan uppercase italic">Matriz Tecnológica</h2>
            <p className="text-[10px] font-technical text-slate-500 uppercase tracking-[0.3em] mt-1">Repositório de Pesquisa Estratégica • Nível de Acesso: Alfa</p>
          </div>
          
          <div className="px-6 py-3 bg-slate-900/60 border border-indigo-500/20 rounded-2xl flex flex-col items-end">
            <span className="text-[8px] font-technical text-slate-500 uppercase tracking-widest leading-none mb-1">Capacidade de P&D</span>
            <div className="flex items-center text-lg font-technical font-black text-indigo-400 leading-none">
              <span className="w-4 h-4 mr-2 text-indigo-400"><Icons.Points /></span>
              {playerState.researchPoints} <span className="text-[10px] text-indigo-600 ml-1">RP</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pr-2 custom-scrollbar flex-grow">
            {INITIAL_TECH_TREE.map(tech => {
                const isUnlocked = playerState.unlockedTechs.includes(tech.id);
                const prerequisiteIds = tech.prerequisites || [];
                const prerequisitesMet = prerequisiteIds.every(p => playerState.unlockedTechs.includes(p));
                const canUnlock = playerState.researchPoints >= tech.cost && !isUnlocked && prerequisitesMet;
                
                return (
                    <div key={tech.id} className={`group p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col
                        ${isUnlocked 
                            ? 'bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]' 
                            : prerequisitesMet 
                                ? 'bg-slate-900/40 border-slate-800 hover:border-sky-500/30' 
                                : 'bg-slate-950/20 border-slate-900 opacity-60 grayscale'}`}>
                        
                        {isUnlocked && (
                          <div className="absolute top-0 right-0 p-4">
                            <Icons.Unlocked className="w-5 h-5 text-emerald-500/50" />
                          </div>
                        )}
                        {!isUnlocked && !prerequisitesMet && (
                          <div className="absolute top-0 right-0 p-4">
                            <Icons.Locked className="w-5 h-5 text-slate-700" />
                          </div>
                        )}

                        <div className="mb-4">
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className={`text-xl font-display font-bold uppercase tracking-tight italic ${isUnlocked ? 'text-emerald-400' : 'text-slate-100 group-hover:text-sky-400 transition-colors'}`}>
                                  {tech.name}
                                </h3>
                            </div>
                            <div className={`h-0.5 w-12 bg-gradient-to-r ${isUnlocked ? 'from-emerald-500' : 'from-sky-500'} to-transparent`}></div>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed mb-6 flex-grow">{tech.description}</p>
                        
                        <div className="space-y-3 mb-6">
                            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/50">
                                <span className="text-[8px] font-technical font-bold text-slate-500 uppercase tracking-widest block mb-1">Impacto Sistêmico</span>
                                <p className="text-[10px] text-sky-400 leading-tight italic">"{tech.effectDescription}"</p>
                            </div>
                            
                            {!isUnlocked && prerequisiteIds.length > 0 && (
                                <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/50">
                                    <span className="text-[8px] font-technical font-bold text-slate-500 uppercase tracking-widest block mb-1">Exigência Estrutural</span>
                                    <div className="flex flex-wrap gap-2">
                                        {prerequisiteIds.map(pid => {
                                            const pTech = INITIAL_TECH_TREE.find(t => t.id === pid);
                                            const pUnlocked = playerState.unlockedTechs.includes(pid);
                                            return (
                                                <span key={pid} className={`text-[9px] font-technical uppercase ${pUnlocked ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                  {pTech?.name || pid}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-auto">
                            {isUnlocked ? (
                                <div className="w-full py-3 text-center border border-emerald-500/20 bg-emerald-500/5 rounded-xl text-[10px] font-technical text-emerald-500 uppercase tracking-widest">
                                    Módulo Integrado
                                </div>
                            ) : (
                                <button
                                    onClick={() => onUnlockTech(tech.id)}
                                    className={`w-full py-3 rounded-xl text-[10px] font-display font-bold uppercase tracking-[0.2em] transition-all
                                        ${canUnlock 
                                            ? 'bg-indigo-500/10 border border-indigo-500/40 text-indigo-400 hover:bg-indigo-500 hover:text-slate-900 shadow-lg shadow-indigo-500/10' 
                                            : 'bg-slate-950 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'}`}
                                    disabled={!canUnlock || isLoading}
                                >
                                    {prerequisitesMet ? `Inicializar Pesquisa (${tech.cost} RP)` : 'Acesso Bloqueado'}
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button 
            onClick={onNavigateToProfile} 
            className="group btn-scifi py-3 px-6 text-[10px] uppercase tracking-widest flex items-center border-slate-700 text-slate-400 hover:text-sky-400"
          >
            ← Retornar ao Terminal de Perfil
          </button>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
              <span className="text-[9px] font-technical text-slate-500 uppercase tracking-widest">Concluído</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_5px_#0ea5e9]"></div>
              <span className="text-[9px] font-technical text-slate-500 uppercase tracking-widest">Disponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
              <span className="text-[9px] font-technical text-slate-500 uppercase tracking-widest">Bloqueado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechTreeView;
