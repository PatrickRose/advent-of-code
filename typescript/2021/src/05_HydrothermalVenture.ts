import getInput from "./util/getInput";

const exampleInput = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`;

const input = getInput(5);

type Point = { x: number, y: number }
type Instruction = {
    start: Point,
    end: Point
};

const instructions: Instruction[] = input.split("\n").map(row => {
    const [start, end] = row.split(' -> ');

    const [startX, startY] = start.split(',')
    const [endX, endY] = end.split(',')

    return {
        start: {
            x: Number.parseInt(startX, 10),
            y: Number.parseInt(startY, 10),
        },
        end: {
            x: Number.parseInt(endX, 10),
            y: Number.parseInt(endY, 10),
        },
    }
});

function getPointsFromInstruction(instruction: Instruction): Point[] {
    const points = [];

    if (instruction.start.x == instruction.end.x) {
        let y = instruction.start.y;
        while (y != instruction.end.y) {
            points.push({x: instruction.start.x, y});
            if (y > instruction.end.y) {
                y--
            } else {
                y++;
            }
        }
        points.push({x: instruction.start.x, y});
    } else if (instruction.start.y == instruction.end.y) {
        let x = instruction.start.x;
        while (x != instruction.end.x) {
            points.push({y: instruction.start.y, x});
            if (x > instruction.end.x) {
                x--
            } else {
                x++;
            }
        }
        points.push({y: instruction.start.y, x});
    } else {
        // We have a diagonal
        let x = instruction.start.x;
        let y = instruction.start.y;
        while (x != instruction.end.x) {
            points.push({y, x});

            if (x > instruction.end.x) {
                x--
            } else {
                x++;
            }
            if (y > instruction.end.y) {
                y--
            } else {
                y++;
            }
        }
        points.push({y, x});
    }

    return points;
}

function countTouchedPoints(filter: boolean): { [key: string]: number } {
    const counts: { [key: string]: number } = {};

    instructions.filter(point => !filter || point.start.x == point.end.x || point.start.y == point.end.y).forEach(
        instruction => {
            const points = getPointsFromInstruction(instruction);

            points.forEach(({x, y}) => {
                const key = `${x},${y}`;

                if (!counts[key]) {
                    counts[key] = 1
                } else {
                    counts[key]++
                }
            })
        }
    )

    return counts;
}

const part1Counts = countTouchedPoints(true);
let part1Count = 0;
for (let key in part1Counts) {
    if (part1Counts[key] > 1) {
        part1Count++
    }
}

console.log(`Part 1: ${part1Count}`);

const part2Counts = countTouchedPoints(false);
let part2Count = 0;
for (let key in part2Counts) {
    if (part2Counts[key] > 1) {
        part2Count++
    }
}

console.log(`Part 2: ${part2Count}`);
