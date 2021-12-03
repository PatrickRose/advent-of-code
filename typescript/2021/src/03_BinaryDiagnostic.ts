import getInput from "./util/getInput";

const input = getInput(3);
const binary = input.split("\n");

type Count = {
    0: number,
    1: number
};

const counts: Count[] = [];

binary.forEach(row => {
    for (let i = 0; i < row.length; i++) {
        if (counts.length <= i) {
            counts.push({0: 0, 1: 0});
        }

        const char = row[i];
        const thisCount = counts[i];

        if (char === "0") {
            thisCount["0"]++
        } else if (char === "1") {
            thisCount["1"]++
        } else {
            throw Error(`Unknown character ${char}`);
        }
    }
});

let gamma = '';
let epsilon = '';

counts.forEach(count => {
    if (count["0"] > count["1"]) {
        gamma += '0';
        epsilon += '1';
    } else {
        gamma += '1';
        epsilon += '0';
    }
});

const gammaInt = Number.parseInt(gamma, 2);
console.log(`Gamma is ${gammaInt}`);
const epsilonInt = Number.parseInt(epsilon, 2);
console.log(`Epsilon is ${epsilonInt}`);

console.log(`Part 1: ${gammaInt * epsilonInt}`)

function findRating(allValues: string[], bitToConsider: number, mostCommon: boolean, tieBreak: 0 | 1): string {
    if (allValues.length == 1) {
        return allValues[0];
    } else if (allValues.length == 0) {
        throw Error('No values left!');
    }

    const count: Count = {
        0: 0,
        1: 0,
    };

    allValues.forEach(row => {
        const char = row[bitToConsider];
        if (char === "0") {
            count["0"]++
        } else if (char === "1") {
            count["1"]++
        } else {
            throw Error(`Unknown character ${char}`);
        }
    });

    let charToCheck: "0" | "1";

    if (count["0"] == count["1"]) {
        charToCheck = `${tieBreak}`;
    } else if (mostCommon) {
        charToCheck = count["0"] > count["1"] ? "0" : "1";
    } else {
        charToCheck = count["0"] > count["1"] ? "1" : "0";
    }

    return findRating(
        allValues.filter(row => row[bitToConsider] == charToCheck),
        bitToConsider + 1,
        mostCommon,
        tieBreak
    );
}

const oxygen = findRating(binary, 0, true, 1);
const co2 = findRating(binary, 0, false, 0);

console.log({oxygen, co2});

console.log(`Part 2: ${Number.parseInt(oxygen, 2) * Number.parseInt(co2, 2)}`)
