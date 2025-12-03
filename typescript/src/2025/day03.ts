import getInput from "./util/getInput";
import {mappedAccumulator} from "../util/accumulator";
import {getValueFromCache} from "../util/cache";

const testInputs = {
    example: `987654321111111
811111111111119
234234234234278
818181911112111`
}

const input = getInput(testInputs, 3);

const batteries: string[] = input.split('\n');

function getMaxTurnOns(battery: string, digitsNeeded: number, currentPosition: number = 0): number {
    if (digitsNeeded <= 0) {
        throw new Error('Must need at least one digit');
    }

    if (digitsNeeded === 1) {
        return Math.max(...[...battery.substring(currentPosition)].map((val) => Number.parseInt(val, 10)));
    }

    let max = 0;

    for (let x = currentPosition; x < battery.length; x++) {
        for (let y = x+1; y < battery.length; y++) {
            const inner = getMaxTurnOns(battery, digitsNeeded - 1, y);
            const val = Number.parseInt(`${battery[x]}${inner}`, 10);

            if (val > max) {
                max = val;
            }
        }
    }

    return max;
}

const part1 = mappedAccumulator(batteries, (battery) => getMaxTurnOns(battery, 2));

console.log(`Part 1: ${part1}`);

const part2 = mappedAccumulator(batteries, (battery) => getMaxTurnOns(battery, 12));

console.log(`Part 2: ${part2}`);
