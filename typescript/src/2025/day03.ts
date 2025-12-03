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

type CacheKey = `${string},${number},${number}`

const cache = new Map<CacheKey, number>;

function getMaxTurnOns(battery: string, digitsNeeded: number, currentPosition: number = 0): number | null {
    if (digitsNeeded <= 0) {
        throw new Error('Must need at least one digit');
    }

    const subString = battery.substring(currentPosition);

    if (subString.length < digitsNeeded) {
        return null
    }

    if (subString.length == digitsNeeded) {
        return Number.parseInt(subString, 10);
    }

    const cacheKey: CacheKey = `${battery},${digitsNeeded},${currentPosition}`;

    return getValueFromCache(
        cacheKey,
        () => {

            if (digitsNeeded === 1) {
                return Math.max(...[...subString].map((val) => Number.parseInt(val, 10)));
            }

            let max = 0;

            for (let x = currentPosition; x < battery.length; x++) {
                for (let y = x + 1; y < battery.length; y++) {
                    const inner = getMaxTurnOns(battery, digitsNeeded - 1, y);

                    if (inner === null) {
                        continue;
                    }

                    const val = Number.parseInt(`${battery[x]}${inner}`, 10);

                    if (val > max) {
                        max = val;
                    }
                }
            }

            return max;
        },
        cache
    )
}

const part1 = mappedAccumulator(batteries, (battery) => {
    const val = getMaxTurnOns(battery, 2);

    if (val == null) {
        throw new Error('Should not happen')
    }

    return val;
});

console.log(`Part 1: ${part1}`);

const part2 = mappedAccumulator(batteries, (battery, index) => {
    const val = getMaxTurnOns(battery, 12);

    if (val == null) {
        throw new Error('Should not happen')
    }
    return val;
});

console.log(`Part 2: ${part2}`);
