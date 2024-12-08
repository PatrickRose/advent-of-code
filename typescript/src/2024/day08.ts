import getInput from "./util/getInput";
import {getMaxXAndYFromStr} from "../util/getMaxXAndYFromStr";
import {
    addPoint,
    forEachPoint,
    forEachPointInStr,
    getAdjacentPoints, getPoint,
    Point,
    PointMap, pointOutOfRange,
    PointString, pointToPointString,
    setPoint, subtractPoint
} from "../util/points";

const testInputs = {
    example: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
    simpleExample: `..........
..........
..........
....a.....
..........
.....a....
..........
..........
..........
..........`,
    threeAExample: `..........
..........
..........
....a.....
........a.
.....a....
..........
..........
..........
..........`,
    tExample: `T.........
...T......
.T........
..........
..........
..........
..........
..........
..........
..........`
}

const input = getInput(testInputs, 8);

const {maxX, maxY} = getMaxXAndYFromStr(input);
const antenna: PointMap<string> = new Map;
forEachPointInStr(input, (point, char) => {
    if (char != '.') {
        setPoint(point, char, antenna);
    }
});

function findAntinodes(part: 1 | 2): Set<PointString> {
    const antinodes: Set<PointString> = new Set<PointString>();

    forEachPoint(antenna, (pointA, val) => {
        forEachPoint(antenna, (pointB, second) => {
            if (pointB.x == pointA.x && pointB.y == pointA.y) {
                return;
            }

            if (val != second) {
                return;
            }

            // Otherwise, calculate the difference between these two points
            const diff = subtractPoint(pointA, pointB);

            if (part == 1) {

                const pointsToAdd = [
                    addPoint(pointA, diff),
                    subtractPoint(pointB, diff)
                ]

                for (const point of pointsToAdd) {
                    if (!pointOutOfRange(point, maxX, maxY)) {
                        antinodes.add(pointToPointString(point));
                    }
                }
            } else {
                let toAdd = pointA;
                while (!pointOutOfRange(toAdd, maxX, maxY)) {
                    antinodes.add(pointToPointString(toAdd));
                    toAdd = addPoint(toAdd, diff);
                }
            }
        });
    });

    return antinodes;
}

function debugMap(antinodes: Set<PointString>) {
    for (let y = 0; y < maxY; y++) {
        const row = [];
        for (let x = 0; x < maxX; x++) {
            const val = getPoint({x, y}, antenna);
            if (val !== undefined) {
                row.push(val)
            } else if (antinodes.has(pointToPointString({x, y}))) {
                row.push('#');
            } else {
                row.push('.');
            }
        }
        console.log(row.join(''));
    }
}

console.log(`Part 1: ${findAntinodes(1).size}`)
console.log(`Part 2: ${findAntinodes(2).size}`)
