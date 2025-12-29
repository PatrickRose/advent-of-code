import getInput from "./util/getInput";

const testInputs = {
    example: `abcdef
bababc
abbcde
abcccd
aabcdd
abcdee
ababab`
}

const input = getInput(testInputs, 2);

const strings = input.split('\n');

const has2: Set<string> = new Set;
const has3: Set<string> = new Set;

const counts: Record<string, number>[] = strings.map((row) => {
    const counts: Record<string, number> = {};

    for (const char of row.split('')) {
        counts[char] = 1 + (counts[char] ?? 0);
    }

    Object.values(counts).forEach((val) => {
        if (val == 2) {
            has2.add(row);
        }
        if (val == 3) {
            has3.add(row);
        }
    })

    return counts;
});

console.log(`Part 1: ${has2.size * has3.size}`);

function findCommonChars(first: string, second: string): string | null {
    if (first.length != second.length) {
        return null;
    }

    let foundDifference = false;
    const chars = [];

    for (let i = 0; i < first.length; i++) {
        if (first[i] != second[i]) {
            if (foundDifference) {
                return null;
            }

            foundDifference = true;
        } else {
            chars.push(first[i]);
        }
    }

    return chars.join('');
}

for (let i = 0; i < strings.length; i++) {
    for (let j = i + 1; j < strings.length; j++) {
        const common = findCommonChars(strings[i], strings[j]);

        if (common != null) {
            console.log(`Part 2: ${common}`);
            i = Infinity;
            j = Infinity;
            break;
        }
    }
}
