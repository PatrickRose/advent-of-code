import getInput from "./util/getInput";

const sampleInput = `1
2
-3
3
-2
0
4`;

const input = getInput(20);

class Element {
    before: Element;
    after: Element;
    readonly value: number;

    constructor(value: number) {
        this.value = value;
        this.before = this;
        this.after = this;
    }

    moveBack() {
        const before = this.before;
        const after = this.after;

        this.after = before;
        this.before = before.before;

        before.before.after = this;

        before.after = after;
        before.before = this;

        after.before = before;
    }

    moveForward() {
        const before = this.before;
        const after = this.after;

        this.after = after.after;
        this.before = after;

        after.after.before = this;

        after.before = before;
        after.after = this;

        before.after = after;
    }
}

const elements: Element[] = input.split('\n').map(val => new Element(Number.parseInt(val, 10)));

function runDecryption(elements: Element[], timesToRun: number = 1): number {
    elements.forEach((element, index) => {
        element.before = elements[(elements.length + (index - 1)) % elements.length]
        element.after = elements[(index + 1) % elements.length]
    })

    for(let i=0; i < timesToRun; i++) {
        elements.forEach(element => {
            const val = element.value;

            if (val > 0) {
                for (let i = 0; i < (val % (elements.length - 1)); i++) {
                    element.moveForward();
                }
            } else {
                for (let i = 0; i > (val % (elements.length - 1)); i--) {
                    element.moveBack();
                }
            }
        })
    }

    const index = elements.findIndex((val) => val.value == 0);

    if (index === undefined) {
        throw Error('Type check');
    }

    let groveCoords = 0;

    let element = elements[index];

    for (let i = index; i <= index + 3000; i++) {
        if (i == index + 1000
            || i == (index + 2000)
            || i == (index + 3000)) {
            groveCoords += element.value;
        }
        element = element.after;
    }

    return groveCoords;
}

console.log(`Part 1: ${runDecryption(elements)}`)

const part2: Element[] = input.split('\n').map(val => new Element(811589153 * Number.parseInt(val, 10)));

console.log(`Part 2: ${runDecryption(part2, 10)}`)
