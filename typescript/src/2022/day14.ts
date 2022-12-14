import getInput from "./util/getInput";
import {PointString} from "../util/points";

const sampleInput = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

const input = getInput(14);

const positions: Set<PointString> = new Set;

let highestY = 0;

input.split('\n').forEach(
    row => {
        const points = row.split(' -> ').map(point => point.split(',').map(val => Number.parseInt(val, 10)));

        let [x, y] = points[0];

        positions.add(`${x},${y}`);

        points.slice(1).forEach(
            ([newX, newY]) => {
                if (newX == x) {
                    while (y != newY) {
                        y += (newY > y) ? 1 : -1;
                        positions.add(`${x},${y}`);
                    }

                    if (y > highestY) {
                        highestY = y;
                    }
                } else {
                    while (x != newX) {
                        x += (newX > x) ? 1 : -1;
                        positions.add(`${x},${y}`);
                    }
                }
            }
        );
    }
);

let sandCount = 0;
let sandPlaced = true;

while (sandPlaced) {
    sandPlaced = false;
    let [x, y] = [500, 0];

    while (y < highestY) {
        // Check if the place directly below is taken
        if (!positions.has(`${x},${y+1}`)) {
            // Then we can move down
            y++;
            continue;
        }

        // Otherwise, try to move left
        if (!positions.has(`${x-1},${y+1}`)) {
            // Then we can move down
            y++;
            x--
            continue;
        }

        // Otherwise, try to move right
        if (!positions.has(`${x+1},${y+1}`)) {
            // Then we can move down
            y++;
            x++
            continue;
        }

        // At this point the sand has come to rest
        sandPlaced = true;
        sandCount++;
        positions.add(`${x},${y}`);
        break;
    }
}

console.log(`Part 1: ${sandCount}`);

while (!positions.has(`500,0`)) {
    let [x, y] = [500, 0];

    while (true) {
        if (y < (highestY + 1)) {// Check if the place directly below is taken
            if (!positions.has(`${x},${y + 1}`)) {
                // Then we can move down
                y++;
                continue;
            }

            // Otherwise, try to move left
            if (!positions.has(`${x - 1},${y + 1}`)) {
                // Then we can move down
                y++;
                x--
                continue;
            }

            // Otherwise, try to move right
            if (!positions.has(`${x + 1},${y + 1}`)) {
                // Then we can move down
                y++;
                x++
                continue;
            }
        }

        // At this point the sand has come to rest
        sandCount++;
        sandPlaced = true;
        positions.add(`${x},${y}`);
        break;
    }
}

console.log(`Part 2: ${sandCount}`);
