import React, { useState } from 'react';
import { OPCODES_DATA } from '../lib/opcodesData';
import { Search, BookOpen, Layers, Zap } from 'lucide-react';

export const MnemonicReference: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Data Transfer', 'Arithmetic', 'Logical', 'Branching', 'Control'];

  const filteredOpcodes = OPCODES_DATA.filter((op) => {
    const matchesSearch =
      op.mnemonic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.hex.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCategory === 'All' || op.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-5">
      {/* Search Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-slate-100 font-mono text-base">
              8085 Mnemonics & Opcode Reference Handbook
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {filteredOpcodes.length} Opcodes Found
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search mnemonics (e.g. MOV, MVI, LXI, ADD, JMP)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Opcodes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOpcodes.map((op, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2 hover:border-slate-700 transition-all font-mono shadow-md"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="font-bold text-amber-400 text-sm">{op.mnemonic}</span>
              <span className="px-2 py-0.5 rounded bg-slate-950 text-cyan-400 text-xs border border-slate-800 font-bold">
                Opcode: {op.hex}H
              </span>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {op.description}
            </p>

            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-400 border-t border-slate-800/60">
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Size</span>
                <strong className="text-slate-200">{op.bytes} Byte{op.bytes > 1 ? 's' : ''}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">T-States</span>
                <strong className="text-slate-200">{op.tStates}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Flags</span>
                <strong className="text-emerald-400">{op.flagsAffected}</strong>
              </div>
            </div>

            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Example:</span>
              <code className="text-amber-300 font-bold">{op.example}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
