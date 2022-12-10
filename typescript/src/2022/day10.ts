import getInput from "./util/getInput";

const sampleInput = [
    `noop
addx 3
addx -5`,
    `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`
];

const input = getInput(10);

let count = 0;
let signal = 1;
let clock = 0;

const program = input.split('\n');

const toDraw: ('■'|' ')[] = [];

function incrementClock() {
    clock++;

    if ([20, 60, 100, 140, 180, 220].includes(clock)) {
        count += signal * clock;
    }

    const spritePosition = signal + 1;
    const cursorPosition = clock % 40;

    toDraw.push(spritePosition == cursorPosition || spritePosition == cursorPosition +1 || spritePosition == cursorPosition - 1 ? '■' : ' ');
}

program.forEach((row) => {
    incrementClock();

    const instruction = row.split(' ');

    if (instruction.length > 1) {
        incrementClock();

        signal += Number.parseInt(instruction[1], 10);
    }
})

while (clock < 220) {
    incrementClock();
}

console.log(`Part 1: ${count}`);
const partTwo = toDraw.reduce(
    (prev, val, index) => {
        if ((index) % 40 == 0) {
            prev += '\n'
        }

        prev += val;

        return prev;
    },
    ''
);

console.log(`Part 2: ${partTwo}`);
