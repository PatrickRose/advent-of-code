import getInput from "./util/getInput";
import {mappedAccumulator} from "../util/accumulator";

const testInputs = {
    example: `#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`
}

const input = getInput(testInputs, 25);

type KeyOrLock = [number, number, number, number, number];

const keys: KeyOrLock[] = [];
const locks: KeyOrLock[] = [];

input.split('\n\n').forEach((possible) => {
    const rows = possible.split('\n');
    let isKey = rows[0] == '.....';
    let toReturn: KeyOrLock = [0,0,0,0,0];
    for(const row of rows.slice(1)) {
        for(let i=0; i<5;i++) {
            if (row[i] == '#') {
                toReturn[i]++;
            }
        }
    }

    if (isKey) {
        keys.push(toReturn);
    } else {
        locks.push(toReturn);
    }
});

const part1 = mappedAccumulator(locks, (lock) => {
    return keys.filter((key) => key.every((val, index) => {
        return val + lock[index] <= 6;
    })).length
});

console.log(`Part 1: ${part1}`);
