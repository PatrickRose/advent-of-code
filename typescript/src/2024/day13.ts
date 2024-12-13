import getInput from "./util/getInput";
import {addPoint, Point, PointString} from "../util/points";
import {mappedAccumulator} from "../util/accumulator";

const testInputs = {
    example: `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`
}

const input = getInput(testInputs, 13);

type Machine = {
    a: Point,
    b: Point,
    target: Point
}

const machines: Machine[] = input.split('\n\n').map(val => {
    const [a, b, button] = val.split('\n');

    const aResult = a.match(/(\d+), Y\+(\d+)/)
    const bResult = b.match(/(\d+), Y\+(\d+)/)
    const buttonResult = button.match(/X=(\d+), Y=(\d+)/);

    if (!aResult || !bResult || !buttonResult) {
        throw Error();
    }

    return {
        a: {x: Number.parseInt(aResult[1]), y: Number.parseInt(aResult[2])},
        b: {x: Number.parseInt(bResult[1]), y: Number.parseInt(bResult[2])},
        target: {x: Number.parseInt(buttonResult[1]), y: Number.parseInt(buttonResult[2])},
    }
});

function optimisedTokens({a, b, target}: Machine): number {
    const determinate = (a.x * b.y) - (a.y * b.x);
    const aVal = Math.floor(((target.x * b.y) - (target.y * b.x)) / determinate);
    const bVal = Math.floor(((a.x * target.y) - (a.y * target.x)) / determinate);

    if (
        (((a.x * aVal) + (b.x * bVal)) == target.x)
        && (((a.y * aVal) + (b.y * bVal)) == target.y)
    ) {
        return 3*aVal + bVal;
    } else {
        return 0;
    }
}

const part1 = mappedAccumulator(machines, optimisedTokens);

console.log(`Part 1: ${part1}`);

const part2 = mappedAccumulator(
    machines.map((val): Machine => {
            return {
                a: {...val.a},
                b: {...val.b},
                target: {
                    x: val.target.x + 10000000000000,
                    y: val.target.y + 10000000000000,
                }
            }
        }
    ),
    optimisedTokens
);
console.log(`Part 2: ${part2}`);
