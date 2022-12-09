import getInput from "./util/getInput";
import {Point} from "../util/points";

const sampleInput = [
    `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`,
    `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`
];

const input = getInput(9);

function calculateTails(length: number): number {
    const rope: Point[] = [];
    while (rope.length < length) {
        rope.push({x: 0, y: 0})
    }

    const visited: Set<`${number},${number}`> = new Set();
    visited.add('0,0');

    input.split('\n').forEach(row => {
        const [dir, amount] = row.split(' ');

        for (let i = 0; i < Number.parseInt(amount, 10); i++) {
            rope.forEach((val, index) => {
                if (index == 0) {
                    switch (dir) {
                        case 'U':
                            val.y++
                            break;
                        case 'D':
                            val.y--;
                            break;
                        case 'L':
                            val.x--;
                            break;
                        case 'R':
                            val.x++;
                            break;
                        default:
                            throw new Error(`Eh? ${dir} is not expected`);
                    }
                } else {
                    const headPosition = rope[index - 1];

                    const yDiff = headPosition.y - val.y;
                    const xDiff = headPosition.x - val.x;

                    if (Math.abs(yDiff) > 1 || Math.abs(xDiff) > 1) {
                        if (yDiff != 0) {
                            val.y += (yDiff > 0) ? 1 : -1;
                        }

                        if (xDiff != 0) {
                            val.x += (xDiff > 0) ? 1 : -1;
                        }
                    }
                }
            })

            const val = rope[length-1];

            visited.add(`${val.x},${val.y}`);
        }

    })
    return visited.size;
}

console.log(`Part 1: ${calculateTails(2)}`);
console.log(`Part 2: ${calculateTails(10)}`);
