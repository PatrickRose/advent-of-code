import getInput from "./util/getInput";
import {forEachPoint, getAdjacentPoints, getPoint, Point, PointMap, pointToPointString, setPoint} from "../util/points";

const testInputs = {
    example: `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`
}

const input = getInput(testInputs, 18);

const bytes: Point[] = input.split('\n').map((val) => {
    const [x, y] = val.split(',').map(val => Number.parseInt(val, 10));

    return {x, y}
});

const [maxX, maxY] = input == testInputs.example ? [6, 6] : [70, 70];

function inPosition({x, y}: Point): boolean {
    return x >= 0 && y >= 0 && x <= maxX && y <= maxY;
}

function getShortestPath(bytesToFall: number): number|null {
    const corrupted: PointMap<true> = new Map;
    const distances: PointMap<number> = new Map;

    for (let i = 0; i < bytesToFall; i++) {
        setPoint(bytes[i], true, corrupted)
    }

    setPoint({x: 0, y: 0}, 0, distances);
    let i = 0;

    while (true) {
        const pointsToCheck: Point[] = [];
        forEachPoint(distances, (point, val) => {
            if (val == i) {
                pointsToCheck.push(point);
            }
        });

        if (pointsToCheck.length == 0) {
            return null;
        }

        for (const point of pointsToCheck) {
            if (point.x == maxX && point.y == maxY) {
                return i;
            }

            for (const adjacent of getAdjacentPoints(point.x, point.y, false)) {
                if (getPoint(adjacent, corrupted) || !inPosition(adjacent)) {
                    continue;
                }

                const distanceValue = getPoint(adjacent, distances);

                if (distanceValue === undefined || distanceValue > (i + 1)) {
                    setPoint(adjacent, i + 1, distances);
                }
            }
        }
        i++;
    }
}

console.log(`Part 1: ${getShortestPath(input == testInputs.example ? 12 : 1024)}`);

for(let i=(testInputs.example ? 12 : 1024)+1; i<bytes.length; i++) {
    const result = getShortestPath(i);
    if (result == null) {
        console.log(`Part 2: ${pointToPointString(bytes[i - 1])}`);
        break;
    }
}
