import getInput from "./util/getInput";
import {mappedAccumulator} from "../util/accumulator";

const testInputs = {
    example: `[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up`
}

const input = getInput(testInputs, 4);

const lines = input.split('\n');

lines.sort();

let guard: number | null = null;
let guardStatus: 'awake' | 'asleep' = 'awake';
let prevTimestamp: Date | null = null;
let minutes: number[][] = [];
while (minutes.length < 60) {
    minutes.push([]);
}

const guardIDs: number[] = [];

for (const line of lines) {
    const matches = line.match(/^\[(\d{4}-\d{2}-\d{2} \d+:\d+)] (Guard #(\d+) begins shift|falls asleep|wakes up)$/);

    if (!matches) {
        throw new Error('Unknown line')
    }

    const dateStr = matches[1];
    const dateParts = dateStr.split(/[: -]/).map(val => Number.parseInt(val, 10));
    const date = new Date();
    date.setUTCFullYear(dateParts[0], dateParts[1] - 1, dateParts[2]);
    date.setUTCHours(dateParts[3], dateParts[4], 0, 0);

    if (matches[3]) {
        // We must be on the first line, therefore read
        guard = Number.parseInt(matches[3], 10);
        guardIDs.push(guard);
        guardStatus = 'awake';
    }

    while (date.getUTCHours() != 0) {
        date.setUTCMinutes(date.getUTCMinutes() + 1);
    }

    // If we don't have a guard at this point, something has gone wrong
    if (!guard) {
        throw new Error('should have a guard by now?');
    }

    if (guardStatus == 'asleep') {
        if (prevTimestamp != null) {
            while (prevTimestamp < date) {
                const minute = prevTimestamp.getUTCMinutes();
                minutes[minute].push(guard)
                prevTimestamp.setUTCMinutes(minute + 1);
            }
        }
    }

    if (matches[2] == 'falls asleep') {
        guardStatus = 'asleep';
    }
    if (matches[2] == 'wakes up') {
        guardStatus = 'awake';
    }

    prevTimestamp = date;
}

// First, find out which guard was asleep the most
const awake: Record<number, number> = {}
for (const guard of guardIDs) {
    awake[guard] = mappedAccumulator(minutes, (val) => val.filter(val => val == guard).length);
}

// Then find the max
const entries = Object.entries(awake);
entries.sort(([_, a], [__, b]) => {
    return b - a;
})
const guardMostAsleep = Number.parseInt(entries[0][0]);
let max: [number, number] = [0, -Infinity];
// Then find the minute they were most asleep
for (let minute = 0; minute < 60; minute++) {
    const minutesAsleep = minutes[minute].filter(val => val == guardMostAsleep).length;
    if (minutesAsleep > max[1]) {
        max = [minute, minutesAsleep]
    }
}

console.log(`Part 1: ${guardMostAsleep * max[0]}`)

let maxAsleep: [number, number, number] = [
    -Infinity, // GuardID
    -Infinity, // Minute
    -Infinity // Sleep count
];

for (let minute = 0; minute < 60; minute++) {
    const minuteDetails = minutes[minute];
    for (const guard of guardIDs) {
        const sleepCount = minuteDetails.filter(val => val == guard).length;

        if (sleepCount > maxAsleep[2]) {
            maxAsleep = [guard, minute, sleepCount]
        }
    }
}

console.log(`Part 2: ${maxAsleep[0] * maxAsleep[1]}`);
