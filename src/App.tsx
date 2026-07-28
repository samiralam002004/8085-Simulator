import React, { useState, useRef, useEffect } from 'react';
import { Engine8085 } from './lib/8085Engine';
import { ViewMode, AssemblyResult, LabExperiment } from './types';
import { LAB_EXPERIMENTS } from './lib/labExperimentsData';
import { Header } from './components/Header';
import { DigitalKitTopBar } from './components/DigitalKitTopBar';
import { TrainerKit } from './components/TrainerKit';
import { CodeEditor } from './components/CodeEditor';
import { RegisterView } from './components/RegisterView';
import { OpcodeTable } from './components/OpcodeTable';
import { MemoryVisualizer } from './components/MemoryVisualizer';
import { FlowchartView } from './components/FlowchartView';
import { LabExperiments } from './components/LabExperiments';
import { AITutor } from './components/AITutor';
import { MnemonicReference } from './components/MnemonicReference';
import { HelpGuide } from './components/HelpGuide';

export default function App() {
  const engineRef = useRef<Engine8085>(new Engine8085());
  const engine = engineRef.current;

  const [activeView, setActiveView] = useState<ViewMode>('editor');
  const [code, setCode] = useState<string>(LAB_EXPERIMENTS[0].code);
  const [startAddress, setStartAddress] = useState<string>('2000');
  const [assemblyResult, setAssemblyResult] = useState<AssemblyResult | null>(null);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [clockSpeed, setClockSpeed] = useState<number>(10); // 10 Hz
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [, setTick] = useState<number>(0);

  const forceUpdate = () => setTick((t) => t + 1);

  // Auto-assemble default code on initial load
  useEffect(() => {
    const addr = parseInt(startAddress, 16) || 0x2000;
    const res = engine.assemble(code, addr);
    setAssemblyResult(res);
  }, []);

  // Execution Interval Loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isRunning) {
      const delay = Math.max(1, Math.round(1000 / clockSpeed));
      timer = setInterval(() => {
        if (engine.state.isHalted) {
          setIsRunning(false);
          if (timer) clearInterval(timer);
          forceUpdate();
          return;
        }

        engine.step();
        forceUpdate();
      }, delay);
    } else {
      if (timer) clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, clockSpeed]);

  const handleRunToggle = () => {
    if (engine.state.isHalted) {
      engine.state.isHalted = false;
    }
    setIsRunning(!isRunning);
  };

  const handleSingleStep = () => {
    if (!engine.state.isHalted) {
      engine.step();
      forceUpdate();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    engine.reset();
    forceUpdate();
  };

  const handleAssemble = (result: AssemblyResult) => {
    setAssemblyResult(result);
    forceUpdate();
  };

  const handleLoadCodeToEditor = (newCode: string) => {
    setCode(newCode);
    const addr = parseInt(startAddress, 16) || 0x2000;
    const res = engine.assemble(newCode, addr);
    setAssemblyResult(res);
    setActiveView('editor');
    forceUpdate();
  };

  const handleLoadToTrainerKit = (lab: LabExperiment) => {
    // Fill Input Memory
    lab.inputMemory.forEach((mem) => {
      const addr = parseInt(mem.address, 16);
      const val = parseInt(mem.defaultValue, 16);
      if (!isNaN(addr) && !isNaN(val)) {
        engine.writeMemory(addr, val);
      }
    });

    // Assemble Code to Memory
    const addr = parseInt(lab.startAddress, 16) || 0x2000;
    const res = engine.assemble(lab.code, addr);
    setAssemblyResult(res);
    setActiveView('trainer');
    forceUpdate();
  };

  const handleAskAI = (codeSnippet: string) => {
    setActiveView('editor');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Main Navigation & Control Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        isRunning={isRunning}
        onRunToggle={handleRunToggle}
        onSingleStep={handleSingleStep}
        onReset={handleReset}
        clockSpeed={clockSpeed}
        setClockSpeed={setClockSpeed}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        tStates={engine.state.tStates}
        isHalted={engine.state.isHalted}
        pcHex={engine.state.pc.toString(16).toUpperCase().padStart(4, '0')}
      />

      {/* Interactive ET-8085 Digital Kit Top Bar */}
      <DigitalKitTopBar
        engine={engine}
        onStateChange={forceUpdate}
        soundEnabled={soundEnabled}
        isRunning={isRunning}
        onRunToggle={handleRunToggle}
        onSingleStep={handleSingleStep}
        onReset={handleReset}
      />

      {/* Main View Area (with bottom padding for Android navigation bar) */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto w-full pb-20 md:pb-6">
        {/* VIEW 1: ASSEMBLY CODE EDITOR & LIVE DEBUGGER */}
        {activeView === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            <div className="lg:col-span-7">
              <CodeEditor
                engine={engine}
                code={code}
                setCode={setCode}
                startAddress={startAddress}
                setStartAddress={setStartAddress}
                onAssemble={handleAssemble}
                assemblyResult={assemblyResult}
                onRunToggle={handleRunToggle}
                isRunning={isRunning}
                onAskAI={handleAskAI}
              />
            </div>

            <div className="lg:col-span-5 space-y-4 sm:space-y-6">
              <RegisterView engine={engine} onStateChange={forceUpdate} />
              <OpcodeTable engine={engine} assemblyResult={assemblyResult} />
            </div>
          </div>
        )}

        {/* VIEW 2: ET-8085 KEYPAD TRAINER KIT */}
        {activeView === 'trainer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            <div className="lg:col-span-8">
              <TrainerKit engine={engine} onStateChange={forceUpdate} soundEnabled={soundEnabled} />
            </div>
            <div className="lg:col-span-4 space-y-4 sm:space-y-6">
              <RegisterView engine={engine} onStateChange={forceUpdate} />
            </div>
          </div>
        )}

        {/* VIEW 3: LIVE MEMORY VISUALIZER */}
        {activeView === 'memory' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            <div className="lg:col-span-8">
              <MemoryVisualizer engine={engine} onStateChange={forceUpdate} />
            </div>
            <div className="lg:col-span-4 space-y-4 sm:space-y-6">
              <RegisterView engine={engine} onStateChange={forceUpdate} />
            </div>
          </div>
        )}

        {/* VIEW 4: FLOWCHART DIAGRAM */}
        {activeView === 'flowchart' && (
          <FlowchartView engine={engine} assemblyResult={assemblyResult} code={code} />
        )}

        {/* VIEW 5: LAB MANUAL & EXPERIMENTS */}
        {activeView === 'labs' && (
          <LabExperiments
            onLoadCodeToEditor={handleLoadCodeToEditor}
            onLoadToTrainerKit={handleLoadToTrainerKit}
          />
        )}

        {/* VIEW 6: MNEMONICS & OPCODES REFERENCE HANDBOOK */}
        {activeView === 'reference' && <MnemonicReference />}

        {/* VIEW 7: DIGITAL TRAINER KIT HELP GUIDE */}
        {activeView === 'help' && <HelpGuide onGoToTrainer={() => setActiveView('trainer')} />}

        {/* AI Tutor Panel at bottom of page when in editor */}
        {activeView === 'editor' && (
          <div className="mt-6 sm:mt-8">
            <AITutor currentCode={code} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-3 text-center text-xs font-mono text-slate-500 hidden md:block">
        8085 Microprocessor Digital Trainer & Simulator • Designed for Engineering Labs & Microcontroller Coursework
      </footer>
    </div>
  );
}
