import getInput from "./util/getInput";
import {
    applyDirectionToPoint,
    Direction, forEachPoint, getPoint,
    Point,
    PointMap,
    PointString,
    pointToPointString,
    setPoint
} from "../util/points";
import {getMaxXAndYFromStr} from "../util/getMaxXAndYFromStr";

const testInputs = {
    example: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`
}

const input = getInput(testInputs, 6);

const positions: PointMap<true> = new Map;
const guardPosition: Point = {x: -1, y: -1};
let direction: Direction = 'north';

input.split('\n').forEach((row, y) => {
    row.split('').forEach((char, x) => {
        if (char == '#') {
            setPoint({x, y}, true, positions);
        } else if (char == '^') {
            guardPosition.x = x;
            guardPosition.y = y;
        }
    })
});
const startingGuard: Point = {...guardPosition};

const {maxX, maxY} = getMaxXAndYFromStr(input);

const visitedPoints: Set<PointString> = new Set;

function inPosition({x, y}: Point) {
    return !(x < 0
        || y < 0
        || x >= maxX
        || y >= maxY);

}

const rotation: Record<Direction, Direction> = {
    east: 'south', north: 'east', south: 'west', west: 'north'
}

while (inPosition(guardPosition)) {
    visitedPoints.add(pointToPointString(guardPosition));

    const newPosition = applyDirectionToPoint(guardPosition, direction);
    if (getPoint(newPosition, positions)) {
        direction = rotation[direction];
    } else {
        guardPosition.x = newPosition.x;
        guardPosition.y = newPosition.y;
    }
}

console.log(`Part 1: ${visitedPoints.size}`);

let loopOptions = 0;

for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
        if (getPoint({x, y}, positions)) {
            continue;
        }

        const visitedPoints: Set<`${PointString},${Direction}`> = new Set;
        let direction: Direction = 'north';
        const guardPosition = {...startingGuard};

        if (guardPosition.x == guardPosition.y) {
            continue;
        }

        const innerPositions: PointMap<true> = new Map;

        forEachPoint(positions, (point, val) => setPoint(point, true, innerPositions));
        setPoint({x, y}, true, innerPositions);

        while (inPosition(guardPosition)) {
            const setValue: `${PointString},${Direction}` = `${pointToPointString(guardPosition)},${direction}`;
            if (visitedPoints.has(setValue)) {
                loopOptions++;
                break;
            }

            visitedPoints.add(setValue);

            const newPosition = applyDirectionToPoint(guardPosition, direction);
            if (getPoint(newPosition, innerPositions)) {
                direction = rotation[direction];
            } else {
                guardPosition.x = newPosition.x;
                guardPosition.y = newPosition.y;
            }
        }
    }
}

console.log(`Part 2: ${loopOptions}`);
