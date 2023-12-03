import getInput from "./util/getInput";

const testInputs = {
    'part1nice': 'ugknbfddgicrmopn',
    'aaa' : 'aaa',
    'haegwjzuvuyypxyu': 'haegwjzuvuyypxyu'
}

const input = getInput(testInputs, 5);

function stringIsNice(string: string, rules: ((string: string) => boolean)[]): boolean {
    return rules.every(rule => rule(string));
}

const strings = input.trim().split('\n');

const part1Rules: Parameters<typeof stringIsNice>[1] = [
    (string) => (string.match(/[aeiou]/g)?.length ?? 0)> 2,
    (string) => (string.match(/([a-z])\1/)?.length ?? 0) > 0,
    (string) => (string.match(/ab|cd|pq|xy/)?.length ?? 0) == 0
];

console.log(`Part 1: ${strings.filter(val => stringIsNice(val, part1Rules)).length}`);

const part2Rules: Parameters<typeof stringIsNice>[1] = [
    (string) => (string.match(/([a-z][a-z]).*\1/)?.length ?? 0)> 0,
    (string) => (string.match(/([a-z])[a-z]\1/)?.length ?? 0) > 0,
];

console.log(`Part 2: ${strings.filter(val => stringIsNice(val, part2Rules)).length}`);
