import getInput from "./util/getInput";
import parseInt from "../util/parseInt";

const testInputs = {
    'example': `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`
}

const input = getInput(testInputs, 2);

type Game = {
    id: number,
    revealed: {
        red: number,
        blue: number,
        green: number
    }[]
}

const games: Game[] = input.split('\n')
    .map(row => {
        const [gameId, turns] = row.split(':');

        const id = parseInt(gameId.split(' ')[1], 10);
        const revealed: Game["revealed"] = turns.split(';')
            .map(turn => {
                const reveal = {
                    red: 0,
                    blue: 0,
                    green: 0
                };

                turn.trim().split(', ')
                    .forEach(val => {
                        const [number, colour] = val.split(' ');

                        if (['red', 'blue', 'green'].includes(colour)) {
                            reveal[colour as 'red' | 'blue' | 'green'] = parseInt(number)
                        }
                    })

                return reveal;
            });

        return {id, revealed}
    })

const validGames = games.filter(
    ({revealed}) => revealed.every(
        ({red, green, blue}) =>
            red <= 12 && green <= 13 && blue <= 14
    )
);

console.log(`Part 1: ${validGames.reduce((previousValue, currentValue) => previousValue + currentValue.id, 0)}`)

const powers = games.map(game => {
    let [maxRed, maxBlue, maxGreen] = [0, 0, 0];

    game.revealed.forEach(({red, blue, green}) => {
        maxRed = Math.max(maxRed, red);
        maxBlue = Math.max(maxBlue, blue);
        maxGreen = Math.max(maxGreen, green);
    })

    return maxRed * maxBlue * maxGreen;
});
console.log(`Part 2: ${powers.reduce((previousValue, currentValue) => previousValue+currentValue)}`);
