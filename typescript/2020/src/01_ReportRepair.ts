import * as fs from 'fs';

const input = fs.readFileSync(__dirname + '/../input/day01.txt').toString('utf-8');

const expenses: Array<number> = [];

input.split("\n").forEach((value) => {
    const num = Number.parseInt(value, 10);

    if (!isNaN(num)) {
        expenses.push(num);
    }
});

const partTwo: Array<{ sum: number, product: number, indexes: Array<number> }> = [];

expenses.forEach(
    (val1, index1) => {
        expenses.forEach(
            (val2, index2) => {
                if (index1 >= index2) {
                    return;
                }

                const sum = val1 + val2;
                const product = val1 * val2;

                if (sum == 2020) {
                    console.log(`part 1: ${product}`);
                }

                if (sum < 2020) {
                    partTwo.push({sum, product, indexes: [index1, index2]})
                }
            }
        )
    }
)

partTwo.some((def) => {
    const {sum, product, indexes} = def;

    return expenses.some((expenseVal, index) => {
        if (!indexes.includes(index) && (sum + expenseVal == 2020)) {
            console.log(`part 2: ${product * expenseVal}`)

            return true;
        }

        return false;
    })
})
