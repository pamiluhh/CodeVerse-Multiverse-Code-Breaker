/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Clock, Key, Shield, AlertTriangle, HelpCircle, 
  ChevronLeft, Sparkles, Zap, Skull, ShieldAlert, Check,
  Terminal, Award, Star, Hammer, Flame, Swords, ArrowRight, BookOpen
} from 'lucide-react';
import { audio } from '../../utils/audio';
import { UserProgress } from '../../types';
import { WORLD_RULES, getWorldTheme } from './WorldThemes';
import { WORLDS } from '../../data/worlds';
import { CyberBackground } from '../ui/CyberBackground';

interface WorldGameProps {
  worldId: number;
  progress: UserProgress;
  onExit: () => void;
  onUpdateProgress: (newProgress: UserProgress) => void;
}

export default function WorldGame({ worldId, progress, onExit, onUpdateProgress }: WorldGameProps) {
  const worldInfo = WORLDS.find(w => w.id === worldId) || WORLDS[0];

  // Game flow states
  const [stage, setStage] = useState<number>(progress.currentLevel); // 1, 2, 3 (Boss)
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [timer, setTimer] = useState<number>(60);
  const [lives, setLives] = useState<number>(progress.lives);
  const [health, setHealth] = useState<number>(progress.health);
  const [score, setScore] = useState<number>(progress.score);
  const [combo, setCombo] = useState<number>(0);
  const [showIntroModal, setShowIntroModal] = useState<boolean>(true);

  // Active puzzle states
  const [targetCode, setTargetCode] = useState<string>('');
  const [guessInput, setGuessInput] = useState<string>('');
  const [guessHistory, setGuessHistory] = useState<{ guess: string; result: string }[]>([]);
  const [cluesList, setCluesList] = useState<string[]>([]);
  const [allLevelClues, setAllLevelClues] = useState<string[]>([]);
  const [revealedDigitIdxs, setRevealedDigitIdxs] = useState<number[]>([]);
  
  // Custom world specific states
  const [wireSelected, setWireSelected] = useState<string | null>(null); // World 2
  const [treasureGrid, setTreasureGrid] = useState<{ [cell: string]: 'empty' | 'warm' | 'chest' }>({}); // World 3
  const [zombieDistance, setZombieDistance] = useState<number>(20); // World 5
  const [activeMonsterHp, setActiveMonsterHp] = useState<number>(100); // World 6
  const [repairedSystems, setRepairedSystems] = useState<string[]>([]); // World 7
  const [detectiveFilesClicked, setDetectiveFilesClicked] = useState<string[]>([]); // World 8
  const [detectiveClues, setDetectiveClues] = useState<{ [asset: string]: string }>({});
  const [detectiveHints, setDetectiveHints] = useState<string[]>([]);
  const [detectiveHintsUnlocked, setDetectiveHintsUnlocked] = useState<number>(0);
  const [castleHp, setCastleHp] = useState<number>(100); // World 10
  const [chemicalLiquidColor, setChemicalLiquidColor] = useState<string>('text-blue-400'); // World 11
  const [magicCirclePower, setMagicCirclePower] = useState<number>(0); // World 12
  const [usedBossItems, setUsedBossItems] = useState<string[]>([]); // World 13 (Overlord)
  const [w9Reels, setW9Reels] = useState<number[]>([7, 7, 7]);
  const [w9Spinning, setW9Spinning] = useState<boolean>(false);
  // Buffs / Items active during this code break
  const [shieldActive, setShieldActive] = useState<boolean>(false);
  const [doubleCoinsActive, setDoubleCoinsActive] = useState<boolean>(false);
  
  const timerRef = useRef<any>(null);

  // Initialize Stage Puzzles
  useEffect(() => {
    initPuzzle();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage]);

  // Handle timer ticker
  useEffect(() => {
    if (gameState !== 'playing' || showIntroModal || stage === 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        // Play warning tick when timer is low
        if (prev <= 10) {
          audio.playBeep(900, 0.05, 'triangle');
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, stage, showIntroModal]);

  const initPuzzle = () => {
    let code = '';
    const clues: string[] = [];
    
    // Generate ciphers and clues based on world complexity
    if (worldId === 1) {
      // Escape Lab: 2 digit code
      const num = Math.floor(Math.random() * 80) + 15; // 15 to 95
      code = num.toString();
      
      // Compute math clues
      clues.push(num % 2 === 0 ? "Target is an EVEN number." : "Target is an ODD number.");
      clues.push(num % 5 === 0 ? "Target is DIVISIBLE by 5." : "Target is NOT divisible by 5.");
      clues.push(isPrime(num) ? "Target is a PRIME number." : "Target is a COMPOSITE number.");
      clues.push(`The sum of the two digits equals ${Math.floor(num / 10) + (num % 10)}.`);
      clues.push(`Target is greater than ${num - Math.floor(Math.random() * 10) - 5}.`);
      clues.push(`Target is less than ${num + Math.floor(Math.random() * 10) + 5}.`);
    } 
    else if (worldId === 2) {
      // Bomb Defusal: 3 digit code
      const num = Math.floor(Math.random() * 899) + 100; // 100 to 999
      code = num.toString();
      clues.push("Decoded frequency is a 3-digit numeric sequence.");
      clues.push(num % 2 === 0 ? "The last digit is EVEN." : "The last digit is ODD.");
      clues.push(`Sum of digits is ${code.split('').reduce((a, b) => a + parseInt(b), 0)}.`);
      clues.push(`The first digit is ${parseInt(code[0]) % 2 === 0 ? "EVEN" : "ODD"}.`);
      clues.push(`The product of first and last digit is ${parseInt(code[0]) * parseInt(code[2])}.`);
      clues.push(parseInt(code[0]) > parseInt(code[2]) ? "The first digit is greater than the last digit." : "The first digit is less than or equal to the last digit.");
      setWireSelected(null);
    } 
    else if (worldId === 3) {
      // Treasure Hunt Grid: Letter + Digit coordinate (e.g. C3)
      const cols = ['A', 'B', 'C', 'D', 'E'];
      const row = Math.floor(Math.random() * 5) + 1;
      const col = cols[Math.floor(Math.random() * 5)];
      code = `${col}${row}`;
      const colIndex = cols.indexOf(col) + 1; // 1 to 5
      clues.push("The treasure is buried on the grid map coordinates.");
      clues.push(`Column is ${col === 'A' || col === 'B' || col === 'C' ? 'on the WEST/CENTER' : 'on the EAST/CENTER'}.`);
      clues.push(colIndex % 2 === 0 ? "The column index is EVEN (B or D)." : "The column index is ODD (A, C, or E).");
      clues.push(`The column letter is ${colIndex > 2 ? "after B in the alphabet" : "B or before in the alphabet"}.`);
      clues.push(row % 2 === 0 ? "Row coordinates are EVEN." : "Row coordinates are ODD.");
      clues.push(`Row coordinate is ${row > 3 ? "greater than 3" : "3 or less"}.`);
      clues.push(`Row coordinate is ${isPrime(row) ? "a PRIME number" : "not a prime number"}.`);
      setTreasureGrid({});
    } 
    else if (worldId === 4) {
      // Alien Signal: 3-digit octal communication code
      const d1 = Math.floor(Math.random() * 8);
      const d2 = Math.floor(Math.random() * 8);
      const d3 = Math.floor(Math.random() * 8);
      code = `${d1}${d2}${d3}`;
      clues.push("Decryption array uses octal data structure (values 0-7).");
      clues.push(`Sum of elements results in ${d1 + d2 + d3}.`);
      clues.push(`The first element is ${d1 % 2 === 0 ? "EVEN" : "ODD"}.`);
      clues.push(`The last element is ${d3 % 2 === 0 ? "EVEN" : "ODD"}.`);
      clues.push(`The product of the first and last element is ${d1 * d3}.`);
      clues.push(`The absolute difference between the first and last element is ${Math.abs(d1 - d3)}.`);
      clues.push(`The first element is ${d1 > 3 ? "greater than 3" : "3 or less"}.`);
    } 
    else if (worldId === 5) {
      // Zombie Survival: 2-digit numeric code
      const num = Math.floor(Math.random() * 80) + 11;
      code = num.toString();
      clues.push("Securing door bolt frequency requires 2 digits.");
      clues.push(`Multiplication of digits yields ${parseInt(code[0]) * parseInt(code[1])}.`);
      clues.push(`The first digit is ${parseInt(code[0]) % 2 === 0 ? "EVEN" : "ODD"}.`);
      clues.push(`The code is ${num % 2 === 0 ? "EVEN" : "ODD"}.`);
      clues.push(`First digit is ${parseInt(code[0]) > 4 ? "greater than 4" : "4 or less"}.`);
      setZombieDistance(20);
    } 
    else if (worldId === 6) {
      // Dungeon: 3-digit keycode
      const num = Math.floor(Math.random() * 899) + 100;
      code = num.toString();
      clues.push(`The first digit is ${parseInt(code[0]) % 2 === 0 ? 'EVEN' : 'ODD'} and is ${parseInt(code[0]) > 4 ? "greater than 4" : "4 or less"}.`);
      clues.push(`The middle digit is ${parseInt(code[1]) % 2 === 0 ? 'EVEN' : 'ODD'}.`);
      clues.push(`The last digit is ${parseInt(code[2]) % 2 === 0 ? 'EVEN' : 'ODD'}.`);
      clues.push(`The sum of all three digits is ${code.split('').reduce((a, b) => a + parseInt(b), 0)}.`);
      clues.push(`The code is ${num % 2 === 0 ? 'EVEN' : 'ODD'} and is ${num % 3 === 0 ? 'divisible by 3' : 'NOT divisible by 3'}.`);
      setActiveMonsterHp(100);
    } 
    else if (worldId === 7) {
      // Space Mission: Systems Repair order engine
      // Required 3-digit code for each module
      const num = Math.floor(Math.random() * 800) + 100;
      code = num.toString();
      clues.push("Bypass codes for Life Support grid.");
      clues.push(`Code is between ${num - 40} and ${num + 40}.`);
      clues.push(`The sum of digits is ${code.split('').reduce((a, b) => a + parseInt(b), 0)}.`);
      clues.push(`The last digit is ${parseInt(code[2]) % 2 === 0 ? "EVEN" : "ODD"}.`);
      clues.push(`The first digit is ${parseInt(code[0]) % 2 === 0 ? "EVEN" : "ODD"}.`);
    } 
    else if (worldId === 8) {
      // Detective Mystery redesign
      let solvedCode = '';
      let phoneClue = '';
      let laptopClue = '';
      let filesClue = '';
      let vaultClue = '';
      let evidenceClue = '';
      let selectedClues: { [asset: string]: string } = {};
      let tries = 0;

      while (tries < 1000) {
        tries++;
        // Generate random 3 digit code
        const d0 = Math.floor(Math.random() * 10);
        const d1 = Math.floor(Math.random() * 10);
        const d2 = Math.floor(Math.random() * 10);
        const candCode = `${d0}${d1}${d2}`;

        // 1. Phone Clue (Odd/Even)
        const isOdd = d2 % 2 !== 0;
        phoneClue = isOdd 
          ? "Call history confirms the final code is ODD." 
          : "Call history confirms the final code is EVEN.";
        const phoneValidator = (C: string) => (parseInt(C[2]) % 2 !== 0) === isOdd;

        // 2. Laptop Clue (First digit)
        laptopClue = `Browser cookies confirm the code starts with ${d0}.`;
        const laptopValidator = (C: string) => C[0] === d0.toString();

        // 3. Files Clue (One confirmed digit exists)
        const digitsList = [d0, d1, d2];
        const df = digitsList[Math.floor(Math.random() * 3)];
        filesClue = `Forensic files confirm digit ${df} exists in the code.`;
        const filesValidator = (C: string) => C.includes(df.toString());

        // 4. Vault Clue (Sum of digits)
        const sumVal = d0 + d1 + d2;
        vaultClue = `Encrypted vault checksum equals ${sumVal}.`;
        const vaultValidator = (C: string) => (parseInt(C[0]) + parseInt(C[1]) + parseInt(C[2])) === sumVal;

        // 5. Evidence Clue (Relational)
        const relClues: { text: string; validate: (C: string) => boolean }[] = [];
        
        if (d1 > d0) {
          relClues.push({
            text: "The middle digit is larger than the first digit.",
            validate: (C) => parseInt(C[1]) > parseInt(C[0])
          });
        }
        if (d1 < d0) {
          relClues.push({
            text: "The middle digit is smaller than the first digit.",
            validate: (C) => parseInt(C[1]) < parseInt(C[0])
          });
        }
        if (d2 > d1) {
          relClues.push({
            text: "The last digit is greater than the middle digit.",
            validate: (C) => parseInt(C[2]) > parseInt(C[1])
          });
        }
        if (d2 < d1) {
          relClues.push({
            text: "The last digit is smaller than the middle digit.",
            validate: (C) => parseInt(C[2]) < parseInt(C[1])
          });
        }
        
        const maxDigit = Math.max(d0, d1, d2);
        if (d1 === maxDigit && d1 !== d0 && d1 !== d2) {
          relClues.push({
            text: "The largest digit is the middle digit.",
            validate: (C) => {
              const n0 = parseInt(C[0]), n1 = parseInt(C[1]), n2 = parseInt(C[2]);
              return n1 > n0 && n1 > n2;
            }
          });
        }
        if (d0 === maxDigit && d0 !== d1 && d0 !== d2) {
          relClues.push({
            text: "The largest digit is the first digit.",
            validate: (C) => {
              const n0 = parseInt(C[0]), n1 = parseInt(C[1]), n2 = parseInt(C[2]);
              return n0 > n1 && n0 > n2;
            }
          });
        }
        if (d2 === maxDigit && d2 !== d0 && d2 !== d1) {
          relClues.push({
            text: "The largest digit is the last digit.",
            validate: (C) => {
              const n0 = parseInt(C[0]), n1 = parseInt(C[1]), n2 = parseInt(C[2]);
              return n2 > n0 && n2 > n1;
            }
          });
        }

        const minDigit = Math.min(d0, d1, d2);
        if (d2 === minDigit && d2 !== d0 && d2 !== d1) {
          relClues.push({
            text: "The smallest digit is the last digit.",
            validate: (C) => {
              const n0 = parseInt(C[0]), n1 = parseInt(C[1]), n2 = parseInt(C[2]);
              return n2 < n0 && n2 < n1;
            }
          });
        }
        if (d0 === minDigit && d0 !== d1 && d0 !== d2) {
          relClues.push({
            text: "The smallest digit is the first digit.",
            validate: (C) => {
              const n0 = parseInt(C[0]), n1 = parseInt(C[1]), n2 = parseInt(C[2]);
              return n0 < n1 && n0 < n2;
            }
          });
        }
        if (d1 === minDigit && d1 !== d0 && d1 !== d2) {
          relClues.push({
            text: "The smallest digit is the middle digit.",
            validate: (C) => {
              const n0 = parseInt(C[0]), n1 = parseInt(C[1]), n2 = parseInt(C[2]);
              return n1 < n0 && n1 < n2;
            }
          });
        }

        if (d0 !== d1 && d1 !== d2 && d0 !== d2) {
          relClues.push({
            text: "No digits repeat.",
            validate: (C) => C[0] !== C[1] && C[1] !== C[2] && C[0] !== C[2]
          });
        }

        const oddDigitsCount = digitsList.filter(x => x % 2 !== 0).length;
        if (oddDigitsCount === 2) {
          relClues.push({
            text: "Exactly two digits are odd.",
            validate: (C) => [parseInt(C[0]), parseInt(C[1]), parseInt(C[2])].filter(x => x % 2 !== 0).length === 2
          });
        }
        if (oddDigitsCount === 1) {
          relClues.push({
            text: "Exactly one digit is even.",
            validate: (C) => [parseInt(C[0]), parseInt(C[1]), parseInt(C[2])].filter(x => x % 2 === 0).length === 1
          });
        }

        relClues.push({
          text: `The difference between the first and last digit is ${Math.abs(d0 - d2)}.`,
          validate: (C) => Math.abs(parseInt(C[0]) - parseInt(C[2])) === Math.abs(d0 - d2)
        });
        relClues.push({
          text: `The product of the middle and last digit is ${d1 * d2}.`,
          validate: (C) => parseInt(C[1]) * parseInt(C[2]) === d1 * d2
        });

        if (relClues.length === 0) continue;

        const chosenRel = relClues[Math.floor(Math.random() * relClues.length)];
        evidenceClue = chosenRel.text;

        // Verify uniqueness
        let matchCount = 0;
        let matchedSolution = '';
        for (let numVal = 0; numVal <= 999; numVal++) {
          let testCode = numVal.toString().padStart(3, '0');
          
          const pOk = phoneValidator(testCode);
          const lOk = laptopValidator(testCode);
          const fOk = filesValidator(testCode);
          const vOk = vaultValidator(testCode);
          const eOk = chosenRel.validate(testCode);

          if (pOk && lOk && fOk && vOk && eOk) {
            matchCount++;
            matchedSolution = testCode;
          }
        }

        if (matchCount === 1 && matchedSolution === candCode) {
          solvedCode = candCode;
          selectedClues = {
            Phone: phoneClue,
            Laptop: laptopClue,
            Files: filesClue,
            Vault: vaultClue,
            Evidence: evidenceClue
          };
          break;
        }
      }

      if (!solvedCode) {
        solvedCode = "318";
        selectedClues = {
          Phone: "Call history confirms the final code is EVEN.",
          Laptop: "Browser cookies confirm the code starts with 3.",
          Files: "Forensic files confirm digit 8 exists in the code.",
          Vault: "Encrypted vault checksum equals 12.",
          Evidence: "The middle digit is smaller than the first digit."
        };
      }

      const d0_val = parseInt(solvedCode[0]);
      const d1_val = parseInt(solvedCode[1]);
      const d2_val = parseInt(solvedCode[2]);
      const hintsPool: string[] = [];

      hintsPool.push(`CCTV footage confirms the middle digit is ${d1_val % 2 === 0 ? 'even' : 'odd'}.`);
      hintsPool.push(`GPS logs show the last digit is ${d2_val > 5 ? 'greater than 5' : 'less than or equal to 5'}.`);
      hintsPool.push(`Witness reports state the first digit is ${d0_val % 2 === 0 ? 'even' : 'odd'}.`);
      hintsPool.push(`Physical analysis reveals the middle digit is ${d1_val}.`);
      hintsPool.push(`Decoded radio transmission verifies the last digit is ${d2_val}.`);
      hintsPool.push(`Recovered paper scrap reveals that the first digit is ${d0_val > 5 ? 'greater than 5' : 'less than or equal to 5'}.`);

      const shuffledHints = hintsPool.sort(() => Math.random() - 0.5);

      code = solvedCode;
      setDetectiveClues(selectedClues);
      setDetectiveHints(shuffledHints);
      setDetectiveHintsUnlocked(0);
      setDetectiveFilesClicked([]);
      clues.push("Read briefing. Investigate crime scene assets to collect evidence pieces.");
    } 
    else if (worldId === 9) {
      // Lucky Casino
      const num = Math.floor(Math.random() * 90) + 10;
      code = num.toString();
      clues.push("Gamble on the high-frequency slot cipher.");
      clues.push(num > 50 ? "Value is upper tier (> 50)." : "Value is lower tier (<= 50).");
      clues.push(`First digit is ${parseInt(code[0]) % 2 === 0 ? "EVEN" : "ODD"}.`);
      clues.push(`Sum of digits is ${parseInt(code[0]) + parseInt(code[1])}.`);
      clues.push(`The code is ${num % 3 === 0 ? "divisible by 3" : "not divisible by 3"}.`);
    } 
    else if (worldId === 10) {
      // Kingdom Defense: Artillery angle
      const angle = Math.floor(Math.random() * 81) + 10; // 10 to 90 degrees inclusive
      code = angle.toString();
      setCastleHp(100);

      const tens = Math.floor(angle / 10);
      const ones = angle % 10;

      const isPrimeNum = (n: number) => {
        if (n < 2) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) {
          if (n % i === 0) return false;
        }
        return true;
      };

      const isPerfectSquareNum = (n: number) => {
        const s = Math.sqrt(n);
        return s === Math.floor(s);
      };

      // Range Clues
      const rangeClues: string[] = [];
      if (angle < 45) rangeClues.push("Trajectory range: Low Arc (<45°)");
      if (angle > 45) rangeClues.push("Trajectory range: High Arc (>45°)");

      // Mathematical Clues
      const mathClues: string[] = [];
      if (angle % 2 === 0) mathClues.push("Angle is divisible by 2.");
      if (angle % 3 === 0) mathClues.push("Angle is divisible by 3.");
      if (angle % 5 === 0) mathClues.push("Angle is divisible by 5.");
      if (angle % 9 === 0) mathClues.push("Angle is divisible by 9.");
      if (isPrimeNum(angle)) mathClues.push("Angle is a prime number.");
      if (isPerfectSquareNum(angle)) mathClues.push("Angle is a perfect square.");
      if (angle % 10 === 0) mathClues.push("Angle is a multiple of 10.");

      // Digit Clues
      const digitClues: string[] = [];
      if (tens > ones) digitClues.push("Largest digit is first.");
      if (ones < tens) digitClues.push("Smallest digit is last.");
      if (Math.abs(tens - ones) === 1) digitClues.push("Digits are consecutive.");
      if (tens === ones) digitClues.push("Digits are identical.");
      if (tens !== ones) digitClues.push("Digits are unique.");

      // Comparison Clues
      const compClues: string[] = [];
      if (tens > ones) compClues.push("Tens digit is larger than ones digit.");
      if (ones > tens) compClues.push("Ones digit is larger than tens digit.");
      if (tens % 2 === 0) compClues.push("Tens digit is even.");
      if (ones % 2 !== 0) compClues.push("Ones digit is odd.");
      if (tens % 2 === 0 && ones % 2 === 0) compClues.push("Both digits are even.");
      if (tens % 2 !== 0 && ones % 2 !== 0) compClues.push("Both digits are odd.");
      
      const tensPrime = isPrimeNum(tens);
      const onesPrime = isPrimeNum(ones);
      if ((tensPrime && !onesPrime) || (!tensPrime && onesPrime)) {
        compClues.push("Exactly one digit is prime.");
      }

      // Special Clues
      const specialClues: string[] = [];
      if (angle === 30 || angle === 45 || angle === 60) {
        specialClues.push("Angle is commonly used in siege warfare.");
      }
      if (angle === 45) {
        specialClues.push("Angle is optimized for maximum range.");
      }
      if (angle < 30) {
        specialClues.push("Angle minimizes projectile drop.");
      }
      if (angle > 60) {
        specialClues.push("Angle provides maximum wall clearance.");
      }
      if (angle > 50) {
        specialClues.push("Wind compensation increases the angle.");
      }
      if (angle % 5 === 0) {
        specialClues.push("Counterweight calibration is complete.");
      }

      // Combine all valid clues and shuffle to pick exactly 5 unique clues
      const allTrueClues = [
        ...rangeClues,
        ...mathClues,
        ...digitClues,
        ...compClues,
        ...specialClues
      ];

      const uniqueTrueClues = Array.from(new Set(allTrueClues));
      const shuffledTrue = uniqueTrueClues.sort(() => Math.random() - 0.5);
      
      clues.push("Determine exact ballista release trajectory angle.");
      shuffledTrue.slice(0, 5).forEach(c => clues.push(c));
    } 
    else if (worldId === 11) {
      // Scientist Lab: Chemical formulas
      const elementNum = Math.floor(Math.random() * 80) + 10;
      code = elementNum.toString();
      
      const tens = Math.floor(elementNum / 10);
      const ones = elementNum % 10;

      clues.push("Balance the isotope compound weight code.");

      // 1. Theme clue (e.g., Isotopic balance is Highly Volatile.)
      const themeClue = `Isotopic balance is ${elementNum % 4 === 0 ? "Stably Divisible by 4" : "Highly Volatile"}.`;
      clues.push(themeClue);

      // 2. Range clue (e.g., >50 or ≤50).
      const rangeClue = `Compound mass range is ${elementNum > 50 ? ">50" : "≤50"}.`;
      clues.push(rangeClue);

      // 3. Math clue (sum, product, divisibility).
      let mathClue = "";
      if (elementNum % 3 === 0) {
        mathClue = "Isotope weight is divisible by 3.";
      } else if (elementNum % 5 === 0) {
        mathClue = "Isotope weight is divisible by 5.";
      } else {
        mathClue = `Sum of isotope digits is ${tens + ones}.`;
      }
      clues.push(mathClue);

      // 4. Digit relationship (ascending, descending, consecutive).
      let digitClue = "";
      if (tens === ones) {
        digitClue = "Isotope digits are identical.";
      } else if (tens < ones) {
        digitClue = "Isotope digits are in ascending order.";
      } else {
        digitClue = "Isotope digits are in descending order.";
      }
      if (Math.abs(tens - ones) === 1) {
        digitClue += " (consecutive)";
      }
      clues.push(digitClue);

      // 5. Parity clue (even/odd or prime).
      let parityClue = "";
      if (isPrime(elementNum)) {
        parityClue = "Isotope compound is a prime element.";
      } else if (elementNum % 2 === 0) {
        parityClue = "Isotope compound charge is even.";
      } else {
        parityClue = "Isotope compound charge is odd.";
      }
      clues.push(parityClue);

      setChemicalLiquidColor('text-blue-400');
    } 
    else if (worldId === 12) {
      // Magic Academy: Elements Chanting
      const runes = ["FIRE", "ICE", "THUNDER", "WIND"];
      const r1 = runes[Math.floor(Math.random() * 4)];
      const r2 = runes[Math.floor(Math.random() * 4)];
      code = `${r1}-${r2}`;
      clues.push("Recombine elemental circles of force.");
      clues.push(`First rune alignment triggers ${r1 === 'FIRE' || r1 === 'THUNDER' ? 'Energy flow' : 'Cold structure'}.`);
      clues.push(`Second rune alignment triggers ${r2 === 'FIRE' || r2 === 'THUNDER' ? 'Energy flow' : 'Cold structure'}.`);
      clues.push(`First rune is ${r1 === r2 ? "identical to" : "different from"} the second rune.`);
      clues.push(`First rune contains exactly ${r1.length} glyphs.`);
      clues.push(`Second rune contains exactly ${r2.length} glyphs.`);
      setMagicCirclePower(0);
    } 
    else {
      // World 13: Overlord Core Supercomputer
      // Generates a 5-digit code satisfying specific user clues
      const possibleCodes = ['92200', '92020', '92002'];
      code = possibleCodes[Math.floor(Math.random() * possibleCodes.length)];
      clues.push("Firewall code sum factor is 13.");
      clues.push("The encrypted code contains exactly two pairs of identical digits.");
      clues.push("The prefix segment of the firewall code starts with the digits 9 and 2.");
      if (code === '92200') {
        clues.push("The two zero nodes are located sequentially side-by-side.");
        clues.push("The core index (middle digit) matches the second digit.");
      } else if (code === '92020') {
        clues.push("The zero nodes are fully non-adjacent and separate from each other.");
        clues.push("The core index (middle digit) is the minimum possible digit value.");
      } else {
        clues.push("The core index (middle digit) matches the subsequent fourth digit.");
        clues.push("The final terminating digit is greater than the middle digit.");
      }
    }

    setTargetCode(code);
    setAllLevelClues(clues);
    setCluesList(clues.slice(0, 4));
    setRevealedDigitIdxs([]);
    setGuessHistory([]);
    setGuessInput('');
    setTimer(stage === 3 ? 45 : 60); // Boss stage has shorter timer
    setGameState('playing');
  };

  const isPrime = (num: number): boolean => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  const handleTimeout = () => {
    audio.playExplosion();
    setGameState('lost');
    deductHealthOrLife();
  };

  const deductHealthOrLife = () => {
    if (shieldActive) {
      setShieldActive(false);
      setMessageAlert("Electro Shield absorbed the terminal collapse!");
      setGameState('playing');
      setTimer(30);
      return;
    }

    if (lives > 1) {
      setLives(l => l - 1);
      setMessageAlert("Code decryption failed. Life cell exhausted!");
      setGameState('playing');
      initPuzzle(); // Reload
    } else {
      setLives(0);
      setHealth(0);
      setGameState('lost');
      audio.playFailure();
    }
  };

  const [messageAlert, setMessageAlert] = useState<string>('');

  // Submit code guess logic
  const handleSubmitGuess = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!guessInput) return;

    const guessNormalized = guessInput.trim().toUpperCase();
    setGuessInput('');

    // Specific World Guess Processors
    if (worldId === 3) {
      // Grid Coordinate hunt
      processGridGuess(guessNormalized);
      return;
    }

    if (guessNormalized === targetCode.toUpperCase()) {
      handleCorrectGuess();
    } else {
      handleWrongGuess(guessNormalized);
    }
  };

  const handleCorrectGuess = () => {
    audio.playSuccess();
    const stageScore = (stage * 300) + (timer * 5) + (combo * 50);
    const newScore = score + stageScore;
    const newCombo = combo + 1;

    setScore(newScore);
    setCombo(newCombo);

    // If Zombie, defeat active zombie
    if (worldId === 5) {
      setZombieDistance(20);
    }

    // Next Level or Win
    if (stage < 3) {
      setStage(s => s + 1);
      setMessageAlert(`Stage ${stage} Decoded! Channeling Grid...`);
    } else {
      // Completed all stages (Defeated Boss)
      setGameState('won');
      audio.playSpellCast();
      awardWorldRewards();
    }
  };

  const handleWrongGuess = (guess: string) => {
    audio.playFailure();
    setCombo(0);

    let feedback = "Decryption error: Unaligned sequence.";

    // World specific failure updates
    if (worldId === 1) {
      // Mathematical feedback
      const guessNum = parseInt(guess);
      const targetNum = parseInt(targetCode);
      if (!isNaN(guessNum) && !isNaN(targetNum)) {
        feedback = guessNum < targetNum ? "Calibration too LOW." : "Calibration too HIGH.";
      }
      audio.playAlarm(1);
    } 
    else if (worldId === 2) {
      const gChars = guess.split('');
      const tChars = targetCode.split('');
      let correctPos = 0;
      let wrongPos = 0;
      const targetMatched = new Array(tChars.length).fill(false);
      const guessMatched = new Array(gChars.length).fill(false);

      // Match correct positions first
      for (let i = 0; i < Math.min(gChars.length, tChars.length); i++) {
        if (gChars[i] === tChars[i]) {
          correctPos++;
          targetMatched[i] = true;
          guessMatched[i] = true;
        }
      }

      // Match correct digits in wrong positions next
      for (let i = 0; i < gChars.length; i++) {
        if (guessMatched[i]) continue;
        for (let j = 0; j < tChars.length; j++) {
          if (!targetMatched[j] && gChars[i] === tChars[j]) {
            wrongPos++;
            targetMatched[j] = true;
            guessMatched[i] = true;
            break;
          }
        }
      }

      feedback = `Signal compromised! [${correctPos} in right position] • [${wrongPos} in wrong position]`;
    } 
    else if (worldId === 4) {
      const gChars = guess.split('');
      const tChars = targetCode.split('');
      let correctPos = 0;
      let wrongPos = 0;
      const targetMatched = new Array(tChars.length).fill(false);
      const guessMatched = new Array(gChars.length).fill(false);

      for (let i = 0; i < Math.min(gChars.length, tChars.length); i++) {
        if (gChars[i] === tChars[i]) {
          correctPos++;
          targetMatched[i] = true;
          guessMatched[i] = true;
        }
      }

      for (let i = 0; i < gChars.length; i++) {
        if (guessMatched[i]) continue;
        for (let j = 0; j < tChars.length; j++) {
          if (!targetMatched[j] && gChars[i] === tChars[j]) {
            wrongPos++;
            targetMatched[j] = true;
            guessMatched[i] = true;
            break;
          }
        }
      }

      feedback = `Frequency offset: [${correctPos} aligned] • [${wrongPos} misaligned]`;
    } 
    else if (worldId === 5) {
      // Undead attack
      setZombieDistance((prev) => Math.max(1, prev - 4));
      setHealth((h) => {
        const next = Math.max(0, h - 25);
        if (next === 0) {
          setGameState('lost');
          deductHealthOrLife();
        }
        return next;
      });
      feedback = "Barricade compromised! Zombies marching closer!";
      audio.playZombieGrowl();
    } 
    else if (worldId === 6) {
      // Dungeon attack
      setHealth((h) => {
        const next = Math.max(0, h - 30);
        if (next === 0) {
          setGameState('lost');
          deductHealthOrLife();
        }
        return next;
      });

      const guessNum = parseInt(guess);
      const targetNum = parseInt(targetCode);
      let comp = "unknown direction";
      if (!isNaN(guessNum) && !isNaN(targetNum)) {
        comp = guessNum < targetNum ? "TOO LOW" : "TOO HIGH";
      }

      const gChars = guess.split('');
      const tChars = targetCode.split('');
      let correctPos = 0;
      let wrongPos = 0;
      const targetMatched = new Array(tChars.length).fill(false);
      const guessMatched = new Array(gChars.length).fill(false);

      // Match correct positions first
      for (let i = 0; i < Math.min(gChars.length, tChars.length); i++) {
        if (gChars[i] === tChars[i]) {
          correctPos++;
          targetMatched[i] = true;
          guessMatched[i] = true;
        }
      }

      // Match correct digits in wrong positions next
      for (let i = 0; i < gChars.length; i++) {
        if (guessMatched[i]) continue;
        for (let j = 0; j < tChars.length; j++) {
          if (!targetMatched[j] && gChars[i] === tChars[j]) {
            wrongPos++;
            targetMatched[j] = true;
            guessMatched[i] = true;
            break;
          }
        }
      }

      feedback = `Defense broken! Monster attacks! [Guess is ${comp}]`;
    } 
    else if (worldId === 7) {
      const guessNum = parseInt(guess);
      const targetNum = parseInt(targetCode);

      if (!isNaN(guessNum) && !isNaN(targetNum)) {
        if (guessNum > targetNum) {
          feedback = "SYNC - HIGH";
        } else if (guessNum < targetNum) {
          feedback = "DESYNC - LOW";
        } else {
          feedback = "SYNC - MATCH";
        }
      } else {
        feedback = "DESYNC - LOW";
      }
    }
    else if (worldId === 8) {
      if (detectiveHintsUnlocked < detectiveHints.length) {
        const nextHint = detectiveHints[detectiveHintsUnlocked];
        setDetectiveHintsUnlocked(prev => prev + 1);
        feedback = `NEW FORENSIC REPORT: ${nextHint}`;
      } else {
        feedback = "Analysis failed. No more forensics data available.";
      }
    }
    else if (worldId === 10) {
      // Kingdom Wall
      setCastleHp((h) => {
        const next = Math.max(0, h - 25);
        if (next === 0) {
          setGameState('lost');
          deductHealthOrLife();
        }
        return next;
      });
      feedback = "Siege engine fire missed! Ram hit castle wall!";
    } 
    else if (worldId === 11) {
      audio.playExplosion();
      setTimer((prev) => Math.max(5, prev - 10));
      feedback = "Chemical reaction explosion! Siphoned 10s of life energy!";
    }

    setGuessHistory(prev => [{ guess, result: feedback }, ...prev]);
  };

  // Grid Coordinate hunt processor
  const processGridGuess = (cell: string) => {
    if (cell === targetCode) {
      setTreasureGrid(prev => ({ ...prev, [cell]: 'chest' }));
      handleCorrectGuess();
    } else {
      audio.playFailure();
      // Calculate distance
      const cols = ['A', 'B', 'C', 'D', 'E'];
      const targetColIdx = cols.indexOf(targetCode[0]);
      const targetRow = parseInt(targetCode[1]);

      const guessColIdx = cols.indexOf(cell[0]);
      const guessRow = parseInt(cell[1]);

      if (guessColIdx !== -1 && !isNaN(guessRow)) {
        const dist = Math.abs(targetColIdx - guessColIdx) + Math.abs(targetRow - guessRow);
        const result = dist <= 1.5 ? 'Warmer!' : 'Colder!';
        setTreasureGrid(prev => ({ ...prev, [cell]: 'empty' }));
        setGuessHistory(prev => [{ guess: cell, result }, ...prev]);
      }
    }
  };

  // Award rewards on World Win
  const awardWorldRewards = () => {
    const gainedCoins = (worldId * 150) + (doubleCoinsActive ? 300 : 0);
    const gainedDiamonds = worldId % 3 === 0 ? 3 : 1;
    
    const updatedInventory = { ...progress.inventory };
    // Set boss item in inventory
    const rewardKey = worldInfo.rewardItem.toLowerCase().replace(/ /g, '_');
    updatedInventory[rewardKey] = 1;

    // Check newly unlocked worlds
    const updatedUnlocked = [...progress.unlockedWorlds];
    const nextWorld = worldId + 1;
    if (nextWorld <= 13 && !updatedUnlocked.includes(nextWorld)) {
      updatedUnlocked.push(nextWorld);
    }

    // Check newly unlocked achievements
    const completedAchievements = [...progress.completedAchievements];
    const achId = getAchievementIdForWorld(worldId);
    let achCoinsBonus = 0;
    if (achId && !completedAchievements.includes(achId)) {
      completedAchievements.push(achId);
      achCoinsBonus = 100 * worldId;
    }

    // Set new ranks
    let newRank = progress.rank;
    if (worldId >= 12) newRank = "Ultimate Code Breaker";
    else if (worldId >= 8) newRank = "Elite Cyber Hacker";
    else if (worldId >= 4) newRank = "Advanced Cryptanalyst";

    const updated: UserProgress = {
      ...progress,
      coins: progress.coins + gainedCoins + achCoinsBonus,
      diamonds: progress.diamonds + gainedDiamonds,
      score: score + 1000,
      highestScore: Math.max(progress.highestScore, score + 1000),
      currentWorld: Math.min(13, nextWorld),
      currentLevel: 1, // Reset stage for next world
      unlockedWorlds: updatedUnlocked,
      inventory: updatedInventory,
      completedAchievements,
      rank: newRank
    };

    onUpdateProgress(updated);
  };

  const getAchievementIdForWorld = (wId: number): string | null => {
    const maps: { [key: number]: string } = {
      1: "escape_lab",
      2: "bomb_expert",
      3: "treasure_hunter",
      4: "alien_translator",
      5: "zombie_slayer",
      6: "dungeon_master",
      7: "space_engineer",
      8: "master_detective",
      9: "casino_champion",
      10: "kingdom_hero",
      11: "mad_scientist",
      12: "supreme_wizard",
      13: "ultimate_code_breaker"
    };
    return maps[wId] || null;
  };

  // Use shop item boosters mid-game
  const handleUseBooster = (boosterId: string) => {
    if ((progress.inventory[boosterId] || 0) <= 0) {
      audio.playFailure();
      return;
    }

    // Deduct booster
    const updatedInv = { ...progress.inventory };
    updatedInv[boosterId] -= 1;

    if (boosterId === 'hint') {
      audio.playSuccess();
      // Find the next clue in allLevelClues that is not already in cluesList
      const nextClue = allLevelClues.find(clue => !cluesList.includes(clue));
      if (nextClue) {
        setCluesList(prev => [...prev, nextClue]);
      } else {
        // Fallback if all clues are already shown
        if (worldId === 1) {
          const val = parseInt(targetCode);
          const clueMsg = `Mathematical sum factor is ${val + 17}.`;
          setCluesList(prev => {
            if (prev.includes(clueMsg)) return prev;
            return [...prev, clueMsg];
          });
        } else {
          const clueMsg = `One of the digits in the core target is ${targetCode[0]}.`;
          setCluesList(prev => {
            if (prev.includes(clueMsg)) return prev;
            return [...prev, clueMsg];
          });
        }
      }
    } 
    else if (boosterId === 'time_boost') {
      audio.playSuccess();
      setTimer(prev => prev + 30);
    } 
    else if (boosterId === 'health_potion') {
      audio.playSuccess();
      setHealth(prev => Math.min(100, prev + 50));
    } 
    else if (boosterId === 'shield') {
      audio.playSuccess();
      setShieldActive(true);
    } 
    else if (boosterId === 'reveal_digit') {
      audio.playSuccess();
      // Instantly reveal first index
      if (targetCode && targetCode.length > 0) {
        setRevealedDigitIdxs(prev => [...prev, 0]);
        setCluesList(prev => [...prev, `Digital scanner confirmed position 0 holds digit: ${targetCode[0]}.`]);
      }
    } 
    else if (boosterId === 'double_coins') {
      audio.playSuccess();
      setDoubleCoinsActive(true);
    }

    const updated = {
      ...progress,
      inventory: updatedInv
    };
    onUpdateProgress(updated);
  };

  // World 13 item activations
  const handleUseBossRewardItem = (itemName: string, inventoryKey: string) => {
    if (usedBossItems.includes(inventoryKey)) return;

    audio.playSpellCast();
    setUsedBossItems(prev => [...prev, inventoryKey]);

    if (inventoryKey === 'laboratory_key') {
      // Bypasses first stage
      handleCorrectGuess();
      setMessageAlert("Master Laboratory Key siphoned firewall integrity! Bypassed.");
    } 
    else if (inventoryKey === 'bomb_toolkit') {
      // Reveal a digit
      setRevealedDigitIdxs(prev => [...prev, 0]);
      setMessageAlert(`Bomb Toolkit extracted digital code segment. Revealed ${targetCode[0]}.`);
    } 
    else if (inventoryKey === 'golden_compass') {
      // Pinpoint target range
      const val = parseInt(targetCode);
      setCluesList(prev => [...prev, `Compass direction points: target is between ${val - 100} and ${val + 100}.`]);
    } 
    else if (inventoryKey === 'alien_decoder') {
      setRevealedDigitIdxs(prev => [...prev, 1]);
      setMessageAlert(`Alien Decoder intercepted transmission waves. Revealed ${targetCode[1]}.`);
    } 
    else if (inventoryKey === 'survival_kit') {
      setHealth(100);
      setMessageAlert("Survival kit fully replenished digital signal health nodes!");
    } 
    else if (inventoryKey === 'legendary_sword') {
      handleCorrectGuess();
      setMessageAlert("Legendary Sword slashed terminal locks! Bypassed.");
    } 
    else if (inventoryKey === 'galaxy_pass') {
      setTimer(prev => prev + 60);
      setMessageAlert("Galaxy Pass dilated spatial continuum. Added +60s.");
    } 
    else if (inventoryKey === 'detective_badge') {
      setCluesList(prev => [...prev, `Target Code ends with digit: ${targetCode[targetCode.length - 1]}.`]);
    } 
    else if (inventoryKey === 'vip_card') {
      setDoubleCoinsActive(true);
      setMessageAlert("VIP Card status authorized: Doubled final credit awards.");
    } 
    else if (inventoryKey === 'royal_crown') {
      setShieldActive(true);
      setMessageAlert("Royal Crown established standard protection shields.");
    }
  };

  const colorMap: { [k: string]: { border: string; bg: string; text: string; glow: string; accent: string } } = {
    emerald: { border: 'border-emerald-500/40', bg: 'bg-emerald-950/20', text: 'text-emerald-400', glow: 'shadow-emerald-500/20', accent: 'from-emerald-600 to-teal-500' },
    rose: { border: 'border-rose-500/40', bg: 'bg-rose-950/20', text: 'text-rose-400', glow: 'shadow-rose-500/20', accent: 'from-rose-600 to-pink-500' },
    amber: { border: 'border-amber-500/40', bg: 'bg-amber-950/20', text: 'text-amber-400', glow: 'shadow-amber-500/20', accent: 'from-amber-600 to-orange-500' },
    fuchsia: { border: 'border-fuchsia-500/40', bg: 'bg-fuchsia-950/20', text: 'text-fuchsia-400', glow: 'shadow-fuchsia-500/20', accent: 'from-fuchsia-600 to-purple-500' },
    lime: { border: 'border-lime-500/40', bg: 'bg-lime-950/20', text: 'text-lime-400', glow: 'shadow-lime-500/20', accent: 'from-lime-600 to-emerald-500' },
    violet: { border: 'border-violet-500/40', bg: 'bg-violet-950/20', text: 'text-violet-400', glow: 'shadow-violet-500/20', accent: 'from-violet-600 to-purple-500' },
    sky: { border: 'border-sky-500/40', bg: 'bg-sky-950/20', text: 'text-sky-400', glow: 'shadow-sky-500/20', accent: 'from-sky-600 to-indigo-500' },
    indigo: { border: 'border-indigo-500/40', bg: 'bg-indigo-950/20', text: 'text-indigo-400', glow: 'shadow-indigo-500/20', accent: 'from-indigo-600 to-blue-500' },
    red: { border: 'border-red-500/40', bg: 'bg-red-950/20', text: 'text-red-400', glow: 'shadow-red-500/20', accent: 'from-red-600 to-orange-500' },
    orange: { border: 'border-orange-500/40', bg: 'bg-orange-950/20', text: 'text-orange-400', glow: 'shadow-orange-500/20', accent: 'from-orange-600 to-amber-500' },
    cyan: { border: 'border-cyan-500/40', bg: 'bg-cyan-950/20', text: 'text-cyan-400', glow: 'shadow-cyan-500/20', accent: 'from-cyan-600 to-sky-500' },
    purple: { border: 'border-purple-500/40', bg: 'bg-purple-950/20', text: 'text-purple-400', glow: 'shadow-purple-500/20', accent: 'from-purple-600 to-indigo-500' },
    pink: { border: 'border-pink-500/40', bg: 'bg-pink-950/20', text: 'text-pink-400', glow: 'shadow-pink-500/20', accent: 'from-pink-600 to-rose-500' },
  };
  const theme = colorMap[worldInfo.primaryColor] || colorMap.emerald;
  const currentRules = WORLD_RULES[worldId] || WORLD_RULES[1];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${worldInfo.bgGradient} text-white font-sans relative pb-12 overflow-x-hidden`}>
      {/* Immersive Cyberpunk Visual Overlay & Graphics */}
      <CyberBackground />
      
      {/* INTRO RULES / INSTRUCTIONS MODAL OVERLAY */}
      <AnimatePresence>
        {showIntroModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-2xl bg-slate-900 border ${theme.border} p-6 md:p-8 rounded-3xl shadow-2xl relative ${theme.glow} shadow-lg my-8`}
            >
              <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${theme.accent} rounded-t-3xl`}></div>
              
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{worldInfo.rewardIcon}</span>
                    <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">// Multiverse Code Breaker Dossier</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1">
                    {worldInfo.name}
                  </h2>
                </div>
                <div className={`p-3 bg-slate-950 rounded-2xl border ${theme.border} text-xl animate-pulse`}>
                  ⚡
                </div>
              </div>

              {/* Mission Statement */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl mb-5">
                <div className={`text-xs font-mono ${theme.text} uppercase font-bold tracking-wider mb-1`}>
                  Sector Mission Objective:
                </div>
                <p className="text-sm text-slate-100 font-medium">
                  {worldInfo.mission}
                </p>
                <p className="text-xs text-slate-400 mt-2 italic leading-relaxed">
                  "{worldInfo.description}"
                </p>
              </div>

              {/* Dynamic Chronometer Constraint Alert */}
              <div className="p-4 bg-slate-950/60 border border-indigo-950/80 rounded-2xl mb-6 flex items-start gap-3">
                <div className="text-lg animate-pulse mt-0.5">⏱️</div>
                <div>
                  <div className="text-xs font-mono text-indigo-400 uppercase font-bold tracking-wider mb-1">
                    Temporal Purge Protocols
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <span className="text-emerald-400 font-bold">Stage 1</span>: Training Link active. <span className="text-slate-100">No security timer</span> is present — take your time to learn and solve the puzzle.
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <span className="text-rose-400 font-bold">Stage 2 & Stage 3</span>: System alert! The <span className="text-slate-100">timer starts immediately</span> upon sector boot.
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions Detail */}
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span>How to Play & Decrypt</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {currentRules.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 p-3 bg-slate-950/40 border border-slate-850 rounded-xl leading-relaxed">
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md bg-slate-950 text-[10px] font-bold font-mono border ${theme.border} ${theme.text} shrink-0`}>
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Agent Advice & Pro-Tips</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-2.5">
                    {currentRules.tips.map((tip, idx) => (
                      <div key={idx} className="p-3 bg-slate-950/40 border border-slate-850/60 rounded-xl text-xs text-slate-300 leading-relaxed flex gap-2">
                        <span className="text-amber-500 font-bold shrink-0">💡</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    audio.playSuccess();
                    setShowIntroModal(false);
                  }}
                  className={`flex-1 bg-gradient-to-r ${theme.accent} hover:brightness-110 text-white font-mono font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-lg active:translate-y-[1px] transition-all flex items-center justify-center gap-2`}
                >
                  <Check className="w-4 h-4" />
                  <span>Start Decryption Protocol</span>
                </button>
                
                {guessHistory.length > 0 && (
                  <button
                    onClick={() => {
                      audio.playBeep(400, 0.08, 'sine');
                      setShowIntroModal(false);
                    }}
                    className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white px-5 py-3.5 rounded-xl text-xs font-mono font-bold uppercase cursor-pointer transition-colors"
                  >
                    Close Guide
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD status bar */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-4 md:px-8 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2.5 shadow-lg">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button 
            onClick={() => { audio.playBeep(400, 0.08, 'sine'); onExit(); }}
            className="flex items-center gap-1 text-slate-400 hover:text-white font-mono text-[11px] sm:text-xs cursor-pointer border border-slate-800 px-2 sm:px-3 py-1.5 rounded-lg bg-slate-950/40"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Exit<span className="hidden sm:inline"> Hub</span></span>
          </button>

          <button 
            onClick={() => { audio.playSuccess(); setShowIntroModal(true); }}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono text-[11px] sm:text-xs cursor-pointer border border-emerald-900/50 hover:border-emerald-600/85 px-2 sm:px-3 py-1.5 rounded-lg bg-emerald-950/20 transition-all active:translate-y-[1px]"
          >
            <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Rules</span>
          </button>
        </div>

        <div className="flex items-center gap-3.5 sm:gap-6 font-mono text-[11px] sm:text-xs">
          <div className="flex items-center gap-1 sm:gap-2" title="Available lives">
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 fill-rose-500/20" />
            <span className="font-bold">{lives}<span className="hidden xs:inline sm:inline"> LIVES</span></span>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2" title="Signal Health">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            <span className="font-bold">{health}%<span className="hidden xs:inline sm:inline"> HEALTH</span></span>
          </div>

          {stage !== 1 && (
            <div className="flex items-center gap-1 sm:gap-2" title="Secure stage timer">
              <Clock className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${timer <= 15 ? 'text-rose-500 animate-pulse' : 'text-indigo-400'}`} />
              <span className={`font-bold ${timer <= 15 ? 'text-rose-400 font-extrabold animate-pulse' : ''}`}>{timer}s<span className="hidden xs:inline sm:inline"> LEFT</span></span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950/60 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-[11px] sm:text-xs">
          <span className="text-amber-400">🪙</span>
          <span className="font-bold">{progress.coins}</span>
        </div>
      </header>

      {/* ALERT OVERLAY FOR LEVEL TRANSACTIONS */}
      <AnimatePresence>
        {messageAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            onAnimationComplete={() => setTimeout(() => setMessageAlert(''), 2000)}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-indigo-950/90 border border-indigo-500 text-indigo-200 px-6 py-3 rounded-full text-sm font-mono flex items-center gap-2 shadow-2xl"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{messageAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        
        {/* GAME SCREEN STATES */}
        <AnimatePresence mode="wait">
          
          {/* STATE: PLAYING */}
          {gameState === 'playing' && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              
              {/* Left Column: Mission, Clues and inventory items */}
              <div className="md:col-span-1 space-y-6">
                
                {/* Stage Indicator */}
                <div className={`bg-slate-900/60 backdrop-blur border ${theme.border} p-4 rounded-2xl shadow-lg ${theme.glow}`}>
                  <div className={`text-[10px] font-mono ${theme.text} uppercase tracking-widest`}>Sector Level</div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {stage === 3 ? "👑 BOSS BATTLE" : `Stage ${stage} / 3`}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{worldInfo.name}</p>

                  {/* Dynamic Live Chronometer Status Badge */}
                  {stage === 1 ? (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/40 border border-emerald-800/40 rounded-lg text-[10px] font-mono text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>TIMER OFFLINE (STAGE 1)</span>
                    </div>
                  ) : (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-950/40 border border-rose-800/40 rounded-lg text-[10px] font-mono text-rose-400 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      <span>CHRONO ACTIVE</span>
                    </div>
                  )}
                </div>

                {/* Cyber Clues Ledger */}
                <div className={`bg-slate-900/60 backdrop-blur border ${theme.border} p-5 rounded-2xl`}>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Terminal className={`w-4 h-4 ${theme.text}`} />
                    <span>Signal Decryption Hints</span>
                  </h4>
                  
                  <div className="space-y-2.5">
                    {Array.from(new Set(cluesList)).map((clue, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-950/40 border border-slate-850 rounded-lg text-xs font-mono text-indigo-200 leading-normal flex items-start gap-2">
                        <span className={`${theme.text} mt-0.5`}>•</span>
                        <span>{clue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cargo Items Quick-Use Panel */}
                <div className={`bg-slate-900/60 backdrop-blur border ${theme.border} p-5 rounded-2xl`}>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Activate Cargo Boosters
                  </h4>
                  
                  <div className="space-y-2">
                    {['hint', 'time_boost', 'health_potion', 'shield', 'reveal_digit'].map((id) => {
                      const qty = progress.inventory[id] || 0;
                      const names: { [k: string]: string } = {
                        hint: "Cyber Hint",
                        time_boost: "Temporal Boost",
                        health_potion: "Nano Medkit",
                        shield: "Electro Shield",
                        reveal_digit: "Reveal Cipher"
                      };
                      const icons: { [k: string]: string } = {
                        hint: "💡",
                        time_boost: "⏳",
                        health_potion: "🧪",
                        shield: "🛡️",
                        reveal_digit: "🔍"
                      };

                      return (
                        <button
                          key={id}
                          disabled={qty <= 0}
                          onClick={() => handleUseBooster(id)}
                          className={`w-full p-2 rounded-xl border flex items-center justify-between text-xs font-mono transition-all cursor-pointer ${
                            qty > 0 
                              ? `bg-slate-950 border-slate-800 hover:${theme.border} hover:bg-slate-900` 
                              : 'border-transparent text-slate-600 opacity-40 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{icons[id]}</span>
                            <span>{names[id]}</span>
                          </div>
                          <span className={`font-bold ${theme.text}`}>QTY: {qty}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Center & Right Column: Interactive Decryption Console */}
              <div className="md:col-span-2 space-y-6">
                
                {/* INTERACTIVE COMPONENT SWITCHER */}
                <div className={`bg-slate-900/60 backdrop-blur border ${theme.border} p-6 rounded-2xl min-h-[300px] flex flex-col justify-between relative overflow-hidden shadow-lg ${theme.glow}`}>
                  <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${theme.accent}`}></div>

                  {/* World specific active visual graphics */}
                  <div className="mb-6">
                    {/* W1 Escape Lab Siren visual */}
                    {worldId === 1 && (
                      <div className={`p-4 rounded-xl text-center border transition-colors ${stage !== 1 && timer <= 15 ? 'bg-rose-950/20 border-rose-800 animate-pulse text-rose-300' : 'bg-slate-950/40 border-slate-850 text-emerald-400'}`}>
                        <div className="text-sm font-mono font-bold flex items-center justify-center gap-2">
                          <AlertTriangle className={`w-4 h-4 ${stage !== 1 && timer <= 15 ? 'text-rose-500 animate-bounce' : 'text-emerald-400'}`} />
                          <span>{stage !== 1 && timer <= 15 ? "PURGE WARNING: HAZARD LOCK INITIATING" : "LABORATORY DECOMPRESSION DOORS CLOSED"}</span>
                        </div>
                      </div>
                    )}

                    {/* W2 Bomb Defusal Wire Panel */}
                    {worldId === 2 && (
                      <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl space-y-4">
                        <div className="text-xs font-mono text-center text-slate-400">CHOOSE WIRE TO INTERCEPT FREQUENCY:</div>
                        <div className="flex items-center justify-center gap-4">
                          {['Red', 'Blue', 'Green'].map((color) => {
                            const isChosen = wireSelected === color;
                            const colorsMap: { [k: string]: string } = {
                              Red: "bg-red-600 hover:bg-red-500 ring-red-400",
                              Blue: "bg-blue-600 hover:bg-blue-500 ring-blue-400",
                              Green: "bg-emerald-600 hover:bg-emerald-500 ring-emerald-400"
                            };
                            return (
                              <button
                                key={color}
                                onClick={() => {
                                  audio.playBeep(440, 0.1, 'sine');
                                  setWireSelected(color);
                                  // 1 in 3 chance of instant bypass digit
                                  const roll = Math.floor(Math.random() * 3);
                                  if (roll === 0) {
                                    audio.playSuccess();
                                    setRevealedDigitIdxs([0]);
                                    setCluesList(prev => [...prev, `Bypassed Wire revealed position 0 holds: ${targetCode[0]}`]);
                                  } else if (roll === 1) {
                                    audio.playFailure();
                                    setTimer(prev => Math.max(5, prev - 10));
                                    setCluesList(prev => [...prev, `Dead Wire triggered 10s countdown siphoner!`]);
                                  }
                                }}
                                disabled={wireSelected !== null}
                                className={`w-20 py-2.5 rounded-lg text-white font-mono text-xs font-bold shadow-lg transition-all transform hover:scale-105 cursor-pointer flex items-center justify-center gap-1.5 ${colorsMap[color]} ${
                                  wireSelected ? (isChosen ? 'ring-2' : 'opacity-30 cursor-not-allowed') : ''
                                }`}
                              >
                                {isChosen ? 'Connected' : color}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* W3 Coordinate Dig Grid map */}
                    {worldId === 3 && (
                      <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl space-y-3">
                        <div className="text-xs font-mono text-center text-slate-400">CHOOSE GRID RADAR SECTOR TO DIG:</div>
                        <div className="grid grid-cols-5 gap-1.5 max-w-[280px] mx-auto">
                          {['A', 'B', 'C', 'D', 'E'].map((col) => 
                            [1, 2, 3, 4, 5].map((row) => {
                              const cell = `${col}${row}`;
                              const cellStatus = treasureGrid[cell];
                              return (
                                <button
                                  key={cell}
                                  onClick={() => processGridGuess(cell)}
                                  className={`aspect-square text-[10px] font-mono font-bold rounded flex items-center justify-center border transition-all cursor-pointer ${
                                    cellStatus === 'chest' 
                                      ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-lg shadow-amber-500/20' 
                                      : cellStatus === 'empty' 
                                        ? 'bg-slate-900 border-slate-800 text-slate-600' 
                                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-purple-800 hover:bg-slate-900'
                                  }`}
                                >
                                  {cellStatus === 'chest' ? '💎' : cell}
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}

                    {/* W4 Alien signal display */}
                    {worldId === 4 && (
                      <div className="flex flex-col items-center justify-center p-6 bg-slate-950/50 border border-slate-850 rounded-xl space-y-3">
                        <div className="text-xs font-mono text-fuchsia-400 animate-pulse">ALIGNED WAVE RESONANCE DATA:</div>
                        <div className="flex items-center gap-1.5 justify-center">
                          {Array.from({ length: 18 }).map((_, i) => (
                            <div 
                              key={i} 
                              className="w-1.5 bg-fuchsia-500 rounded-full transition-all duration-300"
                              style={{ 
                                height: `${Math.floor(Math.random() * 40) + 10}px`,
                                animation: `bounce 1s infinite alternate ${i * 0.05}s` 
                              }}
                            ></div>
                          ))}
                        </div>
                        <div className="text-sm font-mono text-center text-white">DECODE SIGNAL ###</div>
                      </div>
                    )}

                    {/* W5 Undead zombies march HUD */}
                    {worldId === 5 && (
                      <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl flex items-center justify-between gap-4">
                        <div className="font-mono text-xs">
                          <div className="text-slate-400">UNDEAD THREAT LEVEL</div>
                          <div className="text-lg font-bold text-rose-500 flex items-center gap-1 mt-1">
                            <Skull className="w-5 h-5 text-rose-600 fill-rose-600/30" />
                            <span>{zombieDistance} METERS DISTANCE</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              audio.playSuccess();
                              setZombieDistance(prev => prev + 5);
                              setMessageAlert("Spent bullets to push back horde by +5m!");
                            }}
                            className="bg-slate-900 border border-slate-800 hover:border-rose-800 text-rose-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer"
                          >
                            🔫 Shoot Bullets
                          </button>
                        </div>
                      </div>
                    )}

                    {/* W6 Dungeon monsters cards */}
                    {worldId === 6 && (
                      <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">👿</div>
                          <div>
                            <div className="text-xs font-mono text-slate-400">DUNGEON GUARDIAN</div>
                            <div className="text-sm font-bold text-violet-400 font-mono mt-0.5">
                              {stage === 3 ? "The Ancient Hell Demon" : stage === 2 ? "Fierce Iron Orc" : "Rabid Goblin"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-mono text-slate-500">MONSTER HP</div>
                          <div className="text-sm font-bold font-mono text-rose-400 mt-0.5">100 / 100</div>
                        </div>
                      </div>
                    )}

                    {/* W7 Space cockpit subsystems repairs */}
                    {worldId === 7 && (
                      <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl space-y-3">
                        <div className="text-xs font-mono text-slate-400">CRITICAL MODULE REBOOT ALIGNMENTS:</div>
                        <div className="grid grid-cols-5 gap-2">
                          {['Engine', 'Oxygen', 'Radar', 'Fuel', 'Escape'].map((sys, idx) => {
                            const isFixed = stage > idx + 1;
                            const isActive = stage === idx + 1;
                            return (
                              <div 
                                key={sys} 
                                className={`p-2 rounded-lg border text-center font-mono text-[10px] ${
                                  isFixed 
                                    ? 'bg-emerald-950/30 border-emerald-800 text-emerald-400' 
                                    : isActive 
                                      ? 'bg-sky-950/30 border-sky-500 text-sky-400 animate-pulse' 
                                      : 'bg-slate-950 border-slate-900 text-slate-600'
                                }`}
                              >
                                {sys}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* W8 Detective scene clue scanner */}
                    {worldId === 8 && (
                      <div className="space-y-3">
                        <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl space-y-3">
                          <div className="text-xs font-mono text-center text-slate-400">
                            SCAN SUSPECT SCENE ASSETS FOR EVIDENCE: ({detectiveFilesClicked.length}/5)
                          </div>
                          <div className="grid grid-cols-5 gap-2">
                            {['Phone', 'Laptop', 'Vault', 'Files', 'Evidence'].map((item) => {
                              const isClicked = detectiveFilesClicked.includes(item);
                              return (
                                <button
                                  key={item}
                                  onClick={() => {
                                    if (detectiveFilesClicked.includes(item)) return;
                                    audio.playSuccess();
                                    setDetectiveFilesClicked(prev => {
                                      if (prev.includes(item)) return prev;
                                      return [...prev, item];
                                    });
                                    const clueText = detectiveClues[item] || "No evidence collected.";
                                    setCluesList(prev => {
                                      const filtered = prev.filter(c => !c.includes("Read briefing"));
                                      const clueMsg = `[${item.toUpperCase()}] ${clueText}`;
                                      if (filtered.includes(clueMsg)) return filtered;
                                      return [...filtered, clueMsg];
                                    });
                                  }}
                                  disabled={isClicked}
                                  className={`p-2 rounded-lg border font-mono text-[10px] cursor-pointer transition-all ${
                                    isClicked 
                                      ? 'bg-indigo-950/30 border-indigo-900/40 text-slate-500 cursor-not-allowed' 
                                      : 'bg-slate-900 border-slate-800 text-indigo-400 hover:border-indigo-500'
                                  }`}
                                >
                                  {item}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* W9 Slot machine roulette wheel */}
                    {worldId === 9 && (
                      <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl text-center space-y-3">
                        <div className="text-xs font-mono text-slate-400">LUCKY CASINO REEL DECRYPTER:</div>
                        <div className="flex items-center justify-center gap-3">
                          {w9Reels.map((val, idx) => (
                            <div
                              key={idx}
                              className={`bg-slate-900 border border-slate-800 text-white font-mono text-2xl font-bold p-3 rounded-lg w-14 transition-all duration-75 ${
                                w9Spinning 
                                  ? 'animate-pulse scale-95 border-red-500 text-red-400 bg-red-950/20' 
                                  : 'border-slate-800 text-emerald-400'
                              }`}
                            >
                              {val}
                            </div>
                          ))}
                        </div>
                        <button
                          disabled={w9Spinning}
                          onClick={() => {
                            if (w9Spinning) return;
                            setW9Spinning(true);
                            
                            let duration = 1200; // spin for 1.2s
                            let intervalTime = 80;
                            let elapsed = 0;

                            const interval = setInterval(() => {
                              // Spin random digits 1-9 for all 3 reels
                              const r1 = Math.floor(Math.random() * 9) + 1;
                              const r2 = Math.floor(Math.random() * 9) + 1;
                              const r3 = Math.floor(Math.random() * 9) + 1;
                              setW9Reels([r1, r2, r3]);
                              
                              // Play click sound
                              audio.playBeep(400 + (r1 * 40), 0.02, 'sine');

                              elapsed += intervalTime;
                              if (elapsed >= duration) {
                                clearInterval(interval);

                                // Land on final combination!
                                const targetDigits = targetCode.split('').map(Number); // digits e.g. [4, 2]
                                
                                // 70% chance to reveal a correct digit
                                const shouldRevealSuccess = Math.random() < 0.7;
                                let finalReels = [7, 7, 7];
                                
                                if (shouldRevealSuccess && targetDigits.length > 0) {
                                  const targetDigitToReveal = targetDigits[Math.floor(Math.random() * targetDigits.length)];
                                  const revealReelIdx = Math.floor(Math.random() * 3);
                                  
                                  finalReels = finalReels.map((_, idx) => {
                                    if (idx === revealReelIdx) return targetDigitToReveal === 0 ? 9 : targetDigitToReveal;
                                    return Math.floor(Math.random() * 9) + 1;
                                  });
                                } else {
                                  finalReels = [
                                    Math.floor(Math.random() * 9) + 1,
                                    Math.floor(Math.random() * 9) + 1,
                                    Math.floor(Math.random() * 9) + 1
                                  ];
                                }

                                setW9Reels(finalReels);
                                setW9Spinning(false);
                                audio.playSuccess();

                                // Check which of final digits are in targetCode
                                const matched = finalReels.filter(digit => targetCode.includes(digit.toString()));
                                if (matched.length > 0) {
                                  const uniqueMatched = Array.from(new Set(matched));
                                  const msg = `Casino wheel spun! Landed on [${finalReels.join(' - ')}]. Revealed: Digit ${uniqueMatched.join(' and ')} ${uniqueMatched.length > 1 ? 'are' : 'is'} PRESENT in the cipher.`;
                                  setCluesList(prev => [...prev, msg]);
                                } else {
                                  const msg = `Casino wheel spun! Landed on [${finalReels.join(' - ')}]. None of these digits are present in the cipher.`;
                                  setCluesList(prev => [...prev, msg]);
                                }
                              }
                            }, intervalTime);
                          }}
                          className={`px-4 py-1.5 text-white text-xs font-mono rounded-lg cursor-pointer transition-colors ${
                            w9Spinning 
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                              : 'bg-red-600 hover:bg-red-500 shadow-md hover:shadow-red-500/20'
                          }`}
                        >
                          {w9Spinning ? '🎰 SPINNING...' : '🎰 Spin Lucky Wheel'}
                        </button>
                      </div>
                    )}

                    {/* W10 Castle defense walls HP */}
                    {worldId === 10 && (
                      <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-slate-400">ROYAL CASTLE FORTRESS WALLS INTEGRITY</span>
                          <span className="text-xs font-mono font-bold text-orange-400">{castleHp}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                          <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${castleHp}%` }}></div>
                        </div>
                      </div>
                    )}

                    {/* W11 Radioactive flasks color */}
                    {worldId === 11 && (
                      <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl flex items-center justify-center gap-6">
                        <div className="text-center">
                          <div className="text-4xl animate-pulse">🧪</div>
                          <span className="text-[10px] font-mono text-slate-500">Flask A (Heavy Carbon)</span>
                        </div>
                        <div className="text-slate-600 font-bold font-mono">+</div>
                        <div className="text-center">
                          <div className="text-4xl animate-pulse delay-200">⚗️</div>
                          <span className="text-[10px] font-mono text-slate-500">Flask B (Vibrant Ion)</span>
                        </div>
                      </div>
                    )}

                    {/* W12 Magic chanting wizard grimoire */}
                    {worldId === 12 && (
                      <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl space-y-3 text-center">
                        <div className="text-xs font-mono text-purple-400">UNLEASH ELEMENTAL SPELL SEQUENCES:</div>
                        <div className="flex justify-center gap-2">
                          {["FIRE", "ICE", "THUNDER", "WIND"].map((spell) => (
                            <button
                              key={spell}
                              onClick={() => {
                                audio.playSpellCast();
                                setGuessInput(prev => prev ? `${prev}-${spell}` : spell);
                              }}
                              className="px-3 py-1.5 bg-purple-950/40 border border-purple-800 hover:bg-purple-900 text-purple-300 rounded-lg text-xs font-mono cursor-pointer"
                            >
                              🔮 {spell}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* W13 Overlord supercomputer core boss */}
                    {worldId === 13 && (
                      <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl space-y-3">
                        <div className="text-xs font-mono text-center text-pink-500 animate-pulse">OVERLORD MAINFRAME DIRECT ACTIVE CYBER-WEAPONS:</div>
                        
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {[
                            { name: "Laboratory Key", key: "laboratory_key", icon: "🔑" },
                            { name: "Bomb Toolkit", key: "bomb_toolkit", icon: "🛠️" },
                            { name: "Golden Compass", key: "golden_compass", icon: "Compass" },
                            { name: "Alien Decoder", key: "alien_decoder", icon: "👽" },
                            { name: "Survival Kit", key: "survival_kit", icon: "🎒" },
                            { name: "Legendary Sword", key: "legendary_sword", icon: "⚔️" },
                            { name: "Galaxy Pass", key: "galaxy_pass", icon: "🌌" },
                            { name: "Detective Badge", key: "detective_badge", icon: "🛡️" },
                            { name: "VIP Card", key: "vip_card", icon: "💳" },
                            { name: "Royal Crown", key: "royal_crown", icon: "👑" },
                          ].map((item) => {
                            const hasItem = progress.inventory[item.key] > 0;
                            const isUsed = usedBossItems.includes(item.key);
                            
                            return (
                              <button
                                key={item.key}
                                disabled={!hasItem || isUsed}
                                onClick={() => handleUseBossRewardItem(item.name, item.key)}
                                className={`px-2.5 py-1.5 rounded-lg border font-mono text-[9px] cursor-pointer transition-all ${
                                  isUsed 
                                    ? 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed' 
                                    : hasItem 
                                      ? 'bg-pink-950/40 border-pink-700 hover:bg-pink-900 text-pink-400' 
                                      : 'bg-slate-950 border-slate-950 text-slate-500 opacity-30 cursor-not-allowed'
                                }`}
                              >
                                {item.icon} {item.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>


                  {/* ACTIVE CIPHER DISPLAY & SUBMIT FORM */}
                  <div className="space-y-4">
                    {/* Header describing what these boxes represent */}
                    {worldId !== 3 && (() => {
                      const theme = getWorldTheme(worldId);
                      return (
                        <>
                          <div className={`text-center space-y-1.5 bg-gradient-to-r ${theme.containerClass} py-3 px-4 rounded-xl border max-w-lg mx-auto shadow-lg animate-fade-in`}>
                            <div className={`text-xs font-mono font-bold tracking-wider ${theme.titleColor} uppercase flex items-center justify-center gap-1.5`}>
                              {theme.headerTitle}
                            </div>
                            <p className="text-[10px] font-mono text-slate-400 leading-relaxed max-w-md mx-auto">
                              {theme.headerDesc}
                            </p>
                          </div>

                          {/* Active digit boxes */}
                          <div className="flex flex-row flex-nowrap items-center justify-center gap-1.5 sm:gap-2.5 max-w-full overflow-x-auto pb-1 px-1">
                            {targetCode.split('').map((char, idx) => {
                              const isRevealed = revealedDigitIdxs.includes(idx);
                              const lockEmoji = theme.lockedEmojis[idx % theme.lockedEmojis.length];
                              return (
                                <div 
                                  key={idx}
                                  title={isRevealed ? `${theme.posPrefix} slot ${idx + 1} is decrypted: ${char}` : `${theme.posPrefix} slot ${idx + 1} is locked`}
                                  className={`w-14 sm:w-16 h-20 sm:h-22 rounded-xl border flex flex-col items-center justify-between py-2 px-1 font-mono transition-all duration-300 relative group overflow-hidden shrink-0 ${
                                    isRevealed 
                                      ? 'bg-emerald-950/50 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-105' 
                                      : theme.lockedBoxClass
                                  }`}
                                >
                                  {/* Decorative background circle */}
                                  <div className="absolute inset-0 bg-radial from-transparent via-transparent to-indigo-500/5 group-hover:to-indigo-500/10 pointer-events-none transition-all" />
                                  
                                  {/* Small indicator label */}
                                  <span className={`text-[6px] sm:text-[7px] font-bold uppercase tracking-wider text-center leading-none select-none max-w-full truncate px-0.5 ${
                                    isRevealed ? 'text-emerald-400 animate-pulse' : theme.lockedBadgeClass
                                  }`}>
                                    {isRevealed ? theme.unlockedBadge : theme.lockedBadge}
                                  </span>
                                  
                                  {/* Centered large glyph/emoji slot */}
                                  <div className="flex-1 flex items-center justify-center my-0.5 select-none">
                                    <span className={`text-base sm:text-lg transition-all duration-300 ${
                                      isRevealed ? 'font-bold scale-110 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'group-hover:scale-110 group-hover:rotate-12 duration-300'
                                    }`}>
                                      {isRevealed ? char : lockEmoji}
                                    </span>
                                  </div>
                                  
                                  {/* Bottom segment/position indicator label */}
                                  <span className={`text-[7px] sm:text-[8px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded transition-colors select-none ${
                                    isRevealed 
                                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/30' 
                                      : theme.lockedBoxClassInside
                                  }`}>
                                    {theme.posPrefix}_{idx}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()}


                    {/* Numeric Input Console Pad */}
                    {worldId !== 3 && (() => {
                      const activeTheme = getWorldTheme(worldId);
                      return worldId === 8 && detectiveFilesClicked.length < 5 ? (
                        <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl text-center max-w-md mx-auto">
                          <span className="font-mono text-xs text-indigo-400 animate-pulse block">
                            ⚠️ EVIDENCE SEARCH INCOMPLETE: SCAN {5 - detectiveFilesClicked.length} MORE SCENE ASSETS TO REASON LOCKER CODE.
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-3.5 max-w-sm mx-auto">
                          <form onSubmit={handleSubmitGuess} className="flex gap-2">
                            <input
                              type="text"
                              required
                              value={guessInput}
                              onChange={(e) => setGuessInput(e.target.value)}
                              placeholder="INPUT CIPHER DECRYPTION"
                              className="flex-1 bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all font-mono text-center tracking-widest uppercase text-sm"
                            />
                            <button
                              type="submit"
                              className="bg-purple-600 hover:bg-purple-500 text-white font-mono px-5 rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer active:translate-y-[1px]"
                            >
                              SUBMIT
                            </button>
                          </form>


                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* REAL-TIME DECRYPTION HISTORIC LOGS */}
                <div className="bg-slate-900/60 backdrop-blur border border-slate-800 p-5 rounded-2xl h-[180px] sm:h-[220px] md:h-[260px] lg:h-[300px] flex flex-col justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/60 pb-2">
                    Terminal Console Output Logs
                  </h4>
                  
                  <div className="flex-1 overflow-y-auto space-y-1.5 mt-2 pr-1">
                    {guessHistory.length === 0 ? (
                      <div className="text-xs font-mono text-slate-600 italic">No network connection logs established yet. Enter ciphers above...</div>
                    ) : (
                      guessHistory.map((item, idx) => {
                        if (worldId === 7) {
                          const isSync = item.result.includes('SYNC') && !item.result.includes('DESYNC');
                          return (
                            <div key={idx} className="font-mono text-xs flex items-center justify-between py-1.5 border-b border-slate-800/40 last:border-b-0">
                              <span className="text-slate-300">GUESS : {item.guess}</span>
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400">MODULE INTEGRITY : </span>
                                {isSync ? (
                                  <span className="text-amber-500 font-bold">SYNC</span>
                                ) : (
                                  <span className="text-red-500 font-bold">DESYNC</span>
                                )}
                              </div>
                            </div>
                          );
                        }
                        if (worldId === 8) {
                          const guessNum = parseInt(item.guess);
                          const targetNum = parseInt(targetCode);
                          const isOvershot = guessNum > targetNum;
                          return (
                            <div key={idx} className="font-mono text-xs flex items-center justify-between py-1.5 border-b border-slate-800/40 last:border-b-0">
                              <span className="text-slate-300">GUESS : {item.guess}</span>
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400">NEW FORENSIC REPORT : </span>
                                {isOvershot ? (
                                  <span className="text-amber-500 font-bold">OVERSHOT</span>
                                ) : (
                                  <span className="text-red-500 font-bold">INCOMPLETE</span>
                                )}
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div key={idx} className="font-mono text-xs flex items-center justify-between gap-4 py-1 border-b border-slate-800/40 last:border-b-0">
                            <span className="text-rose-400">GUESS: {item.guess}</span>
                            <span className="text-slate-400 text-right">{item.result}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* STATE: SUCCESS WIN */}
          {gameState === 'won' && (
            <motion.div 
              key="won"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md mx-auto bg-slate-900 border border-emerald-800 p-8 rounded-3xl shadow-2xl relative text-center space-y-6"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-3xl"></div>

              <div className="inline-flex items-center justify-center p-4 bg-emerald-950/60 border border-emerald-700 rounded-2xl text-4xl animate-bounce">
                🏆
              </div>

              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Sector Signal Recovered!
              </h3>
              
              <p className="text-xs font-mono text-emerald-400 tracking-wider uppercase bg-emerald-950 border border-emerald-900 px-3 py-1 rounded-full inline-block">
                World {worldId} Fully Decrypted
              </p>

              <p className="text-sm text-slate-300 leading-relaxed">
                Congratulations, Breaker! You solved every active cipher firewall in this sector and successfully defeated {worldInfo.bossName}!
              </p>

              {/* Reward list */}
              <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl text-left space-y-2 font-mono text-xs">
                <div className="text-slate-500 border-b border-slate-800 pb-1 uppercase font-bold tracking-wider">Deposited Rewards:</div>
                <div className="flex justify-between">
                  <span>Coins Multiplier:</span>
                  <span className="text-amber-400 font-bold">+{worldId * 150} 🪙</span>
                </div>
                <div className="flex justify-between">
                  <span>Cosmic Minerals:</span>
                  <span className="text-indigo-400 font-bold">+{worldId % 3 === 0 ? 3 : 1} 💎</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                  <span>Boss Reward:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span>{worldInfo.rewardIcon}</span>
                    <span>{worldInfo.rewardItem}</span>
                  </span>
                </div>
              </div>

              <button 
                onClick={() => { audio.playSuccess(); onExit(); }}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white py-3.5 rounded-xl font-bold font-mono uppercase tracking-wider cursor-pointer active:translate-y-[1px] transition-all flex items-center justify-center gap-2"
              >
                <span>Continue Voyage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STATE: DEFEAT LOST */}
          {gameState === 'lost' && (
            <motion.div 
              key="lost"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md mx-auto bg-slate-900 border border-rose-900 p-8 rounded-3xl shadow-2xl relative text-center space-y-6"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-600 to-red-500 rounded-t-3xl"></div>

              <div className="inline-flex items-center justify-center p-4 bg-rose-950/60 border border-rose-700 rounded-2xl text-4xl animate-pulse">
                💀
              </div>

              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Decryption Session Terminated
              </h3>

              <p className="text-xs font-mono text-rose-400 tracking-wider uppercase bg-rose-950 border border-rose-900 px-3 py-1 rounded-full inline-block">
                Signal Collapsed
              </p>

              <p className="text-sm text-slate-300 leading-relaxed">
                Terminal overload triggered and local node lives/health was fully siphoned. The mainframe locked you out.
              </p>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => {
                    // Try consuming diamond or coins to continue
                    if (progress.coins >= 50) {
                      audio.playSuccess();
                      const updated = {
                        ...progress,
                        coins: progress.coins - 50,
                        lives: 3,
                        health: 100
                      };
                      onUpdateProgress(updated);
                      setLives(3);
                      setHealth(100);
                      setGameState('playing');
                      initPuzzle();
                    } else {
                      audio.playFailure();
                    }
                  }}
                  disabled={progress.coins < 50}
                  className={`w-full py-3 rounded-xl font-bold font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 border ${
                    progress.coins >= 50 
                      ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500 cursor-pointer' 
                      : 'bg-slate-950 border-slate-850 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Reboot Node (Costs 50 🪙)</span>
                </button>

                <button 
                  onClick={() => { audio.playBeep(400, 0.08, 'sine'); onExit(); }}
                  className="w-full bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white py-3 rounded-xl font-bold font-mono uppercase tracking-wider cursor-pointer border border-slate-800 transition-colors"
                >
                  Eject to Main Hub
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </main>

    </div>
  );
}
