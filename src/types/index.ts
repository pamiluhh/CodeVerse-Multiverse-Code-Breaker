/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProgress {
  username: string;
  currentWorld: number; // 1 to 13 (13 is Overlord Core)
  currentLevel: number; // Stage within world (e.g., 1, 2, 3 [Boss])
  coins: number;
  diamonds: number;
  keys: number;
  health: number; // Max 100
  lives: number; // Max 3
  highestScore: number;
  score: number;
  combo: number;
  rank: string;
  unlockedWorlds: number[];
  inventory: { [itemId: string]: number };
  completedAchievements: string[];
  settings: {
    musicEnabled: boolean;
    sfxEnabled: boolean;
  };
}

export interface UserAccount {
  username: string;
  passwordHash: string; // Local simple auth
  securityQuestion: string;
  securityAnswer: string;
  progress: UserProgress;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  rewardCoins: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  costType: 'coins' | 'diamonds';
  icon: string;
}

export interface LeaderboardEntry {
  username: string;
  world: number;
  score: number;
  rank: string;
  isPlayer?: boolean;
}
