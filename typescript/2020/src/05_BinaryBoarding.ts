import * as fs from 'fs';

const input = fs.readFileSync(__dirname + '/../input/day05.txt').toString('utf-8').trim();

const seats = input.split("\n");

function convertStrToNum(spec: string, higherChar: string): number {
    let number = 0;

    for (const char of spec.split('')) {
        number *= 2;

        if (char === higherChar) {
            number += 1;
        }
    }

    return number;
}

function getRowColumn(seat: string): [number, number] {
    return [
        convertStrToNum(seat.slice(0, -3), 'B'),
        convertStrToNum(seat.slice(-3), 'R')
    ]
}

const seatsParsed = seats.map(s => getRowColumn(s));

const seatIDs = seatsParsed.map(seat => {
    return (seat[0] * 8) + seat[1]
});

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
