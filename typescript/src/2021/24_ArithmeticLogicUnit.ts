import getInput from "./util/getInput";

const realInput = getInput(24);

const input = realInput;

type Variable = 'x' | 'z' | 'y' | 'w';

type Variables = { [Var in Variable]: number };

type States = {
    variables: Variables,
    inputForState: string[]
}[];

abstract class Instruction {
    public abstract run(alu: ALU, input: number[]): void;

    public abstract toStr(): string;
}

class Input extends Instruction {
    constructor(private readonly variable: Variable) { super() }

    public toStr(): string {
        return `Input: ${this.variable}`;
    }

    public run(alu: ALU, input: number[]): void {
        const nextValue = input.shift();

        if (nextValue === undefined) {
            throw Error('Ran out of input');
        }

        alu.setVariable(this.variable, nextValue);
    }
}

abstract class TwoArguments extends Instruction {
    constructor(
        public readonly a: Variable,
        public readonly b: Variable | number
    ) {
        super()
    }

    public toStr(): string {
        return `${this.type()}: ${this.a} ${this.b}`;
    }

    protected abstract type(): string;

    protected bValue(alu: ALU): number {
        if (typeof this.b === 'number') {
            return this.b;
        }

        return alu.getVariable(this.b);
    }
}

class Add extends TwoArguments {
    protected type(): string {
        return "Add"
    }

    public run(alu: ALU, input: number[]): void {
        alu.setVariable(this.a, alu.getVariable(this.a) + this.bValue(alu));
    }
}

class Multiply extends TwoArguments {
    public run(alu: ALU, input: number[]): void {
        alu.setVariable(this.a, alu.getVariable(this.a) * this.bValue(alu));
    }

    protected type(): string {
        return 'Multiply';
    }
}

class Divide extends TwoArguments {
    public run(alu: ALU, input: number[]): void {
        const newValue = alu.getVariable(this.a) / this.bValue(alu)
        alu.setVariable(this.a, Number.parseInt(`${newValue}`));
    }

    protected type(): string {
        return 'Divide';
    }
}

class Mod extends TwoArguments {
    public run(alu: ALU, input: number[]): void {
        alu.setVariable(this.a, alu.getVariable(this.a) % this.bValue(alu));
    }

    protected type(): string {
        return 'Mod';
    }
}

class Equal extends TwoArguments {
    public run(alu: ALU, input: number[]): void {
        alu.setVariable(
            this.a,
            alu.getVariable(this.a) == this.bValue(alu) ? 1 : 0
        );
    }

    protected type(): string {
        return 'Equal';
    }
}

class ALU {
    private variables: Variables = {
        w: 0,
        x: 0,
        y: 0,
        z: 0
    }

    constructor(private readonly instructions: Instruction[]) { }

    public run(input: number[]): Variables {
        this.variables = {
            w: 0,
            x: 0,
            y: 0,
            z: 0
        };

        this.instructions.forEach(instruction => instruction.run(this, input));

        return this.variables;
    }

    public setVariable(variable: Variable, value: number) {
        this.variables[variable] = value;
    }

    public getVariable(variable: Variable): number {
        return this.variables[variable];
    }
}

const instructions = input.split("\n").map(
    row => {
        const inputs = row.split(' ');

        const instructionType = inputs[0];

        const splitInputs = inputs.slice(1);

        let value: Variable;
        let secondValue: Variable | number;

        if (splitInputs.length == 1) {
            value = splitInputs[0] as Variable;
            secondValue = Infinity;
        } else {
            value = splitInputs[0] as Variable;
            const asNum = Number.parseInt(splitInputs[1]);
            secondValue = isNaN(asNum) ? (splitInputs[1] as Variable) : asNum;
        }

        switch (instructionType) {
            case 'inp':
                return new Input(value);
            case 'add':
                return new Add(value, secondValue);
            case 'mul':
                return new Multiply(value, secondValue);
            case 'div':
                return new Divide(value, secondValue);
            case 'mod':
                return new Mod(value, secondValue);
            case 'eql':
                return new Equal(value, secondValue);
            default:
                throw new Error(`Unknown instruction ${instructionType}`)
        }
    }
);

// Split the input by the "input" instructions
const splitInstructions: Instruction[][] = [];

let thisInstruction: Instruction[] = [];

instructions.forEach(
    instruction => {
        if (instruction instanceof Input) {
            if (thisInstruction.length > 0) {
                splitInstructions.push(thisInstruction);
            }

            thisInstruction = [];
        }

        thisInstruction.push(instruction);
    }
)
splitInstructions.push(thisInstruction);

// Essentially, for each input, we do a bunch of nonsense
type reducedInstruction = {
    add_x: number,
    add_y: number,
    truncate_z: boolean
}

const reducedInstructions: reducedInstruction[] = splitInstructions.map(
    instructions => {
        // Relevant instructions are 4, 5 and 15
        const truncate_z = (instructions[4] as TwoArguments).b == 26;
        const add_y = (instructions[15] as TwoArguments).b as number;
        const add_x = (instructions[5] as TwoArguments).b as number;

        return { truncate_z, add_y, add_x };
    }
)

const stackOfValues: [InputNumber, number][] = [];

type InputNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

const pairs: [InputNumber, InputNumber, number][] = [];

reducedInstructions.forEach(
    ({ add_x, add_y, truncate_z }, inputNumber) => {
        const thisNumber: InputNumber = inputNumber as InputNumber;

        if (!truncate_z) {
            stackOfValues.push([thisNumber, add_y])
        } else {
            const pop = stackOfValues.pop();

            if (pop === undefined) {
                throw Error('Popped more than we pushed!');
            }

            const [firstNum, difference] = pop;

            pairs.push([firstNum, thisNumber, difference + add_x]);
        }
    }
)

// Now, pairs contains our equalities
// We need the maximum numbers so that firstNum - secondNum = third number
// We also need firstNum to be 1-9 and secondNum to be 1-9
// Anything else can just be a 9 (because that's the max)

const biggest: number[] = Array(14).fill(9);
const smallest: number[] = Array(14).fill(1);

pairs.forEach(
    ([firstNumIndex, secondNumIndex, difference]) => {
        // If it's negative, then just add 9 to the difference
        // That gives us the value for second num
        let firstNumBig: number;
        let secondNumBig: number;
        let firstNumSmall: number;
        let secondNumSmall: number;

        if (difference < 0) {
            firstNumBig = 9;
            secondNumBig = firstNumBig + difference;
            secondNumSmall = 1;
            firstNumSmall = secondNumSmall - difference;

        } else {
            secondNumBig = 9;
            firstNumBig = secondNumBig - difference;
            firstNumSmall = 1;
            secondNumSmall = firstNumSmall + difference;
        }

        biggest[firstNumIndex] = firstNumBig;
        biggest[secondNumIndex] = secondNumBig;
        smallest[firstNumIndex] = firstNumSmall;
        smallest[secondNumIndex] = secondNumSmall;
    }
);

console.log(`Part 1: ${biggest.join('')}`);
console.log(`Part 2: ${smallest.join('')}`);

// Verification
const alu = new ALU(instructions);
console.log(alu.run(biggest));
console.log(alu.run(smallest));
