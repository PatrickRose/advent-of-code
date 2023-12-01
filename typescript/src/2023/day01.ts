import getInput from "./util/getInput";

const testInputs = {
    'example': `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
    'multinums': `1abc2def3
45abc67def89`,
    'words': `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`,
    'doublewords': `twone`
}

const input = getInput(testInputs, 1);

const rows = input.split('\n');

const part1Rows = rows
    .map(row => {
        const nums = row.matchAll(/(\d)/g);

        const vals = Array.from(nums);
        const first = vals[0];
        const last = vals.pop();

        if (last === undefined) {
            return 0;
        }

        return Number.parseInt(first[1] + (last)[1], 10);
    })

const acc = (prev: number, curr: number) => prev + curr;

const part1 = part1Rows.reduce(acc)
console.log(`Part 1: ${part1}`);

const part2Rows = rows
    .map(row => {
        const toCheck = ['1','2','3','4','5','6','7','8','9','one','two','three','four','five','six','seven','eight','nine']
        let firstIndex: [number, string] = [Infinity, 'NONE']
        let lastIndex: [number, string] = [-Infinity, 'NONE']

        toCheck.forEach(check => {
            const firstUse = row.indexOf(check);

            if (firstUse == -1) {
                return;
            }

            const lastUse = row.lastIndexOf(check);

            if (firstIndex[0] > firstUse) {
                firstIndex[0] = firstUse;
                firstIndex[1] = check;
            }

            if (lastIndex[0] < lastUse) {
                lastIndex[0] = lastUse;
                lastIndex[1] = check;
            }
        })

        const convertToDigit = (val: string): string => {
            const map: Record<string, string> = {
                one: '1',
                two: '2',
                three: '3',
                four: '4',
                five: '5',
                six: '6',
                seven: '7',
                eight: '8',
                nine: '9'
            }

            return map[val] ?? val;
        }

        return Number.parseInt(convertToDigit(firstIndex[1]) + convertToDigit(lastIndex[1]), 10);
    });
const part2 = part2Rows.reduce(acc)
console.log(`Part 2: ${part2}`);
