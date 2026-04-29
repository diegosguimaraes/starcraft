
import React from 'react';
import Modal from '../Modal'; // Path is correct if Modal.tsx is in src/components/
import { CombatSummaryData, ShipModule } from '../../types';
import { Icons } from '../../icons'; // Corrected path
import { getResourceImagePath } from '../../constants'; // Corrected path

interface CombatSummaryModalProps {
  summary: CombatSummaryData | null;
  onClose: () => void;
}

const CombatSummaryModal: React.FC<CombatSummaryModalProps> = ({ summary, onClose }) => {
  if (!summary) return null;

  let title = "Resultado do Combate";
  let titleColor = "text-yellow-400";
  let icon = <Icons.Galaxy />;

  switch (summary.type) {
    case 'victory':
      title = "VITÓRIA!";
      titleColor = "text-green-400";
      icon = <div className="w-16 h-16 text-green-400"><Icons.Skills /></div>;
      break;
    case 'defeat':
      title = "DERROTA!";
      titleColor = "text-red-500";
      icon = <div className="w-16 h-16 text-red-500"><Icons.Trash /></div>;
      break;
    case 'fled':
      title = "FUGA BEM-SUCEDIDA!";
      titleColor = "text-blue-400";
      icon = <div className="w-16 h-16 text-blue-400"><Icons.Travel /></div>;
      break;
  }

  const hasLoot = summary.loot &&
                  (summary.loot.credits ||
                   (summary.loot.resources && Object.keys(summary.loot.resources).length > 0) ||
                   (summary.loot.modules && summary.loot.modules.length > 0));

  return (
    <Modal isOpen={true} onClose={onClose} title={title} size="md">
      <div className="flex flex-col items-center text-center space-y-6 font-sans relative">
        {/* Thematic Background Glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 blur-[80px] opacity-20 pointer-events-none -translate-y-1/2 ${
          summary.type === 'victory' ? 'bg-emerald-500' : 
          summary.type === 'defeat' ? 'bg-rose-500' : 'bg-sky-500'
        }`}></div>

        <div className="relative z-10">
          <div className={`mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center border-2 shadow-lg ${
            summary.type === 'victory' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
            summary.type === 'defeat' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 
            'bg-sky-500/10 border-sky-500/30 text-sky-400'
          }`}>
            {icon}
          </div>
          <h3 className={`text-4xl font-display font-black tracking-tighter italic uppercase ${titleColor} drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
            {title}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="h-[1px] w-8 bg-current opacity-30"></div>
            <span className="text-[10px] font-technical uppercase tracking-[0.4em] text-slate-500">Relatório de Engajamento</span>
            <div className="h-[1px] w-8 bg-current opacity-30"></div>
          </div>
        </div>

        <div className="space-y-4 w-full relative z-10">
          <div className="glass-panel p-6 rounded-2xl border-white/5 bg-slate-950/40">
            <p className="text-slate-300 italic leading-relaxed font-display text-lg mb-2">"{summary.message}"</p>
            {summary.enemyName && (
              <div className="flex items-center justify-center gap-2 text-[9px] font-technical text-slate-500 uppercase tracking-widest">
                <span>Alvo Identificado:</span>
                <span className="text-slate-300 font-bold">{summary.enemyName}</span>
              </div>
            )}
          </div>

          {hasLoot && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-amber-500/30"></div>
                <h4 className="text-[9px] font-technical font-bold text-amber-500 uppercase tracking-[0.3em]">Recuperação de Ativos</h4>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-amber-500/30"></div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {summary.loot?.credits && summary.loot.credits > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-emerald-500/20 group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Icons.Credits className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-xs font-display font-bold text-slate-300 uppercase tracking-wide">Créditos de Recompensa</span>
                    </div>
                    <span className="text-sm font-technical font-bold text-emerald-400">+{summary.loot.credits.toLocaleString()} CR</span>
                  </div>
                )}

                {summary.loot?.resources && Object.entries(summary.loot.resources).map(([resourceName, quantity]) => {
                    const imagePath = getResourceImagePath(resourceName);
                    return (
                      <div key={resourceName} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/5 group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-white/5">
                            {imagePath ?
                              <img src={imagePath} alt={resourceName} className="w-4 h-4 object-contain" /> :
                              <Icons.Resource className="w-4 h-4 text-slate-500" />
                            }
                          </div>
                          <span className="text-xs font-display font-bold text-slate-300 uppercase tracking-wide">{resourceName}</span>
                        </div>
                        <span className="text-sm font-technical font-bold text-white">+{quantity}</span>
                      </div>
                    );
                })}

                {summary.loot?.modules && summary.loot.modules.map((module: ShipModule, index: number) => (
                  <div key={`${module.id}-${index}`} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-sky-500/20 group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                        <Icons.ShipModules className="w-4 h-4 text-sky-400" />
                      </div>
                      <span className="text-xs font-display font-bold text-slate-300 uppercase tracking-wide">{module.name}</span>
                    </div>
                    <span className="text-[10px] font-technical font-bold text-sky-400 uppercase tracking-tighter">Módulo Recuperado</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full relative group overflow-hidden py-4 px-8 rounded-2xl bg-sky-500 text-slate-950 font-display font-black uppercase tracking-[0.3em] text-xs transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(14,165,233,0.3)] z-10"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]"></div>
          Finalizar Sequência
        </button>
      </div>
    </Modal>
  );
};

export default CombatSummaryModal;
