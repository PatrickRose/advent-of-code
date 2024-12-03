import getInput from "./util/getInput";
import {mappedAccumulator} from "../util/accumulator";

const testInputs = {
    example: 'xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))',
    part2: 'xmul(2,4)&mul[3,7]!^don\'t()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))'
}

const input = getInput(testInputs, 3);

const matches = input.match(/mul\(\d+,\d+\)|do\(\)|don't\(\)/g);

if (!matches) {
    throw new Error('No multiplication found');
}

const part1 = mappedAccumulator(matches, (val) => {
    if (val == 'do()' || val=='don\'t()') {
        return 0;
    }

    const matches = val.match(/\d+/g);

    if (!matches) {
        throw new Error(`${val} is invalid`);
    }

    const [l,r] = matches.map(val => Number.parseInt(val, 10));

    return l*r;
});

console.log(`Part 1: ${part1}`);

let enabled = true;

const part2 = mappedAccumulator(matches, (val) => {
    if (val == 'do()' || val=='don\'t()') {
        enabled = val == 'do()';
        return 0;
    }

    if (!enabled) {
        return 0;
    }

    const matches = val.match(/\d+/g);

    if (!matches) {
        throw new Error(`${val} is invalid`);
    }

    const [l,r] = matches.map(val => Number.parseInt(val, 10));

    return l*r;
});

console.log(`Part 2: ${part2}`);
