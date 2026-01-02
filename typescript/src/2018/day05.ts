import getInput from "./util/getInput";

const testInputs = {
    aA: 'aA',
    abBA: 'abBA',
    abAB: 'abAB',
    aabAAB: 'aabAAB',
    example: 'dabAcCaCBAcCcaDA'
}

const input = getInput(testInputs, 5);

function performReaction(input: string): number {
    let removed: boolean;
    do {
        removed = false;

        for (let i = 0; i < 26; i++) {
            for (const toReplace of [String.fromCharCode(65 + i, 65 + 32 + i), String.fromCharCode(65 + 32 + i, 65 + i)]) {
                if (input.includes(toReplace)) {
                    input = input.replaceAll(toReplace, '');
                    removed = true;
                }
            }
        }
    } while (removed)

    return input.length;
}

console.log(`Part 1: ${performReaction(input)}`);

let min = Infinity;
for (let i = 0; i < 26; i++) {
    const upperCase = String.fromCharCode(65 + i);
    const lowerCase = upperCase.toLowerCase();
    const toTry = input.replaceAll(upperCase, '')
        .replaceAll(lowerCase, '');

    min = Math.min(min, performReaction(toTry));
}

console.log(`Part 2: ${min}`);
