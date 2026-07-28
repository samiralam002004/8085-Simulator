import React, { useState } from 'react';
import { Engine8085 } from '../lib/8085Engine';
import { AssemblyResult } from '../types';
import { Play, Check, AlertTriangle, Code, Download, Upload, Copy, Sparkles, HelpCircle } from 'lucide-react';

interface CodeEditorProps {
  engine: Engine8085;
  code: string;
  setCode: (code: string) => void;
  startAddress: string;
  setStartAddress: (addr: string) => void;
  onAssemble: (result: AssemblyResult) => void;
  assemblyResult: AssemblyResult | null;
  onRunToggle: () => void;
  isRunning: boolean;
  onAskAI: (code: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  engine,
  code,
  setCode,
  startAddress,
  setStartAddress,
  onAssemble,
  assemblyResult,
  onRunToggle,
  isRunning,
  onAskAI,
}) => {
  const [copied, setCopied] = useState(false);

  const lines = code.split('\n');

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleAssemble = () => {
    const addr = parseInt(startAddress, 16) || 0x2000;
    const res = engine.assemble(code, addr);
    onAssemble(res);
  };

  const toggleBreakpoint = (lineNum: number) => {
    // Breakpoints logic
    if (assemblyResult) {
      const inst = assemblyResult.instructions.find((i) => i.lineNumber === lineNum);
      if (inst) {
        if (engine.breakpoints.has(inst.address)) {
          engine.breakpoints.delete(inst.address);
        } else {
          engine.breakpoints.add(inst.address);
        }
      }
    }
  };

  const insertMnemonic = (snippet: string) => {
    setCode((prev) => prev + (prev.endsWith('\n') || prev === '' ? '' : '\n') + snippet);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Editor Header Bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-sm font-bold text-slate-200">8085 Assembly Code Editor</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <span>Org Addr:</span>
            <input
              type="text"
              value={startAddress}
              onChange={(e) => setStartAddress(e.target.value)}
              className="w-14 bg-slate-950 border border-slate-700 text-amber-400 font-mono px-1 py-0.5 rounded text-center focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="2000"
            />
            <span>H</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyCode}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onAskAI(code)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 text-xs font-medium flex items-center gap-1.5 transition-all"
            title="Explain code using AI Tutor"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask AI Tutor</span>
          </button>

          <button
            onClick={handleAssemble}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Assemble Code</span>
          </button>
        </div>
      </div>

      {/* Common Mnemonics Helper Toolbar */}
      <div className="bg-slate-950/60 px-3 py-2 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider whitespace-nowrap pr-1">
          Quick Mnemonics:
        </span>
        {[
          'MVI A, 05H',
          'MVI B, 0AH',
          'MOV A, B',
          'LXI H, 2050H',
          'ADD B',
          'SUB C',
          'INR A',
          'DCR B',
          'LDA 2050H',
          'STA 2052H',
          'JMP 2000H',
          'HLT',
        ].map((item) => (
          <button
            key={item}
            onClick={() => insertMnemonic(item)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 hover:text-amber-300 text-slate-300 font-mono rounded text-[11px] whitespace-nowrap border border-slate-700/60 transition-colors"
          >
            + {item}
          </button>
        ))}
      </div>

      {/* Code Textarea & Line Numbers Container */}
      <div className="relative flex-1 min-h-[360px] font-mono text-sm flex">
        {/* Line Numbers Sidebar */}
        <div className="w-12 bg-slate-950 text-slate-600 py-3 select-none text-right pr-3 space-y-1 font-mono text-xs border-r border-slate-800/80">
          {lines.map((_, i) => {
            const lineNum = i + 1;
            const inst = assemblyResult?.instructions.find((ins) => ins.lineNumber === lineNum);
            const isBreakpoint = inst && engine.breakpoints.has(inst.address);
            const isPC = inst && engine.state.pc === inst.address;

            return (
              <div
                key={i}
                onClick={() => toggleBreakpoint(lineNum)}
                className={`cursor-pointer hover:text-slate-300 flex items-center justify-end gap-1 ${
                  isPC ? 'text-amber-400 font-bold' : ''
                }`}
              >
                {isBreakpoint && <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />}
                <span>{lineNum}</span>
              </div>
            );
          })}
        </div>

        {/* Text Area Code Input */}
        <textarea
          value={code}
          onChange={handleCodeChange}
          placeholder="; Enter 8085 Assembly Code Here...&#10;LXI H, 2050H&#10;MOV A, M&#10;ADD B&#10;STA 2052H&#10;HLT"
          className="w-full h-full p-3 bg-slate-900 text-slate-100 placeholder-slate-600 resize-none focus:outline-none font-mono text-xs sm:text-sm leading-relaxed tracking-wide"
          spellCheck={false}
        />
      </div>

      {/* Assembly Errors or Success Panel */}
      {assemblyResult && (
        <div className="border-t border-slate-800 bg-slate-950 p-3 text-xs font-mono">
          {assemblyResult.success ? (
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Check className="w-4 h-4" />
              <span>Assembled successfully! ({assemblyResult.instructions.length} instructions translated into RAM).</span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Assembly Failed ({assemblyResult.errors.length} Syntax Errors):</span>
              </div>
              {assemblyResult.errors.map((err, idx) => (
                <div key={idx} className="text-red-300 pl-6 text-[11px]">
                  Line {err.line}: {err.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
