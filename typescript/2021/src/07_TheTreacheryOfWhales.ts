import getInput from "./util/getInput";

const exampleInput = `16,1,2,0,4,2,7,1,2,14`;

const realInput = getInput(7);

const input = realInput;
const positions = input.split(',').map(val => Number.parseInt(val, 10));

function triangle(number: number): number {
    return (number * (number + 1)) / 2;
}

positions.sort((a, b) => a - b);

const median = positions[(positions.length / 2)];
const mean = Math.ceil(positions.reduce((prev, curr) => prev + curr) / positions.length);

const fuelCostPart1 = positions.map(val => Math.abs(median - val)).reduce((prev, curr) => prev + curr);
const fuelCostPart2 = positions.map(val => triangle(Math.abs(mean - val))).reduce((prev, curr) => prev + curr);

console.log(`Part 1: ${fuelCostPart1}`);
console.log(`Part 2: ${fuelCostPart2}`);
