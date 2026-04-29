
import React from 'react';
import { NPC, NPCRole, PlayerState, Ship } from '../../types';
import { Icons } from '../../icons'; // Corrected path
import LoadingSpinner from '../LoadingSpinner';

interface NpcViewProps {
  selectedNpc: NPC | null;
  npcInteractionMessage: string;
  onSetNpcInteractionMessage: (message: string) => void;
  onNpcInteract: () => void;
  onEncounterNpc: () => void;
  isLoading: boolean;
  playerState: PlayerState | null;
  getTranslatedNpcRole: (role: NPCRole) => string;
  onStartCombat: (enemyShip: Ship) => void;
}

const NpcView: React.FC<NpcViewProps> = ({
  selectedNpc,
  npcInteractionMessage,
  onSetNpcInteractionMessage,
  onNpcInteract,
  onEncounterNpc,
  isLoading,
  playerState,
  getTranslatedNpcRole,
  onStartCombat
}) => {
  if (!selectedNpc) {
    return (
      <div className="flex-1 overflow-y-auto custom-scrollbar p-1 md:p-6 h-full">
        <div className="p-8 glass-panel rounded-3xl shadow-xl text-gray-200 min-h-full flex flex-col items-center justify-center border-sky-500/10 text-center relative overflow-hidden backdrop-blur-xl mb-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05)_0%,transparent_70%)] animate-pulse-slow"></div>
            
            <div className="relative z-10 max-w-md">
              <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Icons.NPC className="w-10 h-10 text-sky-500/50" />
              </div>
              <h2 className="text-4xl font-display font-bold text-white tracking-tight glow-text-cyan uppercase italic mb-4">Frequências Livres</h2>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">Não há transmissões ativas em seu raio de alcance atual. Continue explorando a galáxia para interceptar sinais de comunicação.</p>
              
              <button
                  onClick={onEncounterNpc}
                  className="w-full btn-scifi btn-scifi-primary py-4 text-xs tracking-[0.2em] shadow-xl shadow-sky-500/10"
                  disabled={isLoading || playerState?.isTraveling || playerState?.combatState?.isActive}
              >
                  <div className="flex items-center justify-center">
                    <Icons.System className="w-4 h-4 mr-3 animate-spin-slow" />
                    Varredura de Sinais Locais
                  </div>
              </button>
              <p className="mt-4 text-[10px] font-technical text-slate-600 uppercase tracking-widest italic">Iniciando protocolo de busca aleatória...</p>
            </div>
        </div>
      </div>
    );
  }

  const canChallengePirate = selectedNpc.role === NPCRole.PIRATE && selectedNpc.ship && !playerState?.combatState?.isActive;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-1 md:p-6 h-full">
      <div className="p-8 glass-panel rounded-3xl shadow-xl text-gray-200 min-h-full flex flex-col border-sky-500/10 relative overflow-hidden backdrop-blur-xl mb-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

        <div className="mb-8 pb-6 border-b border-slate-700/50 flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-center">
            <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center shadow-xl transition-all duration-500 ${selectedNpc.role === NPCRole.PIRATE ? 'bg-rose-500/10 border-rose-500/40 shadow-rose-500/10' : 'bg-sky-500/10 border-sky-500/40 shadow-sky-500/10'}`}>
              {selectedNpc.role === NPCRole.PIRATE ? <Icons.Combat className="w-8 h-8 text-rose-500" /> : <Icons.NPC className="w-8 h-8 text-sky-500" />}
            </div>
            <div className="ml-6">
              <h2 className="text-3xl font-display font-bold text-white tracking-tight uppercase italic">{selectedNpc.name}</h2>
              <div className="flex items-center mt-1">
                <span className={`text-[9px] font-technical uppercase tracking-widest px-2 py-0.5 rounded border ${selectedNpc.role === NPCRole.PIRATE ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' : 'bg-sky-500/20 border-sky-500/40 text-sky-400'}`}>
                  {getTranslatedNpcRole(selectedNpc.role)}
                </span>
                <span className="text-[10px] font-technical text-slate-500 uppercase tracking-widest ml-3">{selectedNpc.factionId || 'Independente'} • Registro ID: {selectedNpc.id.substring(0, 8)}</span>
              </div>
            </div>
          </div>

          {canChallengePirate && (
            <button
              onClick={() => onStartCombat(selectedNpc.ship!)}
              className="btn-scifi py-3 px-6 text-[10px] uppercase tracking-[0.2em] bg-rose-500/10 border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-slate-900 shadow-xl shadow-rose-500/10 animate-pulse"
              disabled={isLoading || playerState?.isTraveling}
            >
              Iniciar Protocolo de Combate
            </button>
          )}
        </div>

        <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-2xl mb-8">
          <p className="text-[11px] text-slate-400 leading-relaxed italic">"{selectedNpc.backstory}"</p>
        </div>

        <div className="flex-grow bg-slate-950/60 p-6 rounded-3xl mb-6 overflow-y-auto border border-slate-800/50 custom-scrollbar-small relative group">
            <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-slate-950 to-transparent z-10 pointer-events-none"></div>
            
            <div className="space-y-4">
              {selectedNpc.dialogueHistory.map((entry, index) => (
                  <div key={index} className={`flex flex-col ${entry.speaker === 'Player' ? 'items-end' : 'items-start'}`}>
                      <div className={`text-[8px] font-technical uppercase tracking-widest mb-1 ${entry.speaker === 'Player' ? 'text-sky-500' : 'text-slate-500'}`}>
                        {entry.speaker === 'Player' ? 'Você' : selectedNpc.name}
                      </div>
                      <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                        entry.speaker === 'Player' 
                          ? 'bg-sky-600/20 border border-sky-500/30 text-sky-100 rounded-tr-none' 
                          : 'bg-slate-800/60 border border-slate-700/50 text-slate-200 rounded-tl-none shadow-lg'
                      }`}>
                          {entry.message}
                      </div>
                  </div>
              ))}
              {isLoading && selectedNpc.dialogueHistory.length > 0 && selectedNpc.dialogueHistory[selectedNpc.dialogueHistory.length-1].speaker === 'Player' && (
                   <div className="flex flex-col items-start scale-75 origin-left opacity-60">
                      <div className="text-[8px] font-technical uppercase tracking-widest mb-1 text-slate-500">{selectedNpc.name}</div>
                      <div className="bg-slate-800/30 border border-slate-800/50 px-5 py-3 rounded-2xl rounded-tl-none">
                        <div className="flex space-x-1 items-center h-4">
                          <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce"></div>
                        </div>
                      </div>
                   </div>
              )}
            </div>
            
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-950 to-transparent z-10 pointer-events-none"></div>
        </div>

        <div className="flex gap-3 relative z-20">
            <input
                type="text"
                value={npcInteractionMessage}
                onChange={(e) => onSetNpcInteractionMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && onNpcInteract()}
                placeholder="Estabelecer frequência de rádio..."
                className="flex-grow p-4 bg-slate-900 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 outline-none text-white text-sm transition-all"
                disabled={isLoading || playerState?.combatState?.isActive}
            />
            <button
                onClick={onNpcInteract}
                className={`btn-scifi-primary py-4 px-8 text-xs tracking-widest uppercase flex items-center shadow-xl shadow-sky-500/5 ${!npcInteractionMessage.trim() || isLoading ? 'opacity-30' : ''}`}
                disabled={isLoading || !npcInteractionMessage.trim() || playerState?.combatState?.isActive}
            >
                Transmitir
            </button>
        </div>
      </div>
    </div>
  );
};

export default NpcView;
