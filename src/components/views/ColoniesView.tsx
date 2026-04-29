
import React from 'react';
import { Planet, PlayerState } from '../../types';
import { Icons } from '../../icons'; // Corrected path
import LoadingSpinner from '../LoadingSpinner';
import { getResourceImagePath } from '../../constants'; // Corrected path

interface ColoniesViewProps {
  discoveredPlanets: Planet[];
  playerState: PlayerState | null;
  onViewColonyDetails: (planet: Planet) => void; // Added prop
}

const ColoniesView: React.FC<ColoniesViewProps> = ({ discoveredPlanets, playerState, onViewColonyDetails }) => {
  if (!playerState) return <LoadingSpinner />;
  
  // Modificado para filtrar apenas colônias do jogador (ownerFactionId === null)
  const colonies = discoveredPlanets.filter(p => p.isColonized && p.ownerFactionId === null);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-1 md:p-6 h-full">
      <div className="p-8 glass-panel rounded-3xl shadow-xl text-gray-200 min-h-full flex flex-col border-sky-500/10 relative overflow-hidden backdrop-blur-xl mb-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

        <div className="mb-10 pb-6 border-b border-slate-700/50">
          <h2 className="text-4xl font-display font-bold text-sky-400 tracking-tight glow-text-cyan uppercase italic">Administração Colonial</h2>
          <p className="text-[10px] font-technical text-slate-500 uppercase tracking-[0.3em] mt-1">Status de Assentamentos Planetários • Total: {colonies.length}</p>
        </div>

        {colonies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pr-2 custom-scrollbar">
                {colonies.map(colony => (
                    <div key={colony.id} className="group p-6 bg-slate-900/40 border border-slate-700/50 rounded-2xl hover:border-sky-500/30 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-sky-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-xl font-display font-bold text-white uppercase tracking-wide group-hover:text-sky-400 transition-colors italic">{colony.name}</h3>
                              <span className="text-[10px] font-technical text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 uppercase tracking-widest">{colony.biome}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                                <span className="block text-[8px] font-technical text-slate-500 uppercase tracking-widest mb-1">População</span>
                                <div className="flex items-center text-sky-300 font-display font-bold">
                                  <Icons.Population className="w-3 h-3 mr-2 text-sky-500" />
                                  {colony.population.toLocaleString()}
                                </div>
                              </div>
                              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                                <span className="block text-[8px] font-technical text-slate-500 uppercase tracking-widest mb-1">Status de Moral</span>
                                <div className={`flex items-center font-display font-bold ${
                                    (colony.colonyMorale || 50) >= 80 ? 'text-emerald-400' : 
                                    (colony.colonyMorale || 50) <= 30 ? 'text-rose-400' : 'text-amber-400'
                                }`}>
                                   <Icons.Shield className="w-3 h-3 mr-2" />
                                   {Math.round(colony.colonyMorale || 50)}%
                                </div>
                              </div>
                            </div>
                            
                            {/* Moral Bar */}
                            <div className="mb-6">
                                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden flex">
                                    <div 
                                        className={`h-full transition-all duration-700 shadow-[0_0_10px_currentColor] ${
                                            (colony.colonyMorale || 50) >= 80 ? 'bg-emerald-500 text-emerald-500' : 
                                            (colony.colonyMorale || 50) <= 30 ? 'bg-rose-500 text-rose-500' : 'bg-amber-500 text-amber-500'
                                        }`}
                                        style={{ width: `${colony.colonyMorale || 50}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                              <p className="text-[10px] font-technical uppercase tracking-widest text-slate-400">Rendimento Operacional</p>
                              <div className="grid grid-cols-2 gap-2">
                                  {Object.entries(colony.baseProduction).map(([res, amount]: [string, number]) => {
                                      const imagePath = getResourceImagePath(res);
                                      return (
                                          <div key={res} className="flex items-center space-x-2 text-[10px] text-slate-300 bg-slate-950/30 p-2 rounded-lg border border-slate-800/50">
                                              {imagePath ? (
                                                <img src={imagePath} alt={res} className="w-3 h-3 object-contain" />
                                              ) : (
                                                <div className="w-1 h-1 bg-sky-500 rounded-full"></div>
                                              )}
                                              <span className="flex-grow">{res}</span>
                                              <span className="font-mono text-sky-400">+{amount}</span>
                                          </div>
                                      );
                                  })}
                              </div>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => onViewColonyDetails(colony)}
                            className="relative z-10 btn-scifi py-3 text-[10px] uppercase tracking-[0.2em] bg-sky-500/10 border-sky-500/30 text-sky-400 hover:bg-sky-500 hover:text-slate-900 w-full transition-all"
                        >
                            Assumir Comando
                        </button>
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-slate-600">
               <div className="w-20 h-20 mb-6 opacity-10">
                 <Icons.Colonies className="w-full h-full" />
               </div>
               <p className="text-xs font-technical uppercase tracking-[0.4em] text-center max-w-sm italic">Nenhum assentamento ativo detectado sob comando do jogador</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ColoniesView;
