import getInput from "./util/getInput";
import {getPoint, Point, PointMap, setPoint} from "../util/points";

const testInputs = {
    example1: `..X...
.SAMX.
.A..A.
XMAS.S
.X....`,
    example2: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`
}

const input = getInput(testInputs, 4);

const points: PointMap<string> = new Map;

input.split('\n').forEach((row, y) => row.split('').forEach((char, x) => setPoint({x, y}, char, points)));

const xLength = input.split('\n')[0].length;
const yLength = input.split('\n').length;
const directions: Point[] = [
    {x: -1, y: -1},
    {x: 0, y: -1},
    {x: 1, y: -1},
    {x: -1, y: 0},
    {x: 0, y: 0},
    {x: 1, y: 0},
    {x: -1, y: 1},
    {x: 0, y: 1},
    {x: 1, y: 1},
]

let count = 0;

for (let y = 0; y < yLength; y++) {
    for (let x = 0; x < xLength; x++) {
        if (getPoint({x, y}, points) != 'X') {
            continue;
        }

        // Otherwise, check all 8 directions
        count += directions.filter((diff) => {
            const expected = 'MAS';
            const newPoint: Point = {x, y}

            for (let i = 0; i < expected.length; i++) {
                newPoint.x += diff.x;
                newPoint.y += diff.y;

                if (getPoint(newPoint, points) != expected[i]) {
                    return false;
                }
            }

            return true;
        }).length;
    }
}

console.log(`Part 1: ${count}`);

const parts: { diff: Point, expected: string }[][] = [
    [
        {diff: {x: 1, y: 1}, expected: 'A'},
        {diff: {x: 0, y: 0}, expected: 'M'},
        {diff: {x: 2, y: 0}, expected: 'S'},
        {diff: {x: 0, y: 2}, expected: 'M'},
        {diff: {x: 2, y: 2}, expected: 'S'},
    ],
    [
        {diff: {x: 1, y: 1}, expected: 'A'},
        {diff: {x: 0, y: 0}, expected: 'S'},
        {diff: {x: 2, y: 0}, expected: 'M'},
        {diff: {x: 0, y: 2}, expected: 'S'},
        {diff: {x: 2, y: 2}, expected: 'M'},
    ],
    [
        {diff: {x: 1, y: 1}, expected: 'A'},
        {diff: {x: 0, y: 0}, expected: 'M'},
        {diff: {x: 2, y: 0}, expected: 'M'},
        {diff: {x: 0, y: 2}, expected: 'S'},
        {diff: {x: 2, y: 2}, expected: 'S'},
    ],
    [
        {diff: {x: 1, y: 1}, expected: 'A'},
        {diff: {x: 0, y: 0}, expected: 'S'},
        {diff: {x: 2, y: 0}, expected: 'S'},
        {diff: {x: 0, y: 2}, expected: 'M'},
        {diff: {x: 2, y: 2}, expected: 'M'},
    ]
];

let xMasMas = 0;

for (let y = 0; y < yLength; y++) {
    for (let x = 0; x < xLength; x++) {
        const foundXMasMas = parts.some(option => option.every(({diff, expected}) => {
            const point = {x: x + diff.x, y: y + diff.y};

            return getPoint(point, points) == expected;
        }));

        if (foundXMasMas) {
            xMasMas++;
        }
    }
}

console.log(`Part 2: ${xMasMas}`);
