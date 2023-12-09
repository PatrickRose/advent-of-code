import getInput from "./util/getInput";
import parseInt from "../util/parseInt";

const testInputs = {
    example: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
    weirdSequence: `3 -3 -6 11 81 262 654 1429 2882 5527 10296 18955 34930 64825 120957 225074 412708 735639 1255391 2011191 2927270`
}

const input = getInput(testInputs, 9);

const readings: number[][] = input.split('\n').map(
    row => row.split(' ').map(val => parseInt(val))
)

function getDifferences(values: number[]): number[] {
    return values.slice(1).map((value, index) => value - values[index])
}

function getNextValue(differences: number[]): number {
    if (differences.every(val => val == 0)) {
        return 0;
    }

    // Otherwise, calculate the differences
    const nextValue = getNextValue(getDifferences(differences));

    return (differences.slice(-1)[0]) + nextValue;
}

const part1 = readings.map(getNextValue).reduce((prev, curr) => prev+curr);

console.log(`Part 1: ${part1}`);

const part2 = readings.map(val => getNextValue([...val].reverse())).reduce((prev, curr) => prev+curr);

console.log(`Part 2: ${part2}`)
