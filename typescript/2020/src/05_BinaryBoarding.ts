import * as fs from 'fs';

const input = fs.readFileSync(__dirname + '/../input/day05.txt').toString('utf-8').trim();

const seats = input.split("\n");

function convertStrToNum(spec: string): number {
    let number = 0;

    for (const char of spec.split('')) {
        number *= 2;

        if (['B', 'R'].includes(char)) {
            number += 1;
        }
    }

    return number;
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
