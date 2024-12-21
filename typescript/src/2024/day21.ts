import getInput from "./util/getInput";
import {
    applyDirectionToPoint,
    calculateManhattan,
    Direction,
    DIRECTIONS,
    forEachPoint,
    getPoint,
    Point,
    PointMap,
    pointMatches,
    PointString,
    pointToPointString,
    setPoint
} from "../util/points";
import {mappedAccumulator} from "../util/accumulator";
import {getValueFromCache} from "../util/cache";

const testInputs = {
    example: `029A
980A
179A
456A
379A`
}

const input = getInput(testInputs, 21);

type Numeric = 'A' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0';
type Directional = 'A' | '>' | '<' | '^' | 'v';

const numericKeypad: PointMap<Numeric> = new Map;
const directionalKeypad: PointMap<Directional> = new Map;

setPoint({x: 0, y: 0}, '7', numericKeypad);
setPoint({x: 1, y: 0}, '8', numericKeypad);
setPoint({x: 2, y: 0}, '9', numericKeypad);
setPoint({x: 0, y: 1}, '4', numericKeypad);
setPoint({x: 1, y: 1}, '5', numericKeypad);
setPoint({x: 2, y: 1}, '6', numericKeypad);
setPoint({x: 0, y: 2}, '1', numericKeypad);
setPoint({x: 1, y: 2}, '2', numericKeypad);
setPoint({x: 2, y: 2}, '3', numericKeypad);
setPoint({x: 1, y: 3}, '0', numericKeypad);
setPoint({x: 2, y: 3}, 'A', numericKeypad);

setPoint({x: 1, y: 0}, '^', directionalKeypad);
setPoint({x: 2, y: 0}, 'A', directionalKeypad);
setPoint({x: 0, y: 1}, '<', directionalKeypad);
setPoint({x: 1, y: 1}, 'v', directionalKeypad);
setPoint({x: 2, y: 1}, '>', directionalKeypad);

const numericMap: Map<Numeric, Record<Numeric, Directional[][]>> = new Map;

const directionToDirectional: Record<Direction, Directional> = {
    east: '>',
    north: '^',
    south: 'v',
    west: '<'
}

forEachPoint(numericKeypad, (point, val) => {
    const toSet: Record<Numeric, Directional[][]> = {
        "0": [],
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": [],
        "6": [],
        "7": [],
        "8": [],
        "9": [],
        A: []
    };

    const stack: [Point, Directional[], PointString[]][] = [[point, [], []]];
    let toCheck;
    while (toCheck = stack.pop()) {
        const [currPoint, path, pointsOnPath] = toCheck;
        const currVal = getPoint(currPoint, numericKeypad);

        if (currVal === undefined) {
            continue;
        }

        const manhattan = calculateManhattan(point, currPoint);

        // Then this can't be the shortest path
        if (path.length > manhattan) {
            continue;
        }

        toSet[currVal].push([...path, 'A']);

        DIRECTIONS.forEach(direction => {
            const newPoint = applyDirectionToPoint(currPoint, direction);
            const newPointStr = pointToPointString(newPoint);

            if (
                // We've stepped off the edge
                getPoint(newPoint, numericKeypad) === undefined
                // We've already been here
                || pointsOnPath.includes(newPointStr)
            ) {
                return;
            }

            stack.push([newPoint, [...path, directionToDirectional[direction]], [...pointsOnPath, newPointStr]])
        })
    }

    numericMap.set(val, toSet);
});

const directionalMap: Map<Directional, Record<Directional, Directional[][]>> = new Map;

forEachPoint(directionalKeypad, (point, val) => {
    const toSet: Record<Directional, Directional[][]> = {
        "<": [],
        ">": [],
        "^": [],
        "v": [],
        A: []
    };

    const stack: [Point, Directional[], PointString[]][] = [[point, [], []]];
    let toCheck;
    while (toCheck = stack.pop()) {
        const [currPoint, path, pointsOnPath] = toCheck;
        const currVal = getPoint(currPoint, directionalKeypad);

        if (currVal === undefined) {
            continue;
        }

        const manhattan = calculateManhattan(point, currPoint);

        // Then this can't be the shortest path
        if (path.length > manhattan) {
            continue;
        }

        toSet[currVal].push([...path, 'A']);

        DIRECTIONS.forEach(direction => {
            const newPoint = applyDirectionToPoint(currPoint, direction);
            const newPointStr = pointToPointString(newPoint);

            if (
                // We've stepped off the edge
                getPoint(newPoint, directionalKeypad) === undefined
                // We've already been here
                || pointsOnPath.includes(newPointStr)
            ) {
                return;
            }

            stack.push([newPoint, [...path, directionToDirectional[direction]], [...pointsOnPath, newPointStr]])
        })
    }

    directionalMap.set(val, toSet);
});

const values = input.split('\n');

function isNumeric(char: string): char is Numeric {
    return ['A', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(char);
}

const NUMERIC_KEYPAD: Record<Numeric, Point> = {
    "0": {x: 1, y: 3},
    "1": {x: 0, y: 2},
    "2": {x: 1, y: 2},
    "3": {x: 2, y: 2},
    "4": {x: 0, y: 1},
    "5": {x: 1, y: 1},
    "6": {x: 2, y: 1},
    "7": {x: 0, y: 0},
    "8": {x: 1, y: 0},
    "9": {x: 2, y: 0},
    A: {x: 2, y: 3}
}

const DIRECTIONAL_KEYPAD: Record<Directional, Point> = {
    "^": {x: 1, y: 0},
    A: {x: 2, y: 0},
    "<": {x: 0, y: 1},
    v: {x: 1, y: 1},
    ">": {x: 2, y: 1},
}

function getCommand<T extends Directional | Numeric>(input: Record<T, Point>, start: T, end: T): Directional[][] {
    const queue: { point: Point, path: Directional[] }[] = [{point: input[start], path: []}];
    const distances: Map<PointString, number> = new Map;
    if (start == end) {
        return [['A']]
    }
    const endPoint = input[end];

    const paths: Directional[][] = [];
    let current;
    while (current = queue.shift()) {
        const {point, path} = current;

        if (point.x == endPoint.x && point.y == endPoint.y) {
            paths.push([...path, 'A']);
        }

        const distance = distances.get(pointToPointString(point));
        if ((distance ?? Infinity) < path.length) {
            continue;
        }

        DIRECTIONS.forEach(val => {
            const newPoint = applyDirectionToPoint(point, val);

            const button = Object
                .values(input)
                // Typescript is being silly, so we need to "as" here
                .find((val) => pointMatches(newPoint, val as Point)) as (Point | undefined);

            if (button !== undefined) {
                const newPath = [...path, directionToDirectional[val]];
                const newDistance = distances.get(pointToPointString(newPoint));

                if ((newDistance ?? Infinity) >= newPath.length) {
                    queue.push({point: newPoint, path: newPath});
                    distances.set(pointToPointString(newPoint), newPath.length);
                }
            }
        })
    }

    return paths.sort((a, b) => a.length - b.length);
}

function getKeyPresses<T extends Directional | Numeric>(input: Record<T, Point>, code: T[], robot: number, cache: Map<string, number> = new Map): number {
    return getValueFromCache(
        `${code.join('')},${robot}`,
        () => {
            // Typescript thinks that A isn't a value for T
            // This is likely because you _could_ call this with T set to '0'
            // We know we won't do, so it's fine
            let current: T = 'A' as T;
            let length = 0;
            for (const char of code) {
                const moves = getCommand(input, current, char);

                if (robot == 0) {
                    length += moves[0].length;
                } else {
                    length += Math.min(...moves.map(move => getKeyPresses(DIRECTIONAL_KEYPAD, move, robot - 1, cache)))
                }

                current = char;
            }

            return length;
        },
        cache
    )
}

function getValueForRobotCount(input: string, robotCount: number): number {
    const code: Numeric[] = [];
    for (const char of input) {
        if (!isNumeric(char)) {
            throw new Error('Should not happen');
        }

        code.push(char);
    }

    const value = getKeyPresses(NUMERIC_KEYPAD, code, robotCount);

    return value * Number.parseInt(input.slice(0, -1), 10);
}

const keypads = input.split('\n');

console.log(`Part 1: ${mappedAccumulator(keypads, (val) => getValueForRobotCount(val, 2))}`);
console.log(`Part 1: ${mappedAccumulator(keypads, (val) => getValueForRobotCount(val, 25))}`);
