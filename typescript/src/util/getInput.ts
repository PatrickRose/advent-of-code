import * as fs from "fs";
import * as path from "path";

export function getRootDirectory() {
    let dir = fs.opendirSync(`${__dirname}`);

    while (path.basename(dir.path) != 'typescript') {
        const newPath = dir.path;
        dir.closeSync()
        dir = fs.opendirSync(path.dirname(newPath));
    }

    try {
        return path.dirname(dir.path);
    } finally {
        dir.closeSync();
    }
}

export function getInputDirectory(): string {
    const dir = getRootDirectory();

    const directory = fs.opendirSync(`${dir}/input`);

    try {
        return directory.path;
    } finally {
        directory.closeSync()
    }
}

export default function getInput(year: number, day: number) {
    const filename = (new Intl.NumberFormat(undefined, {minimumIntegerDigits:2})).format(day);

    const inputDir = getInputDirectory();

    return fs.readFileSync(`${inputDir}/${year}/day${filename}.txt`).toString('utf-8').trimEnd();
}
