import getInput from "./util/getInput";
import {mappedAccumulator} from "../util/accumulator";

const testInputs = {
    example: `123 328  51 64
 45 64  387 23
  6 98  215 314
*   +   *   +  `
}

const input = getInput(testInputs, 6);

type Homework = {
    parts: number[],
    operation: '+' | '*'
}

const homeworks: Homework[] = [];

input.split('\n').forEach((line) => {
    const numbers = line.match(/\d+/g);
    if (numbers) {
        for(let i = 0; i < numbers.length; i++) {
            while (homeworks.length < i+1) {
                homeworks.push({
                    parts: [],
                    operation: '+',
                });
            }

            const homework = homeworks[i];
            homework.parts.push(Number.parseInt(numbers[i], 10));
        }
    }

    const operations = line.match(/(\*|\+)/g);

    if (operations) {
        for(let i = 0; i < operations.length; i++) {
            while (homeworks.length < i+1) {
                homeworks.push({
                    parts: [],
                    operation: '+',
                });
            }

            const homework = homeworks[i];
            homework.operation = operations[i] == '*' ? '*' : '+';
        }
    }
});

const calculateHomework = (homework: Homework) => {
    return homework.parts.reduce((prev, curr) => {
        if (homework.operation == '+') {
            return prev + curr;
        } else {
            return prev * curr;
        }
    })
};

const part1 = mappedAccumulator(homeworks, calculateHomework);
console.log(`Part 1: ${part1}`);

const part2Homeworks: Homework[] = [];

const rows = input.split('\n');
let currHomework: Homework = {
    parts: [],
    operation: '+',
}

// Intentionally do an extra loop so we push the last homework on
const length = rows.reduce((prev, row) => Math.max(prev, row.length), 0);

for (let i = 0; i < length+1; i++) {
    const parts = rows.map((row) => row[i]);

    const operation = parts.pop();

    if (operation == '+' || operation == '*') {
        currHomework.operation = operation;
    }

    const number = parts.join('').trim();
    if (number == '') {
        part2Homeworks.push(currHomework);
        currHomework = {
            parts: [],
            operation: '+',
        }
    } else {
        currHomework.parts.push(Number.parseInt(number, 10));
    }
}

const part2 = mappedAccumulator(part2Homeworks, calculateHomework);
console.log(`Part 2: ${part2}`);
