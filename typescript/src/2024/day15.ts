import getInput from "./util/getInput";
import {
    applyDirectionToPoint,
    Direction,
    forEachPoint,
    forEachPointInStr,
    getPoint,
    Point,
    PointMap,
    PointString,
    pointToPointString,
    setPoint,
    unsetPoint
} from "../util/points";
import {getMaxXAndYFromStr} from "../util/getMaxXAndYFromStr";

const testInputs = {
    smallExample: `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`,
    example: `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`,
    wideExample: `#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^`
}

const input = getInput(testInputs, 15);

const [mapParse, movesParse] = input.split('\n\n');

const map: PointMap<'#' | 'O' | '@'> = new Map;

forEachPointInStr(mapParse, (point, char) => {
    if (char == '#' || char == 'O' || char == '@') {
        setPoint(point, char, map);
    }
})

const moves: Direction[] = movesParse.replaceAll('\n', '').split('').map((val) => {
    switch (val) {
        case '^':
            return "north";
        case 'v':
            return "south";
        case '<':
            return "west";
        case '>':
            return "east";
    }

    throw new Error('Unknown move');
});

function findRobotInMap(map: PointMap<"#" | "O" | "@"> | PointMap<"#" | "[" | ']' | "@">): Point {
    for (const [y, inner] of map.entries()) {
        for (const [x, val] of inner.entries()) {
            if (val == '@') {
                return {x, y}
            }
        }
    }

    throw new Error('Where is the robot!?')
}

function debugMap<T>(map: PointMap<T>, mapParse: string, move?: Direction) {
    if (move) {
        switch (move) {
            case "east":
                console.log('Moved >');
                break;
            case "north":
                console.log('Moved ^');
                break;
            case "south":
                console.log('Moved v');
                break;
            case "west":
                console.log('Moved <');
                break;
        }
    }

    const {maxX, maxY} = getMaxXAndYFromStr(mapParse);
    const rows = [];
    for (let y = 0; y < maxY; y++) {
        const row = [];
        for (let x = 0; x < maxX; x++) {
            row.push(getPoint({x, y}, map) ?? '.')
        }
        rows.push(row.join(''));
    }

    console.log(rows.join('\n'));
    console.log();
}

function part1(start: PointMap<'#' | 'O' | '@'>): number {
    let map = start;
    let toReturn = 0;
    // debugMap(map, mapParse);

    for (const move of moves) {
        const robotPos = findRobotInMap(map);
        const newMap: typeof map = new Map;
        forEachPoint(map, (point, val) => setPoint(point, val, newMap));

        const newRobotPos = applyDirectionToPoint(robotPos, move);

        const stack: [Point, Point, '#' | 'O' | '@'][] = [[newRobotPos, robotPos, '@']];
        unsetPoint(robotPos, newMap)
        let result: null | boolean = null;

        while (result === null) {
            const [point] = stack[stack.length - 1];
            const willReplace = getPoint(point, newMap);

            if (willReplace === undefined) {
                result = true;
            } else if (willReplace == '#') {
                result = false;
            } else {
                unsetPoint(point, newMap);
                stack.push([applyDirectionToPoint(point, move), point, willReplace])
            }
        }

        for (const part of stack) {
            setPoint(result ? part[0] : part[1], part[2], newMap)
        }

        map = newMap;
        // debugMap(map, mapParse, move);
    }

    forEachPoint(map, ({x, y}, val) => {
        if (val == 'O') {
            toReturn += (100 * y) + x;
        }
    });

    return toReturn;
}

console.log(`Part 1: ${part1(map)}`);

const part2Map: PointMap<'[' | ']' | '#' | '@'> = new Map;

const part2Parse = mapParse
    .split('')
    .map(val => {
        if (val == 'O') {
            return '[]';
        } else if (val == '#') {
            return '##';
        } else if (val == '@') {
            return '@.'
        } else if (val == '\n') {
            return '\n'
        } else {
            return '..';
        }
    })
    .join('');

forEachPointInStr(part2Parse, (point, char) => {
    if (char == '#' || char == '[' || char == ']' || char == '@') {
        setPoint(point, char, part2Map);
    }
});

function part2(start: PointMap<'#' | '[' | ']' | '@'>): number {
    let map = start;
    let toReturn = 0;
    // debugMap(map, part2Parse);

    for (const move of moves) {
        const robotPos = findRobotInMap(map);
        const newMap: typeof map = new Map;
        forEachPoint(map, (point, val) => setPoint(point, val, newMap));

        const stack: Set<`${PointString},${'#' | '[' | ']' | '@'}`> = new Set;
        stack.add(`${pointToPointString(robotPos)},@`);
        let result: null | boolean = null;

        while (result === null) {
            let originalSize = stack.size;
            for (const val of stack) {
                const [x, y, _] = val.split(',').map(val => Number.parseInt(val, 10));
                const nextPoint = applyDirectionToPoint({x, y}, move);
                const nextVal = getPoint(nextPoint, newMap);

                if (nextVal == '#') {
                    result = false;
                    break;
                } else if (nextVal == ']') {
                    stack.add(`${pointToPointString(nextPoint)},${nextVal}`);
                    stack.add(`${pointToPointString(applyDirectionToPoint(nextPoint, 'west'))},[`);
                } else if (nextVal == '[') {
                    stack.add(`${pointToPointString(nextPoint)},${nextVal}`);
                    stack.add(`${pointToPointString(applyDirectionToPoint(nextPoint, 'east'))},]`);
                }
            }

            if (result ===null && stack.size == originalSize) {
                result = true;
            }
        }

        if (result) {
            for (const val of stack) {
                const [x, y, _] = val.split(',').map(val => Number.parseInt(val, 10));
                unsetPoint({x, y}, newMap)
            }

            for (const val of stack) {
                const [x, y, toAdd] = val.split(',');
                const newPoint = {x: Number.parseInt(x, 10), y: Number.parseInt(y, 10)};
                setPoint(applyDirectionToPoint(newPoint, move), toAdd, newMap)
            }
        }

        map = newMap;
        // debugMap(map, part2Parse, move);
    }

    forEachPoint(map, ({x, y}, val) => {
        if (val == '[') {
            toReturn += (100 * y) + x;
        }
    });

    return toReturn;
}

// debugMap(part2Map, part2Parse);
console.log(`Part 2: ${part2(part2Map)}`);
