import getInput from "./util/getInput";
import {forEachPointInStr, getPoint, Point, PointMap, PointString, pointToPointString, setPoint} from "../util/points";
import {getValueFromCache} from "../util/cache";

const testInputs = {
    example: `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`
}

const input = getInput(testInputs, 7);

const splitterLocations: PointMap<boolean> = new Map();
let startingPosition: Point|null = null;

forEachPointInStr(input, (point, char) => {
    if (char == 'S') {
        startingPosition = point;
    }

    setPoint(point, char == '^', splitterLocations);
});

if (startingPosition == null) {
    throw new Error('Did not find starting position');
}

const visited: PointMap<true> = new Map();

function countSplitterHits(startingPosition: Point): number {
    const currentPosition = {...startingPosition};

    while (true) {
        if (getPoint(currentPosition, visited)) {
            return 0;
        }

        setPoint(currentPosition, true, visited);

        const hit = getPoint(currentPosition, splitterLocations);

        if (hit === undefined) {
            return 0;
        }

        if (hit) {
            return 1
                + countSplitterHits({x: currentPosition.x-1, y: currentPosition.y})
                + countSplitterHits({x: currentPosition.x+1, y: currentPosition.y});
        } else {
            currentPosition.y++;
        }
    }
}

const part1 = countSplitterHits(startingPosition);
console.log(`Part 1: ${part1}`);

const timelineCache: Map<PointString, number> = new Map();

function countTimeLines(startingPosition: Point): number {
    return getValueFromCache(
        pointToPointString(startingPosition),
        () => {
            const currentPosition = {...startingPosition};

            while (true) {
                const hit = getPoint(currentPosition, splitterLocations);

                if (hit === undefined) {
                    return 1;
                }

                if (hit) {
                    return countTimeLines({x: currentPosition.x-1, y: currentPosition.y})
                        + countTimeLines({x: currentPosition.x+1, y: currentPosition.y});
                } else {
                    currentPosition.y++;
                }
            }
        },
        timelineCache
    )
}

const part2 = countTimeLines(startingPosition);
console.log(`Part 2: ${part2}`);
