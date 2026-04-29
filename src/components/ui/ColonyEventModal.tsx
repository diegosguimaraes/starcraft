import React from 'react';
import Modal from '../Modal'; // Adjust path as necessary
import { ColonyEvent, ColonyEventChoice, ColonyEventEffectType } from '../../types'; // Adjust path
import { Icons } from '../../icons'; // Adjust path
import { getResourceImagePath } from '../../constants'; // Adjust path

interface ColonyEventModalProps {
  event: ColonyEvent | null;
  onMakeChoice: (eventId: string, choiceId: string) => void;
  onClose: () => void; // For dismissing/deferring if allowed, or after a choice
}

const ColonyEventModal: React.FC<ColonyEventModalProps> = ({ event, onMakeChoice, onClose }) => {
  if (!event) return null;

  const getEffectPreview = (choice: ColonyEventChoice): string => {
    if (choice.tooltip) return choice.tooltip;

    let previewParts: string[] = [];
    choice.effects.forEach(effect => {
      switch (effect.type) {
        case ColonyEventEffectType.CREDIT_CHANGE:
          previewParts.push(`${effect.amount > 0 ? '+' : ''}${effect.amount} Créditos`);
          break;
        case ColonyEventEffectType.RESOURCE_CHANGE:
          if (effect.resourceName) {
            previewParts.push(`${effect.amount > 0 ? '+' : ''}${effect.amount} ${effect.resourceName}`);
          }
          break;
        case ColonyEventEffectType.RESEARCH_POINTS_CHANGE:
          previewParts.push(`${effect.amount > 0 ? '+' : ''}${effect.amount} Pontos de Pesquisa`);
          break;
        case ColonyEventEffectType.POPULATION_CHANGE:
            previewParts.push(`${effect.amount > 0 ? '+' : ''}${effect.amount} População`);
            break;
        case ColonyEventEffectType.MORALE_CHANGE:
            previewParts.push(`Moral ${effect.amount > 0 ? '+' : ''}${effect.amount}`);
            break;
        default:
          if (effect.message) previewParts.push(effect.message);
          break;
      }
    });
    return previewParts.join(', ') || "Nenhum efeito direto visível.";
  };

  return (
    <Modal isOpen={!!event} onClose={onClose} title={event.title} size="lg">
      <div className="flex flex-col gap-8 font-sans">
        <div className="bg-slate-900/60 p-8 rounded-2xl border border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-[50px] -translate-y-1/2 translate-x-1/2"></div>
           
           <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(14,165,233,0.2)]">
                 <Icons.Colonies className="w-6 h-6 text-sky-500" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-technical uppercase tracking-[0.4em] text-sky-500/70">Comunicado do Governador</span>
                 <h4 className="text-xl font-display font-black text-white italic tracking-tight uppercase leading-none">Situação de Colônia</h4>
              </div>
           </div>

           <div className="space-y-4">
             <p className="text-lg text-slate-300 italic leading-relaxed font-display border-l-2 border-sky-500/30 pl-6 py-2">
               "{event.description}"
             </p>
             <div className="flex items-center gap-4 py-2 opacity-40">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-500 to-transparent"></div>
                <span className="text-[8px] font-technical uppercase tracking-[0.5em] text-slate-500">Transmissão Criptografada Ativa</span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-slate-500 to-transparent"></div>
             </div>
           </div>
        </div>

        {event.activeChoices && event.activeChoices.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-[10px] font-technical uppercase tracking-[0.4em] text-slate-500 ml-4 mb-2">Decisões Administrativas</h4>
            <div className="grid grid-cols-1 gap-3">
              {event.activeChoices.map(choice => {
                const preview = getEffectPreview(choice);
                return (
                  <button
                    key={choice.id}
                    onClick={() => onMakeChoice(event.id, choice.id)}
                    className="group relative w-full text-left p-6 bg-slate-900 border border-white/5 rounded-2xl hover:border-sky-500/50 transition-all hover:scale-[1.01] active:scale-[0.99] overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-sky-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-display font-black text-white uppercase italic tracking-wide group-hover:text-sky-400 transition-colors">{choice.text}</p>
                        {choice.tooltip && <p className="text-xs text-slate-500 italic font-display">{choice.tooltip}</p>}
                      </div>
                      <div className="flex flex-col items-end opacity-40 group-hover:opacity-100 transition-opacity text-right">
                         <span className="text-[8px] font-technical text-slate-400 uppercase tracking-widest mb-1">Impacto Estimado</span>
                         <span className="text-[10px] font-technical text-emerald-400 font-bold uppercase">{preview}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {(!event.activeChoices || event.activeChoices.length === 0) && (
           <button
              onClick={onClose}
              className="w-full relative group overflow-hidden py-4 px-8 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 font-display font-bold uppercase tracking-[0.3em] text-[10px] transition-all hover:bg-slate-800 hover:text-white hover:border-slate-600 active:scale-95"
          >
              <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]"></div>
              Dispensar Comunicado
          </button>
        )}
      </div>
    </Modal>
  );
};

export default ColonyEventModal;
