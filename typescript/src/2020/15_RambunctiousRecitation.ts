import getInput from "./util/getInput";

const input = getInput(15);

const turnMap: Map<number, Array<number>> = new Map<number, Array<number>>()

let turn = 1;
let lastNumber = NaN;

input.split(',').forEach(val => {
    const num = Number(val);

    if (isNaN(num)) {
        throw new Error(`Starting number ${val} is not a number!`);
    }

    lastNumber = num;
    console.log(`Turn ${turn}: ${lastNumber}`)
    turnMap.set(lastNumber, [turn]);
    turn += 1;
});

while (turn <= 30000000) {
    if (turn == 2021) {
        console.log(`Part 1: ${lastNumber}`);
    }

    const lastSaid = turnMap.get(lastNumber);

    if (lastSaid === undefined) {
        throw new Error('Should never get undefined from the turnMap!');
    } else if (lastSaid.length == 1) {
        //console.log(`Never heard ${lastNumber} before, saying 0`);
        lastNumber = 0;
    } else {
        lastNumber = lastSaid[1] - lastSaid[0];
        //console.log(`Heard ${lastNumber} before (${lastSaid.slice(-2)}), saying ${lastNumber}`);
    }

    if (turn <= 10) {
        console.log(`Turn ${turn}: ${lastNumber}`)
    }

    const origMapVal = turnMap.get(lastNumber);

    if (origMapVal === undefined) {
        turnMap.set(lastNumber, [turn]);
    } else {
        if (origMapVal.length == 1) {
            origMapVal.push(turn);
        } else {
            turnMap.set(lastNumber, [origMapVal[1], turn]);
        }
    }

    turn += 1;
}

console.log(`Part 2: ${lastNumber}`);
