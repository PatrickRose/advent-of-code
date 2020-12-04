import * as fs from 'fs';

const input = fs.readFileSync(__dirname + '/../input/day04.txt').toString('utf-8').trim();

const passports = input.split("\n\n");

interface ValidationRules {
    byr: (val: string | undefined) => boolean,
    iyr: (val: string | undefined) => boolean,
    eyr: (val: string | undefined) => boolean,
    hgt: (val: string | undefined) => boolean,
    hcl: (val: string | undefined) => boolean,
    ecl: (val: string | undefined) => boolean,
    pid: (val: string | undefined) => boolean,
}

type ValidFieldName = keyof ValidationRules;

const partOne: ValidationRules = {
    byr(val: string | undefined): boolean {
        return val !== undefined;
    },
    ecl(val: string | undefined): boolean {
        return val !== undefined;
    },
    eyr(val: string | undefined): boolean {
        return val !== undefined;
    },
    hcl(val: string | undefined): boolean {
        return val !== undefined;
    },
    hgt(val: string | undefined): boolean {
        return val !== undefined;
    },
    iyr(val: string | undefined): boolean {
        return val !== undefined;
    },
    pid(val: string | undefined): boolean {
        return val !== undefined;
    }
}

const partTwo: ValidationRules = {
    byr(val: string | undefined): boolean {
        if (val === undefined) {
            return false;
        }

        return val.match(/^(19[2-9][0-9]|200[0-2])$/) !== null;
    },
    ecl(val: string | undefined): boolean {
        if (val === undefined) {
            return false;
        }

        return ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(val)
    },
    eyr(val: string | undefined): boolean {
        if (val === undefined) {
            return false;
        }

        return val.match(/^20(2[0-9]|30)$/) !== null;
    },
    hcl(val: string | undefined): boolean {
        if (val === undefined) {
            return false;
        }

        return val.match(/^#[0-9a-f]{6}$/) !== null
    },
    hgt(val: string | undefined): boolean {
        if (val === undefined) {
            return false;
        }

        return val.match(/^(1([5-8][0-9]|9[0-3])cm|(59|6[0-9]|7[0-6])in)$/) !== null
    },
    iyr(val: string | undefined): boolean {
        if (val === undefined) {
            return false;
        }

        return val.match(/^20(1[0-9]|20)$/) !== null;
    },
    pid(val: string | undefined): boolean {
        if (val === undefined) {
            return false;
        }

        return val.match(/^[0-9]{9}$/) !== null;
    }
}

function passportIsValid(passport: string, rules: ValidationRules): boolean {
    const sections = passport.split(/\s+/);
    const passportObj: { [P in ValidFieldName]?: string } = {};

    for (const section of sections) {
        const [fieldName, fieldValue] = section.split(':');

        if (fieldName in rules) {
            passportObj[<ValidFieldName>fieldName] = fieldValue
        }
    }

    for (const rule in rules) {
        if (!rules[<ValidFieldName>rule](passportObj[<ValidFieldName>rule])) {
            return false;
        }
    }

    return true;
}


console.log(`Part 1: ${passports.filter(s => passportIsValid(s, partOne)).length}`)
console.log(`Part 2: ${passports.filter(s => passportIsValid(s, partTwo)).length}`)
