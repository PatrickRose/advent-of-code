import getInput from "./util/getInput";

const testInputs = {}

const input = getInput(testInputs, 20);

const target = Number.parseInt(input, 10);

const presents: number[] = [];
const presents2: number[] = [];

for(let e = 1; e < (target/10); e++) {
    let visits = 0;
    for(let i=e; i< (target/10); i += e) {
        if (!presents[i]) {
            presents[i] = 10;
        }

        presents[i] += (e*10);

        if (visits < 50) {
            if (!presents2[i]) {
                presents2[i] = (e*11);
            } else {
                presents2[i] += (e*11);
            }
            visits++;
        }
    }
}

function findMinimum(houses: number[]): number {
    let house = 1;

    while (houses[house] < target) {
        house++;
    }

    return house;
}


console.log(`Part 1: ${findMinimum(presents)}`);
console.log(`Part 1: ${findMinimum(presents2)}`);
