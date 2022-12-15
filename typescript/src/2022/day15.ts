import getInput from "./util/getInput";
import {calculateManhattan, Point} from "../util/points";

const sampleInput = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

const input = getInput(15);

const sensors: {position: Point, manhattan: number, beacon: Point}[] = [];
const minMaxs = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity
}

input.split('\n').forEach(
    (row, index) => {
        const regexMatch = row.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/);

        if (!regexMatch) {
            throw new Error(`${row} did not match`)
        }

        const [_, sensorX, sensorY, beaconX, beaconY] = regexMatch.map(val => Number.parseInt(val, 10));


        const manhattan = calculateManhattan({x: sensorX, y: sensorY}, {x: beaconX, y: beaconY});

        sensors.push({
            position: {x: sensorX, y: sensorY},
            beacon: {x: beaconX, y: beaconY},
            manhattan,
        });

        const minX = Math.min(sensorX - manhattan, beaconX - manhattan);
        const maxX = Math.max(sensorX + manhattan, beaconX + manhattan);
        const minY = Math.min(sensorY - manhattan, beaconY - manhattan);
        const maxY = Math.max(sensorY + manhattan, beaconY + manhattan);

        if (minMaxs.minX > minX) {
            minMaxs.minX = minX
        }
        if (minMaxs.maxX < maxX) {
            minMaxs.maxX = maxX
        }
        if (minMaxs.minY > minY) {
            minMaxs.minY = minY
        }
        if (minMaxs.maxY < maxY) {
            minMaxs.maxY = maxY
        }
    }
)

sensors.sort((a, b) => a.position.x - b.position.x);

const targetRow = input === sampleInput ? 10 : 2000000;

let partOne = 0;

for (let x = minMaxs.minX; x <= minMaxs.maxX; x++) {
    const isABeacon = sensors.some(({beacon}) => {
        // If x and y matches the beacon, then there is definitely a beacon on this space
        return beacon.x == x && beacon.y == targetRow;
    });

    if (isABeacon) {
        continue;
    }

    const atLeastOneSaysEmpty = sensors.some(({position, manhattan}) => {
        const calculatedManhattan = calculateManhattan(position, {x, y: targetRow});
        return calculatedManhattan <= manhattan;
    })

    if (atLeastOneSaysEmpty) {
        partOne++;
    }
}

console.log(`Part 1: ${partOne}`)

const maxSearchVal = input === sampleInput ? 20 : 4000000;

let found = false;

sensors.forEach(({position, manhattan}, index) => {
    if (found) {
        return;
    }

    for (let x = Math.max(0, position.x - (manhattan + 1)); x<= Math.min(maxSearchVal, (position.x+manhattan+1)); x++) {
        const positionsToCheck: Point[] = [];
        const diff = Math.abs((manhattan + 1) - calculateManhattan({x, y: position.y}, position));

        if (position.y + diff <= maxSearchVal) {
            positionsToCheck.push({x, y: position.y + diff})
        }

        if (position.y - diff >= 0) {
            positionsToCheck.push({x, y: position.y - diff});
        }

        found = positionsToCheck.some(toCheck => {
            const every = sensors.every(({position: subPosition, manhattan}, subIndex) => {
                if (subIndex == index) {
                    return true;
                }

                if (toCheck.x == 14 && toCheck.y == 11 && calculateManhattan(toCheck, subPosition) <= manhattan) {
                    console.log({toCheck, position, calculated: calculateManhattan(toCheck, subPosition), manhattan})
                }

                return calculateManhattan(toCheck, subPosition) > manhattan
            });

            if (every) {
                console.log(`Part 2: ${BigInt(toCheck.y) + BigInt(toCheck.x) * 4000000n}`);
            }

            return every;
        });

        if (found) {
            break;
        }
    }
});
