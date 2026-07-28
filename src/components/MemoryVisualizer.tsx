import React, { useState } from 'react';
import { Engine8085 } from '../lib/8085Engine';
import { Grid, BarChart3, Flame, Search, Edit3, ArrowRight, Check, RefreshCw } from 'lucide-react';

interface MemoryVisualizerProps {
  engine: Engine8085;
  onStateChange: () => void;
}

type VisMode = 'hex' | 'chart' | 'heatmap';

export const MemoryVisualizer: React.FC<MemoryVisualizerProps> = ({ engine, onStateChange }) => {
  const [visMode, setVisMode] = useState<VisMode>('hex');
  const [searchAddr, setSearchAddr] = useState<string>('2050');
  const [editingAddr, setEditingAddr] = useState<number | null>(null);
  const [editByteVal, setEditByteVal] = useState<string>('');

  const targetAddrNum = (parseInt(searchAddr, 16) || 0x2050) & 0xfff0; // Align to 16 bytes boundary
  const displayRowsCount = 16; // Display 256 bytes (16 rows x 16 cols)

  const hex4 = (v: number) => v.toString(16).toUpperCase().padStart(4, '0');
  const hex2 = (v: number) => v.toString(16).toUpperCase().padStart(2, '0');

  const startByteEdit = (addr: number) => {
    setEditingAddr(addr);
    setEditByteVal(hex2(engine.readMemory(addr)));
  };

  const saveByteEdit = (addr: number) => {
    const val = parseInt(editByteVal, 16);
    if (!isNaN(val)) {
      engine.writeMemory(addr, val);
      onStateChange();
    }
    setEditingAddr(null);
  };

  // Generate 256-byte window around search address
  const bytesWindow: { addr: number; val: number }[] = [];
  for (let i = 0; i < displayRowsCount * 16; i++) {
    const addr = (targetAddrNum + i) & 0xffff;
    bytesWindow.push({ addr, val: engine.readMemory(addr) });
  }

  // Preset Address Shortcuts
  const shortcuts = [
    { label: 'User Code (2000H)', addr: '2000' },
    { label: 'Input Data (2050H)', addr: '2050' },
    { label: 'Output Memory (2070H)', addr: '2070' },
    { label: 'Stack Area (3000H)', addr: '3000' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-slate-100 font-mono text-sm">Live Memory Visualizer (64KB RAM)</h3>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400">Address:</span>
            <input
              type="text"
              value={searchAddr}
              onChange={(e) => setSearchAddr(e.target.value)}
              className="w-16 bg-slate-950 border border-slate-700 text-amber-400 font-mono px-1.5 py-0.5 rounded text-center focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="2050"
            />
            <span className="text-slate-400">H</span>
          </div>
        </div>

        {/* View Style Switcher Buttons */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setVisMode('hex')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              visMode === 'hex'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Hex Grid View</span>
          </button>

          <button
            onClick={() => setVisMode('chart')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              visMode === 'chart'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Bar Chart</span>
          </button>

          <button
            onClick={() => setVisMode('heatmap')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              visMode === 'heatmap'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Heatmap</span>
          </button>
        </div>
      </div>

      {/* Preset Jump Shortcuts */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
        <span className="text-slate-500 text-[10px] uppercase">Quick Jump:</span>
        {shortcuts.map((sc) => (
          <button
            key={sc.addr}
            onClick={() => setSearchAddr(sc.addr)}
            className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-amber-300 rounded-lg border border-slate-800 text-xs transition-colors"
          >
            {sc.label}
          </button>
        ))}
      </div>

      {/* View Mode 1: HEX GRID VIEW */}
      {visMode === 'hex' && (
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800">
                <th className="py-2 text-left font-normal text-amber-500/80">Addr (Hex)</th>
                {Array.from({ length: 16 }).map((_, col) => (
                  <th key={col} className="py-2 w-8 font-normal">
                    +{col.toString(16).toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60">
              {Array.from({ length: displayRowsCount }).map((_, rowIdx) => {
                const rowAddr = targetAddrNum + rowIdx * 16;
                return (
                  <tr key={rowIdx} className="hover:bg-slate-900/40">
                    <td className="py-1.5 text-left font-bold text-slate-400">
                      {hex4(rowAddr)}H
                    </td>
                    {Array.from({ length: 16 }).map((_, colIdx) => {
                      const addr = rowAddr + colIdx;
                      const val = engine.readMemory(addr);
                      const isModified = engine.modifiedMemoryAddresses.has(addr);
                      const isHL = engine.getHL() === addr;
                      const isPC = engine.state.pc === addr;
                      const isEditing = editingAddr === addr;

                      return (
                        <td key={colIdx} className="py-1.5 px-0.5">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editByteVal}
                              onChange={(e) => setEditByteVal(e.target.value)}
                              onBlur={() => saveByteEdit(addr)}
                              onKeyDown={(e) => e.key === 'Enter' && saveByteEdit(addr)}
                              className="w-7 bg-amber-500 text-slate-950 font-bold text-center text-xs rounded focus:outline-none"
                              autoFocus
                            />
                          ) : (
                            <span
                              onClick={() => startByteEdit(addr)}
                              title={`Address: ${hex4(addr)}H | Dec: ${val} | Click to edit`}
                              className={`cursor-pointer inline-block w-7 py-0.5 rounded font-mono font-bold transition-all ${
                                isPC
                                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                                  : isHL
                                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50'
                                  : isModified
                                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                  : val > 0
                                  ? 'text-slate-200 hover:bg-slate-800'
                                  : 'text-slate-600 hover:text-slate-300'
                              }`}
                            >
                              {hex2(val)}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* View Mode 2: BAR CHART VIEW */}
      {visMode === 'chart' && (
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-3 font-mono">
          <div className="text-xs text-slate-400 flex items-center justify-between border-b border-slate-800 pb-2">
            <span>Memory Bar Chart ({hex4(targetAddrNum)}H - {hex4(targetAddrNum + 31)}H)</span>
            <span className="text-amber-400">Bars height = Byte value (0-255)</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-1.5 pt-4 px-2 bg-slate-900/50 rounded-lg border border-slate-800">
            {bytesWindow.slice(0, 32).map(({ addr, val }) => {
              const heightPct = Math.max(4, Math.round((val / 255) * 100));
              const isModified = engine.modifiedMemoryAddresses.has(addr);

              return (
                <div
                  key={addr}
                  onClick={() => startByteEdit(addr)}
                  className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                  title={`Address: ${hex4(addr)}H | Val: ${hex2(val)}H (${val} Dec)`}
                >
                  <span className="text-[10px] text-amber-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {hex2(val)}
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t transition-all ${
                      isModified
                        ? 'bg-gradient-to-t from-orange-600 to-amber-400 shadow-[0_0_10px_rgba(249,115,22,0.4)]'
                        : val > 0
                        ? 'bg-gradient-to-t from-emerald-600 to-cyan-400'
                        : 'bg-slate-800'
                    }`}
                  />
                  <span className="text-[9px] text-slate-500 font-mono scale-90">
                    {hex2(addr & 0xff)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View Mode 3: HEATMAP VIEW */}
      {visMode === 'heatmap' && (
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-4 font-mono">
          <div className="text-xs text-slate-400 flex items-center justify-between border-b border-slate-800 pb-2">
            <span>Memory Heatmap Intensity ({hex4(targetAddrNum)}H - {hex4(targetAddrNum + 255)}H)</span>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-3 h-3 rounded bg-slate-900 border border-slate-800 inline-block" /> 00H
              <span className="w-3 h-3 rounded bg-emerald-600 inline-block" /> Low
              <span className="w-3 h-3 rounded bg-amber-500 inline-block" /> Medium
              <span className="w-3 h-3 rounded bg-red-500 inline-block" /> High
            </div>
          </div>

          <div className="grid grid-cols-16 gap-1.5 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
            {bytesWindow.map(({ addr, val }) => {
              let bgClass = 'bg-slate-900 text-slate-700';
              if (val > 200) bgClass = 'bg-red-600 text-white font-bold shadow-[0_0_8px_rgba(220,38,38,0.5)]';
              else if (val > 100) bgClass = 'bg-amber-500 text-slate-950 font-bold';
              else if (val > 0) bgClass = 'bg-emerald-600 text-white';

              return (
                <div
                  key={addr}
                  onClick={() => startByteEdit(addr)}
                  title={`Addr: ${hex4(addr)}H | Byte: ${hex2(val)}H`}
                  className={`h-8 rounded flex items-center justify-center text-[10px] cursor-pointer hover:scale-110 transition-all ${bgClass}`}
                >
                  {hex2(val)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
