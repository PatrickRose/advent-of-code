import getInput from "./util/getInput";
import {mappedAccumulator} from "../util/accumulator";

const testInputs = {
    example: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`
}

const input = getInput(testInputs, 7);

type Calibrations = {
    target: number,
    parts: number[]
}

const calibrations: Calibrations[] = input.split('\n').map(row => {
    const [targetRaw, partsRaw] = row.split(': ');

    return {
        target: Number.parseInt(targetRaw, 10),
        parts: partsRaw.split(' ').map(val => Number.parseInt(val, 10)),
    }
});

function matchesCalibration(target: number, parts: number[], allowConcat: boolean = false, current: number = 0): boolean {
    const [toUse, ...others] = parts;

    if (toUse == undefined) {
        return target == current;
    }

    if (current > target) {
        return false;
    }

    if (current == 0) {
        return matchesCalibration(target, others, allowConcat, toUse);
    }

    if (matchesCalibration(target, others, allowConcat, current + toUse)) {
        return true;
    }

    if (matchesCalibration(target, others, allowConcat, current * toUse)) {
        return true;
    }

    return allowConcat
        ? matchesCalibration(target, others, allowConcat, Number.parseInt(`${current}${toUse}`, 10))
        : false;
}

const equations = calibrations.filter(({target, parts}) => matchesCalibration(target, parts));

const part1 = mappedAccumulator(equations, (({target}) => target));

console.log(`Part 1: ${part1}`);

const equations2 = calibrations.filter(({target, parts}) => matchesCalibration(target, parts, true));

const part2 = mappedAccumulator(equations2, (({target}) => target));

console.log(`Part 2: ${part2}`);
