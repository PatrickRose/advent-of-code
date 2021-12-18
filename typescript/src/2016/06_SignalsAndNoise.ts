import getInput from "./util/getInput";

const input = getInput(6);

const counts: { char: string, count: number }[][] = [];

input.split('\n').forEach(row => {
    for (let i = 0; i < row.length; i++) {
        while (counts[i] === undefined) {
            counts.push([]);
        }
        const count = counts[i];

        const thisCharCount = count.find(
            val => val.char == row[i]
        );

        if (!thisCharCount) {
            count.push({char: row[i], count: 1});
        } else {
            thisCharCount.count++
        }
    }
});

counts.forEach(value => value.sort((a, b) => b.count - a.count));

const part1 = counts.map(value => value[0].char).join('');
const part2 = counts.map(value => value[value.length - 1].char).join('');

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);

