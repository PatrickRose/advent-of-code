import getInput from "./util/getInput";

const testInputs = {
    example: `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`
}

const input = getInput(testInputs, 8);

const positions = input.split('\n').map(
    (line) =>
        line.split(',').map(
            val => Number.parseInt(val, 10)
        )
);

const allJoins: [number[], number[]][] = [];
for (let i =0; i< positions.length; ++i) {
    for (let j = i+1; j < positions.length; ++j) {
        allJoins.push([positions[i], positions[j]])
    }
}

function calculateDistance(first: number[], second: number[]): number {
    return Math.sqrt(
        (first[0] - second[0]) ** 2
        + (first[1] - second[1]) ** 2
        + (first[2] - second[2]) ** 2
    )
}

allJoins.sort((a,b) => {
    return calculateDistance(a[0], a[1]) - calculateDistance(b[0], b[1]);
})

const circuits: Set<string>[] = input.split('\n').map(val => {
    const set = new Set<string>();
    set.add(val);

    return set;
});

const numToJoin = input == testInputs.example ? 10 : 1000;

for (let joinNum = 0; joinNum < numToJoin; joinNum++) {
    let join: [number[], number[]] = allJoins[joinNum];

    const [first, second] = join;

    const firstStr = first.join(',');
    const secondStr = second.join(',');

    const firstInCircuit = circuits.find((val) => val.has(firstStr));

    const secondInCircuit = circuits.find((val) => val.has(secondStr));

    if (!firstInCircuit || !secondInCircuit) {
        throw new Error('Values are not in any circuits!?');
    }

    if (firstInCircuit.has(secondStr)) {
        // They're already linked
        continue;
    }

    for (let val of secondInCircuit) {
        firstInCircuit.add(val);
    }

    secondInCircuit.clear()
}

const sizes = circuits.map(val => val.size);
sizes.sort((a, b) => b - a);

const part1 = sizes.slice(0, 3).reduce((val,prev) => val*prev, 1);

console.log(`Part 1: ${part1}`);

let joinNum = numToJoin;
let lastJoin: [number[], number[]]| null = null;

while (circuits.filter(val => val.size > 0).length > 1) {
    joinNum++;

    const [first, second] = allJoins[joinNum];
    lastJoin = allJoins[joinNum];

    const firstStr = first.join(',');
    const secondStr = second.join(',');

    const firstInCircuit = circuits.find((val) => val.has(firstStr));

    const secondInCircuit = circuits.find((val) => val.has(secondStr));

    if (!firstInCircuit || !secondInCircuit) {
        throw new Error('Values are not in any circuits!?');
    }

    if (firstInCircuit.has(secondStr)) {
        // They're already linked
        continue;
    }

    for (let val of secondInCircuit) {
        firstInCircuit.add(val);
    }

    secondInCircuit.clear();
}

if (lastJoin === null) {
    throw new Error('Did not do another join?');
}

console.log(`Part 2: ${lastJoin[0][0] * lastJoin[1][0]}`);
