import * as fs from "fs";
import { getInputDirectory } from './util/getInput';
import * as dotenv from "dotenv";
import path = require("path");

const inputDir = getInputDirectory();

dotenv.config();

if (!process.env.SESSION_COOKIE) {
    console.log('No value for SESSION_COOKIE in env vars!');
    console.log('You probably want to copy and edit .env.example')
    process.exit(1);
}

let [year, day, force] = process.argv.slice(2);

if (year === undefined) {
    year = `${(new Date()).getFullYear()}`;
}

if (day === undefined) {
    // Get the current day
    day = `${Math.min((new Date).getDate(), 25)}`;
}

const fileName = `${inputDir}/${year}/day${day.length < 2 ? '0' : ''}${day}.txt`;

// First, have we got the file? If so, tell the user that and do nothing
if (!force && fs.existsSync(fileName)) {
    console.log('Already got input!');
    process.exit(0);
}

console.log('Fetching input from AoC...');

fetch(
    `https://adventofcode.com/${year}/day/${day}/input`,
    {
        headers: {
            cookie: `session=${process.env.SESSION_COOKIE}`,
            'User-Agent': 'node-fetch (pjr0911025+github@googlemail.com)'
        }
    }
).then(response => {
    if (!response.ok) {
        return response.text().then(body => { throw new Error(body) });
    }
    return response.text();
}).then(body => {
    try {
        fs.mkdirSync(path.dirname(fileName));
    }
    catch (e) {
        // ignore the error
    }
    fs.writeFileSync(fileName, body)
    console.log(`Written to ${fileName}`);
}).catch(val => {
    console.log(val);
});
