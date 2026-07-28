import React, { useState } from 'react';
import { OPCODES_DATA } from '../lib/opcodesData';
import { Search, BookOpen, LayoutGrid, List } from 'lucide-react';

export const MnemonicReference: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewStyle, setViewStyle] = useState<'list' | 'grid'>('list');

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
    <div className="max-w-4xl mx-auto p-3 sm:p-4 space-y-4 font-sans text-slate-100">
      {/* Header Banner */}
      <div className="text-center space-y-1 pb-2 border-b border-slate-800">
        <h2 className="text-lg sm:text-xl font-medium text-slate-200 tracking-wide">
          Total <strong className="font-bold text-amber-400">{OPCODES_DATA.length} instructions</strong>
        </h2>
        <p className="text-xs text-slate-400 font-sans">
          Complete 8085 Microprocessor Opcode & Mnemonic Reference Manual
        </p>
      </div>

      {/* Search Bar & Controls */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Mnemonics..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-inner font-sans"
          />
        </div>

        {/* Categories & View Switcher */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setViewStyle('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewStyle === 'list' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mobile List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewStyle('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewStyle === 'grid' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Cards Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* LIST VIEW (Matching Image 2 style) */}
      {viewStyle === 'list' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl divide-y divide-slate-800/80 shadow-lg overflow-hidden">
          {filteredOpcodes.map((op, idx) => (
            <div key={idx} className="flex items-center py-3.5 px-4 hover:bg-slate-800/50 transition-colors group relative">
              {/* Red Margin Line on Left */}
              <div className="absolute left-16 top-0 bottom-0 w-px bg-red-500/20" />

              {/* Opcode Hex & Byte Count Column */}
              <div className="w-16 shrink-0 flex flex-col items-start pr-2">
                <span className="font-mono text-xl sm:text-2xl font-bold text-slate-100 tracking-wider">
                  {op.hex}
                </span>
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-sm bg-slate-600 inline-block" />
                  {op.bytes} Byte{op.bytes > 1 ? 's' : ''}
                </span>
              </div>

              {/* Mnemonic Title & Description Column */}
              <div className="pl-4 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-base sm:text-lg font-semibold tracking-widest text-slate-100 uppercase">
                    {op.mnemonic}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-amber-400 border border-slate-800 hidden sm:inline-block">
                    {op.category}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5 leading-snug">
                  {op.description}
                </p>
              </div>
            </div>
          ))}

          {filteredOpcodes.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm">
              No instructions found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}

      {/* GRID VIEW */}
      {viewStyle === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredOpcodes.map((op, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2 hover:border-amber-500/40 transition-all font-mono shadow-md"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="font-bold text-amber-400 text-sm tracking-wide">{op.mnemonic}</span>
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
      )}
    </div>
  );
};
