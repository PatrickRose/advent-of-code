import getInput from "./util/getInput";

const testInputs = {
    example: `Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3`
}

const input = getInput(testInputs, 15);

type Ingredient = {
    capacity: number,
    durability: number,
    flavor: number,
    texture: number,
    calories: number
}

const ingredients: Map<string, Ingredient> = new Map;

function makeEmptyIngredient(): Ingredient {
    return {calories: 0, capacity: 0, durability: 0, flavor: 0, texture: 0};
}

function isIngredientResult(input: string): input is keyof Ingredient {
    return makeEmptyIngredient()[input as keyof Ingredient] !== undefined;
}

input.split('\n').forEach(row => {
    const [name, parts] = row.split(': ');
    const ingredient: Ingredient = makeEmptyIngredient();

    parts.split(',').forEach(part => {
        const [thing, value] = part.trim().split(' ');

        if (!isIngredientResult(thing)) {
            throw new Error(`Unknown ingredient result ${thing}`)
        }

        ingredient[thing] = Number.parseInt(value);
    })

    ingredients.set(name, ingredient);
});

function getMaxAmount(amounts: Record<string, number>, partTwo: boolean, cache: Record<string, number> = {}): number {
    const currentAmount = Object.values(amounts).reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    const entries = Object.entries(amounts);
    entries.sort(([a, _], [b, __]) => {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }

        return 0
    })
    let cacheKey = entries
        .map(([key, value]) => `${key}:${value}`)
        .join(',');

    if (cache[cacheKey] !== undefined) {
        return cache[cacheKey];
    }

    if (currentAmount == 100) {
        const strings: (keyof Ingredient)[] = ['capacity', 'durability', 'flavor', 'texture'];

        if (partTwo) {
            const calories = Object.entries(amounts).reduce(
                (prev, [key, amount]): number => {
                    const ingredient = ingredients.get(key);
                    if (ingredient) {
                        return prev + (ingredient.calories * amount)
                    }

                    return prev;
                },
                0
            );

            if (calories !== 500) {
                return cache[cacheKey] = 0;
            }
        }

        let val = strings.reduce(
            (prev, curr) => {
                const newVal = Object.entries(amounts).reduce((prev, [key, amount]) => {
                        const ingredient = ingredients.get(key);
                        if (ingredient) {
                            return prev + (ingredient[curr] * amount)
                        }

                        return prev;
                    },
                    0
                )

                return prev * Math.max(newVal, 1);
            },
            1
        )


        return cache[cacheKey] = val;
    }

    const toTry: number[] = [];

    for (let key of ingredients.keys()) {
        const newAmounts = {...amounts};
        if (newAmounts[key] === undefined) {
            newAmounts[key] = 1;
        } else {
            newAmounts[key]++;
        }
        toTry.push(getMaxAmount(newAmounts, partTwo, cache))
    }

    return cache[cacheKey] = Math.max(...toTry);
}

console.log(`Part 1: ${getMaxAmount({}, false)}`);
console.log(`Part 2: ${getMaxAmount({}, true)}`);
