import getInput from "./util/getInput";

const testInputs = {
    example: `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`,
    big: `R1000`
}

const input = getInput(testInputs, 1);

type Turn = {
    direction: 'Left' | 'Right',
    amount: number
}

const turns = input.split('\n').map((line): Turn => {
    const matches = line.match(/(L|R)(\d+)/)

    if (!matches) {
        throw new Error(`Invalid input line ${line}`);
    }

    return {
        direction: matches[1] == 'L' ? 'Left' : 'Right',
        amount: Number.parseInt(matches[2], 10)
    }
});

function part1(turns: Turn[]): number {
    let position = 50;
    let counts = 0;

    for (const turn of turns) {
        if (turn.direction == 'Left') {
            position -= turn.amount;
        } else {
            position += turn.amount;
        }

        position = (position + 100) % 100;

        if (position == 0) {
            counts++
        }
    }

    return counts;
}

function part2(turns: Turn[]): number {
    let position = 50;
    let counts = 0;

    for (const turn of turns) {
        for (let x = 0; x < turn.amount; x++) {
            if (turn.direction == 'Left') {
                position--;
            } else {
                position++;
            }

            position = (position + 100) % 100;

            if (position == 0) {
                counts++
            }
        }
    }

    return counts;
}

console.log(`Part 1: ${part1(turns)}`);
console.log(`Part 2: ${part2(turns)}`);
