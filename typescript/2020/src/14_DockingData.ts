import getInput from "./util/getInput";

const input = getInput(14);

const program = input.split("\n");

const memory: Map<number, bigint> = new Map<number, bigint>();

type Mask = {
    and: bigint,
    plus: bigint
};

let mask: Mask = {and: (2n ** 36n) - 1n, plus: 0n};

function stringToMask(newMask: string): Mask {
    const mask: Mask = {
        and: 0n,
        plus: 0n
    }

    newMask.split('').forEach(
        (char, index) => {
            const toAdd = 2n ** (35n - BigInt(index));

            switch (char) {
                case 'X':
                    mask.and += toAdd;
                    break;
                case '1':
                    mask.plus += toAdd;
                    break;
                case '0':
                    // Don't do anything, we want to overwrite
                    break;
                default:
                    throw new Error(`Unknown char ${char}`);
            }
        }
    )

    return mask;
}

program.forEach((row) => {
    const maskCheck = row.match(/^mask = ([10X]{36})$/);

    if (maskCheck !== null) {
        mask = stringToMask(maskCheck[1]);
        return
    }

    const memCheck = row.match(/^mem\[(\d+)] = (\d+)$/);

    if (memCheck === null) {
        throw new Error(`Unknown row ${row}`);
    }

    memory.set(
        Number(memCheck[1]),
        (BigInt(memCheck[2]) & mask.and) + mask.plus
    )
});

let sum = 0n;

for (const val of memory.values()) {
    sum += val;
}

console.log(`Part 1: ${sum}`)

type PartTwoMask = {
    and: Array<bigint>,
    unset: bigint,
    or: bigint
}

function stringToMask2(newMask: string): PartTwoMask {
    const mask: PartTwoMask = {
        and: [0n],
        or: 0n,
        unset: (2n ** 36n) - 1n,
    }

    newMask.split('').forEach(
        (char, index) => {
            const toAdd = 2n ** (35n - BigInt(index));

            switch (char) {
                case 'X':
                    const newAnd: Array<bigint> = [];

                    mask.and.forEach(val => {
                        if (val != 0n) {
                            newAnd.push(val);
                        }
                        newAnd.push(val + toAdd);
                    });

                    newAnd.push(0n);

                    mask.and = newAnd;
                    mask.unset -= toAdd;

                    break;
                case '1':
                    mask.or += toAdd;
                    break;
                case '0':
                    // Don't do anything, we want to overwrite
                    break;
                default:
                    throw new Error(`Unknown char ${char}`);
            }
        }
    )

    return mask;
}

const memoryPartTwo: Map<bigint, bigint> = new Map<bigint, bigint>();

let maskPartTwo: PartTwoMask = {
    and: [0n],
    or: 0n,
    unset: (2n ** 36n) - 1n,
};

program.forEach(row => {
    const maskCheck = row.match(/^mask = ([10X]{36})$/);

    if (maskCheck !== null) {
        maskPartTwo = stringToMask2(maskCheck[1]);
        return
    }

    const memCheck = row.match(/^mem\[(\d+)] = (\d+)$/);

    if (memCheck === null) {
        throw new Error(`Unknown row ${row}`);
    }

    const toSet = BigInt(memCheck[2]);

    const specifiedMemory = BigInt(memCheck[1]);

    const baseMemory = (specifiedMemory | maskPartTwo.or) & maskPartTwo.unset;

    maskPartTwo.and.forEach(val => {
        const toWrite = val + baseMemory;

        memoryPartTwo.set(toWrite, toSet);
    })
});


sum = 0n;

for (const val of memoryPartTwo.values()) {
    sum += val;
}

console.log(`Part 2: ${sum}`);
