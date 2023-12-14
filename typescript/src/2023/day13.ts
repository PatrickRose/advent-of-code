import getInput from "./util/getInput";

const testInputs = {
    example: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
    test: `...##.#
.##.###
.##.###
...##.#
#...###
.#..##.
##.##.#
...####
#.#.###
#....#.
..#.##.
..#.##.
#....#.
#.#.###
...####

...##.#
.##.###
.##.###
...##.#
#...###
.#..##.
##.##.#
...####
#.#.###
#....#.
..#.##.
..#.##.
#....#.
#.#.#.#
...####`
}

const input = getInput(testInputs, 13);

const mirrors = input.split('\n\n');

function findReflection(rows: string[], ignore: number|null = null): null|number {
    for (let i=1; i< rows.length; i++) {
        if (ignore == i) {
            continue;
        }
        // split into the two groups
        const firstGroup = rows.slice(0, i);
        const secondGroup = rows.slice(i);

        // Then reverse through firstGroup and see if it matches secondGroup
        const matches = firstGroup.reverse().every((row, index) => {
            if (secondGroup[index] === undefined) {
                return true;
            }

            return row == secondGroup[index];
        });
        if (matches) {
            return i;
        }
    }

    return null;
}

type RowCol = { type: 'row' | 'column', value: number };

function findReflectionForMirror(mirror: string, ignore: null|RowCol = null): null|RowCol {
    // First, check the rows
    const rows = mirror.split('\n');

    const rowReflection = findReflection(rows, ignore?.type == 'row' ? ignore.value : null);
    if (rowReflection !== null) {
        return {type:'row', value:rowReflection};
    }

    const cols = rows[0].split('').map(
        (_, index) => rows.map(val => val[index]).join('')
    );


    const colReflection = findReflection(cols, ignore?.type =='column' ? ignore.value : null);
    if (colReflection !== null) {
        return {type:'column', value:colReflection};
    }

    return null;
}


const part1 = mirrors.map((val) => findReflectionForMirror(val));

function valueOfRowCol(val: RowCol): number {
    return val.value * (val.type == 'row' ? 100 : 1);
}

console.log(`Part 1: ${part1.reduce((prev, curr) => (prev)+(curr ? valueOfRowCol(curr) : 0), 0)}`);

const part2 = mirrors.map(mirror => {
    const originalReflectionValue = findReflectionForMirror(mirror)

    if (originalReflectionValue === null) {
        throw new Error('No existing reflection?')
    }
    for (let i = 0; i < mirror.length; i++) {
        const charToSwap = mirror[i];

        if (charToSwap == '\n') {
            continue;
        }

        const newMirror = mirror.slice(0, i) + (charToSwap == '.' ? '#' : '.') + mirror.slice(i+1);
        const reflection = findReflectionForMirror(newMirror, originalReflectionValue);
        if (reflection !== null) {
            if (reflection !== originalReflectionValue) {
                return reflection;
            } else {
                console.log('Found existing match?')
            }
        }
    }

    throw new Error(`Did not find difference for
${mirror}`);
});

console.log(`Part 2: ${part2.reduce((prev, curr) => (prev)+(curr ? valueOfRowCol(curr) : 0), 0)}`);
