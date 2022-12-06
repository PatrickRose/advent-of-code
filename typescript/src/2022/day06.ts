import getInput from "./util/getInput";

const sampleInput = [
    `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
    `bvwbjplbgvbhsrlpgdmjqwftvncz`,
    `nppdvjthqldpwncqszvftbrmjlhg`,
    `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
    `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
];

const input = getInput(6);

const startCheck: string[] = []

function findStartOfMessage(input: string, length: number): number {
    for (let i = 0; i < input.length; i++) {
        startCheck.push(input[i]);

        if (startCheck.length > length) {
            startCheck.shift()
        }

        if (startCheck.length == length) {
            const set = new Set(startCheck);

            if (set.size == length) {
                return i + 1;
            }
        }
    }

    throw Error('Did not find start')
}

console.log(`Part 1: ${findStartOfMessage(input, 4)}`);
console.log(`Part 2: ${findStartOfMessage(input, 14)}`);
