import getInput from "./util/getInput";

const exampleInput = `--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14`;

const realInput = getInput(19);

const input = realInput;

type Point = {
    x: number,
    y: number,
    z: number
}

type Rotation = {
    direction: { [Prop in keyof Point]: -1 | 1 }
    maps: { [Prop in keyof Point]: keyof Point }
};

type Scanner = {
    id: number,
    knownPosition?: Point,
    rotation?: Rotation,
    beacons: Point[]
};

const scanners: Scanner[] = input.split("\n\n").map(
    (scannerInput, id) => {
        return {
            id,
            beacons: scannerInput.split("\n").slice(1).map(
                row => {
                    const [x, y, z] = row.split(',').map(val => Number.parseInt(val, 10));

                    return {x, y, z};
                }
            )
        }
    }
);

const knownBeacons = new Map<string, true>();

const knownScanners: Scanner[] = [];

function setScannerPosition(scannerNumber: number, {x, y, z}: Point, rotation: Rotation) {
    console.log(`Placing ${scannerNumber}`);
    const scanner = scanners[scannerNumber];
    const {direction, maps} = rotation;

    if (scanner === undefined) {
        throw Error('Unknown scanner number');
    }

    if (scanner.knownPosition !== undefined) {
        throw Error('Already know position?')
    }

    scanner.knownPosition = {x, y, z}
    scanner.rotation = rotation;

    scanner.beacons.forEach(
        value => {
            const {x1, y1, z1} = {
                x1: x + (direction.x * value[maps.x]),
                y1: y + (direction.y * value[maps.y]),
                z1: z + (direction.z * value[maps.z])
            };

            knownBeacons.set(`${x1},${y1},${z1}`, true);
        }
    );

    knownScanners.push(scanner);
}

setScannerPosition(
    0,
    {x: 0, y: 0, z: 0},
    {
        direction: {x: 1, y: 1, z: 1},
        maps: {x: 'x', y: 'y', z: 'z'}
    }
);

function pointsFromScanner(scanner: Scanner, rotation: Rotation): Point[] {
    return scanner.beacons.map(
        beacon => rotatePoint(beacon, rotation)
    );
}

const ALL_DIRECTIONS: Rotation["direction"][] = [
    {x: 1, y: 1, z: 1},
    {x: 1, y: 1, z: -1},
    {x: 1, y: -1, z: 1},
    {x: 1, y: -1, z: -1},
    {x: -1, y: 1, z: 1},
    {x: -1, y: 1, z: -1},
    {x: -1, y: -1, z: 1},
    {x: -1, y: -1, z: -1},
];

const ALL_MAPS: Rotation["maps"][] = [
    {x: "x", y: "y", z: "z"},
    {x: "x", y: "z", z: "y"},
    {x: "z", y: "y", z: "x"},
    {x: "z", y: "x", z: "y"},
    {x: "y", y: "x", z: "z"},
    {x: "y", y: "z", z: "x"},
]

const ALL_ROTATIONS: Rotation[] = ALL_DIRECTIONS.map(
    direction => ALL_MAPS.map(
        (maps): Rotation => {
            return {direction, maps}
        }
    )
).flat();

function rotatePoint(point: Point, {direction, maps}: Rotation): Point {
    return {
        x: direction.x * point[maps.x],
        y: direction.y * point[maps.y],
        z: direction.z * point[maps.z],
    }
}

function deltaFromPoints(points: Point[], base: number): string[] {
    const {x, y, z} = points[base];

    const otherPoints = points.slice(0, base);
    otherPoints.push(...points.slice(base + 1));

    return otherPoints.map(
        point => `${x - point.x},${y - point.y},${z - point.z}`
    );
}

function attemptToPlaceScanner(scanner: Scanner) {
    if (scanner.knownPosition !== undefined) {
        return;
    }

    if (knownScanners.length == scanners.length) {
        return;
    }

    for (let i = 0; i < knownScanners.length; i++) {
        const knownScanner = knownScanners[i];
        if (!knownScanner.rotation || !knownScanner.knownPosition) {
            throw Error('A known scanner should have a known rotation');
        }

        const knownPoints = pointsFromScanner(knownScanner, knownScanner.rotation)

        for (let j = 0; j < knownPoints.length; j++) {
            const deltasFromKnown = deltaFromPoints(knownPoints, j);

            // We first need to find two points that have the same deltas in both sets
            // As soon as we do so, we can then just iterate through the remaining list and
            // find the other points that have the same delta from one of those points
            for (let k = 0; k < ALL_ROTATIONS.length; k++) {
                const rotation = ALL_ROTATIONS[k];
                const thisPoints = pointsFromScanner(scanner, rotation);
                for (let l = 0; l < thisPoints.length; l++) {
                    if (deltaFromPoints(thisPoints, l).filter(val => deltasFromKnown.includes(val)).length >= 11) {
                        const thisPoint = thisPoints[l];
                        const knownPoint = knownPoints[j];
                        const scannerPosition = {
                            x: knownPoint.x + knownScanner.knownPosition.x - thisPoint.x,
                            y: knownPoint.y + knownScanner.knownPosition.y - thisPoint.y,
                            z: knownPoint.z + knownScanner.knownPosition.z - thisPoint.z,
                        };
                        setScannerPosition(
                            scanner.id,
                            scannerPosition,
                            rotation
                        );
                        return;
                    }
                }
            }
        }
    }
}

while (scanners.some(scanner => scanner.knownPosition === undefined)) {
    console.log(`${knownScanners.length} / ${scanners.length} placed`);
    scanners.forEach(attemptToPlaceScanner);
}

const manhattens = scanners.map(
    (thisScanner, index) => {
        const thisPos = thisScanner.knownPosition;

        if (!thisPos) {
            throw Error('Should have all positions');
        }

        const {x, y, z} = thisPos;

        return Math.max(...scanners.map(
            (nextScanner, nextIndex): number => {
                if (index == nextIndex) {
                    return 0;
                }

                const thisPos = nextScanner.knownPosition;

                if (!thisPos) {
                    throw Error('Should have all positions');
                }

                return Math.abs(x - thisPos.x) + Math.abs(y - thisPos.y) + Math.abs(z - thisPos.z);
            }
        ))
    }
)

console.log(`Part 1: ${knownBeacons.size}`);
console.log(`Part 2: ${Math.max(...manhattens)}`);
