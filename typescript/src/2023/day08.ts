import getInput from "./util/getInput";

const testInputs = {
    firstExample: `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`,
    secondExample: `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`,
    ghostExample: `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`
}

const input = getInput(testInputs, 8);

const map: Map<string, {left: string, right: string}> = new Map();

const [instructions, def] = input.split('\n\n');

def.split('\n').forEach(row => {
    const def = row.match(/(.+) = \((.+), (.+)\)/);

    if (!def) {
        throw new Error(`${row} is not a valid definition`);
    }

    map.set(def[1], {left:def[2], right: def[3]});
});

function movesFromStartToFinish(startPos: string, isEndPosition: (pos: string) => boolean):number {
    let currentPosition = startPos;
    let moves = 0;
    while (!isEndPosition(currentPosition)) {
        const defs = map.get(currentPosition);

        if (!defs) {
            throw new Error(`Got to ${currentPosition} which isn't a real place???`);
        }

        if (instructions[moves % instructions.length] == 'R') {
            currentPosition = defs.right;
        } else {
            currentPosition = defs.left;
        }

        moves++;
    }

    return moves;
}

console.log(`Part 1: ${movesFromStartToFinish('AAA', (val) => val === 'ZZZ')}`);

const keysToCheck = Array.from(map.keys()).filter(val => val[2] == 'A');

const distancesForKeys = keysToCheck.map(val => movesFromStartToFinish(val, (pos) => pos[2] == 'Z'));

function highestCommonFactor(a: number, b:number): number {
    if (b === 0) {
        return a;
    }

    return highestCommonFactor(b, a%b);
}

const part2 = distancesForKeys.reduce((prev, curr) => (prev * curr) / highestCommonFactor(prev, curr));

console.log(`Part 2: ${part2}`);
