import getInput from "./util/getInput";
import {calculateManhattan, Point} from "../util/points";

const testInputs = {
    example: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`
}

const input = getInput(testInputs, 11);

const stars: Point[] = [];
const maxX = input.split('\n')[0].length;
const maxY = input.split('\n').length;

input.split('\n').forEach((row, y) => {
    row.split('').forEach((char, x) => {
        if (char == '#') {
            stars.push({x, y});
        }
    })
});

const emptyCols: number[] = [];

for (let x = 0; x < maxX; x++) {
    const rowIsEmpty = stars.every(point => point.x != x);

    if (rowIsEmpty) {
        emptyCols.push(x);
    }
}
emptyCols.sort((a, b) => b - a);

const emptyRows: number[] = [];

for (let y = 0; y < maxY; y++) {
    const rowIsEmpty = stars.every(point => point.y != y);

    if (rowIsEmpty) {
        emptyRows.push(y);
    }
}
emptyRows.sort((a, b) => b - a);

function calculateDistancePairs(expansionAmount: number) {
    const points = stars.map(val => ({...val}));

    emptyCols.forEach(x => {
        points.filter(point => point.x > x)
            .forEach(point => point.x += (expansionAmount - 1));
    });

    emptyRows.forEach(y => {
        points.filter(point => point.y > y)
            .forEach(point => point.y += (expansionAmount - 1));
    });

    return points.map((value, index) => {
            return points.slice(index + 1).reduce((prev, curr) => calculateManhattan(value, curr) + prev, 0)
        }
    ).reduce((prev, curr) => prev + BigInt(curr), 0n);
}

console.log(`Part 1: ${(calculateDistancePairs(2))}`);
console.log(`Part 2: ${(calculateDistancePairs(1000000))}`);
