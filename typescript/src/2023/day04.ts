import getInput from "./util/getInput";
import parseInt from "../util/parseInt";

const testInputs = {
    'example': `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`
}

const input = getInput(testInputs, 4);

type Card = {
    id: number,
    numbers: number[],
    winning: number[]
};

const cards: Card[] = input.split('\n')
    .map(row => {
        const [cardID, scratchNums] = row.split(':');
        const id = parseInt(cardID.split(/\s+/)[1]);

        const [strWin, strNum] = scratchNums.trim().split(' | ');

        return {
            id,
            numbers: strNum.split(/\s+/).map(val => parseInt(val)),
            winning: strWin.split(/\s+/).map(val => parseInt(val)),
        }
    });

const part1 = cards.map(({numbers, winning}) => {
    const count = numbers.filter(val => winning.includes(val)).length;

    return count > 0 ? 2 ** (count - 1) : 0;
});

console.log(`Part 1: ${part1.reduce((prev, curr) => prev+curr)}`);

const cardMap: Map<number, Card & {wins: number[]}> = new Map();
const cardCounts: Map<number, number> = new Map();
cards.forEach(card => {
    const count = card.numbers.filter(val => card.winning.includes(val)).length;

    const wins: number[] = [];
    while (wins.length < count) {
        wins.push(card.id + wins.length + 1);
    }

    cardMap.set(card.id, {
        ...card,
        wins
    });
    cardCounts.set(card.id, 1);
});

let numCards = cards.length;

while (cardCounts.size > 0) {
    for (let key = 1; key <= cards.length; key++) {
        const val = cardCounts.get(key) ?? 0;
        const selectedCard = cardMap.get(key);

        if (selectedCard === undefined) {
            throw new Error(`Tried to access card ${key} that does not exist`);
        }

        selectedCard.wins.forEach(wins => {
            cardCounts.set(wins, (cardCounts.get(wins) ?? 0) + val);
            numCards += val;
        })

        cardCounts.delete(key);
    }
}

console.log(`Part 2: ${numCards}`)
