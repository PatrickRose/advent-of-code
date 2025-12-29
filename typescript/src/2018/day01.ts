import getInput from "./util/getInput";
import {mappedAccumulator} from "../util/accumulator";

const testInputs = {
    example: `+1
-2
+3
+1`
}

const input = getInput(testInputs, 1);

const numbers = input.split('\n').map(val => Number.parseInt(val, 10));

const part1 = mappedAccumulator(numbers, (val) => val);

console.log(`Part 1: ${part1}`)

const hits = new Set<number>();

let currVal = 0;
let i = 0;

while (true) {
    hits.add(currVal);
    const val = numbers[i % numbers.length];

    currVal += val;

    if (hits.has(currVal)) {
        console.log(`Part 2: ${currVal}`);
        break;
    }

    i++;
}
