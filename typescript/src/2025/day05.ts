import getInput from "./util/getInput";
import {mappedAccumulator} from "../util/accumulator";

const testInputs = {
    example: `3-5
10-14
16-20
12-18

1
5
8
11
17
32`,
    overlappingMin: `2-10
1-15

1`,
}

const input = getInput(testInputs, 5);

const [rangeDefs, idDef] = input.split('\n\n');

const ranges: [number, number][] = rangeDefs.split('\n').map(
    row => {
        const val = row.split('-');

        if (val.length != 2) {
            throw new Error(`Invalid line ${row}`)
        }

        const nums = val.map(val => Number.parseInt(val, 10))

        return [nums[0], nums[1]];
    }
);

const ids = idDef.split('\n');

const part1 = ids.filter(id => {
    const num = Number.parseInt(id, 10);

    return ranges.some(([min,max]) => {
        return num >= min && num <= max;
    })
});

console.log(`Part 1: ${part1.length}`);

const normalisedRanges: [number, number][] = [];

let range = ranges.pop()

while (range) {
    const [min, max] = range;
    const rangesToAdd: [number, number][] = [];

    for (const normalised of normalisedRanges) {
        const [normMin, normMax] = normalised;

        if (
            // If this starts and ends before this normalised range, check the next
            max < normMin
            // If this starts and ends after this normalised range, check the next
            || min > normMax) {
            continue;
        }

        // Otherwise, we need the bit that happens before
        if (min < normMin) {
            rangesToAdd.push([min, normMin-1]);
        }

        // Then we need the bit that happens after
        if (max >= normMax) {
            rangesToAdd.push([normMax + 1, max]);
        }

        // Always add an invalid range, which prevents us treating this as a normalised range
        rangesToAdd.push([normMin, normMin - 1]);
        break;
    }

    if (rangesToAdd.length > 0) {
        ranges.push(...rangesToAdd.filter(([min, max]) => min <= max));
    } else {
        normalisedRanges.push([min, max]);
    }

    range = ranges.pop();
}

const part2 = mappedAccumulator(normalisedRanges, ([min,max]) => max - min + 1);

console.log(`Part 2: ${part2}`);
