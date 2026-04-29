
import React from 'react';
import { CombatState, CombatActionType, ShipStats, CombatParticipantStats, ShipModule } from '../../types';
import { Icons } from '../../icons'; // Corrected path
import LoadingSpinner from '../LoadingSpinner';

interface CombatViewProps {
  combatState: CombatState;
  playerShipStats: ShipStats;
  onPlayerAction: (action: CombatActionType, actionTarget?: string | { moduleId: string }) => void;
}

const CombatView: React.FC<CombatViewProps> = ({ combatState, playerShipStats, onPlayerAction }) => {
  if (!combatState || !combatState.isActive) {
    return (
        <div className="fixed inset-0 bg-gray-950 bg-opacity-95 text-white flex flex-col p-4 md:p-8 z-50 items-center justify-center">
            <LoadingSpinner message="Finalizando combate..." />
        </div>
    );
  }

  const playerParticipant = combatState.participants.find(p => p.isPlayer);
  const enemyParticipant = combatState.participants.find(p => !p.isPlayer);

  if (!playerParticipant || !enemyParticipant) {
    return (
        <div className="fixed inset-0 bg-gray-950 bg-opacity-95 text-white flex flex-col p-4 md:p-8 z-50 items-center justify-center">
            <LoadingSpinner message="Carregando participantes do combate..." />
        </div>
    );
  }

  const isPlayerTurn = combatState.currentTurnParticipantId === playerParticipant.shipId;
  const currentTurnParticipant = combatState.participants.find(p => p.shipId === combatState.currentTurnParticipantId);

  const renderParticipantPanel = (participant: CombatParticipantStats, isPlayerSide: boolean) => {
    const isActiveTurn = participant.shipId === combatState.currentTurnParticipantId;
    const themeColor = isPlayerSide ? 'sky' : 'red';
    
    const panelClasses = `relative p-4 md:p-6 rounded-2xl md:rounded-3xl transition-all duration-500 overflow-hidden ${
        isActiveTurn 
          ? `glass-panel-heavy border-${themeColor}-500/50 shadow-[0_0_40px_rgba(${isPlayerSide ? '14,165,233' : '239,68,68'},0.2)] ring-1 ring-${themeColor}-500/30` 
          : `glass-panel border-slate-800/40 opacity-80 grayscale-[20%]`
      }`;

    const hullPercentage = participant.maxHull > 0 ? Math.max(0, (participant.currentHull / participant.maxHull) * 100) : 0;
    const shieldPercentage = participant.maxShields > 0 ? Math.max(0, (participant.currentShields / participant.maxShields) * 100) : 0;

    return (
      <div className={panelClasses} role="region" aria-labelledby={`${isPlayerSide ? 'player' : 'enemy'}-ship-label`}>
        {/* Animated Scanline for Active Turn */}
        {isActiveTurn && (
          <div className={`absolute top-0 left-0 w-full h-0.5 bg-${themeColor}-500/50 shadow-[0_0_10px_#${isPlayerSide ? '0ea5e9' : 'ef4444'}] animate-scanline z-0 opacity-40`}></div>
        )}

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${isActiveTurn ? `bg-${themeColor}-500/20 border-${themeColor}-500/40 text-${themeColor}-400` : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                <Icons.Hangar />
              </div>
              <div>
                <div className="text-[10px] font-technical text-slate-500 uppercase tracking-widest leading-none mb-1">Assinatura de Nave</div>
                <h3 id={`${isPlayerSide ? 'player' : 'enemy'}-ship-label`} className={`text-2xl font-display font-bold tracking-tight ${isActiveTurn ? 'text-white' : 'text-slate-400'} truncate uppercase italic`}>
                  {participant.name}
                </h3>
              </div>
            </div>
            
            {isActiveTurn && (
              <div className={`flex items-center space-x-2 text-${themeColor}-500`}>
                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                <span className="text-[8px] font-technical uppercase tracking-[0.3em]">Em Foco</span>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {/* Shield Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-technical uppercase tracking-widest text-sky-400/80">Sistemas de Escudo</span>
                <span className="text-xs font-mono text-sky-400 font-bold">{participant.currentShields.toLocaleString()} <span className="opacity-40">/ {participant.maxShields.toLocaleString()}</span></span>
              </div>
              <div className="h-2.5 w-full bg-slate-900/80 rounded-full border border-slate-800/50 p-0.5 overflow-hidden flex">
                <div 
                  className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.5)] transition-all duration-700 ease-out relative"
                  style={{ width: `${shieldPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-shimmer"></div>
                </div>
              </div>
            </div>

            {/* Hull Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-technical uppercase tracking-widest text-rose-400/80">Integridade Estrutural</span>
                <span className="text-xs font-mono text-rose-400 font-bold">{participant.currentHull.toLocaleString()} <span className="opacity-40">/ {participant.maxHull.toLocaleString()}</span></span>
              </div>
              <div className="h-2.5 w-full bg-slate-900/80 rounded-full border border-slate-800/50 p-0.5 overflow-hidden flex space-x-0.5">
                {/* Segmented Hull Bar for Tech Feel */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <div 
                    key={i}
                    className={`h-full flex-grow transition-all duration-500 rounded-sm ${i < (hullPercentage / 5) ? 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.3)]' : 'bg-slate-800 animate-pulse-slow'}`}
                    style={{ transitionDelay: `${i * 20}ms` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const usableSpecialModules = playerParticipant.modules.filter(
    (mod): mod is ShipModule =>
      mod !== null &&
      mod.type === 'special_utility' &&
      mod.effects.repairAmount !== undefined // Can be expanded for other direct-use effects
  );

  return (
    <div className="fixed inset-0 bg-scifi-dark text-white flex flex-col p-2 md:p-8 z-50 overflow-y-auto custom-scrollbar">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_70%)] animate-pulse-slow"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent shadow-[0_0_20px_rgba(239,68,68,0.5)]"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent shadow-[0_0_20px_rgba(239,68,68,0.5)]"></div>

      {/* Header / Turn Indicator */}
      <div className="relative text-center mb-6 md:mb-10 z-10 p-2">
        <div className="flex flex-col items-center">
          <span className="text-[8px] md:text-[10px] font-technical text-red-500 uppercase tracking-[0.5em] mb-1 md:mb-2 animate-pulse">Engajamento Hostil Detectado</span>
          <h2 className="text-2xl md:text-5xl font-display font-black text-white tracking-tighter mb-1 md:mb-2 italic">
            STATUS: <span className="text-red-500 glow-text-red">COMBATE</span>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-2 md:mt-4">
            <div className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full glass-panel border-scifi text-[8px] md:text-[10px] font-technical uppercase tracking-widest ${isPlayerTurn ? 'bg-sky-500/20 border-sky-500/50 text-sky-400 ring-2 ring-sky-500/20' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              {currentTurnParticipant ? (isPlayerTurn ? ">> Seu Turno <<" : `Turno: ${currentTurnParticipant.name}`) : "Calculando..."}
            </div>
            <div className="px-3 md:px-4 py-1 md:py-1.5 rounded-full glass-panel border-slate-700/50 text-[8px] md:text-[10px] font-technical uppercase tracking-widest text-slate-400">
              Rodada: {combatState.roundCounter}
            </div>
          </div>
        </div>
      </div>

      {/* Participant Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-10 mb-4 md:mb-8 flex-grow content-center z-10 max-w-7xl mx-auto w-full px-2 md:px-0">
        {renderParticipantPanel(playerParticipant, true)}
        {renderParticipantPanel(enemyParticipant, false)}
      </div>

      {/* Bottom Section: Logs & Controls */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6 z-10">
        {/* Combat Log */}
        <div className="lg:col-span-1 glass-panel-heavy p-3 md:p-4 rounded-xl md:rounded-2xl h-32 md:h-44 overflow-y-auto border-slate-800/50 relative shadow-2xl">
          <div className="absolute top-2 md:top-3 right-4 text-[8px] font-technical text-slate-500 uppercase tracking-widest text-right">Buffer</div>
          <div className="space-y-2 mt-4">
            {combatState.combatLog.map((log, index) => (
              <div key={index} className="flex space-x-2 md:space-x-3 items-start border-l border-slate-800/50 pl-2 md:pl-3">
                <span className="text-[8px] md:text-[9px] font-technical text-slate-600 mt-0.5">[{index.toString().padStart(3, '0')}]</span>
                <p className="text-[10px] md:text-xs text-slate-300 leading-relaxed font-mono">
                  {log.includes("Dano") ? <span className="text-red-400">{log}</span> : log}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Player Actions */}
        <div className="lg:col-span-2 glass-panel-heavy p-6 rounded-2xl border-slate-800/50 flex flex-col justify-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-500/5 rounded-full blur-3xl"></div>
          
          {isPlayerTurn ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              <button
                onClick={() => onPlayerAction('ATTACK_PRIMARY', enemyParticipant.shipId)}
                className="btn-scifi group relative overflow-hidden bg-red-600/20 border-red-500/40 text-red-500 hover:bg-red-500 hover:text-white py-2 md:py-4 font-display font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs transition-all"
                aria-label="Atacar alvo principal"
              >
                <span className="relative z-10">Atacar</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
              
              <button
                onClick={() => onPlayerAction('DEFEND')}
                className="btn-scifi group relative overflow-hidden bg-sky-600/20 border-sky-500/40 text-sky-500 hover:bg-sky-500 hover:text-white py-2 md:py-4 font-display font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs transition-all"
                aria-label="Assumir postura defensiva"
              >
                <span className="relative z-10">Defender</span>
                <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>

              <button
                onClick={() => onPlayerAction('FLEE')}
                className="btn-scifi group relative overflow-hidden bg-amber-600/20 border-amber-500/40 text-amber-500 hover:bg-amber-500 hover:text-slate-900 py-2 md:py-4 font-display font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs transition-all"
                aria-label="Tentar fugir do combate"
              >
                <span className="relative z-10">Fugir</span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>

              {usableSpecialModules.length === 0 ? (
                <button
                  className="btn-scifi opacity-30 cursor-not-allowed py-4 font-display font-bold uppercase tracking-[0.2em] text-[10px] bg-slate-800 border-slate-700"
                  disabled={true}
                >
                  Indisponível
                </button>
              ) : (
                usableSpecialModules.map(module => {
                  const cooldown = playerParticipant.moduleCooldowns?.[module.id] || 0;
                  const canUseModule = isPlayerTurn && cooldown <= 0;
                  return (
                    <button
                      key={module.id}
                      onClick={() => onPlayerAction('USE_MODULE', { moduleId: module.id })}
                      className={`btn-scifi group relative overflow-hidden py-4 font-display font-bold uppercase tracking-[0.1em] text-[10px] transition-all
                        ${canUseModule ? 'bg-purple-600/20 border-purple-500/40 text-purple-500 hover:bg-purple-500 hover:text-white' : 'opacity-40 cursor-not-allowed bg-slate-800 border-slate-700'}`}
                      disabled={!canUseModule}
                      title={cooldown > 0 ? `Recarga: ${cooldown} turnos` : module.description}
                    >
                      <span className="relative z-10">{module.name.substring(0,10)}{cooldown > 0 ? ` (${cooldown}T)` : ''}</span>
                      {canUseModule && <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-fuchsia-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="flex space-x-2 mb-4">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping [animation-delay:0.4s]"></div>
              </div>
              <p className="text-[10px] font-technical uppercase tracking-[0.4em] text-red-500 animate-pulse">Processando ação do oponente...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CombatView;
