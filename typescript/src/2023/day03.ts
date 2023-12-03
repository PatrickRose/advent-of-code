import getInput from "./util/getInput";
import {getAdjacentPoints, getPoint, Point, PointMap, PointString, pointToPointString, setPoint} from "../util/points";
import parseInt from "../util/parseInt";

const testInputs = {
    'example': `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`
}

const input = getInput(testInputs, 3);

const points: PointMap<string> = new Map;

input.split('\n').forEach((row, y) => {
    row.split('').forEach((char, x) => {
        setPoint({x, y}, char, points);
    })
})

const partNumbers: number[] = [];

input.split('\n').forEach((row, y) => {
    let currentPartNumber: { partNo: string, adjacentCheck: Point[] } | null = null;

    function handlePartNumber(currentPartNumber: { partNo: string, adjacentCheck: Point[] }) {
        const partNum = parseInt(currentPartNumber.partNo);
        const adjacentToSymbol = currentPartNumber.adjacentCheck.some(point => {
            return getAdjacentPoints(point.x, point.y, true)
                .filter(point => !currentPartNumber?.adjacentCheck.includes(point))
                .some(
                    point => {
                        const val = getPoint(point, points);

                        if (val === undefined) {
                            return false;
                        }

                        if (val === '.') {
                            return false;
                        }

                        return isNaN(parseInt(val));
                    }
                )
        })

        if (adjacentToSymbol) {
            partNumbers.push(partNum);
        }
    }

    row.split('').forEach((char, x) => {
        if (char.match(/\d/)) {
            if (currentPartNumber === null) {
                currentPartNumber = {
                    partNo: char,
                    adjacentCheck: [{x, y}]
                }
            } else {
                currentPartNumber.partNo += char;
                currentPartNumber.adjacentCheck.push({x, y});
            }
        } else if (currentPartNumber !== null) {
            handlePartNumber(currentPartNumber);

            currentPartNumber = null;
        }
    })

    if (currentPartNumber !== null) {
        handlePartNumber(currentPartNumber);
    }
});

console.log(`Part 1: ${partNumbers.reduce((previousValue, currentValue) => previousValue + currentValue, 0)}`);

const gearRatios: number[] = [];

input.split('\n').forEach((row, y) => {

    row.split('').forEach((char, x) => {
        if (char != '*') {
            return;
        }

        const adjacentNumbers: number[] = [];

        const checkedPoints: Set<PointString> = new Set();

        getAdjacentPoints(x, y, true).forEach(
            point => {
                if (checkedPoints.has(pointToPointString(point))) {
                    return;
                }

                if (!getPoint(point, points)?.match(/\d/)) {
                    return;
                }

                // Otherwise, we keep going left until we hit a non-number
                const startPoint = {...point};

                while(getPoint(startPoint, points)?.match(/\d/)) {
                    startPoint.x--;
                }

                startPoint.x++;
                let num = ''

                while(getPoint(startPoint, points)?.match(/\d/)) {
                    num+=getPoint(startPoint, points) ?? '';
                    checkedPoints.add(pointToPointString(startPoint));
                    startPoint.x++;
                }

                adjacentNumbers.push(parseInt(num));
            }
        );

        if (adjacentNumbers.length == 2) {
            gearRatios.push(adjacentNumbers[0] * adjacentNumbers[1]);
        }
    })
});

console.log(`Part 2: ${gearRatios.reduce((previousValue, currentValue) => previousValue + currentValue, 0)}`);
