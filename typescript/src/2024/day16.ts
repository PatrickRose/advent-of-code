import getInput from "./util/getInput";
import {
    applyDirectionToPoint,
    Direction,
    forEachPointInStr,
    getPoint,
    Point,
    PointMap,
    PointString,
    pointToPointString,
    setPoint
} from "../util/points";

const testInputs = {
    example: `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`,
    second: `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`
}

const input = getInput(testInputs, 16);

const pointMap: PointMap<boolean> = new Map;
let start: Point = {x: -1, y: -1};
let end: Point = {x: -1, y: -1};
forEachPointInStr(input, (point, val) => {
    switch (val) {
        case 'S':
            setPoint(point, true, pointMap);
            start = point;
            break;
        case 'E':
            setPoint(point, true, pointMap);
            end = point;
            break;
        case '.':
            setPoint(point, true, pointMap);
            break;
    }
})

function turnLeft(currentDirection: Direction): Direction {
    switch (currentDirection) {
        case 'north':
            return 'west';
        case 'west':
            return 'south';
        case 'south':
            return 'east';
        case 'east':
            return 'north';
    }
}

function turnRight(currentDirection: Direction): Direction {
    switch (currentDirection) {
        case 'north':
            return 'east';
        case 'east':
            return 'south';
        case 'south':
            return 'west';
        case 'west':
            return 'north';
    }
}

function part1(): number {
    const stack: [Point, Direction, number][] = [[start, 'east', 0]];
    type CacheKey = `${PointString},${Direction}`;

    const cache: Map<CacheKey, number> = new Map;

    let val;
    while (val = stack.shift()) {
        const [currentPoint, currentDirection, currentScore] = val;
        const cacheKey: CacheKey = `${pointToPointString(currentPoint)},${currentDirection}`;

        if (currentPoint.x == end.x && currentPoint.y == end.y) {
            return currentScore;
        }

        if (cache.get(cacheKey) !== undefined) {
            continue;
        }

        cache.set(cacheKey, currentScore);

        // Our three options are to turn left
        stack.push([currentPoint, turnLeft(currentDirection), currentScore+1000]);
        // Turn right
        stack.push([currentPoint, turnRight(currentDirection), currentScore + 1000]);

        // Or to move forward
        const moveForwardPoint = applyDirectionToPoint(currentPoint, currentDirection);
        if (getPoint(moveForwardPoint, pointMap)) {
            stack.push([moveForwardPoint, currentDirection, currentScore + 1]);
        }

        stack.sort((a, b) =>  a[2] - b[2]);
    }

    throw new Error('Did not find the exit');
}

const part1Res = part1();
console.log(`Part 1: ${part1Res}`);
function part2(shortestPath: number): number {
    const stack: [Point, Direction, number, Point[]][] = [[start, 'east', 0, []]];
    type CacheKey = `${PointString},${Direction}`;

    const cache: Map<CacheKey, number> = new Map;

    const ends: Map<number, Point[]> = new Map;

    let val;
    while (val = stack.shift()) {
        const [currentPoint, currentDirection, currentScore, points] = val;
        const cacheKey: CacheKey = `${pointToPointString(currentPoint)},${currentDirection}`;

        if (currentScore > shortestPath) {
            continue;
        }

        if (currentPoint.x == end.x && currentPoint.y == end.y) {
            let vals = ends.get(currentScore)
            if (!vals) {
                vals = [];
                ends.set(currentScore, vals)
            }
            vals.push(...points, currentPoint);
            continue;
        }

        const cacheVal = cache.get(cacheKey);
        if (cacheVal !== undefined && cacheVal != currentScore) {
            continue;
        }

        cache.set(cacheKey, currentScore);

        // Our three options are to turn left
        stack.push([currentPoint, turnLeft(currentDirection), currentScore+1000, [...points]]);
        // Turn right
        stack.push([currentPoint, turnRight(currentDirection), currentScore + 1000, [...points]]);

        // Or to move forward
        const moveForwardPoint = applyDirectionToPoint(currentPoint, currentDirection);
        if (getPoint(moveForwardPoint, pointMap)) {
            stack.push([moveForwardPoint, currentDirection, currentScore + 1, [...points, currentPoint]]);
        }

        stack.sort((a, b) =>  a[2] - b[2]);
    }

    const minKey = Math.min(...ends.keys(), Infinity);
    const result: Set<PointString> = new Set;
    for (const point of ends.get(minKey) ?? []) {
        result.add(pointToPointString(point));
    }

    return result.size;
}

console.log(`Part 2: ${part2(part1Res)}`);
