import getInput from "./util/getInput";

const testInputs = {
    example: `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`
}

const input = getInput(testInputs, 17);

const [registerDef, programDef] = input.split('\n\n');

const [a, b, c] = registerDef.split('\n').map(row => {
    const [_, num] = row.split(': ');
    return Number.parseInt(num, 10);
})

const program = programDef.split(': ')[1].split(',');

function runProgram(program: string[], registers: [bigint, bigint, bigint], firstInputOnly= false): string {
    const output = [];
    let [a, b, c] = registers;
    let pointer = 0;

    while (program[pointer] !== undefined) {
        const opcode = program[pointer];

        const getComboOperand = () => {
            const comboOperand = {
                0: 0n,
                1: 1n,
                2: 2n,
                3: 3n,
                4: a,
                5: b,
                6: c
            }[program[pointer + 1]]

            if (comboOperand === undefined) {
                throw new Error(`Undefined operand ${comboOperand}`)
            }

            return comboOperand;
        }
        const literalOperand = Number.parseInt(program[pointer + 1], 10);

        switch (opcode) {
            case '0':
                a = a >> getComboOperand();
                pointer += 2;
                break;
            case '1':
                b = b ^ BigInt(literalOperand);
                pointer += 2;
                break;
            case '2':
                b = (getComboOperand() & 7n);
                pointer += 2;
                break;
            case '3':
                if (a == 0n) {
                    pointer += 2;
                } else {
                    pointer = literalOperand;
                }
                break;
            case '4':
                b = b ^ c;
                pointer += 2;
                break;
            case '5':
                output.push(getComboOperand() & 7n);
                pointer += 2;
                break;
            case '6':
                b = a >> getComboOperand()
                pointer += 2;
                break;
            case '7':
                c = a >> getComboOperand();
                pointer += 2;
                break;
        }

        if (firstInputOnly && output.length != 0) {
            return `${output[0]}`;
        }
    }

    return output.join(',');
}

console.log(`Part 1: ${runProgram(program, [BigInt(a), BigInt(b), BigInt(c)])}`);

function getBestInput(program: string[], cursor: number, currVal: bigint): bigint|null {
    for (let i=0n; i<8n;i++) {
        const nextVal = (currVal * 8n) + i;
        const result = runProgram(program, [nextVal, 0n,0n]);
        if (result == program.slice(cursor).join(',')) {
            if (cursor == 0) {
                return nextVal;
            } else {
                const result = getBestInput(program, cursor-1, nextVal);
                if (result !== null) {
                    return result;
                }
            }
        }
    }

    return null;
}

console.log(`Part 2: ${getBestInput(program, program.length-1, 0n)}`);
