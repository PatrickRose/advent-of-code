import getInput from "./util/getInput";

const sampleInput = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

const input = getInput(3);

function getSharedContent(backpack: string): string {
    const [first, second] = [
        backpack.slice(0, backpack.length / 2),
        backpack.slice(backpack.length / 2)
    ];

    for (let char of first) {
        if (second.includes(char)) {
            return char
        }
    }

    throw new Error(`${backpack} had no shared content`);
}

const backpacks = input.split('\n');

const shared = backpacks.map(getSharedContent);

function reducer(prev: number, char: string): number {
    const charCodeAt = char.charCodeAt(0);

    if (charCodeAt >= 97) {
        return prev + charCodeAt - 96;
    }

    return prev + charCodeAt - 64 + 26;
};

const part1 = shared.reduce(
    reducer,
    0
);

console.log(`Part 1: ${part1}`);

const sharedForPartTwo: string[] = [];

for (let i = 0; i < backpacks.length; i += 3) {
    const group = backpacks.slice(i, i + 3);

    for (let char of group[0]) {
        if (group[1].includes(char) && group[2].includes(char)) {
            sharedForPartTwo.push(char);
            break;
        }
    }
}

const partTwo = sharedForPartTwo.reduce(reducer, 0);

console.log(`Part 2: ${partTwo}`);
