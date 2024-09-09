import getInput from "./util/getInput";
import {accumulator} from "../util/accumulator";

const testInputs = {
    example: `1
2
3
4
5
7
8
9
10
11`
}

const input = getInput(testInputs, 24);

const packages = input.split('\n').map(val => Number.parseInt(val, 10));
const packageValues = accumulator(packages);

function buildOptions(packages: number[], targetLength: number, chain: number[]): number[][] {
    if (chain.length == targetLength) {
        return [chain];
    }

    const options: number[][] = [];

    packages.forEach((p, index) => {
        const newChain = [...chain, p];
        const newPackages = packages.slice(index+1);

        options.push(...buildOptions(newPackages, targetLength, newChain));
    });

    return options;
}

function findQuantumEntanglement(groupCount: number): number {
    let length = 1;

    while (true) {
        const options = buildOptions(packages, length, []);

        const works = options.filter((option) => accumulator(option) == (packageValues / groupCount));

        if (works.length != 0) {
            works.sort((a, b) => {
                if (a.length > b.length) {
                    return 1;
                }

                if (a.length < b.length) {
                    return -1;
                }

                const aQE = a.reduce((prev, curr) => prev * curr, 1);
                const bQE = b.reduce((prev, curr) => prev * curr, 1);

                return aQE - bQE;
            });

            return works[0].reduce((prev, curr) => prev * curr, 1);
        }

        length++;
    }
}

console.log(`Part 1: ${findQuantumEntanglement(3)}`);
console.log(`Part 1: ${findQuantumEntanglement(4)}`);
