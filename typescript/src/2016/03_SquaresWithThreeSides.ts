import getInput from "./util/getInput";

const input = getInput(3);

const allNumbers = input.split("\n").map(row => row.split(' ').map(test => Number.parseInt(test, 10)).filter(test => !isNaN(test)));

function validTriangles(numbers: number[]): boolean {
    numbers.sort((a, b) => a - b);

    return numbers[0] + numbers[1] > numbers[2];
}

const part2: number[][] = [];
const values: { 0: number[], 1: number[], 2: number[] } = {
    0: [],
    1: [],
    2: []
}

allNumbers.forEach(
    row => {
        values[0].push(row[0]);
        values[1].push(row[1]);
        values[2].push(row[2]);

        if (values[0].length == 3) {
            part2.push(values[0], values[1], values[2]);
            values[0] = [];
            values[1] = [];
            values[2] = [];
        }
    }
)

console.log(`Part 1: ${allNumbers.filter(validTriangles).length}`);
console.log(`Part 1: ${part2.filter(validTriangles).length}`);
