
import React from 'react';
import { PlayerState, Ship, SpaceStation, ShipStats, ShipModule } from '../../types';
import { Icons } from '../../icons'; // Corrected path
import { SHIP_HULLS, INITIAL_SHIP_MODULES, MODULE_SELL_PRICE_MODIFIER } from '../../constants'; // Corrected path
import LoadingSpinner from '../LoadingSpinner';

interface ShipyardViewProps {
  playerState: PlayerState;
  currentShip: Ship;
  selectedStation: SpaceStation;
  currentShipCalculatedStats: ShipStats;
  onUnequipModule: (moduleIndex: number) => void;
  onEquipModule: (module: ShipModule) => void;
  onSellOwnedModule: (module: ShipModule) => void;
  onBuyModule: (moduleId: string) => void;
  onBuyHull: (hullId: string) => void;
  isLoading: boolean;
  playerTradeDiscount: number; 
  onBack: () => void;
}

const ShipyardView: React.FC<ShipyardViewProps> = ({
  playerState,
  currentShip,
  selectedStation,
  currentShipCalculatedStats,
  onUnequipModule,
  onEquipModule,
  onSellOwnedModule,
  onBuyModule,
  onBuyHull,
  isLoading,
  playerTradeDiscount, 
  onBack
}) => {
  if (!playerState || !currentShip || !selectedStation || !currentShipCalculatedStats) return <LoadingSpinner />;

  const calculateFinalPrice = (basePrice: number, stationModifier?: number, tradeMultiplier?: number): number => {
    const stationMod = stationModifier || 1.0;
    const effectiveTradeMultiplier = tradeMultiplier === undefined ? 1.0 : tradeMultiplier;
    return Math.floor(basePrice * stationMod * effectiveTradeMultiplier);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-1 md:p-6 h-full">
      <div className="p-8 glass-panel rounded-3xl shadow-xl text-gray-200 min-h-full flex flex-col border-sky-500/10 relative overflow-hidden backdrop-blur-xl mb-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

          <div className="mb-8 pb-6 border-b border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
              <button
                onClick={onBack}
                className="group btn-scifi py-2 px-4 text-[10px] uppercase tracking-widest flex items-center border-slate-700 text-slate-400 hover:text-sky-400"
              >
                <div className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1"><Icons.Mission /></div>
                Sair do Estaleiro
              </button>
              
              <div className="text-center">
                <h2 className="text-4xl font-display font-bold text-amber-400 tracking-tight glow-text-amber uppercase italic">Serviços de Estaleiro</h2>
                <p className="text-[10px] font-technical text-slate-500 uppercase tracking-[0.3em] mt-1">{selectedStation.name} • Protocolos de Engenharia Ativos</p>
              </div>

              <div className="bg-slate-900/60 border border-amber-500/20 px-4 py-2 rounded-xl flex flex-col items-end">
                <span className="text-[9px] font-technical text-slate-500 uppercase tracking-widest">Nave em Doca</span>
                <span className="text-xs font-display font-bold text-amber-200">{currentShip.name} <span className="text-[10px] text-slate-500 ml-1">({SHIP_HULLS.find(h=>h.id === currentShip.hullTypeId)?.name})</span></span>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-y-auto pr-2 custom-scrollbar flex-grow">
              {/* Ship Stats & Equipped Modules */}
              <div className="space-y-6 flex flex-col h-full overflow-hidden">
                  <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800 flex flex-col h-full">
                    <h3 className="text-sm font-display font-bold text-amber-400 border-b border-amber-500/20 pb-4 mb-6 uppercase tracking-widest flex items-center">
                      <Icons.ShipStatsIcon className="w-5 h-5 mr-3 text-amber-500" /> Diagnóstico de Sistemas
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col gap-1">
                        <span className="text-[8px] font-technical text-slate-500 uppercase">Carga</span>
                        <div className="flex items-center text-xs font-display font-bold text-sky-400">
                          <Icons.Cargo className="w-3 h-3 mr-2 opacity-50" /> {currentShipCalculatedStats.totalCargoCapacity}
                        </div>
                      </div>
                      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col gap-1">
                        <span className="text-[8px] font-technical text-slate-500 uppercase">Impulsão</span>
                        <div className="flex items-center text-xs font-display font-bold text-amber-400">
                          <Icons.Speed className="w-3 h-3 mr-2 opacity-50" /> {currentShipCalculatedStats.totalSpeed}
                        </div>
                      </div>
                      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col gap-1">
                        <span className="text-[8px] font-technical text-slate-500 uppercase">Escudo</span>
                        <div className="flex items-center text-xs font-display font-bold text-blue-400">
                          <Icons.Shield className="w-3 h-3 mr-2 opacity-50" /> {currentShipCalculatedStats.totalShieldStrength}
                        </div>
                      </div>
                      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col gap-1">
                        <span className="text-[8px] font-technical text-slate-500 uppercase">Integridade</span>
                        <div className="flex items-center text-xs font-display font-bold text-emerald-400">
                          <Icons.Hull className="w-3 h-3 mr-2 opacity-50" /> {currentShipCalculatedStats.totalHullIntegrity}
                        </div>
                      </div>
                    </div>

                    <h4 className="text-[10px] font-display font-bold text-slate-400 uppercase tracking-widest mb-4 flex justify-between items-center">
                      Configuração de Slots
                      <span className="text-slate-600">({currentShip.modules.filter(m=>m).length}/{currentShip.maxModuleSlots})</span>
                    </h4>
                    
                    <div className="space-y-3 flex-grow overflow-y-auto pr-1">
                      {currentShip.modules.map((mod, index) => (
                          <div key={`equipped-${mod?.id || 'empty'}-${index}`} className={`group p-4 rounded-xl border transition-all ${mod ? 'bg-slate-900 border-slate-800 hover:border-amber-500/30' : 'bg-slate-950/50 border-dashed border-slate-800 flex items-center justify-center h-20'}`}>
                              {mod ? (
                                  <div className="flex flex-col gap-2">
                                      <div className="flex justify-between items-center">
                                        <p className="text-[11px] font-display font-bold text-slate-200 uppercase tracking-wide italic">{mod.name}</p>
                                        <span className="text-[8px] font-technical text-slate-500 uppercase">{mod.type}</span>
                                      </div>
                                      <p className="text-[10px] text-slate-500 italic leading-tight">{mod.description}</p>
                                      <button onClick={() => onUnequipModule(index)} className="mt-2 text-[8px] font-technical text-rose-500 uppercase tracking-widest hover:text-rose-400 transition-colors flex items-center self-start">
                                        <div className="w-2 h-2 bg-rose-500/50 rounded-full mr-2"></div> Desinstalar Módulo
                                      </button>
                                  </div>
                              ) : <span className="text-[10px] font-technical text-slate-700 uppercase tracking-widest">Entrada de Slot Vazia</span>}
                          </div>
                      ))}
                    </div>
                  </div>
              </div>

              {/* Module Inventory and Market */}
              <div className="space-y-6 flex flex-col h-full overflow-hidden">
                  <div className="flex-1 p-6 bg-slate-900/40 rounded-2xl border border-slate-800 flex flex-col overflow-hidden mb-6">
                    <h3 className="text-sm font-display font-bold text-sky-400 border-b border-sky-500/20 pb-4 mb-6 uppercase tracking-widest flex items-center">
                      <Icons.ShipModules className="w-5 h-5 mr-3 text-sky-500" /> Inventário Local (Hangar)
                    </h3>
                    
                    {playerState.ownedShipModules.length > 0 ? (
                        <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                            {playerState.ownedShipModules.map((mod, index) => (
                                <div key={`hangar-${mod.id}-${index}`} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl hover:border-sky-500/20 transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                      <p className="text-[11px] font-display font-bold text-slate-300 uppercase italic tracking-wide group-hover:text-white transition-colors">{mod.name}</p>
                                      <span className="text-[8px] font-technical text-slate-600 uppercase tracking-widest">{mod.type}</span>
                                    </div>
                                    <div className="flex space-x-2 mt-3">
                                        <button onClick={() => onEquipModule(mod)} className="flex-1 btn-scifi-primary py-2 text-[9px] uppercase tracking-widest shadow-lg shadow-emerald-500/10">Instalar</button>
                                        <button onClick={() => onSellOwnedModule(mod)} className="flex-1 btn-scifi py-2 text-[9px] uppercase tracking-widest text-rose-400 border-rose-500/20 hover:bg-rose-500/10 hover:border-rose-500/40">Liquidat ({Math.floor(mod.cost * MODULE_SELL_PRICE_MODIFIER)} CR)</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                      <div className="flex-grow flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center">
                        <Icons.ShipModules className="w-10 h-10 mb-4" />
                        <p className="text-[10px] font-technical uppercase tracking-widest italic">Nenhum componente excedente armazenado</p>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-6 bg-slate-900/40 rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
                    <h3 className="text-sm font-display font-bold text-sky-400 border-b border-sky-500/20 pb-4 mb-6 uppercase tracking-widest flex items-center">
                      <Icons.Credits className="w-5 h-5 mr-3 text-sky-500" /> Mercado de Componentes
                    </h3>
                    
                    <div className="space-y-4 overflow-y-auto pr-1 custom-scrollbar">
                      {selectedStation.availableShipModuleIds.map(modId => {
                          const modData = INITIAL_SHIP_MODULES.find(m => m.id === modId);
                          if (!modData) return null;
                          const finalPrice = calculateFinalPrice(modData.cost, selectedStation.shipModulePriceModifier, playerTradeDiscount);
                          const originalPrice = Math.floor(modData.cost * (selectedStation.shipModulePriceModifier || 1.0));
                          const hasDiscount = playerTradeDiscount < 1.0 && finalPrice < originalPrice;
                          return (
                              <div key={modId} className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl hover:border-sky-500/30 transition-all group">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <p className="text-[11px] font-display font-bold text-slate-200 uppercase italic tracking-tight">{modData.name}</p>
                                      <p className="text-[10px] text-slate-500 italic mt-1 leading-tight">{modData.description}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs font-technical font-black text-white">{finalPrice} <span className="text-[8px] text-slate-500">CR</span></p>
                                      {hasDiscount && (
                                        <div className="text-[8px] text-emerald-500 font-technical uppercase flex flex-col items-end">
                                          <span className="line-through opacity-40 text-slate-500">{originalPrice} CR</span>
                                          <span>-{((1 - playerTradeDiscount) * 100).toFixed(0)}% OFF</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                      onClick={() => onBuyModule(modId)}
                                      className="w-full mt-4 btn-scifi-primary py-2.5 text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-sky-500/10 disabled:opacity-30 disabled:scale-100"
                                      disabled={playerState.credits < finalPrice || isLoading}
                                  >
                                      Autorizar Aquisição
                                  </button>
                              </div>
                          );
                      })}
                    </div>
                  </div>
              </div>

              {/* Hull Market */}
              <div className="space-y-6 flex flex-col h-full overflow-hidden">
                  <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800 flex flex-col h-full overflow-hidden">
                    <h3 className="text-sm font-display font-bold text-amber-500 border-b border-amber-500/20 pb-4 mb-6 uppercase tracking-widest flex items-center">
                      <Icons.Ship className="w-5 h-5 mr-3 text-amber-500" /> Catálogo de Cascos Estelares
                    </h3>
                    
                    {selectedStation.availableShipHullIds.length > 0 ? (
                        <div className="space-y-4 overflow-y-auto pr-1 custom-scrollbar">
                            {selectedStation.availableShipHullIds.map(hullId => {
                                const hullData = SHIP_HULLS.find(h => h.id === hullId);
                                if (!hullData) return null;
                                const finalPrice = calculateFinalPrice(hullData.baseCost, selectedStation.shipHullPriceModifier, playerTradeDiscount);
                                const originalPrice = Math.floor(hullData.baseCost * (selectedStation.shipHullPriceModifier || 1.0));
                                const hasDiscount = playerTradeDiscount < 1.0 && finalPrice < originalPrice;
                                return (
                                    <div key={hullId} className="group p-6 bg-slate-950/80 border border-slate-800 rounded-3xl hover:border-amber-500/30 transition-all relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        
                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                          <div>
                                            <h4 className="text-lg font-display font-black text-white uppercase italic tracking-tighter group-hover:text-amber-400 transition-colors">{hullData.name}</h4>
                                            <p className="text-[10px] text-slate-500 font-technical uppercase tracking-widest">Modelo Estelar Padrão</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-lg font-display font-black text-white">{finalPrice.toLocaleString()} <span className="text-[10px] text-slate-500">CR</span></p>
                                            {hasDiscount && (
                                              <span className="text-[9px] font-technical text-emerald-400 italic">Preço de Frota Especial (-{((1 - playerTradeDiscount) * 100).toFixed(0)}%)</span>
                                            )}
                                          </div>
                                        </div>

                                        <p className="text-[11px] text-slate-400 leading-relaxed mb-6 italic relative z-10">"{hullData.description}"</p>
                                        
                                        <div className="grid grid-cols-2 gap-2 mb-6 text-[9px] font-technical relative z-10">
                                          <div className="flex items-center text-slate-400"><div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full mr-2"></div> Modules: {hullData.maxModuleSlots} Slots</div>
                                          <div className="flex items-center text-slate-400"><div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full mr-2"></div> Cargo: {hullData.baseStats.baseCargoCapacity} Unit</div>
                                          <div className="flex items-center text-slate-400"><div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full mr-2"></div> Speed: {hullData.baseStats.baseSpeed} AU/t</div>
                                          <div className="flex items-center text-slate-400"><div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full mr-2"></div> Hull: {hullData.baseStats.baseHullIntegrity} HP</div>
                                        </div>

                                        <button
                                            onClick={() => onBuyHull(hullId)}
                                            className="w-full btn-scifi-primary py-4 text-xs tracking-[0.2em] shadow-xl shadow-amber-500/10 disabled:opacity-30 disabled:scale-100"
                                            disabled={playerState.credits < finalPrice || isLoading}
                                        >
                                            Adquirir Casco
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                      <div className="flex-grow flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-slate-800 rounded-2xl p-10 text-center">
                        <Icons.Ship className="w-16 h-16 mb-4" />
                        <p className="text-sm font-technical uppercase tracking-widest italic">Este hangar não possui modelos disponíveis para venda imediata</p>
                      </div>
                    )}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ShipyardView;
