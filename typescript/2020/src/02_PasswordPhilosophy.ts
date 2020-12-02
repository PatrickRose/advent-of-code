import * as fs from 'fs';

const input = fs.readFileSync(__dirname + '/../input/day02.txt').toString('utf-8').trim();

interface Password {
    requiredChar: string,
    firstDigit: number,
    secondDigit: number,
    password: string
}

const passwords: Array<Password> = input.split("\n").map(
    (value: string): Password => {
        const regex = value.match(/([\d]+)-([\d]+) ([a-z]): ([a-z]+)/);

        if (regex === null) {
            throw Error(`${value} did not match the regex?`);
        }

        return {
            requiredChar: regex[3],
            firstDigit: Number.parseInt(regex[1], 10),
            secondDigit: Number.parseInt(regex[2], 10),
            password: regex[4]
        }
    }
);

const validPasswordsPart1 = passwords.filter(
    (passwordDef: Password): boolean => {
        const {
            requiredChar,
            firstDigit: minRequired,
            secondDigit: maxRequired,
            password
        } = passwordDef;

        const actual = password.split(requiredChar).length - 1;

        return minRequired <= actual && actual <= maxRequired;
    }
)

console.log(`Part 1: ${validPasswordsPart1.length}`)

const validPasswordsPart2 = passwords.filter(
    (passwordDef: Password): boolean => {
        const {
            requiredChar,
            firstDigit,
            secondDigit,
            password
        } = passwordDef;

        return (password[firstDigit - 1] == requiredChar) !== (password[secondDigit - 1] == requiredChar);
    }
)

console.log(`Part 2: ${validPasswordsPart2.length}`)
