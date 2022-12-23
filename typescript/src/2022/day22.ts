import getInput from "./util/getInput";
import {Point, PointString, pointToPointString} from "../util/points";

const sampleInput = `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`;

const input = getInput(22);

const [mapInput, instructions] = input.split('\n\n');

const map: Map<PointString, boolean> = new Map();

const position: Point = {
    y: 0,
    x: 0
}
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
let direction: Direction = 'RIGHT';

let maxX = 0;
const maxY = mapInput.split('\n').length - 1;

const TOADD: { [key in Direction]: string } = {
    UP: '^',
    DOWN: 'v',
    LEFT: '<',
    RIGHT: '>',
}

mapInput.split('\n').forEach(
    (row, y) => {
        row.split('').forEach(
            (char, x) => {
                if (char == ' ') {
                    return;
                }

                if (y == 0 && position.x == 0) {
                    position.x = x;
                }

                map.set(`${x},${y}`, char == '#');

                if (x > maxX) {
                    maxX = x
                }
            }
        );
    }
);

const startingPosition: Point = {...position};

const MOVEMENTS: { [key in Direction]: Point } = {
    UP: {
        x: 0,
        y: -1
    },
    DOWN: {
        x: 0,
        y: 1
    },
    LEFT: {
        x: -1,
        y: 0
    },
    RIGHT: {
        x: 1,
        y: 0
    }
}

const TURNS: { [key in 'L' | 'R']: { [key in Direction]: Direction } } = {
    L: {
        UP: "LEFT",
        DOWN: "RIGHT",
        LEFT: "DOWN",
        RIGHT: "UP"
    },
    R: {
        UP: "RIGHT",
        DOWN: "LEFT",
        LEFT: "UP",
        RIGHT: "DOWN"
    },
}

const VALUE_OF_FACING: { [key in Direction]: number } = {
    UP: 3,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 0
}

type Adjacents = Map<PointString, { [key in Direction]?: { point: Point, direction: Direction } }>;

function runMove(startingPosition: Point, adjacents: undefined | Adjacents = undefined): number {
    const position = {...startingPosition}
    for (const instruction of instructions.matchAll(/(\d+)(L|R)?/g)) {
        const length = Number.parseInt(instruction[1], 10);
        const turn = instruction[2];

        for (let i = 0; i < length; i++) {
            const movement = MOVEMENTS[direction];
            // Check what the next place would be
            const newPosition = {...position};
            newPosition.x += movement.x;
            newPosition.y += movement.y;

            if (!map.has(pointToPointString(newPosition))) {
                if (adjacents) {
                    const adjacent = adjacents.get(pointToPointString(newPosition));

                    if (adjacent === undefined) {
                        throw new Error(`Type check at ${pointToPointString(newPosition)} from ${pointToPointString(position)}`);
                    }

                    const adjacentPosition = adjacent[direction];

                    if (adjacentPosition === undefined) {
                        throw new Error(`Type check - don't have a direction at ${pointToPointString(newPosition)} from ${pointToPointString(position)} (trying to move ${direction})`);
                    }

                    newPosition.x = adjacentPosition.point.x;
                    newPosition.y = adjacentPosition.point.y;
                    direction = adjacentPosition.direction;

                    if (!map.has(pointToPointString(newPosition))) {
                        throw new Error(`Moved to non-existent place when moving to ${pointToPointString(newPosition)} from ${pointToPointString(position)}`)
                    }
                } else {
                    if (movement.x == 1) {
                        newPosition.x = 0;
                    } else if (movement.x == -1) {
                        newPosition.x = maxX;
                    } else if (movement.y == 1) {
                        newPosition.y = 0;
                    } else if (movement.y == -1) {
                        newPosition.y = maxY;
                    }

                    while (!map.has(pointToPointString(newPosition))) {
                        newPosition.x += movement.x;
                        newPosition.y += movement.y;
                    }
                }
            }

            if (map.get(pointToPointString(newPosition))) {
                break;
            }

            position.x = newPosition.x;
            position.y = newPosition.y;
        }

        if (turn == 'L') {
            direction = TURNS['L'][direction]
        } else if (turn == 'R') {
            direction = TURNS['R'][direction]
        }
    }

    return (1000 * (position.y + 1)) + (4 * (position.x + 1)) + VALUE_OF_FACING[direction];
}

console.log(`Part 1: ${runMove(startingPosition)}`);

const adjacents: Adjacents = new Map;

if (input == sampleInput) {
    // todo
} else {
    for (let x = 0; x < 50; x++) {
        // J
        adjacents.set(
            `${x},99`, {
                UP: {
                    point: {
                        x: 50,
                        y: x + 50
                    },
                    direction: "RIGHT"
                }
            }
        )

        // M
        adjacents.set(
            `${x},200`, {
                DOWN: {
                    point: {
                        x: 50 + x,
                        y: 0
                    },
                    direction: "DOWN"
                }
            }
        )
    }

    for (let x = 50; x < 100; x++) {
        // A
        adjacents.set(
            `${x},-1`, {
                UP: {
                    point: {
                        x: 0,
                        y: 100 + x
                    },
                    direction: "RIGHT"
                }
            }
        );

        // I
        adjacents.set(
            `${x},150`, {
                DOWN: {
                    point: {
                        x: 49,
                        y: 100 + x
                    },
                    direction: "LEFT"
                }
            }
        );
    }

    for (let x = 100; x < 150; x++) {
        // B
        adjacents.set(
            `${x},-1`, {
                UP: {
                    point: {
                        x: x - 100,
                        y: 199
                    },
                    direction: "UP"
                }
            }
        );

        // D
        adjacents.set(
            `${x},50`, {
                DOWN: {
                    point: {
                        x: 99,
                        y: x - 50
                    },
                    direction: "LEFT"
                }
            }
        );
    }

    for (let y = 0; y < 50; y++) {
        // C
        const rightCheck = adjacents.get(`150,${y}`);

        if (rightCheck) {
            rightCheck.RIGHT = {
                point: {
                    x: 99,
                    y: 149 - y
                },
                direction: "LEFT"
            }
        } else {
            adjacents.set(
                `150,${y}`, {
                    RIGHT: {
                        point: {
                            x: 99,
                            y: 149 - y
                        },
                        direction: "LEFT"
                    }
                }
            )
        }

        const leftCheck = adjacents.get(`49,${y}`);

        if (leftCheck) {
            leftCheck.LEFT = {
                point: {
                    x: 0,
                    y: 149 - y
                },
                direction: "RIGHT"
            }
        } else {
            // E
            adjacents.set(
                `49,${y}`, {
                    LEFT: {
                        point: {
                            x: 0,
                            y: 149 - y
                        },
                        direction: "RIGHT"
                    }
                }
            )
        }
    }

    for (let y = 50; y < 100; y++) {
        // F
        const leftCheck = adjacents.get(`49,${y}`);

        if (leftCheck) {
            leftCheck.LEFT = {
                point: {
                    x: y - 50,
                    y: 100
                },
                direction: "DOWN"
            }
        } else {
            adjacents.set(
                `49,${y}`, {
                    LEFT: {
                        point: {
                            x: y - 50,
                            y: 100
                        },
                        direction: "DOWN"
                    }
                }
            );
        }

        // G
        const rightCheck = adjacents.get(`100,${y}`);

        if (rightCheck) {
            rightCheck.RIGHT = {
                point: {
                    x: y,
                    y: 49
                },
                direction: "UP"
            }
        } else {
            adjacents.set(
                `100,${y}`, {
                    RIGHT: {
                        point: {
                            x: y,
                            y: 49
                        },
                        direction: "UP"
                    }
                }
            )
        }
    }

    for (let y = 100; y < 150; y++) {
        // K
        adjacents.set(
            `-1,${y}`, {
                LEFT: {
                    point: {
                        x: 50,
                        y: 149 - y
                    },
                    direction: "DOWN"
                }
            }
        )

        // H
        adjacents.set(
            `100,${y}`, {
                RIGHT: {
                    point: {
                        x: 149,
                        y: 149 - y
                    },
                    direction: "LEFT"
                }
            }
        )
    }

    for (let y = 150; y < 200; y++) {
        // L
        adjacents.set(
            `-1,${y}`, {
                LEFT: {
                    point: {
                        x: y - 100,
                        y: 0
                    },
                    direction: "DOWN"
                }
            }
        )

        // N
        adjacents.set(
            `50,${y}`, {
                RIGHT: {
                    point: {
                        x: y - 100,
                        y: 149
                    },
                    direction: "UP"
                }
            }
        )
    }


}

console.log(`Part 2: ${runMove(startingPosition, adjacents)}`);
