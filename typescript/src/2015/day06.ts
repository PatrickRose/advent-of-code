import getInput from "./util/getInput";
import {getPoint, Point, PointMap, PointString, pointStringToPoint, setPoint} from "../util/points";

const testInputs = {}

const input = getInput(testInputs, 6);

type LightState = { state: boolean, brightness: number };
const lightMap: PointMap<LightState> = new Map();

function isPoint(val: string): val is PointString {
    return val.match(/^\d+,\d+$/) !== null
}

input.split('\n')
    .forEach(row => {
        const matches = row.match(/(.+) (\d+,\d+) through (\d+,\d+)/);

        if (matches === null) {
            throw new Error(`${row} does not match the regex`);
        }

        const command = matches[1];
        const start = matches[2];
        const end = matches[3];

        if (!isPoint(start) || !isPoint(end)) {
            throw new Error('start or end is not a point');
        }

        const startPoint = pointStringToPoint(start);
        const endPoint = pointStringToPoint(end);

        for(let x=startPoint.x; x<=endPoint.x; x++) {
            for(let y=startPoint.y; y<=endPoint.y; y++) {
                let currValue = getPoint({x,y}, lightMap);
                if (currValue === undefined) {
                    currValue = {state: false, brightness: 0};
                    setPoint({x,y}, currValue, lightMap)
                }

                switch (command) {
                    case 'turn on':
                        currValue.state = true;
                        currValue.brightness++;
                        break;

                    case 'turn off':
                        currValue.state = false;
                        if (currValue.brightness > 0) {
                            currValue.brightness--;
                        }

                        break;

                    case 'toggle':
                        currValue.state = !currValue.state;
                        currValue.brightness += 2;
                        break;
                    default:
                        throw new Error(`Got ${command} which isn't know`);
                }
            }
        }
});

let count = 0;
let brightness = 0;
lightMap.forEach(inner => {
    inner.forEach(val => {
        if (val.state) {
            count++
        }
        brightness += val.brightness;
    })
});

console.log(`Part 1: ${count}`);
console.log(`Part 1: ${brightness}`);
