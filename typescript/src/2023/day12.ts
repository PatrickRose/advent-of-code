import getInput from "./util/getInput";
import parseInt from "../util/parseInt";

const testInputs = {
    exampleNoUnknown: `#.#.### 1,1,3
.#...#....###. 1,1,3
.#.###.#.###### 1,3,1,6
####.#...#... 4,1,1
#....######..#####. 1,6,5
.###.##....# 3,2,1`,
    exampleUnknown: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
    singleUnknownExample: `.??..??...?##. 1,1,3`,
    partOneTenArrangement: `?###???????? 3,2,1`
}

const input = getInput(testInputs, 12);

type SpringInfo = { springData: string, springValues: readonly number[] };
const rows: SpringInfo[] = input.split('\n').map(row => {
    const [springInfo, springValues] = row.split(' ');

    return {
        springData: springInfo,
        springValues: springValues.split(',').map(val => parseInt(val))
    }
})

const cacheMap: Map<string, bigint> = new Map();

function countPossibleRows({springData, springValues}: SpringInfo): bigint {
    const cacheKey = `${springData}!${springValues.join(',')}`;
    const cacheValue = cacheMap.get(cacheKey);

    if (cacheValue !== undefined) {
        return cacheValue;
    }

    const newValue: bigint = (function (): bigint {
        if (springValues.length == 0) {
            return springData.includes('#') ? 0n : 1n;
        }

        const nextChar = springData[0];
        const nextGroup = springValues[0];

        if (nextChar == '#') {
            const thisGroup = springData.slice(0, nextGroup).replace('?', '#');

            if (thisGroup.includes('.')) {
                return 0n;
            }

            if (thisGroup.length < nextGroup) {
                return 0n;
            }

            if (springData.length == nextGroup) {
                return springValues.length == 1 ? 1n : 0n;
            }

            return springData[nextGroup] == '#'
                ? 0n
                : countPossibleRows({
                    springData: springData.slice(nextGroup + 1),
                    springValues: springValues.slice(1)
                });
        }

        if (nextChar == '.') {
            return countPossibleRows({
                springData: springData.slice(1),
                springValues: springValues
            })
        }

        if (nextChar == '?') {
            return countPossibleRows({
                springData: '.' +springData.slice(1),
                springValues: springValues
            }) + countPossibleRows({
                springData: '#' +springData.slice(1),
                springValues: springValues
            })
        }

        return 0n;
    })()

    cacheMap.set(cacheKey, newValue);

    return newValue;
}

const part1 = rows.map(countPossibleRows);
console.log(`Part 1: ${part1.reduce((prev, curr) => prev + curr)}`);

const part2Rows: SpringInfo[] = rows.map(({springValues, springData}) => {
    const newSpringValues: number[] = [];
    newSpringValues.push(...springValues, ...springValues, ...springValues, ...springValues, ...springValues);
    return {
        springData: new Array(5).fill(springData).join('?'),
        springValues: newSpringValues
    }
})

const part2 = part2Rows.map(countPossibleRows);

console.log(`Part 2: ${part2.reduce((prev, curr) => prev + curr, 0n)}`);
