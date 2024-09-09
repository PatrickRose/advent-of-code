import getInput from "./util/getInput";

const testInputs = {
    example: `inc a
jio a, +2
tpl a
inc a`
}

const input = getInput(testInputs, 23);

const instructions = input.split('\n');
function runProgram(registers: {a:number, b:number}): number {

    let position = 0;

    function isRegister(input: string): input is 'a' | 'b' {
        return ['a', 'b'].includes(input);
    }

    while (instructions[position] !== undefined) {
        const instruction = instructions[position];

        const type = instruction.substring(0, 3);
        const details = instruction.substring(4);

        switch (type) {
            case 'hlf':
                if (!isRegister(details)) {
                    throw new Error(`${details} is not a register`)
                }

                registers[details] /= 2;
                position++;
                break;
            case 'tpl':
                if (!isRegister(details)) {
                    throw new Error(`${details} is not a register`)
                }

                registers[details] *= 3;
                position++;
                break;
            case 'inc':
                if (!isRegister(details)) {
                    throw new Error(`${details} is not a register`)
                }

                registers[details]++;
                position++;
                break;
            case 'jmp':
                position += Number.parseInt(details, 10);
                break;
            case 'jie': {
                const [register, offset] = details.split(',');
                if (!isRegister(register)) {
                    throw new Error(`${register} is not a register`)
                }

                position += (registers[register] % 2 == 0) ? Number.parseInt(offset, 10) : 1
                break;
            }
            case 'jio': {
                const [register, offset] = details.split(',');
                if (!isRegister(register)) {
                    throw new Error(`${register} is not a register`)
                }

                position += (registers[register] == 1) ? Number.parseInt(offset, 10) : 1
                break;
            }
            default:
                throw new Error(`Unknown instruction ${type}`);
        }
    }

    return registers.b;
}

console.log(`Part 1: ${runProgram({a: 0, b: 0})}`);
console.log(`Part 2: ${runProgram({a: 1, b: 0})}`);
