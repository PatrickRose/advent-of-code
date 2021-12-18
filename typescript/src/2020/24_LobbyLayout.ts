import getInput from "./util/getInput";

const input = getInput(24);

let blackTiles: Set<string> = new Set<string>();

type Action = 'e' | 'w' | 'se' | 'sw' | 'nw' | 'ne';

const directions: { [K in Action]: [number, number, number] } = {
    'e': [1, -1, 0],
    'w': [-1, 1, 0],
    'se': [0, -1, 1],
    'sw': [-1, 0, 1],
    'nw': [0, 1, -1],
    'ne': [1, 0, -1]
}

function isAction(val: string): val is Action {
    return ['e', 'w', 'se', 'sw', 'nw', 'ne'].includes(val);
}

input.split("\n").forEach(
    row => {
        let x = 0;
        let y = 0;
        let z = 0;

        row.match(/(e|s[ew]|w|n[ew])/g)?.forEach(
            action => {
                if (!isAction(action)) {
                    throw new Error(`Got ${action} which isn't valid`);
                }

                const differences = directions[action];

                x += differences[0];
                y += differences[1];
                z += differences[2];
            }
        );

        const key = `${x},${y},${z}`;
        const previousValue = blackTiles.has(key);

        if (previousValue) {
            blackTiles.delete(key)
        } else {
            blackTiles.add(key)
        }
    }
)

console.log(`Part 1: ${blackTiles.size}`);

for (let i = 1; i <= 100; i++) {
    const newTiles: typeof blackTiles = new Set<string>();
    const keysToCheck: Set<string> = new Set<string>();

    for (const key of blackTiles) {
        const split = key.split(',');
        const x = Number(split[0]);
        const y = Number(split[1]);
        const z = Number(split[2]);

        keysToCheck.add(key);

        for (const direction in directions) {
            if (!isAction(direction)) {
                continue;
            }

            const differences = directions[direction];

            keysToCheck.add(`${x + differences[0]},${y + differences[1]},${z + differences[2]}`)
        }
    }

    for (const key of keysToCheck) {
        const split = key.split(',');
        const x = Number(split[0]);
        const y = Number(split[1]);
        const z = Number(split[2]);

        let count = 0;

        for (const direction in directions) {
            if (!isAction(direction)) {
                continue;
            }

            const differences = directions[direction];
            const neighbourKey = `${x + differences[0]},${y + differences[1]},${z + differences[2]}`

            if (blackTiles.has(neighbourKey)) {
                count += 1;
            }
        }

        if (count == 2 || (blackTiles.has(key) && (count == 1))) {
            newTiles.add(key)
        }
    }

    blackTiles = newTiles;
}

console.log(`Part 2: ${blackTiles.size}`);
