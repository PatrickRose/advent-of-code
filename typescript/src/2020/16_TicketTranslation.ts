import getInput from "./util/getInput";

const input = getInput(16);

type Ticket = Array<number>;

type Validation = {
    min: number,
    max: number
}

type Rule = {
    name: string,
    validation: Array<Validation>,
    position: number | Array<number>
};

type Rules = Array<Rule>;

const sections = input.split("\n\n");

const rules: Rules = [];

const myTicket: Ticket = sections[1].split("\n")[1].split(',').map(val => Number(val));

const positions: Array<number> = [];

for (let i = 0; i < myTicket.length; i++) {
    positions.push(i);
}

sections[0].split("\n").forEach(line => {
    const regex = line.match(/^([a-z ]+): (\d+)-(\d+) or (\d+)-(\d+)$/);

    if (regex === null) {
        throw new Error(`Could not parse ${line}`);
    }

    const firstRule: Validation = {
        min: Number(regex[2]),
        max: Number(regex[3]),
    }
    const secondRule: Validation = {
        min: Number(regex[4]),
        max: Number(regex[5]),
    }

    rules.push({
        name: regex[1],
        validation: [firstRule, secondRule],
        position: positions
    });
});

const nearbyTickets: Array<Ticket> = sections[2].split("\n").slice(1).map(
    (row): Ticket => {
        return row.split(',').map(val => Number(val));
    }
);

const invalidFields: Array<number> = [];

function validateRules(innerRule: Validation, val: number) {
    const {min, max} = innerRule;

    return val >= min && val <= max;
}

const validTickets = nearbyTickets.filter((ticket: Ticket): boolean => {
    const invalidFieldsOnTicket = ticket.filter(
        (val): boolean => {
            return rules.every((rule): boolean => {
                    return !rule.validation.some(
                        innerRule => validateRules(innerRule, val)
                    );
                }
            );
        }
    );

    invalidFields.push(...invalidFieldsOnTicket);

    return invalidFieldsOnTicket.length === 0;
});

console.log(`Part 1: ${invalidFields.reduce((prev, val) => prev + val, 0)}`);

function ruleHasPosition(rule: Rule): boolean {
    return typeof rule.position == 'number';
}

const positionsFound: Array<number> = [];

rules.forEach(rule => {
    if (typeof rule.position == 'number') {
        // Already done
        return;
    }

    rule.position = rule.position.filter(val => validTickets.every(
        (ticket): boolean => {
            return rule.validation.some(
                (validation): boolean => {
                    return validateRules(validation, ticket[val])
                }
            );
        }
    ));
});

while (!rules.every(rule => ruleHasPosition(rule))) {
    rules.forEach(rule => {
        if (typeof rule.position == 'number') {
            // Already done
            return;
        }

        rule.position = rule.position.filter(
            pos => !positionsFound.includes(pos)
        );

        if (rule.position.length === 1) {
            positionsFound.push(rule.position[0]);
            rule.position = rule.position[0];
        }
    });
}

const partTwo = rules.reduce(
    (previousVal: bigint, rule: Rule): bigint => {
        if (rule.name.match(/^departure/) === null) {
            return previousVal;
        }

        if (!(typeof rule.position == 'number')) {
            throw new Error(`${rule} doesn't have a position?`);
        }

        return previousVal * BigInt(myTicket[rule.position]);
    },
    1n
)

console.log(`Part 2: ${partTwo}`);
