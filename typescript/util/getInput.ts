import * as fs from "fs";

export default function getInput(year: number, day: number) {
    const filename = day < 10 ? `0${day}` : day.toString(10)

    return fs.readFileSync(`${__dirname}/../../input/${year}/day${filename}.txt`).toString('utf-8').trim();
}
