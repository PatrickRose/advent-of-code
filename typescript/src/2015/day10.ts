import getInput from "./util/getInput";

const testInputs = {
    example: '1'
}

const input = getInput(testInputs, 10);

const numIterations = input == '1' ? 5 : 40;

let answer = input;

function lookAndSay(word: string): string {
    return word.replaceAll(
        /(.)\1*/g,
        (match) => `${match.length}${match[0]}`
    )
}

for (let i = 0; i < numIterations; i++) {
    answer = lookAndSay(answer);
}

console.log(`Part 1: ${answer.length}`);

for (let i = 0; i<10; i++) {
    answer = lookAndSay(answer);
}

console.log(`Part 2: ${answer.length}`);
