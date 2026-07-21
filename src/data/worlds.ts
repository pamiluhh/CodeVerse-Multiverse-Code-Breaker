/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */



export interface WorldInfo {
  id: number;
  name: string;
  mission: string;
  description: string;
  bossName: string;
  rewardItem: string;
  rewardIcon: string;
  primaryColor: string;
  bgGradient: string;
}

export const WORLDS: WorldInfo[] = [
  {
    id: 1,
    name: "Chemical Laboratory",
    mission: "Bypass a high-security research laboratory lock.",
    description: "Navigate through sealed heavy doors by deciphering mathematical override formulas before the containment system triggers the toxic purge.",
    bossName: "Facility Mainframe",
    rewardItem: "Lab Passcard",
    rewardIcon: "🔑",
    primaryColor: "emerald",
    bgGradient: "from-slate-900 via-emerald-950 to-slate-950",
  },
  {
    id: 2,
    name: "Defusal Sector",
    mission: "Disarm ticking ordnance payloads.",
    description: "Isolate unstable electronic frequencies. Connect the bypass wires and decode the core pattern before the charge detonates.",
    bossName: "Detonator Core",
    rewardItem: "Solder Kit",
    rewardIcon: "🛠️",
    primaryColor: "rose",
    bgGradient: "from-slate-900 via-rose-950 to-slate-950",
  },
  {
    id: 3,
    name: "Forgotten Coast",
    mission: "Recover lost cargo containers from the shore.",
    description: "Scan an old archipelago coordinate grid. Solve the positional keycodes to locate buried cache containers packed with coins and diamonds.",
    bossName: "Salvage Master",
    rewardItem: "Brass Compass",
    rewardIcon: "🧭",
    primaryColor: "amber",
    bgGradient: "from-slate-900 via-amber-950 to-slate-950",
  },
  {
    id: 4,
    name: "Deep Space Receiver",
    mission: "Parse complex deep space radio transmissions.",
    description: "Sift through raw stellar static. Standard base-10 coordinates are useless here—triangulate the feed using an octal frequency signal.",
    bossName: "Orbital Transmitter",
    rewardItem: "Spectrum Decoder",
    rewardIcon: "👽",
    primaryColor: "fuchsia",
    bgGradient: "from-slate-900 via-fuchsia-950 to-slate-950",
  },
  {
    id: 5,
    name: "Outpost Zero",
    mission: "Secure the defensive perimeter gate locks.",
    description: "Secure terminal override codes to reinforce perimeter bulkheads. Accuracy is vital: every failed guess lets the horde draw closer.",
    bossName: "Alpha Infected",
    rewardItem: "Tactical Rig",
    rewardIcon: "🎒",
    primaryColor: "lime",
    bgGradient: "from-slate-900 via-lime-950 to-slate-950",
  },
  {
    id: 6,
    name: "Subterranean Vaults",
    mission: "Deactivate deep chamber security guards.",
    description: "Infiltrate forgotten stone vaults. Every incorrect override alerts the automated guardians, initiating local counter-measures.",
    bossName: "Gargoyle Sentry",
    rewardItem: "Iron Broadsword",
    rewardIcon: "⚔️",
    primaryColor: "violet",
    bgGradient: "from-slate-900 via-violet-950 to-slate-950",
  },
  {
    id: 7,
    name: "Orbital Cruiser",
    mission: "Reboot failing life support systems on a drifting vessel.",
    description: "Bypass shorted circuit boards on a damaged heavy starship. Repair the Engine, Oxygen, Radar, Fuel, and Escape modules in order before the air is exhausted.",
    bossName: "Auxiliary Core AI",
    rewardItem: "Navigational Chip",
    rewardIcon: "🌌",
    primaryColor: "sky",
    bgGradient: "from-slate-900 via-sky-950 to-slate-950",
  },
  {
    id: 8,
    name: "The Archives",
    mission: "Track and isolate compromised database logs.",
    description: "Examine five linked evidence records: Phones, Laptops, Vaults, and Secret files. Synthesize the logs to calculate the final master password.",
    bossName: "Data Administrator",
    rewardItem: "Security ID Card",
    rewardIcon: "🛡️",
    primaryColor: "indigo",
    bgGradient: "from-slate-900 via-indigo-950 to-slate-950",
  },
  {
    id: 9,
    name: "The Club Room",
    mission: "Bypass the VIP lounge high-roller controls.",
    description: "Analyze the mathematical slot machine algorithms. Balance guess thresholds, spin reels for digits, and crack the security vault.",
    bossName: "Casino Pit Boss",
    rewardItem: "Gold Token",
    rewardIcon: "💳",
    primaryColor: "red",
    bgGradient: "from-slate-900 via-red-950 to-slate-950",
  },
  {
    id: 10,
    name: "Border Rampart",
    mission: "Calibrate defensive artillery along the walls.",
    description: "Aim artillery towers by solving the targeting trajectory equations. Missed shots leave the walls vulnerable to incoming siege lines.",
    bossName: "Command Tank",
    rewardItem: "Tactical Comm",
    rewardIcon: "👑",
    primaryColor: "orange",
    bgGradient: "from-slate-900 via-orange-950 to-slate-950",
  },
  {
    id: 11,
    name: "Reactor Core",
    mission: "Isolate highly unstable volatile isotopes.",
    description: "Solve atomic valency matrix ciphers to prevent a reactor meltdown. Caution: wrong calculations trigger a containment flare that instantly drains remaining time.",
    bossName: "Reactor Director",
    rewardItem: "Isotopic Fuel cell",
    rewardIcon: "💎",
    primaryColor: "cyan",
    bgGradient: "from-slate-900 via-cyan-950 to-slate-950",
  },
  {
    id: 12,
    name: "Aether Grid",
    mission: "Align runic frequency channels.",
    description: "Solve runic coordinate patterns to master the Fire, Ice, Thunder, and Wind alignment arrays. Link the lines of power to unlock the master core.",
    bossName: "Grid Keeper",
    rewardItem: "Aether Prism",
    rewardIcon: "🔮",
    primaryColor: "purple",
    bgGradient: "from-slate-900 via-purple-950 to-slate-950",
  },
  {
    id: 13,
    name: "System Mainframe",
    mission: "Deactivate the core system terminal.",
    description: "The final barrier. Penetrate five consecutive high-speed encrypted firewall lines using the security key-items scavenged along your journey.",
    bossName: "Master Grid Overlord",
    rewardItem: "Systems Architect Clearance",
    rewardIcon: "🌟",
    primaryColor: "pink",
    bgGradient: "from-slate-900 via-pink-950 to-slate-950",
  }
];


