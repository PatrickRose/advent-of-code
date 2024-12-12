import getInput from "./util/getInput";
import {
    addPoint,
    forEachPoint,
    forEachPointInStr, getAdjacentPoints, getPoint,
    Point,
    PointMap,
    PointString,
    pointToPointString,
    setPoint
} from "../util/points";
import {mappedAccumulator} from "../util/accumulator";

const testInputs = {
    abcd: `AAAA
BBCD
BBCC
EEEC`,
    ox: `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`,
    example: `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
    ex: `EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`,
    ab: `AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`
}

const input = getInput(testInputs, 12);

const pointMap: PointMap<string> = new Map;

forEachPointInStr(input, (point, char) => setPoint(point, char, pointMap));

type Region = {
    value: string,
    points: Point[]
}

const regions: Region[] = [];

const used: Set<PointString> = new Set;

forEachPoint(pointMap, (point, val) => {
    if (used.has(pointToPointString(point))) {
        return;
    }

    const region: Region = {
        value: val,
        points: []
    }

    const stack = [point];
    let current: Point | undefined;

    while (current = stack.pop()) {
        const innerVal = getPoint(current, pointMap);
        if (innerVal != val) {
            continue;
        }

        if (used.has(pointToPointString(current))) {
            continue;
        }

        used.add(pointToPointString(current));

        region.points.push(current);
        stack.push(...getAdjacentPoints(current.x, current.y, false));
    }

    regions.push(region);
});

const part1 = mappedAccumulator(
    regions,
    ({points, value}) => {
        const size = points.length;

        const perimeter = mappedAccumulator(points, ({x, y}) => {
            return getAdjacentPoints(x, y, false).map(val => getPoint(val, pointMap)).filter(val => val != value).length
        })

        return size * perimeter;
    }
)

console.log(`Part 1: ${part1}`);

const adjacents: [Point, Point][] = [
    [{x:0, y:1}, {x:0, y:0.25}],
    [{x:0, y:-1}, {x:0, y:-0.25}],
    [{x:1, y:0}, {x:0.25, y:0}],
    [{x:-1, y:0}, {x:-0.25, y:0}],
]

const part2 = mappedAccumulator(
    regions,
    ({points, value}) => {
        const size = points.length;

        const outsideSections: Point[] = points.reduce(
            (prev, curr) => {
                return [
                    ...prev,
                    ...adjacents
                        .filter(([val]) => getPoint(addPoint(val,curr), pointMap) != value)
                        .map(([_, val]) => addPoint(val, curr))
                ]
            },
            [] as Point[]
        );

        const sides: Point[][] = [];

        for (const point of outsideSections) {
            const pointStr = pointToPointString(point);
            const adjacentTo = sides.find((val) => {
                return val.some(({x,y}) => getAdjacentPoints(x,y,false).map(pointToPointString).includes(pointStr))
            })

            if (adjacentTo) {
                adjacentTo.push(point);
            } else {
                sides.push([point]);
            }
        }

        let changed = true;
        while(changed) {
            changed = false;

            for(let i =0;i<sides.length; i++) {
                for(let j =i+1;j<sides.length; j++) {
                    const firstSide = sides[i];
                    const secondSide = sides[j];

                    // Does there exist a value in first side that is adjacent to something in second side
                    const adjacencyExists = firstSide.some(val => {
                        const pointStr = pointToPointString(val);
                        return secondSide.some(({x,y}) => {
                            return getAdjacentPoints(x,y,false).map(pointToPointString).includes(pointStr);
                        })
                    });

                    if (adjacencyExists) {
                        changed = true;
                        let toAdd;
                        while (toAdd = secondSide.pop()) {
                            firstSide.push(toAdd);
                        }
                    }
                }
            }
        }

        return size * sides.filter(val => val.length != 0).length;
    }
)

console.log(`Part 2: ${part2}`);
