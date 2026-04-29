
import React from 'react';
import { PlayerState, ShipStats } from '../../types';
import { Icons } from '../../icons'; // Corrected path
import LoadingSpinner from '../LoadingSpinner';
import { getResourceImagePath } from '../../constants'; // Corrected path

interface InventoryViewProps {
  playerState: PlayerState | null;
  currentShipCalculatedStats: ShipStats;
  currentCargoUsage: number;
}

const InventoryView: React.FC<InventoryViewProps> = ({ playerState, currentShipCalculatedStats, currentCargoUsage }) => {
  if (!playerState) return <LoadingSpinner />;

  const inventoryItems = Object.entries(playerState.inventory)
    .map(([name, quantity]) => ({ name, quantity: quantity as number }))
    .filter(item => item.quantity > 0);

  const craftedGameItems = playerState.craftedItems;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-1 md:p-6 h-full">
      <div className="p-8 glass-panel rounded-3xl shadow-xl text-gray-200 min-h-full flex flex-col border-sky-500/10 relative overflow-hidden backdrop-blur-xl mb-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
      
      <div className="mb-8 pb-6 border-b border-slate-700/50 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-display font-bold text-sky-400 tracking-tight glow-text-cyan uppercase italic">Cofre de Carga</h2>
          <p className="text-[10px] font-technical text-slate-500 uppercase tracking-[0.3em] mt-1">Gerenciamento de Ativos • ID da Unidade: {playerState.currentShipId.substring(0, 8)}</p>
        </div>
        
        <div className="glass-panel px-6 py-3 rounded-2xl border-slate-700/50 bg-slate-900/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-technical uppercase tracking-widest text-slate-400 flex items-center">
              <Icons.Cargo className="w-3 h-3 mr-2 text-sky-500" />
              Volume de Carga
            </span>
            <span className="text-xs font-mono text-sky-400 font-bold">
              {((currentCargoUsage / currentShipCalculatedStats.totalCargoCapacity) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 w-48 bg-slate-800 rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-sky-500 shadow-[0_0_10px_#0ea5e9] transition-all duration-500" 
              style={{ width: `${(currentCargoUsage / currentShipCalculatedStats.totalCargoCapacity) * 100}%` }}
            ></div>
          </div>
          <div className="mt-1 text-[9px] font-mono text-slate-500 text-right uppercase">
            {currentCargoUsage.toLocaleString()} / {currentShipCalculatedStats.totalCargoCapacity.toLocaleString()} m³
          </div>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-y-auto pr-2 custom-scrollbar">
        {/* Recursos */}
        <div className="space-y-4">
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-widest flex items-center">
            <div className="w-1 h-3 bg-sky-500 mr-2"></div>
            Recursos Brutos
          </h3>
          {inventoryItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {inventoryItems.map(item => {
                const imagePath = getResourceImagePath(item.name);
                return (
                  <div key={item.name} className="group p-4 bg-slate-900/40 border border-slate-700/50 rounded-2xl hover:border-sky-500/50 hover:bg-slate-900/60 transition-all duration-300">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 group-hover:border-sky-500/30 transition-colors">
                        {imagePath ? (
                          <img src={imagePath} alt={item.name} className="w-8 h-8 object-contain" />
                        ) : (
                          <Icons.Cargo className="w-5 h-5 text-slate-700" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-[9px] font-technical text-slate-500 uppercase tracking-widest mb-1">Massa: {(Number(item.quantity) * 0.1).toFixed(1)}t</div>
                        <div className="font-display font-bold text-sky-100 uppercase tracking-wide group-hover:text-sky-400 transition-colors">{item.name}</div>
                        <div className="text-xl font-mono text-sky-500/80 font-bold leading-none mt-1">x{item.quantity.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-600">
               <Icons.Cargo className="w-10 h-10 mb-4 opacity-20" />
               <p className="text-xs font-technical uppercase tracking-widest italic">Compartimento de carga vazio</p>
            </div>
          )}
        </div>

        {/* Itens Fabricados */}
        <div className="space-y-4">
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-widest flex items-center">
            <div className="w-1 h-3 bg-purple-500 mr-2"></div>
            Equipamentos e Artefatos
          </h3>
          {craftedGameItems.length > 0 ? (
            <div className="space-y-3">
              {craftedGameItems.map(item => (
                <div key={item.id} className="p-5 bg-slate-900/40 border border-slate-700/50 rounded-2xl hover:border-purple-500/50 hover:bg-slate-900/60 transition-all duration-300 relative overflow-hidden group">
                  <div className="flex items-start justify-between relative z-10">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-[8px] font-technical px-2 py-0.5 rounded-full uppercase tracking-tighter ${item.type === 'artifact' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-purple-500/10 text-purple-500 border border-purple-500/20'}`}>
                          {item.type === 'artifact' ? 'Artefato' : 'Crafted'}
                        </span>
                        {item.type === 'artifact' && (
                          <span className={`text-[8px] font-technical px-2 py-0.5 rounded-full uppercase tracking-tighter ${item.isAnalyzed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {item.isAnalyzed ? 'Analisado' : 'Não Identificado'}
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-display font-bold text-white uppercase tracking-wide group-hover:text-purple-400 transition-colors leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-sm">{item.description}</p>
                    </div>
                  </div>
                  
                  {(item.effects || (item.type === 'artifact' && item.isAnalyzed && item.researchPointsYield)) && (
                    <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap gap-4 z-10 relative">
                      {item.effects && (
                        <div className="flex items-center text-[10px] text-sky-400">
                          <div className="w-1 h-1 bg-sky-400 rounded-full mr-2"></div>
                          {item.effects}
                        </div>
                      )}
                      {item.type === 'artifact' && item.isAnalyzed && item.researchPointsYield && (
                        <div className="flex items-center text-[10px] text-emerald-400">
                          <div className="w-1 h-1 bg-emerald-400 rounded-full mr-2"></div>
                          Yield: {item.researchPointsYield} RP
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Icons.System className="w-16 h-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-600">
               <Icons.System className="w-10 h-10 mb-4 opacity-20" />
               <p className="text-xs font-technical uppercase tracking-widest italic">Nenhum equipamento especial</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default InventoryView;
