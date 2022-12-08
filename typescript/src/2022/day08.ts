import getInput from "./util/getInput";

const sampleInput = `30373
25512
65332
33549
35390`;

const input = getInput(8);

const trees: number[][] = [];

input.split('\n').forEach(row => {
    const treeRow: number[] = [];
    trees.push(treeRow);
    row.split('').forEach(char => treeRow.push(Number.parseInt(char, 10)))
});

const visibleTrees = trees.map(
    (row, y) => row.filter((tree, x) => {
        let [visUp, visDown, visLeft, visRight] = [true, true, true, true]

        for (let i = y + 1; i < trees.length; i++) {
            if (trees[i][x] >= tree) {
                visUp = false;
                break;
            }
        }

        for (let i = y - 1; i >= 0; i--) {
            if (trees[i][x] >= tree) {
                visDown = false;
                break;
            }
        }

        for (let i = x + 1; i < row.length; i++) {
            if (trees[y][i] >= tree) {
                visRight = false;
                break;
            }
        }

        for (let i = x - 1; i >= 0; i--) {
            if (trees[y][i] >= tree) {
                visLeft = false;
                break;
            }
        }

        return visLeft || visDown || visRight || visUp;
    })
);

const partOne = visibleTrees.reduce((prev, curr) => prev + curr.length, 0);

console.log(`Part 1: ${partOne}`);

const distances = trees.map(
    (row, y) => row.map((tree, x) => {
        let [visUp, visDown, visLeft, visRight] = [0, 0, 0, 0]

        for (let i = y + 1; i < trees.length; i++) {
            visUp++;
            if (trees[i][x] >= tree) {
                break;
            }
        }

        for (let i = y - 1; i >= 0; i--) {
            visDown++;
            if (trees[i][x] >= tree) {
                break;
            }
        }

        for (let i = x + 1; i < row.length; i++) {
            visRight++;
            if (trees[y][i] >= tree) {
                break;
            }
        }

        for (let i = x - 1; i >= 0; i--) {
            visLeft++;
            if (trees[y][i] >= tree) {
                break;
            }
        }

        return visLeft * visDown * visRight * visUp;
    })
);

const partTwo = Math.max(
    ...distances.map(
        (row) => Math.max(...row)
    )
);

console.log(`Part 2: ${partTwo}`);
