import getInput from "./util/getInput";

const sampleInput = `    [D]
[N] [C]
[Z] [M] [P]
 1   2   3

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

const input = getInput(5);

const [start, instructions] = input.split('\n\n')

const startPositions = start.split('\n').reverse();
const totalCranes = startPositions[0].split(/ \d /).length;

const cranes: string[][] = [];

while (cranes.length < totalCranes) {
    cranes.push([]);
}

// Ignore the crane count
startPositions.slice(1).forEach((row) => {
    for (let i = 0; i < (row.length/4); i++) {
        const val = row.slice(i * 4, (i * 4) + 4);

        if (val.trim().length == 0) {
            continue;
        }

        cranes[i].push(val.trimStart()[1])
    }
});

const partTwoCranes = cranes.map(crane => Array.from(crane))

instructions.split('\n').forEach(row => {
    const match = row.match(/move (\d+) from (\d+) to (\d+)/);

    if (!match) {
        throw Error(`${row} does not match /move (\\d+) from (\\d+) to (\\d+)/`);
    }

    const amount = Number.parseInt(match[1], 10);
    const from = Number.parseInt(match[2], 10) - 1;
    const to = Number.parseInt(match[3], 10) - 1;

    for(let i=0; i<amount; i++) {
        const toAdd = cranes[from].pop()

        if (toAdd === undefined) {
            throw Error(`Moving crate ${i} from ${from} moved nothing?`);
        }

        cranes[to].push(toAdd);
    }

    partTwoCranes[to].push(...partTwoCranes[from].slice(-amount));
    partTwoCranes[from] = partTwoCranes[from].slice(0, -amount);
})

const partOne = cranes.map(crane => Array.from(crane).pop());
const partTwo = partTwoCranes.map(crane => Array.from(crane).pop());

console.log(`Part 1: ${partOne.join('')}`);
console.log(`Part 2: ${partTwo.join('')}`);
