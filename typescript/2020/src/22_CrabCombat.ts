import getInput from "./util/getInput";

const input = getInput(22);
`Player 1:
43
19

Player 2:
2
29
14`;


type Deck = Array<number>;

const decks = input.split("\n\n");

const player1: Deck = decks[0].split("\n").slice(1).map(val => Number(val))
const player2: Deck = decks[1].split("\n").slice(1).map(val => Number(val))

while (player1.length > 0 && player2.length > 0) {
    const player1Card = player1.shift();
    const player2Card = player2.shift();

    if (player1Card === undefined || player2Card === undefined) {
        throw new Error(`Should never happen`);
    }

    if (player1Card > player2Card) {
        player1.push(player1Card, player2Card);
    } else {
        player2.push(player2Card, player1Card);
    }
}

let part1: number;

function scoreDeck(previous: number, current: number, index: number, all: Deck): number {
    return previous + (current * (all.length - index))
}

if (player1.length == 0) {
    part1 = player2.reduce(
        scoreDeck,
        0
    );
} else {
    part1 = player1.reduce(
        scoreDeck,
        0
    );
}

console.log(`Part 1: ${part1}`);

const recursive1: Deck = decks[0].split("\n").slice(1).map(val => Number(val))
const recursive2: Deck = decks[1].split("\n").slice(1).map(val => Number(val))

function recursiveCombat(player1: Deck, player2: Deck, gameNumber: number): [Deck, boolean] {
    // console.log(`=== Game ${gameNumber} ===`);

    const turnsSeen = new Map<string, true>();
    let round = 1;

    while (player1.length > 0 && player2.length > 0) {
        const turnCacheKey: string = [player1.join(','), player2.join(',')].join('|');

        // console.log(`-- Round ${round} (Game ${gameNumber}) --`);
        // console.log(`Player 1's deck: ${player1}`);
        // console.log(`Player 2's deck: ${player2}`);

        let player1Win: boolean;

        if (turnsSeen.get(turnCacheKey)) {
            // console.log('Seen this turn before - player 1 wins!');
            return [player1, true]
        }

        const player1Card = player1.shift();
        const player2Card = player2.shift();

        // console.log(`Player 1 plays: ${player1Card}`);
        // console.log(`Player 2 plays: ${player2Card}`);

        if (player1Card === undefined || player2Card === undefined) {
            throw new Error(`Should never happen`);
        }

        if (player1.length >= player1Card && player2.length >= player2Card) {
            // console.log('Playing a sub-game to determine the winner...')
            player1Win = recursiveCombat(player1.slice(0, player1Card), player2.slice(0, player2Card), gameNumber + 1)[1];
        } else {
            player1Win = player1Card > player2Card;
        }

        // console.log(`Player ${player1Win ? 1 : 2} wins round ${round} of game ${gameNumber}!`);

        if (player1Win) {
            player1.push(player1Card, player2Card);
        } else {
            player2.push(player2Card, player1Card);
        }

        turnsSeen.set(turnCacheKey, true);
        round++;
    }

    return [player1.length != 0 ? player1 : player2, player1.length != 0];
}

console.log(`Part 2: ${recursiveCombat(recursive1, recursive2, 1)[0].reduce(scoreDeck, 0)}`);
