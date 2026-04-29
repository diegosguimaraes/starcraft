
import React, { ReactNode } from 'react';

// Helper function to sanitize labels for image paths
// e.g., "Colônias" -> "colonias", "Fabricação Avançada" -> "fabricacaoavancada"
export const sanitizeLabelForImagePath = (label: string): string => {
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .replace(/\s+/g, '') // Remove spaces
    .replace(/[^a-z0-9]/gi, ''); // Remove non-alphanumeric characters
};

// Placeholder SVG components - replace with your actual SVGs or more detailed ones
const PlaceholderIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
  </svg>
);

const GalaxyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 .9C5.88.9.9 5.88.9 12s4.98 11.1 11.1 11.1 11.1-4.98 11.1-11.1S18.12.9 12 .9zm0 20.4c-5.13 0-9.3-4.17-9.3-9.3s4.17-9.3 9.3-9.3 9.3 4.17 9.3 9.3-4.17 9.3-9.3 9.3zM12 5.4c-3.63 0-6.6 2.97-6.6 6.6s2.97 6.6 6.6 6.6 6.6-2.97 6.6-6.6-2.97-6.6-6.6-6.6zm0 11.4c-2.64 0-4.8-2.16-4.8-4.8s2.16-4.8 4.8-4.8 4.8 2.16 4.8 4.8-2.16 4.8-4.8 4.8z"/><circle cx="12" cy="12" r="1.5"/></svg>
);
const InventoryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 8h2v2H6zm0 4h2v2H6zm0 4h2v2H6zm4-8h8v2H10zm0 4h8v2H10zm0 4h8v2H10z"/></svg>
);
const MissionIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
);
const CraftingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6.1 6.1 9 1.7 4.6c-1.1 2.4-.7 5.4 1.3 7.4 1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>
);
const ColonyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.69L17.31 11H6.69L12 5.69zM17 18H7v-6h10v6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
);
const NpcIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
);
const DiplomacyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
);
const HangarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M20 6H4V4h16v2zm0 2H4v10h5.08L12 22l2.92-4H20V8zm-8 8H8v-2h4v2zm4-2h-2v-2h2v2z"/></svg>
);
const ProfileIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/></svg>
);
// Use a generic "Skills" icon for Policies if a specific one isn't defined yet
const SkillsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>
);
const ResourceIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M6 2v6h.01L6.01 8.01 10 12l-3.99 3.99-.01.01H6V22H4v-6H2v-2h2v-4H2V8h2V2h2zm10 0v6h2V2h-2zm-2 8h2v4h-2v-4zm2 6v6h2v-6h-2z"/></svg>
);

const CombatIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M7 2v2H5v18h2v-2h10v2h2V4h-2V2H7zm10 16H7V6h10v12zM9 10h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z"/></svg>
);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
);

const ShipStatsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
);


// Icons object stores ReactNode components (SVG components)
export const Icons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Galaxy: GalaxyIcon,
  Planet: ColonyIcon, // Using ColonyIcon for Planet as a placeholder
  SpaceStation: HangarIcon, // Using HangarIcon for SpaceStation
  Shipyard: CraftingIcon, // Using CraftingIcon for Shipyard
  ShipModules: PlaceholderIcon,
  ShipStatsIcon: ShipStatsIcon,
  Inventory: InventoryIcon,
  NPC: NpcIcon,
  Mission: MissionIcon,
  Crafting: CraftingIcon,
  Resource: ResourceIcon,
  Combat: CombatIcon,
  Colony: ColonyIcon,
  Colonies: ColonyIcon, // Map Colonies to ColonyIcon
  Star: GalaxyIcon, // Map Star to GalaxyIcon
  System: GalaxyIcon, // Map System to GalaxyIcon
  Ship: HangarIcon, // Map Ship to HangarIcon
  Trade: ResourceIcon, // Map Trade to ResourceIcon
  ShipInfo: PlaceholderIcon,
  Population: NpcIcon, // Using NpcIcon for Population
  Production: PlaceholderIcon,
  Save: PlaceholderIcon,
  Load: PlaceholderIcon,
  Settings: PlaceholderIcon,
  Character: ProfileIcon, // Using ProfileIcon for Character
  Profile: ProfileIcon,
  Trash: PlaceholderIcon,
  Skills: SkillsIcon,
  Tech: PlaceholderIcon,
  Locked: PlaceholderIcon,
  Unlocked: PlaceholderIcon,
  Points: PlaceholderIcon,
  Credits: PlaceholderIcon,
  Cargo: PlaceholderIcon,
  Speed: PlaceholderIcon,
  Shield: PlaceholderIcon,
  Hull: PlaceholderIcon,
  Hangar: HangarIcon,
  SystemCapital: GalaxyIcon,
  SystemImportant: GalaxyIcon,
  SystemDefault: GalaxyIcon,
  Anomaly: PlaceholderIcon,
  ScanSystem: PlaceholderIcon,
  Travel: PlaceholderIcon,
  Rename: PlaceholderIcon,
  Diplomacy: DiplomacyIcon,
  ResearchLab: PlaceholderIcon,
  Users: UsersIcon,
  ExoProcessor: PlaceholderIcon,
  TechExoRefining: PlaceholderIcon,
  Policies: SkillsIcon, // Using SkillsIcon for Policies as per user's GameInterface
};

// Optional: A simpler renderIcon if you only pass keys and want to render the component
// If you pass ReactNode directly, you don't need this helper in that specific case.
export const renderStoredIcon = (iconKey: string, className: string = "w-5 h-5"): ReactNode => {
  const IconComponent = Icons[iconKey];
  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  console.warn(`SVG Icon key "${iconKey}" not found in Icons object.`);
  return <div className={`${className} bg-red-500 opacity-50 rounded-sm`} title={`Missing SVG icon: ${iconKey}`}></div>;
};
