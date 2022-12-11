import getInput from './util/getInput';

const sampleInput = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
If true: throw to monkey 2
If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
If true: throw to monkey 2
If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
If true: throw to monkey 1
If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
If true: throw to monkey 0
If false: throw to monkey 1
`;

const input = getInput(11);

const monkeys: Monkey[] = [];
const monkeys2: Monkey[] = [];

class Monkey {
    #items: number[];
    #operation: (val: number) => number;
    #test: number;
    #trueTarget: number;
    #falseTarget: number;
    #monkeys: Monkey[];
    #inspected: number = 0;

    public constructor(
        starting: number[],
        operation: (curr: number) => number,
        test: number,
        trueTarget: number,
        falseTarget: number,
        monkeys: Monkey[]
    ) {
        this.#items = starting.slice(0);
        this.#operation = operation;
        this.#test = test;
        this.#trueTarget = trueTarget;
        this.#falseTarget = falseTarget;
        this.#monkeys = monkeys;
    }

    public throwItems() {
        this.#items.forEach((val) => {
            const newVal = this.#operation(val);

            const toCatch = (newVal % this.#test) == 0
                ? this.#monkeys[this.#trueTarget]
                : this.#monkeys[this.#falseTarget];

            toCatch.catchItem(newVal);
        });

        this.#inspected += this.#items.length;

        this.#items = [];
    }

    public catchItem(val: number): void {
        this.#items.push(
            // MOD the value by the product of all the tests
            // Since a mod (b)(c) == a mod b
            val % this.#monkeys.reduce(
                (prev, curr) => prev * curr.#test,
                1
            )
        );
    }

    public inspected(): number {
        return this.#inspected;
    }
}

input.split('\n\n').forEach(
    (row) => {
        const [___, starting, operation, test, ifTrue, ifFalse] = row.split('\n');

        const [_, startingItems] = starting.split(':');

        const items = startingItems.split(',').map(val => Number.parseInt(val, 10));
        const [__, operationInfo] = operation.split(' = ');
        const [first, op, second] = operationInfo.split(' ');

        const opFunction = (val: number): number => {
            const firstPart = first == 'old' ? val : Number.parseInt(first, 10)
            const secondPart = second == 'old' ? val : Number.parseInt(second, 10)
            switch (op) {
                case '+':
                    return firstPart + secondPart;
                case '*':
                    return firstPart * secondPart;
                default:
                    throw new Error(`Unknown op ${op}`);
            }
        }

        const testNum = test.match(/\d+/) ?? ['0'];
        const ifTrueNum = ifTrue.match(/\d+/) ?? ['0'];
        const ifFalseNum = ifFalse.match(/\d+/) ?? ['0'];

        monkeys.push(
            new Monkey(
                items,
                (val) => Math.floor(opFunction(val) / 3),
                Number.parseInt(testNum[0], 10),
                Number.parseInt(ifTrueNum[0], 10),
                Number.parseInt(ifFalseNum[0], 10),
                monkeys
            )
        );

        monkeys2.push(
            new Monkey(
                items,
                opFunction,
                Number.parseInt(testNum[0], 10),
                Number.parseInt(ifTrueNum[0], 10),
                Number.parseInt(ifFalseNum[0], 10),
                monkeys2
            )
        );
    }
);

for (let i = 0; i < 20; i++) {
    monkeys.forEach(monkey => monkey.throwItems());
}

const monkeyInspections = monkeys.map(monkey => monkey.inspected());
monkeyInspections.sort((a, b) => b - a);

console.log(`Part 1: ${monkeyInspections[0] * monkeyInspections[1]}`);

for (let i = 0; i < 10000; i++) {
    monkeys2.forEach(monkey => monkey.throwItems());
}

const monkeyInspections2 = monkeys2.map(monkey => monkey.inspected());
monkeyInspections2.sort((a, b) => b - a);

console.log(`Part 2: ${monkeyInspections2[0] * monkeyInspections2[1]}`);
