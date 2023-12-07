import getInput from "./util/getInput";
import parseInt from "../util/parseInt";

const testInputs = {
    example: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
    exampleDifferentOrder: `32T3K 765
QQQJA 483
T55J5 684
KK677 28
KTJJT 220`
}

const input = getInput(testInputs, 7);

type HandType = 'Five' | 'Four' | 'Full' | 'Three' | 'Two' | 'One' | 'High';

type Hand = {
    hand: string,
    bid: number,
    type: HandType
}

function getHandType(hand: string): HandType {
    const sorted = hand.split('').sort().join('');

    if (sorted.match(/(.)\1{4}/)) {
        return 'Five';
    }

    if (sorted.match(/(.)\1{3}/)) {
        return 'Four';
    }

    if (sorted.match(/(.)\1{2}(.)\2{1}/)
        || sorted.match(/(.)\1{1}(.)\2{2}/)) {
        return 'Full';
    }

    if (sorted.match(/(.)\1{2}/)) {
        return 'Three';
    }

    if (sorted.match(/(.)\1.*(.)\2/)) {
        return 'Two';
    }

    if (sorted.match(/(.)\1/)) {
        return 'One';
    }

    return 'High';
}

const hands: Hand[] = input.split('\n').map(
    row => {
        const [hand, bid] = row.split(' ');

        return {
            hand,
            bid: parseInt(bid),
            type: getHandType(hand)
        }
    }
);

function getValueOfHands(hands: Hand[], jokersWild: boolean): number {
    const handTypeRank: Record<HandType, number> = {
        Five: 7,
        Four: 6,
        Full: 5,
        Three: 4,
        Two: 3,
        One: 2,
        High: 1,
    }

    const cardValue = jokersWild
        ? ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J']
        : ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

    const sortedHands = [...hands].sort((a, b) => {
        const aRank = handTypeRank[a.type];
        const bRank = handTypeRank[b.type];

        if (aRank > bRank) {
            return 1;
        }

        if (aRank < bRank) {
            return -1;
        }

        for (let i = 0; i < 5; i++) {
            const aVal = cardValue.indexOf(a.hand[i]);
            const bVal = cardValue.indexOf(b.hand[i]);

            if (aVal < bVal) {
                return 1;
            }

            if (aVal > bVal) {
                return -1;
            }
        }

        return 0;
    });

    return sortedHands.reduce(
        (previousValue, currentValue, currentIndex) => {
            return previousValue + currentValue.bid * (currentIndex + 1);
        },
        0
    );
}

console.log(`Part 1: ${getValueOfHands(hands, false)}`);

function handFromJoker(hand: HandType, jokerCount: number): HandType {
    if (jokerCount == 0) {
        return hand;
    }

    switch (hand) {
        case "Five":
            return hand;
        case "Four":
            return 'Five';
        case "Full":
            return 'Five';
        case "Three":
            return 'Four';
        case "Two":
            return jokerCount == 2
                ? 'Four'
                : 'Full'
        case "One":
            return 'Three';
        case "High":
            return 'One'
    }
}

const part2Hands: Hand[] = hands.map(hand => {
    // Count the number of 'J'
    const jokerCount = hand.hand.match(/J/g)?.length ?? 0;

    return {
        ...hand,
        type: handFromJoker(hand.type, jokerCount)
    }
})

const part2 = getValueOfHands(part2Hands, true);

console.log(`Part 2: ${part2}`);
