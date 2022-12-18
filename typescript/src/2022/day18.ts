import getInput from './util/getInput';

const sampleInput = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`;

const input: string = getInput(18);

type CubeMap = Map<number, Map<number, Map<number, true>>>;
const cubes: CubeMap = new Map;

function getCubeAtPos(cubes: CubeMap, x: number, y: number, z: number): true | undefined {
    let xRow = cubes.get(x);

    if (!xRow) {
        xRow = new Map();
        cubes.set(x, xRow);
    }

    let yRow = xRow.get(y);

    if (!yRow) {
        yRow = new Map();
        xRow.set(y, yRow);
    }

    return yRow.get(z);
}

function setCubeAtPos(cubes: CubeMap, x: number, y: number, z: number) {
    let xRow = cubes.get(x);

    if (!xRow) {
        xRow = new Map();
        cubes.set(x, xRow);
    }

    let yRow = xRow.get(y);

    if (!yRow) {
        yRow = new Map();
        xRow.set(y, yRow);
    }

    yRow.set(z, true);
}

const minMaxes = {
    x: {min: Infinity, max: -Infinity},
    y: {min: Infinity, max: -Infinity},
    z: {min: Infinity, max: -Infinity},
}

input.split('\n').forEach(
    row => {
        const [x, y, z] = row.split(',').map(val => Number.parseInt(val, 10));

        setCubeAtPos(cubes, x, y, z);

        if (minMaxes.x.min > x) {
            minMaxes.x.min = x;
        }

        if (minMaxes.x.max < x) {
            minMaxes.x.max = x;
        }

        if (minMaxes.y.min > y) {
            minMaxes.y.min = y;
        }

        if (minMaxes.y.max < y) {
            minMaxes.y.max = y;
        }

        if (minMaxes.z.min > z) {
            minMaxes.z.min = z;
        }

        if (minMaxes.z.max < z) {
            minMaxes.z.max = z;
        }
    }
)

function getAdjacents(x: number, y: number, z: number): { x: number, y: number, z: number }[] {
    return [
        {x: x - 1, y, z},
        {x: x + 1, y, z},
        {x, y: y - 1, z},
        {x, y: y + 1, z},
        {x, y, z: z - 1},
        {x, y, z: z + 1},
    ]
}

let surfaceArea = 0;

for (let x = minMaxes.x.min; x <= minMaxes.x.max + 1; x++) {
    for (let y = minMaxes.y.min; y <= minMaxes.y.max + 1; y++) {
        for (let z = minMaxes.z.min; z <= minMaxes.z.max + 1; z++) {
            const value = getCubeAtPos(cubes, x, y, z);

            if (value === undefined) {
                // nothing to do
                continue;
            }

            const adjacents = getAdjacents(x, y, z).filter(
                ({x, y, z}) => {
                    if (x < minMaxes.x.min - 2) {
                        return true;
                    }
                    if (x > minMaxes.x.max + 2) {
                        return true;
                    }

                    if (y < minMaxes.y.min - 2) {
                        return true;
                    }
                    if (y > minMaxes.y.max + 2) {
                        return true;
                    }

                    if (z < minMaxes.z.min - 2) {
                        return true;
                    }
                    if (z > minMaxes.z.max + 2) {
                        return true;
                    }

                    return getCubeAtPos(cubes, x, y, z) !== undefined
                }
            );

            surfaceArea += 6 - adjacents.length
        }
    }
}

console.log(`Part 1: ${surfaceArea}`);

// Fill in the middle
const outsideCubeSet: Set<string> = new Set();
outsideCubeSet.add(`${[minMaxes.x.min - 1, minMaxes.y.min - 1, minMaxes.z.min - 1,]}`);

let placed = true;

while (placed) {
    placed = false;

    outsideCubeSet.forEach(val => {
        const [x, y, z] = val.split(',').map(val => Number.parseInt(val, 10));

        getAdjacents(x, y, z).forEach(
            ({x, y, z}) => {
                const toAdd = `${[x, y, z].join(',')}`;

                if (outsideCubeSet.has(toAdd)) {
                    return;
                }

                if (x < minMaxes.x.min - 2) {
                    return;
                }
                if (x > minMaxes.x.max + 2) {
                    return;
                }

                if (y < minMaxes.y.min - 2) {
                    return;
                }
                if (y > minMaxes.y.max + 2) {
                    return;
                }

                if (z < minMaxes.z.min - 2) {
                    return;
                }
                if (z > minMaxes.z.max + 2) {
                    return;
                }

                if (getCubeAtPos(cubes, x, y, z) === undefined) {
                    outsideCubeSet.add(toAdd);
                    placed = true;
                }
            }
        )
    })
}

let outsideSurfaceArea = 0;

for (let x = minMaxes.x.min; x <= minMaxes.x.max + 1; x++) {
    for (let y = minMaxes.y.min; y <= minMaxes.y.max + 1; y++) {
        for (let z = minMaxes.z.min; z <= minMaxes.z.max + 1; z++) {
            const value = getCubeAtPos(cubes, x, y, z);

            if (value === undefined) {
                // nothing to do
                continue;
            }

            const adjacents = getAdjacents(x, y, z).filter(
                ({x, y, z}) => {
                    return getCubeAtPos(cubes, x, y, z) !== undefined
                        || !outsideCubeSet.has(`${[x, y, z].join(',')}`)
                }
            );

            outsideSurfaceArea += 6 - adjacents.length
        }
    }
}

console.log(`Part 1: ${outsideSurfaceArea}`);
