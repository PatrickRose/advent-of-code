import getInput from "./util/getInput";
import {
    applyDirectionToPoint,
    Direction, DIRECTIONS, DIRECTIONS_REVERSE,
    forEachPointInStr,
    getPoint,
    Point,
    PointMap,
    PointString, pointToPointString,
    setPoint
} from "../util/points";
import parseInt from "../util/parseInt";
import {getMaxXAndYFromStr} from "../util/getMaxXAndYFromStr";

const testInputs = {
    example: `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`,
    ultra: `111111111111
999999999991
999999999991
999999999991
999999999991`
}

const input = getInput(testInputs, 17, 'ultra');

const {maxX, maxY} = getMaxXAndYFromStr(input);

const heatMap: PointMap<number> = new Map();
forEachPointInStr(input, (point, char) => setPoint(point, parseInt(char), heatMap))

type Path = {
    position: Point,
    direction: Direction,
    distance: number
}

type GenerateCandidatesFunc = (currentPath: Path) => Path[];

function findMinimumHeatLoss(generateCandidates: GenerateCandidatesFunc, pathHasFinished: (path: Path) => boolean): number {
    const heatLossMap: Map<number, Path[]> = new Map();

    heatLossMap.set(
        0,
        [
            {position: {x: 0, y: 0}, direction: "east", distance: 0},
            {position: {x: 0, y: 0}, direction: "south", distance: 0}
        ]
    );

    let currentHeatLoss = 0;

    type CacheKey = `${PointString},${Direction},${number}`;

    const cache: Set<CacheKey> = new Set();

    function addToHeatLossMap(heatLoss: number, newCandidate: Path) {
        let candidates = heatLossMap.get(heatLoss);

        if (!candidates) {
            candidates = [];
            heatLossMap.set(heatLoss, candidates);
        }

        candidates.push(newCandidate)
    }

    while (true) {
        const toCheck = heatLossMap.get(currentHeatLoss) ?? [];

        for(let path of toCheck) {
            if (pathHasFinished(path)) {
                return currentHeatLoss;
            }

            const possiblePaths = generateCandidates(path);

            possiblePaths.forEach(newCandidate => {
                const valueOfNewPoint = getPoint(newCandidate.position, heatMap);

                if (valueOfNewPoint === undefined) {
                    return;
                }

                const cacheKey: CacheKey = `${pointToPointString(newCandidate.position)},${newCandidate.direction},${newCandidate.distance}`;

                if (cache.has(cacheKey)) {
                    return;
                }

                cache.add(cacheKey);

                addToHeatLossMap(currentHeatLoss + valueOfNewPoint, newCandidate);
            })
        }
        currentHeatLoss++;
    }
}

const part1Func: GenerateCandidatesFunc = (path) => {
    const toReturn: Path[] = [];
    DIRECTIONS.forEach(direction => {
        if (direction == DIRECTIONS_REVERSE[path.direction]) {
            return;
        }

        const newCandidate: Path = {
            direction: direction,
            distance: direction == path.direction ? path.distance + 1 : 1,
            position: applyDirectionToPoint(path.position, direction)
        };

        if (newCandidate.distance <= 3) {
            toReturn.push(newCandidate)
        }
    })

    return toReturn;
};
const part1FinishedFunc: (path:Path) => boolean = (path) => path.position.x == maxX - 1 && path.position.y == maxY - 1;

const part2Func: GenerateCandidatesFunc = (path) => {
    const toReturn: Path[] = [];
    DIRECTIONS.forEach(direction => {
        if (direction == DIRECTIONS_REVERSE[path.direction]) {
            return;
        }

        if (direction == path.direction || path.distance >=4) {
            const newCandidate: Path = {
                direction: direction,
                distance: direction == path.direction ? path.distance + 1 : 1,
                position: applyDirectionToPoint(path.position, direction)
            };

            if (newCandidate.distance <= 10) {
                toReturn.push(newCandidate)
            }
        }
    })

    return toReturn;
}
const part2FinishedFunc: (path:Path) => boolean = (path) => part1FinishedFunc(path) && path.distance >=4;

console.log(`Part 1: ${findMinimumHeatLoss(part1Func, part1FinishedFunc)}`);
console.log(`Part 2: ${findMinimumHeatLoss(part2Func, part2FinishedFunc)}`);
