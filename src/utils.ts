
import { PlayerInventory, Ship, ShipStats, ShipHull, ShipModule } from './types';
import { RESOURCE_UNIT_WEIGHT, INITIAL_SHIP_MODULES } from './constants'; // Import necessary constants

export const generateId = (): string => Math.random().toString(36).substr(2, 9);

export const calculateDistance = (pos1: {x:number, y:number}, pos2: {x:number, y:number}): number => {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
};

export const getPlanetImageUrl = (biome: string, planetId: string): string => { 
  const biomeKey = biome.toLowerCase().split(" ")[0].replace(/[^a-z0-9]/gi, ''); // Sanitize biome for URL
  return `https://picsum.photos/seed/${planetId}_${encodeURIComponent(biomeKey)}/400/300`;
};

export const calculateShipStats = (ship: Ship | null): ShipStats => { 
  const defaultStats: ShipStats = { 
    baseCargoCapacity: 0, baseSpeed: 0, baseShieldStrength: 0, baseHullIntegrity: 0, 
    baseAttackPower: 0, baseDefenseRating: 0,
    baseKineticDamage: 0, baseEnergyDamage: 0, baseExplosiveDamage: 0,
    baseKineticResistance: 0, baseEnergyResistance: 0, baseExplosiveResistance: 0,
    totalCargoCapacity: 0, totalSpeed: 0, totalShieldStrength: 0, totalHullIntegrity: 0,
    totalAttackPower: 0, totalDefenseRating: 0,
    totalKineticDamage: 0, totalEnergyDamage: 0, totalExplosiveDamage: 0,
    totalKineticResistance: 0, totalEnergyResistance: 0, totalExplosiveResistance: 0,
  }; 
  if (!ship) return defaultStats; 
  
  let calculated: ShipStats = { 
    ...defaultStats, 
    baseCargoCapacity: ship.baseStats.baseCargoCapacity,
    baseSpeed: ship.baseStats.baseSpeed,
    baseShieldStrength: ship.baseStats.baseShieldStrength,
    baseHullIntegrity: ship.baseStats.baseHullIntegrity,
    baseAttackPower: ship.baseStats.baseAttackPower,
    baseDefenseRating: ship.baseStats.baseDefenseRating,
    baseKineticDamage: ship.baseStats.baseKineticDamage,
    baseEnergyDamage: ship.baseStats.baseEnergyDamage,
    baseExplosiveDamage: ship.baseStats.baseExplosiveDamage,
    baseKineticResistance: ship.baseStats.baseKineticResistance,
    baseEnergyResistance: ship.baseStats.baseEnergyResistance,
    baseExplosiveResistance: ship.baseStats.baseExplosiveResistance,

    totalCargoCapacity: ship.baseStats.baseCargoCapacity,
    totalSpeed: ship.baseStats.baseSpeed,
    totalShieldStrength: ship.baseStats.baseShieldStrength,
    totalHullIntegrity: ship.baseStats.baseHullIntegrity,
    totalAttackPower: ship.baseStats.baseAttackPower,
    totalDefenseRating: ship.baseStats.baseDefenseRating,
    totalKineticDamage: ship.baseStats.baseKineticDamage,
    totalEnergyDamage: ship.baseStats.baseEnergyDamage,
    totalExplosiveDamage: ship.baseStats.baseExplosiveDamage,
    totalKineticResistance: ship.baseStats.baseKineticResistance,
    totalEnergyResistance: ship.baseStats.baseEnergyResistance,
    totalExplosiveResistance: ship.baseStats.baseExplosiveResistance,
  }; 
  
  ship.modules.forEach(moduleInstance => { 
    if (moduleInstance && moduleInstance.effects) { 
      calculated.totalCargoCapacity += moduleInstance.effects.cargoCapacity || 0; 
      calculated.totalSpeed += moduleInstance.effects.speed || 0; 
      calculated.totalShieldStrength += moduleInstance.effects.shieldStrength || 0; 
      calculated.totalHullIntegrity += moduleInstance.effects.hullIntegrity || 0; 
      calculated.totalAttackPower += moduleInstance.effects.attackPower || 0;
      calculated.totalDefenseRating += moduleInstance.effects.defenseRating || 0;
      calculated.totalKineticDamage += moduleInstance.effects.kineticDamage || 0;
      calculated.totalEnergyDamage += moduleInstance.effects.energyDamage || 0;
      calculated.totalExplosiveDamage += moduleInstance.effects.explosiveDamage || 0;
      calculated.totalKineticResistance += moduleInstance.effects.kineticResistance || 0;
      calculated.totalEnergyResistance += moduleInstance.effects.energyResistance || 0;
      calculated.totalExplosiveResistance += moduleInstance.effects.explosiveResistance || 0;
    }
  }); 
  return calculated;
};

export const calculateCurrentCargoUsage = (inventory: PlayerInventory): number => { 
  let totalUsage = 0;
  for (const resourceName in inventory) {
    totalUsage += inventory[resourceName] * RESOURCE_UNIT_WEIGHT;
  }
  return totalUsage;
};

export const createShipFromHull = (
    hullData: ShipHull, 
    shipInstanceId: string, 
    shipName: string
): Ship | null => {
    if (!hullData) return null;
    const newShip: Ship = {
      id: shipInstanceId,
      name: shipName,
      hullTypeId: hullData.id,
      baseStats: { ...hullData.baseStats },
      modules: hullData.initialModules?.map(modIdOrData => {
          if (typeof modIdOrData === 'string') {
              return INITIAL_SHIP_MODULES.find(m => m.id === modIdOrData) || null;
          }
          return modIdOrData; // Should ideally not happen if initialModules is string[]
      }) || Array(hullData.maxModuleSlots).fill(null),
      maxModuleSlots: hullData.maxModuleSlots,
    };
    return newShip;
};
