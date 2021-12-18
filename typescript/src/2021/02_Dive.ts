import getInput from "./util/getInput";

const input = getInput(2);

type Point = {
    horizontal: number,
    depth: number,
    aim: number
}

type Instruction = (amount: number, point: Point) => Point;
type InstructionType = 'forward' | 'down' | 'up';

type AllInstructions = { [K in InstructionType]: Instruction };

const part1Map: AllInstructions = {
    'forward': (amount, {horizontal, depth, aim}) => {
        return {
            horizontal: horizontal + amount,
            depth,
            aim,
        }
    },
    'up': (amount, {horizontal, depth, aim}) => {
        return {
            horizontal,
            depth: depth - amount,
            aim,
        }
    },
    'down': (amount, {horizontal, depth, aim}) => {
        return {
            horizontal,
            depth: depth + amount,
            aim,
        }
    }
};
const part2Map: AllInstructions = {
    'forward': (amount, {horizontal, depth, aim}) => {
        return {
            horizontal: horizontal + amount,
            depth: depth + (aim * amount),
            aim,
        }
    },
    'up': (amount, {horizontal, depth, aim}) => {
        return {
            horizontal,
            aim: aim - amount,
            depth,
        }
    },
    'down': (amount, {horizontal, depth, aim}) => {
        return {
            horizontal,
            depth,
            aim: aim + amount
        }
    }
};

const instructions = input.split("\n");

let point1: Point = {horizontal: 0, depth: 0, aim: 0};
let point2: Point = {horizontal: 0, depth: 0, aim: 0};

instructions.forEach(val => {
    const [instruction, number] = val.split(' ');

    switch (instruction) {
        case 'forward':
        case 'down':
        case 'up':
            point1 = part1Map[instruction](Number.parseInt(number, 10), point1);
            point2 = part2Map[instruction](Number.parseInt(number, 10), point2);
            break;
        default:
            throw Error(`${val} did not contain a single instruction`);
    }
})

console.log(`Part 1: ${point1.horizontal * point1.depth}`);
console.log(`Part 1: ${point2.horizontal * point2.depth}`);
