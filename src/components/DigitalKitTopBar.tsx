import React, { useState, useEffect } from 'react';
import { Engine8085 } from '../lib/8085Engine';
import { 
  Cpu, 
  RotateCcw, 
  Play, 
  Zap, 
  Edit3, 
  Copy, 
  ListPlus, 
  Trash2, 
  Layers, 
  ArrowRight, 
  ArrowLeft, 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  Smartphone, 
  HelpCircle,
  X,
  Check
} from 'lucide-react';

interface DigitalKitTopBarProps {
  engine: Engine8085;
  onStateChange: () => void;
  soundEnabled: boolean;
  isRunning: boolean;
  onRunToggle: () => void;
  onSingleStep: () => void;
  onReset: () => void;
}

type ActiveOperation = 'none' | 'subst' | 'exam_reg' | 'fill' | 'move' | 'insert' | 'delete' | 'io_port';

export const DigitalKitTopBar: React.FC<DigitalKitTopBarProps> = ({
  engine,
  onStateChange,
  soundEnabled,
  isRunning,
  onRunToggle,
  onSingleStep,
  onReset,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showKeypadOverlay, setShowKeypadOverlay] = useState<boolean>(false);
  const [activeOp, setActiveOp] = useState<ActiveOperation>('none');

  // Operational State
  const [currentAddrHex, setCurrentAddrHex] = useState<string>('2000');
  const [selectedReg, setSelectedReg] = useState<string>('A');
  const [inputValueHex, setInputValueHex] = useState<string>('');

  // Block Fill State
  const [fillStart, setFillStart] = useState<string>('2000');
  const [fillEnd, setFillEnd] = useState<string>('200F');
  const [fillData, setFillData] = useState<string>('00');

  // Block Move State
  const [moveStart, setMoveStart] = useState<string>('2000');
  const [moveEnd, setMoveEnd] = useState<string>('200F');
  const [moveDest, setMoveDest] = useState<string>('3000');

  // Insert/Delete State
  const [insDelAddr, setInsDelAddr] = useState<string>('2000');
  const [insData, setInsData] = useState<string>('00');

  // I/O Port State
  const [portNumHex, setPortNumHex] = useState<string>('00');
  const [portValHex, setPortValHex] = useState<string>('00');

  // Status Toast / Message
  const [statusMsg, setStatusMsg] = useState<string>('ET-8085 READY');

  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // ignore audio errors
    }
  };

  const notify = (msg: string) => {
    setStatusMsg(msg);
    playBeep();
    onStateChange();
  };

  // 1. Substitute Memory Operations
  const handleMemoryNext = () => {
    const addr = parseInt(currentAddrHex, 16);
    if (!isNaN(addr)) {
      if (inputValueHex.trim() !== '') {
        const val = parseInt(inputValueHex, 16);
        if (!isNaN(val)) {
          engine.writeMemory(addr, val & 0xff);
        }
      }
      const nextAddr = (addr + 1) & 0xffff;
      const nextAddrStr = nextAddr.toString(16).toUpperCase().padStart(4, '0');
      setCurrentAddrHex(nextAddrStr);
      setInputValueHex(engine.readMemory(nextAddr).toString(16).toUpperCase().padStart(2, '0'));
      notify(`MEM [${nextAddrStr}] = ${engine.readMemory(nextAddr).toString(16).toUpperCase().padStart(2, '0')}H`);
    }
  };

  const handleMemoryPrev = () => {
    const addr = parseInt(currentAddrHex, 16);
    if (!isNaN(addr)) {
      const prevAddr = (addr - 1 + 0x10000) & 0xffff;
      const prevAddrStr = prevAddr.toString(16).toUpperCase().padStart(4, '0');
      setCurrentAddrHex(prevAddrStr);
      setInputValueHex(engine.readMemory(prevAddr).toString(16).toUpperCase().padStart(2, '0'));
      notify(`MEM [${prevAddrStr}] = ${engine.readMemory(prevAddr).toString(16).toUpperCase().padStart(2, '0')}H`);
    }
  };

  // 2. Register Read / Write
  const handleRegValueChange = (valStr: string) => {
    setInputValueHex(valStr);
    const val = parseInt(valStr, 16);
    if (!isNaN(val)) {
      engine.setRegister(selectedReg, val & (['PC', 'SP'].includes(selectedReg) ? 0xffff : 0xff));
      onStateChange();
    }
  };

  const getSelectedRegValHex = () => {
    const val = engine.getRegister(selectedReg);
    const width = ['PC', 'SP'].includes(selectedReg) ? 4 : 2;
    return val.toString(16).toUpperCase().padStart(width, '0');
  };

  // 3. Block Fill Action
  const handleExecuteFill = () => {
    const start = parseInt(fillStart, 16);
    const end = parseInt(fillEnd, 16);
    const data = parseInt(fillData, 16);
    if (isNaN(start) || isNaN(end) || isNaN(data)) {
      notify('ERR: INVALID HEX');
      return;
    }
    engine.fillMemory(start, end, data);
    notify(`FILLED ${fillStart}H-${fillEnd}H WITH ${fillData}H`);
  };

  // 4. Block Move Action
  const handleExecuteMove = () => {
    const start = parseInt(moveStart, 16);
    const end = parseInt(moveEnd, 16);
    const dest = parseInt(moveDest, 16);
    if (isNaN(start) || isNaN(end) || isNaN(dest)) {
      notify('ERR: INVALID HEX');
      return;
    }
    engine.moveMemory(start, end, dest);
    notify(`MOVED ${moveStart}H-${moveEnd}H TO ${moveDest}H`);
  };

  // 5. Insert Byte
  const handleExecuteInsert = () => {
    const addr = parseInt(insDelAddr, 16);
    const data = parseInt(insData, 16);
    if (isNaN(addr) || isNaN(data)) {
      notify('ERR: INVALID HEX');
      return;
    }
    engine.insertMemoryByte(addr, data);
    notify(`INSERTED ${insData}H AT ${insDelAddr}H`);
  };

  // 6. Delete Byte
  const handleExecuteDelete = () => {
    const addr = parseInt(insDelAddr, 16);
    if (isNaN(addr)) {
      notify('ERR: INVALID HEX');
      return;
    }
    engine.deleteMemoryByte(addr);
    notify(`DELETED BYTE AT ${insDelAddr}H`);
  };

  // 7. Read/Write Port
  const handleReadPort = () => {
    const port = parseInt(portNumHex, 16);
    if (!isNaN(port)) {
      const val = engine.readPort(port);
      setPortValHex(val.toString(16).toUpperCase().padStart(2, '0'));
      notify(`PORT ${portNumHex}H = ${val.toString(16).toUpperCase().padStart(2, '0')}H`);
    }
  };

  const handleWritePort = () => {
    const port = parseInt(portNumHex, 16);
    const val = parseInt(portValHex, 16);
    if (!isNaN(port) && !isNaN(val)) {
      engine.writePort(port, val);
      notify(`WROTE ${portValHex}H TO PORT ${portNumHex}H`);
    }
  };

  // Hex Keypad Press Helper
  const handleHexKey = (digit: string) => {
    playBeep();
    if (activeOp === 'subst') {
      const updated = (inputValueHex + digit).slice(-2);
      setInputValueHex(updated);
      const val = parseInt(updated, 16);
      const addr = parseInt(currentAddrHex, 16);
      if (!isNaN(val) && !isNaN(addr)) {
        engine.writeMemory(addr, val);
        onStateChange();
      }
    } else if (activeOp === 'exam_reg') {
      const isWord = ['PC', 'SP'].includes(selectedReg);
      const maxLen = isWord ? 4 : 2;
      const updated = (inputValueHex + digit).slice(-maxLen);
      handleRegValueChange(updated);
    }
  };

  const pcHexStr = engine.state.pc.toString(16).toUpperCase().padStart(4, '0');
  const currentMemValStr = engine.readMemory(parseInt(currentAddrHex, 16) || 0x2000).toString(16).toUpperCase().padStart(2, '0');

  return (
    <div className="bg-slate-900 border-b border-amber-500/20 text-slate-100 shadow-lg">
      {/* Top Header Bar / Quick Display Strip */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Left: 7-Segment LED Display Simulation */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center gap-1 bg-black px-3 py-1.5 rounded-lg border border-slate-800 shadow-inner ring-1 ring-amber-500/20 font-mono">
            {/* LED Label */}
            <div className="flex flex-col text-[9px] uppercase font-semibold text-amber-500/80 mr-1.5 leading-tight select-none">
              <span>ET-8085</span>
              <span className="text-emerald-400">LED</span>
            </div>

            {/* Address Display (4 Digits) */}
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-slate-500 font-sans tracking-widest uppercase">ADDR / REG</span>
              <span className="text-lg sm:text-xl font-bold tracking-widest text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                {activeOp === 'exam_reg' ? selectedReg.padStart(4, ' ') : (currentAddrHex || pcHexStr)}
              </span>
            </div>

            <div className="text-slate-600 px-1 font-bold text-lg">:</div>

            {/* Data Display (2 Digits) */}
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-slate-500 font-sans tracking-widest uppercase">DATA</span>
              <span className="text-lg sm:text-xl font-bold tracking-widest text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                {activeOp === 'exam_reg' ? getSelectedRegValHex() : (inputValueHex || currentMemValStr)}
              </span>
            </div>
          </div>

          {/* Status Message Line */}
          <div className="hidden sm:flex flex-col justify-center">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Status Console</span>
            <span className="text-xs font-mono text-cyan-400 font-semibold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {statusMsg}
            </span>
          </div>
        </div>

        {/* Middle/Right: Quick Trainer Operations Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full no-scrollbar">
          {/* RESET */}
          <button
            onClick={() => {
              onReset();
              setActiveOp('none');
              notify('RESET 8085 CPU');
            }}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-600/90 hover:bg-red-500 text-white flex items-center gap-1 transition-all active:scale-95 shadow-sm min-h-[38px]"
            title="Reset CPU Registers & Program Counter"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RST</span>
          </button>

          {/* SUBST MEM (SET) */}
          <button
            onClick={() => {
              const nextOp = activeOp === 'subst' ? 'none' : 'subst';
              setActiveOp(nextOp);
              if (nextOp === 'subst') {
                setInputValueHex(currentMemValStr);
                notify('SUBST MEM: Set Address & Modify Bytes');
              }
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 min-h-[38px] ${
              activeOp === 'subst'
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/50 shadow-md font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700'
            }`}
            title="Substitute / Examine RAM Memory Location"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>SET MEM</span>
          </button>

          {/* EXAM REG */}
          <button
            onClick={() => {
              const nextOp = activeOp === 'exam_reg' ? 'none' : 'exam_reg';
              setActiveOp(nextOp);
              if (nextOp === 'exam_reg') {
                notify(`EXAM REG: Modify Register ${selectedReg}`);
              }
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 min-h-[38px] ${
              activeOp === 'exam_reg'
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/50 shadow-md font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700'
            }`}
            title="Examine & Edit 8085 Registers"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>REG</span>
          </button>

          {/* GO / EXECUTE */}
          <button
            onClick={() => {
              onRunToggle();
              notify(isRunning ? 'PAUSED EXECUTION' : `EXEC FROM ${pcHexStr}H`);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 min-h-[38px] ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
            title="Execute Assembly Program"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isRunning ? 'PAUSE' : 'GO'}</span>
          </button>

          {/* STEP */}
          <button
            onClick={() => {
              onSingleStep();
              notify(`STEP EXECUTED -> PC: ${engine.state.pc.toString(16).toUpperCase().padStart(4, '0')}H`);
            }}
            disabled={isRunning || engine.state.isHalted}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 disabled:opacity-40 transition-all active:scale-95 min-h-[38px]"
            title="Single Step Debugger"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>STEP</span>
          </button>

          {/* BLOCK FILL */}
          <button
            onClick={() => {
              setActiveOp(activeOp === 'fill' ? 'none' : 'fill');
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold hidden md:flex items-center gap-1 transition-all active:scale-95 min-h-[38px] ${
              activeOp === 'fill'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="Fill Memory Range with constant Byte"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>FILL</span>
          </button>

          {/* BLOCK MOVE */}
          <button
            onClick={() => {
              setActiveOp(activeOp === 'move' ? 'none' : 'move');
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold hidden md:flex items-center gap-1 transition-all active:scale-95 min-h-[38px] ${
              activeOp === 'move'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="Copy Block of Memory"
          >
            <Copy className="w-3.5 h-3.5 text-blue-400" />
            <span>MOVE</span>
          </button>

          {/* KEYPAD OVERLAY TOGGLE FOR ANDROID MOBILE */}
          <button
            onClick={() => setShowKeypadOverlay(!showKeypadOverlay)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 flex items-center gap-1 transition-all active:scale-95 min-h-[38px]"
            title="Toggle On-Screen Hex Keypad"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">KEYPAD</span>
          </button>

          {/* EXPAND / COLLAPSE PANEL */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
            title={isExpanded ? 'Collapse Kit Details' : 'Expand Digital Kit Operations'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Interactive Operation Bar / Controls */}
      {isExpanded && activeOp !== 'none' && (
        <div className="bg-slate-950 border-t border-slate-800 px-4 py-3 transition-all animate-fadeIn">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* SUBST MEM OPERATIONAL CONTROLS */}
            {activeOp === 'subst' && (
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono font-medium">Memory Address:</span>
                  <input
                    type="text"
                    maxLength={4}
                    value={currentAddrHex}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setCurrentAddrHex(val);
                      const addr = parseInt(val, 16);
                      if (!isNaN(addr)) {
                        setInputValueHex(engine.readMemory(addr).toString(16).toUpperCase().padStart(2, '0'));
                      }
                    }}
                    className="w-20 bg-slate-900 border border-amber-500/40 rounded px-2 py-1 font-mono text-amber-400 font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="2000"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono font-medium">Data Byte (Hex):</span>
                  <input
                    type="text"
                    maxLength={2}
                    value={inputValueHex}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setInputValueHex(val);
                      const byteVal = parseInt(val, 16);
                      const addr = parseInt(currentAddrHex, 16);
                      if (!isNaN(byteVal) && !isNaN(addr)) {
                        engine.writeMemory(addr, byteVal);
                        onStateChange();
                      }
                    }}
                    className="w-16 bg-slate-900 border border-emerald-500/40 rounded px-2 py-1 font-mono text-emerald-400 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="00"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleMemoryNext}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded flex items-center gap-1 transition-all"
                  >
                    <span>NEXT (+)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleMemoryPrev}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded flex items-center gap-1 transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>PREV (-)</span>
                  </button>
                </div>
              </div>
            )}

            {/* EXAM REG OPERATIONAL CONTROLS */}
            {activeOp === 'exam_reg' && (
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono font-medium">Select Register:</span>
                  <select
                    value={selectedReg}
                    onChange={(e) => {
                      setSelectedReg(e.target.value);
                      const val = engine.getRegister(e.target.value);
                      const width = ['PC', 'SP'].includes(e.target.value) ? 4 : 2;
                      setInputValueHex(val.toString(16).toUpperCase().padStart(width, '0'));
                    }}
                    className="bg-slate-900 border border-cyan-500/40 rounded px-2 py-1 font-mono text-cyan-400 font-bold focus:outline-none"
                  >
                    {['A', 'B', 'C', 'D', 'E', 'H', 'L', 'PC', 'SP'].map((r) => (
                      <option key={r} value={r}>
                        Register {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono font-medium">Value (Hex):</span>
                  <input
                    type="text"
                    maxLength={['PC', 'SP'].includes(selectedReg) ? 4 : 2}
                    value={inputValueHex}
                    onChange={(e) => handleRegValueChange(e.target.value.toUpperCase())}
                    className="w-20 bg-slate-900 border border-amber-500/40 rounded px-2 py-1 font-mono text-amber-400 font-bold focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* BLOCK FILL CONTROLS */}
            {activeOp === 'fill' && (
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <span className="text-purple-400 font-semibold font-mono">Block Fill RAM:</span>
                <input
                  type="text"
                  maxLength={4}
                  value={fillStart}
                  onChange={(e) => setFillStart(e.target.value.toUpperCase())}
                  className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-amber-400 text-center"
                  placeholder="Start"
                />
                <span className="text-slate-500">to</span>
                <input
                  type="text"
                  maxLength={4}
                  value={fillEnd}
                  onChange={(e) => setFillEnd(e.target.value.toUpperCase())}
                  className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-amber-400 text-center"
                  placeholder="End"
                />
                <span className="text-slate-500">Value:</span>
                <input
                  type="text"
                  maxLength={2}
                  value={fillData}
                  onChange={(e) => setFillData(e.target.value.toUpperCase())}
                  className="w-12 bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-emerald-400 text-center"
                  placeholder="00"
                />
                <button
                  onClick={handleExecuteFill}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded transition-all"
                >
                  Fill Block
                </button>
              </div>
            )}

            {/* BLOCK MOVE CONTROLS */}
            {activeOp === 'move' && (
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <span className="text-blue-400 font-semibold font-mono">Block Move RAM:</span>
                <input
                  type="text"
                  maxLength={4}
                  value={moveStart}
                  onChange={(e) => setMoveStart(e.target.value.toUpperCase())}
                  className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-amber-400 text-center"
                  placeholder="Src Start"
                />
                <span className="text-slate-500">to</span>
                <input
                  type="text"
                  maxLength={4}
                  value={moveEnd}
                  onChange={(e) => setMoveEnd(e.target.value.toUpperCase())}
                  className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-amber-400 text-center"
                  placeholder="Src End"
                />
                <span className="text-slate-500">Dest Addr:</span>
                <input
                  type="text"
                  maxLength={4}
                  value={moveDest}
                  onChange={(e) => setMoveDest(e.target.value.toUpperCase())}
                  className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-cyan-400 text-center"
                  placeholder="Dest"
                />
                <button
                  onClick={handleExecuteMove}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded transition-all"
                >
                  Move Block
                </button>
              </div>
            )}

            {/* CLOSE PANEL BUTTON */}
            <button
              onClick={() => setActiveOp('none')}
              className="text-slate-500 hover:text-slate-300 p-1"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Touch Hex Keypad Drawer / Overlay for Android Phones */}
      {showKeypadOverlay && (
        <div className="bg-slate-950 border-t border-amber-500/30 p-3 shadow-2xl">
          <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                ET-8085 Touch Hex Keypad
              </span>
              <button
                onClick={() => setShowKeypadOverlay(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-0.5 bg-slate-800 rounded"
              >
                Close Keypad
              </button>
            </div>

            {/* Keypad Grid 0-F and Function Keys */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'].map((k) => (
                <button
                  key={k}
                  onClick={() => handleHexKey(k)}
                  className="h-10 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-100 font-mono text-base font-bold transition-all active:scale-90 border border-slate-700/80 shadow"
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Keypad Row 2: Control Keys */}
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              <button
                onClick={handleMemoryNext}
                className="h-9 rounded bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold transition-all active:scale-90"
              >
                NEXT (+)
              </button>
              <button
                onClick={handleMemoryPrev}
                className="h-9 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 font-mono text-xs font-bold transition-all active:scale-90"
              >
                PREV (-)
              </button>
              <button
                onClick={() => {
                  onSingleStep();
                  notify('STEP');
                }}
                className="h-9 rounded bg-cyan-700 hover:bg-cyan-600 text-white font-mono text-xs font-bold transition-all active:scale-90"
              >
                STEP
              </button>
              <button
                onClick={() => {
                  onRunToggle();
                  notify(isRunning ? 'PAUSED' : 'EXEC');
                }}
                className="h-9 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all active:scale-90"
              >
                GO / EXEC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
