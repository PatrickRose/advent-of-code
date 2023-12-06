import getInput from "./util/getInput";
import parseInt from "../util/parseInt";

const testInputs = {
    'example': `Time:      7  15   30
Distance:  9  40  200`
}

const input = getInput(testInputs, 6);

const [timeRow, distanceRow] = input.split('\n');

const times = timeRow.match(/(\d+)/g);
const distances = distanceRow.match(/(\d+)/g);

if (times === null || distances === null) {
    throw new Error('Invalid input');
}

const races: {time:number, distance: number}[] = times.map(
    (timeStr, index) => {
        const distance = parseInt(distances[index]);
        const time = parseInt(timeStr);

        return {time,distance};
    }
)

function waysToWinRace(race: {time:number, distance:number}) {
    let upperBound = race.time;
    let lowerBound = 0;

    function holdTimeCanWin(holdTime: number) {
        const movingTime = race.time - holdTime;
        const amountMoved = holdTime * movingTime;

        return amountMoved > race.distance;
    }

    while (!holdTimeCanWin(lowerBound)) {
        lowerBound++;
    }

    while (!holdTimeCanWin(upperBound)) {
        upperBound--;
    }

    return upperBound - lowerBound + 1;
}
const waysToWin = races.map(waysToWinRace);

console.log(`Part 1: ${waysToWin.reduce((prev, curr) => prev*curr)}`);

const part2Race = {
    time: parseInt(times.reduce((previousValue, currentValue) => `${previousValue}${currentValue}`)),
    distance: parseInt(distances.reduce((previousValue, currentValue) => `${previousValue}${currentValue}`)),
}

console.log(`Part 2: ${waysToWinRace(part2Race)}`)
