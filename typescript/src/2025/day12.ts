import getInput from "./util/getInput";
import {accumulator, mappedAccumulator} from "../util/accumulator";

const testInputs = {}

const input = getInput(testInputs, 12);

const split = input.split('\n\n');

const testDef = split.pop();

if (testDef === undefined) {
    throw new Error('No tests');
}

const presentDef = [...split];

const presents = presentDef.map(
    (val) => {
        const regionDef = val.split('\n').slice(1);

        return mappedAccumulator(regionDef, (row) => {
            return row.split('').filter(val => '#').length
        })
    });

type Region = {
    width: number,
    height: number,
    required: number[]
}

const regions: Region[] = testDef.split('\n')
    .map((line) => {
        const match = line.match(/^(\d+)x(\d+): ((\d+ ?)+)$/);

        if (!match) {
            throw new Error(`${line} is not valid`);
        }

        return {
            width: Number.parseInt(match[1], 10),
            height: Number.parseInt(match[2], 10),
            required: match[3].split(' ').map(val => Number.parseInt(val, 10)),
        }
    });

const valid = regions.filter(({width,height,required}) => {
    const regionSize = width * height;

    const numberOf3x3s = Math.floor(width / 3) * Math.floor(height / 3)

    const numberOfPresentSquares = mappedAccumulator(required, (val, index) => presents[index] * val);

    if (regionSize < numberOfPresentSquares) {
        // There's no chance that we can fit this area
        return false;
    }

    return accumulator(required) <= numberOf3x3s;
})

console.log(`Part 1: ${valid.length}`);
