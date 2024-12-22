import getInput from "./util/getInput";
import {mappedAccumulator} from "../util/accumulator";

const testInputs = {
    example: `1
10
100
2024`,
    example2: `1
2
3
2024`,
    123: `123`
}

const input = getInput(testInputs, 22);

const secrets = input.split('\n').map(val => BigInt(Number.parseInt(val, 10)));

function getNextNumber(val: bigint): bigint {
    let secretNumber = val;
    const multiply = val * 64n;
    secretNumber = multiply ^ secretNumber;
    secretNumber = secretNumber % 16777216n;

    const divide = secretNumber / 32n;
    secretNumber = divide ^ secretNumber;
    secretNumber = secretNumber % 16777216n;

    const multiply2024 = secretNumber * 2048n;
    secretNumber = multiply2024 ^ secretNumber;
    secretNumber = secretNumber % 16777216n;

    return secretNumber;
}

const secretHistory: bigint[][] = secrets.map(val => {
    const toReturn = [val];
    let answer = val;
    for (let i=0; i< (input==`123` ? 10 : 2000); i++) {
        answer = getNextNumber(answer);
        toReturn.push(answer);
    }

    return toReturn;
});

console.log(`Part 1: ${mappedAccumulator(secretHistory, (val) => Number(val[1999]))}`);

const answerMap: Map<string, number> = new Map;

secretHistory.forEach(history => {
    const toReturn: Set<string> = new Set;

    for (let i = 4; i<history.length; i++) {
        const parts: number[] = [];
        for (let j=3; j>=0; j--) {
            const prev = Number(history[i-j-1] % 10n);
            const curr =  Number(history[i-j] % 10n);
            parts.push(curr - prev);
        }

        const key = parts.join(',');

        if (!toReturn.has(key)) {
            toReturn.add(key);

            const answerMapVal = answerMap.get(key) ?? 0;
            answerMap.set(key, answerMapVal + Number(history[i] % 10n));
        }
    }
});

console.log(`Part 2: ${Math.max(...answerMap.values())}`);
