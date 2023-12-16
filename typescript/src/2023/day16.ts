import getInput from "./util/getInput";
import {
    applyDirectionToPoint,
    Direction, getPoint,
    Point,
    PointMap,
    PointString,
    pointToPointString,
    setPoint
} from "../util/points";
import {getMaxXAndYFromStr} from "../util/getMaxXAndYFromStr";

const testInputs = {
    example: `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`
}

const input = getInput(testInputs, 16);

type Mirrors = '/' | '\\' | '|' | '-';
const map: PointMap<Mirrors> = new Map();

input.split('\n').forEach((row, y) => {
    row.split('').forEach((char, x) => {
        if (char == '/' || char == '\\' || char == '|' || char == '-') {
            setPoint({x, y}, char, map);
        }
    })
})

const {maxX, maxY} = getMaxXAndYFromStr(input);

function getNextPositions(point: Point, direction: Direction, mirror: Mirrors | undefined): {
    point: Point,
    direction: Direction
}[] {
    if (mirror === undefined) {
        // Then keep going in that direction
        return [{
            point: applyDirectionToPoint(point, direction),
            direction
        }]
    }

    let directionMap: Record<Direction, Direction>;
    let newDirection: Direction;

    switch (mirror) {
        case '/':
            directionMap = {
                east: "north",
                north: "east",
                south: "west",
                west: "south"
            }
            newDirection = directionMap[direction];

            return [{
                point: applyDirectionToPoint(point, newDirection),
                direction: newDirection
            }]
        case '\\':
            directionMap = {
                east: "south",
                north: "west",
                south: "east",
                west: "north"
            }
            newDirection = directionMap[direction];

            return [{
                point: applyDirectionToPoint(point, newDirection),
                direction: newDirection
            }];
        case "-":
            if (direction == 'east' || direction == 'west') {
                return [{
                    point: applyDirectionToPoint(point, direction),
                    direction
                }]
            }

            return [
                {
                    point: applyDirectionToPoint(point, 'east'),
                    direction: 'east'
                },
                {
                    point: applyDirectionToPoint(point, 'west'),
                    direction: 'west'
                }
            ];
        case '|':
            if (direction == 'north' || direction == 'south') {
                return [{
                    point: applyDirectionToPoint(point, direction),
                    direction
                }]
            }

            return [
                {
                    point: applyDirectionToPoint(point, 'south'),
                    direction: 'south'
                },
                {
                    point: applyDirectionToPoint(point, 'north'),
                    direction: 'north'
                }
            ];
    }
}

function countEnergisedTiles(initialPoint: { point: Point, direction: Direction }): number {
    const pointsVisited: Set<PointString> = new Set();
    const pointsVisitedDirections: Set<`${PointString},${Direction}`> = new Set();

    const points: { point: Point, direction: Direction }[] = [initialPoint];

    while (true) {
        const nextPoint = points.pop();

        if (!nextPoint) {
            break;
        }

        const {x, y} = nextPoint.point;
        if (x < 0 || x >= maxX || y < 0 || y >= maxY) {
            continue;
        }

        if (pointsVisitedDirections.has(`${pointToPointString(nextPoint.point)},${nextPoint.direction}`)) {
            // We're in a loop - ignore it
            continue;
        }

        pointsVisited.add(pointToPointString(nextPoint.point));
        pointsVisitedDirections.add(`${pointToPointString(nextPoint.point)},${nextPoint.direction}`);

        const nextPositions = getNextPositions(nextPoint.point, nextPoint.direction, getPoint(nextPoint.point, map));
        //  console.log(nextPositions);

        points.push(...nextPositions);
    }

    return pointsVisited.size;
}

const part1 = countEnergisedTiles(
    {
        point: {
            x: 0,
            y: 0
        },
        direction: "east"
    }
);
console.log(`Part 1: ${part1}`);

const part2: number[] = [];

for (let x = 0; x < maxX; x++) {
    part2.push(countEnergisedTiles(
            {
                point: {
                    x,
                    y: 0
                },
                direction: "south"
            }
        )
    );
    part2.push(countEnergisedTiles(
            {
                point: {
                    x,
                    y: maxY-1
                },
                direction: "north"
            }
        )
    );
}

for (let y = 0; y < maxY; y++) {
    part2.push(countEnergisedTiles(
            {
                point: {
                    x: 0,
                    y
                },
                direction: "east"
            }
        )
    );
    part2.push(countEnergisedTiles(
            {
                point: {
                    x: maxX - 1,
                    y
                },
                direction: "west"
            }
        )
    );
}

console.log(`Part 2: ${Math.max(...part2)}`);
