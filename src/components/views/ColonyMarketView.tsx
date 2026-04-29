
import React, { useState } from 'react';
import { PlayerState, SpaceStation, Resource, MarketListing } from '../../types';
import { Icons } from '../../icons'; // Corrected path
import { getResourceImagePath, MAX_RESOURCE_STOCK_PER_ITEM, INITIAL_RESOURCES } from '../../constants'; // Corrected path, added INITIAL_RESOURCES
import LoadingSpinner from '../LoadingSpinner';

interface ColonyMarketViewProps {
  playerState: PlayerState | null;
  marketStation: SpaceStation | null;
  allResources: Resource[];
  onBuy: (resourceName: string, quantity: number, stationId: string) => void;
  onSell: (resourceName: string, quantity: number, stationId: string) => void;
  onBack: () => void;
  playerTradeDiscount: number;
  isLoading: boolean;
}

const ColonyMarketView: React.FC<ColonyMarketViewProps> = ({
  playerState,
  marketStation,
  allResources,
  onBuy,
  onSell,
  onBack,
  playerTradeDiscount,
  isLoading
}) => {
  const [buyQuantities, setBuyQuantities] = useState<Record<string, string>>({});
  const [sellQuantities, setSellQuantities] = useState<Record<string, string>>({});

  if (!playerState || !marketStation || !marketStation.marketInventory) {
    return <div className="p-6 bg-gray-850 rounded-lg shadow-xl text-gray-200 h-full flex items-center justify-center"><LoadingSpinner message="Carregando dados do mercado..." /></div>;
  }

  const handleQuantityChange = (
    resourceName: string,
    value: string,
    type: 'buy' | 'sell',
    maxStock?: number,
    stationBuyLimit?: number
  ) => {
    const numValue = parseInt(value, 10);
    let effectiveMaxStock = maxStock !== undefined ? maxStock : Infinity;

    if (type === 'sell' && stationBuyLimit !== undefined) {
      effectiveMaxStock = Math.min(effectiveMaxStock, stationBuyLimit - (marketStation.marketInventory?.[resourceName]?.quantity || 0) );
    }

    const clampedValue = Math.max(0, Math.min(isNaN(numValue) ? 0 : numValue, effectiveMaxStock));

    if (type === 'buy') {
      setBuyQuantities(prev => ({ ...prev, [resourceName]: String(clampedValue) }));
    } else {
      setSellQuantities(prev => ({ ...prev, [resourceName]: String(clampedValue) }));
    }
  };

  const calculateEffectiveSellPrice = (resourceName: string): number => { // Station Sells to Player
      const resource = allResources.find(r => r.name === resourceName);
      const listing = marketStation.marketInventory?.[resourceName];
      if (!resource || !listing) return 0;
      return Math.floor(resource.baseValue * listing.sellPriceModifier * playerTradeDiscount);
  };

  const calculateEffectiveBuyPrice = (resourceName: string): number => { // Station Buys from Player
      const resource = allResources.find(r => r.name === resourceName);
      const listing = marketStation.marketInventory?.[resourceName];
      if (!resource || !listing) return 0;
      // Trade agreements typically don't increase player's sell price unless specifically designed to
      return Math.floor(resource.baseValue * listing.buyPriceModifier);
  };

  const itemsToSellByColony = Object.entries(marketStation.marketInventory || {} as Record<string, MarketListing>)
    .filter(([_, listing]) => ((listing as MarketListing).isProduced && (listing as MarketListing).quantity > 0) || ((listing as MarketListing).sellPriceModifier > 0 && (listing as MarketListing).quantity > 0 && !(listing as MarketListing).isConsumed) )
    .map(([resourceName, listing]) => ({ resourceName, ...listing as MarketListing }));

  const itemsToBuyByColony = Object.entries(marketStation.marketInventory || {} as Record<string, MarketListing>)
    .filter(([_, listing]) => ((listing as MarketListing).isConsumed && (listing as MarketListing).quantity < MAX_RESOURCE_STOCK_PER_ITEM) || ((listing as MarketListing).buyPriceModifier > 0 && !(listing as MarketListing).isProduced) )
    .map(([resourceName, listing]) => ({ resourceName, ...listing as MarketListing }));


  const renderMarketItem = (
    item: { resourceName: string } & MarketListing,
    type: 'buy' | 'sell'
  ) => {
    const resource = allResources.find(r => r.name === item.resourceName);
    if (!resource) return null;

    const imagePath = getResourceImagePath(item.resourceName);
    const currentQuantityInput = type === 'buy' ? (buyQuantities[item.resourceName] || '1') : (sellQuantities[item.resourceName] || '1');
    const stationStock = item.quantity;
    const playerStock = playerState.inventory[item.resourceName] || 0;
    const price = type === 'buy' ? calculateEffectiveSellPrice(item.resourceName) : calculateEffectiveBuyPrice(item.resourceName);

    const effectiveMaxBuy = stationStock;
    const effectiveMaxSell = playerStock;
    const stationWillBuyUpTo = MAX_RESOURCE_STOCK_PER_ITEM - stationStock;


    return (
      <div key={`${type}-${item.resourceName}`} className="p-3 bg-gray-700 rounded-md shadow">
        <div className="flex items-center mb-1">
          {imagePath && <img src={imagePath} alt={item.resourceName} className="w-7 h-7 mr-2 object-contain rounded animate-pulse" />}
          <span className="font-semibold text-md text-yellow-300">{item.resourceName}</span>
        </div>
        <p className="text-xs text-gray-400">Preço: {price} CR/unid.</p>
        {type === 'buy' && <p className="text-xs text-gray-400">Estoque da Colônia: {stationStock.toLocaleString()}</p>}
        {type === 'sell' && <p className="text-xs text-gray-400">Seu Estoque: {playerStock.toLocaleString()}</p>}
        {type === 'sell' && marketStation.marketInventory?.[item.resourceName]?.isConsumed &&
            <p className="text-xs text-gray-400">Colônia Compra até: {(MAX_RESOURCE_STOCK_PER_ITEM - stationStock).toLocaleString()} (Total: {MAX_RESOURCE_STOCK_PER_ITEM})</p>
        }

        <div className="flex items-center mt-2 space-x-2">
          <input
            type="number"
            value={currentQuantityInput}
            onChange={(e) => handleQuantityChange(
                item.resourceName,
                e.target.value,
                type,
                type === 'buy' ? effectiveMaxBuy : effectiveMaxSell,
                type === 'sell' ? MAX_RESOURCE_STOCK_PER_ITEM : undefined
            )}
            min="0"
            max={type === 'buy' ? effectiveMaxBuy : (type === 'sell' ? Math.min(effectiveMaxSell, stationWillBuyUpTo) : undefined)}
            className="w-20 p-1.5 bg-gray-600 border border-gray-500 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
            disabled={isLoading}
          />
          <button
            onClick={() => {
              const qty = parseInt(currentQuantityInput, 10);
              if (qty > 0) {
                if (type === 'buy') onBuy(item.resourceName, qty, marketStation.id);
                else onSell(item.resourceName, qty, marketStation.id);
              }
            }}
            className={`flex-1 py-1.5 px-3 text-sm rounded-md shadow font-medium transition-colors duration-150 ease-in-out
                        ${type === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
                        disabled:bg-gray-500 disabled:cursor-not-allowed`}
            disabled={isLoading || parseInt(currentQuantityInput, 10) === 0 || (type === 'buy' && playerState.credits < price * parseInt(currentQuantityInput, 10)) || (type === 'sell' && stationWillBuyUpTo <=0 && marketStation.marketInventory?.[item.resourceName]?.isConsumed )}
            title={type === 'buy' && playerState.credits < price * parseInt(currentQuantityInput, 10) ? 'Créditos insuficientes' : (type === 'sell' && stationWillBuyUpTo <=0 && marketStation.marketInventory?.[item.resourceName]?.isConsumed ? 'Estação não precisa mais deste item' : '')}
          >
            {type === 'buy' ? 'Comprar' : 'Vender'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-1 md:p-6 h-full">
      <div className="p-8 glass-panel rounded-3xl shadow-xl text-gray-200 min-h-full flex flex-col border-sky-500/10 relative overflow-hidden backdrop-blur-xl mb-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

      <div className="mb-8 pb-6 border-b border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <button 
            onClick={onBack} 
            className="group btn-scifi py-2 px-4 text-[10px] uppercase tracking-widest flex items-center border-slate-700 text-slate-400 hover:text-sky-400"
          >
            <div className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1 font-bold">←</div>
            Terminar Negociação
          </button>
          
          <div className="text-center">
            <h2 className="text-4xl font-display font-bold text-sky-400 tracking-tight glow-text-cyan uppercase italic flex items-center justify-center">
                Portal de Comércio: {marketStation.name}
            </h2>
            <p className="text-[10px] font-technical text-slate-500 uppercase tracking-[0.3em] mt-1">Intercâmbio de Recursos • Protocolos de Transação Ativos</p>
          </div>

          <div className="px-6 py-3 bg-slate-900/60 border border-emerald-500/20 rounded-2xl flex flex-col items-end">
            <span className="text-[8px] font-technical text-slate-500 uppercase tracking-widest leading-none mb-1">Créditos Disponíveis</span>
            <span className="text-lg font-technical font-black text-emerald-400 leading-none">
              {playerState.credits.toLocaleString()} <span className="text-[10px] text-emerald-600">CR</span>
            </span>
          </div>
      </div>

      {playerTradeDiscount < 1.0 && (
          <div className="mb-6 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-center text-[10px] font-technical text-emerald-400 uppercase tracking-widest">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse shadow-[0_0_8px_#10b981]"></div>
            Acordo Comercial Ativo: Transações de aquisição com {((1 - playerTradeDiscount) * 100).toFixed(0)}% de abatimento institucional.
          </div>
      )}

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden">
        {/* Seção de Venda da Colônia (Compra do Jogador) */}
        <div className="bg-slate-950/40 p-6 rounded-3xl border border-slate-800 flex flex-col overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-20 bg-emerald-500/50 group-hover:h-full transition-all duration-700 opacity-20"></div>
          
          <h3 className="text-xs font-display font-bold text-emerald-400 mb-6 uppercase tracking-widest flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-3"></div>
            Disponível para Aquisição
            <span className="ml-auto text-slate-600 font-technical text-[9px]">{itemsToSellByColony.length} Ativos</span>
          </h3>
          
          {itemsToSellByColony.length > 0 ? (
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar-small flex-grow">
              {itemsToSellByColony.map((item) => {
                const resource = allResources.find(r => r.name === item.resourceName);
                if (!resource) return null;
                const imagePath = getResourceImagePath(item.resourceName);
                const currentQuantityInput = buyQuantities[item.resourceName] || '1';
                const price = calculateEffectiveSellPrice(item.resourceName);
                const stationStock = item.quantity;
                const totalPrice = price * parseInt(currentQuantityInput, 10);
                const canAfford = playerState.credits >= totalPrice;

                return (
                  <div key={`sell-${item.resourceName}`} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-emerald-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center mr-4 group-hover:border-emerald-500/20 transition-colors">
                          {imagePath ? <img src={imagePath} alt={item.resourceName} className="w-8 h-8 object-contain" /> : <Icons.Inventory className="w-5 h-5 text-slate-700" />}
                        </div>
                        <div>
                          <p className="text-sm font-display font-bold text-white uppercase italic tracking-wide group-hover:text-emerald-400 transition-colors">{item.resourceName}</p>
                          <p className="text-[10px] font-technical text-slate-500 uppercase tracking-widest mt-1">Disp: {stationStock.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-technical font-black text-white">{price} <span className="text-[8px] text-slate-500">CR/U</span></p>
                        {playerTradeDiscount < 1.0 && <p className="text-[8px] text-emerald-500 font-technical italic">-Abatimento Aplicado-</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative flex-grow">
                        <input
                          type="number"
                          value={currentQuantityInput}
                          onChange={(e) => handleQuantityChange(item.resourceName, e.target.value, 'buy', stationStock)}
                          className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-technical focus:border-emerald-500/50 outline-none pr-12 transition-all"
                        />
                        <button onClick={() => handleQuantityChange(item.resourceName, String(stationStock), 'buy', stationStock)} className="absolute right-2 top-1.5 text-[8px] font-technical uppercase tracking-tighter text-slate-600 hover:text-emerald-500 transition-colors pt-1 px-1">Max</button>
                      </div>
                      <button
                        onClick={() => {
                          const qty = parseInt(currentQuantityInput, 10);
                          if (qty > 0) onBuy(item.resourceName, qty, marketStation.id);
                        }}
                        className={`py-2.5 px-6 rounded-xl text-[10px] font-display font-bold uppercase tracking-widest transition-all
                          ${canAfford && parseInt(currentQuantityInput, 10) > 0 ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-slate-900 shadow-lg shadow-emerald-500/5' : 'bg-slate-950 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'}`}
                        disabled={isLoading || !canAfford || parseInt(currentQuantityInput, 10) <= 0}
                      >
                        Adquirir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-slate-900 rounded-3xl p-10 text-center">
              <p className="text-xs font-technical uppercase tracking-widest italic">Nenhum excedente para exportação disponível</p>
            </div>
          )}
        </div>

        {/* Seção de Compra da Colônia (Venda do Jogador) */}
        <div className="bg-slate-950/40 p-6 rounded-3xl border border-slate-800 flex flex-col overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-20 bg-sky-500/50 group-hover:h-full transition-all duration-700 opacity-20"></div>
          
          <h3 className="text-xs font-display font-bold text-sky-400 mb-6 uppercase tracking-widest flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mr-3"></div>
            Demanda Operacional Local
            <span className="ml-auto text-slate-600 font-technical text-[9px]">{itemsToBuyByColony.length} Requisitados</span>
          </h3>

          {itemsToBuyByColony.length > 0 ? (
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar-small flex-grow">
              {itemsToBuyByColony.map((item) => {
                const resource = allResources.find(r => r.name === item.resourceName);
                if (!resource) return null;
                const imagePath = getResourceImagePath(item.resourceName);
                const currentQuantityInput = sellQuantities[item.resourceName] || '1';
                const price = calculateEffectiveBuyPrice(item.resourceName);
                const playerStock = playerState.inventory[item.resourceName] || 0;
                const stationWillBuyUpTo = MAX_RESOURCE_STOCK_PER_ITEM - item.quantity;
                const maxQty = Math.min(playerStock, stationWillBuyUpTo);
                const isLimitReached = stationWillBuyUpTo <= 0 && item.isConsumed;

                return (
                  <div key={`buy-${item.resourceName}`} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-sky-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center mr-4 group-hover:border-sky-500/20 transition-colors">
                          {imagePath ? <img src={imagePath} alt={item.resourceName} className="w-8 h-8 object-contain" /> : <Icons.Inventory className="w-5 h-5 text-slate-700" />}
                        </div>
                        <div>
                          <p className="text-sm font-display font-bold text-white uppercase italic tracking-wide group-hover:text-sky-400 transition-colors">{item.resourceName}</p>
                          <p className="text-[10px] font-technical text-slate-500 uppercase tracking-widest mt-1">Seu Cofre: {playerStock.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-technical font-black text-white">{price} <span className="text-[8px] text-slate-500">CR/U</span></p>
                        {item.isConsumed && <div className="text-[8px] font-technical text-sky-500 uppercase">Cap. Doca: {stationWillBuyUpTo.toLocaleString()}</div>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative flex-grow">
                        <input
                          type="number"
                          value={currentQuantityInput}
                          onChange={(e) => handleQuantityChange(item.resourceName, e.target.value, 'sell', playerStock, MAX_RESOURCE_STOCK_PER_ITEM)}
                          className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-technical focus:border-sky-500/50 outline-none pr-12 transition-all"
                          disabled={isLimitReached}
                        />
                        {!isLimitReached && (
                          <button onClick={() => handleQuantityChange(item.resourceName, String(maxQty), 'sell', playerStock, MAX_RESOURCE_STOCK_PER_ITEM)} className="absolute right-2 top-1.5 text-[8px] font-technical uppercase tracking-tighter text-slate-600 hover:text-sky-500 transition-colors pt-1 px-1">Max</button>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          const qty = parseInt(currentQuantityInput, 10);
                          if (qty > 0) onSell(item.resourceName, qty, marketStation.id);
                        }}
                        className={`py-2.5 px-6 rounded-xl text-[10px] font-display font-bold uppercase tracking-widest transition-all
                          ${!isLimitReached && parseInt(currentQuantityInput, 10) > 0 && parseInt(currentQuantityInput, 10) <= maxQty ? 'bg-sky-500/10 border border-sky-500/40 text-sky-400 hover:bg-sky-500 hover:text-slate-900 shadow-lg shadow-sky-500/5' : 'bg-slate-950 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'}`}
                        disabled={isLoading || isLimitReached || parseInt(currentQuantityInput, 10) <= 0 || parseInt(currentQuantityInput, 10) > maxQty}
                      >
                        {isLimitReached ? 'Doca Cheia' : 'Ofertar'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-slate-900 rounded-3xl p-10 text-center">
              <p className="text-xs font-technical uppercase tracking-widest italic">Nenhuma requisição de insumos externos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default ColonyMarketView;
