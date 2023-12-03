import getInput from "./util/getInput";

const testInputs = {}

const input = getInput(testInputs, 1);

const instructions: number[] = input.split('')
    .map(val => val == '(' ? 1 : -1);

const part1: number = instructions
    .reduce((previousValue, currentValue) => previousValue+currentValue);

console.log(`Part 1: ${part1}`)

let pos = 0;
instructions.forEach((val, index) => {
    if (pos == -1) {
        return;
    }
    pos += val;

    if (pos == -1) {
        console.log(`Part 2: ${index + 1}`)
    }
})
