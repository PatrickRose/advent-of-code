import * as fs from "fs";
import * as path from "path";

export function getRootDirectory() {
    let dir = fs.opendirSync(`${__dirname}`);

    while (path.basename(dir.path) != 'typescript') {
        dir = fs.opendirSync(path.dirname(dir.path));
    }

    return path.dirname(dir.path);
}

export function getInputDirectory(): string {
    const dir = getRootDirectory();

    return fs.opendirSync(`${dir}/input`).path;
}

export default function getInput(year: number, day: number) {
    const filename = (new Intl.NumberFormat(undefined, {minimumIntegerDigits:2})).format(day);

    const inputDir = getInputDirectory();

    return fs.readFileSync(`${inputDir}/${year}/day${filename}.txt`).toString('utf-8').trimEnd();
}
