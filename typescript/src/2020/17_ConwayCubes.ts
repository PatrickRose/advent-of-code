import getInput from "./util/getInput";

const input = getInput(17);

type XDimension = Map<number, boolean>;
type YDimension = Map<number, XDimension>;
type ZDimension = Map<number, YDimension>;
type WDimension = Map<number, ZDimension>;

let grid: ZDimension = new Map<number, YDimension>();

const initialState: YDimension = new Map<number, XDimension>();

input.split("\n").forEach((row, y) => {
    const xDim: XDimension = new Map<number, boolean>();

    row.split('').forEach((char, x) => {
        xDim.set(x, char == '#');
    });

    initialState.set(y, xDim);
});

grid.set(0, initialState);

function getMaxKeysFromMap(grid: Map<number, any>): Array<number> {
    const keys = Array.from(grid.keys());
    keys.push(Math.min(...keys) - 1);
    keys.push(Math.max(...keys) + 1);

    keys.sort((a, b) => a - b);

    return keys;
}

function isActive(grid: Map<number, Dimension>, ...keys: number[]): boolean {
    let check: Dimension = grid;

    for (const val of keys) {
        if (typeof check == 'boolean') {
            throw Error('Too many dimensions for this grid!');
        }

        const nextDim: Dimension | undefined = check.get(val);

        if (nextDim === undefined) {
            return false;
        }

        check = nextDim;
    }

    return check === true;
}

function countNeighbours(grid: ZDimension, zKey: number, yKey: number, xKey: number): number {
    return [zKey - 1, zKey, zKey + 1].reduce(
        (prevZ, z) => {
            return prevZ + [yKey - 1, yKey, yKey + 1].reduce(
                (prevY, y) => {
                    return prevY + [xKey - 1, xKey, xKey + 1].reduce(
                        (prevX, x) => {
                            if (z == zKey && y == yKey && x == xKey) {
                                return prevX;
                            }

                            return prevX + (isActive(grid, z, y, x) ? 1 : 0);
                        },
                        0
                    );
                },
                0
            )
        },
        0
    )
}

function countNeighboursWDim(grid: WDimension, wKey: number, zKey: number, yKey: number, xKey: number): number {
    return [wKey - 1, wKey, wKey + 1].reduce(
        (prevW, w) => {
            return prevW + [zKey - 1, zKey, zKey + 1].reduce(
                (prevZ, z) => {
                    return prevZ + [yKey - 1, yKey, yKey + 1].reduce(
                        (prevY, y) => {
                            return prevY + [xKey - 1, xKey, xKey + 1].reduce(
                                (prevX, x) => {
                                    if (z == zKey && y == yKey && x == xKey && w == wKey) {
                                        return prevX;
                                    }

                                    return prevX + (isActive(grid, w, z, y, x) ? 1 : 0);
                                },
                                0
                            );
                        },
                        0
                    )
                },
                0
            )
        },
        0
    );
}

type Dimension = Map<number, Dimension> | boolean

function activeCellsInGrid(grid: Map<number, Dimension>): number {
    let count = 0;

    grid.forEach((subGrid) => {
        if (typeof subGrid == 'boolean') {
            count += subGrid ? 1 : 0;
        } else {
            count += activeCellsInGrid(subGrid)
        }
    });
    return count;
}

for (let turn = 0; turn < 6; turn++) {
    const newGrid: ZDimension = new Map<number, YDimension>();

    const zKeys = getMaxKeysFromMap(grid);

    const firstY = grid.get(0);

    if (firstY === undefined) {
        throw new Error('Lost Y = 0?');
    }

    const yKeys = getMaxKeysFromMap(firstY);

    const firstX = firstY.get(0);

    if (firstX === undefined) {
        throw new Error('Lost X = 0?');
    }

    const xKeys = getMaxKeysFromMap(firstX);

    zKeys.forEach(zKey => {
        const newY: YDimension = new Map<number, XDimension>()
        yKeys.forEach(yKey => {
            const newX: XDimension = new Map<number, boolean>();

            xKeys.forEach(xKey => {
                const thisIsActive = isActive(grid, zKey, yKey, xKey);

                const activeNeighbours = countNeighbours(grid, zKey, yKey, xKey);

                const val: boolean = thisIsActive
                    ? activeNeighbours == 2 || activeNeighbours == 3
                    : activeNeighbours === 3;

                newX.set(xKey, val);
            });

            newY.set(yKey, newX);
        })

        newGrid.set(zKey, newY);
    });

    grid = newGrid;
}

let count = activeCellsInGrid(grid);

console.log(`Part 1: ${count}`);

let part2Grid: WDimension = new Map<number, ZDimension>();
const part2Z: ZDimension = new Map<number, YDimension>();
part2Z.set(0, initialState);
part2Grid.set(0, part2Z)

for (let turn = 0; turn < 6; turn++) {
    const newGrid: WDimension = new Map<number, ZDimension>();

    const wKeys = getMaxKeysFromMap(part2Grid);

    const firstZ = part2Grid.get(0);

    if (firstZ === undefined) {
        throw new Error('Lost Z = 0?');
    }

    const zKeys = getMaxKeysFromMap(firstZ);

    const firstY = grid.get(0);

    if (firstY === undefined) {
        throw new Error('Lost Y = 0?');
    }

    const yKeys = getMaxKeysFromMap(firstY);

    const firstX = firstY.get(0);

    if (firstX === undefined) {
        throw new Error('Lost X = 0?');
    }

    const xKeys = getMaxKeysFromMap(firstX);

    wKeys.forEach(wKey => {
        const newZ: ZDimension = new Map<number, YDimension>();
        zKeys.forEach(zKey => {
            const newY: YDimension = new Map<number, XDimension>()
            yKeys.forEach(yKey => {
                const newX: XDimension = new Map<number, boolean>();

                xKeys.forEach(xKey => {
                    const thisIsActive = isActive(part2Grid, wKey, zKey, yKey, xKey);

                    const activeNeighbours = countNeighboursWDim(part2Grid, wKey, zKey, yKey, xKey);

                    const val: boolean = thisIsActive
                        ? activeNeighbours == 2 || activeNeighbours == 3
                        : activeNeighbours === 3;

                    newX.set(xKey, val);
                });

                newY.set(yKey, newX);
            })

            newZ.set(zKey, newY);
        });

        newGrid.set(wKey, newZ);
    });

    part2Grid = newGrid;
}

count = activeCellsInGrid(part2Grid);

console.log(`Part 1: ${count}`);
