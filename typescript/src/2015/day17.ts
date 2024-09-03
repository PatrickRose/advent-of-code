import getInput from "./util/getInput";

const testInputs = {
    example: `20
15
10
5
5`
}

const input = getInput(testInputs, 17);

const litersToMove = input == testInputs.example ? 25 : 150;

const buckets = input.split('\n').map(val => Number.parseInt(val, 10));

function countLiters(buckets: number[], usedBuckets: number[] = [], currentAmount: number = 0, amounts: Record<number, number[][]> = {}): Record<number, number[][]> {
    buckets.forEach((amount, key) => {
        const newAmount = currentAmount + amount;
        const newBuckets = buckets.slice(key + 1);
        const newUsedBuckets = [...usedBuckets, amount];

        if (amounts[newAmount] === undefined) {
            amounts[newAmount] = [];
        }

        amounts[newAmount].push(newUsedBuckets);

        if (newAmount > litersToMove) {
            return;
        }

        amounts = countLiters(newBuckets, newUsedBuckets, newAmount, amounts)
    })

    return amounts;
}

const mappings = countLiters(buckets);

const combinations = mappings[litersToMove];

combinations.sort((a, b) => a.length - b.length);
const minNumber = combinations[0].length;

console.log(`Part 1: ${combinations.length}`)
console.log(`Part 2: ${combinations.filter(val=>val.length == minNumber).length}`)
