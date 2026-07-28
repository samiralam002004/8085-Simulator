import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, CheckCircle2, AlertCircle } from 'lucide-react';

interface AITutorProps {
  currentCode: string;
}

export const AITutor: React.FC<AITutorProps> = ({ currentCode }) => {
  const [question, setQuestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAskAI = async () => {
    if (!question.trim() && !currentCode.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/explain-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: currentCode,
          question: question || 'Please analyze this 8085 assembly code step-by-step and highlight any logic or flag issues.',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to communicate with AI Tutor');
      }
      setResponse(data.result);
    } catch (err: any) {
      setError(err.message || 'An error occurred while asking AI Tutor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-5">
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 font-mono">
              8085 AI Lab Professor & Assistant
            </h3>
            <p className="text-xs text-slate-400">
              Ask any question about 8085 opcodes, assembly logic, register flags, or lab exam submission tips.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-slate-300">
            Ask AI Tutor a question about your code or lab assignment:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., How does DAA work? Or explain why my addition carry flag is not setting..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />
            <button
              onClick={handleAskAI}
              disabled={loading}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Ask AI</span>
            </button>
          </div>
        </div>

        {/* Current Code Preview */}
        {currentCode && (
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Attached Assembly Code:</span>
            <pre className="text-[11px] font-mono text-amber-300 max-h-24 overflow-y-auto">
              {currentCode}
            </pre>
          </div>
        )}

        {/* AI Output Response Box */}
        {response && (
          <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-5 space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-indigo-400 font-mono font-bold text-xs border-b border-indigo-500/20 pb-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Tutor Explanation:</span>
            </div>
            <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line">
              {response}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-4 text-xs font-mono text-red-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">AI Tutor Error:</div>
              <div>{error}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
