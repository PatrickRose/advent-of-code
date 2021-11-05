import getInput from "./util/getInput";

const input = getInput(9).replace(/\s/g, '');

const REGEX = /\((\d+)x(\d+)\)/;

function getLength(input: string, recurse: boolean = false): bigint {
    let answer = 0n;

    while (input.length > 0) {
        if (input[0] != '(') {
            const position = input.search(/\(/);
            if (position >= 0) {
                input = input.slice(position);
                answer += BigInt(position);
            } else {
                answer += BigInt(input.length);
                input = '';
            }
        }
        else {
            const match = input.match(REGEX);

            if (!match) {
                // Then we haven't got a full thing so just assume we should return the length
                answer += BigInt(input.length);
                input = '';
                continue;
            }

            // If we *did* get a match, then we need to count those chars
            const [numChars, repeat] = [match[1], match[2]].map(val => Number.parseInt(val, 10));

            if (recurse) {
                answer += (BigInt(repeat) * getLength(input.replace(REGEX, '').slice(0, numChars), true));
            }
            else {
                answer += BigInt(numChars * repeat);
            }

            input = input.replace(REGEX, '').slice(numChars);
        }
    }

    return answer;
}

console.log(`Part 1: ${getLength(input)}`);
console.log(`Part 2: ${getLength(input, true)}`);
