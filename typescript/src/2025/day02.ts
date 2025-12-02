import getInput from "./util/getInput";
import {mappedAccumulator} from "../util/accumulator";

const testInputs = {
    example: `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`
}

const input = getInput(testInputs, 2);

const ranges: [number, number][] = input.split(',').map(
    val => {
        const parts = val.split('-');

        if (parts.length !== 2) {
            throw new Error(`Invalid range ${val}`);
        }

        const nums = parts.map(Number);

        return [nums[0], nums[1]];
    }
)

const part1 = mappedAccumulator(ranges, ([first, second]) => {
    let count = 0;
    for(let x = first; x <= second; x++) {
        if (`${x}`.match(/^(\d+)\1$/) !== null) {
            count += x;
        }
    }

    return count;
});

console.log(`Part 1: ${part1}`);

function isInvalidPart2(input: number): boolean {
    const str = `${input}`;

    for(let x=1; x <= str.length / 2; x++) {
        const subStr = str.substring(0, x);

        if (str.replaceAll(subStr, '').length === 0) {
            return true;
        }
    }

    return false;
}

const part2 = mappedAccumulator(ranges, ([first, second]) => {
    let count = 0;
    for(let x = first; x <= second; x++) {
        if (isInvalidPart2(x)) {
            count += x;
        }
    }

    return count;
});

console.log(`Part 2: ${part2}`);
