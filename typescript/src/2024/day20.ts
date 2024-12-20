import getInput from "./util/getInput";
import {
    addPoint,
    forEachPoint,
    forEachPointInStr,
    getAdjacentPoints,
    getPoint,
    Point,
    PointMap,
    PointString, pointStringToPoint, pointToPointString,
    setPoint
} from "../util/points";
import {mappedAccumulator} from "../util/accumulator";

const testInputs = {
    example: `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`
}

const input = getInput(testInputs, 20);

let start: Point = {x: -1, y: -1};
let end: Point = {x: -1, y: -1};
const map: PointMap<boolean> = new Map;

forEachPointInStr(input, (point, val) => {
    if (val == '#') {
        setPoint(point, false, map);
        return;
    }

    setPoint(point, true, map);

    if (val == 'S') {
        start = point;
    } else if (val == 'E') {
        end = point;
    }
});

function getShortestPath(map: PointMap<boolean>): PointMap<number> {
    let i = 0;

    const distances: PointMap<number> = new Map;
    setPoint(start, 0, distances);

    while (true) {
        const toProcess: Point[] = [];

        forEachPoint(distances, (point, val) => {
            if (val == i) {
                toProcess.push(point);
            }
        });

        if (toProcess.length == 0) {
            return distances;
        }

        for (const point of toProcess) {
            for (const adjacent of getAdjacentPoints(point.x, point.y, false)) {
                if (!getPoint(adjacent, map)) {
                    continue;
                }

                const newVal = i + 1;
                if ((getPoint(adjacent, distances) ?? Infinity) > newVal) {
                    setPoint(adjacent, newVal, distances)
                }
            }
        }

        i++;
    }
}

const distances = getShortestPath(map);

function calculateCheatSaves(cheatLength: number): Record<number, number> {
    const toReturn: ReturnType<typeof calculateCheatSaves> = {};

    forEachPoint(distances, (point, val) => {
        for (let y = -cheatLength; y <= cheatLength; y++) {
            for (let x = -cheatLength; x <= cheatLength; x++) {
                const manhattan = Math.abs(x) + Math.abs(y);

                if (manhattan > cheatLength) {
                    // We're basically avoiding doing {cheatLength,cheatLength}
                    continue;
                }

                const newPoint: Point = {x,y};

                const targetVal = getPoint(addPoint(newPoint, point), distances);

                if (targetVal === undefined) {
                    continue;
                }


                const cheatVal = val + manhattan;

                if (cheatVal < targetVal) {
                    toReturn[targetVal - cheatVal] = (toReturn[targetVal - cheatVal] ?? 0) + 1;
                }
            }
        }
    })

    return toReturn;
}

function calculateSavesThatSave100OrMore(cheatLength: number): number {
    const saves = calculateCheatSaves(cheatLength);

    return mappedAccumulator(Object.entries(saves), ([key, value]) => {
        return Number.parseInt(key, 10) >= 100 ? value : 0;
    })
}

console.log(`Part 1: ${calculateSavesThatSave100OrMore(2)}`);
console.log(`Part 2: ${calculateSavesThatSave100OrMore(20)}`);
