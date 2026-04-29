
import React from 'react';
import { PlayerState, GameView } from '../../types';
import { Icons } from '../../icons'; // Corrected path
import { CHARACTER_ORIGINS } from '../../constants'; // Corrected path
import LoadingSpinner from '../LoadingSpinner';

interface ProfileViewProps {
  playerState: PlayerState | null;
  onNavigate: (view: GameView) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ playerState, onNavigate }) => {
  if (!playerState) return <LoadingSpinner />;

  const origin = CHARACTER_ORIGINS.find(o => o.id === playerState.originId);

  const renderStartingBonus = () => {
    if (origin && origin.startingBonus) {
        const bonusParts: string[] = [];
        if (origin.startingBonus.credits) bonusParts.push(`Créditos: ${origin.startingBonus.credits}`);
        if (origin.startingBonus.inventory) {
             const invString = Object.entries(origin.startingBonus.inventory)
                                   .map(([k,v]) => `${k} x${v}`)
                                   .join(', ');
            if (invString) bonusParts.push(`Inventário: ${invString}`);
        }
        if (origin.startingBonus.researchPoints) bonusParts.push(`Pontos de Pesquisa: ${origin.startingBonus.researchPoints}`);
        if (origin.startingBonus.craftedItems && origin.startingBonus.craftedItems.length > 0) {
            bonusParts.push(`Itens: ${origin.startingBonus.craftedItems.map(i => i.name).join(', ')}`);
        }

        return <p className="text-xs text-yellow-400 mt-2">Bônus Inicial: {bonusParts.join('; ')}</p>;
    }
    return null;
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-1 md:p-6 h-full">
      <div className="p-8 glass-panel rounded-3xl shadow-xl text-gray-200 min-h-full flex flex-col border-sky-500/10 relative overflow-hidden backdrop-blur-xl mb-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

        <div className="mb-10 pb-6 border-b border-slate-700/50 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-display font-bold text-sky-400 tracking-tight glow-text-cyan uppercase italic">Dossiê do Piloto</h2>
            <p className="text-[10px] font-technical text-slate-500 uppercase tracking-[0.3em] mt-1">Status Operacional Individual • Ident: {playerState.characterName}</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <span className="block text-[8px] font-technical text-slate-500 uppercase tracking-widest leading-none mb-1">Unidades de Crédito</span>
              <span className="text-xl font-display font-bold text-emerald-400 tracking-tight glow-text-emerald">
                {playerState.credits.toLocaleString()} <span className="text-[10px] ml-1">CR</span>
              </span>
            </div>
            <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center p-2">
               <Icons.Profile className="w-full h-full text-sky-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 overflow-y-auto pr-2 custom-scrollbar">
            <div className="glass-panel-heavy p-8 rounded-3xl border-slate-700/40 bg-slate-900/20 relative group">
                <div className="absolute top-0 left-0 w-1 h-20 bg-sky-500 shadow-[0_0_15px_#0ea5e9]"></div>
                
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xs font-display font-bold text-white uppercase tracking-widest mb-1">Origem do Piloto</h3>
                    <div className="text-2xl font-display font-black text-sky-400 uppercase italic tracking-tighter">{origin?.name || "Desconhecida"}</div>
                  </div>
                  <Icons.Star className="w-8 h-8 text-slate-800" />
                </div>
                
                <p className="text-sm text-slate-400 leading-relaxed mb-8 italic">"{origin?.description}"</p>
                
                <div className="space-y-4">
                  <h4 className="text-[10px] font-display font-bold text-white uppercase tracking-[0.2em] mb-4 flex items-center">
                    <div className="w-2 h-2 rounded-full border border-sky-500 mr-2"></div>
                    Perks de Origem Ativos
                  </h4>
                  <div className="space-y-3">
                      {playerState.activePerks.map(perk => (
                          <div key={perk.id} className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 hover:border-sky-500/30 transition-all group">
                              <span className="block text-xs font-bold text-white uppercase tracking-wide group-hover:text-sky-400 transition-colors mb-1">{perk.name}</span>
                              <span className="text-[11px] text-slate-500 leading-tight block">{perk.description}</span>
                          </div>
                      ))}
                      {!playerState.activePerks.length && (
                        <p className="text-[10px] font-technical text-slate-600 uppercase tracking-widest italic">Nenhum perk adicional identificado</p>
                      )}
                  </div>
                </div>
                
                {renderStartingBonus()}
            </div>

            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-900/40 rounded-3xl border border-slate-800 relative group overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-yellow-500/5 rounded-full blur-2xl"></div>
                    <label className="block text-[10px] font-technical text-slate-500 uppercase tracking-widest mb-2">Habilidades</label>
                    <div className="flex items-end justify-between">
                      <span className="text-4xl font-display font-black text-yellow-400 glow-text-yellow">{playerState.skillPoints}</span>
                      <span className="text-[8px] font-technical text-yellow-500 opacity-60 uppercase mb-2">Pontos</span>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-900/40 rounded-3xl border border-slate-800 relative group overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-teal-500/5 rounded-full blur-2xl"></div>
                    <label className="block text-[10px] font-technical text-slate-500 uppercase tracking-widest mb-2">Pesquisa</label>
                    <div className="flex items-end justify-between">
                      <span className="text-4xl font-display font-black text-teal-400 glow-text-cyan">{playerState.researchPoints}</span>
                      <span className="text-[8px] font-technical text-teal-500 opacity-60 uppercase mb-2">Dados</span>
                    </div>
                  </div>
                </div>

                <div className="flex-grow glass-panel-heavy p-8 rounded-3xl border-slate-800 flex flex-col justify-center space-y-4">
                  <h4 className="text-[10px] font-display font-bold text-slate-500 uppercase tracking-[0.3em] text-center mb-4">Acesso aos Sistemas Centrais</h4>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => onNavigate('skillTree')}
                        className="flex-1 btn-scifi p-6 flex flex-col items-center justify-center gap-3 bg-purple-500/5 border-purple-500/30 text-purple-400 hover:bg-purple-500 hover:text-slate-900 transition-all rounded-3xl"
                    >
                        <Icons.Skills className="w-8 h-8" />
                        <span className="text-[10px] font-display font-bold uppercase tracking-widest">Matriz de Habilidades</span>
                    </button>
                    <button
                        onClick={() => onNavigate('techTree')}
                        className="flex-1 btn-scifi p-6 flex flex-col items-center justify-center gap-3 bg-teal-500/5 border-teal-500/30 text-teal-400 hover:bg-teal-500 hover:text-slate-900 transition-all rounded-3xl"
                    >
                        <Icons.Tech className="w-8 h-8" />
                        <span className="text-[10px] font-display font-bold uppercase tracking-widest">Rede de Tecnologias</span>
                    </button>
                  </div>
                </div>
            </div>
        </div>

        <button
            onClick={() => onNavigate('galaxy')}
            className="w-full btn-scifi-primary py-4 text-xs font-display font-bold uppercase tracking-[0.4em] flex items-center justify-center shadow-xl shadow-sky-500/10"
        >
            Fechar Dossiê e Sincronizar
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
