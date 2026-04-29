
import React from 'react';
import { PlayerState, SkillNode, GameView } from '../../types';
import { Icons } from '../../icons'; // Corrected path
import { INITIAL_SKILL_TREE } from '../../constants'; // Corrected path
import LoadingSpinner from '../LoadingSpinner';

interface SkillTreeViewProps {
  playerState: PlayerState | null;
  onUnlockSkill: (skillId: string) => void;
  onNavigateToProfile: () => void;
  isLoading: boolean;
}

const SkillTreeView: React.FC<SkillTreeViewProps> = ({ playerState, onUnlockSkill, onNavigateToProfile, isLoading }) => {
  if (!playerState) return <LoadingSpinner />;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-1 md:p-6 h-full">
      <div className="p-8 glass-panel rounded-3xl shadow-xl text-gray-200 min-h-full flex flex-col border-sky-500/10 relative overflow-hidden backdrop-blur-xl mb-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

        <div className="mb-8 pb-6 border-b border-slate-700/50 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h2 className="text-4xl font-display font-bold text-amber-400 tracking-tight glow-text-amber uppercase italic">Rede de Habilidades</h2>
            <p className="text-[10px] font-technical text-slate-500 uppercase tracking-[0.3em] mt-1">Aprimoramento Neurossináptico • Unidade: Piloto {playerState.name}</p>
          </div>
          
          <div className="px-6 py-3 bg-slate-900/60 border border-amber-500/20 rounded-2xl flex flex-col items-end">
            <span className="text-[8px] font-technical text-slate-500 uppercase tracking-widest leading-none mb-1">Potencial Cognitivo</span>
            <div className="flex items-center text-lg font-technical font-black text-amber-400 leading-none">
              <span className="w-4 h-4 mr-2 text-amber-500"><Icons.Points /></span>
              {playerState.skillPoints} <span className="text-[10px] text-amber-600 ml-1">SP</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pr-2 custom-scrollbar flex-grow">
            {INITIAL_SKILL_TREE.map(skill => {
                const isUnlocked = playerState.unlockedSkills.includes(skill.id);
                const prerequisiteIds = skill.prerequisites || [];
                const prerequisitesMet = prerequisiteIds.every(p => playerState.unlockedSkills.includes(p));
                const canUnlock = playerState.skillPoints >= skill.cost && !isUnlocked && prerequisitesMet;
                
                return (
                    <div key={skill.id} className={`group p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col
                        ${isUnlocked 
                            ? 'bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]' 
                            : prerequisitesMet 
                                ? 'bg-slate-900/40 border-slate-800 hover:border-amber-500/30' 
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
                                <h3 className={`text-xl font-display font-bold uppercase tracking-tight italic ${isUnlocked ? 'text-emerald-400' : 'text-slate-100 group-hover:text-amber-400 transition-colors'}`}>
                                  {skill.name}
                                </h3>
                            </div>
                            <div className={`h-0.5 w-12 bg-gradient-to-r ${isUnlocked ? 'from-emerald-500' : 'from-amber-500'} to-transparent`}></div>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed mb-6 flex-grow">{skill.description}</p>
                        
                        <div className="space-y-3 mb-6">
                            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/50">
                                <span className="text-[8px] font-technical font-bold text-slate-500 uppercase tracking-widest block mb-1">Modificação Ativa</span>
                                <p className="text-[10px] text-amber-400 leading-tight italic">"{skill.effectDescription}"</p>
                            </div>
                            
                            {!isUnlocked && prerequisiteIds.length > 0 && (
                                <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/50">
                                    <span className="text-[8px] font-technical font-bold text-slate-500 uppercase tracking-widest block mb-1">Rede de Dependência</span>
                                    <div className="flex flex-wrap gap-2">
                                        {prerequisiteIds.map(pid => {
                                            const pSkill = INITIAL_SKILL_TREE.find(s => s.id === pid);
                                            const pUnlocked = playerState.unlockedSkills.includes(pid);
                                            return (
                                                <span key={pid} className={`text-[9px] font-technical uppercase ${pUnlocked ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                  {pSkill?.name || pid}
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
                                    Síncope Neural Ativa
                                </div>
                            ) : (
                                <button
                                    onClick={() => onUnlockSkill(skill.id)}
                                    className={`w-full py-3 rounded-xl text-[10px] font-display font-bold uppercase tracking-[0.2em] transition-all
                                        ${canUnlock 
                                            ? 'bg-amber-500/10 border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-slate-900 shadow-lg shadow-amber-500/10' 
                                            : 'bg-slate-950 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'}`}
                                    disabled={!canUnlock || isLoading}
                                >
                                    {prerequisitesMet ? `Desbloquear Nodo (${skill.cost} SP)` : 'Habilidade Bloqueada'}
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
            className="group btn-scifi py-3 px-6 text-[10px] uppercase tracking-widest flex items-center border-slate-700 text-slate-400 hover:text-amber-400"
          >
            ← Retornar ao Terminal de Perfil
          </button>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
              <span className="text-[9px] font-technical text-slate-500 uppercase tracking-widest">Adquirida</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_#f59e0b]"></div>
              <span className="text-[9px] font-technical text-slate-500 uppercase tracking-widest">Pendente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
              <span className="text-[9px] font-technical text-slate-500 uppercase tracking-widest">Inacessível</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTreeView;
