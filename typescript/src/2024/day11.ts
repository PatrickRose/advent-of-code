import getInput from "./util/getInput";
import {accumulator, mappedAccumulator} from "../util/accumulator";

const testInputs = {
    smallExample: `0 1 10 99 999`,
    longerExample: `125 17`
}

const input = getInput(testInputs, 11);

type Rocks = number[];
const rocks: Rocks = input.split(' ').map(val => Number.parseInt(val, 10));

const blinkCache: Map<number, Rocks> = new Map<number, Rocks>();

function runChange(rock: number): Rocks {
    const result = blinkCache.get(rock);

    if (result !== undefined) {
        return result;
    }

    const newRocks: Rocks = [];

    if (rock == 0) {
        newRocks.push(1);
    } else if (rock.toString(10).length % 2 == 0) {
        const rockStr = rock.toString(10);
        const splitPoint = rockStr.length / 2;
        newRocks.push(...[
            rockStr.slice(0, splitPoint),
            rockStr.slice(splitPoint)
        ].map(val => Number.parseInt(val, 10)))
    } else {
        newRocks.push(rock*2024);
    }

    blinkCache.set(rock, newRocks);

    return newRocks;
}

const countCache: Map<`${number},${number}`, number> = new Map;

function countRocksForBlinks(rock: number, depth: number): number {
    const cache = countCache.get(`${rock},${depth}`);
    if (cache !== undefined) {
        return cache;
    }

    const result = runChange(rock);

    if (depth == 1) {
        return result.length;
    }

    const actualResult = accumulator(result.map((val) => countRocksForBlinks(val, depth-1)));

    countCache.set(`${rock},${depth}`, actualResult);

    return actualResult;
}

const part1 = mappedAccumulator(rocks, (val) => countRocksForBlinks(val, 25));
console.log(`Part 1: ${part1}`);

const part2 = mappedAccumulator(rocks, (val) => countRocksForBlinks(val, 75));
console.log(`Part 2: ${part2}`);

