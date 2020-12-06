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

type Person = Array<Question>

type Group = Array<Person>;

function isQuestion(test: string): test is Question {
    return test.match(/^[a-z]$/) !== null;
}

const groups: Array<Group> = rawGroups.map(
    (rawGroup): Group => {
        return rawGroup.split("\n").map(
            (rawPerson): Person => {
                const person: Person = [];

                for (const char of rawPerson.split('')) {
                    if (isQuestion(char)) {
                        person.push(char);
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
            (previousValue, currentValue): Person => {
                for (const val of currentValue) {
                    if (!previousValue.includes(val)) {
                        previousValue.push(val);
                    }
                }

                return previousValue;
            },
            []
        );

        return previousValue + superPerson.length;
    },
    0
);

console.log(`Part 1: ${partOne}`);

const partTwo = groups.reduce(
    (previousValue: number, currentValue: Group): number => {
        const superPerson = currentValue.reduce(
            (previousValue, currentValue, index): Person => {
                if (index == 0) {
                    return currentValue;
                }

                return previousValue.filter(
                    (question: Question): boolean => {
                        return currentValue.includes(question);
                    }
                );
            },
            []
        );

        return previousValue + superPerson.length;
    },
    0
);

console.log(`Part 2: ${partTwo}`);
