
import { Item, Resource, NPCRole, CharacterOrigin, PlayerState, Perk, SkillNode, TechNode, Ship, ShipModule, SpaceStation, ShipModuleType, ShipHull, StarSystem, Planet, StationType, FactionInfo, DiplomaticStatus, DiplomaticAction, TreatyType, MarketListing, NPC, ColonialBuildingDefinition, PolicyDefinition, ActivePolicy, ColonyEventTypeDefinition, ColonyEventEffectType } from './types';
import { createShipFromHull as utilCreateShipFromHull } from './utils'; // Renamed to avoid conflict

export const GAME_TICK_INTERVAL_MS = 15000;
export const POPULATION_GROWTH_RATE_PER_TICK = 0.005;

export const GAME_SAVE_KEY_PREFIX = 'starcraftProceduralUniverse_save_';
export const SAVE_METADATA_KEY = `${GAME_SAVE_KEY_PREFIX}meta_slots`;
export const GAME_VERSION = '0.9.31-colony-consumption'; // Version bump

export const INITIAL_SKILL_POINTS = 1;
export const INITIAL_RESEARCH_POINTS = 0;
export const TICKS_FOR_SKILL_POINT_GAIN = 5;
export const TICKS_FOR_RESEARCH_POINT_GAIN = 8;
export const SKILL_POINTS_PER_GAIN = 1;
export const RESEARCH_POINTS_PER_GAIN = 1;

export const RESOURCE_UNIT_WEIGHT = 1;
export const MODULE_SELL_PRICE_MODIFIER = 0.5;

export const BACKGROUND_MUSIC_URL = '/assets/audio/background_music.mp3';
export const DEFAULT_BACKGROUND_MUSIC_VOLUME = 0.20;

// --- MARKET CONSTANTS ---
export const MARKET_STOCK_REFRESH_INTERVAL_TICKS = 5;
export const MARKET_STOCK_ADJUSTMENT_AMOUNT = 10;
export const MAX_RESOURCE_STOCK_PER_ITEM = 5000;
export const MIN_RESOURCE_STOCK_PER_ITEM = 10;

// --- SHIP REPAIR CONSTANTS ---
export const REPAIR_COST_PER_HULL_POINT_CREDITS = 5;
export const REPAIR_COST_PER_HULL_POINT_TITANIUM = 0.2;
export const REPAIR_RESOURCE_NAME = 'Placas de Titânio';


// --- GALAXY MAP CONSTANTS ---
export const POSSIBLE_FACTIONS_NAMES = ["Terran Directorate", "Hypatian Alliance", "Consórcio de Comércio Terrestre", "Independentes da Fronteira", "Unclaimed", "Sindicato K'Tharr (Piratas)", "Coletivo Zenith (Pesquisa)", "Soberania de Vega (Local)"];

export const FACTION_COLORS: Record<string, string> = {
  "Terran Directorate": "bg-red-700 hover:bg-red-600 border-red-500 text-red-100",
  "Hypatian Alliance": "bg-blue-700 hover:bg-blue-600 border-blue-500 text-blue-100",
  "Consórcio de Comércio Terrestre": "bg-green-700 hover:bg-green-600 border-green-500 text-green-100",
  "Independentes da Fronteira": "bg-yellow-600 hover:bg-yellow-500 border-yellow-400 text-yellow-50",
  "Unclaimed": "bg-gray-600 hover:bg-gray-500 border-gray-400 text-gray-100",
  "Sindicato K'Tharr (Piratas)": "bg-orange-700 hover:bg-orange-600 border-orange-500 text-orange-100",
  "Coletivo Zenith (Pesquisa)": "bg-purple-700 hover:bg-purple-600 border-purple-500 text-purple-100",
  "Soberania de Vega (Local)": "bg-teal-700 hover:bg-teal-600 border-teal-500 text-teal-100",
  "Unknown": "bg-pink-800 hover:bg-pink-700 border-pink-600 text-pink-100"
};

export const ALL_FACTIONS_DATA: FactionInfo[] = [
  { id: "terran_directorate", name: "Terran Directorate", description: "Uma potência humana expansiva e militarista, focada na ordem e controle.", colorClass: FACTION_COLORS["Terran Directorate"], homeSystemIds: ["sol"], traits: ["Militarista", "Expansionista", "Ordeira"] },
  { id: "hypatian_alliance", name: "Hypatian Alliance", description: "Uma aliança de mundos focada em pesquisa científica, tecnologia avançada e diplomacia.", colorClass: FACTION_COLORS["Hypatian Alliance"], homeSystemIds: ["sys_12_epsilon_reticuli"], traits: ["Científica", "Tecnológica", "Diplomática"] },
  { id: "trade_consortium", name: "Consórcio de Comércio Terrestre", description: "Uma vasta rede de corporações e mundos mercantes, priorizando o lucro e o comércio livre.", colorClass: FACTION_COLORS["Consórcio de Comércio Terrestre"], traits: ["Comercial", "Corporativa", "Pragmática"] },
  { id: "frontier_independents", name: "Independentes da Fronteira", description: "Uma coleção solta de colonos, mineradores e aventureiros que valorizam a liberdade e a auto-suficiência.", colorClass: FACTION_COLORS["Independentes da Fronteira"], traits: ["Individualista", "Resiliente", "Exploradora"] },
  { id: "ktharr_syndicate", name: "Sindicato K'Tharr (Piratas)", description: "Uma notória organização pirata, conhecida por saques, contrabando e operações no mercado negro.", colorClass: FACTION_COLORS["Sindicato K'Tharr (Piratas)"], traits: ["Pirata", "Oportunista", "Violenta"] },
  { id: "zenith_collective", name: "Coletivo Zenith (Pesquisa)", description: "Um grupo enigmático dedicado à busca do conhecimento proibido e tecnologias exóticas.", colorClass: FACTION_COLORS["Coletivo Zenith (Pesquisa)"], traits: ["Pesquisa Avançada", "Secreta", "Tecnologicamente Focada"] },
  { id: "vega_sovereignty", name: "Soberania de Vega (Local)", description: "Uma facção local com forte presença no sistema Vega e arredores, focada na defesa e prosperidade regional.", colorClass: FACTION_COLORS["Soberania de Vega (Local)"], homeSystemIds: ["sys_10_vega"], traits: ["Regionalista", "Defensiva", "Isolacionista"] }
];

export const INITIAL_FACTION_REPUTATIONS: Record<string, number> = {
  "terran_directorate": 0,
  "hypatian_alliance": 10,
  "trade_consortium": 0,
  "frontier_independents": 5,
  "ktharr_syndicate": -20,
  "zenith_collective": -5,
  "vega_sovereignty": 0,
};

export const REPUTATION_THRESHOLDS: Record<DiplomaticStatus, number> = {
  [DiplomaticStatus.War]: -75,
  [DiplomaticStatus.Hostile]: -30,
  [DiplomaticStatus.Neutral]: 0,
  [DiplomaticStatus.Friendly]: 30,
  [DiplomaticStatus.Alliance]: 75
};

export const TRADE_AGREEMENT_PRICE_MODIFIER = 0.05;
export const TRADE_AGREEMENT_DURATION_TICKS = 200;
export const NON_AGGRESSION_PACT_DURATION_TICKS = 100;

export const BASIC_DIPLOMATIC_ACTIONS: DiplomaticAction[] = [
  { id: "offer_gift_small", name: "Oferecer Pequeno Presente", description: "Oferece um pequeno presente para melhorar as relações.", reputationEffect: 5, cost: 1000, unavailableIfStatus: [DiplomaticStatus.War] },
  { id: "offer_gift_medium", name: "Oferecer Presente Significativo", description: "Oferece um presente considerável para melhorar significativamente as relações.", reputationEffect: 15, cost: 5000, unavailableIfStatus: [DiplomaticStatus.War] },
  { id: "insult_faction", name: "Insultar Facção", description: "Envia uma mensagem provocativa, piorando as relações.", reputationEffect: -10, unavailableIfStatus: [DiplomaticStatus.War, DiplomaticStatus.Alliance] },
  {
    id: "propose_trade_agreement",
    name: "Propor Acordo Comercial",
    description: "Estabelece um acordo comercial, concedendo descontos em compras e bônus em vendas por um período.",
    reputationEffect: 10,
    cost: 2500,
    requiresStatus: [DiplomaticStatus.Friendly, DiplomaticStatus.Alliance],
    createsTreaty: TreatyType.TradeAgreement,
    treatyDurationTicks: TRADE_AGREEMENT_DURATION_TICKS,
    requiresNoActiveTreatyOfType: TreatyType.TradeAgreement,
    unavailableIfStatus: [DiplomaticStatus.War, DiplomaticStatus.Hostile]
  },
  {
    id: "propose_non_aggression_pact",
    name: "Propor Pacto de Não Agressão",
    description: "Firma um pacto com uma facção para evitar hostilidades mútuas por um período.",
    reputationEffect: 10,
    cost: 7500,
    requiresStatus: [DiplomaticStatus.Neutral, DiplomaticStatus.Friendly],
    unavailableIfStatus: [DiplomaticStatus.War, DiplomaticStatus.Hostile],
    createsTreaty: TreatyType.NonAggressionPact,
    treatyDurationTicks: NON_AGGRESSION_PACT_DURATION_TICKS,
    requiresNoActiveTreatyOfType: TreatyType.NonAggressionPact,
  },
  {
    id: "declare_war",
    name: "Declarar Guerra",
    description: "Inicia hostilidades formais contra esta facção. Isto quebrará quaisquer acordos existentes.",
    reputationEffect: -100,
    cost: 0,
    setsStatusTo: DiplomaticStatus.War,
    breaksExistingTreatyTypes: [TreatyType.TradeAgreement, TreatyType.NonAggressionPact, TreatyType.Alliance],
    unavailableIfStatus: [DiplomaticStatus.War]
  },
];


export const SCAN_SYSTEM_COST_CREDITS = 100;
export const BASE_SCANNER_RANGE_AU = 10;

// --- TRAVEL CONSTANTS ---
export const TRAVEL_BASE_CREDIT_COST = 50;
export const TRAVEL_TIME_BASE_TICKS_PER_HOP = 1;
export const TRAVEL_TIME_SPEED_DIVISOR = 20;

// --- ANOMALY CONSTANTS ---
export const ANOMALY_SCAN_COST_CREDITS = 150;
export const ANOMALY_FIND_CHANCE = 0.20;
export const ANOMALY_MODULE_CHANCE = 0.10;
export const ANOMALY_RESOURCE_CHANCE = 0.50;
export const ANOMALY_ARTIFACT_CHANCE = 0.30;
export const FINDABLE_MODULE_IDS_VIA_ANOMALY: string[] = ['sm_engine_basic', 'sm_cargo_small', 'sm_shield_light', 'sm_cargo_auxiliary', 'sm_scanner_short'];
export const ANOMALY_BASE_RESOURCE_REWARD_QUANTITY = 10;

// --- ARTIFACTS ---
export const DISCOVERABLE_ARTIFACTS: Item[] = [
  {
    id: 'artifact_template_001',
    name: 'Fragmento Alienígena Desconhecido',
    description: 'Um pedaço de tecnologia alienígena de origem e propósito incertos. Parece pulsar com uma energia fraca.',
    type: 'artifact',
    craftingRecipe: {},
    researchPointsYield: 10,

  },
  {
    id: 'artifact_template_002',
    name: 'Orbe de Dados Antigo',
    description: 'Uma esfera lisa e escura que emite um leve zumbido. Pode conter informações valiosas.',
    type: 'artifact',
    craftingRecipe: {},
    researchPointsYield: 15,
  },
  {
    id: 'artifact_template_003',
    name: 'Relíquia Precursora Entalhada',
    description: 'Um tablete de material desconhecido coberto por símbolos indecifráveis. Irradia uma sensação de grande idade.',
    type: 'artifact',
    craftingRecipe: {},
    researchPointsYield: 25,
  },
];


// --- DYNAMIC GALAXY GENERATION ---
const STAR_COLOR_CLASSES = [
  'bg-yellow-400', 'bg-orange-400', 'bg-red-500',
  'bg-sky-300',    'bg-blue-400',   'bg-indigo-400',
  'bg-purple-400', 'bg-pink-400',
  'bg-lime-300',   'bg-green-400',
  'bg-slate-200' // White/Pale
];


const REAL_STAR_SYSTEMS = [
  { realName: 'Alpha Centauri', name: 'Centauri Prime', position: { x: 55, y: 53 }, starColorCss: STAR_COLOR_CLASSES[0] },
  { realName: 'Proxima Centauri', name: 'Proxima', position: { x: 56, y: 54 }, starColorCss: STAR_COLOR_CLASSES[2] },
  { realName: "Barnard's Star", name: "Barnard's Star", position: { x: 60, y: 48 }, starColorCss: STAR_COLOR_CLASSES[1] },
  { realName: 'Sirius', name: 'Sirius', position: { x: 48, y: 60 }, starColorCss: STAR_COLOR_CLASSES[10] },
  { realName: 'Tau Ceti', name: 'Tau Ceti', position: { x: 60, y: 55 }, starColorCss: STAR_COLOR_CLASSES[0] },
  { realName: 'Epsilon Eridani', name: 'Epsilon Eridani', position: { x: 45, y: 58 }, starColorCss: STAR_COLOR_CLASSES[1] },
  { realName: 'TRAPPIST-1', name: 'Trappist', position: { x: 70, y: 45 }, starColorCss: STAR_COLOR_CLASSES[2] },
  { realName: 'Luyten\'s Star', name: 'Luyten', position: { x: 62, y: 52 }, starColorCss: STAR_COLOR_CLASSES[2] },
  { realName: 'Ross 128', name: 'Ross', position: { x: 67, y: 50 }, starColorCss: STAR_COLOR_CLASSES[2] },
  { realName: 'Wolf 359', name: 'Wolf', position: { x: 53, y: 47 }, starColorCss: STAR_COLOR_CLASSES[2] },
  { realName: 'Vega', name: 'Vega', position: { x: 75, y: 40 }, starColorCss: STAR_COLOR_CLASSES[10] },
  { realName: 'Arcturus', name: 'Arcturus', position: { x: 40, y: 40 }, starColorCss: STAR_COLOR_CLASSES[1] },
  { realName: 'Epsilon Reticuli', name: 'Epsilon Reticuli', position: { x: 40, y: 80 }, starColorCss: STAR_COLOR_CLASSES[1] },
  { realName: 'HD 10647', name: 'Helios', position: { x: 65, y: 85 }, starColorCss: STAR_COLOR_CLASSES[0] },
  { realName: 'Gliese 581', name: 'Gliese', position: { x: 30, y: 65 }, starColorCss: STAR_COLOR_CLASSES[2] },
  { realName: 'Kepler-186', name: 'Kepler', position: { x: 80, y: 70 }, starColorCss: STAR_COLOR_CLASSES[1] },
  { realName: 'Lalande 21185', name: 'Lalande', position: { x: 42, y: 52 }, starColorCss: STAR_COLOR_CLASSES[2] },
  { realName: 'Procyon', name: 'Procyon', position: { x: 58, y: 62 }, starColorCss: STAR_COLOR_CLASSES[10] },
  { realName: 'Kapteyn\'s Star', name: 'Kapteyn', position: { x: 35, y: 45 }, starColorCss: STAR_COLOR_CLASSES[2] },
  { realName: 'Van Maanen\'s Star', name: 'Van Maanen', position: { x: 72, y: 58 }, starColorCss: STAR_COLOR_CLASSES[10] },
];


export const PLANET_TYPES: { biome: string; type: 'terrestrial' | 'gasGiant' | 'iceGiant'; habitable: boolean; defaultDesc: string; }[] = [
  { biome: 'Continental Temperado', type: 'terrestrial', habitable: true, defaultDesc: "Um mundo com continentes e oceanos, clima ameno e potencial para vida diversificada." },
  { biome: 'Deserto Vermelho Frio', type: 'terrestrial', habitable: false, defaultDesc: "Planícies áridas e avermelhadas sob um céu tênue, rico em minerais, mas hostil à vida desprotegida." },
  { biome: 'Mundo Oceânico Profundo', type: 'terrestrial', habitable: true, defaultDesc: "Coberto por um vasto oceano global, com ilhas vulcânicas dispersas e ecossistemas aquáticos complexos." },
  { biome: 'Gigante Gasoso com Luas', type: 'gasGiant', habitable: false, defaultDesc: "Uma imensa esfera de gás turbulento, com um sistema de luas que podem abrigar recursos ou segredos." },
  { biome: 'Mundo Gelado Espectral', type: 'iceGiant', habitable: false, defaultDesc: "Um gigante gelado envolto em névoas de metano, com temperaturas criogênicas e paisagens de gelo exótico." },
  { biome: 'Inferno Vulcânico Ativo', type: 'terrestrial', habitable: false, defaultDesc: "Superfície marcada por rios de lava, vulcões em constante erupção e uma atmosfera densa e tóxica." },
  { biome: 'Paraíso Selvagem Exuberante', type: 'terrestrial', habitable: true, defaultDesc: "Coberto por florestas densas e úmidas, pulsando com vida alienígena e segredos ancestrais." },
  { biome: 'Mundo Rochoso Desolado', type: 'terrestrial', habitable: false, defaultDesc: "Uma esfera rochosa e craterizada, sem atmosfera significativa, exposta à radiação espacial." },
  { biome: 'Mundo Cristalino Radiante', type: 'terrestrial', habitable: false, defaultDesc: "Sua superfície é coberta por formações cristalinas que refratam a luz estelar de maneiras bizarras." },
  { biome: 'Tundra Congelada Cinzenta', type: 'terrestrial', habitable: false, defaultDesc: "Vastas planícies congeladas, varridas por ventos glaciais, com pouca vegetação resistente." },
  { biome: 'Mundo Forja Abandonado', type: 'terrestrial', habitable: false, defaultDesc: "Antigas estruturas industriais cobrem este planeta, agora silenciosas e em ruínas, sugerindo uma civilização perdida." },
  { biome: 'Ecossistema Baseado em Silício', type: 'terrestrial', habitable: true, defaultDesc: "Formas de vida estranhas, baseadas em silício, prosperam em um ambiente que seria letal para a vida carbônica." },
  { biome: 'Mundo-Cidade Tecnológico', type: 'terrestrial', habitable: true, defaultDesc: "Um ecumenópolis vibrante, coberto por arranha-céus e redes de transporte avançadas." }
];

export const GENERIC_STATION_IMAGE_URLS = [
    '/assets/stations/station_1.webp',
    '/assets/stations/station_2.webp',
    '/assets/stations/station_3.webp',
    '/assets/stations/station_4.webp',
    '/assets/stations/station_5.webp',
];

export const STATION_TYPE_IMAGE_MAP: Record<StationType, string> = {
  research: '/assets/stations/estacao_pesquisa.webp',
  military: '/assets/stations/estacao_militar.webp',
  commercial: '/assets/stations/estacao_comercial.webp',
  defense: '/assets/stations/estacao_defesa.webp',
  outpost: GENERIC_STATION_IMAGE_URLS[1],
  orbital_hub: GENERIC_STATION_IMAGE_URLS[0],
  pirate_den: GENERIC_STATION_IMAGE_URLS[2],
  unknown: GENERIC_STATION_IMAGE_URLS[3],
  planetary_port: '/assets/stations/estacao_comercial.webp',
};

const STATION_GENERATION_CHANCE = 0.30;
export const BASE_PIRATE_SPAWN_CHANCE = 0.15; // Chance base de um NPC ser pirata
export const PIRATE_ENCOUNTER_CHANCE_IN_LOW_SEC = 0.25; // Deprecated or needs rework with new system

const sanitizeBiomeForFilename = (biome: string): string => {
  return biome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
};

function getPlanetImageUrlForGeneration(biome: string, planetId: string): string {
  const biomeKey = sanitizeBiomeForFilename(biome);
  const variationNumber = 1;
  return `/assets/planets/${biomeKey}_${variationNumber}.webp`;
};

function generatePlanetName(systemName: string, index: number): string {
  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  if (index < romanNumerals.length) {
    return `${systemName} ${romanNumerals[index]}`;
  }
  return `${systemName} ${String.fromCharCode(65 + index - romanNumerals.length)}`;
}

export const INITIAL_RESOURCES: Resource[] = [
  { name: 'Minério de Ferro', description: 'Minério metálico comum, essencial para construções básicas.', rarity: 'common', baseValue: 10 },
  { name: 'Fiação de Cobre', description: 'Cobre processado, vital para eletrônicos.', rarity: 'common', baseValue: 15 },
  { name: 'Placas de Titânio', description: 'Placas de metal leves e resistentes.', rarity: 'uncommon', baseValue: 40 },
  { name: 'Lâminas de Silício', description: 'Componente chave para computação avançada.', rarity: 'uncommon', baseValue: 50 },
  { name: 'Matéria Orgânica Alienígena Petrificada', description: 'Matéria orgânica fossilizada misteriosa com propriedades incomuns.', rarity: 'rare', baseValue: 200 },
  { name: 'Célula de Energia de Ponto Zero', description: 'Uma fonte de energia compacta e poderosa.', rarity: 'rare', baseValue: 500 },
  { name: 'Polímeros Duráveis', description: 'Material de construção versátil e resistente.', rarity: 'common', baseValue: 20},
  { name: 'Cristais Energéticos Brutos', description: 'Cristais que emitem uma leve energia, podem ser refinados.', rarity: 'uncommon', baseValue: 70},
  { name: 'Alimentos Processados', description: 'Rações nutritivas para sustentar populações.', rarity: 'common', baseValue: 5},
  { name: 'Bens de Consumo', description: 'Itens variados para o bem-estar e comércio colonial.', rarity: 'common', baseValue: 8},
  { name: 'Hélio-3', description: 'Isótopo usado em reatores de fusão avançados.', rarity: 'uncommon', baseValue: 60},
  { name: 'Componentes Exóticos', description: 'Peças raras e complexas para tecnologia de ponta.', rarity: 'rare', baseValue: 300},
  { name: 'Hidrogênio Gasoso', description: 'Gás leve abundante, combustível básico para reatores de fusão.', rarity: 'common', baseValue: 2 },
  { name: 'Deutério', description: 'Isótopo pesado de hidrogênio, combustível mais eficiente para fusão.', rarity: 'uncommon', baseValue: 25 },
  { name: 'Metano Congelado', description: 'Metano em estado sólido, encontrado em mundos gelados, pode ser processado em combustível.', rarity: 'common', baseValue: 4 },
  { name: 'Amônia Cristalizada', description: 'Composto de nitrogênio e hidrogênio, útil em processos industriais e suporte à vida.', rarity: 'uncommon', baseValue: 18 },
  { name: 'Enxofre Bruto', description: 'Elemento químico encontrado em áreas vulcânicas, usado em diversos processos químicos.', rarity: 'common', baseValue: 7 },
  { name: 'Silicatos Raros', description: 'Minerais à base de silício com propriedades estruturais ou eletrônicas únicas.', rarity: 'rare', baseValue: 150 },
  { name: 'Compostos Orgânicos Voláteis', description: 'Misturas complexas de carbono, potencialmente precursoras da vida ou úteis em bioquímica.', rarity: 'uncommon', baseValue: 45 },
  { name: 'Partículas Exóticas Interestelares', description: 'Partículas subatômicas anormais com propriedades energéticas desconhecidas, capturadas em gigantes gasosos.', rarity: 'rare', baseValue: 1000 },
  { name: 'Minerais Superdensos', description: 'Minerais formados sob extrema pressão, com aplicações em blindagem e construção pesada.', rarity: 'rare', baseValue: 800 },
  { name: 'Água Congelada Purificada', description: 'Gelo de água de alta pureza, essencial para suporte à vida e processos industriais.', rarity: 'common', baseValue: 3 },
  { name: 'Minerais Silicatados Comuns', description: 'Variedade de minerais à base de silicato, material de construção básico.', rarity: 'common', baseValue: 6 },
  { name: 'Gases Nobres Industriais', description: 'Mistura de gases inertes como Árgon e Xenônio, usados em iluminação e propulsão especializada.', rarity: 'uncommon', baseValue: 55},
  { name: 'Organismos Extremófilos', description: 'Microrganismos capazes de sobreviver em condições extremas, com potencial biotecnológico.', rarity: 'rare', baseValue: 250 },
  { name: 'Hidrocarbonetos Complexos', description: 'Cadeias longas de hidrocarbonetos, base para plásticos avançados e combustíveis sintéticos.', rarity: 'uncommon', baseValue: 30 },
  // Strategic Resources
  { name: 'Cristais Zorianos', description: "Cristais exóticos que ressoam com energias desconhecidas, essenciais para tecnologias de ponta e construções avançadas.", rarity: 'strategic', baseValue: 1200 },
  { name: 'Gás Nébula Estabilizado', description: "Um gás raro extraído de nebulosas densas, usado em propulsores avançados e escudos de alta performance.", rarity: 'strategic', baseValue: 1500 },
];

const sanitizeResourceNameForImage = (name: string): string => {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
};

export const RESOURCE_IMAGE_MAP: Record<string, string> = {};

INITIAL_RESOURCES.forEach(resource => {
  const sanitizedName = sanitizeResourceNameForImage(resource.name);
  RESOURCE_IMAGE_MAP[resource.name] = `/assets/resources/${sanitizedName}.png`;
});

export const getResourceImagePath = (resourceName: string): string | null => RESOURCE_IMAGE_MAP[resourceName] || null;
interface ResourceSpawnDetails { resourceName: string; spawnChance: number; }

export const BIOME_PLANETTYPE_RESOURCE_MAP: Record<string, Partial<Record<'terrestrial' | 'gasGiant' | 'iceGiant', ResourceSpawnDetails[]>>> = {
  'Continental Temperado': { terrestrial: [ { resourceName: 'Minério de Ferro', spawnChance: 0.7 }, { resourceName: 'Fiação de Cobre', spawnChance: 0.6 }, { resourceName: 'Polímeros Duráveis', spawnChance: 0.5 }, { resourceName: 'Água Congelada Purificada', spawnChance: 0.8 }, { resourceName: 'Compostos Orgânicos Voláteis', spawnChance: 0.4 }, { resourceName: 'Matéria Orgânica Alienígena Petrificada', spawnChance: 0.1 }, ] },
  'Deserto Vermelho Frio': { terrestrial: [ { resourceName: 'Minério de Ferro', spawnChance: 0.9 }, { resourceName: 'Fiação de Cobre', spawnChance: 0.5 }, { resourceName: 'Placas de Titânio', spawnChance: 0.6 }, { resourceName: 'Hélio-3', spawnChance: 0.7 }, { resourceName: 'Minerais Silicatados Comuns', spawnChance: 0.8 }, { resourceName: 'Enxofre Bruto', spawnChance: 0.3 }, ] },
  'Mundo Oceânico Profundo': { terrestrial: [ { resourceName: 'Polímeros Duráveis', spawnChance: 0.6 }, { resourceName: 'Água Congelada Purificada', spawnChance: 0.95 }, { resourceName: 'Compostos Orgânicos Voláteis', spawnChance: 0.7 }, { resourceName: 'Organismos Extremófilos', spawnChance: 0.3 }, { resourceName: 'Cristais Energéticos Brutos', spawnChance: 0.2 }, { resourceName: 'Gás Nébula Estabilizado', spawnChance: 0.02 }, ] },
  'Gigante Gasoso com Luas': { gasGiant: [ { resourceName: 'Hidrogênio Gasoso', spawnChance: 0.95 }, { resourceName: 'Hélio-3', spawnChance: 0.85 }, { resourceName: 'Deutério', spawnChance: 0.6 }, { resourceName: 'Gases Nobres Industriais', spawnChance: 0.5 }, { resourceName: 'Partículas Exóticas Interestelares', spawnChance: 0.2 }, { resourceName: 'Hidrocarbonetos Complexos', spawnChance: 0.4 }, { resourceName: 'Gás Nébula Estabilizado', spawnChance: 0.3 }, ] },
  'Mundo Gelado Espectral': { iceGiant: [ { resourceName: 'Metano Congelado', spawnChance: 0.9 }, { resourceName: 'Amônia Cristalizada', spawnChance: 0.8 }, { resourceName: 'Água Congelada Purificada', spawnChance: 0.9 }, { resourceName: 'Deutério', spawnChance: 0.4 }, { resourceName: 'Gases Nobres Industriais', spawnChance: 0.3 }, { resourceName: 'Gás Nébula Estabilizado', spawnChance: 0.1 }, ], terrestrial: [ { resourceName: 'Metano Congelado', spawnChance: 0.9 }, { resourceName: 'Amônia Cristalizada', spawnChance: 0.7 }, { resourceName: 'Água Congelada Purificada', spawnChance: 0.85 }, { resourceName: 'Minerais Silicatados Comuns', spawnChance: 0.5 }, { resourceName: 'Placas de Titânio', spawnChance: 0.2 }, ] },
  'Inferno Vulcânico Ativo': { terrestrial: [ { resourceName: 'Minério de Ferro', spawnChance: 0.8 }, { resourceName: 'Enxofre Bruto', spawnChance: 0.9 }, { resourceName: 'Placas de Titânio', spawnChance: 0.7 }, { resourceName: 'Silicatos Raros', spawnChance: 0.5 }, { resourceName: 'Cristais Energéticos Brutos', spawnChance: 0.4 }, { resourceName: 'Minerais Superdensos', spawnChance: 0.2 }, { resourceName: 'Cristais Zorianos', spawnChance: 0.05 }, ] },
  'Paraíso Selvagem Exuberante': { terrestrial: [ { resourceName: 'Polímeros Duráveis', spawnChance: 0.7 }, { resourceName: 'Compostos Orgânicos Voláteis', spawnChance: 0.8 }, { resourceName: 'Matéria Orgânica Alienígena Petrificada', spawnChance: 0.3 }, { resourceName: 'Organismos Extremófilos', spawnChance: 0.4 }, { resourceName: 'Água Congelada Purificada', spawnChance: 0.7 }, ] },
  'Mundo Rochoso Desolado': { terrestrial: [ { resourceName: 'Minério de Ferro', spawnChance: 0.85 }, { resourceName: 'Minerais Silicatados Comuns', spawnChance: 0.9 }, { resourceName: 'Placas de Titânio', spawnChance: 0.5 }, { resourceName: 'Fiação de Cobre', spawnChance: 0.4 }, { resourceName: 'Minerais Superdensos', spawnChance: 0.15 }, ] },
  'Mundo Cristalino Radiante': { terrestrial: [ { resourceName: 'Cristais Energéticos Brutos', spawnChance: 0.9 }, { resourceName: 'Lâminas de Silício', spawnChance: 0.7 }, { resourceName: 'Silicatos Raros', spawnChance: 0.6 }, { resourceName: 'Partículas Exóticas Interestelares', spawnChance: 0.25 }, { resourceName: 'Minerais Superdensos', spawnChance: 0.1 }, { resourceName: 'Cristais Zorianos', spawnChance: 0.4 }, ] },
  'Tundra Congelada Cinzenta': { terrestrial: [ { resourceName: 'Minério de Ferro', spawnChance: 0.6 }, { resourceName: 'Água Congelada Purificada', spawnChance: 0.9 }, { resourceName: 'Metano Congelado', spawnChance: 0.5 }, { resourceName: 'Minerais Silicatados Comuns', spawnChance: 0.7 }, { resourceName: 'Hélio-3', spawnChance: 0.3 }, ] },
  'Mundo Forja Abandonado': { terrestrial: [ { resourceName: 'Minério de Ferro', spawnChance: 0.5 }, { resourceName: 'Placas de Titânio', spawnChance: 0.6 }, { resourceName: 'Fiação de Cobre', spawnChance: 0.7 }, { resourceName: 'Componentes Exóticos', spawnChance: 0.3 }, { resourceName: 'Polímeros Duráveis', spawnChance: 0.4 }, ] },
  'Ecossistema Baseado em Silício': { terrestrial: [ { resourceName: 'Lâminas de Silício', spawnChance: 0.9 }, { resourceName: 'Silicatos Raros', spawnChance: 0.8 }, { resourceName: 'Cristais Energéticos Brutos', spawnChance: 0.5 }, { resourceName: 'Minerais Superdensos', spawnChance: 0.3 }, { resourceName: 'Organismos Extremófilos', spawnChance: 0.6 }, { resourceName: 'Cristais Zorianos', spawnChance: 0.2 }, ] },
  'Mundo-Cidade Tecnológico': { terrestrial: [ { resourceName: 'Componentes Exóticos', spawnChance: 0.8 }, { resourceName: 'Lâminas de Silício', spawnChance: 0.7 }, { resourceName: 'Placas de Titânio', spawnChance: 0.5 }, { resourceName: 'Célula de Energia de Ponto Zero', spawnChance: 0.3 }, ] }
};

function populateDynamicResourceHints(planet: Planet, planetTypeData: typeof PLANET_TYPES[0]): string[] {
  const hints: string[] = [];
  const mapEntry = BIOME_PLANETTYPE_RESOURCE_MAP[planet.biome]?.[planetTypeData.type as 'terrestrial' | 'gasGiant' | 'iceGiant'];
  if (mapEntry) {
    let hintsAdded = 0;
    const maxHints = Math.floor(Math.random() * 3) + 2;
    const potentialResources = [...mapEntry].sort(() => 0.5 - Math.random());
    for (const detail of potentialResources) {
      if (hintsAdded >= maxHints) break;
      if (Math.random() < detail.spawnChance) {
        const hintPrefix = Math.random() < 0.6 ? "Sinais de" : "Potencial de";
        hints.push(`${hintPrefix} ${detail.resourceName}`);
        hintsAdded++;
      }
    }
    if (hintsAdded < 2 && potentialResources.length > hintsAdded) {
        for (let i = hintsAdded; i < Math.min(2, potentialResources.length); i++) {
             if (!hints.some(h => h.includes(potentialResources[i].resourceName))) {
                hints.push(`Potencial de ${potentialResources[i].resourceName}`);
                hintsAdded++;
            }
        }
    }
  }
  return hints;
}

function generatePlanets(systemId: string, systemName: string): Planet[] {
  const numPlanets = Math.floor(Math.random() * 9) + 2;
  const planets: Planet[] = [];
  for (let i = 0; i < numPlanets; i++) {
    const planetTypeDefinition = PLANET_TYPES[Math.floor(Math.random() * PLANET_TYPES.length)];
    const planetId = `planet_${systemId}_${i}`;
    const newPlanet: Planet = {
      id: planetId, systemId, name: generatePlanetName(systemName, i), biome: planetTypeDefinition.biome,
      description: planetTypeDefinition.defaultDesc || `Um planeta do tipo ${planetTypeDefinition.biome} no sistema ${systemName}.`,
      features: [],
      resourcesHint: [],
      discoveredResources: [],
      imageUrl: getPlanetImageUrlForGeneration(planetTypeDefinition.biome, planetId),
      isColonized: false, population: 0, buildings: [], baseProduction: {}, baseConsumption: {}, ownerFactionId: null, planetaryStationId: null,
    };
    newPlanet.resourcesHint = populateDynamicResourceHints(newPlanet, planetTypeDefinition);
    planets.push(newPlanet);
  }
  return planets;
}

export const INITIAL_SHIP_MODULES: ShipModule[] = [
  { id: 'sm_engine_basic', name: 'Motor de Manobra Básico', description: 'Motor padrão para pequenas naves cargueiras.', type: 'engine', effects: { speed: 50, scanRange: BASE_SCANNER_RANGE_AU }, cost: 1000, isTechItem: true },
  { id: 'sm_cargo_small', name: 'Porão de Carga Pequeno', description: 'Aumenta a capacidade de carga da nave para transporte inicial.', type: 'cargo', effects: { cargoCapacity: 1500 }, cost: 1800 },
  { id: 'sm_scanner_short', name: 'Scanner de Curto Alcance', description: 'Scanner básico para detecção de objetos próximos.', type: 'scanner', effects: { scanRange: BASE_SCANNER_RANGE_AU + 5 }, cost: 800, isTechItem: true },
  { id: 'sm_shield_light', name: 'Gerador de Escudo Leve', description: 'Fornece uma camada básica de proteção de escudo.', type: 'shield', effects: { shieldStrength: 50, defenseRating: 5, energyResistance: 5, kineticResistance: 3, explosiveResistance: 2 }, cost: 1200, isTechItem: true },
  { id: 'sm_engine_improved', name: 'Motor de Manobra Melhorado', description: 'Motor mais eficiente para naves médias.', type: 'engine', effects: { speed: 75, scanRange: BASE_SCANNER_RANGE_AU + 2 }, cost: 2500, isTechItem: true },
  { id: 'sm_cargo_medium', name: 'Porão de Carga Médio', description: 'Aumenta significativamente a capacidade de carga para operações comerciais.', type: 'cargo', effects: { cargoCapacity: 3000 }, cost: 3800 },
  {
    id: 'sm_weapon_laser_light',
    name: 'Canhão Laser Leve',
    description: 'Arma de energia básica para defesa.',
    type: 'weapon',
    effects: {
      energyDamage: 10, attackPower: 5, kineticDamage: 0, explosiveDamage: 0,
      weaponRange: 'medium', weaponAccuracyBonus: 5, shieldPenetration: 0.1, armorPenetrationMultiplier: 1.0
    },
    cost: 2000,
    isTechItem: true
  },
  { id: 'sm_cargo_large', name: 'Porão de Carga Grande', description: 'Capacidade de carga massiva para transporte industrial e longas expedições.', type: 'cargo', effects: { cargoCapacity: 5000 }, cost: 6500 },
  { id: 'sm_engine_advanced', name: 'Motor de Salto Avançado', description: 'Permite viagens mais rápidas e eficientes.', type: 'engine', effects: { speed: 100, scanRange: BASE_SCANNER_RANGE_AU + 5 }, cost: 5000, isTechItem: true },
  { id: 'sm_colony_support', name: 'Módulo de Suporte Colonial', description: 'Contém equipamentos básicos para auxiliar no estabelecimento e manutenção de uma nova colônia.', type: 'special_utility', effects: {}, cost: 3000, isTechItem: true },
  { id: 'sm_cargo_auxiliary', name: 'Contêiner de Carga Auxiliar', description: 'Um contêiner externo que adiciona uma pequena quantidade de espaço de carga extra.', type: 'cargo', effects: { cargoCapacity: 750 }, cost: 1200 },
  { id: 'sm_cargo_expandable', name: 'Porão de Carga Modular Expansível', description: 'Um porão de carga avançado que pode ser configurado para diferentes tipos de carga, oferecendo grande versatilidade e capacidade. Requer pesquisa tecnológica.', type: 'cargo', effects: { cargoCapacity: 4000 }, cost: 6000, isTechItem: true },
  { id: 'sm_shield_medium', name: 'Gerador de Escudo Médio', description: 'Oferece proteção de escudo balanceada para naves de médio porte.', type: 'shield', effects: { shieldStrength: 100, defenseRating: 10, energyResistance: 10, kineticResistance: 7, explosiveResistance: 5 }, cost: 2800, isTechItem: true },
  { id: 'sm_scanner_long', name: 'Scanner de Longo Alcance "Argus"', description: 'Scanner avançado com capacidade de detecção aprimorada em grandes distâncias.', type: 'scanner', effects: { scanRange: BASE_SCANNER_RANGE_AU + 15 }, cost: 3500, isTechItem: true },
  { id: 'sm_utility_tractor_beam', name: 'Emissor de Raio Trator Leve', description: 'Permite a coleta de pequenos detritos espaciais ou contêineres de carga.', type: 'special_utility', effects: {}, cost: 2200, isTechItem: true },
  {
    id: 'sm_weapon_railgun_light',
    name: 'Canhão Magnético Leve',
    description: 'Dispara projéteis metálicos a altas velocidades. Bom contra alvos com escudos baixos.',
    type: 'weapon',
    effects: {
      kineticDamage: 15, attackPower: 7, energyDamage: 0, explosiveDamage: 0,
      weaponRange: 'long', weaponAccuracyBonus: 0, shieldPenetration: 0.0, armorPenetrationMultiplier: 1.2
    },
    cost: 3200,
    isTechItem: true
  },
  { id: 'sm_engine_combat', name: 'Propulsor de Combate "Falcão"', description: 'Motor otimizado para manobrabilidade e aceleração em combate.', type: 'engine', effects: { speed: 65, hullIntegrity: 10, defenseRating: 2 }, cost: 4000, isTechItem: true },
  {
    id: 'sm_utility_repair_small',
    name: 'Sistema de Nano-Reparo Pequeno',
    description: 'Libera nano-robôs para realizar reparos emergenciais no casco durante o combate.',
    type: 'special_utility',
    effects: { repairAmount: 35, cooldownTurns: 3 },
    cost: 3000,
    isTechItem: true
  },
  {
    id: 'sm_weapon_missile_basic',
    name: 'Lançador de Mísseis Básico',
    description: "Lança mísseis explosivos de longo alcance. Menos preciso, mas com alto potencial de dano.",
    type: 'weapon',
    effects: {
        explosiveDamage: 25, attackPower: 3, kineticDamage: 0, energyDamage: 0,
        weaponRange: 'long', weaponAccuracyBonus: -5, shieldPenetration: 0.0, armorPenetrationMultiplier: 1.1
    },
    cost: 3500,
    isTechItem: true
  },
  {
    id: 'sm_weapon_plasma_short',
    name: 'Canhão de Plasma de Curto Alcance',
    description: "Dispara um feixe concentrado de plasma superaquecido. Devastador a curta distância, especialmente contra escudos.",
    type: 'weapon',
    effects: {
        energyDamage: 20, attackPower: 6, kineticDamage: 0, explosiveDamage: 0,
        weaponRange: 'short', weaponAccuracyBonus: 10, shieldPenetration: 0.25, armorPenetrationMultiplier: 0.8
    },
    cost: 4000,
    isTechItem: true
  },
  {
    id: 'sm_utility_defense_matrix',
    name: 'Potenciador de Matriz Defensiva',
    description: "Melhora a eficácia da ação Defender, aumentando temporariamente a capacidade de evasão da nave.",
    type: 'special_utility',
    effects: { defenseRatingBuff: 15, cooldownTurns: 2 },
    cost: 2500,
    isTechItem: true
  },
];

export const SHIP_HULLS: ShipHull[] = [
  {
    id: 'hull_light_freighter',
    name: 'Cargueiro Leve Série-P',
    description: 'Um casco confiável e versátil, popular entre comerciantes iniciantes e exploradores.',
    baseStats: {
      baseCargoCapacity: 50, baseSpeed: 40, baseShieldStrength: 20, baseHullIntegrity: 100,
      baseAttackPower: 0, baseDefenseRating: 2, baseKineticDamage: 0, baseEnergyDamage: 0, baseExplosiveDamage: 0,
      baseKineticResistance: 1, baseEnergyResistance: 0, baseExplosiveResistance: 0
    },
    maxModuleSlots: 4,
    baseCost: 10000,
    initialModules: ['sm_engine_basic', 'sm_cargo_small', 'sm_scanner_short', null],
  },
  {
    id: 'hull_scout_ship',
    name: 'Nave Batedora Classe \'Vespa\'',
    description: 'Pequena, rápida e ágil, ideal para reconhecimento e exploração rápida de sistemas.',
    baseStats: {
      baseCargoCapacity: 20, baseSpeed: 70, baseShieldStrength: 30, baseHullIntegrity: 80,
      baseAttackPower: 0, baseDefenseRating: 5, baseKineticDamage: 0, baseEnergyDamage: 0, baseExplosiveDamage: 0,
      baseKineticResistance: 0, baseEnergyResistance: 0, baseExplosiveResistance: 0
    },
    maxModuleSlots: 3,
    baseCost: 15000,
    initialModules: ['sm_engine_improved', null, 'sm_scanner_short'],
  },
  {
    id: 'hull_medium_hauler',
    name: 'Transportador Médio \'Mula\'',
    description: 'Um cavalo de batalha com grande capacidade de carga, mas lento e pouco manobrável.',
    baseStats: {
      baseCargoCapacity: 300, baseSpeed: 30, baseShieldStrength: 50, baseHullIntegrity: 150,
      baseAttackPower: 0, baseDefenseRating: 3, baseKineticDamage: 0, baseEnergyDamage: 0, baseExplosiveDamage: 0,
      baseKineticResistance: 2, baseEnergyResistance: 1, baseExplosiveResistance: 1
    },
    maxModuleSlots: 5,
    baseCost: 25000,
    initialModules: ['sm_engine_basic', 'sm_cargo_medium', 'sm_cargo_medium', null, null],
  },
];

export const DEFAULT_PLAYER_SHIP_HULL_ID = 'hull_light_freighter';
export const DEFAULT_PLAYER_SHIP_ID = 'player_ship_default_instance';

const PREDEFINED_STATIONS: SpaceStation[] = [
  {
    id: 'station_alpha_centauri', name: 'Estação Orbital Alpha Centauri (Sol)', systemId: 'sol', faction: ALL_FACTIONS_DATA.find(f=>f.name === "Consórcio de Comércio Terrestre")?.id || "trade_consortium",
    description: 'Um movimentado centro comercial e ponto de parada para viajantes perto do sistema solar original da Terra.',
    services: ['shipyard', 'missions_hub'],
    availableShipModuleIds: ['sm_engine_basic', 'sm_cargo_small', 'sm_scanner_short', 'sm_shield_light', 'sm_engine_improved', 'sm_cargo_auxiliary'],
    availableShipHullIds: ['hull_light_freighter', 'hull_scout_ship'],
    shipModulePriceModifier: 1.05, shipHullPriceModifier: 1.1, stationType: 'orbital_hub', imageUrl: STATION_TYPE_IMAGE_MAP['orbital_hub'],
    marketInventory: {
      'Alimentos Processados': { quantity: 300, sellPriceModifier: 1.2, isProduced: false, buyPriceModifier: 0.8, isConsumed: true },
      'Bens de Consumo': { quantity: 250, sellPriceModifier: 1.15, isProduced: false, buyPriceModifier: 0.85, isConsumed: true },
      'Polímeros Duráveis': { quantity: 150, sellPriceModifier: 1.1, isProduced: false, buyPriceModifier: 0.9, isConsumed: false },
    }
  },
  {
    id: 'station_vega_outpost', name: 'Entreposto Orbital de Vega', systemId: 'sys_10_vega', faction: ALL_FACTIONS_DATA.find(f=>f.name === "Independentes da Fronteira")?.id || "frontier_independents",
    description: 'Uma estação remota nos limites do espaço conhecido, frequentada por exploradores e tipos mais... discretos.',
    services: ['shipyard'],
    availableShipModuleIds: ['sm_engine_improved', 'sm_cargo_medium', 'sm_weapon_laser_light', 'sm_cargo_large', 'sm_engine_advanced', 'sm_shield_medium', 'sm_weapon_railgun_light'],
    availableShipHullIds: ['hull_medium_hauler'],
    shipModulePriceModifier: 1.15, shipHullPriceModifier: 1.25, stationType: 'outpost', imageUrl: STATION_TYPE_IMAGE_MAP['outpost'],
    marketInventory: {
        'Minério de Ferro': { quantity: 400, sellPriceModifier: 1.0, isProduced: false, buyPriceModifier: 0.95, isConsumed: false },
        'Componentes Exóticos': { quantity: 50, sellPriceModifier: 1.5, isProduced: false, buyPriceModifier: 1.2, isConsumed: false },
    },
    hasPirateEncounter: true,
  },
  {
    id: 'station_nova_terra_port', name: 'Porto Planetário de Nova Terra', systemId: 'sol', faction: ALL_FACTIONS_DATA.find(f=>f.name === "Terran Directorate")?.id || "terran_directorate",
    description: 'O principal porto comercial e administrativo de Nova Terra, coração da Diretoria Terrana no sistema Sol.',
    services: ['shipyard', 'missions_hub'],
    availableShipModuleIds: INITIAL_SHIP_MODULES.filter(m => m.cost < 3000).map(m=>m.id),
    availableShipHullIds: [SHIP_HULLS[0].id, SHIP_HULLS[1].id],
    shipModulePriceModifier: 1.0, shipHullPriceModifier: 1.0, stationType: 'planetary_port', imageUrl: STATION_TYPE_IMAGE_MAP['planetary_port'],
    marketInventory: {
      'Alimentos Processados': { quantity: 1500, sellPriceModifier: 1.0, isProduced: true, buyPriceModifier: 0.7, isConsumed: false },
      'Bens de Consumo': { quantity: 1200, sellPriceModifier: 1.05, isProduced: true, buyPriceModifier: 0.75, isConsumed: false },
      'Lâminas de Silício': { quantity: 800, sellPriceModifier: 1.1, isProduced: true, buyPriceModifier: 0.8, isConsumed: true },
      'Componentes Exóticos': { quantity: 300, sellPriceModifier: 1.2, isProduced: true, buyPriceModifier: 0.9, isConsumed: false },
      'Cristais Energéticos Brutos': { quantity: 100, sellPriceModifier: 1.8, isProduced: false, buyPriceModifier: 1.1, isConsumed: true },
      'Hélio-3': { quantity: 150, sellPriceModifier: 1.7, isProduced: false, buyPriceModifier: 1.15, isConsumed: true },
      'Minério de Ferro': { quantity: 200, sellPriceModifier: 1.5, isProduced: false, buyPriceModifier: 0.9, isConsumed: true },
    }
  },
  {
    id: 'station_ares_outpost_planetary', name: 'Entreposto de Ares VII', systemId: 'sol', faction: ALL_FACTIONS_DATA.find(f=>f.name === "Independentes da Fronteira")?.id || "frontier_independents",
    description: 'Um pequeno mas funcional entreposto comercial nas planícies de Ares VII, lidando com minérios e suprimentos.',
    services: ['shipyard'],
    availableShipModuleIds: ['sm_cargo_small', 'sm_engine_basic', 'sm_utility_tractor_beam'],
    availableShipHullIds: [SHIP_HULLS[0].id],
    shipModulePriceModifier: 1.1, shipHullPriceModifier: 1.15, stationType: 'planetary_port', imageUrl: STATION_TYPE_IMAGE_MAP['outpost'],
    marketInventory: {
      'Minério de Ferro': { quantity: 2000, sellPriceModifier: 0.95, isProduced: true, buyPriceModifier: 0.6, isConsumed: false },
      'Hélio-3': { quantity: 800, sellPriceModifier: 1.0, isProduced: true, buyPriceModifier: 0.7, isConsumed: false },
      'Placas de Titânio': { quantity: 500, sellPriceModifier: 1.05, isProduced: true, buyPriceModifier: 0.75, isConsumed: false },
      'Alimentos Processados': { quantity: 100, sellPriceModifier: 1.4, isProduced: false, buyPriceModifier: 1.0, isConsumed: true },
      'Bens de Consumo': { quantity: 80, sellPriceModifier: 1.3, isProduced: false, buyPriceModifier: 0.95, isConsumed: true },
      'Polímeros Duráveis': { quantity: 120, sellPriceModifier: 1.2, isProduced: false, buyPriceModifier: 0.9, isConsumed: true },
    }
  },
  {
    id: 'station_hypatia_exchange', name: 'Bolsa Comercial de Hypatia Primus', systemId: 'sys_12_epsilon_reticuli', faction: ALL_FACTIONS_DATA.find(f=>f.name === "Hypatian Alliance")?.id || "hypatian_alliance",
    description: 'O movimentado centro nevrálgico da Aliança Hypatiana, oferecendo tecnologia de ponta e naves avançadas.',
    services: ['shipyard', 'missions_hub', 'research_lab'],
    availableShipModuleIds: INITIAL_SHIP_MODULES.map(m=>m.id),
    availableShipHullIds: SHIP_HULLS.map(h=>h.id),
    shipModulePriceModifier: 0.95, shipHullPriceModifier: 0.9, stationType: 'planetary_port', imageUrl: STATION_TYPE_IMAGE_MAP['commercial'],
    marketInventory: {
      'Lâminas de Silício': { quantity: 1800, sellPriceModifier: 0.9, isProduced: true, buyPriceModifier: 0.65, isConsumed: false },
      'Componentes Exóticos': { quantity: 1000, sellPriceModifier: 0.95, isProduced: true, buyPriceModifier: 0.7, isConsumed: true },
      'Célula de Energia de Ponto Zero': { quantity: 100, sellPriceModifier: 1.0, isProduced: true, buyPriceModifier: 0.8, isConsumed: false },
      'Matéria Orgânica Alienígena Petrificada': { quantity: 50, sellPriceModifier: 2.0, isProduced: false, buyPriceModifier: 1.3, isConsumed: true },
      'Cristais Energéticos Brutos': { quantity: 80, sellPriceModifier: 1.9, isProduced: false, buyPriceModifier: 1.2, isConsumed: true },
      'Placas de Titânio': { quantity: 150, sellPriceModifier: 1.6, isProduced: false, buyPriceModifier: 1.0, isConsumed: true },
      'Cristais Zorianos': { quantity: 5, sellPriceModifier: 2.5, isProduced: false, buyPriceModifier: 1.5, isConsumed: true }, // Rare, high markup
    }
  }
];


function generateDynamicStationForSystem(system: StarSystem): SpaceStation | null {
    if (system.iconType === 'capital' || PREDEFINED_STATIONS.some(s => s.systemId === system.id && s.stationType !== 'planetary_port')) {
        return null;
    }
    if (Math.random() > STATION_GENERATION_CHANCE) return null;

    const stationId = `dyn_station_${system.id}`;
    let stationFactionId = system.faction;
    const factionData = ALL_FACTIONS_DATA.find(f => f.id === stationFactionId) || ALL_FACTIONS_DATA.find(f => f.name === "Unclaimed");


    if (factionData?.name === 'Unclaimed') {
        stationFactionId = Math.random() < 0.7 ? (ALL_FACTIONS_DATA.find(f=>f.name === "Independentes da Fronteira")?.id || "frontier_independents") : (ALL_FACTIONS_DATA.find(f=>f.name === "Sindicato K'Tharr (Piratas)")?.id || "ktharr_syndicate");
    }
    const currentFactionInfo = ALL_FACTIONS_DATA.find(f => f.id === stationFactionId);


    const stationNameTemplates = [ `Entreposto de ${system.name}`, `Plataforma Orbital ${system.name}`, `${currentFactionInfo?.name || 'Hub Desconhecido'} em ${system.name}`];
    const stationName = stationNameTemplates[Math.floor(Math.random() * stationNameTemplates.length)];
    const availableServices: SpaceStation['services'] = [];
    if (Math.random() < 0.8) availableServices.push('shipyard');
    if (Math.random() < 0.6) availableServices.push('missions_hub');
    if (availableServices.length === 0 && Math.random() < 0.5) availableServices.push('shipyard');

    const numModulesToSell = Math.floor(Math.random() * 3) + 2;
    const availableShipModuleIds = [...INITIAL_SHIP_MODULES].sort(() => 0.5 - Math.random()).slice(0, numModulesToSell).map(m => m.id);
    const numHullsToSell = Math.floor(Math.random() * 2) + 1;
    const availableShipHullIds = [...SHIP_HULLS].sort(() => 0.5 - Math.random()).slice(0, numHullsToSell).map(h => h.id);

    const dynamicStationTypes: StationType[] = ['outpost', 'orbital_hub', 'research', 'commercial', 'defense', 'military'];
    let assignedStationType: StationType = dynamicStationTypes[Math.floor(Math.random() * dynamicStationTypes.length)];
    let hasPirateFlag = false;
    if (currentFactionInfo?.name === "Sindicato K'Tharr (Piratas)") {
        assignedStationType = 'pirate_den';
        hasPirateFlag = true;
    } else if (currentFactionInfo?.name === 'Coletivo Zenith (Pesquisa)') {
         assignedStationType = 'research';
    } else if (currentFactionInfo?.name === 'Terran Directorate' || currentFactionInfo?.name === 'Hypatian Alliance') {
        if (Math.random() < 0.3) assignedStationType = 'military';
        else if (Math.random() < 0.3) assignedStationType = 'defense';
    }
    if(system.securityLevel === 'low' || system.securityLevel === 'lawless') hasPirateFlag = true;


    return {
        id: stationId, name: stationName, systemId: system.id, faction: stationFactionId,
        description: `Uma estação espacial ${currentFactionInfo?.name === "Sindicato K'Tharr (Piratas)" ? 'suspeita' : 'padrão'} orbitando no sistema ${system.name}.`,
        services: availableServices.length > 0 ? availableServices : ['shipyard'],
        availableShipModuleIds, availableShipHullIds,
        shipModulePriceModifier: parseFloat((0.9 + Math.random() * 0.3).toFixed(2)),
        shipHullPriceModifier: parseFloat((0.9 + Math.random() * 0.3).toFixed(2)),
        stationType: assignedStationType,
        imageUrl: STATION_TYPE_IMAGE_MAP[assignedStationType] || GENERIC_STATION_IMAGE_URLS[3],
        hasPirateEncounter: hasPirateFlag,
    };
}

function generateGalaxyData(): { systems: StarSystem[]; planets: Planet[]; stations: SpaceStation[] } {
  const systems: StarSystem[] = [];
  const planets: Planet[] = [];
  const allGeneratedStations: SpaceStation[] = [...PREDEFINED_STATIONS.map(s => ({...s}))];
  const systemSecurityLevels: StarSystem['securityLevel'][] = ['high', 'medium', 'low', 'lawless'];

  const solSystem: StarSystem = {
    id: 'sol', name: 'Sistema Sol', position: { x: 50, y: 50 }, faction: ALL_FACTIONS_DATA.find(f=>f.name === "Terran Directorate")?.id || "terran_directorate",
    description: 'O berço da humanidade e o coração da Diretoria Terrana.',
    planetsInSystem: [], stationsInSystem: allGeneratedStations.filter(s => s.systemId === 'sol').map(s => s.id), iconType: 'capital', securityLevel: 'high',
    starColorCss: 'bg-yellow-400',
  };
  systems.push(solSystem);

  const solPlanets: Planet[] = [
    {
      id: 'planet_earth_like', systemId: 'sol', name: 'Nova Terra', biome: 'Mundo-Cidade Tecnológico',
      description: 'Antigo lar da humanidade, Nova Terra agora é o centro administrativo da Diretoria Terrana no Sistema Sol, um ecumenópolis movimentado e fortificado.',
      features: ['Escudo planetário orbital', 'Vastas cidades-colmeia', 'Porto Espacial Principal: New Alexandria'],
      resourcesHint: ['Dados de arquivo históricos', 'Componentes manufaturados avançados', 'Produtos de luxo'],
      discoveredResources: ['Componentes Exóticos', 'Bens de Consumo'],
      imageUrl: getPlanetImageUrlForGeneration('Mundo-Cidade Tecnológico', 'planet_earth_like'),
      isColonized: true, population: 750000000, buildings: [], // Inicialmente sem edifícios construídos pelo jogador
      baseProduction: { 'Alimentos Processados': 50, 'Bens de Consumo': 30, 'Lâminas de Silício': 15, 'Componentes Exóticos': 5 },
      baseConsumption: { 'Cristais Energéticos Brutos': 20, 'Hélio-3': 25, 'Minério de Ferro': 40, 'Polímeros Duráveis': 30 },
      ownerFactionId: ALL_FACTIONS_DATA.find(f=>f.name === "Terran Directorate")?.id || "terran_directorate", planetaryStationId: "station_nova_terra_port",
    },
    {
      id: 'planet_mars_like', systemId: 'sol', name: 'Ares VII', biome: 'Deserto Vermelho Frio',
      description: 'Um planeta desértico com vastas planícies vermelhas e cânions profundos. Principalmente um centro de mineração e indústria pesada, operado por independentes sob supervisão da Diretoria.',
      features: ['Tempestades de poeira globais', 'Complexos de Mineração Pesada', 'Cidades subterrâneas'],
      resourcesHint: ['Minério de Ferro abundante', 'Hélio-3', 'Placas de Titânio'],
      discoveredResources: ['Minério de Ferro', 'Hélio-3'],
      imageUrl: getPlanetImageUrlForGeneration('Deserto Vermelho Frio', 'planet_mars_like'),
      isColonized: true, population: 2500000, buildings: [], // Inicialmente sem edifícios construídos pelo jogador
      baseProduction: { 'Minério de Ferro': 40, 'Hélio-3': 15, 'Placas de Titânio': 10, 'Enxofre Bruto': 5 },
      baseConsumption: { 'Alimentos Processados': 30, 'Bens de Consumo': 20, 'Polímeros Duráveis': 25, 'Fiação de Cobre': 10 },
      ownerFactionId: ALL_FACTIONS_DATA.find(f=>f.name === "Independentes da Fronteira")?.id || "frontier_independents", planetaryStationId: "station_ares_outpost_planetary",
    },
  ];
  planets.push(...solPlanets);
  solSystem.planetsInSystem = solPlanets.map(p => p.id);

  REAL_STAR_SYSTEMS.forEach((sysInfo, idx) => {
    const systemId = `sys_${idx}_${sysInfo.name.toLowerCase().replace(/[^a-z0-9]/gi, '_')}`;
    const systemPlanets = generatePlanets(systemId, sysInfo.name);
    const randomFaction = ALL_FACTIONS_DATA[Math.floor(Math.random() * ALL_FACTIONS_DATA.length)];
    let systemFactionId = randomFaction.id;
    let systemIconType: StarSystem['iconType'] = idx % 4 === 0 ? 'important' : 'default';
    let systemDescription = `Sistema estelar conhecido como ${sysInfo.realName}.`;
    let security = systemSecurityLevels[Math.floor(Math.random() * systemSecurityLevels.length)];
    if (systemFactionId === 'ktharr_syndicate') security = Math.random() < 0.7 ? 'lawless' : 'low';
    else if (systemFactionId === 'terran_directorate' || systemFactionId === 'hypatian_alliance') security = Math.random() < 0.7 ? 'high' : 'medium';

    const assignedStarColor = sysInfo.starColorCss || STAR_COLOR_CLASSES[Math.floor(Math.random() * STAR_COLOR_CLASSES.length)];

    const newSystem: StarSystem = {
        id: systemId, name: sysInfo.name, position: sysInfo.position, faction: systemFactionId,
        description: systemDescription, planetsInSystem: systemPlanets.map(p => p.id), stationsInSystem: [], iconType: systemIconType, securityLevel: security,
        starColorCss: assignedStarColor,
    };

    if (sysInfo.realName === 'Epsilon Reticuli') {
        newSystem.faction = ALL_FACTIONS_DATA.find(f=>f.name === "Hypatian Alliance")?.id || "hypatian_alliance";
        newSystem.iconType = 'capital';
        newSystem.securityLevel = 'high';
        newSystem.description = `Sistema estelar conhecido como ${sysInfo.realName}. É a capital da Aliança Hypatiana, centrada em Hypatia Primus.`;
        newSystem.starColorCss = 'bg-orange-400'; // Example specific color
        const hypatianCorePlanetType = PLANET_TYPES.find(pt => pt.biome === 'Mundo-Cidade Tecnológico') || PLANET_TYPES[0];
        const hypatianCorePlanet: Planet = {
            id: `planet_${systemId}_core`, systemId, name: 'Hypatia Primus', biome: hypatianCorePlanetType.biome,
            description: 'A joia da Aliança Hypatiana, um planeta-cidade conhecido por sua avançada tecnologia e cultura vibrante.',
            features: ['Rede de transporte global anti-gravidade', 'Campos de energia defensivos adaptativos', 'Torres de pesquisa que perfuram a alta atmosfera'],
            resourcesHint: ['Arquivos de dados de pesquisa avançada', 'Componentes tecnológicos de ponta', 'Projetos de naves experimentais', 'Pistas de Cristais Zorianos'],
            discoveredResources: ['Lâminas de Silício', 'Componentes Exóticos'],
            imageUrl: getPlanetImageUrlForGeneration(hypatianCorePlanetType.biome, `planet_${systemId}_core`),
            isColonized: true, population: 1200000000, buildings: [], // Inicialmente sem edifícios
            baseProduction: { 'Lâminas de Silício': 40, 'Componentes Exóticos': 25, 'Célula de Energia de Ponto Zero': 2, 'Alimentos Processados': 10},
            baseConsumption: { 'Matéria Orgânica Alienígena Petrificada': 15, 'Cristais Energéticos Brutos': 30, 'Placas de Titânio': 20, 'Silicatos Raros': 10, 'Cristais Zorianos': 5 },
            ownerFactionId: ALL_FACTIONS_DATA.find(f=>f.name === "Hypatian Alliance")?.id || "hypatian_alliance", planetaryStationId: "station_hypatia_exchange",
        };
        const existingPlanetsForSystem = systemPlanets.filter(p => p.id !== hypatianCorePlanet.id);
        planets.push(hypatianCorePlanet);
        newSystem.planetsInSystem = [hypatianCorePlanet.id, ...existingPlanetsForSystem.map(p => p.id)];
        planets.push(...existingPlanetsForSystem);
    } else {
        planets.push(...systemPlanets);
    }

    const dynamicStation = generateDynamicStationForSystem(newSystem);
    if (dynamicStation) {
        allGeneratedStations.push(dynamicStation);
        newSystem.stationsInSystem.push(dynamicStation.id);
    }
     PREDEFINED_STATIONS.forEach(ps => {
        if(ps.systemId === newSystem.id && !newSystem.stationsInSystem.includes(ps.id)){
            newSystem.stationsInSystem.push(ps.id);
        }
    });
    systems.push(newSystem);
  });

  const solPlanetaryStationIds = solPlanets.map(p => p.planetaryStationId).filter(id => id) as string[];
  solSystem.stationsInSystem = [...new Set([...solSystem.stationsInSystem, ...solPlanetaryStationIds])];


  return { systems, planets, stations: allGeneratedStations };
}

const GALAXY_GENERATION_RESULT = generateGalaxyData();
export const STAR_SYSTEMS_DATA: StarSystem[] = GALAXY_GENERATION_RESULT.systems;
export const SYSTEM_PLANETS: Planet[] = GALAXY_GENERATION_RESULT.planets;
export const ALL_STATIONS_DATA: SpaceStation[] = GALAXY_GENERATION_RESULT.stations;


export const FIXED_LORE_PLANET_IDS = ['planet_earth_like', 'planet_mars_like', `planet_sys_12_epsilon_reticuli_core`];

export const INITIAL_PLAYER_STATE_BASE: Omit<PlayerState, 'characterName' | 'originId' | 'activePerks' | 'ownedShips' | 'currentShipId' | 'isTraveling' | 'travelDetails' | 'currentSystemId' | 'knownSystemIds' | 'backgroundMusicVolume' | 'factionReputations' | 'activeTreaties'  | 'combatState' | 'combatSummaryData' | 'colonyLLMEventAttemptTracker'> = {
  credits: 1000,
  inventory: { 'Minério de Ferro': 20, 'Polímeros Duráveis': 10 },
  craftedItems: [],
  currentLocation: ALL_STATIONS_DATA.find(s => s.systemId === 'sol' && s.stationType !== 'planetary_port')?.id || 'station_alpha_centauri',
  lastTickTime: Date.now(),
  skillPoints: INITIAL_SKILL_POINTS,
  researchPoints: INITIAL_RESEARCH_POINTS,
  unlockedSkills: [],
  unlockedTechs: [],
  ownedShipModules: [],
  activePolicies: [],
  // colonyLLMEventAttemptTracker is intentionally omitted here, will be initialized in App.tsx
};

export const CHARACTER_PERKS: Record<string, Perk> = {
  silverTongue: { id: 'silverTongue', name: 'Língua de Prata', description: 'Melhora as reações iniciais de NPCs e oferece melhores preços em algumas situações.' },
  masterExplorer: { id: 'masterExplorer', name: 'Explorador Mestre', description: 'Aumenta a chance de encontrar anomalias raras e artefatos.' },
  bornEngineer: { id: 'bornEngineer', name: 'Engenheiro Nato', description: 'Começa com conhecimento de esquemas de módulos básicos e recebe um bônus em reparos ou fabricação.' },
  acePilot: { id: 'acePilot', name: 'Piloto Ás', description: 'Concede bônus em combate de naves e manobrabilidade.' },
  wealthyScion: { id: 'wealthyScion', name: 'Herdeiro Rico', description: 'Começa com uma quantidade significativa de créditos extras e uma pequena nave melhorada.' },
  techAdept: { id: 'techAdept', name: 'Perito em Tecnologia', description: 'Reduz o custo de pesquisa de tecnologias e fabricação de itens tecnológicos.' },
  efficientEngineer: { id: 'efficientEngineer', name: 'Engenheiro Eficiente', description: 'Aumenta a produção base de recursos em colônias controladas pelo jogador.' },
  researchPioneer: { id: 'researchPioneer', name: 'Pioneiro da Pesquisa', description: 'Começa com pontos de pesquisa bônus e certas tecnologias básicas já desbloqueadas.' },
};

export const CHARACTER_ORIGINS: CharacterOrigin[] = [
  {
    id: 'mercenary', name: 'Mercenário Endurecido',
    description: 'Você viajou pela galáxia, lutando por quem pagasse mais. Suas habilidades de combate são inigualáveis, mas sua reputação é... mista.',
    perks: [CHARACTER_PERKS.acePilot, CHARACTER_PERKS.bornEngineer],
    startingBonus: { credits: 1500 }
  },
  {
    id: 'explorer', name: 'Explorador Intrépido',
    description: 'A vastidão desconhecida chama por você. Você anseia por mapear sistemas desconhecidos e descobrir segredos antigos.',
    perks: [CHARACTER_PERKS.masterExplorer],
    startingBonus: { inventory: { 'Alimentos Processados': 30, 'Polímeros Duráveis': 15 } }
  },
  {
    id: 'merchant', name: 'Comerciante Astuto',
    description: 'Para você, a galáxia é uma rede de oportunidades de lucro. Sua lábia e faro para negócios são lendários.',
    perks: [CHARACTER_PERKS.silverTongue],
    startingBonus: { credits: 2500, inventory: { 'Bens de Consumo': 25 } }
  },
  {
    id: 'scientist', name: 'Cientista Visionário',
    description: 'O universo é um quebra-cabeça a ser resolvido. Você busca conhecimento e avanços tecnológicos acima de tudo.',
    perks: [CHARACTER_PERKS.techAdept, CHARACTER_PERKS.researchPioneer],
    startingBonus: { researchPoints: 25, craftedItems: [{...DISCOVERABLE_ARTIFACTS[0], id: 'starting_artifact_sci', isAnalyzed: false }] }
  },
  {
    id: 'colonist_pioneer', name: 'Pioneiro Colonial',
    description: 'Você sonha em construir novos lares para a humanidade entre as estrelas, domando fronteiras selvagens.',
    perks: [CHARACTER_PERKS.efficientEngineer, CHARACTER_PERKS.bornEngineer],
    startingBonus: { inventory: { 'Minério de Ferro': 50, 'Polímeros Duráveis': 30 }, craftedItems: [{id:'item_colony_starter_pack', name: 'Kit de Ferramentas Coloniais Básico', description: 'Equipamento básico para iniciar uma colônia.',type:'consumable', craftingRecipe:{}}] }
  }
];

export const INITIAL_SKILL_TREE: SkillNode[] = [
  { id: 'sk_piloting_1', name: 'Pilotagem Básica', description: 'Melhora a manobrabilidade geral da nave.', effectDescription: '+5% Velocidade e Agilidade da Nave', cost: 1, icon: 'rocket' },
  { id: 'sk_shield_1', name: 'Modulação de Escudo I', description: 'Aumenta a eficácia dos escudos da nave.', effectDescription: '+10% Força do Escudo', cost: 1, prerequisites: ['sk_piloting_1'], icon: 'shield-half' },
  { id: 'sk_cargo_1', name: 'Otimização de Carga I', description: 'Permite armazenar mais carga.', effectDescription: '+10% Capacidade de Carga', cost: 1, icon: 'box-archive' },
  { id: 'sk_trading_1', name: 'Negociação Básica', description: 'Melhora ligeiramente os preços de compra e venda.', effectDescription: '2% Melhor Preço em Transações', cost: 2, icon: 'arrow-trend-up' },
];

export const INITIAL_TECH_TREE: TechNode[] = [
  { id: 'tech_engine_1', name: 'Propulsores Melhorados I', description: 'Pesquisa para motores de nave mais eficientes.', effectDescription: 'Desbloqueia fabricação de Motores Melhorados', cost: 5, icon: 'cogs' },
  { id: 'tech_armor_1', name: 'Blindagem Composta I', description: 'Melhora a integridade do casco das naves.', effectDescription: '+10% Integridade do Casco para a nave atual e futuras', cost: 3, icon: 'helmet-safety' },
  { id: 'tech_scanner_1', name: 'Sensores Avançados I', description: 'Aumenta o alcance e a precisão dos scanners.', effectDescription: 'Desbloqueia Scanners de Longo Alcance', cost: 4, prerequisites: ['tech_engine_1'], icon: 'satellite-dish' },
  { id: 'tech_colony_1', name: 'Fundamentos Coloniais', description: 'Desbloqueia a capacidade de construir módulos básicos de colônia e estruturas.', effectDescription: 'Permite fabricar Kits de Colonização e Edifícios Coloniais Básicos', cost: 10, icon: 'city' },
  {
    id: 'tech_strategic_refining',
    name: 'Refino de Exomateriais',
    description: 'Desbloqueia técnicas avançadas para processar e utilizar recursos estratégicos raros.',
    effectDescription: 'Permite a construção do Centro de Processamento de Exomateriais.',
    cost: 75,
    prerequisites: ['tech_colony_1'],
    icon: 'TechExoRefining'
  },
];

export const BASE_PLANET_PRODUCTION: Record<string, number> = { 'Minério de Ferro': 5, 'Polímeros Duráveis': 3, 'Alimentos Processados': 2 };
export const COLONIZATION_CREDIT_COST = 50000;

// --- COLONY CONSUMPTION & MORALE ---
export const MIN_POP_FOR_ADVANCED_CONSUMPTION = 50;
export const PER_CAPITA_CONSUMPTION_RATES: Record<string, number> = {
  'Alimentos Processados': 0.002, // Per capita per tick
  'Bens de Consumo': 0.001,     // Per capita per tick
};

export const MAX_COLONY_MORALE = 100;
export const MIN_COLONY_MORALE = 0;
export const INITIAL_COLONY_MORALE = 50;
export const MORALE_HAPPY_THRESHOLD = 80;
export const MORALE_UNHAPPY_THRESHOLD = 30;

// Production multiplier: 0 morale = 0.8x, 50 morale = 1.0x, 100 morale = 1.2x
export const getMoraleProductionMultiplier = (morale: number) => 0.8 + 0.4 * (morale / 100);

export const MORALE_GAIN_PER_SURPLUS_UNIT = 0.05; // Morale gain per surplus resource unit consumed (scaled by pop)
export const MORALE_LOSS_PER_DEFICIT_UNIT = 0.2;  // Morale loss per missing resource unit required
export const MORALE_BASE_CHANGE_TOWARDS_NEUTRAL = 0.1; // Slow drift toward 50 if no other factors


export const NPC_ROLES_LIST: NPCRole[] = [NPCRole.TRADER, NPCRole.PIRATE, NPCRole.EXPLORER, NPCRole.SCIENTIST, NPCRole.MINER];
export const MAX_PLANETS_DISCOVERABLE = 50;
export const MAX_NPCS_ENCOUNTERABLE = 20;
export const MAX_MISSIONS_ACTIVE = 5;

export const DEFAULT_SAVE_SLOT_KEY = `${GAME_SAVE_KEY_PREFIX}quicksave`;

export const CRAFTABLE_ITEMS: Item[] = [
  {
    id: 'item_adv_repair_kit',
    name: 'Kit de Reparo Avançado',
    description: 'Um kit de reparo que restaura uma quantidade significativa da integridade do casco.',
    craftingRecipe: { 'Placas de Titânio': 10, 'Fiação de Cobre': 5 },
    effects: 'Restaura 100 de Casco',
    type: 'consumable'
  },
  {
    id: 'item_colony_hub_module',
    name: 'Módulo de Colonização Planetária (Item)',
    description: 'Um componente essencial pré-fabricado para estabelecer um novo posto avançado colonial. Consumido na fundação.',
    craftingRecipe: { 'Placas de Titânio': 50, 'Fiação de Cobre': 25, 'Polímeros Duráveis': 30, 'Componentes Exóticos': 5 },
    type: 'colony_component',
    isTechItem: true,
  },
];

// --- COLONIAL BUILDINGS ---
export const COLONIAL_BUILDING_DEFINITIONS: ColonialBuildingDefinition[] = [
  {
    id: 'bldg_colony_hub_t1',
    name: 'Centro Administrativo Colonial',
    description: 'O núcleo operacional de uma nova colônia, essencial para expansão e gerenciamento. Permite a construção de outras estruturas.',
    cost: { 'Créditos': 0 }, // Cost handled by COLONIZATION_CREDIT_COST and starter module/item
    effects: { /* Initially, might have minimal effects or enable others */ },
    effectDescription: "Permite o gerenciamento e expansão da colônia.",
    maxPerPlanet: 1,
    icon: 'Colony',
  },
  {
    id: 'bldg_research_lab_1',
    name: 'Laboratório de Pesquisa Nv. 1',
    description: 'Um laboratório básico que permite a pesquisa científica contínua, gerando Pontos de Pesquisa ao longo do tempo.',
    cost: { 'Placas de Titânio': 25, 'Lâminas de Silício': 15, 'Créditos': 20000 },
    effects: { researchPointBonusPerTick: 2 },
    effectDescription: "+2 Pontos de Pesquisa por tick.",
    maxPerPlanet: 1,
    icon: 'ResearchLab',
    requiredTech: 'tech_colony_1',
  },
  {
    id: 'bldg_mine_fe_1',
    name: 'Mina de Ferro Nv. 1',
    description: 'Uma instalação de mineração primária para extrair Minério de Ferro de depósitos planetários.',
    cost: { 'Polímeros Duráveis': 30, 'Fiação de Cobre': 10, 'Créditos': 15000 },
    effects: { resourceProductionBonus: { resourceName: 'Minério de Ferro', amountPerTick: 5 } },
    effectDescription: "+5 Minério de Ferro por tick.",
    icon: 'Resource',
    requiredTech: 'tech_colony_1',
  },
  {
    id: 'bldg_exomaterial_processor_t1',
    name: 'Centro de Processamento de Exomateriais Nv. 1',
    description: 'Uma instalação especializada capaz de refinar recursos estratégicos brutos em componentes utilizáveis para tecnologias de ponta.',
    cost: {
      'Créditos': 100000,
      'Placas de Titânio': 150,
      'Componentes Exóticos': 20,
      'Cristais Zorianos': 10
    },
    effects: { researchPointBonusPerTick: 5, textEffect: "Permite o refino de recursos estratégicos." },
    effectDescription: "+5 Pontos de Pesquisa por tick. Permite refino avançado.",
    maxPerPlanet: 1,
    icon: 'ExoProcessor',
    requiredTech: 'tech_strategic_refining',
  },
  {
    id: 'bldg_shipyard_p1',
    name: "Estaleiro Planetário Nv. 1",
    description: "Uma instalação orbital ou de superfície básica capaz de realizar reparos em naves.",
    cost: { 'Créditos': 75000, 'Placas de Titânio': 100, 'Componentes Exóticos': 10, 'Fiação de Cobre': 50 },
    effects: { textEffect: "Habilita reparos de naves nesta colônia." }, // No mechanical effect directly from here, action handled elsewhere
    effectDescription: "Permite reparos de naves na colônia (custo: Créditos e Placas de Titânio).",
    maxPerPlanet: 1,
    icon: 'Shipyard',
    requiredTech: 'tech_colony_1',
  },
  {
    id: 'bldg_defense_platform_p1',
    name: "Plataforma de Defesa Orbital Nv. 1",
    description: "Uma plataforma equipada com sensores básicos e armamento defensivo leve para proteger a colônia de ameaças menores.",
    cost: { 'Créditos': 50000, 'Polímeros Duráveis': 75, 'Fiação de Cobre': 40, 'Placas de Titânio': 20 },
    effects: { systemModifierEffects: { pirateSpawnChanceReduction: 0.05 } },
    effectDescription: "Reduz a chance de encontros com piratas neste sistema (-5% por plataforma) e melhora a segurança local.",
    maxPerPlanet: 3,
    icon: 'Shield',
    requiredTech: 'tech_colony_1',
  },
  {
    id: 'bldg_entertainment_hub_t1',
    name: 'Centro de Entretenimento Planetário',
    description: 'Um complexo de lazer com cinemas holográficos, parques virtuais e áreas sociais, essencial para manter o moral da população.',
    cost: { 'Créditos': 30000, 'Polímeros Duráveis': 50, 'Bens de Consumo': 10 },
    effects: { moraleBonusPerTick: 1.5 },
    effectDescription: "+1.5 de Moral por tick.",
    maxPerPlanet: 2,
    icon: 'Users',
    requiredTech: 'tech_colony_1',
  }
];

// --- POLICIES ---
export const MAX_ACTIVE_POLICIES = 2;
export const POLICY_TICK_INTERVAL_FOR_SKILL_POINT = 20; // Grant 1 skill point every X game ticks if policy active

export const POLICY_DEFINITIONS: PolicyDefinition[] = [
  {
    id: "pol_research_grants",
    name: "Bolsas de Pesquisa Ampliadas",
    description: "Investimento governamental em pesquisa científica para acelerar descobertas.",
    effectDescription: "+2 Pontos de Pesquisa por tick.",
    activationCost: { credits: 2500, researchPoints: 10 },
    ongoingEffect: { flatResearchPointBonusPerTick: 2 },
    icon: "ResearchLab",
    category: 'Economy'
  },
  {
    id: "pol_economic_stimulus",
    name: "Estímulo Econômico Governamental",
    description: "Injeção de capital na economia para impulsionar o comércio e a produção.",
    effectDescription: "+50 Créditos por tick.",
    activationCost: { credits: 5000 },
    ongoingEffect: { flatCreditBonusPerTick: 50 },
    icon: "Credits",
    category: 'Economy'
  },
  {
    id: "pol_iron_focus",
    name: "Foco na Produção de Minério",
    description: "Prioriza a extração e processamento de minério de ferro para atender às demandas industriais.",
    effectDescription: "+5 Minério de Ferro por tick.",
    activationCost: { credits: 1000 },
    ongoingEffect: { resourceProductionPerTick: [{ resourceName: "Minério de Ferro", amount: 5 }] },
    icon: "Resource",
    category: 'Economy'
  },
  {
    id: "pol_pilot_training",
    name: "Iniciativa de Treinamento de Pilotos",
    description: "Programas intensivos para aprimorar as habilidades dos pilotos da frota.",
    effectDescription: `+1 Ponto de Habilidade a cada ${POLICY_TICK_INTERVAL_FOR_SKILL_POINT} ticks.`,
    activationCost: { credits: 7500, researchPoints: 25 },
    ongoingEffect: { flatSkillPointBonusPerTick: 1 / POLICY_TICK_INTERVAL_FOR_SKILL_POINT }, // This is conceptual, actual logic in App.tsx will use a counter
    icon: "Skills",
    category: 'Military'
  }
];

// --- COLONY EVENTS ---
export const COLONY_EVENT_BASE_CHANCE_PER_TICK = 0.01; // 1% chance per colony per tick to *attempt* to trigger an event
export const LLM_EVENT_ROLL_CHANCE = 0.05; // 5% chance for an LLM event if the base event roll succeeds and no predefined event is triggered

export const COLONY_EVENT_TYPE_DEFINITIONS: ColonyEventTypeDefinition[] = [
  {
    id: "evt_resource_boom_iron",
    titlePlaceholder: "Descoberta de Veio Rico em {planetName}!",
    descriptionPlaceholder: "Mineradores em {planetName} encontraram um veio de Minério de Ferro excepcionalmente puro! A produção aumentou temporariamente.",
    baseChance: 0.3, // Chance if the base 1% hits
    requiresPlayerAction: false,
    immediateEffects: [
      { type: ColonyEventEffectType.RESOURCE_CHANGE, resourceName: "Minério de Ferro", amount: 100, message: "Minério de Ferro extra bônus recebido!" }
    ],
  },
  {
    id: "evt_equipment_failure_minor",
    titlePlaceholder: "Falha de Equipamento em {planetName}",
    descriptionPlaceholder: "Uma pequena falha no equipamento de suporte vital em {planetName} exigiu reparos urgentes e custosos.",
    baseChance: 0.2,
    requiresPlayerAction: false,
    immediateEffects: [
      { type: ColonyEventEffectType.CREDIT_CHANGE, amount: -500, message: "Créditos gastos em reparos emergenciais." }
    ],
  },
  {
    id: "evt_local_discovery_artifact",
    titlePlaceholder: "Sinal Anômalo em {planetName}",
    descriptionPlaceholder: "Sensores em {planetName} detectaram um sinal estranho vindo de uma estrutura subterrânea. Pode ser algo valioso ou perigoso.",
    baseChance: 0.1,
    requiresPlayerAction: true,
    choices: [
      {
        id: "investigate_artifact",
        text: "Investigar o sinal (Custo: 250 CR)",
        tooltip: "Pode render um artefato ou nada.",
        effects: [
          { type: ColonyEventEffectType.CREDIT_CHANGE, amount: -250 },
          // Placeholder: Future logic might add a chance to find an artifact or trigger another event
          { type: ColonyEventEffectType.RESEARCH_POINTS_CHANGE, amount: 10, message: "+10 Pontos de Pesquisa pela investigação." } // Small research bonus for trying
        ]
      },
      {
        id: "ignore_artifact",
        text: "Ignorar o sinal por segurança.",
        tooltip: "Nenhum risco, nenhuma recompensa.",
        effects: [
            // No direct effect, maybe a morale penalty if morale system exists later
        ]
      }
    ],
    durationTicks: 20, // Player has 20 ticks to decide
  },
  {
    id: "evt_morale_boost_festival",
    titlePlaceholder: "Festival Local em {planetName}!",
    descriptionPlaceholder: "Os colonos de {planetName} organizaram um festival espontâneo, elevando o moral.",
    baseChance: 0.15,
    requiresPlayerAction: false,
    immediateEffects: [
      { type: ColonyEventEffectType.MORALE_CHANGE, amount: 5, message: "Moral da colônia aumentado!" } // Needs morale system
    ],
  }
];
