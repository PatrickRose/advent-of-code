import getInput from "./util/getInput";

const input = getInput(11)

type Position = {
    newPosition: (numAdjacent: number, partTwo: boolean) => Position,
    toString: () => string,
}

const floor: Position = {
    newPosition: () => floor,
    toString: () => '.',
};

const occupied: Position = {
    newPosition(numAdjacent, partTwo): Position {
        const maxAdjacent = partTwo ? 5 : 4;

        return numAdjacent >= maxAdjacent ? emptySeat : occupied;
    },
    toString: () => '#',
}

const emptySeat: Position = {
    newPosition(numAdjacent): Position {
        return numAdjacent == 0 ? occupied : emptySeat;
    },
    toString: () => 'L',
}

const charMap: Map<string, Position> = new Map<string, Position>();
charMap.set('#', occupied);
charMap.set('L', emptySeat);
charMap.set('.', floor);

type Grid = Array<Array<Position>>;
let baseGrid: Grid = input.split("\n").map(
    (row): Array<Position> => {
        return row.split('').map(
            (char): Position => {
                const mappedVal = charMap.get(char);

                if (mappedVal === undefined) {
                    throw new Error(`Unknown char ${char}`)
                }

                return mappedVal;
            }
        )
    }
);

function occupiedAroundPoint(x: number, y: number, grid: Grid, checkforFirstSeat: boolean): number {
    const looper = [-1, 0, 1];

    if (checkforFirstSeat) {
        return looper.reduce(
            (previous, xCheck): number => {
                return previous + looper.filter(
                    (yCheck): boolean => {
                        if (xCheck == 0 && yCheck == 0) {
                            return false;
                        }

                        let xPos = x + xCheck;
                        let yPos = y + yCheck;

                        while (grid[yPos] !== undefined && grid[yPos][xPos] !== undefined) {
                            const position = grid[yPos][xPos];

                            switch (position) {
                                case floor:
                                    yPos += yCheck;
                                    xPos += xCheck;
                                    break;
                                case emptySeat:
                                    return false;
                                case occupied:
                                    return true;
                            }
                        }

                        return false;
                    }
                ).length
            },
            0
        );
    } else {
        return looper.reduce(
            (previous, xCheck): number => {
                const xPos = x + xCheck;

                if (xPos < 0 || xPos >= grid[0].length) {
                    return previous;
                }

                return previous + looper.filter(
                    (yCheck): boolean => {
                        const yPos = y + yCheck;

                        if (yPos == y && xPos == x) {
                            return false;
                        }
                        if (yPos < 0 || yPos >= grid.length) {
                            return false;
                        }

                        return grid[yPos][xPos] == occupied;
                    }
                ).length
            },
            0
        );
    }
}

function goUntilStable(baseGrid: Grid, part2: boolean): number {
    let grid: Grid = baseGrid.map(row => row.slice());
    let changeMade: boolean;
    let i = 0;

    do {
        i += 1;
        const newGrid: Grid = [];
        changeMade = false;

        grid.forEach(
            (row, y) => {
                const newRow: Array<Position> = [];

                row.forEach(
                    (position, x) => {
                        const numAdjacent = occupiedAroundPoint(x, y, grid, part2);
                        const newPosition = position.newPosition(numAdjacent, part2);

                        newRow.push(newPosition)

                        changeMade = changeMade || newPosition != position;
                    }
                );

                newGrid.push(newRow);
            }
        );

        grid = newGrid;

    } while (changeMade)

    return grid.reduce(
        (prev, row): number => {
            return prev + row.filter(p => p == occupied).length
        },
        0
    );
}

console.log(`Part 1: ${goUntilStable(baseGrid, false)}`)
console.log(`Part 2: ${goUntilStable(baseGrid, true)}`)
