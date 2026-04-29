
import React from 'react';
import { Item, PlayerState } from '../../types';
import { CRAFTABLE_ITEMS, getResourceImagePath } from '../../constants'; // Corrected path
import LoadingSpinner from '../LoadingSpinner';

interface CraftingViewProps {
  playerState: PlayerState | null;
  onCraftItem: (item: Item) => void;
  isLoading: boolean;
}

const CraftingView: React.FC<CraftingViewProps> = ({ playerState, onCraftItem, isLoading }) => {
  if (!playerState) return <LoadingSpinner />;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-1 md:p-6 h-full">
      <div className="p-8 glass-panel rounded-3xl shadow-xl text-gray-200 min-h-full flex flex-col border-sky-500/10 relative overflow-hidden backdrop-blur-xl mb-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

        <div className="mb-8 pb-6 border-b border-slate-700/50">
          <h2 className="text-4xl font-display font-bold text-sky-400 tracking-tight glow-text-cyan uppercase italic">Terminais de Fabricação</h2>
          <p className="text-[10px] font-technical text-slate-500 uppercase tracking-[0.3em] mt-1">Síntese de Módulos e Componentes • Protocolos Ativos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2 custom-scrollbar">
            {CRAFTABLE_ITEMS.map(item => {
                let canCraft = true;
                const costMultiplier = playerState.activePerks.some(p => p.id === 'techAdept') && item.isTechItem ? 0.9 : 1.0;
                return (
                    <div key={item.id} className="group p-6 bg-slate-900/40 rounded-2xl border border-slate-800 hover:border-sky-500/30 transition-all flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-12 bg-sky-500/50 group-hover:h-full transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                        
                        <div className="mb-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-display font-black text-white uppercase tracking-tight italic group-hover:text-sky-400 transition-colors">{item.name}</h3>
                                {item.isTechItem && (
                                  <span className="text-[8px] font-technical bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full uppercase tracking-widest">Tech</span>
                                )}
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{item.description}</p>
                            
                            {item.effects && (
                              <div className="p-3 bg-slate-950/60 rounded-xl border border-sky-500/5 mb-4">
                                <div className="flex items-center text-[9px] font-technical text-sky-500 uppercase tracking-widest mb-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mr-2 shadow-[0_0_5px_#0ea5e9]"></div>
                                  Especificações Táticas
                                </div>
                                <p className="text-[10px] text-slate-300 font-display italic">{item.effects}</p>
                              </div>
                            )}

                            <h4 className="text-[9px] font-display font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Requisitos de Matéria Prima</h4>
                            <div className="space-y-2">
                                {Object.entries(item.craftingRecipe).map(([res, qty]: [string, number]) => {
                                    const requiredQty = Math.max(1, Math.floor(qty * costMultiplier));
                                    const availableQty = playerState.inventory[res] || 0;
                                    const hasEnough = availableQty >= requiredQty;
                                    if (!hasEnough) canCraft = false;
                                    const imagePath = getResourceImagePath(res);
                                    return (
                                      <div key={res} className={`flex items-center justify-between p-2 rounded-lg border transition-all ${hasEnough ? 'bg-slate-950/40 border-slate-800' : 'bg-red-500/5 border-red-500/20 text-red-400'}`}>
                                        <div className="flex items-center">
                                          <div className="w-6 h-6 rounded bg-slate-900 border border-slate-800 flex items-center justify-center mr-2">
                                            {imagePath && <img src={imagePath} alt={res} className={`w-4 h-4 object-contain ${hasEnough ? 'opacity-80 group-hover:opacity-100' : 'opacity-40 grayscale'}`} />}
                                          </div>
                                          <span className="text-[10px] font-medium uppercase tracking-wide">{res}</span>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-[10px] font-technical">
                                            {availableQty} <span className="opacity-40">/</span> {requiredQty}
                                          </div>
                                          {!hasEnough && <div className="text-[8px] font-technical uppercase tracking-tighter">Insuficiente</div>}
                                        </div>
                                      </div>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            onClick={() => onCraftItem(item)}
                            className={`w-full mt-auto py-3 px-4 rounded-xl text-[10px] uppercase font-display font-bold tracking-[0.2em] transition-all
                                ${canCraft 
                                  ? 'bg-sky-500/10 border border-sky-500/50 text-sky-400 hover:bg-sky-500 hover:text-slate-900 shadow-xl shadow-sky-500/5' 
                                  : 'bg-slate-950 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'}`}
                            disabled={!canCraft || isLoading}
                        >
                            {canCraft ? 'Iniciar Síntese' : 'Recursos Insuficientes'}
                        </button>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default CraftingView;
