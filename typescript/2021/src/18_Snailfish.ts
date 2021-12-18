import getInput from "./util/getInput";

const exampleInput = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`;

const realInput = getInput(18);

const input = realInput;

type SnailFishNumber = {
    parent?: SnailFishNumber,
    left: SnailFishNumber | number,
    right: SnailFishNumber | number
}

type SnailFishArray = [number | SnailFishArray, number | SnailFishArray];

function arrayToSnailFish(val: SnailFishArray, parent?: SnailFishNumber): SnailFishNumber {
    const [left, right] = val;


    const number: SnailFishNumber = {
        parent,
        left: -1,
        right: -1,
    };

    number.left = typeof left === 'number' ? left : arrayToSnailFish(left, number)
    number.right = typeof right === 'number' ? right : arrayToSnailFish(right, number)

    return number;
}

function addSnailFishNumber(left: SnailFishNumber, right: SnailFishNumber): SnailFishNumber {
    const value = {
        left: deepClone(left),
        right: deepClone(right)
    };

    value.left.parent = value;
    value.right.parent = value;

    while (explode(value) || split(value)) {
    }

    return value;
}


function explode(number: SnailFishNumber, path: ('left' | 'right')[] = []): boolean {
    // First, find the number that explodes
    if (path.length == 4) {
        if (typeof number.left !== "number" || typeof number.right !== "number") {
            throw Error(`Tried to explode a snailfish that isn't a pair of regular numbers`);
        }

        const {left, right, parent} = number;

        if (!parent) {
            throw Error('No parent!?');
        }

        // Now we do some addition
        // We need the number to the left this pair
        let pathFork = parent;
        let rightNumber: null | SnailFishNumber = null;
        let leftNumber: null | SnailFishNumber = null;

        for (let i = path.length; i > 0; i--) {
            const directionAtI = path[i - 1];

            if (directionAtI === 'left' && !rightNumber) {
                rightNumber = pathFork;
            }

            if (directionAtI === 'right' && !leftNumber) {
                leftNumber = pathFork;
            }

            if (!pathFork.parent) {
                break;
            }

            pathFork = pathFork.parent;
        }

        if (leftNumber) {
            if (typeof leftNumber.left == "number") {
                leftNumber.left += left;
            } else {
                leftNumber = leftNumber.left;
                while (typeof leftNumber.right != "number") {
                    leftNumber = leftNumber.right;
                }
                leftNumber.right += left;
            }
        }

        if (rightNumber) {
            if (typeof rightNumber.right == "number") {
                rightNumber.right += right;
            } else {
                rightNumber = rightNumber.right;
                while (typeof rightNumber.left != "number") {
                    rightNumber = rightNumber.left;
                }
                rightNumber.left += right;
            }
        }

        if (parent.left == number) {
            parent.left = 0;
        } else {
            parent.right = 0;
        }

        return true;
    }


    if (typeof number.left !== 'number') {
        const newPath = path.slice();
        newPath.push('left');
        if (explode(number.left, newPath)) {
            return true;
        }
    }

    if (typeof number.right !== 'number') {
        const newPath = path.slice();
        newPath.push('right');
        if (explode(number.right, newPath)) {
            return true;
        }
    }

    return false;
}

function split(number: SnailFishNumber): boolean {
    const {left, right} = number;

    if (typeof left == 'number') {
        if (left >= 10) {
            number.left = {
                parent: number,
                left: Math.floor(left / 2),
                right: Math.ceil(left / 2)
            };

            return true;
        }
    } else {
        if (split(left)) {
            return true;
        }
    }

    if (typeof right == 'number') {
        if (right >= 10) {
            number.right = {
                parent: number,
                left: Math.floor(right / 2),
                right: Math.ceil(right / 2)
            };

            return true;
        }
    } else {
        if (split(right)) {
            return true;
        }
    }

    return false;
}

function snailFishToStr(number: SnailFishNumber): string {
    const {left, right} = number;

    const leftVal = typeof left == "number" ? left : snailFishToStr(left);
    const rightVal = typeof right == "number" ? right : snailFishToStr(right);

    return `[${leftVal},${rightVal}]`;
}

function magnitude(number: SnailFishNumber): number {
    const {left, right} = number;

    const leftVal = typeof left == "number" ? left : magnitude(left);
    const rightVal = typeof right == "number" ? right : magnitude(right);

    return 3 * leftVal + 2 * rightVal;
}

function deepClone(number: SnailFishNumber): SnailFishNumber {
    const {left, right} = number;

    const newNumber: SnailFishNumber = {
        left: -1,
        right: -1
    }

    if (typeof left == 'number') {
        newNumber.left = left;
    } else {
        newNumber.left = deepClone(left);
        newNumber.left.parent = newNumber;
    }

    if (typeof right == 'number') {
        newNumber.right = right;
    } else {
        newNumber.right = deepClone(right);
        newNumber.right.parent = newNumber;
    }

    return newNumber;
}

const numbers: SnailFishNumber[] = input.split("\n").map(
    row => {
        // Why bother parsing an array when that's what we're given?
        const array: SnailFishArray = eval(row);

        return arrayToSnailFish(array);
    }
)

const pairsToCheck: [SnailFishNumber, SnailFishNumber][] = [];

for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
        pairsToCheck.push([numbers[i], numbers[j]]);
        pairsToCheck.push([numbers[j], numbers[i]]);
    }
}

const reduced = numbers.reduce((first, second) => addSnailFishNumber(first, second));

console.log(`Part 1: ${magnitude(reduced)}`);

const magnitudes = pairsToCheck.map(([first, second]) => {
    return magnitude(addSnailFishNumber(first, second))
});

console.log(`Part 2: ${Math.max(...magnitudes)}`);
