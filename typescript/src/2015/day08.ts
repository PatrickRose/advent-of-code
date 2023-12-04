import getInput from "./util/getInput";

const testInputs = {}

const input = getInput(testInputs, 8);

const rows = input.split('\n');
const part1 = rows
    .map(row => {
        const rowLength = row.length;
        let memoryLength = 0;

        const chars = row.split('').slice(1, -1);

        while (chars.length > 0) {
            const char = chars.shift();
            memoryLength++;

            if (char == '\\') {
                const nextChar = chars.shift();
                if (nextChar == 'x') {
                    chars.shift();
                    chars.shift();
                }
            }
        }

        return rowLength - memoryLength;
    })
    .reduce((prev, curr) => prev + curr);

console.log(`Part 1: ${part1}`);

const part2 = rows
    .map(row => {
        const rowLength = row.length;

        const memoryLength = JSON.stringify(row).length;

        return memoryLength - rowLength;
    })
    .reduce((prev, curr) => prev + curr);

console.log(`Part 2: ${part2}`);
