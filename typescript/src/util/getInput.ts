import * as fs from "fs";
import * as path from "path";

export function getInputDirectory(): string {
    let dir = fs.opendirSync(`${__dirname}`);

    while (path.basename(dir.path) != 'typescript') {
        dir = fs.opendirSync(path.dirname(dir.path));
    }

    return fs.opendirSync(`${path.dirname(dir.path)}/input`).path;
}

export default function getInput(year: number, day: number) {
    const filename = day < 10 ? `0${day}` : day.toString(10);

    const inputDir = getInputDirectory();

    return fs.readFileSync(`${inputDir}/${year}/day${filename}.txt`).toString('utf-8').trim();
}
