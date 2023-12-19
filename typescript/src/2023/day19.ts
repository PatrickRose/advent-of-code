import getInput from "./util/getInput";
import parseInt from "../util/parseInt";
import {accumulator, mappedAccumulator} from "../util/accumulator";

const testInputs = {
    example: `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`
}

const input = getInput(testInputs, 19);

const [maps, partDefs] = input.split('\n\n');

type Result = {
    type: 'switch',
    newMap: string
} | { type: 'accepted' } | { type: 'rejected' };

type Part = {
    x: number,
    m: number,
    a: number,
    s: number,
}

type RuleDef = { next: true | false | string } & (
    { type: 'lessThan' | 'greaterThan', key: keyof Part, amount: number } |
    { type: 'standard' }
    );

type PartToResult = (part: Part) => null | Result;
const rules: Map<string, PartToResult[]> = new Map();
const rulesAsStr: Map<string, RuleDef[]> = new Map();

function isPartKey(val: unknown): val is keyof Part {
    if (typeof val !== 'string') {
        return false;
    }

    const testPart: Part = {
        a: 0, m: 0, s: 0, x: 0
    }

    return testPart[val as keyof Part] !== undefined;
}

maps.split('\n').forEach(row => {
    const match = row.match(/^(.+)\{(.+)}$/);

    if (!match) {
        throw new Error(`${row} is invalid`);
    }

    const key = match[1];
    const ruleDefs = match[2];

    rulesAsStr.set(
        key,
        ruleDefs.split(',').map(
            (rule): RuleDef => {
                if (!rule.includes(':')) {
                    if (rule == 'A') {
                        return {next: true, type: 'standard'};
                    }
                    if (rule == 'R') {
                        return {next: false, type: 'standard'};
                    }


                    return {next: rule, type: 'standard'};
                }

                const match = rule.match(/(.)([<>])(\d+):(.+)/);

                if (!match) {
                    throw new Error(`${rule} is invalid`);
                }

                const fieldToCheck = match[1];
                const greaterLess: RuleDef['type'] = match[2] == '>' ? 'greaterThan' : 'lessThan';
                const amount = parseInt(match[3]);

                if (!isPartKey(fieldToCheck)) {
                    throw new Error(`${rule} is invalid`);
                }

                const next = match[4] == 'A' ? true : (match[4] == 'R' ? false : match[4]);

                return {
                    next,
                    amount,
                    type: greaterLess,
                    key: fieldToCheck
                }
            }
        )
    );

    const functions: PartToResult[] = ruleDefs.split(',').map((rule): PartToResult => {
        if (!rule.includes(':')) {
            if (rule == 'A') {
                return () => ({type: 'accepted'});
            }
            if (rule == 'R') {
                return () => ({type: 'rejected'});
            }

            return () => ({type: "switch", newMap: rule});
        }

        const match = rule.match(/(.)([<>])(\d+):(.+)/);

        if (!match) {
            throw new Error(`${rule} is invalid`);
        }

        const fieldToCheck = match[1];
        const greaterLess = match[2];
        const amount = parseInt(match[3]);
        const target = match[4];

        if (!isPartKey(fieldToCheck)) {
            throw new Error(`${rule} is invalid`);
        }

        return (part: Part): null | Result => {
            const fieldVal = part[fieldToCheck];

            if (greaterLess == '<') {
                if (!(fieldVal < amount)) {
                    return null
                }
            } else {
                if (!(fieldVal > amount)) {
                    return null
                }
            }

            if (target == 'A') {
                return {type: 'accepted'};
            }
            if (target == 'R') {
                return {type: 'rejected'};
            }

            return {type: "switch", newMap: target};
        }
    });

    rules.set(key, functions)
});

const parts: Part[] = partDefs.split('\n').map(row => {
    const part: Part = {
        a: 0, m: 0, s: 0, x: 0
    }

    row.slice(1, -1).split(',').forEach(def => {
        const [key, val] = def.split('=');

        if (!isPartKey(key)) {
            throw new Error(`${row} is invalid`);
        }

        part[key] = parseInt(val);
    });

    return part;
})

function runRules(part: Part, rule: string = 'in'): boolean {
    const rulesToRun = rules.get(rule);

    if (!rulesToRun) {
        throw new Error(`${rule} does not exist?`);
    }

    for (let rule of rulesToRun) {
        const result = rule(part);
        if (result !== null) {
            switch (result.type) {
                case "accepted":
                    return true;
                case "rejected":
                    return false;
                case "switch":
                    return runRules(part, result.newMap)
            }
        }
    }
    throw new Error(`${rule} did not finish with a result`);
}

const part1 = mappedAccumulator(
    parts.filter(val => runRules(val)),
    (part) => accumulator(Object.values(part))
);

console.log(`Part 1: ${part1}`)

type PartAsRange = Record<keyof Part, [number, number]>;

function valueOfRanges(currentPart: PartAsRange): number {
    const keys: (keyof PartAsRange)[] = ['x', "a", "m", "s"];

    return keys.reduce(
        (prev, curr) => {
            const val = currentPart[curr][1] - currentPart[curr][0] + 1
            return prev * val;
        },
        1
    )
}

function clonePart(part: PartAsRange): PartAsRange {
    return {
        x: [part.x[0], part.x[1]],
        m: [part.m[0], part.m[1]],
        s: [part.s[0], part.s[1]],
        a: [part.a[0], part.a[1]],
    }
}

function isValid(part: PartAsRange) {
    return Object.values(part).every(([a,b]) => a <= b);
}

function getPossibleValues(rule: string = 'in', currentPart: PartAsRange = {
    x: [1, 4000],
    m: [1, 4000],
    s: [1, 4000],
    a: [1, 4000]
}): number {
    const rulesToRun = rulesAsStr.get(rule);

    if (!rulesToRun) {
        throw new Error(`${rule} does not exist?`);
    }

    const values: number[] = []

    for (let rule of rulesToRun) {
        if (!isValid(currentPart)) {
            break;
        }

        switch (rule.type) {
            case "standard":
                if (rule.next === true) {
                    values.push(valueOfRanges(currentPart));
                } else if (rule.next === false) {
                    values.push(0);
                } else {
                    values.push(getPossibleValues(rule.next, currentPart))
                }
                break;
            case "greaterThan":
            case "lessThan":
                const greaterThanPart = clonePart(currentPart);
                const lessThanPart = clonePart(currentPart);

                const amount = rule.amount;
                const key = rule.key;

                if (rule.type == 'greaterThan') {
                    greaterThanPart[key][0] = amount + 1;
                    lessThanPart[key][1] = amount;
                } else {
                    greaterThanPart[key][0] = amount;
                    lessThanPart[key][1] = amount - 1;
                }
                const nextPart = rule.type == 'greaterThan'
                    ? greaterThanPart
                    : lessThanPart

                if (isValid(nextPart)) {
                    if (rule.next === true) {
                        values.push(valueOfRanges(nextPart));
                    } else if (rule.next === false) {
                        values.push(0);
                    } else {
                        values.push(getPossibleValues(rule.next, nextPart))
                    }
                }

                currentPart = rule.type == 'greaterThan'
                    ? lessThanPart
                    : greaterThanPart;
                break;
        }
    }

    return accumulator(values);
}

console.log(`Part 2: ${getPossibleValues()}`);
