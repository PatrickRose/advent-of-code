import getInput from "./util/getInput";
import {Direction, forEachPoint, getPoint, Point, PointMap, setPoint} from "../util/points";

const testInputs = {
    example: `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`
}

const input = getInput(testInputs, 14);

const maxY = input.split('\n').length;
const maxX = input.split('\n')[0].length;

type RockType = 'cube' | 'rounded';

const rockPositions: PointMap<RockType> = new Map();

input.split('\n').forEach((row, y) => {
    row.split('').forEach((char, x) => {
        if (char == '.') {
            return;
        }

        setPoint({y, x}, char == '#' ? 'cube' : 'rounded', rockPositions);
    })
});

const cache: Map<`${string}${Direction}`, PointMap<RockType>> = new Map();

function moveRocks(map: PointMap<RockType>, direction: Direction): PointMap<RockType> {
    const cacheKey: `${string}${Direction}` = `${mapToStr(map)}${direction}`
    const cacheVal = cache.get(cacheKey);

    if (cacheVal) {
        return cacheVal;
    }

    const newMap: PointMap<RockType> = new Map();
    const sortOrders: Record<typeof direction, (a: Point, b: Point) => number> = {
        east(a: Point, b: Point): number {
            return b.x - a.x;
        },
        north(a: Point, b: Point): number {
            return a.y - b.y;
        },
        south(a: Point, b: Point): number {
            return b.y - a.y;
        },
        west(a: Point, b: Point): number {
            return a.x - b.x;
        }
    }

    forEachPoint(
        map,
        (point, rock) => {
            const newPoint = {...point};

            if (rock == 'rounded') {
                switch (direction) {
                    case "north":
                        while (newPoint.y >= 0 && getPoint(newPoint, newMap) === undefined) {
                            newPoint.y--;
                        }

                        newPoint.y++
                        break;
                    case "south":
                        while (newPoint.y < maxY && getPoint(newPoint, newMap) === undefined) {
                            newPoint.y++;
                        }

                        newPoint.y--;

                        break;
                    case "east":
                        while (newPoint.x < maxX && getPoint(newPoint, newMap) === undefined) {
                            newPoint.x++;
                        }

                        newPoint.x--;
                        break;
                    case "west":
                        while (newPoint.x >= 0 && getPoint(newPoint, newMap) === undefined) {
                            newPoint.x--;
                        }

                        newPoint.x++;
                        break;
                }
            }

            setPoint(newPoint, rock, newMap)
        },
        sortOrders[direction]
    )

    cache.set(cacheKey, newMap);

    return newMap
}


function mapToStr(map: PointMap<RockType>) {
    const rows: string[] = [];
    for (let y = 0; y < maxY; y++) {
        const row: string[] = [];
        for (let x = 0; x < maxX; x++) {
            const char = getPoint({x, y}, map);

            if (char === undefined) {
                row.push('.')
            } else {
                row.push(char == 'rounded' ? 'O' : '#');
            }
        }

        rows.push(row.join(''));
    }

    return rows.join('\n');
}

function countLoad(rockPositions: PointMap<RockType>): number {
    let toReturn = 0;

    forEachPoint(rockPositions, (point, val) => {
        if (val == 'cube') {
            return;
        }

        toReturn += maxX - point.y;
    })

    return toReturn;
}

console.log(`Part 1: ${countLoad(moveRocks(rockPositions, 'north'))}`);

let part2 = rockPositions;

const states: string[] = [];
const mapCache: (typeof rockPositions)[] = [];

while (!states.includes(mapToStr(part2))) {
    states.push(mapToStr(part2));
    mapCache.push(part2);

    part2 = moveRocks(moveRocks(moveRocks(moveRocks(part2, 'north'), 'west'), 'south'), 'east')
}

// Where did the cycle start?
const cycleStart = states.indexOf(mapToStr(part2));
const lengthOfCycle = states.length - cycleStart;

// So this means that we need to find X such that
// {cycleStart} + {lengthOfCycle} * {x} < 1000000000
// {cycleStart} + {lengthOfCycle} * {x+1} > 1000000000

const numberOfCycles = Math.floor((1000000000 - cycleStart) / lengthOfCycle);

// Then the difference between the above number tells us which item in the cycle we should use
const cycleItem = 1000000000 - (cycleStart + (lengthOfCycle * (numberOfCycles)));

console.log(`Part 2: ${countLoad(mapCache[cycleStart + cycleItem])}`)
