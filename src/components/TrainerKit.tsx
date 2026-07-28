import React, { useState } from 'react';
import { Engine8085 } from '../lib/8085Engine';
import { Play, RotateCcw, HelpCircle, ChevronRight, Zap, CheckCircle, Lightbulb } from 'lucide-react';

interface TrainerKitProps {
  engine: Engine8085;
  onStateChange: () => void;
  soundEnabled: boolean;
}

type Mode = 'IDLE' | 'EXMEM_ADDR' | 'EXMEM_DATA' | 'EXREG' | 'GO_ADDR';

export const TrainerKit: React.FC<TrainerKitProps> = ({ engine, onStateChange, soundEnabled }) => {
  const [mode, setMode] = useState<Mode>('IDLE');
  const [addressInput, setAddressInput] = useState<string>('2000');
  const [dataInput, setDataInput] = useState<string>('00');
  const [currentReg, setCurrentReg] = useState<string>('A');
  const [message, setMessage] = useState<string>('ET-8085 Microprocessor Trainer Kit Ready');
  const [showGuide, setShowGuide] = useState<boolean>(false);

  // Audio tone generator for keypad click sound
  const playBeep = (freq: number = 800) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.value = 0.05;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Audio context might be restricted
    }
  };

  const currentAddressNum = parseInt(addressInput, 16) || 0x2000;

  // Handle keypad hex entry (0-F)
  const handleHexInput = (char: string) => {
    playBeep(900);
    if (mode === 'EXMEM_ADDR') {
      if (addressInput.length >= 4) {
        setAddressInput(char);
      } else {
        setAddressInput((prev) => (prev + char).slice(-4));
      }
    } else if (mode === 'EXMEM_DATA') {
      const newInput = (dataInput + char).slice(-2);
      setDataInput(newInput);
      engine.writeMemory(currentAddressNum, parseInt(newInput, 16));
      onStateChange();
    } else if (mode === 'GO_ADDR') {
      if (addressInput.length >= 4) {
        setAddressInput(char);
      } else {
        setAddressInput((prev) => (prev + char).slice(-4));
      }
    } else if (mode === 'EXREG') {
      const newInput = (dataInput + char).slice(-2);
      setDataInput(newInput);
      setRegValue(currentReg, parseInt(newInput, 16));
      onStateChange();
    }
  };

  // Helper for setting CPU registers
  const setRegValue = (reg: string, val: number) => {
    val = val & 0xff;
    switch (reg) {
      case 'A': engine.state.a = val; break;
      case 'B': engine.state.b = val; break;
      case 'C': engine.state.c = val; break;
      case 'D': engine.state.d = val; break;
      case 'E': engine.state.e = val; break;
      case 'H': engine.state.h = val; break;
      case 'L': engine.state.l = val; break;
    }
  };

  const getRegValue = (reg: string): string => {
    let val = 0;
    switch (reg) {
      case 'A': val = engine.state.a; break;
      case 'B': val = engine.state.b; break;
      case 'C': val = engine.state.c; break;
      case 'D': val = engine.state.d; break;
      case 'E': val = engine.state.e; break;
      case 'H': val = engine.state.h; break;
      case 'L': val = engine.state.l; break;
      case 'PC': return engine.state.pc.toString(16).toUpperCase().padStart(4, '0');
      case 'SP': return engine.state.sp.toString(16).toUpperCase().padStart(4, '0');
    }
    return val.toString(16).toUpperCase().padStart(2, '0');
  };

  // Keypad Command Buttons
  const handleReset = () => {
    playBeep(400);
    engine.reset();
    setMode('IDLE');
    setAddressInput('2000');
    setDataInput('00');
    setMessage('ET-8085 RESET - Ready');
    onStateChange();
  };

  const handleExMem = () => {
    playBeep(700);
    setMode('EXMEM_ADDR');
    setMessage('EXMEM MODE: Enter 4-Digit Hex Address, then press NEXT');
  };

  const handleExReg = () => {
    playBeep(700);
    setMode('EXREG');
    setCurrentReg('A');
    setDataInput(getRegValue('A'));
    setMessage('EXREG MODE: Select register or press NEXT to cycle registers');
  };

  const handleGo = () => {
    playBeep(700);
    setMode('GO_ADDR');
    setMessage('GO MODE: Enter 4-Digit Hex Starting Address (e.g. 2000), then press EXEC');
  };

  const handleNext = () => {
    playBeep(850);
    if (mode === 'EXMEM_ADDR') {
      setMode('EXMEM_DATA');
      const val = engine.readMemory(currentAddressNum);
      setDataInput(val.toString(16).toUpperCase().padStart(2, '0'));
      setMessage(`Memory ${addressInput.toUpperCase()}H content = ${val.toString(16).toUpperCase().padStart(2, '0')}H`);
    } else if (mode === 'EXMEM_DATA') {
      const nextAddr = (currentAddressNum + 1) & 0xffff;
      const nextAddrHex = nextAddr.toString(16).toUpperCase().padStart(4, '0');
      setAddressInput(nextAddrHex);
      const val = engine.readMemory(nextAddr);
      setDataInput(val.toString(16).toUpperCase().padStart(2, '0'));
      setMessage(`Address ${nextAddrHex}H -> Data: ${val.toString(16).toUpperCase().padStart(2, '0')}H`);
    } else if (mode === 'EXREG') {
      const regs = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'PC', 'SP'];
      const nextIdx = (regs.indexOf(currentReg) + 1) % regs.length;
      const nextReg = regs[nextIdx];
      setCurrentReg(nextReg);
      setDataInput(getRegValue(nextReg));
      setMessage(`Examining Register ${nextReg} = ${getRegValue(nextReg)}H`);
    }
  };

  const handlePre = () => {
    playBeep(850);
    if (mode === 'EXMEM_DATA') {
      const preAddr = (currentAddressNum - 1) & 0xffff;
      const preAddrHex = preAddr.toString(16).toUpperCase().padStart(4, '0');
      setAddressInput(preAddrHex);
      const val = engine.readMemory(preAddr);
      setDataInput(val.toString(16).toUpperCase().padStart(2, '0'));
    }
  };

  const handleExec = () => {
    playBeep(1200);
    if (mode === 'GO_ADDR') {
      engine.state.pc = currentAddressNum;
      engine.state.isHalted = false;
      setMessage(`Executing code starting from Address ${addressInput}H...`);
      // Run execution
      let count = 0;
      while (!engine.state.isHalted && count < 1000) {
        engine.step();
        count++;
      }
      onStateChange();
      setMessage(`Execution finished from ${addressInput}H (${count} steps executed)`);
    }
  };

  const handleStep = () => {
    playBeep(1000);
    if (engine.state.isHalted) {
      setMessage('CPU is HALTED. Press RESET to restart.');
      return;
    }
    const res = engine.step();
    onStateChange();
    setAddressInput(engine.state.pc.toString(16).toUpperCase().padStart(4, '0'));
    const curVal = engine.readMemory(engine.state.pc);
    setDataInput(curVal.toString(16).toUpperCase().padStart(2, '0'));
    setMessage(`Executed PC:${res.executedPC.toString(16).toUpperCase()}H [${res.mnemonic}] -> T-States: ${res.tStates}`);
  };

  // Render 7-Segment Display Text
  const getDisplayAddressText = () => {
    if (mode === 'EXREG') {
      return `${currentReg}   `.slice(0, 4);
    }
    return addressInput.toUpperCase().padStart(4, '0');
  };

  const getDisplayDataText = () => {
    if (mode === 'EXMEM_ADDR' || mode === 'GO_ADDR') {
      return '- -';
    }
    return dataInput.toUpperCase().padStart(2, '0');
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Top Banner with Guide toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>ET-8085 Hardware Digital Trainer Kit</span>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Lab Mode
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Authentic ET-8085 Trainer Kit with 6-Digit 7-Segment Red LED Display, Hex Keypad & Memory Controls.
          </p>
        </div>

        <button
          onClick={() => setShowGuide(!showGuide)}
          className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
        >
          <Lightbulb className="w-4 h-4" />
          <span>{showGuide ? 'Hide Lab Guide' : 'How to Use Keypad Kit?'}</span>
        </button>
      </div>

      {/* Guide Modal / Card if enabled */}
      {showGuide && (
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-5 text-slate-200 text-xs space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Step-by-Step College Lab Guide for ET-8085 Hardware Kit</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="font-bold text-amber-300 block mb-1">1. Entering Opcodes to Memory</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Press <strong className="text-slate-200">RESET</strong> → <strong className="text-slate-200">EXMEM</strong> → Type Starting Address <strong className="text-amber-400">2000</strong> → Press <strong className="text-slate-200">NEXT</strong> → Type Opcode Hex (e.g. <strong className="text-amber-400">3E</strong>) → Press <strong className="text-slate-200">NEXT</strong> to advance address!
              </p>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="font-bold text-amber-300 block mb-1">2. Executing Your Program</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Press <strong className="text-slate-200">RESET</strong> → Press <strong className="text-slate-200">GO</strong> → Type Address <strong className="text-amber-400">2000</strong> → Press <strong className="text-slate-200">EXEC</strong>. The program will run automatically until <strong className="text-red-400">HLT (76H)</strong>.
              </p>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="font-bold text-amber-300 block mb-1">3. Checking Output & Registers</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Press <strong className="text-slate-200">EXMEM</strong> → Type output memory address (e.g. <strong className="text-amber-400">2052</strong>) → Press <strong className="text-slate-200">NEXT</strong> to inspect result! Or press <strong className="text-slate-200">EXREG</strong> to examine CPU registers A, B, C, etc.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main ET-8085 Hardware Trainer Board Interface */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 rounded-3xl border-2 border-slate-800 shadow-2xl space-y-6">
        {/* LED Display Box */}
        <div className="bg-slate-950 p-6 rounded-2xl border-2 border-slate-800 shadow-inner flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
          <div className="absolute top-2 left-4 text-[10px] font-mono tracking-widest text-slate-600 uppercase">
            ET-8085 Microprocessor Trainer Display
          </div>

          <div className="flex items-center gap-6 pt-3">
            {/* Address Field Display (4 Digits) */}
            <div className="flex flex-col items-center">
              <div className="text-[10px] text-slate-500 font-mono mb-1 uppercase tracking-wider">Address / Reg</div>
              <div className="bg-black/90 px-5 py-3 rounded-xl border border-red-950 shadow-[0_0_20px_rgba(239,68,68,0.2)] flex items-center gap-1 font-mono text-4xl sm:text-5xl font-black text-red-500 tracking-widest min-w-[160px] justify-center">
                <span className="drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                  {getDisplayAddressText()}
                </span>
              </div>
            </div>

            <div className="text-red-600 text-3xl font-black pt-4 animate-pulse">:</div>

            {/* Data Field Display (2 Digits) */}
            <div className="flex flex-col items-center">
              <div className="text-[10px] text-slate-500 font-mono mb-1 uppercase tracking-wider">Data Byte</div>
              <div className="bg-black/90 px-5 py-3 rounded-xl border border-red-950 shadow-[0_0_20px_rgba(239,68,68,0.2)] flex items-center gap-1 font-mono text-4xl sm:text-5xl font-black text-red-500 tracking-widest min-w-[100px] justify-center">
                <span className="drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                  {getDisplayDataText()}
                </span>
              </div>
            </div>
          </div>

          {/* Status Message Display bar */}
          <div className="w-full bg-slate-900/90 py-1.5 px-4 rounded-lg border border-slate-800/80 text-center text-xs font-mono text-amber-400">
            {message}
          </div>
        </div>

        {/* ET-8085 Keypad Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Function Command Keys (Red / Grey Special Keypad) */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800/80 pb-2 flex items-center justify-between">
              <span>Command & Function Keys</span>
              <span className="text-[10px] text-amber-500">ET-8085 Layout</span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              <button
                onClick={handleReset}
                className="py-3 px-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-950/50 border border-red-400/40 active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5"
              >
                <span>RESET</span>
              </button>

              <button
                onClick={handleGo}
                className={`py-3 px-2 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5 ${
                  mode === 'GO_ADDR'
                    ? 'bg-amber-500 text-slate-950 border border-amber-300 ring-2 ring-amber-400/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
                }`}
              >
                <span>GO</span>
              </button>

              <button
                onClick={handleExReg}
                className={`py-3 px-2 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5 ${
                  mode === 'EXREG'
                    ? 'bg-amber-500 text-slate-950 border border-amber-300 ring-2 ring-amber-400/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
                }`}
              >
                <span>EXREG</span>
              </button>

              <button
                onClick={handleExMem}
                className={`py-3 px-2 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5 ${
                  mode === 'EXMEM_ADDR' || mode === 'EXMEM_DATA'
                    ? 'bg-amber-500 text-slate-950 border border-amber-300 ring-2 ring-amber-400/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
                }`}
              >
                <span>EXMEM</span>
              </button>

              <button
                onClick={handleStep}
                className="py-3 px-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md border border-orange-400/40 active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5"
              >
                <span>STEP</span>
              </button>

              <button
                onClick={handleExec}
                className="py-3 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md border border-emerald-400/40 active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5"
              >
                <span>EXEC</span>
              </button>

              <button
                onClick={handlePre}
                className="py-3 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 active:scale-95 transition-all"
              >
                <span>PRE</span>
              </button>

              <button
                onClick={handleNext}
                className="py-3 px-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md border border-amber-400/40 active:scale-95 transition-all"
              >
                <span>NEXT</span>
              </button>
            </div>
          </div>

          {/* Hexadecimal Digits Keypad (0-F) */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800/80 pb-2 flex items-center justify-between">
              <span>Hexadecimal Data Keypad</span>
              <span className="text-[10px] text-slate-500">0 - F Input</span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {['C', 'D', 'E', 'F', '8', '9', 'A', 'B', '4', '5', '6', '7', '0', '1', '2', '3'].map((char) => (
                <button
                  key={char}
                  onClick={() => handleHexInput(char)}
                  className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-mono font-bold text-base border border-slate-700/80 shadow active:scale-95 transition-all hover:border-amber-500/50"
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
