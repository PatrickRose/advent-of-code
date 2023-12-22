import getInput from "./util/getInput";
import {getMaxXAndYFromStr} from "../util/getMaxXAndYFromStr";
import {
    forEachPoint,
    forEachPointInStr,
    getAdjacentPoints,
    getPoint,
    Point,
    PointMap,
    PointString,
    pointToPointString,
    setPoint
} from "../util/points";
import {accumulator} from "../util/accumulator";

const testInputs = {
    example: `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`
}

const input = getInput(testInputs, 21);

const {maxX} = getMaxXAndYFromStr(input);

const positions: PointMap<boolean> = new Map();
let startPoint: Point = {x:-1, y:-1};

forEachPointInStr(input, (point, char) => {
    if (char == '#') {
        return;
    }

    setPoint(point, true, positions)
    if (char == 'S') {
        startPoint = point;
    }
});

function findReachablePoints(startPoint: Point, steps: number): number {
    const map: Point[][] = [[startPoint]];

    const visited: Set<PointString> = new Set();
    visited.add('0,0');

    for (let i = 0; i < steps; i++) {
        const points = map[i] ?? [];
        const nextPoints: Point[] = [];

        for (let point of points) {
            for (let next of getAdjacentPoints(point.x, point.y, false)) {
                if (!getPoint(next, positions)) {
                    continue;
                }

                if (visited.has(pointToPointString(next))) {
                    continue;
                }

                visited.add(pointToPointString(next))
                nextPoints.push(next);
            }
        }

        if (nextPoints.length > 0) {
            map[i + 1] = nextPoints;
        } else {
            break;
        }
    }

    let reachablePoints = 0;

    forEachPoint(positions, (point) => {
        const startNum = steps % 2 == 0 ? 2 : 1;
        for (let i = startNum; i <= Math.min(steps, map.length - 1); i += 2) {
            const pointSearch = map[i] ?? []

            const find = pointSearch.find(({x, y}) => {
                return point.x == x && point.y == y;
            })

            if (find) {
                reachablePoints++
                break;
            }
        }
    })

    return reachablePoints;
}

console.log(`Part 1: ${findReachablePoints(startPoint, input == testInputs.example ? 6 : 64)}`);

if (input == testInputs.example) {
    throw new Error('Must be real input');
}

const size = maxX;
const steps = 26501365;

const gridWidth = Math.floor(steps / size);
const oddGrids = (Math.floor(gridWidth / 2) * 2 + 1) ** 2;
const evenGrids = (Math.floor((gridWidth + 1)/ 2) * 2) ** 2;

const oddReachable = findReachablePoints(startPoint, size *2+1);
const evenReachable = findReachablePoints(startPoint, size*2);

const topCorner = findReachablePoints({x: startPoint.x, y: size - 1}, size - 1);
const leftCorner = findReachablePoints({x: size - 1, y: startPoint.y}, size - 1);
const bottomCorner = findReachablePoints({x: startPoint.x, y: 0}, size - 1);
const rightCorner = findReachablePoints({x: 0, y: startPoint.y}, size - 1);

const smallSteps = Math.floor(size / 2) - 1;
const smallTopRight = findReachablePoints({x: 0, y: size-1}, smallSteps);
const smallTopLeft = findReachablePoints({x: size-1, y: size-1}, smallSteps);
const smallBottomRight = findReachablePoints({x: 0, y: 0}, smallSteps);
const smallBottomLeft = findReachablePoints({x: size-1, y: 0}, smallSteps);

const largeSteps = Math.floor((size * 3) / 2) - 1;
const largeTopRight = findReachablePoints({x: 0, y: size-1}, largeSteps);
const largeTopLeft = findReachablePoints({x: size-1, y: size-1}, largeSteps);
const largeBottomRight = findReachablePoints({x: 0, y: 0}, largeSteps);
const largeBottomLeft = findReachablePoints({x: size-1, y: 0}, largeSteps);

const parts = [
    oddReachable * oddGrids,
    evenReachable * evenGrids,
    topCorner,
    leftCorner,
    bottomCorner,
    rightCorner,
    (gridWidth + 1 )*(smallTopRight + smallTopLeft + smallBottomRight + smallBottomLeft),
    (gridWidth)*(largeTopRight + largeTopLeft + largeBottomRight + largeBottomLeft),
];

console.log(`Part 2: ${accumulator(parts)}`)
