import { OpcodeDef } from '../types';

export const OPCODES_DATA: OpcodeDef[] = [
  // --- DATA TRANSFER INSTRUCTIONS ---
  // MOV destination, source (63 opcodes)
  { hex: '40', mnemonic: 'MOV B, B', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of B to B', example: 'MOV B, B' },
  { hex: '41', mnemonic: 'MOV B, C', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of C to B', example: 'MOV B, C' },
  { hex: '42', mnemonic: 'MOV B, D', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of D to B', example: 'MOV B, D' },
  { hex: '43', mnemonic: 'MOV B, E', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of E to B', example: 'MOV B, E' },
  { hex: '44', mnemonic: 'MOV B, H', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of H to B', example: 'MOV B, H' },
  { hex: '45', mnemonic: 'MOV B, L', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of L to B', example: 'MOV B, L' },
  { hex: '46', mnemonic: 'MOV B, M', bytes: 1, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy memory byte at [HL] to B', example: 'MOV B, M' },
  { hex: '47', mnemonic: 'MOV B, A', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of A to B', example: 'MOV B, A' },

  { hex: '48', mnemonic: 'MOV C, B', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of B to C', example: 'MOV C, B' },
  { hex: '49', mnemonic: 'MOV C, C', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of C to C', example: 'MOV C, C' },
  { hex: '4A', mnemonic: 'MOV C, D', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of D to C', example: 'MOV C, D' },
  { hex: '4B', mnemonic: 'MOV C, E', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of E to C', example: 'MOV C, E' },
  { hex: '4C', mnemonic: 'MOV C, H', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of H to C', example: 'MOV C, H' },
  { hex: '4D', mnemonic: 'MOV C, L', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of L to C', example: 'MOV C, L' },
  { hex: '4E', mnemonic: 'MOV C, M', bytes: 1, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy memory byte at [HL] to C', example: 'MOV C, M' },
  { hex: '4F', mnemonic: 'MOV C, A', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of A to C', example: 'MOV C, A' },

  { hex: '50', mnemonic: 'MOV D, B', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of B to D', example: 'MOV D, B' },
  { hex: '51', mnemonic: 'MOV D, C', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of C to D', example: 'MOV D, C' },
  { hex: '52', mnemonic: 'MOV D, D', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of D to D', example: 'MOV D, D' },
  { hex: '53', mnemonic: 'MOV D, E', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of E to D', example: 'MOV D, E' },
  { hex: '54', mnemonic: 'MOV D, H', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of H to D', example: 'MOV D, H' },
  { hex: '55', mnemonic: 'MOV D, L', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of L to D', example: 'MOV D, L' },
  { hex: '56', mnemonic: 'MOV D, M', bytes: 1, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy memory byte at [HL] to D', example: 'MOV D, M' },
  { hex: '57', mnemonic: 'MOV D, A', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of A to D', example: 'MOV D, A' },

  { hex: '58', mnemonic: 'MOV E, B', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of B to E', example: 'MOV E, B' },
  { hex: '59', mnemonic: 'MOV E, C', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of C to E', example: 'MOV E, C' },
  { hex: '5A', mnemonic: 'MOV E, D', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of D to E', example: 'MOV E, D' },
  { hex: '5B', mnemonic: 'MOV E, E', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of E to E', example: 'MOV E, E' },
  { hex: '5C', mnemonic: 'MOV E, H', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of H to E', example: 'MOV E, H' },
  { hex: '5D', mnemonic: 'MOV E, L', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of L to E', example: 'MOV E, L' },
  { hex: '5E', mnemonic: 'MOV E, M', bytes: 1, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy memory byte at [HL] to E', example: 'MOV E, M' },
  { hex: '5F', mnemonic: 'MOV E, A', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of A to E', example: 'MOV E, A' },

  { hex: '60', mnemonic: 'MOV H, B', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of B to H', example: 'MOV H, B' },
  { hex: '61', mnemonic: 'MOV H, C', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of C to H', example: 'MOV H, C' },
  { hex: '62', mnemonic: 'MOV H, D', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of D to H', example: 'MOV H, D' },
  { hex: '63', mnemonic: 'MOV H, E', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of E to H', example: 'MOV H, E' },
  { hex: '64', mnemonic: 'MOV H, H', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of H to H', example: 'MOV H, H' },
  { hex: '65', mnemonic: 'MOV H, L', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of L to H', example: 'MOV H, L' },
  { hex: '66', mnemonic: 'MOV H, M', bytes: 1, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy memory byte at [HL] to H', example: 'MOV H, M' },
  { hex: '67', mnemonic: 'MOV H, A', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of A to H', example: 'MOV H, A' },

  { hex: '68', mnemonic: 'MOV L, B', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of B to L', example: 'MOV L, B' },
  { hex: '69', mnemonic: 'MOV L, C', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of C to L', example: 'MOV L, C' },
  { hex: '6A', mnemonic: 'MOV L, D', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of D to L', example: 'MOV L, D' },
  { hex: '6B', mnemonic: 'MOV L, E', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of E to L', example: 'MOV L, E' },
  { hex: '6C', mnemonic: 'MOV L, H', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of H to L', example: 'MOV L, H' },
  { hex: '6D', mnemonic: 'MOV L, L', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of L to L', example: 'MOV L, L' },
  { hex: '6E', mnemonic: 'MOV L, M', bytes: 1, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy memory byte at [HL] to L', example: 'MOV L, M' },
  { hex: '6F', mnemonic: 'MOV L, A', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of A to L', example: 'MOV L, A' },

  { hex: '70', mnemonic: 'MOV M, B', bytes: 1, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of B to memory [HL]', example: 'MOV M, B' },
  { hex: '71', mnemonic: 'MOV M, C', bytes: 1, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of C to memory [HL]', example: 'MOV M, C' },
  { hex: '72', mnemonic: 'MOV M, D', bytes: 1, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of D to memory [HL]', example: 'MOV M, D' },
  { hex: '73', mnemonic: 'MOV M, E', bytes: 1, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of E to memory [HL]', example: 'MOV M, E' },
  { hex: '74', mnemonic: 'MOV M, H', bytes: 1, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of H to memory [HL]', example: 'MOV M, H' },
  { hex: '75', mnemonic: 'MOV M, L', bytes: 1, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of L to memory [HL]', example: 'MOV M, L' },
  { hex: '77', mnemonic: 'MOV M, A', bytes: 1, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of A to memory [HL]', example: 'MOV M, A' },

  { hex: '78', mnemonic: 'MOV A, B', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of B to Accumulator A', example: 'MOV A, B' },
  { hex: '79', mnemonic: 'MOV A, C', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of C to Accumulator A', example: 'MOV A, C' },
  { hex: '7A', mnemonic: 'MOV A, D', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of D to Accumulator A', example: 'MOV A, D' },
  { hex: '7B', mnemonic: 'MOV A, E', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of E to Accumulator A', example: 'MOV A, E' },
  { hex: '7C', mnemonic: 'MOV A, H', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of H to Accumulator A', example: 'MOV A, H' },
  { hex: '7D', mnemonic: 'MOV A, L', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of L to Accumulator A', example: 'MOV A, L' },
  { hex: '7E', mnemonic: 'MOV A, M', bytes: 1, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy memory byte at [HL] to A', example: 'MOV A, M' },
  { hex: '7F', mnemonic: 'MOV A, A', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy content of A to A', example: 'MOV A, A' },

  // Immediate Moves (MVI, LXI)
  { hex: '06', mnemonic: 'MVI B, data', bytes: 2, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Move 8-bit immediate data into B', example: 'MVI B, 05H' },
  { hex: '0E', mnemonic: 'MVI C, data', bytes: 2, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Move 8-bit immediate data into C', example: 'MVI C, 0AH' },
  { hex: '16', mnemonic: 'MVI D, data', bytes: 2, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Move 8-bit immediate data into D', example: 'MVI D, 12H' },
  { hex: '1E', mnemonic: 'MVI E, data', bytes: 2, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Move 8-bit immediate data into E', example: 'MVI E, 20H' },
  { hex: '26', mnemonic: 'MVI H, data', bytes: 2, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Move 8-bit immediate data into H', example: 'MVI H, 30H' },
  { hex: '2E', mnemonic: 'MVI L, data', bytes: 2, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Move 8-bit immediate data into L', example: 'MVI L, 40H' },
  { hex: '36', mnemonic: 'MVI M, data', bytes: 2, tStates: '10', category: 'Data Transfer', flagsAffected: 'None', description: 'Move 8-bit immediate data into memory [HL]', example: 'MVI M, FFH' },
  { hex: '3E', mnemonic: 'MVI A, data', bytes: 2, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Move 8-bit immediate data into Accumulator A', example: 'MVI A, 80H' },

  { hex: '01', mnemonic: 'LXI B, addr16', bytes: 3, tStates: '10', category: 'Data Transfer', flagsAffected: 'None', description: 'Load 16-bit address into BC pair', example: 'LXI B, 1000H' },
  { hex: '11', mnemonic: 'LXI D, addr16', bytes: 3, tStates: '10', category: 'Data Transfer', flagsAffected: 'None', description: 'Load 16-bit address into DE pair', example: 'LXI D, 2000H' },
  { hex: '21', mnemonic: 'LXI H, addr16', bytes: 3, tStates: '10', category: 'Data Transfer', flagsAffected: 'None', description: 'Load 16-bit address into HL pair', example: 'LXI H, 2050H' },
  { hex: '31', mnemonic: 'LXI SP, addr16', bytes: 3, tStates: '10', category: 'Data Transfer', flagsAffected: 'None', description: 'Load 16-bit address into Stack Pointer', example: 'LXI SP, 30FFH' },

  // Direct / Indirect Loads & Stores
  { hex: '3A', mnemonic: 'LDA addr16', bytes: 3, tStates: '13', category: 'Data Transfer', flagsAffected: 'None', description: 'Load Accumulator A directly from 16-bit memory address', example: 'LDA 2050H' },
  { hex: '32', mnemonic: 'STA addr16', bytes: 3, tStates: '13', category: 'Data Transfer', flagsAffected: 'None', description: 'Store Accumulator A directly to 16-bit memory address', example: 'STA 2052H' },
  { hex: '2A', mnemonic: 'LHLD addr16', bytes: 3, tStates: '16', category: 'Data Transfer', flagsAffected: 'None', description: 'Load HL registers directly from 16-bit memory address', example: 'LHLD 2050H' },
  { hex: '22', mnemonic: 'SHLD addr16', bytes: 3, tStates: '16', category: 'Data Transfer', flagsAffected: 'None', description: 'Store HL registers directly to 16-bit memory address', example: 'SHLD 2052H' },
  { hex: '0A', mnemonic: 'LDAX B', bytes: 1, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Load A indirectly from address in BC pair', example: 'LDAX B' },
  { hex: '1A', mnemonic: 'LDAX D', bytes: 1, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Load A indirectly from address in DE pair', example: 'LDAX D' },
  { hex: '02', mnemonic: 'STAX B', bytes: 1, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Store A indirectly to address in BC pair', example: 'STAX B' },
  { hex: '12', mnemonic: 'STAX D', bytes: 1, tStates: '7', category: 'Data Transfer', flagsAffected: 'None', description: 'Store A indirectly to address in DE pair', example: 'STAX D' },
  { hex: 'EB', mnemonic: 'XCHG', bytes: 1, tStates: '4', category: 'Data Transfer', flagsAffected: 'None', description: 'Exchange contents of HL pair with DE pair', example: 'XCHG' },
  { hex: 'F9', mnemonic: 'SPHL', bytes: 1, tStates: '6', category: 'Data Transfer', flagsAffected: 'None', description: 'Copy HL pair into Stack Pointer SP', example: 'SPHL' },
  { hex: 'E9', mnemonic: 'PCHL', bytes: 1, tStates: '6', category: 'Data Transfer', flagsAffected: 'None', description: 'Load Program Counter PC from HL pair', example: 'PCHL' },
  { hex: 'E3', mnemonic: 'XTHL', bytes: 1, tStates: '16', category: 'Data Transfer', flagsAffected: 'None', description: 'Exchange top of stack with HL pair', example: 'XTHL' },

  // --- ARITHMETIC INSTRUCTIONS ---
  // ADD register/memory (8 opcodes)
  { hex: '80', mnemonic: 'ADD B', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Add B with A store result in A', example: 'ADD B' },
  { hex: '81', mnemonic: 'ADD C', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Add C with A store result in A', example: 'ADD C' },
  { hex: '82', mnemonic: 'ADD D', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Add D with A store result in A', example: 'ADD D' },
  { hex: '83', mnemonic: 'ADD E', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Add E with A store result in A', example: 'ADD E' },
  { hex: '84', mnemonic: 'ADD H', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Add H with A store result in A', example: 'ADD H' },
  { hex: '85', mnemonic: 'ADD L', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Add L with A store result in A', example: 'ADD L' },
  { hex: '86', mnemonic: 'ADD M', bytes: 1, tStates: '7', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Add memory byte at [HL] with A store result in A', example: 'ADD M' },
  { hex: '87', mnemonic: 'ADD A', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Add A with A store result in A', example: 'ADD A' },

  // ADC register/memory with Carry (8 opcodes)
  { hex: '88', mnemonic: 'ADC B', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Add B with CY flag to A', example: 'ADC B' },
  { hex: '89', mnemonic: 'ADC C', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Add C with CY flag to A', example: 'ADC C' },
  { hex: '8A', mnemonic: 'ADC D', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Add D with CY flag to A', example: 'ADC D' },
  { hex: '8B', mnemonic: 'ADC E', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Add E with CY flag to A', example: 'ADC E' },
  { hex: '8C', mnemonic: 'ADC H', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Add H with CY flag to A', example: 'ADC H' },
  { hex: '8D', mnemonic: 'ADC L', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Add L with CY flag to A', example: 'ADC L' },
  { hex: '8E', mnemonic: 'ADC M', bytes: 1, tStates: '7', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Add M with CY flag to A', example: 'ADC M' },
  { hex: '8F', mnemonic: 'ADC A', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Add A with CY flag to A', example: 'ADC A' },

  // SUB register/memory (8 opcodes)
  { hex: '90', mnemonic: 'SUB B', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Subtract B from A store result in A', example: 'SUB B' },
  { hex: '91', mnemonic: 'SUB C', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Subtract C from A store result in A', example: 'SUB C' },
  { hex: '92', mnemonic: 'SUB D', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Subtract D from A store result in A', example: 'SUB D' },
  { hex: '93', mnemonic: 'SUB E', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Subtract E from A store result in A', example: 'SUB E' },
  { hex: '94', mnemonic: 'SUB H', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Subtract H from A store result in A', example: 'SUB H' },
  { hex: '95', mnemonic: 'SUB L', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Subtract L from A store result in A', example: 'SUB L' },
  { hex: '96', mnemonic: 'SUB M', bytes: 1, tStates: '7', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Subtract memory byte [HL] from A', example: 'SUB M' },
  { hex: '97', mnemonic: 'SUB A', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Subtract A from A (Result = 00H)', example: 'SUB A' },

  // SBB register/memory with Borrow (8 opcodes)
  { hex: '98', mnemonic: 'SBB B', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Subtract B and Borrow from A', example: 'SBB B' },
  { hex: '99', mnemonic: 'SBB C', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Subtract C and Borrow from A', example: 'SBB C' },
  { hex: '9A', mnemonic: 'SBB D', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Subtract D and Borrow from A', example: 'SBB D' },
  { hex: '9B', mnemonic: 'SBB E', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Subtract E and Borrow from A', example: 'SBB E' },
  { hex: '9C', mnemonic: 'SBB H', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Subtract H and Borrow from A', example: 'SBB H' },
  { hex: '9D', mnemonic: 'SBB L', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Subtract L and Borrow from A', example: 'SBB L' },
  { hex: '9E', mnemonic: 'SBB M', bytes: 1, tStates: '7', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Subtract M and Borrow from A', example: 'SBB M' },
  { hex: '9F', mnemonic: 'SBB A', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Subtract A and Borrow from A', example: 'SBB A' },

  // Immediate Arithmetic
  { hex: 'C6', mnemonic: 'ADI 8 Bit', bytes: 2, tStates: '7', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Add immediate 8-bit data to Accumulator A', example: 'ADI 05H' },
  { hex: 'CE', mnemonic: 'ACI 8 Bit', bytes: 2, tStates: '7', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Add immediate data with CY flag to Accumulator A', example: 'ACI 01H' },
  { hex: 'D6', mnemonic: 'SUI 8 Bit', bytes: 2, tStates: '7', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Subtract immediate 8-bit data from Accumulator A', example: 'SUI 10H' },
  { hex: 'DE', mnemonic: 'SBI 8 Bit', bytes: 2, tStates: '7', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Subtract immediate data and Borrow from Accumulator', example: 'SBI 02H' },

  // INR Register / Memory
  { hex: '04', mnemonic: 'INR B', bytes: 1, tStates: '5', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P', description: 'Increment register B by 1', example: 'INR B' },
  { hex: '0C', mnemonic: 'INR C', bytes: 1, tStates: '5', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P', description: 'Increment register C by 1', example: 'INR C' },
  { hex: '14', mnemonic: 'INR D', bytes: 1, tStates: '5', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P', description: 'Increment register D by 1', example: 'INR D' },
  { hex: '1C', mnemonic: 'INR E', bytes: 1, tStates: '5', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P', description: 'Increment register E by 1', example: 'INR E' },
  { hex: '24', mnemonic: 'INR H', bytes: 1, tStates: '5', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P', description: 'Increment register H by 1', example: 'INR H' },
  { hex: '2C', mnemonic: 'INR L', bytes: 1, tStates: '5', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P', description: 'Increment register L by 1', example: 'INR L' },
  { hex: '34', mnemonic: 'INR M', bytes: 1, tStates: '10', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P', description: 'Increment memory byte at [HL] by 1', example: 'INR M' },
  { hex: '3C', mnemonic: 'INR A', bytes: 1, tStates: '5', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P', description: 'Increment Accumulator A by 1', example: 'INR A' },

  // DCR Register / Memory
  { hex: '05', mnemonic: 'DCR B', bytes: 1, tStates: '5', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P', description: 'Decrement register B by 1', example: 'DCR B' },
  { hex: '0D', mnemonic: 'DCR C', bytes: 1, tStates: '5', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P', description: 'Decrement register C by 1', example: 'DCR C' },
  { hex: '15', mnemonic: 'DCR D', bytes: 1, tStates: '5', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P', description: 'Decrement register D by 1', example: 'DCR D' },
  { hex: '1D', mnemonic: 'DCR E', bytes: 1, tStates: '5', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P', description: 'Decrement register E by 1', example: 'DCR E' },
  { hex: '25', mnemonic: 'DCR H', bytes: 1, tStates: '5', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P', description: 'Decrement register H by 1', example: 'DCR H' },
  { hex: '2D', mnemonic: 'DCR L', bytes: 1, tStates: '5', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P', description: 'Decrement register L by 1', example: 'DCR L' },
  { hex: '35', mnemonic: 'DCR M', bytes: 1, tStates: '10', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P', description: 'Decrement memory byte at [HL] by 1', example: 'DCR M' },
  { hex: '3D', mnemonic: 'DCR A', bytes: 1, tStates: '5', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P', description: 'Decrement Accumulator A by 1', example: 'DCR A' },

  // INX & DCX Register Pair
  { hex: '03', mnemonic: 'INX B', bytes: 1, tStates: '6', category: 'Arithmetic', flagsAffected: 'None', description: 'Increment 16-bit register pair BC by 1', example: 'INX B' },
  { hex: '13', mnemonic: 'INX D', bytes: 1, tStates: '6', category: 'Arithmetic', flagsAffected: 'None', description: 'Increment 16-bit register pair DE by 1', example: 'INX D' },
  { hex: '23', mnemonic: 'INX H', bytes: 1, tStates: '6', category: 'Arithmetic', flagsAffected: 'None', description: 'Increment 16-bit register pair HL by 1', example: 'INX H' },
  { hex: '33', mnemonic: 'INX SP', bytes: 1, tStates: '6', category: 'Arithmetic', flagsAffected: 'None', description: 'Increment Stack Pointer SP by 1', example: 'INX SP' },

  { hex: '0B', mnemonic: 'DCX B', bytes: 1, tStates: '6', category: 'Arithmetic', flagsAffected: 'None', description: 'Decrement 16-bit register pair BC by 1', example: 'DCX B' },
  { hex: '1B', mnemonic: 'DCX D', bytes: 1, tStates: '6', category: 'Arithmetic', flagsAffected: 'None', description: 'Decrement 16-bit register pair DE by 1', example: 'DCX D' },
  { hex: '2B', mnemonic: 'DCX H', bytes: 1, tStates: '6', category: 'Arithmetic', flagsAffected: 'None', description: 'Decrement 16-bit register pair HL by 1', example: 'DCX H' },
  { hex: '3B', mnemonic: 'DCX SP', bytes: 1, tStates: '6', category: 'Arithmetic', flagsAffected: 'None', description: 'Decrement Stack Pointer SP by 1', example: 'DCX SP' },

  // DAD Register Pair Addition to HL
  { hex: '09', mnemonic: 'DAD B', bytes: 1, tStates: '10', category: 'Arithmetic', flagsAffected: 'CY', description: 'Add 16-bit register pair BC to HL pair', example: 'DAD B' },
  { hex: '19', mnemonic: 'DAD D', bytes: 1, tStates: '10', category: 'Arithmetic', flagsAffected: 'CY', description: 'Add 16-bit register pair DE to HL pair', example: 'DAD D' },
  { hex: '29', mnemonic: 'DAD H', bytes: 1, tStates: '10', category: 'Arithmetic', flagsAffected: 'CY', description: 'Add 16-bit register pair HL to HL pair', example: 'DAD H' },
  { hex: '39', mnemonic: 'DAD SP', bytes: 1, tStates: '10', category: 'Arithmetic', flagsAffected: 'CY', description: 'Add Stack Pointer SP to HL pair', example: 'DAD SP' },

  { hex: '27', mnemonic: 'DAA', bytes: 1, tStates: '4', category: 'Arithmetic', flagsAffected: 'S, Z, AC, P, CY', description: 'Decimal Adjust Accumulator for BCD addition', example: 'DAA' },

  // --- LOGICAL INSTRUCTIONS ---
  // ANA (8 opcodes)
  { hex: 'A0', mnemonic: 'ANA B', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=1', description: 'Logical AND B with Accumulator A', example: 'ANA B' },
  { hex: 'A1', mnemonic: 'ANA C', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=1', description: 'Logical AND C with Accumulator A', example: 'ANA C' },
  { hex: 'A2', mnemonic: 'ANA D', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=1', description: 'Logical AND D with Accumulator A', example: 'ANA D' },
  { hex: 'A3', mnemonic: 'ANA E', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=1', description: 'Logical AND E with Accumulator A', example: 'ANA E' },
  { hex: 'A4', mnemonic: 'ANA H', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=1', description: 'Logical AND H with Accumulator A', example: 'ANA H' },
  { hex: 'A5', mnemonic: 'ANA L', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=1', description: 'Logical AND L with Accumulator A', example: 'ANA L' },
  { hex: 'A6', mnemonic: 'ANA M', bytes: 1, tStates: '7', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=1', description: 'Logical AND memory [HL] with Accumulator A', example: 'ANA M' },
  { hex: 'A7', mnemonic: 'ANA A', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=1', description: 'Logical AND A with Accumulator A', example: 'ANA A' },

  // XRA (8 opcodes)
  { hex: 'A8', mnemonic: 'XRA B', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=0', description: 'Exclusive OR B with Accumulator A', example: 'XRA B' },
  { hex: 'A9', mnemonic: 'XRA C', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=0', description: 'Exclusive OR C with Accumulator A', example: 'XRA C' },
  { hex: 'AA', mnemonic: 'XRA D', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=0', description: 'Exclusive OR D with Accumulator A', example: 'XRA D' },
  { hex: 'AB', mnemonic: 'XRA E', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=0', description: 'Exclusive OR E with Accumulator A', example: 'XRA E' },
  { hex: 'AC', mnemonic: 'XRA H', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=0', description: 'Exclusive OR H with Accumulator A', example: 'XRA H' },
  { hex: 'AD', mnemonic: 'XRA L', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=0', description: 'Exclusive OR L with Accumulator A', example: 'XRA L' },
  { hex: 'AE', mnemonic: 'XRA M', bytes: 1, tStates: '7', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=0', description: 'Exclusive OR memory [HL] with Accumulator A', example: 'XRA M' },
  { hex: 'AF', mnemonic: 'XRA A', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S=0, Z=1, P=1, CY=0, AC=0', description: 'Clear Accumulator A to 00H', example: 'XRA A' },

  // ORA (8 opcodes)
  { hex: 'B0', mnemonic: 'ORA B', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=0', description: 'Inclusive OR B with Accumulator A', example: 'ORA B' },
  { hex: 'B1', mnemonic: 'ORA C', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=0', description: 'Inclusive OR C with Accumulator A', example: 'ORA C' },
  { hex: 'B2', mnemonic: 'ORA D', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=0', description: 'Inclusive OR D with Accumulator A', example: 'ORA D' },
  { hex: 'B3', mnemonic: 'ORA E', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=0', description: 'Inclusive OR E with Accumulator A', example: 'ORA E' },
  { hex: 'B4', mnemonic: 'ORA H', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=0', description: 'Inclusive OR H with Accumulator A', example: 'ORA H' },
  { hex: 'B5', mnemonic: 'ORA L', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=0', description: 'Inclusive OR L with Accumulator A', example: 'ORA L' },
  { hex: 'B6', mnemonic: 'ORA M', bytes: 1, tStates: '7', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=0', description: 'Inclusive OR memory [HL] with Accumulator A', example: 'ORA M' },
  { hex: 'B7', mnemonic: 'ORA A', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=0', description: 'Inclusive OR A with Accumulator A', example: 'ORA A' },

  // CMP (8 opcodes)
  { hex: 'B8', mnemonic: 'CMP B', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, AC, P, CY', description: 'Compare B with Accumulator A', example: 'CMP B' },
  { hex: 'B9', mnemonic: 'CMP C', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, AC, P, CY', description: 'Compare C with Accumulator A', example: 'CMP C' },
  { hex: 'BA', mnemonic: 'CMP D', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, AC, P, CY', description: 'Compare D with Accumulator A', example: 'CMP D' },
  { hex: 'BB', mnemonic: 'CMP E', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, AC, P, CY', description: 'Compare E with Accumulator A', example: 'CMP E' },
  { hex: 'BC', mnemonic: 'CMP H', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, AC, P, CY', description: 'Compare H with Accumulator A', example: 'CMP H' },
  { hex: 'BD', mnemonic: 'CMP L', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, AC, P, CY', description: 'Compare L with Accumulator A', example: 'CMP L' },
  { hex: 'BE', mnemonic: 'CMP M', bytes: 1, tStates: '7', category: 'Logical', flagsAffected: 'S, Z, AC, P, CY', description: 'Compare memory byte at [HL] with Accumulator A', example: 'CMP M' },
  { hex: 'BF', mnemonic: 'CMP A', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'S, Z, AC, P, CY', description: 'Compare A with Accumulator A', example: 'CMP A' },

  // Immediate Logic
  { hex: 'E6', mnemonic: 'ANI 8 Bit', bytes: 2, tStates: '7', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=1', description: 'Logical AND immediate data with Accumulator A', example: 'ANI 0FH' },
  { hex: 'EE', mnemonic: 'XRI 8 Bit', bytes: 2, tStates: '7', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=0', description: 'Exclusive OR immediate data with Accumulator A', example: 'XRI FFH' },
  { hex: 'F6', mnemonic: 'ORI 8 Bit', bytes: 2, tStates: '7', category: 'Logical', flagsAffected: 'S, Z, P, CY=0, AC=0', description: 'Inclusive OR immediate data with Accumulator A', example: 'ORI 80H' },
  { hex: 'FE', mnemonic: 'CPI 8 Bit', bytes: 2, tStates: '7', category: 'Logical', flagsAffected: 'S, Z, AC, P, CY', description: 'Compare immediate 8-bit data with Accumulator A', example: 'CPI 00H' },

  // Rotates & Flag Operations
  { hex: '07', mnemonic: 'RLC', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'CY', description: 'Rotate Accumulator left by 1 bit', example: 'RLC' },
  { hex: '0F', mnemonic: 'RRC', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'CY', description: 'Rotate Accumulator right by 1 bit', example: 'RRC' },
  { hex: '17', mnemonic: 'RAL', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'CY', description: 'Rotate Accumulator left through Carry', example: 'RAL' },
  { hex: '1F', mnemonic: 'RAR', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'CY', description: 'Rotate Accumulator right through Carry', example: 'RAR' },
  { hex: '2F', mnemonic: 'CMA', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'None', description: 'Complement Accumulator (Invert bits)', example: 'CMA' },
  { hex: '37', mnemonic: 'STC', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'CY=1', description: 'Set Carry flag to 1', example: 'STC' },
  { hex: '3F', mnemonic: 'CMC', bytes: 1, tStates: '4', category: 'Logical', flagsAffected: 'CY', description: 'Complement Carry flag', example: 'CMC' },

  // --- BRANCHING INSTRUCTIONS ---
  // Unconditional & Conditional Jumps
  { hex: 'C3', mnemonic: 'JMP addr16', bytes: 3, tStates: '10', category: 'Branching', flagsAffected: 'None', description: 'Unconditional jump to 16-bit address', example: 'JMP 2000H' },
  { hex: 'C2', mnemonic: 'JNZ addr16', bytes: 3, tStates: '10/7', category: 'Branching', flagsAffected: 'None', description: 'Jump if Zero flag Z = 0 (Not Zero)', example: 'JNZ 2008H' },
  { hex: 'CA', mnemonic: 'JZ addr16', bytes: 3, tStates: '10/7', category: 'Branching', flagsAffected: 'None', description: 'Jump if Zero flag Z = 1 (Zero)', example: 'JZ 2030H' },
  { hex: 'D2', mnemonic: 'JNC addr16', bytes: 3, tStates: '10/7', category: 'Branching', flagsAffected: 'None', description: 'Jump if Carry flag CY = 0 (No Carry)', example: 'JNC 2020H' },
  { hex: 'DA', mnemonic: 'JC addr16', bytes: 3, tStates: '10/7', category: 'Branching', flagsAffected: 'None', description: 'Jump if Carry flag CY = 1 (Carry)', example: 'JC 2015H' },
  { hex: 'E2', mnemonic: 'JPO addr16', bytes: 3, tStates: '10/7', category: 'Branching', flagsAffected: 'None', description: 'Jump if Parity Odd P = 0', example: 'JPO 2055H' },
  { hex: 'EA', mnemonic: 'JPE addr16', bytes: 3, tStates: '10/7', category: 'Branching', flagsAffected: 'None', description: 'Jump if Parity Even P = 1', example: 'JPE 2050H' },
  { hex: 'F2', mnemonic: 'JP addr16', bytes: 3, tStates: '10/7', category: 'Branching', flagsAffected: 'None', description: 'Jump if Plus/Positive S = 0', example: 'JP 2040H' },
  { hex: 'FA', mnemonic: 'JM addr16', bytes: 3, tStates: '10/7', category: 'Branching', flagsAffected: 'None', description: 'Jump if Minus/Negative S = 1', example: 'JM 2045H' },

  // Calls
  { hex: 'CD', mnemonic: 'CALL addr16', bytes: 3, tStates: '18', category: 'Branching', flagsAffected: 'None', description: 'Call subroutine unconditionally', example: 'CALL 3000H' },
  { hex: 'C4', mnemonic: 'CNZ addr16', bytes: 3, tStates: '18/9', category: 'Branching', flagsAffected: 'None', description: 'Call if Not Zero (Z = 0)', example: 'CNZ 3000H' },
  { hex: 'CC', mnemonic: 'CZ addr16', bytes: 3, tStates: '18/9', category: 'Branching', flagsAffected: 'None', description: 'Call if Zero (Z = 1)', example: 'CZ 3000H' },
  { hex: 'D4', mnemonic: 'CNC addr16', bytes: 3, tStates: '18/9', category: 'Branching', flagsAffected: 'None', description: 'Call if No Carry (CY = 0)', example: 'CNC 3000H' },
  { hex: 'DC', mnemonic: 'CC addr16', bytes: 3, tStates: '18/9', category: 'Branching', flagsAffected: 'None', description: 'Call if Carry (CY = 1)', example: 'CC 3000H' },
  { hex: 'E4', mnemonic: 'CPO addr16', bytes: 3, tStates: '18/9', category: 'Branching', flagsAffected: 'None', description: 'Call if Parity Odd (P = 0)', example: 'CPO 3000H' },
  { hex: 'EC', mnemonic: 'CPE addr16', bytes: 3, tStates: '18/9', category: 'Branching', flagsAffected: 'None', description: 'Call if Parity Even (P = 1)', example: 'CPE 3000H' },
  { hex: 'F4', mnemonic: 'CP addr16', bytes: 3, tStates: '18/9', category: 'Branching', flagsAffected: 'None', description: 'Call if Plus/Positive (S = 0)', example: 'CP 3000H' },
  { hex: 'FC', mnemonic: 'CM addr16', bytes: 3, tStates: '18/9', category: 'Branching', flagsAffected: 'None', description: 'Call if Minus/Negative (S = 1)', example: 'CM 3000H' },

  // Returns
  { hex: 'C9', mnemonic: 'RET', bytes: 1, tStates: '10', category: 'Branching', flagsAffected: 'None', description: 'Return from subroutine unconditionally', example: 'RET' },
  { hex: 'C0', mnemonic: 'RNZ', bytes: 1, tStates: '12/6', category: 'Branching', flagsAffected: 'None', description: 'Return if Not Zero (Z = 0)', example: 'RNZ' },
  { hex: 'C8', mnemonic: 'RZ', bytes: 1, tStates: '12/6', category: 'Branching', flagsAffected: 'None', description: 'Return if Zero (Z = 1)', example: 'RZ' },
  { hex: 'D0', mnemonic: 'RNC', bytes: 1, tStates: '12/6', category: 'Branching', flagsAffected: 'None', description: 'Return if No Carry (CY = 0)', example: 'RNC' },
  { hex: 'D8', mnemonic: 'RC', bytes: 1, tStates: '12/6', category: 'Branching', flagsAffected: 'None', description: 'Return if Carry (CY = 1)', example: 'RC' },
  { hex: 'E0', mnemonic: 'RPO', bytes: 1, tStates: '12/6', category: 'Branching', flagsAffected: 'None', description: 'Return if Parity Odd (P = 0)', example: 'RPO' },
  { hex: 'E8', mnemonic: 'RPE', bytes: 1, tStates: '12/6', category: 'Branching', flagsAffected: 'None', description: 'Return if Parity Even (P = 1)', example: 'RPE' },
  { hex: 'F0', mnemonic: 'RP', bytes: 1, tStates: '12/6', category: 'Branching', flagsAffected: 'None', description: 'Return if Plus (S = 0)', example: 'RP' },
  { hex: 'F8', mnemonic: 'RM', bytes: 1, tStates: '12/6', category: 'Branching', flagsAffected: 'None', description: 'Return if Minus (S = 1)', example: 'RM' },

  // Restarts (RST 0..7)
  { hex: 'C7', mnemonic: 'RST 0', bytes: 1, tStates: '12', category: 'Branching', flagsAffected: 'None', description: 'Restart call to vector address 0000H', example: 'RST 0' },
  { hex: 'CF', mnemonic: 'RST 1', bytes: 1, tStates: '12', category: 'Branching', flagsAffected: 'None', description: 'Restart call to vector address 0008H', example: 'RST 1' },
  { hex: 'D7', mnemonic: 'RST 2', bytes: 1, tStates: '12', category: 'Branching', flagsAffected: 'None', description: 'Restart call to vector address 0010H', example: 'RST 2' },
  { hex: 'DF', mnemonic: 'RST 3', bytes: 1, tStates: '12', category: 'Branching', flagsAffected: 'None', description: 'Restart call to vector address 0018H', example: 'RST 3' },
  { hex: 'E7', mnemonic: 'RST 4', bytes: 1, tStates: '12', category: 'Branching', flagsAffected: 'None', description: 'Restart call to vector address 0020H', example: 'RST 4' },
  { hex: 'EF', mnemonic: 'RST 5', bytes: 1, tStates: '12', category: 'Branching', flagsAffected: 'None', description: 'Restart call to vector address 0028H', example: 'RST 5' },
  { hex: 'F7', mnemonic: 'RST 6', bytes: 1, tStates: '12', category: 'Branching', flagsAffected: 'None', description: 'Restart call to vector address 0030H', example: 'RST 6' },
  { hex: 'FF', mnemonic: 'RST 7', bytes: 1, tStates: '12', category: 'Branching', flagsAffected: 'None', description: 'Restart call to vector address 0038H', example: 'RST 7' },

  // Stack Operations
  { hex: 'C5', mnemonic: 'PUSH B', bytes: 1, tStates: '12', category: 'Branching', flagsAffected: 'None', description: 'Push register pair BC onto stack', example: 'PUSH B' },
  { hex: 'D5', mnemonic: 'PUSH D', bytes: 1, tStates: '12', category: 'Branching', flagsAffected: 'None', description: 'Push register pair DE onto stack', example: 'PUSH D' },
  { hex: 'E5', mnemonic: 'PUSH H', bytes: 1, tStates: '12', category: 'Branching', flagsAffected: 'None', description: 'Push register pair HL onto stack', example: 'PUSH H' },
  { hex: 'F5', mnemonic: 'PUSH PSW', bytes: 1, tStates: '12', category: 'Branching', flagsAffected: 'None', description: 'Push Accumulator A and Flags (PSW) onto stack', example: 'PUSH PSW' },

  { hex: 'C1', mnemonic: 'POP B', bytes: 1, tStates: '10', category: 'Branching', flagsAffected: 'None', description: 'Pop top stack values into register pair BC', example: 'POP B' },
  { hex: 'D1', mnemonic: 'POP D', bytes: 1, tStates: '10', category: 'Branching', flagsAffected: 'None', description: 'Pop top stack values into register pair DE', example: 'POP D' },
  { hex: 'E1', mnemonic: 'POP H', bytes: 1, tStates: '10', category: 'Branching', flagsAffected: 'None', description: 'Pop top stack values into register pair HL', example: 'POP H' },
  { hex: 'F1', mnemonic: 'POP PSW', bytes: 1, tStates: '10', category: 'Branching', flagsAffected: 'All', description: 'Pop top stack values into Accumulator A and Flags', example: 'POP PSW' },

  // --- CONTROL & I/O INSTRUCTIONS ---
  { hex: '00', mnemonic: 'NOP', bytes: 1, tStates: '4', category: 'Control', flagsAffected: 'None', description: 'No Operation', example: 'NOP' },
  { hex: '76', mnemonic: 'HLT', bytes: 1, tStates: '5', category: 'Control', flagsAffected: 'None', description: 'Halt CPU execution', example: 'HLT' },
  { hex: 'F3', mnemonic: 'DI', bytes: 1, tStates: '4', category: 'Control', flagsAffected: 'None', description: 'Disable Interrupts', example: 'DI' },
  { hex: 'FB', mnemonic: 'EI', bytes: 1, tStates: '4', category: 'Control', flagsAffected: 'None', description: 'Enable Interrupts', example: 'EI' },
  { hex: '20', mnemonic: 'RIM', bytes: 1, tStates: '4', category: 'Control', flagsAffected: 'None', description: 'Read Interrupt Mask into Accumulator A', example: 'RIM' },
  { hex: '30', mnemonic: 'SIM', bytes: 1, tStates: '4', category: 'Control', flagsAffected: 'None', description: 'Set Interrupt Mask from Accumulator A', example: 'SIM' },
  { hex: 'DB', mnemonic: 'IN port', bytes: 2, tStates: '10', category: 'Control', flagsAffected: 'None', description: 'Read data from 8-bit I/O port into Accumulator A', example: 'IN 01H' },
  { hex: 'D3', mnemonic: 'OUT port', bytes: 2, tStates: '10', category: 'Control', flagsAffected: 'None', description: 'Output Accumulator A to 8-bit I/O port', example: 'OUT 02H' }
];
