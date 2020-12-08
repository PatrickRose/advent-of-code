import * as fs from 'fs';

const input = fs.readFileSync(__dirname + '/../input/day08.txt').toString('utf-8').trim();

type Operation = 'acc' | 'jmp' | 'nop';
type Instruction = {
    operation: Operation,
    argument: number
};
type Program = Array<Instruction>

function isInstruction(s: string): s is Operation {
    return ['acc', 'jmp', 'nop'].includes(s);
}

const program: Program = input.split("\n").map(
    (line: string): Instruction => {
        const [operation, argument] = line.split(' ');

        if (!isInstruction(operation)) {
            throw new Error(`${line} does not have a valid instruction`);
        }

        const parsedArg = Number.parseInt(argument, 10);

        if (isNaN(parsedArg)) {
            throw new Error(`${line} did not parse down to a number`);
        }

        return {
            operation,
            argument: parsedArg
        }
    }
);

function runProgram(program: Program): [number, boolean] {
    const visitedInstructions: Set<number> = new Set();
    let acc = 0;
    let position = 0;

    while (!visitedInstructions.has(position)) {
        let instruction = program[position];

        if (instruction === undefined) {
            return [acc, true];
        }

        visitedInstructions.add(position);

        switch (instruction.operation) {
            case 'nop':
                position += 1;
                break;
            case 'acc':
                position += 1;
                acc += instruction.argument
                break;
            case 'jmp':
                position += instruction.argument;
                break;
            default:
                throw new Error(`Unknown instruction ${instruction.operation}`);
        }
    }

    return [acc, false];
}

console.log(`Part 1: ${runProgram(program)[0]}`);

program.some(
    (value, index, baseProgram): boolean => {
        if (value.operation == 'acc') {
            return false;
        }

        const newProgram = baseProgram.slice();

        newProgram[index] = {
            operation: value.operation == 'jmp' ? 'nop' : 'jmp',
            argument: value.argument
        };

        const result = runProgram(newProgram);

        if (result[1]) {
            console.log(`Part 2: ${result[0]}`);

            return true;
        }

        return false;
    }
);
