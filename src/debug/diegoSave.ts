

import { FullGameState, SavedGameMeta, PlayerState, CharacterOrigin, Ship, ShipModule, ShipHull, Item } from '../types';
import {
    GAME_VERSION,
    DEFAULT_PLAYER_SHIP_HULL_ID,
    SHIP_HULLS,
    INITIAL_SHIP_MODULES,
    CHARACTER_ORIGINS,
    INITIAL_PLAYER_STATE_BASE,
    ALL_STATIONS_DATA,
    SYSTEM_PLANETS,
    DEFAULT_BACKGROUND_MUSIC_VOLUME,
    INITIAL_FACTION_REPUTATIONS,
    STAR_SYSTEMS_DATA,
    CRAFTABLE_ITEMS, // Adicionado para o item de colonização
    INITIAL_TECH_TREE, // Adicionado para a ID da tecnologia de colonização
    INITIAL_RESOURCES // Adicionado para popular o inventário com todos os recursos
} from '../constants';
import { generateId as generateIdUtil, calculateShipStats } from '../utils';

const diegoOrigin: CharacterOrigin = CHARACTER_ORIGINS[0] || {
    id: 'mercenary', name: 'Mercenário Endurecido',
    description: 'Você viajou pela galáxia, lutando por quem pagasse mais. Suas habilidades de combate são inigualáveis, mas sua reputação é... mista.',
    perks: [{ id: 'acePilot', name: 'Piloto Ás', description: 'Concede bônus em combate de naves e manobrabilidade.' }],
    startingBonus: { credits: 1500 }
};

const createDebugShip = (): Ship => {
    const hull = SHIP_HULLS.find(h => h.id === DEFAULT_PLAYER_SHIP_HULL_ID) || SHIP_HULLS[0];
    if (!hull) {
        // Fallback if default hull is somehow not found - highly unlikely with current constants setup
        const fallbackHull: ShipHull = {
            id: 'fallback_hull', name: 'Fallback Freighter', description: 'Fallback basic hull',
            baseStats: { baseCargoCapacity: 100, baseSpeed: 30, baseShieldStrength: 10, baseHullIntegrity: 50, baseAttackPower: 0, baseDefenseRating: 1, baseKineticDamage: 0, baseEnergyDamage: 0, baseExplosiveDamage: 0, baseKineticResistance: 0, baseEnergyResistance: 0, baseExplosiveResistance: 0 },
            maxModuleSlots: 2, baseCost: 5000, initialModules: []
        };
        console.warn("Default ship hull not found for debug save, using a basic fallback.");
        const fallbackShip: Ship = {
            id: `ship_debug_diego_${generateIdUtil()}`, name: "Diego's Debug Cruiser", hullTypeId: fallbackHull.id,
            baseStats: { ...fallbackHull.baseStats }, modules: Array(fallbackHull.maxModuleSlots).fill(null), maxModuleSlots: fallbackHull.maxModuleSlots,
        };
        const fallbackStats = calculateShipStats(fallbackShip);
        fallbackShip.currentHullIntegrity = fallbackStats.totalHullIntegrity;
        fallbackShip.currentShieldStrength = fallbackStats.totalShieldStrength;
        return fallbackShip;
    }

    const newShip: Ship = {
        id: `ship_debug_diego_${generateIdUtil()}`,
        name: "Diego's Debug Cruiser",
        hullTypeId: hull.id,
        baseStats: { ...hull.baseStats },
        modules: (hull.initialModules?.map(modIdOrData => {
            if (typeof modIdOrData === 'string') {
                return INITIAL_SHIP_MODULES.find(m => m.id === modIdOrData) || null;
            }
            return modIdOrData;
        }) || Array(hull.maxModuleSlots).fill(null)).slice(0, hull.maxModuleSlots),
        maxModuleSlots: hull.maxModuleSlots,
    };
    const tempStats = calculateShipStats(newShip);
    newShip.currentHullIntegrity = tempStats.totalHullIntegrity;
    newShip.currentShieldStrength = tempStats.totalShieldStrength;
    return newShip;
};

const debugShip = createDebugShip();

const colonyHubModuleItemDefinition = CRAFTABLE_ITEMS.find(item => item.id === 'item_colony_hub_module');
const debugColonyHubItem: Item | undefined = colonyHubModuleItemDefinition
    ? { ...colonyHubModuleItemDefinition, id: `debug_colony_item_${generateIdUtil()}` }
    : undefined;

const initialCraftedItems = [...(INITIAL_PLAYER_STATE_BASE.craftedItems || []), ...(diegoOrigin.startingBonus?.craftedItems || [])];
if (debugColonyHubItem) {
    initialCraftedItems.push(debugColonyHubItem);
}

// Populate inventory with all resources
const debugInventory = {
    ...(INITIAL_PLAYER_STATE_BASE.inventory || {}),
    ...(diegoOrigin.startingBonus?.inventory || {})
};
INITIAL_RESOURCES.forEach(resource => {
    debugInventory[resource.name] = (debugInventory[resource.name] || 0) + 9000;
});


const diegoPlayerState: PlayerState = {
    ...INITIAL_PLAYER_STATE_BASE,
    characterName: "Diego",
    originId: diegoOrigin.id,
    activePerks: [...diegoOrigin.perks],
    credits: 999999999,
    inventory: debugInventory,
    craftedItems: initialCraftedItems,
    currentLocation: ALL_STATIONS_DATA.find(s => s.systemId === 'sol' && s.stationType !== 'planetary_port')?.id || 'station_alpha_centauri',
    currentSystemId: 'sol',
    knownSystemIds: ['sol', ...STAR_SYSTEMS_DATA.map(s => s.id)], // Know all systems
    lastTickTime: Date.now(),
    skillPoints: 100,
    researchPoints: 100,
    unlockedSkills: [], 
    unlockedTechs: ['tech_colony_1'], // Tecnologia de colonização desbloqueada
    ownedShips: [debugShip],
    currentShipId: debugShip.id,
    ownedShipModules: (debugShip.modules.filter(m => m !== null) as ShipModule[]).map(m_instance => ({...m_instance})),
    isTraveling: false,
    travelDetails: null,
    backgroundMusicVolume: DEFAULT_BACKGROUND_MUSIC_VOLUME,
    factionReputations: { ...INITIAL_FACTION_REPUTATIONS },
    activeTreaties: [],
    activePolicies: [], // Added activePolicies
    combatState: null,
    combatSummaryData: null,
};

export const diegoDebugGameState: FullGameState = {
    playerState: diegoPlayerState,
    discoveredPlanets: SYSTEM_PLANETS.map(p => ({...p, discoveredResources: p.discoveredResources || [] })),
    encounteredNPCs: [],
    activeMissions: [],
    discoveredStations: ALL_STATIONS_DATA.map(s => ({...s})),
    activeColonyEvents: [], // Initialize activeColonyEvents
    gameVersion: GAME_VERSION,
    lastView: 'galaxy',
    gameTickCounter: 0,
};

export const diegoDebugSaveSlotKey = `starcraftProceduralUniverse_save_debug_diego_max`;

export const diegoDebugSavedGameMeta: SavedGameMeta = {
    slotKey: diegoDebugSaveSlotKey,
    saveDate: new Date().toLocaleString('pt-BR'),
    characterName: diegoPlayerState.characterName,
    currentShipName: debugShip.name,
    timestamp: Date.now(),
    isQuickSave: false,
};
