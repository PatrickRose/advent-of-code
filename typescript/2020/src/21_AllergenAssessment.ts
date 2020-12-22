import getInput from "./util/getInput";

const input = getInput(21);

const ingredientCounts: Map<string, number> = new Map<string, number>();
const possibleAllergens: Map<string, Set<string>> = new Map<string, Set<string>>();

input.split("\n").forEach(
    row => {
        const regexMatch = row.match(/^(.+) \(contains (.+)\)$/);

        if (regexMatch === null) {
            throw new Error(`${row} is invalid`);
        }

        const theseIngredients = regexMatch[1].split(' ');
        const theseAllergens = regexMatch[2].split(', ');

        theseIngredients.forEach(ingredient => {
            const previousVal: number = ingredientCounts.get(ingredient) || 0;

            ingredientCounts.set(ingredient, previousVal + 1);
        });

        theseAllergens.forEach(allergen => {
            const previousVal = possibleAllergens.get(allergen);
            const currVal = new Set(theseIngredients);

            if (previousVal === undefined) {
                possibleAllergens.set(allergen, currVal);
            } else {
                const newVal = new Set(
                    [...previousVal].filter(
                        val => currVal.has(val)
                    )
                );

                possibleAllergens.set(allergen, newVal);
            }
        })
    }
);

const definiteAllergens: Array<string> = [];
const completedAllergens: Array<string> = [];
const ingredientToAllergen: Map<string, string> = new Map<string, string>();

let allAllergensMapped: boolean = false;

do {
    allAllergensMapped = true;
    possibleAllergens.forEach((possibleAllergen, key) => {
        if (completedAllergens.includes(key)) {
            return;
        }

        definiteAllergens.forEach(
            done => possibleAllergen.delete(done)
        )

        if (possibleAllergen.size == 1) {
            let ingredient: string | null = null;

            possibleAllergen.forEach(val => {
                ingredient = val
            });

            if (ingredient === null) {
                throw new Error(`Will never happen`);
            }

            definiteAllergens.push(...possibleAllergen);
            completedAllergens.push(key);
            ingredientToAllergen.set(ingredient, key);
        } else if (possibleAllergen.size == 0) {
            throw new Error(`${key} has no options?`);
        } else {
            allAllergensMapped = false;
        }
    });
} while (!allAllergensMapped)

let part1: number = 0;

ingredientCounts.forEach((val, key) => {
    if (!definiteAllergens.includes(key)) {
        part1 += val;
    }
})

console.log(`Part 1: ${part1}`);
definiteAllergens.sort((a, b): number => {
    const aAllergen = ingredientToAllergen.get(a);
    const bAllergen = ingredientToAllergen.get(b);

    if (aAllergen == undefined || bAllergen == undefined) {
        throw new Error(`Could not find ${a} or ${b} in the map`);
    }

    if (aAllergen < bAllergen) {
        return -1;
    } else if (aAllergen == bAllergen) {
        return 0;
    } else {
        return 1;
    }
});
console.log(`Part 2: ${definiteAllergens.join(',')}`)
