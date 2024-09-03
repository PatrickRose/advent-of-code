import getInput from "./util/getInput";
import {getAdjacentPoints, getPoint, Point, PointMap, setPoint} from "../util/points";

const testInputs = {
    example: `.#.#.#
...##.
#....#
..#...
#.#..#
####..`
}

const input = getInput(testInputs, 18);

const gridSize = input == testInputs.example ? 6 : 100;
const numMoves = input == testInputs.example ? 4 : 100;

let grid: PointMap<boolean> = new Map<number, Map<number, boolean>>();
input.split('\n').forEach((line, y) => {
    line.split('').forEach((char, x) => {
        setPoint({x,y}, char == '#', grid);
    })
});

function runUpdate(grid: PointMap<boolean>): PointMap<boolean> {
    const newGrid = new Map<number, Map<number, boolean>>();

    for (let x = 0; x<gridSize; x++) {
        for (let y = 0; y<gridSize; y++) {
            const points = getAdjacentPoints(x, y, true);

            const active = points.filter((val) => getPoint(val, grid)).length;

            const currValue = getPoint({x,y}, grid);
            const newValue = currValue
                ? (active == 2 || active == 3)
                : (active == 3);

            setPoint({x,y}, newValue, newGrid);
        }
    }

    return newGrid;
}

const corners: Point[] = [
    {x: 0, y: 0},
    {x: 0, y: gridSize-1},
    {x: gridSize-1, y: 0},
    {x: gridSize-1, y: gridSize-1},
]

function runSteps(numSteps: number, grid: PointMap<boolean>, partTwo: boolean): number {
    let newGrid = grid;
    for(let i = 0; i < numSteps; i++) {
        if (partTwo) {
            corners.forEach(point => setPoint(point, true, newGrid))
        }
        newGrid = runUpdate(newGrid);
        if (partTwo) {
            corners.forEach(point => setPoint(point, true, newGrid))
        }
    }

    return Array.from(newGrid.values())
        .reduce(
            (prev, curr) => {
                return prev + Array.from(curr.values()).filter(val=>val).length
            },
            0
        )
}


console.log(`Part 1: ${runSteps(numMoves, grid, false)}`);
console.log(`Part 2: ${runSteps(numMoves, grid, true)}`);
