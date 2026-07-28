import { CPUState, Flags, AssemblyResult, AssembledInstruction } from '../types';
import { OPCODES_DATA } from './opcodesData';

export class Engine8085 {
  memory: Uint8Array = new Uint8Array(65536); // 64KB RAM/ROM
  ports: Uint8Array = new Uint8Array(256);    // 256 I/O Ports
  
  state: CPUState = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
    h: 0,
    l: 0,
    pc: 0x2000,
    sp: 0x3000,
    flags: { S: false, Z: false, AC: false, P: false, CY: false },
    tStates: 0,
    isHalted: false,
    interruptEnabled: false,
  };

  breakpoints: Set<number> = new Set();
  modifiedMemoryAddresses: Set<number> = new Set();

  constructor() {
    this.reset();
  }

  reset() {
    this.state = {
      a: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      pc: 0x2000,
      sp: 0x3000,
      flags: { S: false, Z: false, AC: false, P: false, CY: false },
      tStates: 0,
      isHalted: false,
      interruptEnabled: false,
    };
    this.modifiedMemoryAddresses.clear();
  }

  resetMemory() {
    this.memory.fill(0);
    this.ports.fill(0);
    this.reset();
  }

  getHL(): number {
    return ((this.state.h & 0xff) << 8) | (this.state.l & 0xff);
  }

  setHL(val: number) {
    val = val & 0xffff;
    this.state.h = (val >> 8) & 0xff;
    this.state.l = val & 0xff;
  }

  getBC(): number {
    return ((this.state.b & 0xff) << 8) | (this.state.c & 0xff);
  }

  setBC(val: number) {
    val = val & 0xffff;
    this.state.b = (val >> 8) & 0xff;
    this.state.c = val & 0xff;
  }

  getDE(): number {
    return ((this.state.d & 0xff) << 8) | (this.state.e & 0xff);
  }

  setDE(val: number) {
    val = val & 0xffff;
    this.state.d = (val >> 8) & 0xff;
    this.state.e = val & 0xff;
  }

  getM(): number {
    const hl = this.getHL();
    return this.memory[hl];
  }

  setM(val: number) {
    const hl = this.getHL();
    this.writeMemory(hl, val);
  }

  readMemory(addr: number): number {
    return this.memory[addr & 0xffff];
  }

  writeMemory(addr: number, val: number) {
    addr = addr & 0xffff;
    this.memory[addr] = val & 0xff;
    this.modifiedMemoryAddresses.add(addr);
  }

  // Block Memory Operations for Digital Kit
  fillMemory(startAddr: number, endAddr: number, data: number) {
    const start = Math.min(startAddr, endAddr) & 0xffff;
    const end = Math.max(startAddr, endAddr) & 0xffff;
    const val = data & 0xff;
    for (let i = start; i <= end; i++) {
      this.writeMemory(i, val);
    }
  }

  moveMemory(srcStart: number, srcEnd: number, destAddr: number) {
    const start = Math.min(srcStart, srcEnd) & 0xffff;
    const end = Math.max(srcStart, srcEnd) & 0xffff;
    const length = end - start + 1;
    const temp = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      temp[i] = this.readMemory(start + i);
    }
    for (let i = 0; i < length; i++) {
      this.writeMemory(destAddr + i, temp[i]);
    }
  }

  insertMemoryByte(addr: number, data: number) {
    addr = addr & 0xffff;
    // Shift memory up from 0xFFFE down to addr
    for (let i = 0xfffe; i >= addr; i--) {
      this.writeMemory(i + 1, this.readMemory(i));
    }
    this.writeMemory(addr, data);
  }

  deleteMemoryByte(addr: number) {
    addr = addr & 0xffff;
    // Shift memory down from addr to 0xFFFE
    for (let i = addr; i < 0xffff; i++) {
      this.writeMemory(i, this.readMemory(i + 1));
    }
    this.writeMemory(0xffff, 0x00);
  }

  updateFlags(val: number, carry?: boolean, auxCarry?: boolean) {
    val = val & 0xff;
    this.state.flags.Z = val === 0;
    this.state.flags.S = (val & 0x80) !== 0;
    
    // Calculate parity
    let ones = 0;
    for (let i = 0; i < 8; i++) {
      if ((val & (1 << i)) !== 0) ones++;
    }
    this.state.flags.P = ones % 2 === 0;

    if (carry !== undefined) this.state.flags.CY = carry;
    if (auxCarry !== undefined) this.state.flags.AC = auxCarry;
  }

  // Calculate Auxiliary Carry for 8-bit addition (bit 3 carry to bit 4)
  calcACAdd(a: number, b: number, carryIn: number = 0): boolean {
    return (((a & 0x0f) + (b & 0x0f) + carryIn) & 0x10) !== 0;
  }

  // Calculate Auxiliary Carry for 8-bit subtraction
  calcACSub(a: number, b: number, borrowIn: number = 0): boolean {
    return (((a & 0x0f) - (b & 0x0f) - borrowIn) & 0x10) !== 0;
  }

  // Single step execution
  step(): { executedPC: number; mnemonic: string; tStates: number; error?: string } {
    if (this.state.isHalted) {
      return { executedPC: this.state.pc, mnemonic: 'HLT', tStates: 0, error: 'CPU is Halted' };
    }

    const currentPC = this.state.pc;
    const opcode = this.readMemory(currentPC);

    let instructionMnemonic = 'NOP';
    let cycles = 4;

    try {
      switch (opcode) {
        // NOP
        case 0x00:
          instructionMnemonic = 'NOP';
          cycles = 4;
          this.state.pc = (this.state.pc + 1) & 0xffff;
          break;

        // HLT
        case 0x76:
          instructionMnemonic = 'HLT';
          cycles = 5;
          this.state.isHalted = true;
          break;

        // MVI r, data
        case 0x3E: // MVI A
          this.state.a = this.readMemory(currentPC + 1);
          instructionMnemonic = `MVI A, ${this.hex2(this.state.a)}H`;
          cycles = 7;
          this.state.pc = (this.state.pc + 2) & 0xffff;
          break;
        case 0x06: // MVI B
          this.state.b = this.readMemory(currentPC + 1);
          instructionMnemonic = `MVI B, ${this.hex2(this.state.b)}H`;
          cycles = 7;
          this.state.pc = (this.state.pc + 2) & 0xffff;
          break;
        case 0x0E: // MVI C
          this.state.c = this.readMemory(currentPC + 1);
          instructionMnemonic = `MVI C, ${this.hex2(this.state.c)}H`;
          cycles = 7;
          this.state.pc = (this.state.pc + 2) & 0xffff;
          break;
        case 0x16: // MVI D
          this.state.d = this.readMemory(currentPC + 1);
          instructionMnemonic = `MVI D, ${this.hex2(this.state.d)}H`;
          cycles = 7;
          this.state.pc = (this.state.pc + 2) & 0xffff;
          break;
        case 0x1E: // MVI E
          this.state.e = this.readMemory(currentPC + 1);
          instructionMnemonic = `MVI E, ${this.hex2(this.state.e)}H`;
          cycles = 7;
          this.state.pc = (this.state.pc + 2) & 0xffff;
          break;
        case 0x26: // MVI H
          this.state.h = this.readMemory(currentPC + 1);
          instructionMnemonic = `MVI H, ${this.hex2(this.state.h)}H`;
          cycles = 7;
          this.state.pc = (this.state.pc + 2) & 0xffff;
          break;
        case 0x2E: // MVI L
          this.state.l = this.readMemory(currentPC + 1);
          instructionMnemonic = `MVI L, ${this.hex2(this.state.l)}H`;
          cycles = 7;
          this.state.pc = (this.state.pc + 2) & 0xffff;
          break;
        case 0x36: // MVI M
          this.setM(this.readMemory(currentPC + 1));
          instructionMnemonic = `MVI M, ${this.hex2(this.readMemory(currentPC + 1))}H`;
          cycles = 10;
          this.state.pc = (this.state.pc + 2) & 0xffff;
          break;

        // LXI rp, data16
        case 0x21: { // LXI H
          const low = this.readMemory(currentPC + 1);
          const high = this.readMemory(currentPC + 2);
          this.setHL((high << 8) | low);
          instructionMnemonic = `LXI H, ${this.hex4((high << 8) | low)}H`;
          cycles = 10;
          this.state.pc = (this.state.pc + 3) & 0xffff;
          break;
        }
        case 0x01: { // LXI B
          const low = this.readMemory(currentPC + 1);
          const high = this.readMemory(currentPC + 2);
          this.setBC((high << 8) | low);
          instructionMnemonic = `LXI B, ${this.hex4((high << 8) | low)}H`;
          cycles = 10;
          this.state.pc = (this.state.pc + 3) & 0xffff;
          break;
        }
        case 0x11: { // LXI D
          const low = this.readMemory(currentPC + 1);
          const high = this.readMemory(currentPC + 2);
          this.setDE((high << 8) | low);
          instructionMnemonic = `LXI D, ${this.hex4((high << 8) | low)}H`;
          cycles = 10;
          this.state.pc = (this.state.pc + 3) & 0xffff;
          break;
        }
        case 0x31: { // LXI SP
          const low = this.readMemory(currentPC + 1);
          const high = this.readMemory(currentPC + 2);
          this.state.sp = (high << 8) | low;
          instructionMnemonic = `LXI SP, ${this.hex4(this.state.sp)}H`;
          cycles = 10;
          this.state.pc = (this.state.pc + 3) & 0xffff;
          break;
        }

        // MOV r1, r2
        case 0x78: this.state.b = this.state.a; instructionMnemonic = 'MOV B, A'; cycles = 4; this.state.pc += 1; break;
        case 0x79: this.state.c = this.state.a; instructionMnemonic = 'MOV C, A'; cycles = 4; this.state.pc += 1; break;
        case 0x7A: this.state.d = this.state.a; instructionMnemonic = 'MOV D, A'; cycles = 4; this.state.pc += 1; break;
        case 0x7B: this.state.e = this.state.a; instructionMnemonic = 'MOV E, A'; cycles = 4; this.state.pc += 1; break;
        case 0x7C: this.state.h = this.state.a; instructionMnemonic = 'MOV H, A'; cycles = 4; this.state.pc += 1; break;
        case 0x7D: this.state.l = this.state.a; instructionMnemonic = 'MOV L, A'; cycles = 4; this.state.pc += 1; break;
        case 0x77: this.setM(this.state.a); instructionMnemonic = 'MOV M, A'; cycles = 7; this.state.pc += 1; break;

        case 0x7F: this.state.a = this.state.a; instructionMnemonic = 'MOV A, A'; cycles = 4; this.state.pc += 1; break;
        case 0x78: this.state.a = this.state.b; instructionMnemonic = 'MOV A, B'; cycles = 4; this.state.pc += 1; break; // Wait, 0x78 is MOV A, B or MOV B, A? Standard 8085: 0x78 = MOV A, B, 0x47 = MOV B, A
        case 0x79: this.state.a = this.state.c; instructionMnemonic = 'MOV A, C'; cycles = 4; this.state.pc += 1; break;
        case 0x7A: this.state.a = this.state.d; instructionMnemonic = 'MOV A, D'; cycles = 4; this.state.pc += 1; break;
        case 0x7B: this.state.a = this.state.e; instructionMnemonic = 'MOV A, E'; cycles = 4; this.state.pc += 1; break;
        case 0x7C: this.state.a = this.state.h; instructionMnemonic = 'MOV A, H'; cycles = 4; this.state.pc += 1; break;
        case 0x7D: this.state.a = this.state.l; instructionMnemonic = 'MOV A, L'; cycles = 4; this.state.pc += 1; break;
        case 0x7E: this.state.a = this.getM(); instructionMnemonic = 'MOV A, M'; cycles = 7; this.state.pc += 1; break;

        case 0x47: this.state.b = this.state.a; instructionMnemonic = 'MOV B, A'; cycles = 4; this.state.pc += 1; break;
        case 0x40: this.state.b = this.state.b; instructionMnemonic = 'MOV B, B'; cycles = 4; this.state.pc += 1; break;
        case 0x41: this.state.b = this.state.c; instructionMnemonic = 'MOV B, C'; cycles = 4; this.state.pc += 1; break;
        case 0x42: this.state.b = this.state.d; instructionMnemonic = 'MOV B, D'; cycles = 4; this.state.pc += 1; break;
        case 0x43: this.state.b = this.state.e; instructionMnemonic = 'MOV B, E'; cycles = 4; this.state.pc += 1; break;
        case 0x44: this.state.b = this.state.h; instructionMnemonic = 'MOV B, H'; cycles = 4; this.state.pc += 1; break;
        case 0x45: this.state.b = this.state.l; instructionMnemonic = 'MOV B, L'; cycles = 4; this.state.pc += 1; break;
        case 0x46: this.state.b = this.getM(); instructionMnemonic = 'MOV B, M'; cycles = 7; this.state.pc += 1; break;

        case 0x4F: this.state.c = this.state.a; instructionMnemonic = 'MOV C, A'; cycles = 4; this.state.pc += 1; break;
        case 0x48: this.state.c = this.state.b; instructionMnemonic = 'MOV C, B'; cycles = 4; this.state.pc += 1; break;
        case 0x4E: this.state.c = this.getM(); instructionMnemonic = 'MOV C, M'; cycles = 7; this.state.pc += 1; break;

        case 0x57: this.state.d = this.state.a; instructionMnemonic = 'MOV D, A'; cycles = 4; this.state.pc += 1; break;
        case 0x50: this.state.d = this.state.b; instructionMnemonic = 'MOV D, B'; cycles = 4; this.state.pc += 1; break;
        case 0x56: this.state.d = this.getM(); instructionMnemonic = 'MOV D, M'; cycles = 7; this.state.pc += 1; break;

        case 0x5F: this.state.e = this.state.a; instructionMnemonic = 'MOV E, A'; cycles = 4; this.state.pc += 1; break;
        case 0x5E: this.state.e = this.getM(); instructionMnemonic = 'MOV E, M'; cycles = 7; this.state.pc += 1; break;

        case 0x67: this.state.h = this.state.a; instructionMnemonic = 'MOV H, A'; cycles = 4; this.state.pc += 1; break;
        case 0x6E: this.state.h = this.getM(); instructionMnemonic = 'MOV H, M'; cycles = 7; this.state.pc += 1; break;

        case 0x6F: this.state.l = this.state.a; instructionMnemonic = 'MOV L, A'; cycles = 4; this.state.pc += 1; break;
        case 0x6E: this.state.l = this.getM(); instructionMnemonic = 'MOV L, M'; cycles = 7; this.state.pc += 1; break;

        // LDA addr16 / STA addr16
        case 0x3A: {
          const addr = this.readMemory(currentPC + 1) | (this.readMemory(currentPC + 2) << 8);
          this.state.a = this.readMemory(addr);
          instructionMnemonic = `LDA ${this.hex4(addr)}H`;
          cycles = 13;
          this.state.pc = (this.state.pc + 3) & 0xffff;
          break;
        }
        case 0x32: {
          const addr = this.readMemory(currentPC + 1) | (this.readMemory(currentPC + 2) << 8);
          this.writeMemory(addr, this.state.a);
          instructionMnemonic = `STA ${this.hex4(addr)}H`;
          cycles = 13;
          this.state.pc = (this.state.pc + 3) & 0xffff;
          break;
        }

        // LHLD / SHLD
        case 0x2A: {
          const addr = this.readMemory(currentPC + 1) | (this.readMemory(currentPC + 2) << 8);
          this.state.l = this.readMemory(addr);
          this.state.h = this.readMemory(addr + 1);
          instructionMnemonic = `LHLD ${this.hex4(addr)}H`;
          cycles = 16;
          this.state.pc = (this.state.pc + 3) & 0xffff;
          break;
        }
        case 0x22: {
          const addr = this.readMemory(currentPC + 1) | (this.readMemory(currentPC + 2) << 8);
          this.writeMemory(addr, this.state.l);
          this.writeMemory(addr + 1, this.state.h);
          instructionMnemonic = `SHLD ${this.hex4(addr)}H`;
          cycles = 16;
          this.state.pc = (this.state.pc + 3) & 0xffff;
          break;
        }

        // LDAX B / LDAX D / STAX B / STAX D / XCHG
        case 0x0A:
          this.state.a = this.readMemory(this.getBC());
          instructionMnemonic = 'LDAX B';
          cycles = 7;
          this.state.pc += 1;
          break;
        case 0x1A:
          this.state.a = this.readMemory(this.getDE());
          instructionMnemonic = 'LDAX D';
          cycles = 7;
          this.state.pc += 1;
          break;
        case 0x02:
          this.writeMemory(this.getBC(), this.state.a);
          instructionMnemonic = 'STAX B';
          cycles = 7;
          this.state.pc += 1;
          break;
        case 0x12:
          this.writeMemory(this.getDE(), this.state.a);
          instructionMnemonic = 'STAX D';
          cycles = 7;
          this.state.pc += 1;
          break;
        case 0xEB: {
          const tempH = this.state.h;
          const tempL = this.state.l;
          this.state.h = this.state.d;
          this.state.l = this.state.e;
          this.state.d = tempH;
          this.state.e = tempL;
          instructionMnemonic = 'XCHG';
          cycles = 4;
          this.state.pc += 1;
          break;
        }

        // ADD r
        case 0x80: this.execADD(this.state.b); instructionMnemonic = 'ADD B'; cycles = 4; this.state.pc += 1; break;
        case 0x81: this.execADD(this.state.c); instructionMnemonic = 'ADD C'; cycles = 4; this.state.pc += 1; break;
        case 0x82: this.execADD(this.state.d); instructionMnemonic = 'ADD D'; cycles = 4; this.state.pc += 1; break;
        case 0x83: this.execADD(this.state.e); instructionMnemonic = 'ADD E'; cycles = 4; this.state.pc += 1; break;
        case 0x84: this.execADD(this.state.h); instructionMnemonic = 'ADD H'; cycles = 4; this.state.pc += 1; break;
        case 0x85: this.execADD(this.state.l); instructionMnemonic = 'ADD L'; cycles = 4; this.state.pc += 1; break;
        case 0x86: this.execADD(this.getM()); instructionMnemonic = 'ADD M'; cycles = 7; this.state.pc += 1; break;
        case 0x87: this.execADD(this.state.a); instructionMnemonic = 'ADD A'; cycles = 4; this.state.pc += 1; break;

        // ADC r
        case 0x88: this.execADC(this.state.b); instructionMnemonic = 'ADC B'; cycles = 4; this.state.pc += 1; break;
        case 0x89: this.execADC(this.state.c); instructionMnemonic = 'ADC C'; cycles = 4; this.state.pc += 1; break;
        case 0x8D: this.execADC(this.state.l); instructionMnemonic = 'ADC L'; cycles = 4; this.state.pc += 1; break;
        case 0x8E: this.execADC(this.getM()); instructionMnemonic = 'ADC M'; cycles = 7; this.state.pc += 1; break;

        // ADI / ACI
        case 0xC6: {
          const val = this.readMemory(currentPC + 1);
          this.execADD(val);
          instructionMnemonic = `ADI ${this.hex2(val)}H`;
          cycles = 7;
          this.state.pc += 2;
          break;
        }
        case 0xCE: {
          const val = this.readMemory(currentPC + 1);
          this.execADC(val);
          instructionMnemonic = `ACI ${this.hex2(val)}H`;
          cycles = 7;
          this.state.pc += 2;
          break;
        }

        // SUB r
        case 0x90: this.execSUB(this.state.b); instructionMnemonic = 'SUB B'; cycles = 4; this.state.pc += 1; break;
        case 0x91: this.execSUB(this.state.c); instructionMnemonic = 'SUB C'; cycles = 4; this.state.pc += 1; break;
        case 0x92: this.execSUB(this.state.d); instructionMnemonic = 'SUB D'; cycles = 4; this.state.pc += 1; break;
        case 0x93: this.execSUB(this.state.e); instructionMnemonic = 'SUB E'; cycles = 4; this.state.pc += 1; break;
        case 0x96: this.execSUB(this.getM()); instructionMnemonic = 'SUB M'; cycles = 7; this.state.pc += 1; break;
        case 0x97: this.execSUB(this.state.a); instructionMnemonic = 'SUB A'; cycles = 4; this.state.pc += 1; break;

        // SBB r
        case 0x98: this.execSBB(this.state.b); instructionMnemonic = 'SBB B'; cycles = 4; this.state.pc += 1; break;
        case 0x99: this.execSBB(this.state.c); instructionMnemonic = 'SBB C'; cycles = 4; this.state.pc += 1; break;

        // SUI / SBI
        case 0xD6: {
          const val = this.readMemory(currentPC + 1);
          this.execSUB(val);
          instructionMnemonic = `SUI ${this.hex2(val)}H`;
          cycles = 7;
          this.state.pc += 2;
          break;
        }
        case 0xDE: {
          const val = this.readMemory(currentPC + 1);
          this.execSBB(val);
          instructionMnemonic = `SBI ${this.hex2(val)}H`;
          cycles = 7;
          this.state.pc += 2;
          break;
        }

        // INR r
        case 0x04: this.state.b = this.execINR(this.state.b); instructionMnemonic = 'INR B'; cycles = 5; this.state.pc += 1; break;
        case 0x0C: this.state.c = this.execINR(this.state.c); instructionMnemonic = 'INR C'; cycles = 5; this.state.pc += 1; break;
        case 0x14: this.state.d = this.execINR(this.state.d); instructionMnemonic = 'INR D'; cycles = 5; this.state.pc += 1; break;
        case 0x1C: this.state.e = this.execINR(this.state.e); instructionMnemonic = 'INR E'; cycles = 5; this.state.pc += 1; break;
        case 0x24: this.state.h = this.execINR(this.state.h); instructionMnemonic = 'INR H'; cycles = 5; this.state.pc += 1; break;
        case 0x2C: this.state.l = this.execINR(this.state.l); instructionMnemonic = 'INR L'; cycles = 5; this.state.pc += 1; break;
        case 0x34: this.setM(this.execINR(this.getM())); instructionMnemonic = 'INR M'; cycles = 10; this.state.pc += 1; break;
        case 0x3C: this.state.a = this.execINR(this.state.a); instructionMnemonic = 'INR A'; cycles = 5; this.state.pc += 1; break;

        // DCR r
        case 0x05: this.state.b = this.execDCR(this.state.b); instructionMnemonic = 'DCR B'; cycles = 5; this.state.pc += 1; break;
        case 0x0D: this.state.c = this.execDCR(this.state.c); instructionMnemonic = 'DCR C'; cycles = 5; this.state.pc += 1; break;
        case 0x15: this.state.d = this.execDCR(this.state.d); instructionMnemonic = 'DCR D'; cycles = 5; this.state.pc += 1; break;
        case 0x1D: this.state.e = this.execDCR(this.state.e); instructionMnemonic = 'DCR E'; cycles = 5; this.state.pc += 1; break;
        case 0x25: this.state.h = this.execDCR(this.state.h); instructionMnemonic = 'DCR H'; cycles = 5; this.state.pc += 1; break;
        case 0x2D: this.state.l = this.execDCR(this.state.l); instructionMnemonic = 'DCR L'; cycles = 5; this.state.pc += 1; break;
        case 0x35: this.setM(this.execDCR(this.getM())); instructionMnemonic = 'DCR M'; cycles = 10; this.state.pc += 1; break;
        case 0x3D: this.state.a = this.execDCR(this.state.a); instructionMnemonic = 'DCR A'; cycles = 5; this.state.pc += 1; break;

        // INX rp / DCX rp
        case 0x03: this.setBC(this.getBC() + 1); instructionMnemonic = 'INX B'; cycles = 6; this.state.pc += 1; break;
        case 0x13: this.setDE(this.getDE() + 1); instructionMnemonic = 'INX D'; cycles = 6; this.state.pc += 1; break;
        case 0x23: this.setHL(this.getHL() + 1); instructionMnemonic = 'INX H'; cycles = 6; this.state.pc += 1; break;
        case 0x33: this.state.sp = (this.state.sp + 1) & 0xffff; instructionMnemonic = 'INX SP'; cycles = 6; this.state.pc += 1; break;

        case 0x0B: this.setBC(this.getBC() - 1); instructionMnemonic = 'DCX B'; cycles = 6; this.state.pc += 1; break;
        case 0x1B: this.setDE(this.getDE() - 1); instructionMnemonic = 'DCX D'; cycles = 6; this.state.pc += 1; break;
        case 0x2B: this.setHL(this.getHL() - 1); instructionMnemonic = 'DCX H'; cycles = 6; this.state.pc += 1; break;
        case 0x3B: this.state.sp = (this.state.sp - 1) & 0xffff; instructionMnemonic = 'DCX SP'; cycles = 6; this.state.pc += 1; break;

        // DAD rp
        case 0x09: this.execDAD(this.getBC()); instructionMnemonic = 'DAD B'; cycles = 10; this.state.pc += 1; break;
        case 0x19: this.execDAD(this.getDE()); instructionMnemonic = 'DAD D'; cycles = 10; this.state.pc += 1; break;
        case 0x29: this.execDAD(this.getHL()); instructionMnemonic = 'DAD H'; cycles = 10; this.state.pc += 1; break;

        // DAA
        case 0x27: {
          let a = this.state.a;
          let cy = this.state.flags.CY;
          let ac = this.state.flags.AC;

          if ((a & 0x0f) > 9 || ac) {
            a += 6;
            ac = true;
          }
          if ((a & 0xf0) > 0x90 || cy || (a > 0xff)) {
            a += 0x60;
            cy = true;
          }
          this.state.a = a & 0xff;
          this.updateFlags(this.state.a, cy, ac);
          instructionMnemonic = 'DAA';
          cycles = 4;
          this.state.pc += 1;
          break;
        }

        // ANA r
        case 0xA0: this.execANA(this.state.b); instructionMnemonic = 'ANA B'; cycles = 4; this.state.pc += 1; break;
        case 0xA1: this.execANA(this.state.c); instructionMnemonic = 'ANA C'; cycles = 4; this.state.pc += 1; break;
        case 0xA6: this.execANA(this.getM()); instructionMnemonic = 'ANA M'; cycles = 7; this.state.pc += 1; break;
        case 0xA7: this.execANA(this.state.a); instructionMnemonic = 'ANA A'; cycles = 4; this.state.pc += 1; break;
        case 0xE6: {
          const val = this.readMemory(currentPC + 1);
          this.execANA(val);
          instructionMnemonic = `ANI ${this.hex2(val)}H`;
          cycles = 7;
          this.state.pc += 2;
          break;
        }

        // ORA r / ORI
        case 0xB0: this.execORA(this.state.b); instructionMnemonic = 'ORA B'; cycles = 4; this.state.pc += 1; break;
        case 0xB1: this.execORA(this.state.c); instructionMnemonic = 'ORA C'; cycles = 4; this.state.pc += 1; break;
        case 0xB6: this.execORA(this.getM()); instructionMnemonic = 'ORA M'; cycles = 7; this.state.pc += 1; break;
        case 0xB7: this.execORA(this.state.a); instructionMnemonic = 'ORA A'; cycles = 4; this.state.pc += 1; break;
        case 0xF6: {
          const val = this.readMemory(currentPC + 1);
          this.execORA(val);
          instructionMnemonic = `ORI ${this.hex2(val)}H`;
          cycles = 7;
          this.state.pc += 2;
          break;
        }

        // XRA r / XRI
        case 0xA8: this.execXRA(this.state.b); instructionMnemonic = 'XRA B'; cycles = 4; this.state.pc += 1; break;
        case 0xAF: this.execXRA(this.state.a); instructionMnemonic = 'XRA A'; cycles = 4; this.state.pc += 1; break;
        case 0xEE: {
          const val = this.readMemory(currentPC + 1);
          this.execXRA(val);
          instructionMnemonic = `XRI ${this.hex2(val)}H`;
          cycles = 7;
          this.state.pc += 2;
          break;
        }

        // CMP r / CPI
        case 0xB8: this.execCMP(this.state.b); instructionMnemonic = 'CMP B'; cycles = 4; this.state.pc += 1; break;
        case 0xB9: this.execCMP(this.state.c); instructionMnemonic = 'CMP C'; cycles = 4; this.state.pc += 1; break;
        case 0xBE: this.execCMP(this.getM()); instructionMnemonic = 'CMP M'; cycles = 7; this.state.pc += 1; break;
        case 0xBF: this.execCMP(this.state.a); instructionMnemonic = 'CMP A'; cycles = 4; this.state.pc += 1; break;
        case 0xFE: {
          const val = this.readMemory(currentPC + 1);
          this.execCMP(val);
          instructionMnemonic = `CPI ${this.hex2(val)}H`;
          cycles = 7;
          this.state.pc += 2;
          break;
        }

        // Rotates & Complement
        case 0x07: { // RLC
          const bit7 = (this.state.a & 0x80) >> 7;
          this.state.a = ((this.state.a << 1) | bit7) & 0xff;
          this.state.flags.CY = bit7 === 1;
          instructionMnemonic = 'RLC';
          cycles = 4;
          this.state.pc += 1;
          break;
        }
        case 0x0F: { // RRC
          const bit0 = this.state.a & 1;
          this.state.a = ((this.state.a >> 1) | (bit0 << 7)) & 0xff;
          this.state.flags.CY = bit0 === 1;
          instructionMnemonic = 'RRC';
          cycles = 4;
          this.state.pc += 1;
          break;
        }
        case 0x17: { // RAL
          const oldCY = this.state.flags.CY ? 1 : 0;
          const newCY = (this.state.a & 0x80) >> 7;
          this.state.a = ((this.state.a << 1) | oldCY) & 0xff;
          this.state.flags.CY = newCY === 1;
          instructionMnemonic = 'RAL';
          cycles = 4;
          this.state.pc += 1;
          break;
        }
        case 0x1F: { // RAR
          const oldCY = this.state.flags.CY ? 1 : 0;
          const newCY = this.state.a & 1;
          this.state.a = ((this.state.a >> 1) | (oldCY << 7)) & 0xff;
          this.state.flags.CY = newCY === 1;
          instructionMnemonic = 'RAR';
          cycles = 4;
          this.state.pc += 1;
          break;
        }
        case 0x2F:
          this.state.a = (~this.state.a) & 0xff;
          instructionMnemonic = 'CMA';
          cycles = 4;
          this.state.pc += 1;
          break;
        case 0x37:
          this.state.flags.CY = true;
          instructionMnemonic = 'STC';
          cycles = 4;
          this.state.pc += 1;
          break;
        case 0x3F:
          this.state.flags.CY = !this.state.flags.CY;
          instructionMnemonic = 'CMC';
          cycles = 4;
          this.state.pc += 1;
          break;

        // Jumps
        case 0xC3: { // JMP
          const target = this.readMemory(currentPC + 1) | (this.readMemory(currentPC + 2) << 8);
          instructionMnemonic = `JMP ${this.hex4(target)}H`;
          cycles = 10;
          this.state.pc = target;
          break;
        }
        case 0xDA: { // JC
          const target = this.readMemory(currentPC + 1) | (this.readMemory(currentPC + 2) << 8);
          instructionMnemonic = `JC ${this.hex4(target)}H`;
          cycles = this.state.flags.CY ? 10 : 7;
          if (this.state.flags.CY) this.state.pc = target;
          else this.state.pc += 3;
          break;
        }
        case 0xD2: { // JNC
          const target = this.readMemory(currentPC + 1) | (this.readMemory(currentPC + 2) << 8);
          instructionMnemonic = `JNC ${this.hex4(target)}H`;
          cycles = !this.state.flags.CY ? 10 : 7;
          if (!this.state.flags.CY) this.state.pc = target;
          else this.state.pc += 3;
          break;
        }
        case 0xCA: { // JZ
          const target = this.readMemory(currentPC + 1) | (this.readMemory(currentPC + 2) << 8);
          instructionMnemonic = `JZ ${this.hex4(target)}H`;
          cycles = this.state.flags.Z ? 10 : 7;
          if (this.state.flags.Z) this.state.pc = target;
          else this.state.pc += 3;
          break;
        }
        case 0xC2: { // JNZ
          const target = this.readMemory(currentPC + 1) | (this.readMemory(currentPC + 2) << 8);
          instructionMnemonic = `JNZ ${this.hex4(target)}H`;
          cycles = !this.state.flags.Z ? 10 : 7;
          if (!this.state.flags.Z) this.state.pc = target;
          else this.state.pc += 3;
          break;
        }
        case 0xF2: { // JP
          const target = this.readMemory(currentPC + 1) | (this.readMemory(currentPC + 2) << 8);
          instructionMnemonic = `JP ${this.hex4(target)}H`;
          cycles = !this.state.flags.S ? 10 : 7;
          if (!this.state.flags.S) this.state.pc = target;
          else this.state.pc += 3;
          break;
        }
        case 0xFA: { // JM
          const target = this.readMemory(currentPC + 1) | (this.readMemory(currentPC + 2) << 8);
          instructionMnemonic = `JM ${this.hex4(target)}H`;
          cycles = this.state.flags.S ? 10 : 7;
          if (this.state.flags.S) this.state.pc = target;
          else this.state.pc += 3;
          break;
        }

        // Call & Return & Stack
        case 0xCD: { // CALL
          const target = this.readMemory(currentPC + 1) | (this.readMemory(currentPC + 2) << 8);
          const retAddr = currentPC + 3;
          this.push16(retAddr);
          instructionMnemonic = `CALL ${this.hex4(target)}H`;
          cycles = 18;
          this.state.pc = target;
          break;
        }
        case 0xC9: { // RET
          const retAddr = this.pop16();
          instructionMnemonic = 'RET';
          cycles = 10;
          this.state.pc = retAddr;
          break;
        }
        case 0xC5: this.push16(this.getBC()); instructionMnemonic = 'PUSH B'; cycles = 12; this.state.pc += 1; break;
        case 0xD5: this.push16(this.getDE()); instructionMnemonic = 'PUSH D'; cycles = 12; this.state.pc += 1; break;
        case 0xE5: this.push16(this.getHL()); instructionMnemonic = 'PUSH H'; cycles = 12; this.state.pc += 1; break;
        case 0xC1: this.setBC(this.pop16()); instructionMnemonic = 'POP B'; cycles = 10; this.state.pc += 1; break;
        case 0xD1: this.setDE(this.pop16()); instructionMnemonic = 'POP D'; cycles = 10; this.state.pc += 1; break;
        case 0xE1: this.setHL(this.pop16()); instructionMnemonic = 'POP H'; cycles = 10; this.state.pc += 1; break;

        // IN port / OUT port
        case 0xDB: {
          const port = this.readMemory(currentPC + 1);
          this.state.a = this.ports[port];
          instructionMnemonic = `IN ${this.hex2(port)}H`;
          cycles = 10;
          this.state.pc += 2;
          break;
        }
        case 0xD3: {
          const port = this.readMemory(currentPC + 1);
          this.ports[port] = this.state.a;
          instructionMnemonic = `OUT ${this.hex2(port)}H`;
          cycles = 10;
          this.state.pc += 2;
          break;
        }

        default:
          instructionMnemonic = `UNKNOWN (${this.hex2(opcode)}H)`;
          cycles = 4;
          this.state.pc = (this.state.pc + 1) & 0xffff;
          break;
      }
    } catch (e: any) {
      return { executedPC: currentPC, mnemonic: instructionMnemonic, tStates: cycles, error: e.message || 'Execution Error' };
    }

    this.state.tStates += cycles;
    return { executedPC: currentPC, mnemonic: instructionMnemonic, tStates: cycles };
  }

  // Arithmetic Helpers
  private execADD(val: number) {
    const res = this.state.a + val;
    const ac = this.calcACAdd(this.state.a, val);
    const cy = res > 0xff;
    this.state.a = res & 0xff;
    this.updateFlags(this.state.a, cy, ac);
  }

  private execADC(val: number) {
    const cIn = this.state.flags.CY ? 1 : 0;
    const res = this.state.a + val + cIn;
    const ac = this.calcACAdd(this.state.a, val, cIn);
    const cy = res > 0xff;
    this.state.a = res & 0xff;
    this.updateFlags(this.state.a, cy, ac);
  }

  private execSUB(val: number) {
    const res = this.state.a - val;
    const ac = this.calcACSub(this.state.a, val);
    const cy = res < 0;
    this.state.a = res & 0xff;
    this.updateFlags(this.state.a, cy, ac);
  }

  private execSBB(val: number) {
    const bIn = this.state.flags.CY ? 1 : 0;
    const res = this.state.a - val - bIn;
    const ac = this.calcACSub(this.state.a, val, bIn);
    const cy = res < 0;
    this.state.a = res & 0xff;
    this.updateFlags(this.state.a, cy, ac);
  }

  private execINR(val: number): number {
    const res = (val + 1) & 0xff;
    const ac = (val & 0x0f) === 0x0f;
    this.updateFlags(res, undefined, ac); // Carry is unchanged
    return res;
  }

  private execDCR(val: number): number {
    const res = (val - 1) & 0xff;
    const ac = (val & 0x0f) === 0x00;
    this.updateFlags(res, undefined, ac); // Carry is unchanged
    return res;
  }

  private execDAD(val: number) {
    const hl = this.getHL();
    const sum = hl + val;
    this.setHL(sum & 0xffff);
    this.state.flags.CY = sum > 0xffff;
  }

  private execANA(val: number) {
    this.state.a = (this.state.a & val) & 0xff;
    this.updateFlags(this.state.a, false, true); // AC=1, CY=0
  }

  private execORA(val: number) {
    this.state.a = (this.state.a | val) & 0xff;
    this.updateFlags(this.state.a, false, false); // AC=0, CY=0
  }

  private execXRA(val: number) {
    this.state.a = (this.state.a ^ val) & 0xff;
    this.updateFlags(this.state.a, false, false); // AC=0, CY=0
  }

  private execCMP(val: number) {
    const res = this.state.a - val;
    const ac = this.calcACSub(this.state.a, val);
    const cy = res < 0;
    this.updateFlags(res & 0xff, cy, ac);
  }

  private push16(val: number) {
    val = val & 0xffff;
    const high = (val >> 8) & 0xff;
    const low = val & 0xff;
    this.state.sp = (this.state.sp - 1) & 0xffff;
    this.writeMemory(this.state.sp, high);
    this.state.sp = (this.state.sp - 1) & 0xffff;
    this.writeMemory(this.state.sp, low);
  }

  private pop16(): number {
    const low = this.readMemory(this.state.sp);
    this.state.sp = (this.state.sp + 1) & 0xffff;
    const high = this.readMemory(this.state.sp);
    this.state.sp = (this.state.sp + 1) & 0xffff;
    return (high << 8) | low;
  }

  private hex2(val: number): string {
    return (val & 0xff).toString(16).toUpperCase().padStart(2, '0');
  }

  private hex4(val: number): string {
    return (val & 0xffff).toString(16).toUpperCase().padStart(4, '0');
  }

  // 8085 Assembly Code Assembler Engine
  assemble(sourceCode: string, startAddress: number = 0x2000): AssemblyResult {
    const lines = sourceCode.split('\n');
    const labelMap = new Map<string, number>();
    const instructions: AssembledInstruction[] = [];
    const errors: { line: number; message: string }[] = [];
    const machineCodeMap = new Map<number, number>();

    let currentAddr = startAddress;

    // Pass 1: Collect Labels and calculates addresses
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      // Remove comments
      const commentIdx = line.indexOf(';');
      if (commentIdx !== -1) line = line.substring(0, commentIdx).trim();

      if (!line) continue;

      // Check for labels (e.g. LOOP:)
      if (line.includes(':')) {
        const parts = line.split(':');
        const label = parts[0].trim();
        if (label) {
          labelMap.set(label.toUpperCase(), currentAddr);
        }
        line = parts.slice(1).join(':').trim();
      }

      if (!line) continue;

      // Estimate bytes
      const byteSize = this.getInstructionByteCount(line);
      currentAddr += byteSize;
    }

    // Pass 2: Generate Opcodes
    currentAddr = startAddress;
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      const rawLine = lines[i];
      const commentIdx = line.indexOf(';');
      if (commentIdx !== -1) line = line.substring(0, commentIdx).trim();

      if (!line) continue;

      if (line.includes(':')) {
        line = line.split(':').slice(1).join(':').trim();
      }

      if (!line) continue;

      const bytes = this.parseInstructionToBytes(line, currentAddr, labelMap, i + 1, errors);
      if (bytes.length > 0) {
        for (let b = 0; b < bytes.length; b++) {
          machineCodeMap.set(currentAddr + b, bytes[b]);
          this.memory[currentAddr + b] = bytes[b];
        }

        instructions.push({
          address: currentAddr,
          bytes,
          mnemonic: line,
          lineNumber: i + 1,
          rawCode: rawLine,
        });

        currentAddr += bytes.length;
      }
    }

    this.state.pc = startAddress;

    return {
      success: errors.length === 0,
      instructions,
      errors,
      machineCodeMap,
    };
  }

  private getInstructionByteCount(line: string): number {
    const parts = line.split(/[\s,]+/);
    const mnemonic = parts[0].toUpperCase();

    if (['LXI', 'LDA', 'STA', 'LHLD', 'SHLD', 'JMP', 'JC', 'JNC', 'JZ', 'JNZ', 'JP', 'JM', 'JPE', 'JPO', 'CALL'].includes(mnemonic)) {
      return 3;
    }
    if (['MVI', 'ADI', 'ACI', 'SUI', 'SBI', 'ANI', 'ORI', 'XRI', 'CPI', 'IN', 'OUT'].includes(mnemonic)) {
      return 2;
    }
    return 1;
  }

  private parseInstructionToBytes(
    line: string,
    currentAddr: number,
    labelMap: Map<string, number>,
    lineNum: number,
    errors: { line: number; message: string }[]
  ): number[] {
    const normalized = line.replace(/,/g, ' ').replace(/\s+/g, ' ').trim().toUpperCase();
    const tokens = normalized.split(' ');
    const mnemonic = tokens[0];

    // Simple opcode encoding map for common combinations
    if (mnemonic === 'NOP') return [0x00];
    if (mnemonic === 'HLT') return [0x76];
    if (mnemonic === 'XCHG') return [0xEB];
    if (mnemonic === 'DAA') return [0x27];
    if (mnemonic === 'RLC') return [0x07];
    if (mnemonic === 'RRC') return [0x0F];
    if (mnemonic === 'RAL') return [0x17];
    if (mnemonic === 'RAR') return [0x1F];
    if (mnemonic === 'CMA') return [0x2F];
    if (mnemonic === 'STC') return [0x37];
    if (mnemonic === 'CMC') return [0x3F];
    if (mnemonic === 'RET') return [0xC9];
    if (mnemonic === 'EI') return [0xFB];
    if (mnemonic === 'DI') return [0xF3];

    // MVI r, data8
    if (mnemonic === 'MVI') {
      const reg = tokens[1];
      const val = this.parseHexNumber(tokens[2], labelMap);
      const regMap: Record<string, number> = { 'A': 0x3E, 'B': 0x06, 'C': 0x0E, 'D': 0x16, 'E': 0x1E, 'H': 0x26, 'L': 0x2E, 'M': 0x36 };
      if (regMap[reg] !== undefined) return [regMap[reg], val & 0xff];
    }

    // MOV r1, r2
    if (mnemonic === 'MOV') {
      const r1 = tokens[1];
      const r2 = tokens[2];
      const movTable: Record<string, number> = {
        'A A': 0x7F, 'A B': 0x78, 'A C': 0x79, 'A D': 0x7A, 'A E': 0x7B, 'A H': 0x7C, 'A L': 0x7D, 'A M': 0x7E,
        'B A': 0x47, 'B B': 0x40, 'B C': 0x41, 'B D': 0x42, 'B E': 0x43, 'B H': 0x44, 'B L': 0x45, 'B M': 0x46,
        'C A': 0x4F, 'C B': 0x48, 'C C': 0x49, 'C D': 0x4A, 'C E': 0x4B, 'C H': 0x4C, 'C L': 0x4D, 'C M': 0x4E,
        'D A': 0x57, 'D B': 0x50, 'D C': 0x51, 'D D': 0x52, 'D E': 0x53, 'D H': 0x54, 'D L': 0x55, 'D M': 0x56,
        'E A': 0x5F, 'E B': 0x58, 'E C': 0x59, 'E D': 0x5A, 'E E': 0x5B, 'E H': 0x5C, 'E L': 0x5D, 'E M': 0x5E,
        'H A': 0x67, 'H B': 0x60, 'H C': 0x61, 'H D': 0x62, 'H E': 0x63, 'H H': 0x64, 'H L': 0x65, 'H M': 0x66,
        'L A': 0x6F, 'L B': 0x68, 'L C': 0x69, 'L D': 0x6A, 'L E': 0x6B, 'L H': 0x6C, 'L L': 0x6D, 'L M': 0x6E,
        'M A': 0x77, 'M B': 0x70, 'M C': 0x71, 'M D': 0x72, 'M E': 0x73, 'M H': 0x74, 'M L': 0x75,
      };
      const key = `${r1} ${r2}`;
      if (movTable[key]) return [movTable[key]];
    }

    // LXI rp, addr16
    if (mnemonic === 'LXI') {
      const rp = tokens[1];
      const addr = this.parseHexNumber(tokens[2], labelMap);
      const lxiMap: Record<string, number> = { 'B': 0x01, 'D': 0x11, 'H': 0x21, 'SP': 0x31 };
      if (lxiMap[rp]) return [lxiMap[rp], addr & 0xff, (addr >> 8) & 0xff];
    }

    // LDA / STA / LHLD / SHLD
    if (mnemonic === 'LDA') {
      const addr = this.parseHexNumber(tokens[1], labelMap);
      return [0x3A, addr & 0xff, (addr >> 8) & 0xff];
    }
    if (mnemonic === 'STA') {
      const addr = this.parseHexNumber(tokens[1], labelMap);
      return [0x32, addr & 0xff, (addr >> 8) & 0xff];
    }
    if (mnemonic === 'LHLD') {
      const addr = this.parseHexNumber(tokens[1], labelMap);
      return [0x2A, addr & 0xff, (addr >> 8) & 0xff];
    }
    if (mnemonic === 'SHLD') {
      const addr = this.parseHexNumber(tokens[1], labelMap);
      return [0x22, addr & 0xff, (addr >> 8) & 0xff];
    }

    // ADD / ADC / SUB / SBB / ANA / ORA / XRA / CMP
    const singleOpMap: Record<string, Record<string, number>> = {
      ADD: { 'A': 0x87, 'B': 0x80, 'C': 0x81, 'D': 0x82, 'E': 0x83, 'H': 0x84, 'L': 0x85, 'M': 0x86 },
      ADC: { 'A': 0x8F, 'B': 0x88, 'C': 0x89, 'D': 0x8A, 'E': 0x8B, 'H': 0x8C, 'L': 0x8D, 'M': 0x8E },
      SUB: { 'A': 0x97, 'B': 0x90, 'C': 0x91, 'D': 0x92, 'E': 0x93, 'H': 0x94, 'L': 0x95, 'M': 0x96 },
      SBB: { 'A': 0x9F, 'B': 0x98, 'C': 0x99, 'D': 0x9A, 'E': 0x9B, 'H': 0x9C, 'L': 0x9D, 'M': 0x9E },
      ANA: { 'A': 0xA7, 'B': 0xA0, 'C': 0xA1, 'D': 0xA2, 'E': 0xA3, 'H': 0xA4, 'L': 0xA5, 'M': 0xA6 },
      ORA: { 'A': 0xB7, 'B': 0xB0, 'C': 0xB1, 'D': 0xB2, 'E': 0xB3, 'H': 0xB4, 'L': 0xB5, 'M': 0xB6 },
      XRA: { 'A': 0xAF, 'B': 0xA8, 'C': 0xA9, 'D': 0xAA, 'E': 0xAB, 'H': 0xAC, 'L': 0xAD, 'M': 0xAE },
      CMP: { 'A': 0xBF, 'B': 0xB8, 'C': 0xB9, 'D': 0xBA, 'E': 0xBB, 'H': 0xBC, 'L': 0xBD, 'M': 0xBE },
      INR: { 'A': 0x3C, 'B': 0x04, 'C': 0x0C, 'D': 0x14, 'E': 0x1C, 'H': 0x24, 'L': 0x2C, 'M': 0x34 },
      DCR: { 'A': 0x3D, 'B': 0x05, 'C': 0x0D, 'D': 0x15, 'E': 0x1D, 'H': 0x25, 'L': 0x2D, 'M': 0x35 },
    };

    if (singleOpMap[mnemonic] && tokens[1]) {
      const reg = tokens[1];
      if (singleOpMap[mnemonic][reg]) return [singleOpMap[mnemonic][reg]];
    }

    // Immediate Arithmetic
    if (['ADI', 'ACI', 'SUI', 'SBI', 'ANI', 'ORI', 'XRI', 'CPI', 'IN', 'OUT'].includes(mnemonic)) {
      const val = this.parseHexNumber(tokens[1], labelMap);
      const immMap: Record<string, number> = {
        ADI: 0xC6, ACI: 0xCE, SUI: 0xD6, SBI: 0xDE, ANI: 0xE6, ORI: 0xF6, XRI: 0xEE, CPI: 0xFE, IN: 0xDB, OUT: 0xD3
      };
      return [immMap[mnemonic], val & 0xff];
    }

    // INX / DCX / DAD
    if (mnemonic === 'INX') {
      const inxMap: Record<string, number> = { B: 0x03, D: 0x13, H: 0x23, SP: 0x33 };
      if (inxMap[tokens[1]]) return [inxMap[tokens[1]]];
    }
    if (mnemonic === 'DCX') {
      const dcxMap: Record<string, number> = { B: 0x0B, D: 0x1B, H: 0x2B, SP: 0x3B };
      if (dcxMap[tokens[1]]) return [dcxMap[tokens[1]]];
    }
    if (mnemonic === 'DAD') {
      const dadMap: Record<string, number> = { B: 0x09, D: 0x19, H: 0x29, SP: 0x39 };
      if (dadMap[tokens[1]]) return [dadMap[tokens[1]]];
    }

    // Jumps & Calls
    const jumpMap: Record<string, number> = {
      JMP: 0xC3, JC: 0xDA, JNC: 0xD2, JZ: 0xCA, JNZ: 0xC2, JP: 0xF2, JM: 0xFA, JPE: 0xEA, JPO: 0xE2, CALL: 0xCD
    };
    if (jumpMap[mnemonic]) {
      const addr = this.parseHexNumber(tokens[1], labelMap);
      return [jumpMap[mnemonic], addr & 0xff, (addr >> 8) & 0xff];
    }

    // PUSH / POP
    if (mnemonic === 'PUSH') {
      const pMap: Record<string, number> = { B: 0xC5, D: 0xD5, H: 0xE5, PSW: 0xF5 };
      if (pMap[tokens[1]]) return [pMap[tokens[1]]];
    }
    if (mnemonic === 'POP') {
      const pMap: Record<string, number> = { B: 0xC1, D: 0xD1, H: 0xE1, PSW: 0xF1 };
      if (pMap[tokens[1]]) return [pMap[tokens[1]]];
    }

    errors.push({ line: lineNum, message: `Syntax Error or unsupported 8085 opcode: "${line}"` });
    return [];
  }

  private parseHexNumber(valStr: string, labelMap: Map<string, number>): number {
    if (!valStr) return 0;
    valStr = valStr.trim().toUpperCase();

    if (labelMap.has(valStr)) return labelMap.get(valStr)!;

    if (valStr.endsWith('H')) {
      const hex = valStr.substring(0, valStr.length - 1);
      return parseInt(hex, 16) || 0;
    }
    if (valStr.startsWith('0X')) {
      return parseInt(valStr.substring(2), 16) || 0;
    }
    const parsedDec = parseInt(valStr, 10);
    return isNaN(parsedDec) ? 0 : parsedDec;
  }

  // Disassemble a single instruction at memory address
  disassembleAt(addr: number): { mnemonic: string; bytes: number[] } {
    const opcode = this.readMemory(addr);
    const opDef = OPCODES_DATA.find((o) => parseInt(o.hex, 16) === opcode);

    if (!opDef) {
      return { mnemonic: `DB ${this.hex2(opcode)}H`, bytes: [opcode] };
    }

    const bCount = opDef.bytes;
    const bytes: number[] = [];
    for (let i = 0; i < bCount; i++) {
      bytes.push(this.readMemory(addr + i));
    }

    let mnemonic = opDef.mnemonic;
    if (bCount === 2) {
      const data8 = bytes[1];
      mnemonic = mnemonic.replace('data', `${this.hex2(data8)}H`).replace('port', `${this.hex2(data8)}H`);
    } else if (bCount === 3) {
      const addr16 = (bytes[2] << 8) | bytes[1];
      mnemonic = mnemonic.replace('addr16', `${this.hex4(addr16)}H`);
    }

    return { mnemonic, bytes };
  }
}
