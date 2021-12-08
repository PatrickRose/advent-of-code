import getInput from "./util/getInput";

const exampleInput = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`;

const realInput = getInput(8);

const input = realInput;

type Text = {
    input: string,
    output: string
};

const values: Text[] = input.split("\n").map(val => {
    const [input, output] = val.split(' | ');

    return {input, output};
});

const part1 = values.map(val => val.output.split(' ').filter(signal => [2, 4, 3, 7].includes(signal.length)).length).reduce((curr, val) => curr + val);

console.log(`Part 1: ${part1}`);

type Segment = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';

type SegmentMap = {
    [T in Segment]?: Segment
}

type NumberSegment = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
const part2 = values.map(
    ({input, output}) => {
        const segmentMap: SegmentMap = {}

        const val: { [key: number]: Segment[][] } = {
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: []
        };

        const numberMap: { [key: string]: NumberSegment } = {};
        const reverseMap: { [key in NumberSegment]?: Segment[] } = {};

        function linkSegmentListToNumber(segments: Segment[], number: NumberSegment) {
            numberMap[segments.join('')] = number;
            reverseMap[number] = segments;
        }

        const inputs = input.split(' ');

        inputs.forEach(input => {
            const toAdd: Segment[] = input.split('').map(val => {
                    if (val == 'a' || val == 'b' || val == 'c' || val == 'd' || val == 'e' || val == 'f' || val == 'g') {
                        return val;
                    }
                    throw Error('Should never happen');
                }
            )

            toAdd.sort()
            val[input.length].push(toAdd)
        });

        linkSegmentListToNumber(val[2][0], '1');
        linkSegmentListToNumber(val[3][0], '7');
        linkSegmentListToNumber(val[4][0], '4');
        linkSegmentListToNumber(val[7][0], '8');

        const segmentsIn7 = reverseMap['7'];

        if (segmentsIn7 === undefined) {
            throw Error('Type checked');
        }

        for (let segment of segmentsIn7) {
            const segmentsFor1 = reverseMap["1"];

            if (segmentsFor1 === undefined) {
                throw Error('Type checked');
            }

            if (!segmentsFor1.includes(segment)) {
                segmentMap['a'] = segment
                break;
            }
        }


        for (let possible9 of val[6]) {
            // We can then find the 9 from the 4.
            // Use a slice to avoid issues
            const segmentsIn4 = reverseMap["4"];
            if (segmentsIn4 == undefined) {
                throw Error('Type checked');
            }
            const segmentsIn9: Segment[] = segmentsIn4.slice();
            if (segmentMap.a === undefined) {
                throw Error('Must have a segment by now');
            }
            segmentsIn9.push(segmentMap.a);

            // There should be *exactly* one segment in the list that isn't in 9
            // That will then be G
            const possibleGs = possible9.filter(val => !segmentsIn9.includes(val));

            if (possibleGs.length == 1) {
                if (reverseMap["9"] !== undefined) {
                    throw Error('Multiple things mapped to 9');
                }

                segmentMap.g = possibleGs[0];
                linkSegmentListToNumber(possible9, '9');
            }
        }

        const segments9 = reverseMap[9];

        if (segments9 == undefined) {
            throw Error('Should have got a 9 from this!');
        }

        // Now we have the c, we can get the f
        const segmentsIn1 = reverseMap['1'];

        if (segmentsIn1 === undefined) {
            throw Error('Type checked');
        }

        // Getting the 9 gives us a load of useful info!
        // The 5 is the 9 with a single missing
        // But that missing one *must* be in 1
        const possible5s = val[5].map(
            possible5 => {
                return {
                    possibleCs: segments9.filter(val => !possible5.includes(val) && segmentsIn1.includes(val)),
                    missingElements: possible5.filter(val => !segments9.includes(val)),
                    possible5
                }
            }
        ).filter(({possibleCs, missingElements}) => possibleCs.length == 1 && missingElements.length == 0);

        if (possible5s.length != 1) {
            throw Error('Did not get a single possible 5');
        }

        const {possibleCs, possible5} = possible5s[0];
        segmentMap.c = possibleCs[0];
        linkSegmentListToNumber(possible5, '5');

        segmentMap.f = segmentsIn1.filter(val => val != segmentMap.c)[0];

        const possible3s = val[5].map(
            possible3 => {
                return {
                    possibleBs: segments9.filter(val => !possible3.includes(val) && !segmentsIn1.includes(val)),
                    missingElements: possible3.filter(val => !segments9.includes(val)),
                    possible3
                }
            }
        ).filter(({possibleBs, missingElements}) => possibleBs.length == 1 && missingElements.length == 0);

        if (possible3s.length != 1) {
            throw Error('Did not get a single possible 3');
        }

        const {possibleBs, possible3} = possible3s[0];
        segmentMap.b = possibleBs[0];
        linkSegmentListToNumber(possible3, '3');

        // At this point, we have a, b, c, f, g
        // That means we know all of the segments for 0, except e
        // Luckily, that's easy to get!
        const segmentsFor0: Segment[] = (['a', 'b', 'c', 'f', 'g'] as Segment[]).map(
            (segment: Segment) => {
                const mapped = segmentMap[segment];

                if (mapped === undefined) {
                    throw Error(`${segment} does not have a mapping?`);
                }

                return mapped;
            }
        )

        // Since we've found 9, once we find 0 we've found 6 as well
        val[6].forEach(val => {
            const str = val.join('');

            if (numberMap[str] !== undefined) {
                // this is 9, do nothing
                return;
            }

            const filter = segmentsFor0.filter(seg => !val.includes(seg));

            if (filter.length != 0) {
                // This must be 6
                linkSegmentListToNumber(val, '6');
            } else {
                linkSegmentListToNumber(val, '0');
            }
        })

        // Finally, segment 2 is the last number
        val[5].filter(val => {

            const str = val.join('');

            if (numberMap[str] !== undefined) {
                // this already known
                return;
            }
            linkSegmentListToNumber(val, '2');
        });

        // Now we just convert the outputs:

        return Number.parseInt(
            output.split(' ').map(
                val => {
                    const key = val.split('');

                    key.sort();

                    const numberMapElement = numberMap[key.join('')];

                    if (numberMapElement === undefined) {
                        throw Error(`Did not have mapping for ${val}`);
                    }

                    return numberMapElement;
                }
            ).join(''),
            10
        )
    }
);

console.log(`Part 2: ${part2.reduce(((previousValue, currentValue) => currentValue + previousValue))}`);
