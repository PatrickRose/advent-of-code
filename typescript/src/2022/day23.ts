import getInput from "./util/getInput";
import {Point, PointString, pointToPointString} from "../util/points";

const sampleInput = [
    `.....
..##.
..#..
.....
..##.
.....`,
    `....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`
];

const input: string = getInput(23);

const elves: Elf[] = [];

function hasElfInPosition(point: Point, elfPosition: undefined|Set<PointString> = undefined): boolean {
    if (elfPosition === undefined) {
        return elves.some(elf => elf.isInPoint(point))
    } else {
        return elfPosition.has(pointToPointString(point));
    }
}

class Elf {
    #position: Point;

    constructor(position: Point) {
        this.#position = position;
    }

    adjacents(): Point[] {
        const {x, y} = this.#position;

        return [
            {x: x - 1, y: y - 1},
            {x: x, y: y - 1},
            {x: x + 1, y: y - 1},
            {x: x - 1, y: y},
            {x: x + 1, y: y},
            {x: x - 1, y: y + 1},
            {x: x, y: y + 1},
            {x: x+1, y: y + 1},
        ]
    }

    isInPoint(point: Point) {
        return point.x == this.#position.x
            && point.y == this.#position.y
    }

    getMoveAmount(moveNo: number, elfPositions: Set<PointString>): Point {
        if (this.adjacents().every(point => !hasElfInPosition(point, elfPositions))) {
            return {...this.#position};
        }

        const {x, y} = this.#position;

        const moves: { toCheck: Point[], move: Point }[] = [
            {
                toCheck: [
                    {x: x - 1, y: y - 1},
                    {x: x, y: y - 1},
                    {x: x + 1, y: y - 1},
                ],
                move: {
                    x,
                    y: y - 1
                }
            },
            {
                toCheck: [
                    {x: x - 1, y: y + 1},
                    {x: x, y: y + 1},
                    {x: x + 1, y: y + 1},
                ],
                move: {
                    x,
                    y: y + 1
                }
            },
            {
                toCheck: [
                    {x: x - 1, y: y + 1},
                    {x: x - 1, y: y},
                    {x: x - 1, y: y - 1},
                ],
                move: {
                    x: x - 1,
                    y: y
                }
            },
            {
                toCheck: [

                    {x: x + 1, y: y + 1},
                    {x: x + 1, y: y},
                    {x: x + 1, y: y - 1},
                ],
                move: {
                    x: x + 1,
                    y: y
                }
            },
        ]

        for (let i = 0; i < 4; i++) {
            const index = (moveNo + i) % 4;

            const {toCheck, move} = moves[index];

            if (toCheck.every(point => !hasElfInPosition(point, elfPositions))) {
                return move;
            }
        }

        return {...this.#position}
    }

    moveTo(x: number, y: number) {
        this.#position.x = x;
        this.#position.y = y;
    }

    getPosition(): Point {
        return {...this.#position};
    }
}

input.split('\n').forEach(
    (row, y) => {
        row.split('').forEach(
            (char, x) => {
                if (char != '#') {
                    return;
                }

                elves.push(
                    new Elf({x, y})
                );
            }
        )
    }
)

function runMove(moveNumber: number): boolean {
    const proposedMoves: Map<PointString, Elf[]> = new Map();

    const elfPositions: Set<PointString> = new Set()

    elves.forEach(elf => elfPositions.add(pointToPointString(elf.getPosition())));

    elves.forEach(
        elf => {
            const move = elf.getMoveAmount(moveNumber, elfPositions);

            if (!move) {
                return;
            }

            const pointString = pointToPointString(move);

            if (!proposedMoves.has(pointString)) {
                proposedMoves.set(pointString, []);
            }

            const moves = proposedMoves.get(pointString) as Elf[];
            moves.push(elf);
        }
    );

    let nobodyMoved = true;

    proposedMoves.forEach((val, key) => {
        if (val.length > 1) {
            return;
        }

        const [x, y] = key.split(',').map(val => Number.parseInt(val, 10));

        const elf = val[0];

        if (!elf.isInPoint({x,y})) {
            elf.moveTo(x, y);
            nobodyMoved = false;
        }
    });

    return nobodyMoved;
}

for (let i = 0; i < 10; i++) {
    runMove(i);
}

const xs: number[] = [];
const ys: number[] = [];

elves.forEach(val => {
    const {x,y} = val.getPosition();

    xs.push(x);
    ys.push(y);
});

let count = 0;

for (let y = Math.min(...ys); y <= Math.max(...ys); y++) {
    for (let x = Math.min(...xs); x <= Math.max(...xs); x++) {
        if (!hasElfInPosition({x,y})) {
            count++;
        }
    }
}

console.log(`Part 1: ${count}`);

let i = 10;

while(!runMove(i)) {
    i++;
}

console.log(`Part 2: ${i + 1}`);
