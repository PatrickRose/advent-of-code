import getInput from "./util/getInput";
import {
    forEachPointInStr,
    getAdjacentPoints,
    getPoint,
    Point,
    PointMap,
    PointString,
    pointToPointString,
    setPoint
} from "../util/points";
import {accumulator, mappedAccumulator} from "../util/accumulator";

const testInputs = {
    firstExample: `0123
1234
8765
9876`,
    trailhead2: `...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9`,
    trailhead4: `..90..9
...1.98
...2..7
6543456
765.987
876....
987....`,
    trailhead12: `10..9..
2...8..
3...7..
4567654
...8..3
...9..2
.....01`,
    largeExample: `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`
}

const input = getInput(testInputs, 10);

const points: PointMap<number> = new Map<number, Map<number, number>>();

const trailheads: Point[] = [];

forEachPointInStr(input, (point, char) => {
    const num = Number.parseInt(char, 10);
    if (!isNaN(num)) {
        setPoint(point, num, points);
        if (num === 0) {
            trailheads.push(point);
        }
    }
});

function scoreRoute(position: Point): Set<PointString> {
    const currentNum = getPoint(position, points);

    if (currentNum === undefined) {
        return new Set;
    }

    if (currentNum == 9) {
        return new Set([pointToPointString(position)]);
    }
    // Otherwise, get the adjacents, filter them to find the right value
    // Then score that route
    const {x, y} = position;

    return getAdjacentPoints(x, y, false)
        .filter(val => getPoint(val, points) == currentNum + 1)
        .map(scoreRoute)
        .reduce(
            (prev, curr) => prev.union(curr),
            new Set()
        )
}

const scores = trailheads.map(scoreRoute)

console.log(`Part 1: ${mappedAccumulator(scores, val => val.size)}`);

function rateRoute(position: Point): number {
    const currentNum = getPoint(position, points);

    if (currentNum === undefined) {
        return 0;
    }

    if (currentNum == 9) {
        return 1;
    }
    // Otherwise, get the adjacents, filter them to find the right value
    // Then score that route
    const {x, y} = position;

    return accumulator(
        getAdjacentPoints(x, y, false)
        .filter(val => getPoint(val, points) == currentNum + 1)
        .map(rateRoute)
    )
}

const ratings = trailheads.map(rateRoute)

console.log(`Part 2: ${accumulator(ratings)}`);
