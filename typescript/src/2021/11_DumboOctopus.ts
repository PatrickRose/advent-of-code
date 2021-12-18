import getInput from "./util/getInput";

const exampleInput = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;

const realInput = getInput(11);

const input = realInput;

function adjacentPoints(x: number, y: number): [
    Point,
    Point,
    Point,
    Point,
    Point,
    Point,
    Point,
    Point,
] {
    return [
        {x: x - 1, y: y - 1},
        {x: x - 1, y: y},
        {x: x - 1, y: y + 1},
        {x: x, y: y - 1},
        {x: x, y: y + 1},
        {x: x + 1, y: y - 1},
        {x: x + 1, y: y},
        {x: x + 1, y: y + 1},
    ]
}

const octopuses = new Map<number, Map<number, number>>();

input.split("\n").forEach(
    (row, y) => {
        let map = octopuses.get(y);

        row.split("").forEach((char, x) => {
            if (map === undefined) {
                map = new Map<number, number>();
                octopuses.set(y, map);
            }

            map.set(x, Number.parseInt(char))
        });
    }
);

let flashes = 0;

type Point = { x: number, y: number };

function handleStep() {
    const toFlash: Point[] = [];

    const increase = (x: number, y: number) => {
        const row = octopuses.get(y);

        if (row === undefined) {
            return;
        }

        const oldVal = row.get(x);

        if (oldVal === undefined) {
            return;
        }

        row.set(x, oldVal + 1);

        if (oldVal == 9) {
            flashes++;

            toFlash.push(...adjacentPoints(x, y));
        }
    }

    octopuses.forEach((row, y) => {
        row.forEach((val, x) => {
            increase(x, y);
        })
    });

    while (toFlash.length > 0) {
        const nextPoint = toFlash.pop();

        if (nextPoint === undefined) {
            continue;
        }

        const {x, y} = nextPoint;

        increase(x, y);
    }

    octopuses.forEach((row) => {
        row.forEach((val, x) => {
            if (val > 9) {
                row.set(x, 0);
            }
        });
    });
}

let day = 0;

while (true) {
    day++
    handleStep();

    if (day == 100) {
        console.log(`Part 1: ${flashes}`);
    }

    let allFlashed = true;

    octopuses.forEach(row => {
        if (!allFlashed) {
            return;
        }

        row.forEach(octopus => {
            if (!allFlashed) {
                return;
            }

            allFlashed = octopus == 0;
        });
    });

    if (allFlashed) {
        break;
    }
}

console.log(`Part 2: ${day}`);
