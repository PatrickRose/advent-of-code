import getInput from "./util/getInput";

const input = getInput(18);

const rows = input.split("\n");

function solveEquation(subStr: string, additionPriority: boolean = false): number {
    if (additionPriority) {
        while (subStr.includes('+')) {
            subStr = subStr.replace(
                /\d+ \+ \d+/,
                val => {
                    return solveEquation(val).toString(10);
                }
            )
        }
    }

    let operator = '+';

    return subStr.split(' ').reduce(
        (prev, val): number => {
            if (['*', '+'].includes(val)) {
                operator = val;
                return prev;
            }

            return operator == '+'
                ? prev + Number(val)
                : prev * Number(val);
        },
        0
    );
}

const answers: Array<number> = rows.map(
    (row): number => {
        let equation = row;
        while (equation.includes('(')) {
            equation = equation.replace(
                /\(([^(]+?)\)/,
                (subStr): string => {
                    return solveEquation(
                        subStr.substr(1, subStr.length - 2)
                    ).toString(10);
                }
            )
        }

        return solveEquation(equation);
    }
);

let sum = answers.reduce((prev, curr) => prev + BigInt(curr), 0n);

console.log(`Part 1: ${sum}`);

const additionPrecedence: Array<number> = rows.map(
    (row): number => {
        let equation = row;
        while (equation.includes('(')) {
            equation = equation.replace(
                /\(([^(]+?)\)/,
                (subStr): string => {
                    return solveEquation(
                        subStr.substr(1, subStr.length - 2),
                        true
                    ).toString(10);
                }
            )
        }

        return solveEquation(equation, true);
    }
);

sum = additionPrecedence.reduce((prev, curr) => prev + BigInt(curr), 0n);

console.log(`Part 2: ${sum}`);
