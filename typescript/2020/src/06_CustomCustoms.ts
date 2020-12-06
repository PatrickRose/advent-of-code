import * as fs from 'fs';

const input = fs.readFileSync(__dirname + '/../input/day06.txt').toString('utf-8').trim();

const rawGroups = input.split("\n\n");

type Question =
    'a'
    | 'b'
    | 'c'
    | 'd'
    | 'e'
    | 'f'
    | 'g'
    | 'h'
    | 'i'
    | 'j'
    | 'k'
    | 'l'
    | 'm'
    | 'n'
    | 'o'
    | 'p'
    | 'q'
    | 'r'
    | 's'
    | 't'
    | 'u'
    | 'v'
    | 'w'
    | 'x'
    | 'y'
    | 'z';

type Person = Set<Question>

type Group = Array<Person>;

function isQuestion(test: string): test is Question {
    return test.match(/^[a-z]$/) !== null;
}

const groups: Array<Group> = rawGroups.map(
    (rawGroup): Group => {
        return rawGroup.split("\n").map(
            (rawPerson): Person => {
                const person: Person = new Set<Question>();

                for (const char of rawPerson.split('')) {
                    if (isQuestion(char)) {
                        person.add(char)
                    } else {
                        throw new Error(`Char ${char} was unexpected`)
                    }
                }

                return person;
            }
        )
    }
);

const partOne = groups.reduce(
    (previousValue: number, currentValue: Group): number => {
        const superPerson = currentValue.reduce(
            (previousValue, currentValue, index): Person => {
                currentValue.forEach(val => previousValue.add(val));

                return previousValue;
            },
            new Set()
        );

        return previousValue + superPerson.size;
    },
    0
);

console.log(`Part 1: ${partOne}`);

const partTwo = groups.reduce(
    (previousValue: number, currentValue: Group): number => {
        const superPerson = currentValue.reduce(
            (previousValue, currentValue, index): Person => {
                if (previousValue.size == 0) {
                    return previousValue;
                }

                if (index == 0) {
                    return previousValue;
                }

                return new Set(
                    [...previousValue].filter(val => currentValue.has(val))
                );
            },
            currentValue[0]
        );

        return previousValue + superPerson.size;
    },
    0
);

console.log(`Part 2: ${partTwo}`);
