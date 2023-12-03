import getInput from "./util/getInput";
import parseInt from "../util/parseInt";

const testInputs = {}

const input = getInput(testInputs, 2);

const presents: { l: number, w: number, h: number }[] = input.split('\n').map(
    row => {
        const [l, w, h] = row.split('x');

        return {l: parseInt(l), w: parseInt(w), h: parseInt(h)}
    }
);

const part1 = presents.map(
    ({l, w, h}) => {
        const lw = l * w;
        const wh = w * h;
        const hl = h * l;

        const toAdd = [lw, lw, wh, wh, hl, hl];

        toAdd.sort((a, b) => a - b);
        toAdd.push(toAdd[0]);

        return toAdd.reduce((prev, curr) => prev + curr);
    })
    .reduce((prev, curr) => prev + curr);

console.log(`Part 1: ${part1}`);

const part2 = presents.map(
    ({l, w, h}) => {
        const toAdd = [l, w, h];

        toAdd.sort((a, b) => a - b);
        toAdd.pop();

        return 2 * toAdd[0] + 2 * toAdd[1] + (l * w * h);
    })
    .reduce((prev, curr) => prev + curr);

console.log(`Part 2: ${part2}`);

