import getInput from "./util/getInput";

const input: string = getInput(20);

const placed: Tile[] = [];

const jigsaw = new Map<number, Map<number, Tile>>();
let minX = 0;
let maxX = 0;
let minY = 0;
let maxY = 0;

function setGlobalPosition(x: number, y: number, val: Tile) {
    let row = jigsaw.get(y);

    if (row === undefined) {
        row = new Map<number, Tile>();
        jigsaw.set(y, row);
    }

    if (row.get(x)) {
        throw Error(`Setting the same position ${[x, y]} twice?`);
    }

    row.set(x, val);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
}

type Direction = "up" | "down" | "left" | "right";
const DIRECTIONS: Direction[] = ["up", "down", "left", "right"];

function inverseDirection(direction: Direction): Direction {
    switch (direction) {
        case "up":
            return "down";
        case "down":
            return "up";
        case "left":
            return "right";
        case "right":
            return "left";
    }
}

function calculateXY(x: number, y: number, direction: Direction): [number, number] {
    switch (direction) {
        case "up":
            return [x, y - 1];
        case "down":
            return [x, y + 1];
        case "left":
            return [x - 1, y];
        case "right":
            return [x + 1, y];
    }
}

function flipArray(initial: boolean[][]): boolean[][] {
    return initial.reverse();
}

function rotateArray(initial: boolean[][]): boolean[][] {
    const newValues = [];

    for (let x = 0; x < initial[0].length; x++) {
        const row = [];
        for (let y = initial.length; y > 0; y--) {
            row.push(initial[y - 1][x]);
        }
        newValues.push(row)
    }

    return newValues;
}

class Tile {
    public readonly value: number;
    public values: boolean[][];
    private frozen: boolean;
    private related: { [Property in Direction]: Tile | null };
    private position: [number, number] | null;

    constructor(value: number, values: boolean[][]) {
        this.value = value;
        this.values = values;
        this.frozen = false;
        this.related = {
            up: null,
            down: null,
            left: null,
            right: null
        }
        this.position = null;
    }

    public matches(tile: Tile): Direction | null {
        if (tile.isFrozen()) {
            return null;
        }

        // Go through each direction and see if it fits
        // For each direction, check if:
        // Works as is
        // Works with a flip
        // If not, flip it back, and rotate
        // Try again until it's been rotated 4 times
        for (let direction of DIRECTIONS) {
            for (let i = 0; i < 4; i++) {
                for (let _ of [true, false]) {
                    const thisBase = this.getRow(direction);
                    const thatBase = tile.getRow(inverseDirection(direction));

                    if (thisBase == thatBase) {
                        return direction;
                    }
                    tile.flip();
                }
                tile.rotate()
            }
        }
        return null;
    }

    public getRow(direction: Direction): string {
        let values: boolean[];

        switch (direction) {
            case "up":
                values = this.values[0];
                break;
            case "down":
                values = this.values[this.values.length - 1];
                break;
            case "left":
                values = this.values.map(
                    row => row[0]
                );
                break;
            case "right":
                values = this.values.map(
                    row => row[row.length - 1]
                );
                break;
        }

        return values.map(char => char ? '#' : '.').join("");
    }

    public flip() {
        this.values = flipArray(this.values);
    }

    public rotate() {
        this.values = rotateArray(this.values)
    }

    public freeze(): void {
        this.frozen = true;
    }

    public isFrozen(): boolean {
        return this.frozen;
    }

    public place(direction: Direction, tile: Tile) {
        if (this.position === null) {
            throw Error('Called place without having a position for this!');
        }
        this.related[direction] = tile;
        const [x, y] = calculateXY(this.position[0], this.position[1], direction);

        console.log(`Placing ${tile.value} next to ${this.value} (${direction}). This position: ${this.position}. That position: ${[x, y]}`);
        tile.setPosition(x, y);
        tile.freeze();
    }

    public setPosition(x: number, y: number): void {
        this.position = [x, y];
        setGlobalPosition(x, y, this)
        placed.push(this);

        for (let direction of DIRECTIONS) {
            if (this.related[direction]) {
                continue;
            }
            const [newX, newY] = calculateXY(x, y, direction);
            const related = jigsaw.get(newY)?.get(newX);
            if (related) {
                this.related[direction] = related;
                related.related[inverseDirection(direction)] = this;
            }
        }
    }

    public complete(): boolean {
        return DIRECTIONS.every(
            direction => this.related[direction] !== null
        )
    }

    public stripBorder(): boolean[][] {
        return this.values.slice(1, -1).map(
            row => row.slice(1, -1)
        );
    }
}

const tiles: Tile[] = input.split("\n\n").map(
    value => {
        const rows = value.split("\n");
        const tileNumberMatch = rows[0].match(/Tile (\d+):/);
        if (tileNumberMatch === null) {
            throw Error(`Didn't start with a tile signifier: ${value}`);
        }

        const tileNumber = Number.parseInt(tileNumberMatch[1]);
        if (isNaN(tileNumber)) {
            throw Error(`${rows[0]} returned NaN`);
        }
        return new Tile(tileNumber, rows.slice(1).map(
            value => value.split("").map(
                char => char == '#'
            )
        ));
    }
);

// We're going to assume that tiles are pairwise unique
// If they aren't, then Eric is cruel

// We're just going to keep on matching until all tiles are frozen
// then build the completed jigsaw later

// Because we're going to keep building upon the existing placed pieces,
// this should mean that we build the full jigsaw
// When we successfully place something, we'll also place it above something else
// Again, we're assuming uniqueness because otherwise Eric is literally evil

tiles[0].setPosition(0, 0);
tiles[0].freeze();

let changedLastLoop = true;

while (!tiles.every(tile => tile.isFrozen())) {
    if (!changedLastLoop) {
        throw Error('Oh no, we didn\'t match anything');
    }
    changedLastLoop = false;
    // Slice here so that we end up working with a copy of the array
    for (const baseTile of placed.slice()) {
        if (baseTile.complete()) {
            continue;
        }
        for (const newTile of tiles) {
            if (newTile.isFrozen()) {
                continue;
            }
            const match = baseTile.matches(newTile)
            if (match) {
                baseTile.place(match, newTile);
                changedLastLoop = true;
            }
        }
    }
}

let part1: bigint = 1n;

for (let [x, y] of [[minX, minY], [maxX, minY], [minX, maxY], [maxX, maxY]]) {
    const value = jigsaw?.get(y)?.get(x)?.value;

    if (!value) {
        throw Error('Jigsaw was not solved');
    }

    part1 *= BigInt(value);
}

console.log(`Part 1: ${part1}`);

const grid = [];

for (let y = minY; y <= maxY; y++) {
    const row = [];
    for (let x = minX; x <= maxX; x++) {
        const tile = jigsaw.get(y)?.get(x);

        if (!tile) {
            throw Error('Jigsaw was not solved');
        }

        row.push(tile.stripBorder());
    }
    grid.push(row);
}

let joinedGrid: boolean[][] = [];
grid.forEach(
    row => {
        for (let y = 0; y < row[0].length; y++) {
            joinedGrid.push(
                row.flatMap(
                    arr => arr[y]
                )
            )
        }
    }
)

joinedGrid.map(
    row => row.map(char => char ? '#' : '.').join("")
).join("\n");

function findRelativePositions(x: number, y: number): [number, number][] {
    return [
        [x, y],
        [x - 18, y + 1],
        [x - 13, y + 1],
        [x - 12, y + 1],
        [x - 7, y + 1],
        [x - 6, y + 1],
        [x - 1, y + 1],
        [x, y + 1],
        [x + 1, y + 1],
        [x - 17, y + 2],
        [x - 14, y + 2],
        [x - 11, y + 2],
        [x - 8, y + 2],
        [x - 5, y + 2],
        [x - 2, y + 2],
    ];
}

function testPosition(x: number, y: number, grid: boolean[][]): boolean {
    if (x < 0 || y < 0 || x >= grid[0].length || y >= grid.length) {
        return false;
    }

    return grid[y][x];
}

function findMonsters(grid: boolean[][]): string | null {
    let convert = "";
    let found = false;

    grid.forEach(
        (row, y) => {
            row.forEach(
                (char, x) => {
                    const relativePositions = findRelativePositions(x, y);

                    if (relativePositions.every(([x, y]) => testPosition(x, y, grid))) {
                        relativePositions.forEach(
                            ([x, y]) => {
                                grid[y][x] = false;
                            }
                        );
                        found = true;
                        char = false;
                    }
                    convert += char ? '#' : '.';
                }
            );
            convert += "\n";
        }
    )

    return found ? convert : null;
}

// Again, assume that there aren't multiple rotations that have a sea monster
// If there are, we again call Eric evil
for (let rotations of [1, 2, 3, 4]) {
    for (let flip of [true, false]) {
        const result = findMonsters(joinedGrid)
        if (result) {
            const count = (result.match(/#/g) || []).length
            console.log(`Part two: ${count}`);
        }
        joinedGrid = flipArray(joinedGrid);
    }
    joinedGrid = rotateArray(joinedGrid);
}
