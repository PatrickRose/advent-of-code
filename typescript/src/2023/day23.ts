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

const testInputs = {
    example: `#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#`
}

const input = getInput(testInputs, 23);

type PositionType = '.' | '>' | '^' | '<' | 'v';

function isPositionType(val: unknown): val is PositionType {
    if (typeof val != 'string') {
        return false;
    }

    return ['.', '>', '^', '<', 'v'].includes(val);
}

const grid: PointMap<PositionType> = new Map();

let startPoint: null | Point = null;
let endPoint: null | Point = null;

forEachPointInStr(input, (point, val) => {
    if (isPositionType(val)) {
        if (point.y == 0) {
            startPoint = point;
        } else if (point.y == input.split('\n').length - 1) {
            endPoint = point;
        }

        setPoint(point, val, grid)
    }
});

if (!startPoint || !endPoint) {
    throw Error('Invalid input?');
}

function adjacentPointsForNode(char: PositionType, {x, y}: Point, slippy: boolean): Point[] {
    if (!slippy) {
        return getAdjacentPoints(x, y, false);
    }

    switch (char) {
        case ".":
            return getAdjacentPoints(x, y, false);
        case ">":
            return [{x: x + 1, y}];
        case "^":
            return [{x, y: y - 1}];
        case "<":
            return [{x: x - 1, y}];
        case "v":
            return [{x, y: y + 1}];
    }
}

function getMaxPath(currentPoint: Point, endPoint: Point, graph: Graph, existingLength: number = 0, path: Set<PointString> = new Set()): number {
    if (pointToPointString(currentPoint) == pointToPointString(endPoint)) {
        return existingLength;
    }

    const nodes = graph.get(pointToPointString(currentPoint));

    if (!nodes) {
        console.error(currentPoint);
        throw new Error('Invalid point');
    }

    const newSet = new Set(Array.from(path));
    newSet.add(pointToPointString(currentPoint));

    return Math.max(...nodes.map(({distance, next}): number => {
        // Already visited that point
        if (newSet.has(pointToPointString(next))) {
            return 0;
        }

        return getMaxPath(next, endPoint, graph, existingLength + distance, newSet)
    }));
}

type GraphNodes = { distance: number, next: Point }[];
type Graph = Map<PointString, GraphNodes>;

function findLongestPath(startPoint: Point, endPoint: Point, slippy: boolean): number {
    // First, convert the grid into a graph
    const points: Point[] = [startPoint];
    const graph: Graph = new Map();

    let point: Point | undefined;

    while (point = points.shift()) {
        if (graph.has(pointToPointString(point))) {
            // We've already done all of the paths for this point
            continue;
        }

        const char = getPoint(point, grid);

        if (!char) {
            console.error(point);
            throw new Error('Invalid point');
        }

        const paths: GraphNodes = adjacentPointsForNode(char, point, slippy)
            .filter(point => getPoint(point, grid) !== undefined)
            .map(inner => {
                if (!point) {
                    throw new Error('Avoiding type error');
                }

                let distance = 1;
                let next = inner;
                let existingPath: Set<PointString> = new Set([pointToPointString(point)]);
                let added: boolean;

                do {
                    added = false;

                    const char = getPoint(next, grid);
                    if (!char) {
                        console.error(point);
                        throw new Error('Invalid point');
                    }

                    const adjacents = adjacentPointsForNode(char, next, slippy).filter(val => {
                        return !existingPath.has(pointToPointString(val))
                            && getPoint(val, grid)
                    });

                    if (adjacents.length == 1) {
                        existingPath.add(pointToPointString(next));
                        distance++
                        next = adjacents[0];
                        added = true;
                    }
                } while (added)

                points.push(next);

                return {distance, next}
            });

        graph.set(pointToPointString(point), paths)
    }

    return getMaxPath(startPoint, endPoint, graph);
}

console.log(`Part 1: ${findLongestPath(startPoint, endPoint, true)}`);
console.log(`Part 1: ${findLongestPath(startPoint, endPoint, false)}`);

