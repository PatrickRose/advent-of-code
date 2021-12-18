import getInput from "./util/getInput";

const input = getInput(1);

const measurements: number[] = input.split("\n").map(val => Number.parseInt(val, 10));

function valueIncreases(val: number, index: number, all: number[]): boolean {
    if (index == 0) {
        return false;
    }

    return val > all[index - 1];
}

const part1 = measurements.filter(valueIncreases);

console.log(`Part 1: ${part1.length}`);

const shiftingSums: number[] = [];
measurements.forEach((val, index, all) => {
    if (all.length > index + 2) {
        shiftingSums.push(all[index] + all[index + 1] + all[index + 2]);
    }
})
const part2 = shiftingSums.filter(valueIncreases);

console.log(`Part 2: ${part2.length}`);
