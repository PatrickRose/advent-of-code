import getInput from "./util/getInput";

const input = getInput(9)

const program: Array<number> = input.split("\n").map(
    s => Number(s)
);

const preambleLength = 25;

function numberInSums(number: number, numbers: Array<number>): boolean {
    return numbers.some(
        (val, index, allVals): boolean => {
            return allVals.slice(index + 1).some(
                (secondVal): boolean => {
                    return val + secondVal == number;
                }
            );
        }
    )
}

let part1: [number, number] | undefined = undefined;

program.some(
    (_, index, allVals): boolean => {
        const validBaseVals = allVals.slice(index, index + preambleLength);
        const valToCheck = allVals[index + preambleLength];

        if (!numberInSums(valToCheck, validBaseVals)) {
            part1 = [index + preambleLength, valToCheck];
            console.log(`Part 1: ${valToCheck}`);
            return true;
        }

        return false;
    }
)

if (part1 === undefined) {
    console.log(`Didn't get an answer for part one?`);
    process.exit(1);
}

const upToIndex = part1[0];
const sumSearch = part1[1];

program.slice(0, upToIndex).some(
    (val, index, allVals): boolean => {
        let currValue = val + allVals[index + 1];
        let nextIndex = index + 1;

        while (currValue < sumSearch) {
            nextIndex++;

            currValue += allVals[nextIndex];
        }

        if (currValue == sumSearch) {
            const contiguousSet = allVals.slice(
                index,
                nextIndex
            );

            console.log(`Part 2: ${Math.min(...contiguousSet) + Math.max(...contiguousSet)}`);

            return true;
        }

        return false;
    }
)
