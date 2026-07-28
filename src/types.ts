export type RegisterName = 'A' | 'B' | 'C' | 'D' | 'E' | 'H' | 'L';
export type PairName = 'BC' | 'DE' | 'HL' | 'PSW' | 'SP';

export interface Flags {
  S: boolean;  // Sign flag
  Z: boolean;  // Zero flag
  AC: boolean; // Auxiliary Carry flag
  P: boolean;  // Parity flag
  CY: boolean; // Carry flag
}

export interface CPUState {
  a: number; // Accumulator (8-bit)
  b: number; // 8-bit
  c: number; // 8-bit
  d: number; // 8-bit
  e: number; // 8-bit
  h: number; // 8-bit
  l: number; // 8-bit
  pc: number; // Program Counter (16-bit)
  sp: number; // Stack Pointer (16-bit)
  flags: Flags;
  tStates: number; // Total clock cycles / T-states executed
  isHalted: boolean;
  interruptEnabled: boolean;
}

export interface OpcodeDef {
  hex: string;
  mnemonic: string;
  operandPattern?: string;
  bytes: number;
  tStates: string;
  category: 'Data Transfer' | 'Arithmetic' | 'Logical' | 'Branching' | 'Control';
  flagsAffected: string;
  description: string;
  example: string;
}

export interface AssembledInstruction {
  address: number;      // Hex memory address e.g. 0x2000
  bytes: number[];      // Opcode bytes e.g. [0x3E, 0x05]
  mnemonic: string;     // Original mnemonic or disassembled string e.g. "MVI A, 05H"
  lineNumber: number;   // Line number in editor code
  rawCode: string;
}

export interface AssemblyResult {
  success: boolean;
  instructions: AssembledInstruction[];
  errors: { line: number; message: string }[];
  machineCodeMap: Map<number, number>; // address -> byte
}

export interface FlowchartNode {
  id: string;
  type: 'start' | 'process' | 'decision' | 'end';
  label: string;
  address?: number;
  trueTargetId?: string;
  falseTargetId?: string;
  nextTargetId?: string;
}

export interface LabExperiment {
  id: string;
  title: string;
  category: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  objective: string;
  theory: string;
  algorithm: string[];
  startAddress: string;
  inputMemory: { address: string; label: string; defaultValue: string; description: string }[];
  expectedOutputMemory: { address: string; label: string; description: string }[];
  code: string;
  trainerKitKeypadSteps: { step: number; action: string; display: string; note: string }[];
}

export type ViewMode = 'editor' | 'trainer' | 'debugger' | 'memory' | 'flowchart' | 'labs' | 'reference' | 'help';
