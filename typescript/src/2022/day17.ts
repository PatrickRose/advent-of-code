import getInput from './util/getInput';
import {Point} from '../util/points';

const sampleInput = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`;

const input = getInput(17);

const rocks: Map<number, Map<number, true>> = new Map;

abstract class Rock {
    #lowerLeftPosition: Point;

    public constructor(startingPos: Point) {
        this.#lowerLeftPosition = startingPos;
    }

    protected abstract getDiffs(): Point[];

    public getPosition(point: Point | undefined = undefined): Point[] {
        const realPoint = point ?? this.#lowerLeftPosition;

        return this.getDiffs().map(
            ({ x, y }) => {
                return {
                    x: x + realPoint.x,
                    y: y + realPoint.y
                }
            }
        );
    }

    public applyGas(left: boolean) {
        const x = this.#lowerLeftPosition.x + (left ? -1 : 1);

        const canMove = this.getPosition(
            { y: this.#lowerLeftPosition.y, x }
        ).every(
            ({ x, y }) => {
                if (rocks.get(y)?.get(x)) {
                    return false;
                }

                return x > 0 && x <= 7;
            }
        );

        if (canMove) {
            this.#lowerLeftPosition.x = x;
        }
    }

    public moveDown(): boolean {
        const y = this.#lowerLeftPosition.y - 1;

        const canMove = y > 0 && this.getPosition(
            { y, x: this.#lowerLeftPosition.x }
        ).every(
            ({ x, y }) => !rocks.get(y)?.get(x)
        );

        if (canMove) {
            this.#lowerLeftPosition.y = y;
        }

        return canMove;
    }
}

class Minus extends Rock {
    protected getDiffs(): Point[] {
        return [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 3, y: 0 },
        ];
    }
}

class Plus extends Rock {
    protected getDiffs(): Point[] {
        return [
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 1, y: 2 },
        ];
    }
}

class LShape extends Rock {
    protected getDiffs(): Point[] {
        return [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 2, y: 1 },
            { x: 2, y: 2 },
        ];
    }
}

class IShape extends Rock {
    protected getDiffs(): Point[] {
        return [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 },
            { x: 0, y: 3 },
        ];
    }
}

class Square extends Rock {
    protected getDiffs(): Point[] {
        return [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
        ];
    }
}

function findCycle(): [number[], number[]] {
    const toReturn = [];
    const baseSteps = [];

    let rock = 0;
    let gasPosition = 0;

    let cacheKey: string = getCacheKey(0, rock, gasPosition);

    const cacheEntries: string[] = [];

    // Run the simulation a lot
    for (; rock < 2022; rock++) {
        const startingY = Math.max(0, ...rocks.keys()) + 4
        const possibleRocks = [
            new Minus({x: 3, y: startingY}),
            new Plus({x: 3, y: startingY}),
            new LShape({x: 3, y: startingY}),
            new IShape({x: 3, y: startingY}),
            new Square({x: 3, y: startingY}),
        ];

        const movingRock = possibleRocks[rock % 5];

        let canMove = true;

        while (canMove) {
            const left = input[gasPosition % input.length] == '<'
            movingRock.applyGas(left);

            canMove = movingRock.moveDown();

            gasPosition++;
        }

        movingRock.getPosition().forEach(
            ({ x, y }) => {
                let map = rocks.get(y);

                if (!map) {
                    map = new Map;
                    rocks.set(y, map);
                }

                map.set(x, true)
            }
        )

        baseSteps.push(Math.max(0, ...rocks.keys()))
    }

    const baseDelta = Math.max(0, ...rocks.keys());

    while (!cacheEntries.includes(cacheKey)) {
        cacheEntries.push(cacheKey);
        const startingY = Math.max(0, ...rocks.keys()) + 4
        const possibleRocks = [
            new Minus({ x: 3, y: startingY }),
            new Plus({ x: 3, y: startingY }),
            new LShape({ x: 3, y: startingY }),
            new IShape({ x: 3, y: startingY }),
            new Square({ x: 3, y: startingY }),
        ];

        const movingRock = possibleRocks[rock % 5];

        let canMove = true;

        while (canMove) {
            const left = input[gasPosition % input.length] == '<'
            movingRock.applyGas(left);

            canMove = movingRock.moveDown();

            gasPosition++;
        }

        movingRock.getPosition().forEach(
            ({ x, y }) => {
                let map = rocks.get(y);

                if (!map) {
                    map = new Map;
                    rocks.set(y, map);
                }

                map.set(x, true)
            }
        )

        rock++;

        cacheKey = getCacheKey(
            startingY,
            rock % 5,
            gasPosition % input.length
        );

        toReturn.push(Math.max(0, ...rocks.keys()));
    }

    toReturn.pop();

    return [baseSteps, toReturn.map(val => val - baseDelta)];
}

function getCacheKey(
    highestY: number,
    rockNum: number,
    gasNumber: number
): string {
    const cacheKey: string[] = [`${rockNum}`, `${gasNumber}`];

    let row = '';

    for (let y = Math.max(10, highestY); y > Math.max(0, highestY - 10); y--) {
        const rowMap = rocks.get(y) ?? new Map();
        for (let x = 1; x < 8; x++) {
            row += rowMap.has(x) ? '#' : '.';
        }
    }

    cacheKey.push(row);

    return cacheKey.join('\n');
}

const [base, cycle] = findCycle();

function getValueAtNumber(val: number): number {
    if (val < base.length) {
        return base[val - 1];
    }

    const start = base[base.length - 1];

    val -= base.length;

    const extra = val % cycle.length;
    const iterations = val >= cycle.length
        ? Math.floor(val / cycle.length)
        : 0;

    const cycleExtra = extra == 0 ? 0 : cycle[extra - 1];

    return start + cycleExtra + (cycle[cycle.length - 1] * iterations);
}

console.log(`Part 1: ${getValueAtNumber(2022)}`);

console.log(`Part 2: ${getValueAtNumber(1000000000000)}`);
