import getInput from "./util/getInput";

const input = getInput(23);

type Cups = Array<number>;

let rawCups: Cups = input.split('').map(val => Number(val));

const part1: Map<number, number> = new Map<number, number>();

rawCups.forEach((val, index, all) => {
    part1.set(val, all[(index + 1) % all.length]);
});

function perform(current: number, cupMapping: Map<number, number>, maxVal: number, numMoves: number): Map<number, number> {
    let move = 0;
    while (move < numMoves) {
        move++;

        const toMove: Array<number> = [];
        const firstMove = cupMapping.get(current);

        if (firstMove === undefined) {
            throw new Error(`Didnt get val at the end of the list (looked for ${current})`);
        }

        toMove.push(firstMove);

        const secondMove = cupMapping.get(firstMove);

        if (secondMove === undefined) {
            throw new Error(`Didnt get val at the end of the list (looked for ${firstMove})`);
        }

        toMove.push(secondMove);

        const thirdMove = cupMapping.get(secondMove);

        if (thirdMove === undefined) {
            throw new Error(`Didnt get val at the end of the list (looked for ${secondMove})`);
        }

        toMove.push(thirdMove);

        const afterThird = cupMapping.get(thirdMove);

        if (afterThird === undefined) {
            throw new Error(`Didnt get val at the end of the list (looked for ${thirdMove})`);
        }

        let destination = current;

        do {
            destination--;

            if (destination == 0) {
                destination = maxVal;
            }
        } while (toMove.includes(destination))

        const afterDestination = cupMapping.get(destination);

        if (afterDestination === undefined) {
            throw new Error(`Didnt get val after destination (looked for ${afterDestination})`);
        }

        cupMapping.set(current, afterThird);
        cupMapping.set(destination, firstMove);
        cupMapping.set(thirdMove, afterDestination);

        const nextCurrent = cupMapping.get(current);

        if (nextCurrent === undefined) {
            throw new Error('Lost the next current!');
        }

        current = nextCurrent;
    }

    return cupMapping;
}

const maxVal = Math.max(...rawCups);
perform(rawCups[0], part1, maxVal, 100);

let currVal = 1;
let answer: string = '';

do {
    const next = part1.get(currVal);

    if (next === undefined) {
        throw new Error()
    }

    currVal = next;
    answer += next;
} while (currVal != 1);

console.log(answer.slice(0, 8));

const part2: Map<number, number> = new Map<number, number>();

rawCups.forEach((val, index, all) => {
    const mappingVal = index + 1 == all.length ? maxVal + 1 : all[(index + 1) % all.length];

    part2.set(val, mappingVal);
});

for (let i = maxVal + 1; i < 1000000; i++) {
    part2.set(i, i + 1);
}

part2.set(1000000, rawCups[0]);

perform(rawCups[0], part2, 1000000, 10000000);

const after1 = part2.get(1);

if (after1 === undefined) {
    throw new Error()
}

const after2 = part2.get(after1);

if (after2 === undefined) {
    throw new Error()
}

console.log(`Part 2: ${after1} * ${after2} = ${after1 * after2}`);
