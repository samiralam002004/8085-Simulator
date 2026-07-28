import { LabExperiment } from '../types';

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: 'lab-1-addition-8bit',
    title: '8-Bit Addition of Two Numbers',
    category: 'Basic Arithmetic',
    level: 'Basic',
    objective: 'Write an 8085 assembly language program to perform 8-bit addition of two numbers stored in memory locations 2050H and 2051H and store the result in 2052H (and carry in 2053H).',
    theory: 'In 8085, addition is performed using the Accumulator A. The instruction ADD M or ADD reg adds the operand value to the Accumulator. If the result exceeds 8 bits (i.e. > 255 or FFH), the Carry Flag CY is set to 1.',
    algorithm: [
      'Initialize register C = 00H to count carry.',
      'Load first number from memory 2050H into Accumulator A.',
      'Get second number from memory 2051H into register B.',
      'Add register B to Accumulator A (ADD B).',
      'Jump if No Carry (JNC) to step 7.',
      'Increment register C by 1 (INR C).',
      'Store result from Accumulator A to 2052H.',
      'Move carry from register C to Accumulator A and store at 2053H.',
      'Halt (HLT).'
    ],
    startAddress: '2000',
    inputMemory: [
      { address: '2050', label: 'First Number', defaultValue: '9F', description: 'Input Byte 1 (Hex 9F = 159 Dec)' },
      { address: '2051', label: 'Second Number', defaultValue: '85', description: 'Input Byte 2 (Hex 85 = 133 Dec)' }
    ],
    expectedOutputMemory: [
      { address: '2052', label: 'Sum (Lower Byte)', description: 'Expected: 24H (9F + 85 = 124H)' },
      { address: '2053', label: 'Carry (Upper Byte)', description: 'Expected: 01H' }
    ],
    code: `; LAB EXPERIMENT 1: 8-BIT ADDITION WITH CARRY
; Input Locations: 2050H, 2051H
; Output Locations: 2052H (Sum), 2053H (Carry)

LXI H, 2050H    ; Point HL to 2050H
MVI C, 00H      ; Clear C register for carry count
MOV A, M        ; Load first number into A
INX H           ; Point to 2051H
ADD M           ; Add second number at [HL] to A
JNC NOCARRY     ; Jump if Carry flag CY = 0
INR C           ; Increment Carry counter if CY = 1
NOCARRY: STA 2052H ; Store 8-bit sum at 2052H
MOV A, C        ; Move carry into A
STA 2053H       ; Store carry at 2053H
HLT             ; Stop execution`,
    trainerKitKeypadSteps: [
      { step: 1, action: 'Press RESET key', display: '8085 - ET', note: 'Resets CPU to initial state' },
      { step: 2, action: 'Press EXMEM key', display: 'A - - -  - -', note: 'Opens Examine Memory mode' },
      { step: 3, action: 'Type 2 0 0 0 and press NEXT', display: '2000  21', note: 'Enters starting address 2000H' },
      { step: 4, action: 'Enter opcode 21 NEXT 50 NEXT 20 NEXT', display: '2000 LXI H', note: 'Loads LXI H, 2050H opcodes (21 50 20)' },
      { step: 5, action: 'Enter opcodes: 0E 00 7E 23 86 D2 0E 20 0C 32 52 20 79 32 53 20 76 NEXT', display: '2010 76 (HLT)', note: 'Fills rest of code into RAM' },
      { step: 6, action: 'Enter input data: EXMEM -> 2050 -> 9F NEXT -> 85 NEXT', display: '2050  9F', note: 'Sets input values' },
      { step: 7, action: 'Press GO -> 2000 -> EXEC', display: '2000  E', note: 'Executes program' },
      { step: 8, action: 'Check results: EXMEM -> 2052 -> 24 (Sum) & 2053 -> 01 (Carry)', display: '2052  24', note: 'Verifies correct output' }
    ]
  },
  {
    id: 'lab-2-subtraction-8bit',
    title: '8-Bit Subtraction of Two Numbers',
    category: 'Basic Arithmetic',
    level: 'Basic',
    objective: 'Subtract second number at 2051H from first number at 2050H and store result in 2052H (and borrow at 2053H).',
    theory: '8085 performs subtraction using 2s complement method. If first number < second number, a borrow occurs and CY flag is set to 1.',
    algorithm: [
      'Set C = 00H for borrow counter.',
      'Load A from 2050H.',
      'Subtract memory byte at 2051H using SUB M.',
      'If no carry (JNC), jump to store result.',
      'If carry, INR C and complement accumulator for magnitude.',
      'Store result at 2052H and borrow at 2053H.'
    ],
    startAddress: '2000',
    inputMemory: [
      { address: '2050', label: 'Minuend (Number 1)', defaultValue: '65', description: 'First Byte' },
      { address: '2051', label: 'Subtrahend (Number 2)', defaultValue: '23', description: 'Second Byte' }
    ],
    expectedOutputMemory: [
      { address: '2052', label: 'Difference', description: 'Expected: 42H (65H - 23H = 42H)' },
      { address: '2053', label: 'Borrow Status', description: 'Expected: 00H' }
    ],
    code: `; LAB EXPERIMENT 2: 8-BIT SUBTRACTION
; Input: 2050H, 2051H
; Output: 2052H (Difference), 2053H (Borrow)

LXI H, 2050H
MVI C, 00H
MOV A, M
INX H
SUB M
JNC NOBORROW
INR C
CMA
ADI 01H
NOBORROW: STA 2052H
MOV A, C
STA 2053H
HLT`,
    trainerKitKeypadSteps: [
      { step: 1, action: 'Press RESET -> EXMEM -> 2000 -> NEXT', display: '2000 - -', note: 'Start entry at 2000H' },
      { step: 2, action: 'Enter opcodes: 21 50 20 0E 00 7E 23 96 D2 12 20 0C 2F C6 01 32 52 20 79 32 53 20 76', display: '2016 76', note: 'Subroutines loaded' },
      { step: 3, action: 'Set data at 2050H = 65H, 2051H = 23H', display: '2050 65', note: 'Inputs ready' },
      { step: 4, action: 'Press GO -> 2000 -> EXEC', display: '2000 E', note: 'Runs code' },
      { step: 5, action: 'EXMEM -> 2052H -> Observe result 42H', display: '2052 42', note: 'Verified' }
    ]
  },
  {
    id: 'lab-3-largest-number',
    title: 'Find Largest Number in an Array',
    category: 'Array Operations',
    level: 'Intermediate',
    objective: 'Find the largest number in a block/array of N numbers starting from 2050H and store the maximum value at 2060H.',
    theory: 'Load array count N into register C. Set maximum candidate = first element. Loop through remaining N-1 elements using CMP M. If element > max, update max.',
    algorithm: [
      'Load array length N from 2050H into register C.',
      'Point HL to first array element at 2051H.',
      'Load first element into Accumulator A.',
      'Decrement counter C.',
      'Increment HL to point to next element.',
      'Compare element [HL] with A (CMP M).',
      'If A >= [HL], jump to SKIP.',
      'If [HL] > A, update A = [HL].',
      'SKIP: Decrement counter C. If C != 0, loop back.',
      'Store largest number A at 2060H and HLT.'
    ],
    startAddress: '2000',
    inputMemory: [
      { address: '2050', label: 'Array Size N', defaultValue: '05', description: '5 Elements' },
      { address: '2051', label: 'Element 1', defaultValue: '2A', description: '42 Dec' },
      { address: '2052', label: 'Element 2', defaultValue: 'F4', description: '244 Dec (Largest)' },
      { address: '2053', label: 'Element 3', defaultValue: '88', description: '136 Dec' },
      { address: '2054', label: 'Element 4', defaultValue: '12', description: '18 Dec' },
      { address: '2055', label: 'Element 5', defaultValue: '7E', description: '126 Dec' }
    ],
    expectedOutputMemory: [
      { address: '2060', label: 'Maximum Value', description: 'Expected: F4H' }
    ],
    code: `; LAB EXPERIMENT 3: FIND LARGEST NUMBER IN ARRAY
; 2050H: Array Size N
; 2051H onwards: Array Elements
; 2060H: Maximum Value Output

LXI H, 2050H
MOV C, M        ; Load array count N
INX H           ; HL = 2051H
MOV A, M        ; Set max = first element
DCR C           ; Decrement counter
JZ STORE        ; If array size was 1, store directly

LOOP: INX H     ; Next element
CMP M           ; Compare A with [HL]
JNC SKIP        ; If A >= [HL], skip update
MOV A, M        ; A = [HL] (new max found)
SKIP: DCR C     ; Decrement count
JNZ LOOP        ; Repeat until C = 0

STORE: STA 2060H ; Store largest number
HLT`,
    trainerKitKeypadSteps: [
      { step: 1, action: 'EXMEM -> 2050H -> Enter size 05', display: '2050 05', note: 'Set array count' },
      { step: 2, action: 'Enter array bytes at 2051H to 2055H: 2A F4 88 12 7E', display: '2055 7E', note: 'Array data ready' },
      { step: 3, action: 'Assemble and execute from 2000H', display: '2000 E', note: 'Simulates comparison loop' },
      { step: 4, action: 'Check 2060H -> Displays F4H', display: '2060 F4', note: 'Max value verified' }
    ]
  },
  {
    id: 'lab-4-block-move',
    title: 'Block Transfer of Memory Data',
    category: 'Memory Management',
    level: 'Intermediate',
    objective: 'Transfer a block of 5 data bytes starting from 2050H to new memory location starting at 2070H.',
    theory: 'Block transfer copies data from source memory pointer (HL) to destination pointer (DE) byte-by-byte using register A as temporary buffer.',
    algorithm: [
      'Initialize HL = 2050H (Source pointer).',
      'Initialize DE = 2070H (Destination pointer).',
      'Set C = 05H (Block count).',
      'LOOP: MOV A, M (Fetch source byte).',
      'STAX D (Store into destination).',
      'INX H & INX D (Increment both pointers).',
      'DCR C (Decrement count).',
      'JNZ LOOP until C = 0. HLT.'
    ],
    startAddress: '2000',
    inputMemory: [
      { address: '2050', label: 'Source Byte 1', defaultValue: '11', description: 'Data 1' },
      { address: '2051', label: 'Source Byte 2', defaultValue: '22', description: 'Data 2' },
      { address: '2052', label: 'Source Byte 3', defaultValue: '33', description: 'Data 3' },
      { address: '2053', label: 'Source Byte 4', defaultValue: '44', description: 'Data 4' },
      { address: '2054', label: 'Source Byte 5', defaultValue: '55', description: 'Data 5' }
    ],
    expectedOutputMemory: [
      { address: '2070', label: 'Dest Byte 1', description: 'Expected: 11H' },
      { address: '2071', label: 'Dest Byte 2', description: 'Expected: 22H' },
      { address: '2072', label: 'Dest Byte 3', description: 'Expected: 33H' },
      { address: '2073', label: 'Dest Byte 4', description: 'Expected: 44H' },
      { address: '2074', label: 'Dest Byte 5', description: 'Expected: 55H' }
    ],
    code: `; LAB EXPERIMENT 4: BLOCK DATA TRANSFER
; Source Block: 2050H - 2054H
; Destination Block: 2070H - 2074H

LXI H, 2050H    ; Source HL
LXI D, 2070H    ; Destination DE
MVI C, 05H      ; Block length count

LOOP: MOV A, M  ; Read source byte
STAX D          ; Store at destination
INX H           ; Next source
INX D           ; Next destination
DCR C           ; Decrement counter
JNZ LOOP        ; Repeat
HLT`,
    trainerKitKeypadSteps: [
      { step: 1, action: 'Load code at 2000H: 21 50 20 11 70 20 0E 05 7E 12 23 13 0D C2 08 20 76', display: '2010 76', note: 'Opcodes loaded' },
      { step: 2, action: 'Set source bytes at 2050H..2054H = 11, 22, 33, 44, 55', display: '2050 11', note: 'Data loaded' },
      { step: 3, action: 'GO -> 2000 -> EXEC', display: '2000 E', note: 'Transfers block' },
      { step: 4, action: 'Check EXMEM 2070H to 2074H', display: '2070 11', note: 'Copies confirmed' }
    ]
  },
  {
    id: 'lab-5-bubble-sort',
    title: 'Bubble Sort Array in Ascending Order',
    category: 'Sorting Algorithms',
    level: 'Advanced',
    objective: 'Arrange an array of N numbers stored at 2051H onwards in ascending order using Bubble Sort algorithm.',
    theory: 'Bubble sort compares adjacent elements [HL] and [HL+1]. If [HL] > [HL+1], they are swapped. The outer loop runs N-1 times and inner loop compares adjacent pairs.',
    algorithm: [
      'Initialize outer loop count B = N - 1.',
      'OUTER: Initialize inner loop count C = N - 1.',
      'Point HL to first element at 2051H.',
      'INNER: Load A = [HL]. Compare with [HL+1] using MOV B, M -> INX H -> CMP M.',
      'If A <= [HL+1], JNC NOSWAP.',
      'If A > [HL+1], swap contents using temporary register D.',
      'NOSWAP: DCR C. If C != 0, JNZ INNER.',
      'DCR B. If B != 0, JNZ OUTER.',
      'HLT.'
    ],
    startAddress: '2000',
    inputMemory: [
      { address: '2050', label: 'Array Size N', defaultValue: '04', description: '4 Elements' },
      { address: '2051', label: 'Item 1', defaultValue: '50', description: 'Unsorted 50H' },
      { address: '2052', label: 'Item 2', defaultValue: '12', description: 'Unsorted 12H' },
      { address: '2053', label: 'Item 3', defaultValue: 'A0', description: 'Unsorted A0H' },
      { address: '2054', label: 'Item 4', defaultValue: '05', description: 'Unsorted 05H' }
    ],
    expectedOutputMemory: [
      { address: '2051', label: 'Sorted Item 1', description: 'Expected: 05H' },
      { address: '2052', label: 'Sorted Item 2', description: 'Expected: 12H' },
      { address: '2053', label: 'Sorted Item 3', description: 'Expected: 50H' },
      { address: '2054', label: 'Sorted Item 4', description: 'Expected: A0H' }
    ],
    code: `; LAB EXPERIMENT 5: BUBBLE SORT ASCENDING
; Array Size at 2050H
; Elements at 2051H onwards

LDA 2050H
DCR A
MOV B, A        ; Outer counter B = N - 1

OUTER: LDA 2050H
DCR A
MOV C, A        ; Inner counter C = N - 1
LXI H, 2051H    ; HL points to first element

INNER: MOV A, M ; A = current element
INX H
CMP M           ; Compare A with next element
JC NOSWAP       ; If A < next, no swap
JZ NOSWAP       ; If A == next, no swap

; Swap elements
MOV D, M        ; D = next element
MOV M, A        ; next element = A
DCX H
MOV M, D        ; current element = D
INX H           ; Re-advance HL pointer

NOSWAP: DCR C
JNZ INNER       ; Inner loop check

DCR B
JNZ OUTER       ; Outer loop check
HLT`,
    trainerKitKeypadSteps: [
      { step: 1, action: 'Load array size at 2050H = 04', display: '2050 04', note: 'N = 4' },
      { step: 2, action: 'Set 2051H..2054H = 50, 12, A0, 05', display: '2054 05', note: 'Unsorted values' },
      { step: 3, action: 'Execute 2000H', display: '2000 E', note: 'Runs multi-pass bubble sort' },
      { step: 4, action: 'View memory 2051H to 2054H: 05, 12, 50, A0', display: '2051 05', note: 'Sorted in ascending order!' }
    ]
  },
  {
    id: 'lab-6-multiplication',
    title: '8-Bit Multiplication (Repeated Addition)',
    category: 'Basic Arithmetic',
    level: 'Intermediate',
    objective: 'Multiply two 8-bit numbers stored at 2050H and 2051H using repeated addition and store 16-bit result at 2052H (Lower byte) and 2053H (Upper byte).',
    theory: 'Since 8085 CPU does not have a hardware MUL instruction, multiplication (A x B) is achieved by adding A to itself B times.',
    algorithm: [
      'Initialize HL = 0000H (for 16-bit product).',
      'Load multiplicand A from 2050H into register D.',
      'Load multiplier B from 2051H into register C.',
      'If multiplier C == 0, jump to store result 0000H.',
      'LOOP: Add multiplicand D to HL pair using DAD D or ADD instructions.',
      'DCR C. JNZ LOOP.',
      'Store HL pair at 2052H and 2053H using SHLD 2052H. HLT.'
    ],
    startAddress: '2000',
    inputMemory: [
      { address: '2050', label: 'Multiplicand', defaultValue: '08', description: '8 Dec' },
      { address: '2051', label: 'Multiplier', defaultValue: '09', description: '9 Dec' }
    ],
    expectedOutputMemory: [
      { address: '2052', label: 'Product LSB', description: 'Expected: 48H (72 Dec = 0048H)' },
      { address: '2053', label: 'Product MSB', description: 'Expected: 00H' }
    ],
    code: `; LAB EXPERIMENT 6: 8-BIT MULTIPLICATION
; Input: 2050H (Num1), 2051H (Num2)
; Output: 2052H (LSB), 2053H (MSB)

LDA 2050H
MOV E, A        ; E = Multiplicand
MVI D, 00H      ; DE = Multiplicand in 16-bit
LDA 2051H
MOV C, A        ; C = Multiplier counter
LXI H, 0000H    ; HL = 0000H (Accumulator for 16-bit sum)

CPI 00H
JZ DONE         ; If multiplier is 0, answer is 0

LOOP: DAD D     ; HL = HL + DE
DCR C
JNZ LOOP

DONE: SHLD 2052H ; Store 16-bit result at 2052H/2053H
HLT`,
    trainerKitKeypadSteps: [
      { step: 1, action: 'Set 2050H = 08H, 2051H = 09H', display: '2050 08', note: 'Inputs set' },
      { step: 2, action: 'Assemble and execute from 2000H', display: '2000 E', note: 'Repeated addition loop runs 9 times' },
      { step: 3, action: 'Check EXMEM 2052H = 48, 2053H = 00', display: '2052 48', note: '0048H = 72 Dec' }
    ]
  },
  {
    id: 'lab-7-bcd-to-hex',
    title: 'BCD to Hexadecimal Conversion',
    category: 'Code Conversion',
    level: 'Intermediate',
    objective: 'Convert a 2-digit BCD number stored at 2050H (e.g. 58 BCD) into its equivalent Hexadecimal value at 2051H (3AH).',
    theory: 'BCD number XY = X * 10 + Y = (Upper Nibble * 0AH) + Lower Nibble. Extract upper nibble, shift right 4 times, multiply by 10 (0AH), and add lower nibble.',
    algorithm: [
      'Load BCD byte from 2050H into A and B.',
      'Mask lower nibble: ANI 0FH -> Store in C.',
      'Mask upper nibble from B: ORA A -> ANI F0H -> RRC 4 times.',
      'Multiply upper nibble by 10 (0AH) using repeated addition or MVI D, 0A.',
      'Add lower nibble C to product.',
      'Store final Hex result at 2051H. HLT.'
    ],
    startAddress: '2000',
    inputMemory: [
      { address: '2050', label: 'BCD Input', defaultValue: '58', description: 'BCD 58' }
    ],
    expectedOutputMemory: [
      { address: '2051', label: 'Hex Output', description: 'Expected: 3AH (58 Dec = 3AH)' }
    ],
    code: `; LAB EXPERIMENT 7: BCD TO HEX CONVERSION
; Input: 2050H (BCD number e.g. 58)
; Output: 2051H (Hex value e.g. 3A)

LDA 2050H
MOV B, A
ANI 0FH         ; Extract Lower Nibble
MOV C, A        ; C = Lower Nibble

MOV A, B
ANI F0H         ; Extract Upper Nibble
RRC
RRC
RRC
RRC             ; Shift right 4 times -> A = Upper digit

MOV B, A        ; B = Upper digit
MVI D, 00H      ; Counter for multiply by 10
MVI A, 00H

LOOP: ADI 0AH   ; Add 10 (0AH)
DCR B
JNZ LOOP

ADD C           ; Add lower nibble
STA 2051H       ; Store Hex output
HLT`,
    trainerKitKeypadSteps: [
      { step: 1, action: 'Set 2050H = 58', display: '2050 58', note: 'BCD 58 input' },
      { step: 2, action: 'GO -> 2000 -> EXEC', display: '2000 E', note: 'Converts 5*10 + 8 = 58 Dec = 3AH' },
      { step: 3, action: 'EXMEM -> 2051H -> Displays 3A', display: '2051 3A', note: 'Verified' }
    ]
  }
];
