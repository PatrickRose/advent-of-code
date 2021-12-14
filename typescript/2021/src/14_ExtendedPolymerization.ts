import getInput from "./util/getInput";

const exampleInput = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;

const realInput = getInput(14);

const input = realInput;

const split = input.split('\n\n');

const polymerTemplate = split[0];

const ruleMap = new Map<string, string>();

split[1].split("\n").forEach(
    row => {
        const [from, to] = row.split(' -> ');
        ruleMap.set(from, to);
    }
)

const charCounts = new Map<string, number>();

polymerTemplate.split('').forEach(char => {
    const valToSet = charCounts.get(char) ?? 0;
    charCounts.set(char, valToSet + 1);
});

let pairCounts = new Map<string, number>();

polymerTemplate.split('').forEach(
    (char, index) => {
        if (index == polymerTemplate.length - 1) {
            return;
        }

        const toGet = char + polymerTemplate[index + 1];

        const valToSet = pairCounts.get(toGet) ?? 0;

        pairCounts.set(toGet, valToSet + 1)
    }
)

function calculateAnswer(charCounts: Map<string, number>): number {
    const entries = Array.from(charCounts.values());
    entries.sort(((a, b) => a - b));

    return entries[entries.length - 1] - entries[0];
}

console.log(charCounts);

for (let day = 1; day <= 40; day++) {
    const newPairCounts: typeof pairCounts = new Map<string, number>();

    Array.from(pairCounts.entries()).forEach(
        ([key, number]) => {
            const newVal = ruleMap.get(key);

            if (newVal === undefined) {
                throw new Error(`${key} does not have a matching rule`);
            }

            const [first, second] = key.split('');

            [first + newVal, newVal + second].forEach(
                newPair => {
                    const valToSet = newPairCounts.get(newPair) ?? 0;

                    newPairCounts.set(newPair, valToSet + number)
                }
            );

            const valToSet = charCounts.get(newVal) ?? 0;

            charCounts.set(newVal, valToSet + number)
        }
    );

    pairCounts = newPairCounts;

    if (day == 10) {
        console.log(`Part 1: ${calculateAnswer(charCounts)}`);
    }
}
console.log(`Part 2: ${calculateAnswer(charCounts)}`);

