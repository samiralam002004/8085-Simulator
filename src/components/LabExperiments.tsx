import React, { useState } from 'react';
import { LAB_EXPERIMENTS } from '../lib/labExperimentsData';
import { LabExperiment } from '../types';
import { BookOpen, Play, Calculator, CheckCircle2, ChevronRight, FileText, Cpu, ArrowRight } from 'lucide-react';

interface LabExperimentsProps {
  onLoadCodeToEditor: (code: string) => void;
  onLoadToTrainerKit: (lab: LabExperiment) => void;
}

export const LabExperiments: React.FC<LabExperimentsProps> = ({
  onLoadCodeToEditor,
  onLoadToTrainerKit,
}) => {
  const [selectedLab, setSelectedLab] = useState<LabExperiment>(LAB_EXPERIMENTS[0]);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 font-mono">
              8085 Microprocessor Digital Lab Manual
            </h2>
            <p className="text-xs text-slate-400">
              Complete university syllabus experiments with assembly code, memory maps, algorithms, & ET-8085 keypad sheets.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Lab Experiments Selection List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
            Experiments List ({LAB_EXPERIMENTS.length})
          </div>

          <div className="space-y-2">
            {LAB_EXPERIMENTS.map((lab, index) => {
              const isSelected = selectedLab.id === lab.id;

              return (
                <button
                  key={lab.id}
                  onClick={() => setSelectedLab(lab)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 ring-1 ring-amber-500/30 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-400">
                        Lab {index + 1}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{lab.level}</span>
                    </div>
                    <div className="font-bold text-xs text-slate-100">{lab.title}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 mt-2 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Selected Lab Detailed View */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 shadow-xl">
          {/* Title & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase font-semibold">
                {selectedLab.category}
              </span>
              <h3 className="text-xl font-bold text-slate-100 font-mono mt-0.5">
                {selectedLab.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onLoadCodeToEditor(selectedLab.code)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Load in Assembly Editor</span>
              </button>

              <button
                onClick={() => onLoadToTrainerKit(selectedLab)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span>Load Data to Trainer Kit</span>
              </button>
            </div>
          </div>

          {/* Objective */}
          <div className="space-y-1.5 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase">Objective:</span>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {selectedLab.objective}
            </p>
          </div>

          {/* Theory */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Theory & Working Principle:</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedLab.theory}
            </p>
          </div>

          {/* Input & Output Memory Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
              <span className="font-bold text-amber-400 block border-b border-slate-800 pb-1.5">
                Input Memory Setup:
              </span>
              {selectedLab.inputMemory.map((mem) => (
                <div key={mem.address} className="flex items-center justify-between text-slate-300">
                  <span>{mem.address}H ({mem.label}):</span>
                  <strong className="text-amber-400">{mem.defaultValue}H</strong>
                </div>
              ))}
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
              <span className="font-bold text-emerald-400 block border-b border-slate-800 pb-1.5">
                Expected Output Memory:
              </span>
              {selectedLab.expectedOutputMemory.map((mem) => (
                <div key={mem.address} className="flex items-center justify-between text-slate-300">
                  <span>{mem.address}H ({mem.label}):</span>
                  <span className="text-slate-400">{mem.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assembly Code Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-400 uppercase">8085 Assembly Source Code:</span>
              <span className="text-slate-500">ORG {selectedLab.startAddress}H</span>
            </div>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-amber-300 font-mono text-xs leading-relaxed overflow-x-auto">
              {selectedLab.code}
            </pre>
          </div>

          {/* ET-8085 Keypad Sheet Guide */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <span className="font-bold text-amber-400 block border-b border-slate-800 pb-2">
              ET-8085 Keypad Procedure Sheet (Lab Exam Steps):
            </span>
            <div className="space-y-2">
              {selectedLab.trainerKitKeypadSteps.map((s) => (
                <div key={s.step} className="flex items-start gap-2 text-slate-300 text-[11px]">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold shrink-0">
                    Step {s.step}
                  </span>
                  <div>
                    <strong className="text-slate-100">{s.action}</strong>
                    <span className="text-slate-400 ml-2">({s.note})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
