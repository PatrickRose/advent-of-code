import getInput from "./util/getInput";

const input = getInput(25);`5764801
17807724`;

const cardPublic = Number(input.split("\n")[0]);
const doorPublic = Number(input.split("\n")[1]);

function findLoopSize(publicKey: number, subject: number): number {
    let curr = 1;
    let loop = 0;

    while (curr != publicKey) {
        curr = (curr * subject) % 20201227;
        loop++;
    }

    return loop;
}

const cardLoop = findLoopSize(cardPublic, 7);
const doorLoop = findLoopSize(doorPublic, 7);

function performLoop(loopSize: number, subject: number) {
    let curr = 1;

    for(let i=0; i < loopSize; i++) {
        curr = (curr * subject) % 20201227;
    }

    return curr;
}

const cardEncryption = performLoop(cardLoop, doorPublic);
const doorEncryption = performLoop(doorLoop, cardPublic);

if (cardEncryption != doorEncryption) {
    throw new Error(`Encryption key didn't match! Got ${cardEncryption} and ${doorEncryption}`);
}

console.log(`Part 1: ${cardEncryption}`);
