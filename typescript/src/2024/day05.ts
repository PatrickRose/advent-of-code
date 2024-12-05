import getInput from "./util/getInput";
import {accumulator} from "../util/accumulator";

const testInputs = {
    example: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`
}

const input = getInput(testInputs, 5);

const [rulesDef, printingDef] = input.split('\n\n');

const rules: Record<number, number[]> = {};

rulesDef.split('\n').forEach(row => {
    const [before, after] = row.split('|').map(val => Number.parseInt(val, 10));

    rules[after] = [...rules[after] ?? [], before];
});

const printing =  printingDef.split('\n').map(row => row.split(',').map(val => Number.parseInt(val, 10)));

const part1 = printing.filter(row => {
    const printed = new Set<number>();

    return row.every(val => {
        const before = rules[val];

        if (before != undefined
            && before.some(val => {
                return row.includes(val) && !printed.has(val);
            })
        ) {
            return false;
        }

        printed.add(val);

        return true;
    })
});

const findMiddle = (val: number[]): number => {
    const length = val.length;

    if ((length % 2) != 1) {
        throw new Error(`Invalid length for ${val}`);
    }

    return val[(length - 1) / 2];
};
const middles = part1.map(findMiddle);

console.log(`Part 1: ${accumulator(middles)}`);

const part2 = printing.filter(val => !part1.includes(val));

function fixOrder(update: number[]): number[] {
    const printed: Set<number> = new Set;

    const newUpdate: number[] = [];
    let changed = false;

    for(const val of update) {
        if (newUpdate.includes(val)) {
            // We did this on an earlier iteration
            continue;
        }
        const before = rules[val];
        if (before) {
            for(const shouldBePrinted of before.filter(val => update.includes(val))) {
                if (!printed.has(shouldBePrinted)) {
                    newUpdate.push(shouldBePrinted);
                    changed = true;
                    printed.add(shouldBePrinted);
                }
            }
        }

        newUpdate.push(val);
        printed.add(val);
    }

    return changed?fixOrder(newUpdate) : newUpdate;
}

const fixed = part2.map(fixOrder);

console.log(`Part 2: ${accumulator(fixed.map(findMiddle))}`);
