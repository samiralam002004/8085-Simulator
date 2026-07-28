import React, { useState } from 'react';
import { Engine8085 } from '../lib/8085Engine';
import { CPUState, Flags } from '../types';
import { Cpu, Edit2, Check, X } from 'lucide-react';

interface RegisterViewProps {
  engine: Engine8085;
  onStateChange: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ engine, onStateChange }) => {
  const [editingReg, setEditingReg] = useState<string | null>(null);
  const [editVal, setEditVal] = useState<string>('');

  const state = engine.state;

  const hex2 = (v: number) => (v & 0xff).toString(16).toUpperCase().padStart(2, '0');
  const hex4 = (v: number) => (v & 0xffff).toString(16).toUpperCase().padStart(4, '0');
  const bin8 = (v: number) => (v & 0xff).toString(2).padStart(8, '0');

  const startEdit = (regName: string, currentHex: string) => {
    setEditingReg(regName);
    setEditVal(currentHex);
  };

  const saveEdit = (regName: string) => {
    const val = parseInt(editVal, 16);
    if (!isNaN(val)) {
      switch (regName) {
        case 'A': engine.state.a = val & 0xff; break;
        case 'B': engine.state.b = val & 0xff; break;
        case 'C': engine.state.c = val & 0xff; break;
        case 'D': engine.state.d = val & 0xff; break;
        case 'E': engine.state.e = val & 0xff; break;
        case 'H': engine.state.h = val & 0xff; break;
        case 'L': engine.state.l = val & 0xff; break;
        case 'M': engine.setM(val & 0xff); break;
        case 'PC': engine.state.pc = val & 0xffff; break;
        case 'SP': engine.state.sp = val & 0xffff; break;
      }
      onStateChange();
    }
    setEditingReg(null);
  };

  // Helper render for 8-bit register card
  const renderRegCard = (name: string, val: number, isPairHighlight: boolean = false) => {
    const hex = hex2(val);
    const dec = val;
    const bin = bin8(val);
    const isEditing = editingReg === name;

    return (
      <div
        className={`bg-slate-900 border ${
          isPairHighlight ? 'border-amber-500/40 bg-amber-950/10' : 'border-slate-800'
        } p-3 rounded-xl space-y-2 relative group hover:border-slate-700 transition-all`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-400">{name} Reg</span>
          <button
            onClick={() => startEdit(name, hex)}
            className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-amber-400 transition-opacity"
            title="Edit Register Value"
          >
            <Edit2 className="w-3 h-3" />
          </button>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={editVal}
              onChange={(e) => setEditVal(e.target.value)}
              className="w-16 bg-slate-950 border border-amber-500 font-mono text-amber-400 text-sm px-1.5 py-0.5 rounded focus:outline-none"
              autoFocus
            />
            <button onClick={() => saveEdit(name)} className="text-emerald-400 p-1">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setEditingReg(null)} className="text-slate-500 p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-black text-amber-400 tracking-wider">
              {hex}<span className="text-xs text-slate-500 font-normal">H</span>
            </span>
            <span className="font-mono text-xs text-slate-400">({dec})</span>
          </div>
        )}

        {/* Binary Bits Visualizer */}
        <div className="flex items-center justify-between gap-0.5 text-[9px] font-mono pt-1">
          {bin.split('').map((bit, idx) => (
            <span
              key={idx}
              className={`w-3.5 h-4 flex items-center justify-center rounded ${
                bit === '1'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                  : 'bg-slate-950 text-slate-600'
              }`}
            >
              {bit}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 8085 Flags Status Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>8085 CPU Flags Register (PSW)</span>
          </div>
          <span className="text-[10px] text-slate-500">S | Z | 0 | AC | 0 | P | 1 | CY</span>
        </div>

        <div className="grid grid-cols-5 gap-2 pt-1 font-mono text-xs">
          {[
            { key: 'S', label: 'Sign (S)', val: state.flags.S, desc: 'Set if Bit 7 is 1 (Negative)' },
            { key: 'Z', label: 'Zero (Z)', val: state.flags.Z, desc: 'Set if Result is 00H' },
            { key: 'AC', label: 'Aux Carry (AC)', val: state.flags.AC, desc: 'Set if Carry from bit 3 to bit 4' },
            { key: 'P', label: 'Parity (P)', val: state.flags.P, desc: 'Set if Even Parity (even 1s)' },
            { key: 'CY', label: 'Carry (CY)', val: state.flags.CY, desc: 'Set if Carry / Borrow out' },
          ].map((flag) => (
            <div
              key={flag.key}
              title={flag.desc}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                flag.val
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 ring-1 ring-emerald-500/20'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <span
                  className={`w-2 h-2 rounded-full ${
                    flag.val ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'
                  }`}
                />
                <span>{flag.label}</span>
              </div>
              <span className="text-sm font-black mt-0.5">{flag.val ? '1' : '0'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* General Purpose Registers Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {renderRegCard('A', state.a, true)}
        {renderRegCard('B', state.b)}
        {renderRegCard('C', state.c)}
        {renderRegCard('D', state.d)}
        {renderRegCard('E', state.e)}
        {renderRegCard('H', state.h, true)}
        {renderRegCard('L', state.l, true)}
        {renderRegCard('M', engine.getM(), true)}
      </div>

      {/* 16-Bit Registers Pointer Bar (PC & SP) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-mono font-bold text-slate-400">Program Counter (PC)</div>
            <div className="text-[11px] text-slate-500 font-mono">Address of Next Instruction</div>
          </div>
          <div className="font-mono text-2xl font-black text-amber-400">
            {hex4(state.pc)}<span className="text-xs text-slate-500 font-normal">H</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-mono font-bold text-slate-400">Stack Pointer (SP)</div>
            <div className="text-[11px] text-slate-500 font-mono">Top of Subroutine Stack</div>
          </div>
          <div className="font-mono text-2xl font-black text-cyan-400">
            {hex4(state.sp)}<span className="text-xs text-slate-500 font-normal">H</span>
          </div>
        </div>
      </div>
    </div>
  );
};
