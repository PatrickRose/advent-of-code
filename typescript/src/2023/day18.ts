import getInput from "./util/getInput";
import {applyDirectionToPoint, Direction, Point} from "../util/points";
import parseInt from "../util/parseInt";
import {accumulator} from "../util/accumulator";

const testInputs = {
    example: `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`
}

const input = getInput(testInputs, 18);

function getInformationFromRow(row: string) {
    const match = row.match(/(.) (\d+) \((.+)\)/);

    if (!match) {
        throw new Error(`${row} is not valid`);
    }

    const directionMap: Record<string, Direction> = {
        'R': "east",
        'L': 'west',
        'U': 'north',
        'D': 'south'
    }

    const direction = directionMap[match[1]];
    const amount = parseInt(match[2]);
    const colour = match[3];
    return {direction, amount, colour};
}

function runDig(part2: boolean): number {
    const points: Point[] = [];

    let currentPosition: Point = {x: 0, y: 0};

    input.split('\n').forEach((row) => {
        points.push(currentPosition);
        let directionToMove: Direction, amountToMove: number;
        const {direction, amount, colour} = getInformationFromRow(row);

        if (part2) {
            amountToMove = parseInt(colour.slice(1, -1), 16);
            directionToMove = (['west', 'south', 'east','north'] as Direction[])[parseInt(colour.split('').pop() ?? '1')];
        } else {
            directionToMove = direction;
            amountToMove = amount;
        }

        for (let i = 0; i < amountToMove; i++) {
            currentPosition = applyDirectionToPoint(currentPosition, directionToMove);
        }
    });

    const valueOfMove = (_: Point, currentIndex: number, points: Point[]): number => {
        const first = points[currentIndex];
        const second = points[(currentIndex + 1) % points.length];
        return first.x * second.y - first.y * second.x
            // Add the perimeter, since that's got area 1 as well
            + Math.abs(first.x - second.x) + Math.abs(first.y - second.y);
    }

    return (
        // Shoelace theorem
        Math.abs(accumulator(points.map(valueOfMove))) / 2
        ) +
        // We're off by one, I don't really understand why
        1;
}

console.log(`Part 1: ${runDig(false)}`)
console.log(`Part 2: ${runDig(true)}`)
