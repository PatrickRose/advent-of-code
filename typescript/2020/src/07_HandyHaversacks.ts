import * as fs from 'fs';

const input = fs.readFileSync(__dirname + '/../input/day07.txt').toString('utf-8').trim();

class Bag {
    private readonly colour: string;
    private readonly subColours: Array<{
        bag: Bag,
        amount: number
    }> = [];

    private hasGold: boolean | null = null;

    private containedBags: number | null = null;

    constructor(colour: string) {
        this.colour = colour;
    }

    public addColour(colour: string, bag: Bag, amount: number): void {
        this.subColours.push({
            bag,
            amount
        });

        if (colour === 'shiny gold') {
            this.hasGold = true;
        }
    }

    public hasShinyGold(): boolean {
        if (this.hasGold === null) {
            this.hasGold = this.subColours.some(
                (val) => {
                    return val.bag.hasShinyGold();
                }
            )
        }

        return this.hasGold;
    }

    public countSubBags(): number {
        if (this.containedBags === null) {
            this.containedBags = this.subColours.reduce(
                (previousValue, subBag): number => {
                    const {bag, amount} = subBag;

                    return previousValue + ((bag.countSubBags() + 1) * amount);
                },
                0
            )
        }

        return this.containedBags;
    }
}

const allBags: { [colour: string]: Bag } = {};

const notDone: { [colour: string]: Array<{ bag: Bag, amount: number }> } = {};

input.split("\n").forEach(
    (line) => {
        const match = line.match(/([a-z]+ [a-z]+) bags contain (.+)/);

        if (match === null) {
            throw new Error(`Line didn't match regex ${line}`);
        }

        const colour = match[1];
        const bag = new Bag(colour);
        allBags[colour] = bag;

        const subColours = match[2].matchAll(/(\d+) ([a-z]+ [a-z]+) bags?/g);

        for (const colourMatch of subColours) {
            const subColour = colourMatch[2];
            const amount = Number.parseInt(colourMatch[1], 10);

            if (allBags[subColour]) {
                bag.addColour(subColour, allBags[subColour], amount);
            } else {
                if (!notDone[subColour]) {
                    notDone[subColour] = [{bag, amount}];
                } else {
                    notDone[subColour].push({bag, amount});
                }
            }
        }

        if (notDone[colour]) {
            notDone[colour].forEach(
                (val) => {
                    const {bag: subBag, amount} = val;

                    subBag.addColour(colour, bag, amount);
                }
            );
        }
    }
);

let hasGold = 0;

for (const colour in allBags) {
    const bag: Bag = allBags[colour];

    if (bag.hasShinyGold()) {
        hasGold += 1;
    }
}

console.log(`Part 1: ${hasGold}`);
console.log(`Part 2: ${allBags['shiny gold'].countSubBags()}`);
