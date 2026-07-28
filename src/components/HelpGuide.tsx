import React from 'react';
import { HelpCircle, ChevronRight, BookOpen, Calculator, Play, Check, MoreVertical, Keyboards } from 'lucide-react';

interface HelpGuideProps {
  onGoToTrainer?: () => void;
}

export const HelpGuide: React.FC<HelpGuideProps> = ({ onGoToTrainer }) => {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4 font-sans text-slate-100">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 px-4 py-3 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-amber-900 dark:text-amber-200 text-base">Digital Trainer Kit Help Guide</h2>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80">Step-by-step FAQs and Operating Instructions</p>
          </div>
        </div>

        {onGoToTrainer && (
          <button
            onClick={onGoToTrainer}
            className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold text-xs flex items-center gap-1.5 shadow transition-all"
          >
            <Calculator className="w-4 h-4" />
            <span>Open Trainer Kit</span>
          </button>
        )}
      </div>

      {/* FAQ 1 */}
      <div className="space-y-2">
        <div className="flex justify-end">
          <div className="bg-amber-300 text-slate-900 font-semibold px-4 py-2 rounded-2xl rounded-tr-sm text-xs sm:text-sm shadow-sm max-w-[85%]">
            What is Digital Trainer Kit?
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 text-slate-200 p-4 rounded-2xl rounded-tl-sm text-xs sm:text-sm space-y-1 shadow-md leading-relaxed">
          Digital Trainer Kit let you enter hex code directly into memory without writing assembly code. Just enter opcode/hexcode of 8085 mnemonics.
        </div>
      </div>

      {/* FAQ 2 */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-end">
          <div className="bg-amber-300 text-slate-900 font-semibold px-4 py-2 rounded-2xl rounded-tr-sm text-xs sm:text-sm shadow-sm max-w-[85%]">
            How to change keypad?
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 text-slate-200 p-4 rounded-2xl rounded-tl-sm text-xs sm:text-sm space-y-2 shadow-md leading-relaxed">
          <ol className="list-decimal list-inside space-y-1 text-slate-300">
            <li>Tap on <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 text-xs"><MoreVertical className="w-3 h-3 inline" /></span></li>
            <li>Tap on "⌨️ Select Keypad"</li>
            <li>Select desire keypad</li>
            <li>Tap on <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-600 text-white text-xs"><Check className="w-3 h-3 inline" /></span></li>
          </ol>
        </div>
      </div>

      {/* FAQ 3 */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-end">
          <div className="bg-amber-300 text-slate-900 font-semibold px-4 py-2 rounded-2xl rounded-tr-sm text-xs sm:text-sm shadow-sm max-w-[85%]">
            How to write code?
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 text-slate-200 p-4 rounded-2xl rounded-tl-sm text-xs sm:text-sm space-y-2.5 shadow-md leading-relaxed">
          <ol className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">1.</span>
              <span>Tap on the <span className="inline-block px-2 py-0.5 bg-red-600 text-white rounded text-[11px] font-bold shadow-sm">RESET</span> button.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">2.</span>
              <span>Tap on the <span className="inline-block px-2 py-0.5 bg-slate-800 text-slate-100 rounded text-[11px] font-bold border border-slate-700 shadow-sm">EXMEM</span> button to select the memory section.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">3.</span>
              <span>Type in the address you want to access (e.g., <strong className="text-amber-300 font-mono">2000</strong>).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">4.</span>
              <span>Tap on the <span className="inline-block px-2 py-0.5 bg-amber-600 text-white rounded text-[11px] font-bold shadow-sm">NEXT</span> button to move to the next step. This will light up two LEDs on the right side of the kit.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">5.</span>
              <span>Enter the value you want to store at that memory location using the keypad.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">6.</span>
              <span>Tap on the <span className="inline-block px-2 py-0.5 bg-amber-600 text-white rounded text-[11px] font-bold shadow-sm">NEXT</span> button again to move to the next memory location.</span>
            </li>
          </ol>
          <div className="pt-2 border-t border-slate-800 text-slate-400 text-xs italic">
            Remember to be careful when entering data and to always double-check your work to avoid errors.
          </div>
        </div>
      </div>

      {/* FAQ 4 */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-end">
          <div className="bg-amber-300 text-slate-900 font-semibold px-4 py-2 rounded-2xl rounded-tr-sm text-xs sm:text-sm shadow-sm max-w-[85%]">
            How to run (execute) code step by step?
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 text-slate-200 p-4 rounded-2xl rounded-tl-sm text-xs sm:text-sm space-y-2.5 shadow-md leading-relaxed">
          <ol className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">1.</span>
              <span>Tap on the <span className="inline-block px-2 py-0.5 bg-red-600 text-white rounded text-[11px] font-bold shadow-sm">RESET</span> button.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">2.</span>
              <span>Tap on the <span className="inline-block px-2 py-0.5 bg-slate-800 text-slate-100 rounded text-[11px] font-bold border border-slate-700 shadow-sm">GO</span> button to start your code.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">3.</span>
              <span>Type in the address you want to start executing your code from (e.g., <strong className="text-amber-300 font-mono">2000</strong>).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">4.</span>
              <span>Tap on the <span className="inline-block px-2 py-0.5 bg-orange-600 text-white rounded text-[11px] font-bold shadow-sm">STEP</span> button to execute your code one step at a time.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">5.</span>
              <span>Keep tapping on the <span className="inline-block px-2 py-0.5 bg-orange-600 text-white rounded text-[11px] font-bold shadow-sm">STEP</span> button until you see an <strong className="text-red-400 font-bold font-mono text-sm shadow-inner px-1 bg-black rounded">"E"</strong> displayed on the LED or until you want to stop.</span>
            </li>
          </ol>
        </div>
      </div>

      {/* FAQ 5 */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-end">
          <div className="bg-amber-300 text-slate-900 font-semibold px-4 py-2 rounded-2xl rounded-tr-sm text-xs sm:text-sm shadow-sm max-w-[85%]">
            How to run (execute) code?
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 text-slate-200 p-4 rounded-2xl rounded-tl-sm text-xs sm:text-sm space-y-2.5 shadow-md leading-relaxed">
          <ol className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">1.</span>
              <span>Tap on the <span className="inline-block px-2 py-0.5 bg-red-600 text-white rounded text-[11px] font-bold shadow-sm">RESET</span> button.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">2.</span>
              <span>Tap on the <span className="inline-block px-2 py-0.5 bg-slate-800 text-slate-100 rounded text-[11px] font-bold border border-slate-700 shadow-sm">GO</span> button to start your code.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">3.</span>
              <span>Type in the address you want to start executing your code from (e.g., <strong className="text-amber-300 font-mono">2000</strong>).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">4.</span>
              <span>Tap on the <span className="inline-block px-2 py-0.5 bg-emerald-600 text-white rounded text-[11px] font-bold shadow-sm">EXEC</span> button to execute your code.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">5.</span>
              <span><strong className="text-red-400 font-bold font-mono text-sm shadow-inner px-1.5 py-0.5 bg-black rounded">"E"</strong> will be displayed on the LED.</span>
            </li>
          </ol>
        </div>
      </div>

      {/* FAQ 6 */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-end">
          <div className="bg-amber-300 text-slate-900 font-semibold px-4 py-2 rounded-2xl rounded-tr-sm text-xs sm:text-sm shadow-sm max-w-[85%]">
            How to display register value?
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 text-slate-200 p-4 rounded-2xl rounded-tl-sm text-xs sm:text-sm space-y-2.5 shadow-md leading-relaxed">
          <ol className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">1.</span>
              <span>Tap on the <span className="inline-block px-2 py-0.5 bg-red-600 text-white rounded text-[11px] font-bold shadow-sm">RESET</span> button.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">2.</span>
              <span>Tap on the <span className="inline-block px-2 py-0.5 bg-slate-800 text-slate-100 rounded text-[11px] font-bold border border-slate-700 shadow-sm">EXREG</span> button to access the register values.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">3.</span>
              <span>On the right side of the kit, you will see the names of the registers (A, B, C, D, E, H, L, PC, SP).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">4.</span>
              <span>Tap on any register name to display its current value.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-400">5.</span>
              <span>If you want to view the next or previous register value, tap on the <span className="inline-block px-2 py-0.5 bg-amber-600 text-white rounded text-[11px] font-bold shadow-sm">NEXT</span> or <span className="inline-block px-2 py-0.5 bg-slate-800 text-slate-200 rounded text-[11px] font-bold border border-slate-700">PREV</span> button respectively.</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
