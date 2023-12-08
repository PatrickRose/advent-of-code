import getInput from "./util/getInput";
import parseInt from "../util/parseInt";

const testInputs = {
    example: `Alice would gain 54 happiness units by sitting next to Bob.
Alice would lose 79 happiness units by sitting next to Carol.
Alice would lose 2 happiness units by sitting next to David.
Bob would gain 83 happiness units by sitting next to Alice.
Bob would lose 7 happiness units by sitting next to Carol.
Bob would lose 63 happiness units by sitting next to David.
Carol would lose 62 happiness units by sitting next to Alice.
Carol would gain 60 happiness units by sitting next to Bob.
Carol would gain 55 happiness units by sitting next to David.
David would gain 46 happiness units by sitting next to Alice.
David would lose 7 happiness units by sitting next to Bob.
David would gain 41 happiness units by sitting next to Carol.`
}

const input = getInput(testInputs, 13);

const names: Set<string> = new Set();

const happinessMap: Map<string, Map<string, number>> = new Map();

function setMap(name: string, partner: string, amount: number) {
    let map = happinessMap.get(name);

    if (!map) {
        map = new Map();
        happinessMap.set(name, map);
    }

    map.set(partner, amount);
}

input.split('\n').forEach(row => {
    const regex = row.match(/(.+) would (gain|lose) (\d+) happiness units by sitting next to (.+)\./);

    if (regex === null) {
        throw new Error(`${row} is not valid`)
    }

    const [_, name, gain, amountStr, partner] = regex;

    names.add(name);
    names.add(partner);

    const amount = parseInt(amountStr) * (gain == 'gain' ? 1 : -1);

    setMap(name, partner, amount);
})

function generateSeatings(existingSeating: string[]): string[][] {
    const possibleSeatings: string[][] = [];

    names.forEach(val => {
        if (!existingSeating.includes(val)) {
            possibleSeatings.push(...generateSeatings([...existingSeating, val]));
        }
    })

    return possibleSeatings.length > 0
        ? possibleSeatings
        : [existingSeating];
}

const possibleSeatings: string[][] = generateSeatings([]);

function scoreSeating(seating: string[]): number {
    return seating.reduce(
        (previousValue, currentValue, index, array) => {
            const toTheRight = array[(index + 1) % array.length];
            const toTheLeft = array[(index + array.length - 1) % array.length];

            const innerMap = happinessMap.get(currentValue);

            return previousValue + (innerMap?.get(toTheRight) ?? 0) + (innerMap?.get(toTheLeft) ?? 0)
        },
        0
    )
}

const part1 = Math.max(...possibleSeatings.map(scoreSeating));

console.log(`Part 1: ${part1}`)

names.add('ME');

const part2 = generateSeatings([])
    .map(scoreSeating)
    // Use reduce, because otherwise we hit a callstack error
    .reduce((prev, curr) => Math.max(prev, curr));

console.log(`Part 2: ${part2}`);
