import getInput from "./util/getInput";
import {getPoint, Point, PointMap, PointString, pointToPointString, setPoint} from "../util/points";

const testInputs = {
    example: `.....
.S-7.
.|.|.
.L-J.
.....`,
    exampleWithExtras: `-L|F7
7S-7|
L|7||
-L-J|
L|-JF`,
    secondExample: `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`,
    secondExampleWithExtras: `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`,
    fourTileArea: `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`,
    eightTileArea: `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`,
    tenTileArea: `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`
}

const input = getInput(testInputs, 10);

type Pipe = '|' | '-' | 'L' | 'J' | '7' | 'F' | 'S';


const points: PointMap<{ pipe: Pipe, distance: number }> = new Map();

function getAdjacentPointsForPipe(pipeDef: {
    pipe: Pipe;
    distance: number
}, position: Point, checkIfValid: boolean = true): Point[] {
    const adjacentPoints: Point[] = [];

    switch (pipeDef.pipe) {
        case "|":
            adjacentPoints.push(
                {x: position.x, y: position.y + 1},
                {x: position.x, y: position.y - 1},
            );
            break;
        case "-":
            adjacentPoints.push(
                {x: position.x - 1, y: position.y},
                {x: position.x + 1, y: position.y},
            );
            break;
        case "7":
            adjacentPoints.push(
                {x: position.x - 1, y: position.y},
                {x: position.x, y: position.y + 1},
            );
            break;
        case "F":
            adjacentPoints.push(
                {x: position.x + 1, y: position.y},
                {x: position.x, y: position.y + 1},
            );
            break;
        case "J":
            adjacentPoints.push(
                {x: position.x - 1, y: position.y},
                {x: position.x, y: position.y - 1},
            );
            break
        case "L":
            adjacentPoints.push(
                {x: position.x + 1, y: position.y},
                {x: position.x, y: position.y - 1},
            );
            break;
        case "S":
            adjacentPoints.push(
                {x: position.x, y: position.y + 1},
                {x: position.x, y: position.y - 1},
                {x: position.x - 1, y: position.y},
                {x: position.x + 1, y: position.y},
            );
            break;
    }
    const positionStr = pointToPointString(position);

    return checkIfValid
        ? adjacentPoints.filter(point => {
            const pointDef = getPoint(point, points);

            if (!pointDef) {
                return false;
            }

            return getAdjacentPointsForPipe(pointDef, point, false)
                .map(pointToPointString)
                .includes(positionStr);
        })
        : adjacentPoints;
}

function isPipe(pipe: unknown): pipe is Pipe {
    return typeof pipe == 'string'
        ? ['|', '-', 'L', 'J', '7', 'F', 'S'].includes(pipe)
        : false;
}

const toDo: Point[] = [];

input.split('\n').map((row, y) => {
    row.split('').forEach((char, x) => {
        if (isPipe(char)) {
            setPoint(
                {x, y},
                {
                    pipe: char,
                    distance: char == 'S' ? 0 : Infinity
                },
                points
            );

            if (char == 'S') {
                toDo.push({x, y});
            }
        }
    })
});

let removed = true;

while (removed) {
    removed = false;
    points.forEach((val, y) => {
        val.forEach((pipe, x) => {
            const length = getAdjacentPointsForPipe(pipe, {x,y}).length;
            if (length < 2) {
                val.delete(x);
                removed = true;
            }
        });
    })
}

const sPosPipeDef = getPoint(toDo[0], points);

if (!sPosPipeDef) {
    throw new Error('No start point');
}

const allPipes: Pipe[] = ['|', '-', 'L', 'J', '7', 'F'];
allPipes.filter((val) => {
    if (getAdjacentPointsForPipe({...sPosPipeDef, pipe: val}, toDo[0]).length == 2) {
        sPosPipeDef.pipe = val;
    }
})

while (toDo.length) {
    const pointToTest = toDo.pop();

    if (!pointToTest) {
        continue;
    }

    const pipeDef = getPoint(pointToTest, points);

    if (pipeDef === undefined) {
        throw new Error(`Testing ${pointToTest}, which didn't exist?`)
    }

    const toTest = getAdjacentPointsForPipe(pipeDef, pointToTest);

    toTest.forEach(point => {
        const pipe = getPoint(point, points);

        if (pipe === undefined) {
            return;
        }

        if (pipe.distance > (pipeDef.distance + 1)) {
            pipe.distance = pipeDef.distance + 1;
            toDo.push(point);
        }
    })
}

points.forEach((val,) => {
    val.forEach(({distance}, x) => {
        if (distance == Infinity) {
            val.delete(x);
        }
    });
})

// Then we just have to find the highest value for the distance
const part1 = Array.from(points.values()).reduce(
    (prev, curr) => {
        return Math.max(prev, ...Array.from(curr.values()).map(val => val.distance === Infinity ? 0 : val.distance))
    },
    0
)

console.log(`Part 1: ${part1}`);

const maxY = input.split('\n').length;
const maxX = input.split('\n')[0].length;

let part2: PointString[] = [];

const outside: Set<PointString> = new Set();

for(let x=0; x<maxX; x++) {
    let isOutside = true;
    for (let y =0; y<maxY; y++) {
        const point: Point = {x,y};
        const pointStr = pointToPointString(point);
        const pipeDef = getPoint(point, points);

        if (!pipeDef) {
            if (isOutside) {
                outside.add(pointStr)
            }
            continue;
        }

        if (pipeDef.pipe === "-") {
            isOutside = !isOutside;
        } else if (pipeDef.pipe === "7") {
            while (true) {
                y++;
                const pipeDef = getPoint({x,y}, points);
                if (!pipeDef) {
                    break;
                }

                if (pipeDef.pipe == 'L') {
                    isOutside = !isOutside;
                } else if (pipeDef.pipe == '|') {
                    continue;
                }
                break;
            }
        } else if( pipeDef.pipe === "F") {
            while (true) {
                y++;
                const pipeDef = getPoint({x,y}, points);
                if (!pipeDef) {
                    break;
                }

                if (pipeDef.pipe == 'J') {
                    isOutside = !isOutside;
                } else if (pipeDef.pipe == '|') {
                    continue;
                }
                break;
            }
        }
    }
}
const debug = false;
for (let y = 0; y < maxY; y++) {
    let row: string[] = [];
    for (let x = 0; x < maxX; x++) {
        if (getPoint({x, y}, points)) {
            row.push(getPoint({x,y}, points)?.pipe ?? '.');
        } else if (outside.has(pointToPointString({x,y}))) {
            row.push('O');
        } else {
            part2.push(pointToPointString({x,y}));
        }
    }

    if (debug) {
        console.log(row.join(''));
    }
}

console.log(`Part 2: ${part2.length}`);
