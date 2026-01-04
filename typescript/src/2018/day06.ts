import getInput from "./util/getInput";
import {calculateManhattan, Point, PointMap} from "../util/points";
import {mappedAccumulator} from "../util/accumulator";

const testInputs = {
    example: `1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`
}

const input = getInput(testInputs, 6);

const points: Point[] = input.split('\n').map((val) => {
    const [x, y] = val.split(',').map(val => Number.parseInt(val, 10));

    return {x, y}
});

const minX = 0;
const maxX = Math.max(...points.map(({x}) => x));

const minY = 0;
const maxY = Math.max(...points.map(({y}) => y));

const distancePoints: PointMap<number> = new Map;
const requiredDistance = input == testInputs.example ? 32 : 10000
const pointsWithinDistance: Point[] = [];

const areas = points.map(() => 0);
const infiniteArea: Set<number> = new Set;

for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
        const thisPoint = {x, y};
        const distances = points.map((val, index) => {
            return {
                distance: calculateManhattan(val, thisPoint),
                index
            }
        });

        if (mappedAccumulator(distances, ({distance}) => distance) < requiredDistance) {
            pointsWithinDistance.push(thisPoint);
        }

        const max = Math.min(...distances.map(({distance}) => distance));
        // Find which entry is that
        const values = distances.filter(({distance}) => distance == max);

        if (values.length == 1) {
            const index = values[0].index;

            if (infiniteArea.has(index)) {
                continue;
            }

            if (x == minX || x == maxX || y == minY || y == maxY) {
                infiniteArea.add(index);
                areas[index] = -1;
            } else {
                areas[index]++;
            }
        }
    }
}

console.log(`Part 1: ${(Math.max(...areas))}`);
console.log(`Part 2: ${pointsWithinDistance.length}`);
