/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  SlidersHorizontal,
  FolderLock, 
  Activity, 
  Brain, 
  Cpu, 
  Settings, 
  Info,
  InfoIcon,
  ChevronDown,
  ChevronUp,
  Maximize2
} from 'lucide-react';

// Custom Interface Types
interface SwitchState {
  id: string;
  name: string;
  category: string;
  subLabel: string;
  colorName: 'purple' | 'blue' | 'cyan' | 'green' | 'rose';
  glowColor: string; // Tailwind hex or rgba
  isActive: boolean;
  valueUnit: string;
  activeVal: number;
  inactiveVal: number;
}

// Custom Colors Configuration Helper
const colorThemes = {
  purple: {
    glow: 'rgba(168, 85, 247, 0.65)',
    border: 'border-purple-500/80',
    text: 'text-purple-400',
    bg: 'bg-purple-950/20',
    trackActive: 'bg-purple-600 shadow-[0_0_12px_rgba(168,85,247,0.7)]',
    indicatorGlow: 'shadow-[0_0_15px_rgba(168,85,247,0.8)]'
  },
  blue: {
    glow: 'rgba(59, 130, 246, 0.65)',
    border: 'border-blue-500/80',
    text: 'text-blue-400',
    bg: 'bg-blue-950/20',
    trackActive: 'bg-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.7)]',
    indicatorGlow: 'shadow-[0_0_15px_rgba(59,130,246,0.8)]'
  },
  cyan: {
    glow: 'rgba(6, 182, 212, 0.65)',
    border: 'border-cyan-500/80',
    text: 'text-cyan-400',
    bg: 'bg-cyan-950/20',
    trackActive: 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.7)]',
    indicatorGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.8)]'
  },
  green: {
    glow: 'rgba(34, 197, 94, 0.65)',
    border: 'border-green-500/80',
    text: 'text-green-400',
    bg: 'bg-green-950/20',
    trackActive: 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.7)]',
    indicatorGlow: 'shadow-[0_0_15px_rgba(34,197,94,0.8)]'
  },
  rose: {
    glow: 'rgba(244, 63, 94, 0.65)',
    border: 'border-rose-500/80',
    text: 'text-rose-400',
    bg: 'bg-rose-950/20',
    trackActive: 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.7)]',
    indicatorGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.8)]'
  }
};

export default function App() {
  // Primary customizable theme details modeled perfectly on user's image
  const [boardTitle, setBoardTitle] = useState('DATA AND CONTROL');
  const [glowIntensity, setGlowIntensity] = useState(100); // 0 to 150 %
  const [ambientPillText, setAmbientPillText] = useState('SYSTEM MODULES: NOMINAL || CORE ENGINE STABILITY: 99.8%');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [synthVolume, setSynthVolume] = useState(40); // percent 
  
  // Custom interactive switches
  const [switches, setSwitches] = useState<SwitchState[]>([
    {
      id: 'sw-1',
      name: 'Main Reactor Power',
      category: 'Sector-01 Grid',
      subLabel: 'Grid Bus A',
      colorName: 'purple',
      glowColor: colorThemes.purple.glow,
      isActive: false, // matches starting state in image (Switch 1 off)
      valueUnit: 'MW',
      activeVal: 480,
      inactiveVal: 0
    },
    {
      id: 'sw-2',
      name: 'Quantum Data Link',
      category: 'Comms Bus B',
      subLabel: 'Optic Receiver',
      colorName: 'blue',
      glowColor: colorThemes.blue.glow,
      isActive: true, // matches starting state in image (Switch 2 on, glowing blue)
      valueUnit: 'Gbps',
      activeVal: 12.8,
      inactiveVal: 0
    },
    {
      id: 'sw-3',
      name: 'Cryogenic Coolant',
      category: 'Thermal Loop C',
      subLabel: 'Liquid He Piston',
      colorName: 'cyan',
      glowColor: colorThemes.cyan.glow,
      isActive: false, // matches starting state in image (Switch 3 off, cyan border)
      valueUnit: 'Psi',
      activeVal: 1650,
      inactiveVal: 12
    },
    {
      id: 'sw-4',
      name: 'Environmental Matrix',
      category: 'Life Matrix D',
      subLabel: 'Bio Shield Node',
      colorName: 'green',
      glowColor: colorThemes.green.glow,
      isActive: true, // matches starting state in image (Switch 4 on, glowing green)
      valueUnit: 'O₂ %',
      activeVal: 100,
      inactiveVal: 18
    }
  ]);

  // Collapsible configuration panel to preserve image aesthetic by default
  const [configOpen, setConfigOpen] = useState(false);
  const [selectedSwitchId, setSelectedSwitchId] = useState<string | null>('sw-1');

  // Procedural Sound Generator (Web Audio API)
  const synthAudioContext = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!synthAudioContext.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        synthAudioContext.current = new AudioCtx();
      }
    }
    if (synthAudioContext.current && synthAudioContext.current.state === 'suspended') {
      synthAudioContext.current.resume();
    }
  };

  // Synthesize customized sci-fi click and slide sound
  const playSynthesizedSound = (isOn: boolean) => {
    if (!soundEnabled) return;
    try {
      initAudio();
      const ctx = synthAudioContext.current;
      if (!ctx) return;

      const masterVol = (synthVolume / 100) * 0.12;

      // Master Gain
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(masterVol, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);

      // Low pass resonant cyber filter
      const biquadFilter = ctx.createBiquadFilter();
      biquadFilter.type = 'lowpass';
      biquadFilter.Q.setValueAtTime(8, ctx.currentTime);
      biquadFilter.frequency.setValueAtTime(1000, ctx.currentTime);

      // Oscillator
      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();

      if (isOn) {
        // High rising sweep click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(680, ctx.currentTime + 0.15);
        
        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(80, ctx.currentTime);
        subOsc.frequency.exponentialRampToValueAtTime(340, ctx.currentTime + 0.12);
        
        biquadFilter.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.1);
      } else {
        // Deep dropping slide down click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.18);

        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(220, ctx.currentTime);
        subOsc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.15);

        biquadFilter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
      }

      // Connect modules
      osc.connect(biquadFilter);
      subOsc.connect(biquadFilter);
      biquadFilter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      subOsc.start();

      osc.stop(ctx.currentTime + 0.3);
      subOsc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn("Web Audio API not yet initialized or context blocked.", e);
    }
  };

  // Play micro click sound for small standard buttons
  const playMicroClick = () => {
    if (!soundEnabled) return;
    try {
      initAudio();
      const ctx = synthAudioContext.current;
      if (!ctx) return;

      const masterVol = (synthVolume / 100) * 0.08;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(masterVol, ctx.currentTime + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.06);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {}
  };

  const handleToggle = (id: string) => {
    setSwitches(prev => 
      prev.map(sw => {
        if (sw.id === id) {
          const newState = !sw.isActive;
          playSynthesizedSound(newState);
          return { ...sw, isActive: newState };
        }
        return sw;
      })
    );
  };

  // Calculate some aggregate values for beautiful live telemetry displays
  const activeCount = switches.filter(s => s.isActive).length;
  const currentDraw = switches.reduce((acc, sw) => acc + (sw.isActive ? sw.activeVal : sw.inactiveVal), 0);

  // Trigger default preset to revert layout exactly to the photo
  const resetToImageOriginal = () => {
    playMicroClick();
    setBoardTitle('DATA AND CONTROL');
    setGlowIntensity(100);
    setSwitches([
      {
        id: 'sw-1',
        name: 'Main Reactor Power',
        category: 'Sector-01 Grid',
        subLabel: 'Grid Bus A',
        colorName: 'purple',
        glowColor: colorThemes.purple.glow,
        isActive: false, // Match Purple Off
        valueUnit: 'MW',
        activeVal: 480,
        inactiveVal: 0
      },
      {
        id: 'sw-2',
        name: 'Quantum Data Link',
        category: 'Comms Bus B',
        subLabel: 'Optic Receiver',
        colorName: 'blue',
        glowColor: colorThemes.blue.glow,
        isActive: true, // Match Blue On
        valueUnit: 'Gbps',
        activeVal: 12.8,
        inactiveVal: 0
      },
      {
        id: 'sw-3',
        name: 'Cryogenic Coolant',
        category: 'Thermal Loop C',
        subLabel: 'Liquid He Piston',
        colorName: 'cyan',
        glowColor: colorThemes.cyan.glow,
        isActive: false, // Match Cyan Off
        valueUnit: 'Psi',
        activeVal: 1650,
        inactiveVal: 12
      },
      {
        id: 'sw-4',
        name: 'Environmental Matrix',
        category: 'Life Matrix D',
        subLabel: 'Bio Shield Node',
        colorName: 'green',
        glowColor: colorThemes.green.glow,
        isActive: true, // Match Green On
        valueUnit: 'O₂ %',
        activeVal: 100,
        inactiveVal: 18
      }
    ]);
  };

  const updateSelectedSwitchProperty = (field: keyof SwitchState, value: any) => {
    if (!selectedSwitchId) return;
    setSwitches(prev => 
      prev.map(sw => {
        if (sw.id === selectedSwitchId) {
          return { ...sw, [field]: value };
        }
        return sw;
      })
    );
  };

  const activeSwitchData = switches.find(s => s.id === selectedSwitchId);

  // Auto-rotate some scrolling diagnostics inside the top pill display if active switches change
  useEffect(() => {
    const messages = [
      `SYSTEM MODULES: ACTIVE (${activeCount}/4) | COMPONENT FLUX RATE: ${currentDraw.toFixed(1)} UNITS`,
      `COGNITIVE LOGIC ENGAGED | LIGHTNING SHIELD MATRIX STABLE`,
      `VIBRANT NEON OVERLAY: ${glowIntensity}% | PROCEDURAL FM SYNTH MODULE ARMED`,
      `TAP SWITCH CARDS TO ENGAGE DECK POWER DRIVES`
    ];
    let index = 0;
    if (activeCount === 4) {
      setAmbientPillText('⚠️ WARNING: ALL CRITICAL SUB-SYSTEMS RUNNING AT PEAK CAPACITIES!');
      return;
    }
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setAmbientPillText(messages[index]);
    }, 8500);

    return () => clearInterval(interval);
  }, [activeCount, currentDraw, glowIntensity]);

  // Adjust global custom glow based on intensity slider
  const glowScale = (glowIntensity / 100);

  return (
    <div className="relative min-h-screen bg-[#07080b] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0d1017] via-[#07080b] to-[#040406] text-[#e2e8f0] px-4 py-8 md:p-12 overflow-y-auto selection:bg-cyan-500 selection:text-black">
      
      {/* Background cybernetic grid lines to represent tech-deck texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111722_1px,transparent_1px),linear-gradient(to_bottom,#111722_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      {/* Decorative ambient background glows */}
      <div className="absolute top-[20%] left-[20%] w-[450px] h-[450px] rounded-full bg-cyan-550/10 blur-[130px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-purple-650/10 blur-[130px] pointer-events-none mix-blend-screen" />

      {/* Primary Dashboard layout constraints */}
      <div className="relative max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Top Header section containing Branding Logo & Custom Controller Status */}
        <div id="top-brand-row" className="w-full flex flex-col md:flex-row items-center justify-between gap-6 mb-8 mt-2">
          
          {/* Neon Logo exactly matching the Lightning Bolt Brain Circuit Design in Image */}
          <div className="flex items-center gap-3 self-start md:self-auto origin-left transform scale-90 md:scale-100">
            <div className="relative group cursor-pointer" onClick={() => { playMicroClick(); initAudio(); }}>
              {/* Logo Glow background element to create that soft vibrant cyber glow */}
              <div 
                className="absolute inset-0 bg-[#00f2fe] rounded-2xl blur-[14px] transition-all duration-500 opacity-60 group-hover:opacity-100"
                style={{ filter: `blur(14px) brightness(${glowScale})` }}
              />
              
              {/* Outer logo holder with exact circuit aesthetic */}
              <div className="relative bg-[#0d121c] border border-[#00f2fe]/40 rounded-xl p-3 flex items-center justify-center h-16 w-16 shadow-[inset_0_0_10px_rgba(0,242,254,0.2)]">
                
                {/* SVG Lightning Bolt and Brain Schematic Node */}
                <svg className="w-10 h-10 text-[#00f2fe]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Neon main circuit traces in background of lightning */}
                  <path d="M15 15 L35 15 L45 35 M85 85 L65 85 L55 65" stroke="rgba(34, 197, 94, 0.4)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3"/>
                  <path d="M15 85 L35 85 L40 65 M85 15 L65 15 L60 35" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="2.5" strokeLinecap="round"/>
                  
                  {/* Exact Lightning bolt path */}
                  <path 
                    d="M55 4 L18 52 H48 L42 96 L82 44 H50 L55 4" 
                    fill="url(#lightningGrad)" 
                    stroke="url(#lightningStrokeGrad)" 
                    strokeWidth="2.5" 
                    className="animate-neon-pulse"
                    style={{ animationDuration: '4s' }}
                  />
                  
                  {/* Glowing central core representing brain network integration */}
                  <g className="translate-x-[2px] translate-y-[-2px]">
                    <circle cx="48" cy="46" r="10" fill="#0d121c" stroke="#00f2fe" strokeWidth="1.5" />
                    {/* Micro Brain neural matrix traces */}
                    <line x1="48" y1="41" x2="48" y2="51" stroke="#34d399" strokeWidth="1"/>
                    <line x1="43" y1="46" x2="53" y2="46" stroke="#34d399" strokeWidth="1"/>
                    <circle cx="48" cy="46" r="3" fill="#34d399" className="animate-ping" style={{ animationDuration: '3s' }}/>
                    <circle cx="48" cy="46" r="3" fill="#22c55e" />
                  </g>

                  {/* Gradient definitions mirroring image */}
                  <defs>
                    <linearGradient id="lightningGrad" x1="18" y1="4" x2="82" y2="96" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#00f2fe" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.85" />
                    </linearGradient>
                    <linearGradient id="lightningStrokeGrad" x1="18" y1="4" x2="82" y2="96" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#00f2fe" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Title Branding */}
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400">
                CYBERDECK
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 flex items-center gap-1">
                <span className="h-1 text-center items-center w-1 bg-cyan-400 rounded-full animate-ping"></span>
                Interactive Deck UI
              </span>
            </div>
          </div>

          {/* Quick Sound toggle option that user can tap directly */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setSoundEnabled(!soundEnabled); playMicroClick(); }} 
              className={`p-2.5 rounded-lg border transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95 ${
                soundEnabled 
                  ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-400' 
                  : 'bg-zinc-900/40 border-zinc-700/40 text-zinc-500'
              }`}
              id="sound-toggle-btn"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span className="text-xs font-mono font-medium tracking-wider">
                Procedural Synth: {soundEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Quick Master Settings toggle icon */}
            <button
              onClick={() => { playMicroClick(); setConfigOpen(!configOpen); }}
              className={`p-2.5 rounded-lg border transition-all duration-300 hover:scale-105 active:scale-95 ${
                configOpen
                  ? 'bg-purple-950/30 border-purple-500/50 text-purple-400'
                  : 'bg-zinc-900/40 border-zinc-700/40 text-zinc-300 hover:border-cyan-500/30'
              }`}
              title="Toggle Customizer Panel"
              id="global-settings-toggle-btn"
            >
              <Settings size={16} className={`${configOpen ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
            </button>
          </div>

        </div>

        {/* Top Status Bar / Display: Floating oblong black bubble with deep violet/purple bottom glow */}
        {/* Exactly matches upper component in image */}
        <div className="relative w-full max-w-[560px] mb-10 flex justify-center selection:bg-purple-600">
          {/* Ambient violet purple glow beneath */}
          <div 
            className="absolute -bottom-1 left-4 right-4 h-5 rounded-full bg-purple-700 blur-[18px] opacity-75"
            style={{ 
              filter: `blur(18px) brightness(${glowScale})`,
              transform: `scaleY(${0.6 + (glowIntensity / 200)})` 
            }}
          />
          
          {/* Physical bubble style block */}
          <div id="status-marquee-bubble" className="relative w-full h-11 bg-[#090b0f] border border-[#2b253b] rounded-full px-6 flex items-center justify-between text-xs font-mono font-medium shadow-[inset_0_0_12px_rgba(168,85,247,0.15)] overflow-hidden">
            
            {/* Small glowing led indicator inside the pill bubble */}
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-[#a78bfa] text-[11px] font-bold tracking-widest uppercase">NODE-I:</span>
            </span>

            {/* Text ticker marquee inside status bubble */}
            <div className="flex-1 mx-4 overflow-hidden relative select-none">
              <div className="whitespace-nowrap text-[#a78bfa]/95 text-[11px] tracking-widest uppercase">
                {ambientPillText}
              </div>
            </div>

            {/* Utility status toggle button */}
            <span 
              onClick={() => {
                playMicroClick();
                // Prompt user visually or change message manually
                const customMsg = prompt("Enter custom diagnostics text to display:", ambientPillText);
                if (customMsg) setAmbientPillText(customMsg.toUpperCase());
              }}
              className="text-[9px] text-[#a78bfa]/60 hover:text-[#c084fc] cursor-pointer bg-purple-950/40 hover:bg-purple-900/50 transition-colors border border-purple-500/20 px-2 py-0.5 rounded-full"
              title="Click to override marquee message"
            >
              EDI
            </span>
          </div>
        </div>

        {/* The Central Cyber Deck Container: Neon Blue Glow Outline */}
        {/* Matches large center blue container in user image */}
        <div className="relative w-full max-w-[850px]">
          
          {/* Intensely vibrant glow around the control module frame */}
          <div 
            className="absolute -inset-1.5 rounded-[2.2rem] bg-cyan-550/40 blur-[20px] transition-all duration-500 opacity-75"
            style={{ 
              filter: `blur(20px) brightness(${glowScale})`,
              boxShadow: `0 0 35px rgba(6, 182, 212, ${0.4 * glowScale})`
            }}
          />
          
          {/* Physical Cyber Frame Container */}
          <div id="deck-central-frame" className="relative w-full bg-[#10141f] border-[1.5px] border-[#00f2fe] rounded-[2rem] p-6 md:p-8 flex flex-col items-center shadow-[inset_0_0_20px_rgba(0,242,254,0.35)]">
            
            {/* Glossy sheen reflecting on cyber-deck surface */}
            <div className="absolute top-0 inset-x-8 h-24 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none rounded-[1.8rem]" />

            {/* System Frame Title Center exactly matching photo: 'DATA AND CONTROL' */}
            <div className="relative mb-8 text-center select-none">
              <span className="absolute -inset-1 blur-md text-cyan-400 font-bold tracking-[0.35em] text-sm md:text-md opacity-25">
                {boardTitle}
              </span>
              <h2 className="relative font-mono font-semibold tracking-[0.35em] text-white text-sm md:text-md drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                {boardTitle}
              </h2>
            </div>

            {/* Exactly Four Vertical Control Cards */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {switches.map((sw, index) => {
                const colors = colorThemes[sw.colorName];
                const finalGlowForce = Math.min(1.5, Math.max(0.2, (glowIntensity / 100)));
                
                return (
                  <div
                    key={sw.id}
                    id={`switch-card-${index}`}
                    onClick={() => handleToggle(sw.id)}
                    className="group relative cursor-pointer flex flex-col justify-between h-[230px] rounded-[1.8rem] bg-[#0c0e14] p-5 border-[1.5px] border-zinc-800 transition-all duration-300 hover:scale-[1.02] hover:bg-[#0e1119]"
                    style={{
                      // Custom dynamic box shadow simulating image's realistic colored card border-glow
                      boxShadow: sw.isActive 
                        ? `0 0 ${25 * finalGlowForce}px ${sw.glowColor}, inset 0 0 ${12 * finalGlowForce}px ${sw.glowColor.replace('0.65', '0.25')}` 
                        : `0 0 ${8 * finalGlowForce}px ${sw.glowColor.replace('0.65', '0.2')}`,
                      borderColor: sw.isActive ? colors.glow : 'rgba(39, 39, 42, 0.7)'
                    }}
                  >
                    {/* Top indicator detailing system tags */}
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className={`text-[9px] font-mono tracking-widest uppercase opacity-70 ${sw.isActive ? colors.text : 'text-gray-400'}`}>
                          {sw.category}
                        </span>
                        <h3 className="text-xs font-semibold tracking-wide text-white mt-0.5 line-clamp-1">
                          {sw.name}
                        </h3>
                      </div>
                      
                      {/* Active status pulsing dot indicator */}
                      <span 
                        className={`inline-block w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          sw.isActive 
                            ? `${sw.colorName === 'green' ? 'bg-green-400' : sw.colorName === 'blue' ? 'bg-blue-400' : sw.colorName === 'cyan' ? 'bg-cyan-400' : 'bg-purple-400'} animate-ping`
                            : 'bg-zinc-700'
                        }`}
                      />
                    </div>

                    {/* Numeric Diagnostics readout context */}
                    <div className="my-2 select-none">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-mono font-bold tracking-tight text-white">
                          {sw.isActive ? sw.activeVal : sw.inactiveVal}
                        </span>
                        <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-semibold">
                          {sw.valueUnit}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
                        {sw.subLabel}
                      </span>
                    </div>

                    {/* Highly stylized Horizontal Slide Toggle corresponding exactly to user's design image */}
                    {/* Dark capsule track with a 3D looking brushed metal silver knob indicator */}
                    <div className="mt-4 w-full flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">
                        {sw.isActive ? 'RUNNING' : 'STANDBY'}
                      </span>
                      
                      {/* Interactive slide switch container */}
                      <div 
                        className={`relative w-16 h-7 rounded-full p-1 transition-all duration-300 ${
                          sw.isActive 
                            ? colors.trackActive
                            : 'bg-[#181a24] border border-zinc-800'
                        }`}
                      >
                        {/* Custom Sliding Toggle Knob */}
                        <motion.div 
                          layout
                          transition={{ type: "spring", stiffness: 450, damping: 28 }}
                          className={`w-5 h-5 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.6)] ${
                            sw.isActive 
                              ? 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]' 
                              : 'bg-gradient-to-tr from-zinc-600 via-zinc-400 to-zinc-200'
                          }`}
                          style={{
                            // Push position left/right depending on toggle isActive state
                            marginLeft: sw.isActive ? 'auto' : '0px'
                          }}
                        >
                          {/* Fine concentric brushed metallic inner circle */}
                          <div className={`w-full h-full rounded-full flex items-center justify-center p-[4px] ${sw.isActive ? 'bg-white' : 'bg-zinc-800/10'}`}>
                            <div className={`w-full h-full rounded-full ${sw.isActive ? colors.trackActive : 'bg-zinc-700/60'}`} />
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Active internal backlight sheen */}
                    <AnimatePresence>
                      {sw.isActive && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.05 }}
                          exit={{ opacity: 0 }}
                          className={`absolute inset-0 rounded-[1.8rem] pointer-events-none ${colors.bg}`}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Quick action system operations */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-5 border-t border-zinc-800/60 text-xs text-zinc-500 font-mono">
              <span className="text-center sm:text-left select-none">
                💡 TIP: TAP ANY MODULE CARD DIRECTLY TO TOGGLE CAPACITIVE FLOWS
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playMicroClick();
                    setSwitches(prev => prev.map(s => {
                      if (!s.isActive) playSynthesizedSound(true);
                      return { ...s, isActive: true };
                    }));
                  }}
                  className="px-3.5 py-1.5 rounded-md hover:text-white bg-zinc-900 border border-zinc-800 hover:border-cyan-500/30 transition-all hover:scale-105 active:scale-95"
                >
                  ⚡ ENGAGE ALL
                </button>
                <button
                  onClick={() => {
                    playMicroClick();
                    setSwitches(prev => prev.map(s => {
                      if (s.isActive) playSynthesizedSound(false);
                      return { ...s, isActive: false };
                    }));
                  }}
                  className="px-3.5 py-1.5 rounded-md hover:text-white bg-zinc-900 border border-zinc-800 hover:border-purple-500/30 transition-all hover:scale-105 active:scale-95"
                >
                  🛑 DISENGAGE ALL
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Collapsible Cyberdeck Customizer Controller Panel */}
        <div className="w-full max-w-[850px] mt-6">
          <button 
            onClick={() => { playMicroClick(); setConfigOpen(!configOpen); }}
            className="w-full h-11 px-5 rounded-2xl bg-[#090b0f] border border-zinc-800/80 hover:border-cyan-500/30 flex items-center justify-between transition-all duration-300 transform"
          >
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-cyan-400">
              <SlidersHorizontal size={14} className="animate-pulse" />
              <span>INTERACTIVE BOARD SETTINGS (DECK CUSTOMIZER)</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <span>{configOpen ? 'HIDE CONFIGURATION' : 'SHOW CONFIGURATION'}</span>
              {configOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </button>

          <AnimatePresence>
            {configOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                {/* The Config Drawer Content */}
                <div className="mt-2 bg-[#0c0f17] border border-zinc-800 rounded-2xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
                  
                  {/* Left Column: Global visual overrides & telemetry config */}
                  <div className="flex flex-col gap-5">
                    <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase border-b border-zinc-800 pb-2 flex items-center justify-between">
                      <span>👁️ Visuals & Ambient Deck Settings</span>
                      <button 
                        onClick={resetToImageOriginal}
                        className="text-[10px] text-purple-400 hover:text-purple-300 font-medium tracking-normal normal-case flex items-center gap-1 hover:underline"
                        title="Reset fields perfectly to match the image"
                      >
                        <RotateCcw size={10} />
                        Perfect Match Original
                      </button>
                    </h4>

                    {/* Master Board Header text field override */}
                    <div className="flex flex-col gap-1.5Packed">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase">Board Accent Heading Text</label>
                      <input 
                        type="text" 
                        value={boardTitle} 
                        onChange={(e) => setBoardTitle(e.target.value.toUpperCase())}
                        className="bg-[#111420] border border-zinc-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-xs text-white uppercase tracking-wider font-mono outline-none"
                        placeholder="DATA AND CONTROL"
                      />
                    </div>

                    {/* Marquee Custom override */}
                    <div className="flex flex-col gap-1.5 pt-1">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase">Status Ambient Marquee Ticker</label>
                      <input 
                        type="text" 
                        value={ambientPillText} 
                        onChange={(e) => setAmbientPillText(e.target.value.toUpperCase())}
                        className="bg-[#111420] border border-zinc-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-xs text-white uppercase tracking-wider font-mono outline-none"
                        placeholder="SYSTEM MODULE DIAGNOSTICS"
                      />
                    </div>

                    {/* Master Neon Bloom intensity slider */}
                    <div className="flex flex-col gap-2 pt-1">
                      <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400 uppercase">
                        <span>Intensity of Glow Effects</span>
                        <span className="text-cyan-400 font-bold">{glowIntensity}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="20" 
                        max="150" 
                        value={glowIntensity}
                        onChange={(e) => setGlowIntensity(parseInt(e.target.value))}
                        className="w-full accent-cyan-500 bg-zinc-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                        <span>COSMETIC OFFST-SHADOW</span>
                        <span>VIBRANT NEON HALO</span>
                      </div>
                    </div>

                    {/* Audio Volume Setting */}
                    {soundEnabled && (
                      <div className="flex flex-col gap-2 pt-2">
                        <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400 uppercase">
                          <span>Synthesizer Master Gain</span>
                          <span className="text-purple-400 font-bold">{synthVolume}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="5" 
                          max="100" 
                          value={synthVolume}
                          onChange={(e) => setSynthVolume(parseInt(e.target.value))}
                          className="w-full accent-purple-500 bg-zinc-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Column: Switch configuration inspector to edit individual labels, values */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase border-b border-zinc-800 pb-2">
                      🛠️ Select Switch To Modify Parameters
                    </h4>

                    {/* Quick selection tab pills */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {switches.map((sw, index) => (
                        <button
                          key={sw.id}
                          onClick={() => { playMicroClick(); setSelectedSwitchId(sw.id); }}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-all uppercase whitespace-nowrap border ${
                            selectedSwitchId === sw.id 
                              ? 'bg-zinc-800 border-zinc-700 text-white font-bold' 
                              : 'bg-zinc-900/40 border-zinc-800/60 text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          SW-{index+1}
                        </button>
                      ))}
                    </div>

                    {activeSwitchData && (
                      <div className="bg-[#111420] border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
                        {/* Selected Switch Label */}
                        <div className="grid grid-cols-2 gap-3.5">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase">Title Name</label>
                            <input 
                              type="text" 
                              value={activeSwitchData.name} 
                              onChange={(e) => updateSelectedSwitchProperty('name', e.target.value)}
                              className="bg-[#0c0e16] border border-zinc-800 text-xs rounded-lg px-2.5 py-1 text-white font-mono outline-none focus:border-purple-500"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase">Category Tag</label>
                            <input 
                              type="text" 
                              value={activeSwitchData.category} 
                              onChange={(e) => updateSelectedSwitchProperty('category', e.target.value)}
                              className="bg-[#0c0e16] border border-zinc-800 text-xs rounded-lg px-2.5 py-1 text-white font-mono outline-none focus:border-purple-500"
                            />
                          </div>
                        </div>

                        {/* Secondary telemetry and value config */}
                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase">Active Val</label>
                            <input 
                              type="number" 
                              value={activeSwitchData.activeVal} 
                              onChange={(e) => updateSelectedSwitchProperty('activeVal', parseFloat(e.target.value) || 0)}
                              className="bg-[#0c0e16] border border-zinc-800 text-xs rounded-lg px-2 py-1 text-white font-mono outline-none"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase">Inactive Val</label>
                            <input 
                              type="number" 
                              value={activeSwitchData.inactiveVal} 
                              onChange={(e) => updateSelectedSwitchProperty('inactiveVal', parseFloat(e.target.value) || 0)}
                              className="bg-[#0c0e16] border border-zinc-800 text-xs rounded-lg px-2 py-1 text-white font-mono outline-none"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase">Unit Tag</label>
                            <input 
                              type="text" 
                              value={activeSwitchData.valueUnit} 
                              onChange={(e) => updateSelectedSwitchProperty('valueUnit', e.target.value)}
                              className="bg-[#0c0e16] border border-zinc-800 text-xs rounded-lg px-2 py-1 text-white font-mono uppercase outline-none"
                            />
                          </div>
                        </div>

                        {/* Live Color Hue Selectors for individual toggle card */}
                        <div className="flex flex-col gap-1.5 pt-1.5">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase">Bezel Neon Glow Light Hue</label>
                          <div className="flex gap-2">
                            {(Object.keys(colorThemes) as Array<keyof typeof colorThemes>).map((cName) => {
                              const details = colorThemes[cName];
                              const isSelected = activeSwitchData.colorName === cName;
                              return (
                                <button
                                  key={cName}
                                  onClick={() => {
                                    playMicroClick();
                                    updateSelectedSwitchProperty('colorName', cName);
                                    updateSelectedSwitchProperty('glowColor', details.glow);
                                  }}
                                  className={`h-6 flex-1 rounded-full border transition-all duration-300 ${isSelected ? 'border-white scale-110 shadow-[0_0_8px_currentColor]' : 'border-zinc-800 scale-100 hover:border-zinc-500'}`}
                                  style={{ 
                                    backgroundColor: details.glow.replace('0.65', '0.8'),
                                    color: details.glow
                                  }}
                                  title={`Switch SW-${switches.findIndex(s => s.id === selectedSwitchId) + 1} to Neon ${cName}`}
                                />
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Informative Footer explaining design fidelity matching */}
        <div id="deck-footer" className="w-full max-w-[850px] mt-10 text-center select-none">
          <p className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <span>PIXEL-PERFECT REPRODUCTION & INTERPLAY FOR CYBERSYSTEM: "DATA AND CONTROL"</span>
          </p>
          <div className="mt-2.5 flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-zinc-800" />
            <span className="text-[10px] font-mono text-zinc-500 px-3 py-1 bg-zinc-900/60 rounded-full border border-zinc-800/40">
              PRESENTS EXACT PHOTO ALIGNMENTS (ON TURN LOAD)
            </span>
            <span className="h-[1px] w-12 bg-zinc-800" />
          </div>
        </div>

      </div>
    </div>
  );
}
