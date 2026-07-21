export const WORLD_RULES: { [key: number]: { title: string; objective: string; steps: string[]; tips: string[] } } = {
  1: {
    title: "Escape Laboratory",
    objective: "Guess the 2-digit chemical bypass security code to exit the room before decontamination occurs.",
    steps: [
      "Look at the 'Signal Decryption Hints' panel on the left to find initial clues about the target code.",
      "Type a 2-digit guess (between 15 and 95) and hit 'Submit'.",
      "Observe the high/low feedback calibration: 'Calibration too LOW' means guess higher, 'Calibration too HIGH' means lower."
    ],
    tips: [
      "Use mathematical hints (primes, even/odd, divisibility) to instantly eliminate impossible values.",
      "The code is randomized every stage, so stay sharp!"
    ]
  },
  2: {
    title: "Bomb Defusal Center",
    objective: "Disable a ticking thermonuclear bomb by cracking its 3-digit decryption frequency before detonation.",
    steps: [
      "Check the 'Signal Decryption Hints' on the left. It displays the Sum of digits and whether the Last digit is Even or Odd.",
      "Interact with the Wire Panel above. You have 3 wires: RED, BLUE, and GREEN. Connect one to try and bypass the frequency.",
      "Connecting a wire correctly has a 1 in 3 chance of instantly revealing a digit in the target code! (Warning: There is also a 1 in 3 chance of a countdown penalty of -10 seconds).",
      "Type your 3-digit sequence (between 100 and 999) in the entry console and click 'Submit'."
    ],
    tips: [
      "Mathematical Strategy: If 'Sum of digits is 15' and 'Last digit is EVEN', try finding 3 digits that add up to 15 ending in an even digit, such as '546' (5+4+6=15, and 6 is even!).",
      "Use inventory boosters like 'Reveal Cipher' or 'Cyber Hint' to get free revealed positions or extra clues if you are running out of time."
    ]
  },
  3: {
    title: "Lost Treasure Island",
    objective: "Locate hidden pirate treasure chests by scanning coordinate grids using seismic sonar radar.",
    steps: [
      "The coordinates consist of a Column letter (A to E) and a Row digit (1 to 5), such as C3.",
      "Read the hints on the left for column direction (e.g., WEST/EAST/CENTER) and row even/odd status.",
      "Click directly on any cell on the grid map to dig/sonar-scan.",
      "Check the guess history log for radar temperature readings: 'Warmer!' means the treasure is adjacent/close, 'Colder!' means you are far."
    ],
    tips: [
      "Start by digging near the center of the suggested column/row range.",
      "Once you find 'Warmer!', search the immediate surrounding tiles to locate the treasure chest!"
    ]
  },
  4: {
    title: "Alien Signal Decoder",
    objective: "Decode complex alien static frequency sequences using an octal (0-7) numeral system.",
    steps: [
      "Alien signals only utilize digits from 0 to 7 (no 8s or 9s are ever used).",
      "The hints on the left will give you the sum of the digits.",
      "Enter a 3-digit octal sequence in the input field and submit."
    ],
    tips: [
      "Since digits can only be 0-7, the maximum sum is 21 (7+7+7) and minimum is 0.",
      "Use the 'Reveal Cipher' cargo booster to pinpoint a tricky position if you get stuck."
    ]
  },
  5: {
    title: "Zombie Outpost",
    objective: "Secure the base gate lock code while holding back waves of infected undead walkers.",
    steps: [
      "Crack a 2-digit security code before the zombie distance hits 0 meters.",
      "The hint displays the mathematical multiplication (product) of the digits.",
      "If you submit an incorrect guess, zombies will break through your barricades, advancing closer (-4 meters) and dealing 25% damage to your health."
    ],
    tips: [
      "If zombies are getting too close, click 'Shoot Bullets' to push the horde back (+5 meters).",
      "Example: If 'Multiplication of digits yields 12', the code could be 26 (2x6=12), 34 (3x4=12), 43 (4x3=12), or 62 (6x2=12)."
    ]
  },
  6: {
    title: "Dungeon Adventure",
    objective: "Vanquish savage monsters locking down subterranean vaults by deciphering 3-digit door keycodes.",
    steps: [
      "Analyze the diverse mathematical cues (first digit, sum of digits, and even/odd status of middle and last digits).",
      "Look at the divisibility test hints (divisible by 2, 3, or 5) to filter out impossible combinations.",
      "Submit guesses in the terminal. Even if you miss, you will receive full calibration data indicating if your guess is too HIGH or too LOW, plus the exact number of correct matching digits and locations!"
    ],
    tips: [
      "Combine the high/low feedback with the mathematical cues to narrow down the target code in 2-3 guesses.",
      "Always keep an eye on your Health indicator. Use a 'Nano Medkit' booster if your health is critical.",
      "Defeating the Boss awards the Legendary Sword which is extremely powerful!"
    ]
  },
  7: {
    title: "Space Repair Mission",
    objective: "Manually bypass failing ships life support grids by rebooting modules in strict order under a short air reserve.",
    steps: [
      "Repair Engine, Oxygen, Radar, Fuel, and Escape modules in order.",
      "Analyze the range hint (e.g., 'Code is between 450 and 530').",
      "Guess the exact 3-digit code inside that range to bring the systems back online."
    ],
    tips: [
      "Use a binary search strategy: guess the exact middle of the range first, then use high/low feedback logs to narrow down the range quickly."
    ]
  },
  8: {
    title: "Detective Mystery",
    objective: "Crack the secret 3-digit criminal locker code using LOGICAL DEDUCTION by investigating crime scene assets to collect clues.",
    steps: [
      "Investigate every crime scene asset (Phone, Laptop, Vault, Files, Evidence) by clicking on them.",
      "The reasoning input console is locked until all 5 crime scene assets have been scanned.",
      "Analyze the gathered clues to find the single possible 3-digit code that satisfies them all.",
      "Enter the code to unlock the vault. Incorrect guesses unlock additional forensic report clues!"
    ],
    tips: [
      "No guessing needed! The 5 initial clues always guarantee exactly ONE unique correct answer.",
      "If you make a mistake, don't worry. Each incorrect guess unlocks an additional detailed forensic clue."
    ]
  },
  9: {
    title: "Lucky Casino",
    objective: "Wager on the high-frequency jackpot cipher to unlock casino vaults and escape.",
    steps: [
      "Guess the 2-digit Slot Code using range hints.",
      "Click 'Spin Lucky Wheel' to roll the slot reels and extract additional clues about the code.",
      "Submit your 2-digit wager code in the terminal input."
    ],
    tips: [
      "Spinning the slot wheel is free but takes a small fraction of time. Use it to gain digit presence hints."
    ]
  },
  10: {
    title: "Kingdom Defense",
    objective: "Protect the castle fortress from siege engines by entering the exact artillery ballista launch angles.",
    steps: [
      "Guess the launch angle code (between 10 and 90 degrees).",
      "Incorrect angles miss the target, allowing enemy siege rams to strike your castle walls, dealing 25% damage.",
      "Read range clues (e.g., High Arc > 45 degrees or Low Arc <= 45 degrees)."
    ],
    tips: [
      "Use Electro Shield boosters to buffer yourself against incoming impact damage."
    ]
  },
  11: {
    title: "Scientist Laboratory",
    objective: "Balance highly volatile radioactive chemical valence isotopes before they explode.",
    steps: [
      "Guess the 2-digit compound valence code (between 10 and 90).",
      "Caution: Every wrong guess causes a rapid chemical reaction blast that instantly siphons 10 seconds of remaining time!",
      "Read isotopic stability cues (divisibility hints) to find the correct valence weight."
    ],
    tips: [
      "Because wrong guesses carry heavy time penalties, purchase 'Temporal Boost' (+30s) boosters from the shop beforehand."
    ]
  },
  12: {
    title: "Magic Academy",
    objective: "Master runic arcane chants by combining fire, ice, thunder, and wind circles of power.",
    steps: [
      "Build an elemental sequence chant (e.g., 'FIRE-ICE' or 'THUNDER-WIND').",
      "Click on the spell rune buttons (FIRE, ICE, THUNDER, WIND) to sequence your chant.",
      "Submit the elemental formula to Master the circle."
    ],
    tips: [
      "Read alignment cues showing whether the first rune triggers energy flow (FIRE/THUNDER) or cold structure (ICE/WIND)."
    ]
  },
  13: {
    title: "The Overlord Core",
    objective: "Hack the master supercomputer mainframe using your entire collected multiverse arsenal.",
    steps: [
      "Crack 3 consecutive rapid-fire 5-digit firewall sequences.",
      "Use your hard-earned boss reward key-items (Laboratory Key, Bomb Toolkit, Golden Compass, and more) as super-weapons.",
      "Click any of the active items below the input box to instantly bypass stages, reveal digits, or add massive remaining time!"
    ],
    tips: [
      "This is the final test of your skills. Spend your earned Coins/Diamonds in the hub shop for boosters before entering."
    ]
  }
};

export const getWorldTheme = (id: number) => {
  switch (id) {
    case 1:
      return {
        headerTitle: "DECONTAMINATION BYPASS SYSTEM",
        headerDesc: "The laboratory door's airlock is secured by active chemical sequences. Solve the interactive panel or use Reveal Cipher to see the hints below!",
        containerClass: "from-emerald-950/30 via-teal-950/30 to-cyan-950/30 border-emerald-500/20",
        titleColor: "text-emerald-300",
        lockedBadge: "🛡️ LOCKED",
        unlockedBadge: "✦ SOLVED ✦",
        badgeClass: "text-emerald-400",
        lockedBadgeClass: "text-emerald-400",
        lockedBoxClass: "bg-emerald-950/20 border-emerald-500/30 text-emerald-300 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20",
        lockedBoxClassInside: "bg-emerald-950/60 text-emerald-300 border border-emerald-900/30",
        lockedEmojis: ['🧪', '🔬', '⚗️', '🧫', '🧬', '🌡️'],
        posPrefix: "CHEM",
        titleTooltip: "Airlock bypass slot"
      };
    case 2:
      return {
        headerTitle: "THERMONUCLEAR DECRYPTION FREQUENCY",
        headerDesc: "The core mainframe is ticking down. Cut wires to force bypasses or use Reveal Cipher to see the hints below!",
        containerClass: "from-red-950/30 via-orange-950/30 to-amber-950/30 border-red-500/20",
        titleColor: "text-red-300",
        lockedBadge: "💣 LOCKED",
        unlockedBadge: "✦ DISARMED ✦",
        badgeClass: "text-emerald-400",
        lockedBadgeClass: "text-red-400",
        lockedBoxClass: "bg-red-950/20 border-red-500/30 text-red-300 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/20",
        lockedBoxClassInside: "bg-red-950/60 text-red-300 border border-red-900/30",
        lockedEmojis: ['💣', '🔌', '⚡', '🧨', '🔥', '⚙️'],
        posPrefix: "FREQ",
        titleTooltip: "Thermonuclear signal frequency slot"
      };
    case 3:
      return {
        headerTitle: "LOST PIRATE TREASURE SEALS",
        headerDesc: "Seismic sonar signals detect underground metal chests. Dig on the grid map or use Reveal Cipher to see the hints below!",
        containerClass: "from-amber-950/30 via-yellow-950/30 to-amber-900/20 border-amber-500/20",
        titleColor: "text-amber-300",
        lockedBadge: "☠️ BURIED",
        unlockedBadge: "✦ FOUND ✦",
        badgeClass: "text-emerald-400",
        lockedBadgeClass: "text-amber-400",
        lockedBoxClass: "bg-amber-950/20 border-amber-500/30 text-amber-300 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20",
        lockedBoxClassInside: "bg-amber-950/60 text-amber-300 border border-amber-900/30",
        lockedEmojis: ['🏴‍☠️', '⚓', '🧭', '🪙', '💎', '🗺️'],
        posPrefix: "MAP",
        titleTooltip: "Treasure chest coordinate slot"
      };
    case 4:
      return {
        headerTitle: "ALIEN COGNITIVE SIGNAL MATRIX",
        headerDesc: "Decipher the octal cosmic frequencies transmitted from outer space. Calibrate the signals or use Reveal Cipher to see the hints below!",
        containerClass: "from-fuchsia-950/30 via-purple-950/30 to-indigo-950/30 border-fuchsia-500/20",
        titleColor: "text-fuchsia-300",
        lockedBadge: "🌌 LOCKED",
        unlockedBadge: "✦ SOLVED ✦",
        badgeClass: "text-emerald-400",
        lockedBadgeClass: "text-fuchsia-400",
        lockedBoxClass: "bg-fuchsia-950/20 border-fuchsia-500/30 text-fuchsia-300 hover:border-fuchsia-400 hover:shadow-lg hover:shadow-fuchsia-500/20",
        lockedBoxClassInside: "bg-fuchsia-950/60 text-fuchsia-300 border border-fuchsia-900/30",
        lockedEmojis: ['👽', '🛸', '📡', '☄️', '🪐', '💫'],
        posPrefix: "FREQ",
        titleTooltip: "Alien cosmic frequency slot"
      };
    case 5:
      return {
        headerTitle: "OUTPOST GATE DEFENSE LOCKS",
        headerDesc: "Hold off the zombie walkers at the steel door gate. Submit the mathematical lock key or use Reveal Cipher to see the hints below!",
        containerClass: "from-green-950/30 via-lime-950/30 to-emerald-950/30 border-green-500/20",
        titleColor: "text-green-300",
        lockedBadge: "🧟 ATTACK",
        unlockedBadge: "✦ SECURED ✦",
        badgeClass: "text-emerald-400",
        lockedBadgeClass: "text-green-400",
        lockedBoxClass: "bg-green-950/20 border-green-500/30 text-green-300 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/20",
        lockedBoxClassInside: "bg-green-950/60 text-green-300 border border-green-900/30",
        lockedEmojis: ['🧟', '🚪', '🩸', '☣️', '⚠️', '🪵'],
        posPrefix: "LOCK",
        titleTooltip: "Defensive perimeter door lock slot"
      };
    case 6:
      return {
        headerTitle: "SUBTERRANEAN DUNGEON VAULTS",
        headerDesc: "Dungeon monsters are guarding ancient lockboxes. Defeat the beasts to claim key digits or use Reveal Cipher to see the hints below!",
        containerClass: "from-slate-900/40 via-stone-900/40 to-neutral-900/40 border-stone-500/20",
        titleColor: "text-stone-300",
        lockedBadge: "⛓️ SEALED",
        unlockedBadge: "✦ CRACKED ✦",
        badgeClass: "text-emerald-400",
        lockedBadgeClass: "text-stone-400",
        lockedBoxClass: "bg-stone-950/20 border-stone-500/30 text-stone-300 hover:border-stone-400 hover:shadow-lg hover:shadow-stone-500/20",
        lockedBoxClassInside: "bg-stone-950/60 text-stone-300 border border-stone-900/30",
        lockedEmojis: ['🐉', '⚔️', '🛡️', '💀', '🕯️', '🗝️'],
        posPrefix: "VAULT",
        titleTooltip: "Subterranean treasure vault slot"
      };
    case 7:
      return {
        headerTitle: "SPACE SHIP SYSTEM RESTORATION GRIDS",
        headerDesc: "Reboot life support systems sequentially before your air tank runs dry. Calibrate oxygen grids or use Reveal Cipher to see the hints below!",
        containerClass: "from-sky-950/30 via-blue-950/30 to-indigo-950/30 border-sky-500/20",
        titleColor: "text-sky-300",
        lockedBadge: "🚨 OFFLINE",
        unlockedBadge: "✦ ONLINE ✦",
        badgeClass: "text-emerald-400",
        lockedBadgeClass: "text-sky-400",
        lockedBoxClass: "bg-sky-950/20 border-sky-500/30 text-sky-300 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/20",
        lockedBoxClassInside: "bg-sky-950/60 text-sky-300 border border-sky-900/30",
        lockedEmojis: ['🚀', '🛰️', '🌌', '👨‍🚀', '☄️', '🌟'],
        posPrefix: "GRID",
        titleTooltip: "Space module system grid position"
      };
    case 8:
      return {
        headerTitle: "CRIMINAL LOCKER DEDUCTION SCHEMATIC",
        headerDesc: "Scan the 5 scene assets to extract forensic hints and reason the single possible code combination or use Reveal Cipher to see the hints below!",
        containerClass: "from-slate-950/30 via-zinc-950/30 to-neutral-950/30 border-zinc-500/20",
        titleColor: "text-zinc-300",
        lockedBadge: "🔍 UNKNOWN",
        unlockedBadge: "✦ SOLVED ✦",
        badgeClass: "text-emerald-400",
        lockedBadgeClass: "text-zinc-400",
        lockedBoxClass: "bg-zinc-950/20 border-zinc-500/30 text-zinc-300 hover:border-zinc-400 hover:shadow-lg hover:shadow-zinc-500/20",
        lockedBoxClassInside: "bg-zinc-950/60 text-zinc-300 border border-zinc-900/30",
        lockedEmojis: ['🔍', '📂', '🕵️', '💼', '📌', '📜'],
        posPrefix: "LOCKER",
        titleTooltip: "Evidence safe file position"
      };
    case 9:
      return {
        headerTitle: "CASINO MASTER JACKPOT VAULT CODES",
        headerDesc: "Spin the slot machines to reveal digit presence or gamble in the master terminal or use Reveal Cipher to see the hints below!",
        containerClass: "from-rose-950/30 via-pink-950/30 to-red-950/30 border-rose-500/20",
        titleColor: "text-rose-300",
        lockedBadge: "🎰 ACTIVE",
        unlockedBadge: "✦ JACKPOT ✦",
        badgeClass: "text-emerald-400",
        lockedBadgeClass: "text-rose-400",
        lockedBoxClass: "bg-rose-950/20 border-rose-500/30 text-rose-300 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-500/20",
        lockedBoxClassInside: "bg-rose-950/60 text-rose-300 border border-rose-900/30",
        lockedEmojis: ['🎰', '🍒', '🎲', '🃏', '💰', '💵'],
        posPrefix: "SLOT",
        titleTooltip: "Slot machine jackpot combo slot"
      };
    case 10:
      return {
        headerTitle: "ROYAL ARTILLERY LAUNCH ANGLES",
        headerDesc: "Align your heavy ballistas to target coordinates. Calibrate launcher degrees or use Reveal Cipher to see the hints below!",
        containerClass: "from-amber-950/30 via-orange-950/30 to-yellow-950/30 border-yellow-500/20",
        titleColor: "text-amber-300",
        lockedBadge: "🛡️ READY",
        unlockedBadge: "✦ ALIGNED ✦",
        badgeClass: "text-emerald-400",
        lockedBadgeClass: "text-amber-400",
        lockedBoxClass: "bg-amber-950/20 border-amber-500/30 text-amber-300 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20",
        lockedBoxClassInside: "bg-amber-950/60 text-amber-300 border border-amber-900/30",
        lockedEmojis: ['🏹', '🏰', '🛡️', '🧱', '🎯', '🔥'],
        posPrefix: "ANGLE",
        titleTooltip: "Ballista ballistics launch angle degree"
      };
    case 11:
      return {
        headerTitle: "RADIOACTIVE ISOTOPE VALENCE GRIDS",
        headerDesc: "Calibrate highly volatile isotope compounds safely. Submit valence coordinates or use Reveal Cipher to see the hints below!",
        containerClass: "from-cyan-950/30 via-emerald-950/30 to-teal-950/30 border-cyan-500/20",
        titleColor: "text-cyan-300",
        lockedBadge: "🧪 VOLATILE",
        unlockedBadge: "✦ STABLE ✦",
        badgeClass: "text-emerald-400",
        lockedBadgeClass: "text-cyan-400",
        lockedBoxClass: "bg-cyan-950/20 border-cyan-500/30 text-cyan-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20",
        lockedBoxClassInside: "bg-cyan-950/60 text-cyan-300 border border-cyan-900/30",
        lockedEmojis: ['⚛️', '🧪', '☢️', '⚗️', '🟢', '🔬'],
        posPrefix: "VALENCE",
        titleTooltip: "Isotopic radioactive compound slot"
      };
    case 12:
      return {
        headerTitle: "ENCHANTED RUNE SEALS & SPELL CASTING CODE",
        headerDesc: "The secret password is bound by elemental spell slots. Solve the interactive levels, decrypt clues, or use Reveal Cipher to see the hints below!",
        containerClass: "from-indigo-950/30 via-purple-950/30 to-pink-950/30 border-indigo-500/20",
        titleColor: "text-indigo-300",
        lockedBadge: "🔮 SEALED",
        unlockedBadge: "✦ CASTED ✦",
        badgeClass: "text-emerald-400",
        lockedBadgeClass: "text-indigo-400",
        lockedBoxClass: "bg-indigo-950/20 border-indigo-500/30 text-indigo-300 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/30",
        lockedBoxClassInside: "bg-indigo-950/60 text-indigo-300 border border-indigo-900/30",
        lockedEmojis: ['🔮', '🌀', '🔯', '🌌', '📜', '⚜️', '🔱', '🪄', '☄️', '🌟', '⚡', '🗝️'],
        posPrefix: "RUNE",
        titleTooltip: "Elemental spell rune slot"
      };
    case 13:
      return {
        headerTitle: "OVERLORD MAINFRAME FIREWALL SECURITY",
        headerDesc: "Hack 5 rapid-fire firewall decryptions back-to-back using your collected legendary items or use Reveal Cipher to see the hints below!",
        containerClass: "from-red-950/30 via-slate-950/30 to-purple-950/30 border-red-500/20 animate-pulse",
        titleColor: "text-red-300",
        lockedBadge: "💀 ACTIVE",
        unlockedBadge: "✦ BYPASS ✦",
        badgeClass: "text-emerald-400",
        lockedBadgeClass: "text-red-400",
        lockedBoxClass: "bg-red-950/20 border-red-500/30 text-red-300 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/20",
        lockedBoxClassInside: "bg-red-950/60 text-red-300 border border-red-900/30",
        lockedEmojis: ['🖥️', '💾', '💿', '🔌', '💻', '📡'],
        posPrefix: "PORT",
        titleTooltip: "Overlord Core Mainframe firewall security port"
      };
    default:
      return {
        headerTitle: "SYSTEM SECURITY CODEBYPASS GRID",
        headerDesc: "Decrypt the active system passwords or use Reveal Cipher to see the hints below!",
        containerClass: "from-slate-950/30 via-indigo-950/30 to-slate-950/30 border-slate-800",
        titleColor: "text-indigo-300",
        lockedBadge: "🔒 LOCKED",
        unlockedBadge: "✦ SOLVED ✦",
        badgeClass: "text-emerald-400",
        lockedBadgeClass: "text-indigo-400",
        lockedBoxClass: "bg-slate-950/80 border-slate-800 text-slate-500 hover:border-slate-700",
        lockedBoxClassInside: "bg-slate-900/60 text-slate-400 border border-slate-800",
        lockedEmojis: ['❓'],
        posPrefix: "POS",
        titleTooltip: "Encrypted password system slot"
      };
  }
};
