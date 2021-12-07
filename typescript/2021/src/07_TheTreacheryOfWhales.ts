import getInput from "./util/getInput";

const exampleInput = `16,1,2,0,4,2,7,1,2,14`;

const realInput = getInput(7);

const input = realInput;
const positions = input.split(',').map(val => Number.parseInt(val, 10));

let [minPart1, minPart2] = [Infinity, Infinity]

function triangle(number: number): number {
    return (number * (number + 1)) / 2;
}

for (let i = Math.min(...positions); i < Math.max(...positions); i++) {
    const fuelCostPart1 = positions.map(val => Math.abs(i - val)).reduce((prev, curr) => prev + curr);
    const fuelCostPart2 = positions.map(val => triangle(Math.abs(i - val))).reduce((prev, curr) => prev + curr);

    if (fuelCostPart1 < minPart1) {
        minPart1 = fuelCostPart1;
    }
    if (fuelCostPart2 < minPart2) {
        minPart2 = fuelCostPart2;
    }
}

console.log(`Part 1: ${minPart1}`);
console.log(`Part 2: ${minPart2}`);
