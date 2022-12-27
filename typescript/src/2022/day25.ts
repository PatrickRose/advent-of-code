import getInput from "./util/getInput";

const sampleInput = `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`;

const input = getInput(25);

type SnafuDigit = '0' | '1' | '2' | '-' | '=';

const SNAFU_MAP: {[key in SnafuDigit]: number} = {
    0: 0,
    1: 1,
    2: 2,
    '-': -1,
    '=': -2
}

function isSnafuDigit(x: unknown): x is SnafuDigit {
    if (typeof x !== "string") {
        return false;
    }

    return Object.keys(SNAFU_MAP).includes(x)
}

function snafuToNumber(input: string): number {
    let toReturn = 0;

    input.split('').forEach(
        char => {
            toReturn *= 5;

            if (!isSnafuDigit(char)) {
                throw Error('Type check');
            }

            toReturn += SNAFU_MAP[char];
        }
    )

    return toReturn;
}

function numberToSnafu(input: number): string {
    // Build the snafu up in reverse
    const parts: SnafuDigit[] = [];

    while (input > 0) {
        const value = input % 5;
        const carry = value > 2;

        switch (value) {
            case 0:
                parts.push('0');
                break;
            case 1:
                parts.push('1');
                break;
            case 2:
                parts.push('2');
                break;
            case 3:
                parts.push('=');
                break;
            case 4:
                parts.push('-');
                break;
        }

        input = Math.floor(input / 5);

        if (carry) {
            input++;
        }
    }

    return parts.reverse().join('');
}

const sum = input.split('\n').map(val => snafuToNumber(val)).reduce(
    (previousValue, currentValue) => previousValue + currentValue
);

console.log(`Part 1: ${(numberToSnafu(sum))}`);
