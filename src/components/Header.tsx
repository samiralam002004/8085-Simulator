import React from 'react';
import { ViewMode } from '../types';
import { 
  Code, 
  Calculator, 
  Play, 
  Pause, 
  RotateCcw, 
  Grid, 
  GitCommit, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Cpu, 
  Zap,
  FastForward,
  HelpCircle
} from 'lucide-react';

interface HeaderProps {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  isRunning: boolean;
  onRunToggle: () => void;
  onSingleStep: () => void;
  onReset: () => void;
  clockSpeed: number;
  setClockSpeed: (speed: number) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  tStates: number;
  isHalted: boolean;
  pcHex: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  isRunning,
  onRunToggle,
  onSingleStep,
  onReset,
  clockSpeed,
  setClockSpeed,
  soundEnabled,
  setSoundEnabled,
  tStates,
  isHalted,
  pcHex,
}) => {
  const navItems: { id: ViewMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'editor', label: 'Editor', icon: Code },
    { id: 'trainer', label: 'Digital Kit', icon: Calculator },
    { id: 'memory', label: 'Memory', icon: Grid },
    { id: 'flowchart', label: 'Flowchart', icon: GitCommit },
    { id: 'labs', label: 'Lab Manual', icon: BookOpen },
    { id: 'reference', label: 'Opcodes', icon: HelpCircle },
  ];

  return (
    <>
      <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          {/* Brand Title */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-orange-950/40 ring-1 ring-orange-400/30 shrink-0">
              <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-bold text-base sm:text-lg tracking-tight text-white font-mono">
                  8085<span className="text-amber-400">PRO</span> Digital Kit
                </h1>
                <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold tracking-wider rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                  ET-8085
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Microprocessor Simulator & ET-8085 Lab Trainer
              </p>
            </div>
          </div>

          {/* Execution Control Center */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/90 p-1.5 rounded-xl border border-slate-800/80 shadow-inner">
            <button
              onClick={onRunToggle}
              className={`px-3 py-2 sm:py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 min-h-[38px] ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white ring-2 ring-amber-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
              title={isRunning ? 'Pause execution' : 'Run assembly program'}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? 'Pause' : 'Run'}</span>
            </button>

            <button
              onClick={onSingleStep}
              disabled={isRunning || isHalted}
              className="px-3 py-2 sm:py-1.5 rounded-lg font-medium text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all active:scale-95 min-h-[38px]"
              title="Single Step Debug"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Step</span>
            </button>

            <button
              onClick={onReset}
              className="p-2 sm:p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
              title="Reset CPU State"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-800 mx-0.5 hidden sm:block" />

            {/* Clock Speed Select */}
            <div className="hidden sm:flex items-center gap-1 px-1 text-xs text-slate-400">
              <FastForward className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={clockSpeed}
                onChange={(e) => setClockSpeed(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded-md text-xs px-1.5 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value={1}>1 Hz</option>
                <option value={10}>10 Hz</option>
                <option value={50}>50 Hz</option>
                <option value={100}>100 Hz</option>
                <option value={1000}>Max</option>
              </select>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 sm:p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
              title={soundEnabled ? 'Mute Keypad Audio' : 'Enable Keypad Audio'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Status Indicators */}
            <div className="hidden lg:flex items-center gap-3 ml-2 pl-3 border-l border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-500">PC:</span>{' '}
                <span className="text-amber-400 font-semibold">{pcHex}H</span>
              </div>
              <div>
                <span className="text-slate-500">T:</span>{' '}
                <span className="text-cyan-400 font-semibold">{tStates}</span>
              </div>
              {isHalted && (
                <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded border border-red-500/30 animate-pulse">
                  HALT
                </span>
              )}
            </div>
          </div>

          {/* Desktop View Mode Tabs (Hidden on mobile, mobile uses bottom navigation) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Android Mobile Navigation Bar (Fixed at bottom for touch comfort) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 shadow-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all min-w-[50px] ${
                  isActive
                    ? 'text-amber-400 font-bold scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

