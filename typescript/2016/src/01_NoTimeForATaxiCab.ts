import getInput from "./util/getInput";

const input = getInput(1);

enum Direction {
    NORTH,
    SOUTH,
    EAST,
    WEST
};
const allDirections: Direction[] = [
    Direction.NORTH,
    Direction.EAST,
    Direction.SOUTH,
    Direction.WEST
];

function changeDirection(currentDirection: Direction, leftRight: boolean): Direction {
    const currPos = allDirections.indexOf(currentDirection);

    const nextPos = currPos + (leftRight ? 1 : -1);

    return allDirections[nextPos < 0 ? allDirections.length - 1 : nextPos % allDirections.length];
}


let direction: Direction = Direction.NORTH;

type Position = { x: number, y: number }
const position: Position = { x: 0, y: 0 };

const visitedPositions: Position[] = [{ x: 0, y: 0 }];
let part2: string = '';

input.split(',').forEach(value => {
    const leftRight: boolean = value.trim()[0] == 'L';
    const move = Number.parseInt(value.trim().slice(1));

    if (isNaN(move)) {
        throw Error(`${value} didn't work - converting ${value.slice(1)} did not give a number`);
    }

    direction = changeDirection(direction, leftRight);

    for (let amount = 0; amount < move; amount++) {
        switch (direction) {
            case Direction.NORTH:
                position.y++;
                break;
            case Direction.EAST:
                position.x--
                break;
            case Direction.SOUTH:
                position.y--;
                break;
            case Direction.WEST:
                position.x++;
                break;
            default:
                throw Error(`Should never hit... direction is ${direction}`);
        }

        if (!part2 && visitedPositions.find(value => value.x == position.x && value.y == position.y)) {
            part2 = `Part 2: ${Math.abs(position.x) + Math.abs(position.y)}`;
        }

        visitedPositions.push({ x: position.x, y: position.y });
    }
});

console.log(`Part 1: ${Math.abs(position.x) + Math.abs(position.y)}`);
console.log(part2);
