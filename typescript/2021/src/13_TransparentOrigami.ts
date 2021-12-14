import getInput from "./util/getInput";

const exampleInput = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`;

const realInput = getInput(13);

const input = realInput;

const points = new Map<number, Map<number, true>>();

const [positions, folds] = input.split('\n\n');

positions.split("\n").forEach(
    row => {
        const [x, y] = row.split(',').map(val => Number.parseInt(val, 10));

        if (points.has(y)) {
            points.get(y)?.set(x, true)
        } else {
            const map = new Map<number, true>();
            map.set(x, true)
            points.set(y, map);
        }
    }
);

function performFold(foldInstruction: string) {
    const instruction = foldInstruction.split(' ')[2];

    const [axis, amount] = instruction.split('=');
    const line = Number.parseInt(amount, 10);

    if (axis == 'x') {
        points.forEach(row => {
            // Find all positions greater than x
            const toFlip: number[] = [];
            row.forEach((_, key) => {
                if (key > line) {
                    toFlip.push(key);
                }
            });

            toFlip.forEach(flipping => {
                row.delete(flipping);

                const newPos = (2 * line) - flipping;

                row.set(newPos, true);
            });
        })
    } else if (axis == 'y') {
        const toFlip: number[] = [];

        points.forEach((_, key) => {
            if (key > line) {
                toFlip.push(key);
            }
        });

        toFlip.forEach(flipping => {
            const xValuesToFlip = points.get(flipping)

            if (xValuesToFlip === undefined) {
                return;
            }

            points.delete(flipping);

            const newPos = (2 * line) - flipping;

            if (points.has(newPos)) {
                const newMap = points.get(newPos);

                xValuesToFlip.forEach((_, key) => {
                    newMap?.set(key, true);
                })
            } else {
                points.set(newPos, xValuesToFlip);
            }
        });
    }
}

folds.split("\n").forEach(
    (fold, index) => {
        performFold(fold);

        if (index === 0) {
            let numActive = 0;
            points.forEach(row => {
                numActive += row.size;
            });
            console.log(`Part 1: ${numActive}`);

        }
    }
)

let xValues: number[] = [];
let yValues: number[] = Array.from(points.keys());

points.forEach((row) => {
    xValues.push(...Array.from(row.keys()));
});

let str = '';

for (let y = Math.min(...yValues); y <= Math.max(...yValues); y++) {
    const row = points.get(y) ?? new Map<number, true>();
    for (let x = Math.min(...xValues); x <= Math.max(...xValues); x++) {
        str += `${row.has(x) ? '█' : ' '}`;
    }
    str += '\n';
}

console.log(`Part 2:
${str}`);
