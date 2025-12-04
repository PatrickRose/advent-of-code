import getInput from "./util/getInput";
import {forEachPoint, getAdjacentPoints, getPoint, Point, PointMap, setPoint, unsetPoint} from "../util/points";

const testInputs = {
    example: `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`
}

const input = getInput(testInputs, 4);

const map: PointMap<boolean> = new Map<number, Map<number, true>>();

input.split('\n').forEach((line, y) => {
    line.split('').forEach((char, x) => {
        if (char == '@') {
            setPoint({x,y}, true, map);
        }
    })
});

let allowedPoints = 0;

forEachPoint(map, ({x,y}, val) => {
    const numAllowed = getAdjacentPoints(x,y).filter(point => getPoint(point, map)).length;

    if (numAllowed < 4) {
        allowedPoints++;
    }
})

console.log(`Part 1: ${allowedPoints}`);

let removed = 0;
const points: Point[] = [];

while (true) {
    forEachPoint(map, ({x,y}, val) => {
        const numAllowed = getAdjacentPoints(x,y).filter(point => getPoint(point, map)).length;

        if (numAllowed < 4) {
            points.push({x,y});
        }
    })

    if (points.length == 0) {
        break;
    }

    removed += points.length;
    let point: Point|undefined;
    while (point = points.pop()) {
        unsetPoint(point, map)
    }
}

console.log(`Part 2: ${removed}`);
