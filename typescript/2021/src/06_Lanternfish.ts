import getInput from "./util/getInput";

const exampleInput = `3,4,3,1,2`;

const realInput = getInput(6);

const input = realInput;

const cacheMap = new Map<number, Map<number, number>>();

class Fish {
    constructor(public days: number) {
    }

    public tick(): boolean {
        this.days--;

        if (this.days < 0) {
            this.days += 7;
            return true;
        }

        return false;
    }

    public fishesMadeInPeriod(days: number): number {
        let daysMap = cacheMap.get(days);
        if (!daysMap) {
            daysMap = new Map<number, number>();
            cacheMap.set(days, daysMap);
        }

        const thisMap = daysMap.get(this.days);
        if (thisMap) {
            return thisMap;
        }

        let currentTime = this.days;
        let fishesMade = 1;

        while (currentTime < days) {
            // We use 9 here, because technically the fish isn't made until the next tick
            // This is slightly easier to reason about
            fishesMade += (new Fish(currentTime + 9).fishesMadeInPeriod(days));
            currentTime += 7;
        }

        daysMap.set(this.days, fishesMade);

        return fishesMade;
    }
}

const fishes = input.split(',').map(val => new Fish(parseInt(val, 10)));

console.log(`Part 1: ${fishes.map(fish => fish.fishesMadeInPeriod(80)).reduce((prev, curr) => prev + curr, 0)}`);
console.log(`Part 2: ${fishes.map(fish => fish.fishesMadeInPeriod(256)).reduce((prev, curr) => prev + curr, 0)}`);
