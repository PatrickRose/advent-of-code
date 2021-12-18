import getInput from "./util/getInput";

const input = getInput(3)

const trees: Array<Array<boolean>> = input.split("\n").map(
    (row: string): Array<boolean> => {
        return row.split('').map((char) => char == '#')
    }
);
const maxRight = trees[0].length;

function getPositionsInAngle(right: number, down: number): Array<{ x: number, y: number, hit: boolean }> {
    let x = 0;

    let treesHit = [];

    for (let y = 0; y < trees.length; y += down) {
        treesHit.push({
            x, y, hit: trees[y][x]
        });
        x = (x + right) % maxRight;
    }
    return treesHit;
}

function countTreesInAngle(right: number, down: number = 1): number {
    return getPositionsInAngle(right, down).filter(val => val.hit).length;
}

const r1r1 = countTreesInAngle(1);
const r3d1 = countTreesInAngle(3);
const r5d1 = countTreesInAngle(5);
const r7d1 = countTreesInAngle(7);
const r1d2 = countTreesInAngle(1, 2);

console.log(`Part 1: ${r3d1}`);
console.log(`Part 2: ${r1r1} * ${r3d1} * ${r5d1} * ${r7d1} * ${r1d2} = ${r1r1 * r3d1 * r5d1 * r7d1 * r1d2}`);
