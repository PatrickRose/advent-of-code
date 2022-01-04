import getInput from "./util/getInput";
import {Point} from "../util/points";

const exampleInput = `v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`;

const realInput = getInput(25);

const input = realInput;

const seaCucumbers: SeaCucumber[] = [];

const maxX = input.split("\n")[0].length;
const maxY = input.split("\n").length;

class SeaCucumber {
    constructor(public position: Point, public type: '>' | 'v') {
    }

    public canMove(state: Map<string, true>): boolean {
        const {x, y} = this.nextPosition();

        const nextKey = `${x},${y}`;

        return !state.has(nextKey);
    }

    public getPosition(): string {
        return `${this.position.x},${this.position.y}`;
    }

    public move() {
        this.position = this.nextPosition();
    }

    public nextPosition(): Point {
        let {x, y} = this.position;

        if (this.type == '>') {
            x = (x + 1) % maxX
        } else {
            y = (y + 1) % maxY;
        }

        return {x, y}
    }
}

input.split("\n").forEach(
    (row, y) => {
        row.split("").forEach(
            (char, x) => {
                if (char == '>' || char == 'v') {
                    seaCucumbers.push(new SeaCucumber({x, y}, char));
                }
            }
        )
    }
);

let days = 0;
let moved;

function moveSeaCucumbers(type: '>' | 'v'): boolean {
    const cucumbersOfType = seaCucumbers.filter(cucumber => cucumber.type == type);

    const state = new Map<string, true>();

    seaCucumbers.forEach(
        cucumber => {
            const key = cucumber.getPosition();

            state.set(key, true);
        }
    )

    const canMove = cucumbersOfType.filter(cucumber => cucumber.canMove(state));

    canMove.forEach(cucumber => {
        cucumber.move()
    });

    return canMove.length > 0;
}

function toStr(): string {
    const rows: string[] = [];

    for (let y = 0; y < maxY; y++) {
        let row = '';
        for (let x = 0; x < maxX; x++) {
            const match = seaCucumbers.find(
                cucumber => cucumber.position.x == x && cucumber.position.y == y
            );

            if (match) {
                row += match.type;
            } else {
                row += '.';
            }
        }
        rows.push(row);
    }

    return rows.join("\n");
}

do {
    days++;

    moved = moveSeaCucumbers('>');

    moved = moveSeaCucumbers('v') || moved;
} while (moved)

console.log(`Part 1: ${days}`);
