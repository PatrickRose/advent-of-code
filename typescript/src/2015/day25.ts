import getInput from "./util/getInput";

const testInputs = {}

const input = getInput(testInputs, 25);

const parts = input.match(/\D+(\d+)\D+(\d+)/);

if (parts == null) {
    throw new Error('Invalid input');
}

const y = Number.parseInt(parts[1], 10);
const x = Number.parseInt(parts[2], 10);

let val = 20151125;
let xPos = 1;
let yPos = 1;

while (xPos != x || yPos != y) {
    if (yPos == 1) {
        yPos = xPos + 1;
        xPos = 1;
    } else {
        yPos--;
        xPos++;
    }

    val = (val * 252533) % 33554393;
}

console.log(`Part 1: ${val}`)
