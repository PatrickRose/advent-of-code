import * as fs from 'fs';

const input = fs.readFileSync(__dirname + '/../input/day05.txt').toString('utf-8').trim();

const seats = input.split("\n");

function convertStrToNum(spec: string): number {
    const binaryVal = spec.replace(/[BR]/g, '1')
        .replace(/[FL]/g, '0');

    return Number.parseInt(binaryVal, 2);
}

const seatIDs = seats.map(seat => convertStrToNum(seat));

seatIDs.sort();

console.log(`Part 1: ${Math.max(...seatIDs)}`);

seatIDs.some((seatID, index) => {
    const nextSeat = seatIDs[index + 1];

    if ((nextSeat - seatID) == 2) {
        console.log(`Part 2: ${seatID + 1}`);
        return true;
    }

    return false;
});
