import { ShopItem } from '../types';

export const SHOP_ITEMS: ShopItem[] = [
  { id: "extra_life", name: "Extra Life", description: "Adds 1 extra life slot in active code breaks.", cost: 80, costType: "coins", icon: "❤️" },
  { id: "hint", name: "Cyber Hint", description: "Receive an immediate extra puzzle clue.", cost: 30, costType: "coins", icon: "💡" },
  { id: "shield", name: "Electro Shield", description: "Negates the next wrong guess penalty.", cost: 100, costType: "coins", icon: "🛡️" },
  { id: "time_boost", name: "Temporal Boost", description: "Adds 30 extra seconds to active stage timers.", cost: 50, costType: "coins", icon: "⏳" },
  { id: "reveal_digit", name: "Reveal Cipher Digit", description: "Instantly decodes one of the code's positions.", cost: 150, costType: "coins", icon: "🔍" },
  { id: "double_coins", name: "Double Booster", description: "Permanent double coins reward for the next 2 levels.", cost: 120, costType: "coins", icon: "🪙" },
  { id: "health_potion", name: "Nano Medkit", description: "Restores 50 health immediately in active combat.", cost: 40, costType: "coins", icon: "🧪" },
  { id: "skip_level", name: "Grid Bypass", description: "Bypass any standard non-boss stage directly.", cost: 15, costType: "diamonds", icon: "⚡" },
  { id: "lucky_spin_ticket", name: "Lucky Spin Core", description: "Grants one free spin on the Casino slot machines.", cost: 25, costType: "coins", icon: "🎰" }
];
