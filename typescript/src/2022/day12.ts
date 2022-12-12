import getInput from './util/getInput';
import {getAdjacentPoints, Point, PointString} from "../util/points";

const sampleInput = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

const input = getInput(12);

const positions: Map<PointString, number> = new Map();

let target: Point = {
    x: -1,
    y: -1
}
let start: Point = {
    x: -1,
    y: -1
}

const zeroStarts: Point[] = [];

input.split('\n').forEach(
    (row, y) => {
        row.split('').forEach((char, x) => {
            let height: number;
            const pointString: PointString = `${x},${y}`;
            if (char == 'S') {
                start.x = x;
                start.y = y;
                height = 0;
            } else if (char == 'E') {
                target.x = x;
                target.y = y;
                height = 25;
            } else {
                height = char.charCodeAt(0) - 97;
            }

            positions.set(pointString, height);

            if (height == 0) {
                zeroStarts.push({x, y});
            }
        });
    }
);

function runAStar(start: Point, target: Point): number {
    const openSet: Set<PointString> = new Set;
    const cameFrom: Map<PointString, PointString> = new Map();
    const gScore: Map<PointString, number> = new Map();
    const fScore: Map<PointString, number> = new Map();

    function heuristic(start: Point, target: Point): number {
        return Math.abs(start.x - target.x) + Math.abs(start.y - target.y)
    }

    openSet.add(`${start.x},${start.y}`);
    gScore.set(`${start.x},${start.y}`, 0);
    fScore.set(`${start.x},${start.y}`, heuristic(start, target));

    function reconstruct(cameFrom: Map<PointString, PointString>, current: PointString): PointString[] {
        const totalPath = [current];

        while (cameFrom.has(current)) {
            current = cameFrom.get(current) as PointString;
            totalPath.push(current);
        }

        return totalPath.reverse();
    }

    while (openSet.size > 0) {
        const allValues = Array.from(openSet.values());
        const current = allValues[0];

        if (`${target.x},${target.y}` == current) {
            return reconstruct(cameFrom, current).length - 1;
        }

        openSet.delete(current);

        const [x, y] = current.split(',').map(val => Number.parseInt(val, 10));
        const currentHeight = positions.get(current);

        if (currentHeight === undefined) {
            throw new Error(`${current} does not have a height?`);
        }

        const currentGScore = gScore.get(current);

        if (currentGScore === undefined) {
            throw new Error(`${current} does not have a score?`);
        }

        getAdjacentPoints(x, y, false).forEach(
            ({x, y}) => {
                // Check this is actually adjacent
                const pointString: PointString = `${x},${y}`;
                const newHeight = positions.get(pointString);

                if (newHeight === undefined) {
                    // Gone off the grid, ignore
                    return;
                }

                if (newHeight - currentHeight > 1) {
                    // Climbs too high, ignore
                    return;
                }

                const tentativeScore = currentGScore + 1;

                const scoreOfThis = gScore.get(pointString) ?? Infinity;

                if (tentativeScore < scoreOfThis) {
                    cameFrom.set(pointString, current);
                    gScore.set(pointString, tentativeScore);
                    fScore.set(pointString, tentativeScore + heuristic({x, y}, target))
                    openSet.add(pointString);
                }
            }
        )
    }

    throw new Error(`Failed to solve ${start.x},${start.y}`);
}

console.log(`Part 1: ${runAStar(start, target)}`);
const paths = zeroStarts.map((start) => {
    try {
        return runAStar(start, target)
    } catch (e) {
        // Not all paths lead to the summit!
        return Infinity;
    }
});
paths.sort((a, b) => a - b);

console.log(`Part 2: ${paths[0]}`);
