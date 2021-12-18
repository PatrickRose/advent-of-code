import getInput from "./util/getInput";

const exampleInput = `target area: x=20..30, y=-10..-5`;

const realInput = getInput(17);

const input = realInput;

const match = input.match(/target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/);

if (match === null) {
    throw Error('Did not match');
}

const xs = [match[1], match[2]].map(val => Number.parseInt(val, 10));
const ys = [match[3], match[4]].map(val => Number.parseInt(val, 10));

const targetArea = {
    x: [Math.min(...xs), Math.max(...xs)],
    y: [Math.min(...ys), Math.max(...ys)]
}

function hitsTargetArea(x: number, y: number): number | false {
    const velocity = {x, y};
    const position = {x: 0, y: 0};

    const yPos = [0];

    while (true) {
        position.x += velocity.x;
        position.y += velocity.y;

        yPos.push(position.y);

        if (position.x >= targetArea.x[0] && position.x <= targetArea.x[1]
            && position.y >= targetArea.y[0] && position.y <= targetArea.y[1]) {
            return Math.max(...yPos);
        }

        if (position.x > targetArea.x[1]) {
            return false;
        }

        if (position.y < targetArea.y[0]) {
            return false;
        }

        if (velocity.x > 0) {
            velocity.x--;
        }
        velocity.y--;
    }
}

const highestYs: number[] = [];

for (let x = 0; x <= targetArea.x[1]; x++) {
    for (let y = targetArea.y[0]; y <= 2 * -targetArea.y[1]; y++) {
        const result = hitsTargetArea(x, y);
        if (result !== false) {
            highestYs.push(result);
        }
    }
}

console.log(`Part 1: ${Math.max(...highestYs)}`);
console.log(`Part 2: ${highestYs.length}`);
