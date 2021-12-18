import getInput from "./util/getInput";

const exampleInput = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`;

const realInput = getInput(10);

const input = realInput;

const lines = input.split('\n');

type Opener = '(' | '{' | '[' | '<';
type Closer = ')' | '}' | ']' | '>';

const opensToCloses: { [T in Opener]: Closer } = {
    '(': ')',
    '{': '}',
    '[': ']',
    '<': '>'
}

const syntaxPoints: { [T in Closer]: number } = {
    ')': 3,
    '}': 1197,
    ']': 57,
    '>': 25137
}

const autoCompletePoints: { [T in Closer]: number } = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4
}

const corrupted: Closer[] = [];
const incompletes: Closer[][] = [];

lines.forEach(row => {
    const stack: Opener[] = [];
    let isCorrupted = false;
    row.split('').forEach(
        char => {
            if (isCorrupted) {
                return;
            }

            if (['(', '[', '{', '<'].includes(char)) {
                stack.push(char as Opener);
                return;
            }

            if (![')', '}', ']', '>'].includes(char)) {
                throw Error(`${char} is not an opener or closer?`)
            }

            // Else we should be closing:
            const opener = stack.pop();
            if (opener === undefined) {
                throw new Error('No openers left?');
            }

            const expectedCloser = opensToCloses[opener];

            if (expectedCloser !== char) {
                corrupted.push(char as Closer)
                isCorrupted = true
            }
        }
    )

    if (!isCorrupted) {
        incompletes.push(stack.map(opener => opensToCloses[opener]).reverse());
    }
});

const part1 = corrupted.map(val => syntaxPoints[val]).reduce((previousValue, currentValue) => previousValue + currentValue);
const part2 = incompletes.map(val => {
    let value = 0;
    val.forEach(closer => {
        const points = autoCompletePoints[closer];
        value *= 5;
        value += points;
    })
    return value;
});

part2.sort((a, b) => a - b);

const positionToGet = (part2.length + 1) / 2

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2[positionToGet - 1]}`);
