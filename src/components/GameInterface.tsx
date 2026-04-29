
import React, { ReactNode, useState, useEffect, useCallback } from 'react';
import { PlayerState, Ship, ShipStats, GameView, GamePhase, StarSystem, Planet, SpaceStation, ColonyEvent } from '../types';
import { Icons, sanitizeLabelForImagePath, renderStoredIcon } from '../icons'; // Added sanitizeLabelForImagePath and renderStoredIcon

interface GameInterfaceProps {
  playerState: PlayerState;
  currentShip: Ship | null;
  currentCargoUsage: number;
  currentShipCalculatedStats: ShipStats;
  currentView: GameView;
  setCurrentView: (view: GameView) => void;
  setGamePhase: (phase: GamePhase) => void;
  gamePhase: GamePhase;
  showNotification: (message: string, duration?:number) => void;
  _starSystems: StarSystem[];
  discoveredPlanets: Planet[];
  discoveredStations: SpaceStation[];
  activeColonyEvents: ColonyEvent[];
  children: ReactNode;
}

// Internal component to handle dynamic icon loading with fallback
interface MenuIconRendererProps {
  label: string; // To generate PNG path
  iconKey: keyof typeof Icons; // Key for fallback SVG
  className?: string;
}

const MenuIconRenderer: React.FC<MenuIconRendererProps> = ({ label, iconKey, className = "w-5 h-5 mr-2 flex-shrink-0" }) => {
  const sanitizedLabel = sanitizeLabelForImagePath(label);
  const pngPath = `/assets/icons/${sanitizedLabel}.png`;
  
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    setImageStatus('loading'); // Reset when label (and thus pngPath) might change
  }, [pngPath]);

  const fallbackIconNode = Icons[iconKey] ? renderStoredIcon(iconKey, className) : 
    <div className={`${className} bg-yellow-500 opacity-70 rounded-sm`} title={`Fallback for ${label}`}>?</div>;


  if (imageStatus === 'error') {
    return <>{fallbackIconNode}</>; // Render the SVG component directly
  }

  return (
    <img
      src={pngPath}
      alt={`${label} icon`}
      className={className}
      onLoad={() => setImageStatus('loaded')}
      onError={() => {
        console.log(`PNG icon not found for label "${label}" (path: ${pngPath}). Falling back to SVG/default for key "${iconKey}".`);
        setImageStatus('error');
      }}
      style={{ display: imageStatus === 'loading' ? 'none' : 'inline-block' }} // Hide while loading, then show PNG or let fallback render
    />
  );
};


const GameInterface: React.FC<GameInterfaceProps> = ({
  playerState,
  currentShip,
  currentCargoUsage,
  currentShipCalculatedStats,
  currentView,
  setCurrentView,
  setGamePhase,
  gamePhase,
  showNotification,
  _starSystems,
  discoveredPlanets,
  discoveredStations,
  activeColonyEvents,
  children,
}) => {

  const isCurrentSystemKnown = playerState.currentSystemId && playerState.knownSystemIds.includes(playerState.currentSystemId);
  const currentSystemObj = playerState.currentSystemId ? _starSystems.find(s => s.id === playerState.currentSystemId) : null;
  const currentSystemName = isCurrentSystemKnown && currentSystemObj ? currentSystemObj.name : "Sistema Desconhecido";

  let locationName = "Localização Desconhecida";
  const currentLocationObject = discoveredPlanets.find(p => p.id === playerState.currentLocation) || discoveredStations.find(s => s.id === playerState.currentLocation);

  if (currentLocationObject) {
    const isLocationSystemKnown = playerState.knownSystemIds.includes(currentLocationObject.systemId);
    if (isLocationSystemKnown) {
        locationName = currentLocationObject.name;
    } else {
        locationName = `Local Desconhecido em ${currentSystemName}`;
    }
  } else if (playerState.currentSystemId) {
    locationName = `Órbita de ${currentSystemName}`;
  }

  const unresolvedColonyEventsCount = activeColonyEvents.filter(event => event.activeChoices && event.activeChoices.length > 0 && !event.isResolved).length;

  const handlePrefetchView = useCallback((view: GameView) => {
    console.log(`[Prefetch] Simulating prefetch for view: ${view}`);
    // In a production app with code-splitting (e.g., React.lazy), 
    // this is where you might trigger a dynamic import:
    // Example:
    // switch (view) {
    //   case 'galaxy': 
    //     import('../views/GalaxyView').then(module => console.log('[Prefetch] GalaxyView module preloaded')); 
    //     break;
    //   // ... other cases for other lazy-loaded views
    // }

    // Alternatively, you might prefetch data for the view:
    // Example:
    // if (view === 'planet' && somePlanetIdToPrefetch) {
    //   api.prefetchPlanetData(somePlanetIdToPrefetch).then(() => console.log('[Prefetch] Data for a planet view preloaded'));
    // }
  }, []);


  const renderNavButton = (view: GameView, label: string, iconKey: keyof typeof Icons, testId?: string, condition?: boolean) => {
    if (condition === false) return null;

    const gamePhaseForNav = playerState.isTraveling ? 'playing' : (currentView === 'profile' || currentView === 'skillTree' || currentView === 'techTree' ? 'profileView' : 'playing');
    const isActive = currentView === view && gamePhaseForNav !== 'profileView' && gamePhase !== 'combatView';
    const isProfileActive = (view === 'profile' && gamePhaseForNav === 'profileView');
    
    let displayLabel = label;
    if (view === 'colonies' && unresolvedColonyEventsCount > 0) {
      displayLabel = `${label} (${unresolvedColonyEventsCount}!)`;
    }

    return (
      <button
        key={view}
        data-testid={testId || `nav-${view}`}
        onClick={() => {
          if (playerState?.isTraveling) {
            showNotification("Não é possível mudar de visão durante a viagem.");
            return;
          }
          if (playerState?.combatState?.isActive && view !== 'galaxy' && view !== 'combat') {
            showNotification("Funcionalidade limitada durante o combate. Volte para a visão de combate para ações completas ou para a galáxia para tentar escapar.");
            return; 
          }

          if (view === 'profile') {
            setGamePhase('profileView');
            setCurrentView('profile');
          } else {
            setGamePhase('playing'); 
            setCurrentView(view);
          }
        }}
        onMouseEnter={() => {
          if (!playerState?.isTraveling && !playerState?.combatState?.isActive) {
            handlePrefetchView(view);
          }
        }}
        className={`flex items-center px-4 py-2.5 text-xs font-display font-medium rounded-lg transition-all transform active:scale-95 whitespace-nowrap relative border
                    ${(isActive || isProfileActive) 
                      ? 'bg-sky-500/20 text-sky-300 border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.2)]' 
                      : 'text-slate-400 border-transparent hover:border-slate-700 hover:bg-slate-800/50 hover:text-slate-200'}
                    ${(playerState?.isTraveling && view !== 'galaxy') || (playerState?.combatState?.isActive && view !== 'galaxy' && view !== 'combat' ) ? 'opacity-30 cursor-not-allowed' : ''}
                    ${view === 'colonies' && unresolvedColonyEventsCount > 0 ? 'text-amber-400 hover:text-amber-300 border-amber-500/30' : ''}
                  `}
        disabled={(playerState?.isTraveling && view !== 'galaxy') || (playerState?.combatState?.isActive && view !== 'galaxy' && view !== 'combat') }
      >
        <MenuIconRenderer label={label} iconKey={iconKey} className="w-4 h-4 mr-2" />
        <span className="uppercase tracking-widest">{displayLabel}</span>
         {view === 'colonies' && unresolvedColonyEventsCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/40">
              {unresolvedColonyEventsCount}
            </span>
        )}
      </button>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-scifi-dark text-slate-200 overflow-hidden">
      <header className="bg-slate-950/90 backdrop-blur-xl p-1 md:p-4 grid grid-cols-2 md:grid-cols-3 items-stretch gap-1 md:gap-4 border-b border-white/5 z-20 relative shrink-0">
          {/* Animated scanline effect */}
          <div className="absolute inset-0 bg-scanline pointer-events-none opacity-[0.03]"></div>
          
          {/* Player Info Panel */}
          <div className="glass-panel p-2 md:p-4 rounded-lg md:rounded-2xl shadow-xl border-sky-500/10 flex flex-col space-y-0.5 md:space-y-2 order-1 min-h-[60px] md:min-h-[100px] justify-center transition-all hover:bg-slate-900/60 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 blur-[20px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-sky-500/10 transition-colors"></div>
              
              <div className="flex items-center border-b border-white/5 pb-1 mb-1 md:pb-2 md:mb-2">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-sky-500/10 flex items-center justify-center mr-2 md:mr-3 border border-sky-500/20 group-hover:scale-110 transition-transform flex-shrink-0">
                  <Icons.Character className="w-4 h-4 md:w-5 md:h-5 text-sky-400 group-hover:animate-pulse" />
                </div>
                <div className="flex flex-col overflow-hidden">
                   <span className="text-[8px] md:text-[10px] font-technical uppercase tracking-[0.2em] text-slate-500 leading-none mb-0.5 md:mb-1">Comandante</span>
                   <span className="text-sm md:text-xl font-display font-black text-white truncate tracking-tight lowercase italic" title={playerState.characterName}>
                     {playerState.characterName}
                   </span>
                </div>
              </div>
              <div className="flex items-center">
                 <Icons.Credits className="w-3 h-3 md:w-4 md:h-4 mr-2 md:mr-3 text-emerald-400 flex-shrink-0" />
                 <div className="flex flex-col">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs md:text-lg font-technical font-bold text-emerald-400 tracking-tight">
                        {playerState.credits.toLocaleString()}
                      </span>
                      <span className="text-[7px] md:text-[9px] font-technical text-emerald-500/50 uppercase tracking-widest font-black">CR</span>
                    </div>
                 </div>
              </div>
          </div>

          {/* Location Info Panel */}
          <div className="glass-panel p-2 md:p-4 rounded-lg md:rounded-2xl shadow-xl border-indigo-500/10 flex flex-col space-y-0.5 md:space-y-2 order-2 md:order-2 min-h-[60px] md:min-h-[100px] justify-center transition-all hover:bg-slate-900/60 group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-[20px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-colors"></div>
               
               <div className="flex items-center">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center mr-2 md:mr-3 border border-indigo-500/20 flex-shrink-0">
                      <Icons.Galaxy className="w-4 h-4 md:w-5 md:h-5 text-indigo-400 group-hover:rotate-180 transition-transform duration-[4s] ease-linear" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[8px] md:text-[10px] font-technical uppercase tracking-[0.2em] text-slate-500 leading-none mb-0.5 md:mb-1 truncate">Setor</span>
                      <span className="text-sm md:text-lg font-display font-black text-indigo-300 truncate tracking-tight uppercase italic" title={currentSystemName}>
                          {currentSystemName}
                      </span>
                    </div>
               </div>
               <div className="flex items-center pt-1 border-t border-white/5 mt-0.5 md:mt-1">
                    <Icons.Planet className="w-3 h-3 md:w-3.5 md:h-3.5 mr-2 md:mr-3 text-indigo-400/50 flex-shrink-0" />
                    <span className="text-[9px] md:text-[11px] font-display font-bold text-slate-400 truncate tracking-widest uppercase italic" title={locationName}>
                        {locationName}
                    </span>
               </div>
          </div>

          {/* Ship Info Panel */}
          <div className="glass-panel p-2 md:p-4 rounded-lg md:rounded-2xl shadow-xl border-amber-500/10 flex flex-col space-y-0.5 md:space-y-1 md:space-y-2 order-3 md:order-3 col-span-2 md:col-span-1 min-h-[60px] md:min-h-[100px] justify-center transition-all hover:bg-slate-900/60 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-[20px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/10 transition-colors"></div>
            
            <div className="flex items-center border-b border-white/5 pb-1 mb-1 md:pb-2 md:mb-2 text-xs md:text-sm">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mr-2 md:mr-3 border border-amber-500/20 group-hover:scale-110 transition-transform flex-shrink-0">
                <Icons.Shipyard className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
              </div>
              <div className="flex flex-col overflow-hidden">
                 <span className="text-[8px] md:text-[10px] font-technical uppercase tracking-[0.2em] text-slate-500 leading-none mb-0.5 md:mb-1">Nave</span>
                 <span className="text-xs md:text-lg font-display font-black text-amber-400 truncate tracking-tight uppercase italic" title={currentShip?.name || 'Vazio'}>
                   {currentShip?.name || 'Vazio'}
                 </span>
              </div>
            </div>
            <div className="text-[7px] md:text-[10px] font-technical grid grid-cols-4 md:grid-cols-2 gap-x-1.5 md:gap-x-6 gap-y-0.5 md:gap-y-2 text-slate-500 uppercase tracking-widest font-bold">
              <div className="flex items-center justify-between group">
                 <span className="flex items-center gap-1 md:gap-1.5"><Icons.Inventory className="w-2 h-2 md:w-3 md:h-3 text-amber-500/50"/> CGO</span>
                 <span className="text-slate-300">{Math.round((currentCargoUsage / currentShipCalculatedStats.totalCargoCapacity) * 100)}%</span>
              </div>
              <div className="flex items-center justify-between group">
                 <span className="flex items-center gap-1 md:gap-1.5"><Icons.Speed className="w-2 h-2 md:w-3 md:h-3 text-amber-500/50"/> SPD</span>
                 <span className="text-slate-300">{currentShipCalculatedStats.totalSpeed}</span>
              </div>
              <div className="flex items-center justify-between group">
                 <span className="flex items-center gap-1 md:gap-1.5"><Icons.Combat className="w-2 h-2 md:w-3 md:h-3 text-amber-500/50"/> SHD</span>
                 <span className="text-sky-400">{Math.round(((currentShip?.currentShieldStrength || currentShipCalculatedStats.totalShieldStrength) / currentShipCalculatedStats.totalShieldStrength) * 100)}%</span>
              </div>
              <div className="flex items-center justify-between group">
                 <span className="flex items-center gap-1 md:gap-1.5"><Icons.Hull className="w-2 h-2 md:w-3 md:h-3 text-amber-500/50"/> HUL</span>
                 <span className="text-rose-400">{Math.round(((currentShip?.currentHullIntegrity || currentShipCalculatedStats.totalHullIntegrity) / currentShipCalculatedStats.totalHullIntegrity) * 100)}%</span>
              </div>
            </div>
          </div>
      </header>
      
      <nav className="bg-slate-900/60 backdrop-blur-sm px-2 md:px-4 py-1.5 md:py-2 flex flex-row items-center justify-between overflow-x-auto no-scrollbar whitespace-nowrap border-b border-sky-500/10 z-10 shrink-0 sticky top-0">
        <div className="flex space-x-1">
          {renderNavButton('galaxy', 'Galáxia', 'Galaxy', 'nav-galaxy')}
          {renderNavButton('inventory', 'Inventário', 'Inventory', 'nav-inventory')}
          {renderNavButton('missions', 'Missões', 'Mission', 'nav-missions')}
          {renderNavButton('crafting', 'Fabricação', 'Crafting', 'nav-crafting')}
          {renderNavButton('colonies', 'Colônias', 'Colony', 'nav-colonies', true)}
          {renderNavButton('npcs', 'PNJs', 'NPC', 'nav-npcs')}
          {renderNavButton('diplomacy', 'Diplomacia', 'Diplomacy', 'nav-diplomacy')}
          {renderNavButton('hangar', 'Hangar', 'Hangar', 'nav-hangar', true)}
          {renderNavButton('policies', 'Políticas', 'Policies', 'nav-policies', true)} 
          {renderNavButton('profile', 'Perfil', 'Profile', 'nav-profile')}
        </div>
        <button
            onClick={() => setGamePhase('paused')}
            className={`ml-2 md:ml-4 flex-shrink-0 flex items-center px-3 md:px-4 py-2 md:py-2.5 text-[10px] md:text-xs font-display font-medium rounded-lg text-slate-400 border border-transparent hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-all uppercase tracking-widest
                        ${(playerState?.isTraveling || playerState?.combatState?.isActive) ? 'opacity-30 cursor-not-allowed' : ''}`}
            disabled={(playerState?.isTraveling || playerState?.combatState?.isActive)}
            title="Pausar / Menu Principal"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 0010.5 21h3a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
            Menu
        </button>
      </nav>

      <main className="flex-1 overflow-hidden relative flex flex-col bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.05)_0%,transparent_50%)]">
          {children}
      </main>
    </div>
  );
};

export default GameInterface;
