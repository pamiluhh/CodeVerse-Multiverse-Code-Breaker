import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface GridNode {
  id: number;
  x: number;
  y: number;
  value: string;
  speed: number;
  scale: number;
  opacity: number;
}

interface CodeColumn {
  id: number;
  x: number;
  speed: number;
  delay: number;
  chars: string[];
}

export const CyberBackground: React.FC = () => {
  const [nodes, setNodes] = useState<GridNode[]>([]);
  const [codeStreams, setCodeStreams] = useState<CodeColumn[]>([]);
  const [wavePath, setWavePath] = useState('');
  const [activeTelemetry, setActiveTelemetry] = useState({
    fps: 60,
    ping: 14,
    stability: 99.8,
    frequency: '433.92 MHz',
  });

  useEffect(() => {
    // Generate floating bits/hashes
    const initialNodes: GridNode[] = Array.from({ length: 24 }).map((_, i) => {
      const glyphs = ['01', '10', 'FF', 'X9', 'A4', '[SYS]', '[ERR_0]', 'Ø', '::', 'LINK', 'SEC', 'CORE'];
      return {
        id: i,
        x: Math.random() * 100, // percentage
        y: Math.random() * 100, // percentage
        value: glyphs[Math.floor(Math.random() * glyphs.length)],
        speed: 8 + Math.random() * 18, // float duration
        scale: 0.7 + Math.random() * 0.4,
        opacity: 0.04 + Math.random() * 0.1,
      };
    });
    setNodes(initialNodes);

    // Generate falling matrix digital code columns
    const glyphs = '0123456789ABCDEFØ×%#$&@+-/*<>[]';
    const columns: CodeColumn[] = Array.from({ length: 16 }).map((_, i) => {
      const chars = Array.from({ length: 8 + Math.floor(Math.random() * 10) }).map(() =>
        glyphs[Math.floor(Math.random() * glyphs.length)]
      );
      return {
        id: i,
        x: 3 + (i * 6) + (Math.random() * 2), // distribute across the screen width
        speed: 10 + Math.random() * 15, // speed of flow
        delay: Math.random() * -12, // start offset so they aren't synchronized
        chars,
      };
    });
    setCodeStreams(columns);

    // Real-time fluctuating oscilloscope waveform path generator
    let angle = 0;
    const updateWave = () => {
      let d = 'M 0 50 ';
      for (let x = 0; x <= 100; x += 4) {
        // Compose multiple sine / cosine frequencies for organic look
        const y = 50 + 
          Math.sin((x / 8) + angle) * 16 + 
          Math.cos((x / 4) - angle * 1.5) * 6 + 
          Math.sin((x / 2) + angle * 2) * 2;
        d += `L ${x} ${y} `;
      }
      setWavePath(d);
      angle += 0.08;
    };
    
    const waveInterval = setInterval(updateWave, 60);

    // Minor updates to telemetry for dynamic micro-animations
    const telemetryInterval = setInterval(() => {
      setActiveTelemetry({
        fps: Math.floor(59 + Math.random() * 2),
        ping: Math.floor(11 + Math.random() * 4),
        stability: parseFloat((99.7 + Math.random() * 0.2).toFixed(2)),
        frequency: `${(433.92 + (Math.random() - 0.5) * 0.03).toFixed(2)} MHz`,
      });
    }, 3000);

    return () => {
      clearInterval(waveInterval);
      clearInterval(telemetryInterval);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Procedural Grid and Scanlines */}
      <div className="absolute inset-0 bg-cyber-grid animate-grid-pan opacity-[0.45]"></div>
      <div className="absolute inset-0 bg-cyber-dot-grid opacity-[0.25]"></div>
      
      {/* Laser Sweep and Scanline Overlay */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent animate-scanline"></div>
      <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-purple-500/4 to-transparent animate-scanline opacity-25"></div>

      {/* 2. Falling Matrix Code Streams */}
      {codeStreams.map((stream) => (
        <motion.div
          key={stream.id}
          className="absolute flex flex-col font-mono text-[9px] text-purple-500/10 leading-none select-none"
          style={{ left: `${stream.x}%` }}
          initial={{ y: '-100%' }}
          animate={{ y: '100vh' }}
          transition={{
            duration: stream.speed,
            repeat: Infinity,
            ease: 'linear',
            delay: stream.delay,
          }}
        >
          {stream.chars.map((char, charIdx) => {
            const isLast = charIdx === stream.chars.length - 1;
            return (
              <span 
                key={charIdx} 
                className={isLast ? "text-purple-400/30 font-bold animate-pulse" : ""}
                style={{ opacity: (charIdx + 1) / stream.chars.length }}
              >
                {char}
              </span>
            );
          })}
        </motion.div>
      ))}

      {/* 3. Floating Technical Nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute font-mono text-[9px] text-indigo-400 select-none tracking-wider"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            scale: node.scale,
            opacity: node.opacity,
          }}
          animate={{
            y: [0, -35, 0],
            opacity: [node.opacity, node.opacity * 2, node.opacity],
          }}
          transition={{
            duration: node.speed,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {node.value}
        </motion.div>
      ))}

      {/* 4. Immersive HUD Vector Corner Brackets */}
      <div className="absolute top-6 left-6 w-16 h-16 border-t border-l border-indigo-500/10">
        <div className="absolute top-0 left-0 w-2 h-2 bg-indigo-500/25"></div>
      </div>
      <div className="absolute top-6 right-6 w-16 h-16 border-t border-r border-indigo-500/10">
        <div className="absolute top-0 right-0 w-2 h-2 bg-indigo-500/25"></div>
      </div>
      <div className="absolute bottom-6 left-6 w-16 h-16 border-b border-l border-indigo-500/10">
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-indigo-500/25"></div>
      </div>
      <div className="absolute bottom-6 right-6 w-16 h-16 border-b border-r border-indigo-500/10">
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-indigo-500/25"></div>
      </div>

      {/* 5. Real-Time Oscilloscope Waveform Panel (Top-Left Corner) */}
      <div className="absolute top-8 left-10 hidden xl:flex flex-col gap-1 w-44 bg-slate-900/40 border border-slate-800/40 p-2.5 rounded-lg backdrop-blur-[2px] opacity-25">
        <div className="flex items-center justify-between font-mono text-[8px] text-indigo-400/60 leading-none">
          <span>OSCILLOSCOPE_CH_A</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
        </div>
        <div className="w-full h-10 overflow-hidden relative mt-1 bg-slate-950/30 rounded border border-slate-900/50">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-indigo-500/50">
            <path
              d={wavePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>

      {/* 6. Rotating Target Crosshairs / Radar rings */}
      {/* Top-Right Hologram */}
      <div className="absolute -top-16 -right-16 w-80 h-80 opacity-[0.18] pointer-events-none select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-500/35">
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="2 4"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '50% 50%' }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="10 5 2 5"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '50% 50%' }}
          />
          <circle cx="50" cy="50" r="1.5" fill="currentColor" />
          <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 3" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 3" />
        </svg>
      </div>

      {/* Bottom-Left Hologram */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 opacity-[0.12] pointer-events-none select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-purple-500/35">
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
            strokeDasharray="6 3"
            animate={{ rotate: -360 }}
            transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '50% 50%' }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeDasharray="1 8"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '50% 50%' }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.3"
            strokeDasharray="3 3"
          />
        </svg>
      </div>

      {/* 7. Ambient Glowing Light Particles */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none animate-matrix-glow"></div>

      {/* 8. Subtle Cyber Status Telemetry Bars */}
      <div className="hidden lg:flex flex-col gap-1.5 absolute bottom-8 left-10 font-mono text-[9px] text-indigo-400/30 select-none tracking-widest uppercase z-10 leading-none">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/30 animate-pulse"></span>
          <span>NET_LATENCY: {activeTelemetry.ping}MS</span>
        </div>
        <div>STABILITY_COEF: {activeTelemetry.stability}%</div>
        <div>SYS_RESONANCE: {activeTelemetry.frequency}</div>
        <div>RENDER_RATE: {activeTelemetry.fps}FPS</div>
      </div>

      <div className="hidden lg:block absolute bottom-8 right-10 font-mono text-[9px] text-indigo-400/30 select-none tracking-widest uppercase z-10 text-right leading-none">
        <div>MATRIX_OVERLAY: v2.1_CORE</div>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="w-8 h-1 bg-indigo-500/10 rounded-sm overflow-hidden inline-block relative">
            <span className="absolute left-0 top-0 bottom-0 w-2/3 bg-indigo-500/25 animate-pulse"></span>
          </span>
          <span>SECURE_LINK</span>
        </div>
      </div>
    </div>
  );
};

