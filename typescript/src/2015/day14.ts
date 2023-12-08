import getInput from "./util/getInput";
import parseInt from "../util/parseInt";

const testInputs = {
    example: `Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.`
}

const input = getInput(testInputs, 14);

type Reindeer = {
    speed: number,
    amount: number,
    rest: number
}

const reindeer: Reindeer[] = input.split('\n').map(
    row => {
        const match = row.match(/.+ can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds/);

        if (!match) {
            throw new Error(`${row} is invalid`);
        }

        return {
            speed: parseInt(match[1]),
            amount: parseInt(match[2]),
            rest: parseInt(match[3]),
        }
    }
);

function reindeerDistance({speed, amount, rest}: Reindeer, timePeriod: number): number {
    let distance = 0;

    while (timePeriod > 0) {
        if (timePeriod < amount) {
            distance += timePeriod * speed;
        } else {
            distance += amount * speed;
        }

        timePeriod -= (amount + rest)
    }

    return distance;
}

const raceLength = input == testInputs.example ? 140 : 2503;
const distances = reindeer.map(reindeer => reindeerDistance(reindeer, raceLength));

console.log(`Part 1: ${Math.max(...distances)}`);

type MovingReindeer = Reindeer & {
    resting: boolean,
    timeLeftToSwitchState: number,
    distanceTravelled: number,
    points: number
};

const movingReindeer: MovingReindeer[] = reindeer.map(reindeer => {
    return {
        ...reindeer,
        timeLeftToSwitchState: reindeer.amount,
        resting: false,
        distanceTravelled: 0,
        points: 0
    }
});

for (let i = 0; i < raceLength; i++) {
    // First, move all the reindeer
    movingReindeer.forEach(reindeer => {
        if (!reindeer.resting) {
            reindeer.distanceTravelled += reindeer.speed
        }

        reindeer.timeLeftToSwitchState--;

        if (reindeer.timeLeftToSwitchState == 0) {
            reindeer.timeLeftToSwitchState = reindeer.resting ? reindeer.amount : reindeer.rest;
            reindeer.resting = !reindeer.resting;
        }
    });

    // Sort the reindeer
    let max = -Infinity;
    let toApply: MovingReindeer[] = [];
    movingReindeer.forEach(reindeer => {
        if (reindeer.distanceTravelled > max) {
            toApply = [reindeer];
            max = reindeer.distanceTravelled;
        } else if (reindeer.distanceTravelled == max) {
            toApply.push(reindeer);
        }
    });

    toApply.forEach(reindeer => reindeer.points++);
}

console.log(`Part 2: ${Math.max(...movingReindeer.map(({points}) => points))}`);
