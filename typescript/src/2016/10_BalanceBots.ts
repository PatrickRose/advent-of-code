import getInput from "./util/getInput";

const input = getInput(10).split("\n");

let part1Stop = false;

const allBots: Map<number, Bot> = new Map();
const outputs: Map<number, number> = new Map();

class Bot {
    private numbers: number[] = [];

    constructor(private readonly id: number, public readonly low: [boolean, number], public readonly high: [boolean, number]) { }

    public recieve(number: number) {
        this.numbers.push(number);

        if (this.numbers.length == 2) {
            this.numbers.sort((a, b) => (a - b));

            if (this.numbers[0] == 17 && this.numbers[1] == 61) {
                console.log(`Part 1: ${this.id}`);
            }

            const [low, high] = this.numbers;
            this.numbers = [];

            if (this.low[0]) {
                const lowBot = allBots.get(this.low[1])
                if (!lowBot) {
                    throw Error(`Don't have a value for ${low}`);
                }
                lowBot.recieve(low);
            } else {
                outputs.set(this.low[1], low);
            }

            if (this.high[0]) {
                const highBot = allBots.get(this.high[1])
                if (!highBot) {
                    throw Error(`Don't have a value for ${high}`);
                }
                highBot.recieve(high);
            } else {
                outputs.set(this.high[1], high);
            }
        }
    }
}

input.filter(row => row.slice(0, 3) == 'bot').forEach(
    row => {
        const regex = row.match(/bot (\d+) gives low to (output|bot) (\d+) and high to (output|bot) (\d+)/);

        if (!regex) {
            throw Error(`Shouldn't happen: ${row}`);
        }

        const [id, low, high] = [regex[1], regex[3], regex[5]].map(val => Number.parseInt(val, 10));
        const [lowType, highType] = [regex[2] == 'bot', regex[4] == 'bot']

        allBots.set(
            id,
            new Bot(id, [lowType, low], [highType, high])
        );
    }
)

input.filter(row => row.slice(0, 5) == 'value').forEach(
    row => {
        const regex = row.match(/value (\d+) goes to bot (\d+)/);


        if (!regex) {
            throw Error(`Shouldn't happen: ${row}`);
        }

        const [value, botId] = [regex[1], regex[2]].map(val => Number.parseInt(val, 10))

        const bot = allBots.get(botId);

        if (!bot) {
            throw Error(`Don't have a value for ${botId}`);
        }

        bot.recieve(value);
    }
)

const inputs = [0, 1, 2];

const part2 = inputs.map(current => {
    const newVal = outputs.get(current);

    if (newVal === undefined) {
        throw Error(`Did not have value for ${current}`);
    }
    return newVal;
}).reduce(
    (previous, current) => {
        return previous * current;
    }
);

console.log(`Part 2: ${part2}`);
