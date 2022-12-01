import getInput from "./util/getInput";

const input = getInput(1);

const elves: number[][] = input.split('\n\n').map(
    elf => elf.split('\n').map(
        val => Number.parseInt(val, 10)
    )
);

const elfCarry = elves.map(
    elf => elf.reduce((previousValue, currentValue) => previousValue + currentValue, 0)
)
elfCarry.sort((a, b) => b - a);

console.log(`Part 1: ${elfCarry[0]}`);
console.log(`Part 2: ${elfCarry.slice(0, 3).reduce((previousValue, currentValue) => previousValue + currentValue)}`)
