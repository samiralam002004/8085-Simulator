import React from 'react';
import { Engine8085 } from '../lib/8085Engine';
import { AssemblyResult } from '../types';
import { ArrowRight, Binary } from 'lucide-react';

interface OpcodeTableProps {
  engine: Engine8085;
  assemblyResult: AssemblyResult | null;
}

export const OpcodeTable: React.FC<OpcodeTableProps> = ({ engine, assemblyResult }) => {
  const currentPC = engine.state.pc;

  const hex4 = (v: number) => v.toString(16).toUpperCase().padStart(4, '0');
  const hex2 = (v: number) => v.toString(16).toUpperCase().padStart(2, '0');

  // Generate list of instructions starting from start address
  const instructions = assemblyResult?.instructions || [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col h-full">
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Binary className="w-4 h-4 text-amber-400" />
          <span className="font-mono text-sm font-bold text-slate-200">
            Live Disassembly & Opcode Table
          </span>
        </div>
        <span className="text-xs font-mono text-slate-500">
          PC: <strong className="text-amber-400">{hex4(currentPC)}H</strong>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[380px] font-mono text-xs">
        {instructions.length === 0 ? (
          <div className="p-8 text-center text-slate-500 italic">
            Assemble a program in the Editor to view live machine opcodes and instruction mapping.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950/80 text-slate-400 sticky top-0 border-b border-slate-800">
              <tr>
                <th className="py-2 px-3">State</th>
                <th className="py-2 px-3">Address</th>
                <th className="py-2 px-3">Opcode Bytes</th>
                <th className="py-2 px-3">Bytes</th>
                <th className="py-2 px-3">Instruction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              {instructions.map((inst) => {
                const isExecuting = currentPC === inst.address;
                const isBreakpoint = engine.breakpoints.has(inst.address);

                return (
                  <tr
                    key={inst.address}
                    className={`transition-colors ${
                      isExecuting
                        ? 'bg-amber-500/15 text-amber-200 font-bold border-l-4 border-amber-400'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-2 px-3">
                      {isExecuting ? (
                        <span className="flex items-center gap-1 text-amber-400 font-bold animate-pulse">
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span>PC</span>
                        </span>
                      ) : isBreakpoint ? (
                        <span className="w-2 h-2 rounded-full bg-red-500 inline-block" title="Breakpoint" />
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>

                    <td className="py-2 px-3 font-bold text-slate-400">
                      {hex4(inst.address)}H
                    </td>

                    <td className="py-2 px-3 text-cyan-400">
                      {inst.bytes.map((b) => hex2(b)).join(' ')}
                    </td>

                    <td className="py-2 px-3 text-slate-500">
                      {inst.bytes.length} Byte{inst.bytes.length > 1 ? 's' : ''}
                    </td>

                    <td className="py-2 px-3 font-bold text-slate-100">
                      {inst.mnemonic}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
