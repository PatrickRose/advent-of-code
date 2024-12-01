import getInput from "./util/getInput";
import {accumulator} from "../util/accumulator";

const testInputs = {
    example: `3   4
4   3
2   5
1   3
3   9
3   3`
}

const input = getInput(testInputs, 1);

const leftList: number[] = [];
const rightList: number[] = [];

input.split('\n').forEach(row => {
    const [left, right] = row.split(/\s+/).map(val => Number.parseInt(val, 10));
    leftList.push(left);
    rightList.push(right);
})

leftList.sort((a,b) => a-b);
rightList.sort((a,b) => a-b);

const diffs = leftList.map((_, index) => Math.abs(leftList[index] - rightList[index]));

console.log(`Part 1: ${accumulator(diffs)}`)

const similarities = leftList.map(val => {
    const appears = rightList.filter(r => val == r).length;

    return val * appears;
})

console.log(`Part 2: ${accumulator(similarities)}`);
