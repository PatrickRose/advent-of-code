import getInput from "./util/getInput";

const sampleInput = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

const input = getInput(7);

const directories: Map<string, Directory> = new Map()

class Directory {
    readonly parent: Directory | undefined;
    readonly directories: Map<string, Directory> = new Map();

    #totalSize: number | null = null;
    #files: number[] = [];

    public constructor(parent?: Directory) {
        this.parent = parent;
    }

    public getSize(): number {
        if (this.#totalSize === null) {
            this.#totalSize = this.#files.reduce(
                (previous, current) => previous + current,
                0
            )

            this.directories.forEach((val) => {
                if (this.#totalSize === null) {
                    throw Error('Type checker has broken');
                }

                this.#totalSize += val.getSize();
            })
        }

        return this.#totalSize;
    }

    public addFile(file: number) {
        this.#files.push(file);
    }
}

let currentDir = new Directory();
const allDirectories: Directory[] = [currentDir];

// ignore the first line, that's always "cd /"
input.split('\n').slice(1).forEach(line => {
    if (line == '$ ls') {
        return;
    }

    const dirMatch = line.match(/^dir (.+)$/);

    if (dirMatch) {
        const dirName = dirMatch[1];
        const newDir = new Directory(currentDir);
        allDirectories.push(newDir);
        currentDir.directories.set(dirName, newDir);

        return;
    }

    const fileMatch = line.match(/^(\d+) .+$/);

    if (fileMatch) {
        currentDir.addFile(Number.parseInt(fileMatch[1], 10));

        return;
    }

    const cdMatch = line.match(/^\$ cd (.+)$/);

    if (cdMatch) {
        const newDir = cdMatch[1];

        if (newDir == '..') {
            if (!currentDir.parent) {
                throw Error('Tried to move above the root');
            }
            currentDir = currentDir.parent;

            return;
        }

        const next = currentDir.directories.get(newDir);

        if (!next) {
            throw Error('Tried to move to unknown directory');
        }

        currentDir = next;
        return;
    }

    throw new Error(`${line} did not match any regex?`);
});

const directorySizes = allDirectories.map(
    directory => directory.getSize()
);

directorySizes.filter((a, b) => a - b);

const partOne = directorySizes.filter(
    directory => directory <= 100000
).reduce(
    (prev, curr) => prev + curr
);

console.log(`Part 1: ${partOne}`)

const totalDiskSpace = 70000000;
const needed = 30000000;

const used = directorySizes[0];

for (const possible of directorySizes.reverse()) {
    if (used - possible + needed < totalDiskSpace) {
        console.log(`Part 2: ${possible}`);
        break;
    }
}
