import React from 'react';
import { Engine8085 } from '../lib/8085Engine';
import { AssemblyResult } from '../types';
import { GitCommit, ArrowDown, CornerDownRight, CheckCircle } from 'lucide-react';

interface FlowchartViewProps {
  engine: Engine8085;
  assemblyResult: AssemblyResult | null;
  code: string;
}

export const FlowchartView: React.FC<FlowchartViewProps> = ({ engine, assemblyResult, code }) => {
  const currentPC = engine.state.pc;

  const instructions = assemblyResult?.instructions || [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <GitCommit className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-slate-100 text-base font-mono">
            Automatic Assembly Program Flowchart
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
          PC: <strong className="text-amber-400">{currentPC.toString(16).toUpperCase()}H</strong>
        </span>
      </div>

      {instructions.length === 0 ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs italic">
          Assemble code in the Assembly Editor to view the generated Flowchart diagram.
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-3 font-mono text-xs py-4">
          {/* Start Node */}
          <div className="px-6 py-2 bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 rounded-full font-bold shadow-md">
            START (ORG {instructions[0]?.address.toString(16).toUpperCase()}H)
          </div>

          <ArrowDown className="w-4 h-4 text-slate-600" />

          {/* Render Flowchart nodes per instruction */}
          {instructions.map((inst, idx) => {
            const isPC = currentPC === inst.address;
            const isJump = ['JMP', 'JC', 'JNC', 'JZ', 'JNZ', 'CALL', 'RET'].some((k) =>
              inst.mnemonic.toUpperCase().startsWith(k)
            );
            const isHlt = inst.mnemonic.toUpperCase().startsWith('HLT');

            return (
              <React.Fragment key={inst.address}>
                {isHlt ? (
                  <div
                    className={`px-6 py-2.5 rounded-full font-bold text-center border shadow-md transition-all ${
                      isPC
                        ? 'bg-red-500 text-white border-red-300 ring-2 ring-red-400 animate-pulse'
                        : 'bg-red-950/40 text-red-400 border-red-800/60'
                    }`}
                  >
                    END (HLT - Stop Microprocessor)
                  </div>
                ) : isJump ? (
                  /* Decision Diamond / Jump Node */
                  <div
                    className={`p-4 rounded-2xl border text-center max-w-sm w-full transition-all relative ${
                      isPC
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/40 shadow-lg'
                        : 'bg-purple-950/30 border-purple-800/60 text-purple-200'
                    }`}
                  >
                    <div className="text-[10px] text-purple-400 uppercase font-bold tracking-wider mb-1">
                      Conditional Jump / Branch
                    </div>
                    <div className="font-bold text-sm text-slate-100">{inst.mnemonic}</div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-center gap-1">
                      <CornerDownRight className="w-3 h-3 text-purple-400" />
                      <span>If Condition Met → Jump Target</span>
                    </div>
                  </div>
                ) : (
                  /* Standard Instruction Process Box */
                  <div
                    className={`p-3 rounded-xl border max-w-sm w-full transition-all text-center ${
                      isPC
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/40 shadow-lg font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="text-[10px] text-slate-500 mb-0.5">
                      [{inst.address.toString(16).toUpperCase()}H] Line {inst.lineNumber}
                    </div>
                    <div className="font-bold text-xs">{inst.mnemonic}</div>
                  </div>
                )}

                {idx < instructions.length - 1 && !isHlt && (
                  <ArrowDown className="w-4 h-4 text-slate-600" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};
