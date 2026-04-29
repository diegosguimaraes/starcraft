
import React from 'react';
import { CHARACTER_ORIGINS } from '../../constants'; 
import { CharacterOrigin } from '../../types';

interface CharacterCreationScreenProps {
  characterName: string;
  onCharacterNameChange: (name: string) => void;
  selectedOriginId: string;
  onOriginChange: (id: string) => void;
  onStartGame: (name: string, originId: string) => void;
  onBack: () => void;
  showError: (message: string) => void;
}

const CharacterCreationScreen: React.FC<CharacterCreationScreenProps> = ({
  characterName,
  onCharacterNameChange,
  selectedOriginId,
  onOriginChange,
  onStartGame,
  onBack,
  showError,
}) => {

  const renderOriginDetails = () => {
    if (!selectedOriginId) return null;
    const origin = CHARACTER_ORIGINS.find(o => o.id === selectedOriginId);
    if (!origin) return null;

    const createBonusJsx = () => {
        if (origin.startingBonus) {
            const bonusParts: string[] = [];
            if (origin.startingBonus.credits) bonusParts.push(`Créditos: ${origin.startingBonus.credits}`);
            if (origin.startingBonus.inventory) {
                 const invString = Object.entries(origin.startingBonus.inventory)
                                   .map(([k,v]) => `${k} x${v}`)
                                   .join(', ');
                if (invString) bonusParts.push(`Inventário: ${invString}`);
            }
            if (origin.startingBonus.researchPoints) bonusParts.push(`Pontos de Pesquisa: ${origin.startingBonus.researchPoints}`);
            if (origin.startingBonus.craftedItems && origin.startingBonus.craftedItems.length > 0) bonusParts.push(`Itens: ${origin.startingBonus.craftedItems.map(i => i.name).join(', ')}`);
            
            return <p className="text-xs text-yellow-400 mt-2">Bônus Inicial: {bonusParts.join('; ')}</p>;
        }
        return null;
    };

    return (
        <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-md">
            <p className="text-sm text-slate-400 mb-6 italic leading-relaxed">{origin.description}</p>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_#0ea5e9]"></div>
              <h4 className="text-[10px] font-technical uppercase tracking-[0.2em] text-sky-400">Atributos e Perks</h4>
            </div>

            <ul className="space-y-3 mb-6">
                {origin.perks.map(perk => (
                  <li key={perk.id} className="group">
                    <span className="text-xs font-display font-bold text-slate-200 group-hover:text-sky-400 transition-colors uppercase tracking-wide">{perk.name}</span>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">{perk.description}</p>
                  </li>
                ))}
            </ul>

            {origin.startingBonus && (
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                  <h4 className="text-[10px] font-technical uppercase tracking-[0.2em] text-emerald-400">Bônus Iniciais de Ativos</h4>
                </div>
                {createBonusJsx()}
              </div>
            )}
        </div>
    );
  };
    
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white p-8 overflow-hidden relative font-sans bg-scanline">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="text-center mb-10 z-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-[1px] w-8 bg-sky-500/30"></div>
          <span className="text-[10px] font-technical uppercase text-sky-500 tracking-[0.4em] opacity-70">Protocolo de Iniciação</span>
          <div className="h-[1px] w-8 bg-sky-500/30"></div>
        </div>
        <h2 className="text-5xl md:text-6xl font-display font-bold text-white tracking-tight uppercase italic">
          Criação de <span className="text-sky-500 text-glow-cyan">Registro</span>
        </h2>
      </div>

      <div className="w-full max-w-2xl relative z-10 group">
        {/* Subtle border wrap */}
        <div className="absolute -inset-[1px] bg-gradient-to-b from-sky-500/20 via-transparent to-sky-500/20 rounded-[2.2rem] opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <div className="glass-panel-heavy p-10 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-10">
          <div className="flex-1 space-y-8">
            <div className="space-y-6">
              <div className="group">
                <label htmlFor="characterName" className="block text-[9px] font-technical uppercase text-sky-500 tracking-[0.2em] mb-3 ml-1 opacity-60 group-focus-within:opacity-100 transition-opacity">
                  ID do Tripulante
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    id="characterName" 
                    value={characterName}
                    onChange={(e) => onCharacterNameChange(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-950/80 border border-slate-800 rounded-xl focus:border-sky-500/50 outline-none text-white placeholder-slate-700 transition-all font-display tracking-widest uppercase italic text-sm"
                    placeholder="IDENT-REQUIRED"
                    spellCheck={false}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-50 transition-opacity">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-sky-500"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  </div>
                </div>
              </div>

              <div className="group">
                <label htmlFor="characterOrigin" className="block text-[9px] font-technical uppercase text-sky-500 tracking-[0.2em] mb-3 ml-1 opacity-60 group-focus-within:opacity-100 transition-opacity">
                  Procedência Operacional
                </label>
                <div className="relative">
                  <select 
                    id="characterOrigin" 
                    value={selectedOriginId}
                    onChange={(e) => onOriginChange(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-950/80 border border-slate-800 rounded-xl focus:border-sky-500/50 outline-none appearance-none text-white font-display tracking-widest uppercase italic text-sm cursor-pointer transition-all" 
                  >
                    {CHARACTER_ORIGINS.map(origin => (
                      <option key={origin.id} value={origin.id} className="bg-slate-950">{origin.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-sky-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-6">
              <button 
                onClick={() => {
                  if (characterName.trim() && selectedOriginId) {
                    onStartGame(characterName.trim(), selectedOriginId);
                  } else {
                    showError("Por favor, preencha o nome e selecione uma origem.");
                  }
                }}
                className={`relative group overflow-hidden py-4 px-8 rounded-xl font-display font-black uppercase tracking-[0.3em] text-xs transition-all shadow-[0_0_30px_rgba(14,165,233,0.1)] active:scale-95
                  ${characterName.trim() && selectedOriginId ? 'bg-sky-500 text-slate-950 hover:shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:scale-[1.02]' : 'bg-slate-900 text-slate-600 cursor-not-allowed opacity-50'}`}
                disabled={!characterName.trim() || !selectedOriginId}
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]"></div>
                Iniciar Simulação
              </button>
              <button 
                onClick={onBack}
                className="py-4 px-8 rounded-xl bg-transparent border border-slate-800 text-slate-500 font-display font-bold uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-slate-900 hover:text-slate-300 active:scale-95"
              >
                Retornar ao Terminal
              </button>
            </div>
          </div>

          <div className="flex-[1.2] min-h-[300px]">
            {renderOriginDetails()}
          </div>
        </div>
      </div>

      <div className="mt-12 text-[9px] font-technical text-slate-500 uppercase tracking-[0.5em] opacity-30 flex items-center gap-4">
        <span>STC-NETWORK-CONNECTED</span>
        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
        <span>SECURE-AUTH-ENHANCED</span>
      </div>
    </div>
  );
};

export default CharacterCreationScreen;
