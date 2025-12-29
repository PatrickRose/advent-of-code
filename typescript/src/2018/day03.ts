import getInput from "./util/getInput";
import {
    addPoint,
    forEachPoint,
    getPoint,
    Point,
    PointMap,
    PointString,
    pointStringToPoint,
    setPoint
} from "../util/points";

const testInputs = {
    example: `#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2`
}

const input = getInput(testInputs, 3);

type Instruction = {
    id: number,
    start: Point,
    width: number,
    height: number
}

const instructions: Instruction[] = input.split('\n').map(row => {
    const matches = row.match(/^#(\d+) @ (\d+,\d+): (\d+)x(\d+)/);

    if (matches === null) {
        throw new Error(`${row} is invalid`);
    }

    return {
        id: Number.parseInt(matches[1]),
        start: pointStringToPoint(matches[2] as PointString),
        width: Number.parseInt(matches[3]),
        height: Number.parseInt(matches[4]),
    }
})

const points: PointMap<number> = new Map<number, Map<number, number>>();

function applyCallbackForPoint(start: Point, width: number, height: number, callback: (point: Point) => void) {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const pointToSet = addPoint({x, y}, start);

            callback(pointToSet);
        }
    }
}

instructions.forEach(({start, width, height}) => {
    applyCallbackForPoint(start, width, height, (pointToSet) => setPoint(pointToSet, 1 + (getPoint(pointToSet, points) ?? 0), points))
});

let dupeCount = 0;
forEachPoint(points, (_, val) => {
    if (val > 1) {
        dupeCount++
    }
})

console.log(`Part 1: ${dupeCount}`);

const noDupes = instructions.filter(({start, width, height}) => {
    try {
        applyCallbackForPoint(
            start,
            width,
            height,
            (point) => {
                if ((getPoint(point, points) ?? 0) > 1) {
                    throw new Error('Duplicate');
                }
            }
        )
    } catch (e) {
        return false;
    }

    return true;
});

console.log(`Part 1: ${noDupes.map(({id}) => id)}`);
