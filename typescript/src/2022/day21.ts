import getInput from "./util/getInput";

const sampleInput = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`;

const input = getInput(21);

const monkeys: Map<string, Monkey> = new Map;

interface Monkey {
    getValue(): number;
}

class YellMonkey implements Monkey {
    readonly #toYell: number;

    constructor(toYell: number) {
        this.#toYell = toYell;
    }

    getValue(): number {
        return this.#toYell;
    }
}

abstract class OperationMonkey implements Monkey {
    #first: string;
    #second: string;

    constructor(first: string, second: string) {
        this.#first = first;
        this.#second = second;
    }

    getValue(): number {
        return this.getResultOfOperation(
            (monkeys.get(this.#first) as Monkey).getValue(),
            (monkeys.get(this.#second) as Monkey).getValue()
        );
    }

    getDependants(): [string, string] {
        return [this.#first, this.#second]
    }

    abstract getResultOfOperation(first: number, second: number): number;
}

class PlusMonkey extends OperationMonkey {
    getResultOfOperation(first: number, second: number): number {
        return first + second;
    }
}

class MinusMonkey extends OperationMonkey {
    getResultOfOperation(first: number, second: number): number {
        return first - second;
    }
}

class MultiplyMonkey extends OperationMonkey {
    getResultOfOperation(first: number, second: number): number {
        return first * second;
    }
}

class DivideMonkey extends OperationMonkey {
    getResultOfOperation(first: number, second: number): number {
        return first / second;
    }
}

input.split('\n').forEach(
    val => {
        const [monkeyid, rule] = val.split(': ');

        const ruleParts = rule.split(' ');

        let monkey: Monkey;

        if (ruleParts.length == 1) {
            monkey = new YellMonkey(Number.parseInt(rule, 10))
        } else {
            const [first, op, second] = ruleParts;

            switch (op) {
                case '+':
                    monkey = new PlusMonkey(first, second);
                    break;
                case '-':
                    monkey = new MinusMonkey(first, second);
                    break;
                case '*':
                    monkey = new MultiplyMonkey(first, second);
                    break;
                case '/':
                    monkey = new DivideMonkey(first, second);
                    break;
                default:
                    throw new Error(`Unknown op ${op}`);
            }
        }

        monkeys.set(monkeyid, monkey);
    }
)

console.log(`Part 1: ${monkeys.get('root')?.getValue()}`);

const [first, second] = (monkeys.get('root') as OperationMonkey).getDependants();

// Second value remains constant no matter what and is an integer
// The first value depends on what I put in and can sometimes be a float
// Find the first time we get an integer back
let val = 0;

let firstMonkey = monkeys.get(first)
const secondValue = monkeys.get(second)?.getValue() as number;

if (!firstMonkey) {
    throw Error('Type check');
}

do {
    val++;
    monkeys.set('humn', new YellMonkey(val));
} while (`${firstMonkey.getValue()}`.includes('.'));

const valueAtVal = firstMonkey.getValue();

// Now there's a cycle for the next val that gives us an integer
let diff = 0;

do {
    diff++;
    monkeys.set('humn', new YellMonkey(val + diff));
} while (`${firstMonkey.getValue()}`.includes('.'));

// Now, see what the difference is between val and val + diff
const valueAtDiff = firstMonkey.getValue();

const difference = valueAtVal - valueAtDiff;

// Then the number of times we need to do it is the difference between valueAtDiff and second divided by difference
const numTimes = (valueAtVal - secondValue) / difference;

// And just to check...
const partTwo = val + (diff * numTimes);
monkeys.set('humn', new YellMonkey(partTwo));
if (firstMonkey.getValue() != secondValue) {
    throw new Error('Balls');
}

console.log(`Part 2: ${partTwo}`);
