/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProgress, LeaderboardEntry } from '../types';

const API_URL = 'http://127.0.0.1:5000/api';

export const api = {
  async getProgress(username: string): Promise<{ data: any; success: boolean }> {
    try {
      const res = await fetch(`${API_URL}/get_progress/${encodeURIComponent(username)}`);
      if (res.ok) {
        return { data: await res.json(), success: true };
      }
      return { data: null, success: false };
    } catch (e) {
      console.error("Failed to get progress:", e);
      return { data: null, success: false };
    }
  },

  async saveProgress(progress: UserProgress): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/save_progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: progress.username,
          score: progress.highestScore || progress.score,
          coins: progress.coins,
          diamonds: progress.diamonds,
          health: progress.health,
          completedAchievements: progress.completedAchievements
        })
      });
      return res.ok;
    } catch (e) {
      console.error("Failed to save progress:", e);
      return false;
    }
  },

  async getLeaderboard(currentUsername: string, currentRank: string): Promise<LeaderboardEntry[]> {
    try {
      // Add cache: 'no-store' to prevent browser from caching the GET request
      const res = await fetch(`${API_URL}/leaderboard`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const mapped = data.leaderboard.map((row: any) => ({
          username: row.username,
          world: 1, // Fallback
          score: row.points,
          rank: row.username === currentUsername ? currentRank : "Breaker",
          isPlayer: row.username === currentUsername
        }));
        // Ensure it's always sorted highest to lowest on the frontend
        return mapped.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score);
      }
    } catch (e) {
      console.error("Failed to fetch leaderboard:", e);
    }
    return [];
  }
};
