import getInput from "./util/getInput";

const input = getInput(13);
//
// const input = `939
// 67,7,x,59,61`

const earliestTimestamp = Number(input.split("\n")[0]);

if (isNaN(earliestTimestamp)) {
    throw new Error(`${input} doesn't start with a number`);
}

const ids = input.split("\n")[1].split(',');
type Closest = {
    id: number,
    waitTime: number
};

type Offset = {
    id: number,
    offset: number
};

let closest: Closest = {
    id: Infinity,
    waitTime: Infinity
};

let offsets: Array<Offset> = [];

ids.forEach((id, index) => {
    if (id === 'x') {
        return;
    }

    const idAsNum = Number(id);

    if (isNaN(idAsNum)) {
        throw new Error(`Got ${id} which isn't a number`)
    }

    offsets.push({
        id: idAsNum,
        offset: index == 0 ? 0 : -index
    });

    const newClosest: Closest = {
        id: idAsNum,
        waitTime: idAsNum - (earliestTimestamp % idAsNum)
    }

    if (closest.waitTime > newClosest.waitTime) {
        closest = newClosest;
    }
});

console.log(`Part 1: ${closest.waitTime * closest.id}`);

function findModularInverse(a: bigint, modulo: bigint): bigint {
    let currVal = a % modulo;
    let multiplication = 1n;

    while (currVal != 1n) {
        currVal = (currVal + a) % modulo;
        multiplication += 1n;
    }

    return multiplication;
}

const totalMax = offsets.reduce(
    (previousValue, val): bigint => {
        return previousValue * BigInt(val.id)
    },
    1n
);

const solutions: Array<bigint> = offsets.map(
    (offset): bigint => {
        const modulo = BigInt(offset.id);
        const totalInverse = BigInt(totalMax) / modulo;

        // Then we can find the multiplicative inverse of that
        const inverse = findModularInverse(totalInverse % modulo, modulo)

        return BigInt(BigInt(offset.offset) * inverse * totalInverse) % totalMax;
    }
);

const solution = solutions.reduce((prev, thisVal) => {
    return (totalMax + ((prev + thisVal) % totalMax)) % totalMax
}, 0n);

console.log(`Part 2: ${solution} (mod ${totalMax})`);
