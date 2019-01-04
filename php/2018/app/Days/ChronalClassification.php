<?php

namespace PatrickRose\AdventOfCode\Days;

use PatrickRose\AdventOfCode\Util\Instructions\AbstractInstruction;
use PatrickRose\AdventOfCode\Util\Registers;

class ChronalClassification extends AbstractDay
{

    protected const OPCODES = [
        'addr', 'addi',
        'mulr', 'muli',
        'banr', 'bani',
        'borr', 'bori',
        'setr', 'seti',
        'gtri', 'gtir', 'gtrr',
        'eqri', 'eqir', 'eqrr',
    ];

    public function getAnswer(bool $partTwo): string
    {
        $input = $this->getPuzzleInput();

        // split the input into "Instructions" and "Program"
        $lines = explode("\n", $input);
        $program = [];
        $descriptions = [];

        while (true) {
            $firstLine = array_shift($lines);
            if ($firstLine !== "") {
                $before = $firstLine;
                preg_match('/.+\[(.+)\]/', $before, $matches);
                $before = explode(',', $matches[1]);
                $instruction = explode(' ', array_shift($lines));
                $after = array_shift($lines);
                preg_match('/.+\[(.+)\]/', $after, $matches);
                $after = explode(',', $matches[1]);
                $descriptions[] = [
                    'Before' => $before,
                    'Instruction' => $instruction,
                    'After' => $after,
                ];
                array_shift($lines);
            } else {
                while ($firstLine == '') {
                    $firstLine = array_shift($lines);
                }
                $program = array_merge([$firstLine], $lines);
                break;
            }
        }

        $possibleInstructions = [];
        $definiteInstructions = [];
        $partOne = 0;

        // Now we need to work out which instruction each thing could be


        foreach ($descriptions as $index => $description) {
            $thisInstruction = [];
            $opCode = $description['Instruction'][0];

            foreach (AbstractInstruction::INSTRUCTIONS as $possibleInstruction) {
                if ($possibleInstruction::matches(...array_values($description))) {
                    $thisInstruction[] = $possibleInstruction;
                }
            }

            if (count($thisInstruction) >= 3) {
                $partOne++;
            }

            if (count($thisInstruction) == 1) {
                // Then the example in this op code _must_ be this op code
                $definiteInstructions[$opCode] = end($thisInstruction);
                foreach ($possibleInstructions as &$possible) {
                    $toRemove = array_search($definiteInstructions[$opCode], $possible);
                    if ($toRemove) {
                        unset($possible[$toRemove]);
                    }
                }
            } elseif (isset($definiteInstructions[$opCode])) {
                // Then we know what this is already - skip it
                continue;
            } elseif (!isset($possibleInstructions[$opCode])) {
                $possibleInstructions[$opCode] = array_diff($thisInstruction, $definiteInstructions);
            } else {
                $possibleInstructions[$opCode] = array_diff(array_intersect($possibleInstructions[$opCode], $thisInstruction), $definiteInstructions);
                if (count($possibleInstructions[$opCode]) == 1) {
                    $definiteInstructions[$opCode] = end($possibleInstructions[$opCode]);
                    foreach ($possibleInstructions as &$possible) {
                        $toRemove = array_search($definiteInstructions[$opCode], $possible);
                        if ($toRemove) {
                            unset($possible[$toRemove]);
                        }
                    }
                }
            }
        }

        while (count($definiteInstructions) != 16) {
            foreach (AbstractInstruction::INSTRUCTIONS as $instruction) {
                $opCodes = array_filter(
                    $possibleInstructions,
                    function ($values) use ($instruction) {
                        return in_array($instruction, $values);
                    }
                );

                if (count($opCodes) == 1) {
                    // Only one op code has this value, so we know it matches
                    $definiteInstructions[$opCodes[0]] = $instruction;

                    foreach ($possibleInstructions as &$possible) {
                        $toRemove = array_search($definiteInstructions[$opCodes[1]], $possible);
                        if ($toRemove) {
                            unset($possible[$toRemove]);
                        }
                    }
                }
            }

            // Find all the ones where there's only one value
            for ($i = 0; $i < 16; $i++) {
                $instruction = $possibleInstructions[$i] ?? [];
                if (count($instruction) == 1) {
                    $definiteInstructions[$i] = end($instruction);
                    foreach ($possibleInstructions as &$possible) {
                        $toRemove = array_search($definiteInstructions[$i], $possible);
                        if ($toRemove) {
                            unset($possible[$toRemove]);
                        }
                    }
                }
            }
        }

        if (!$partTwo) {
            return $partOne;
        }

        $registers = new Registers();

        /** @var AbstractInstruction[] $instructions */
        $instructions = array_map(
            function ($class) use ($registers) {
                return new $class($registers);
            },
            $definiteInstructions
        );

        foreach ($program as $instruction) {
            list($opcode, $a, $b, $c) = explode(" ", $instruction);
            $instructions[$opcode]->performInstruction($a, $b, $c);
        }

        return $registers->getValueOf(0);
    }

    protected function getPuzzleInput(): string
    {
        return <<<INPUT
Before: [0, 3, 3, 0]
5 0 2 1
After:  [0, 0, 3, 0]

Before: [0, 2, 3, 2]
3 3 2 3
After:  [0, 2, 3, 4]

Before: [2, 1, 0, 0]
10 1 2 3
After:  [2, 1, 0, 2]

Before: [0, 2, 3, 3]
14 2 2 3
After:  [0, 2, 3, 2]

Before: [3, 2, 2, 2]
10 0 3 1
After:  [3, 9, 2, 2]

Before: [2, 2, 1, 0]
10 0 3 2
After:  [2, 2, 6, 0]

Before: [1, 1, 2, 0]
7 0 2 2
After:  [1, 1, 2, 0]

Before: [2, 1, 0, 1]
9 2 1 3
After:  [2, 1, 0, 1]

Before: [1, 2, 0, 0]
0 0 1 1
After:  [1, 3, 0, 0]

Before: [2, 2, 1, 0]
3 0 2 3
After:  [2, 2, 1, 4]

Before: [2, 0, 0, 1]
3 0 2 3
After:  [2, 0, 0, 4]

Before: [1, 1, 0, 2]
9 2 1 1
After:  [1, 1, 0, 2]

Before: [2, 1, 3, 3]
15 1 3 0
After:  [3, 1, 3, 3]

Before: [1, 3, 2, 1]
4 0 1 1
After:  [1, 1, 2, 1]

Before: [0, 1, 3, 0]
14 2 2 0
After:  [2, 1, 3, 0]

Before: [1, 2, 3, 2]
3 3 2 0
After:  [4, 2, 3, 2]

Before: [0, 1, 3, 2]
5 0 2 3
After:  [0, 1, 3, 0]

Before: [0, 1, 3, 0]
15 0 1 0
After:  [1, 1, 3, 0]

Before: [0, 0, 2, 1]
12 3 2 2
After:  [0, 0, 3, 1]

Before: [1, 1, 1, 2]
2 2 1 2
After:  [1, 1, 1, 2]

Before: [0, 3, 1, 2]
3 3 2 0
After:  [4, 3, 1, 2]

Before: [0, 3, 1, 3]
4 2 1 3
After:  [0, 3, 1, 1]

Before: [2, 2, 1, 2]
10 3 3 1
After:  [2, 6, 1, 2]

Before: [1, 1, 3, 1]
12 3 2 2
After:  [1, 1, 3, 1]

Before: [3, 3, 2, 1]
12 3 2 1
After:  [3, 3, 2, 1]

Before: [0, 2, 2, 0]
5 0 1 1
After:  [0, 0, 2, 0]

Before: [0, 1, 3, 2]
7 2 3 0
After:  [6, 1, 3, 2]

Before: [1, 0, 3, 2]
10 2 3 1
After:  [1, 9, 3, 2]

Before: [3, 0, 1, 0]
0 2 0 2
After:  [3, 0, 3, 0]

Before: [0, 1, 3, 2]
12 3 1 0
After:  [3, 1, 3, 2]

Before: [0, 3, 3, 1]
0 0 1 1
After:  [0, 3, 3, 1]

Before: [3, 0, 1, 2]
0 1 3 0
After:  [2, 0, 1, 2]

Before: [1, 0, 3, 2]
11 2 3 3
After:  [1, 0, 3, 2]

Before: [2, 0, 2, 3]
1 0 2 2
After:  [2, 0, 4, 3]

Before: [1, 2, 1, 0]
7 0 1 1
After:  [1, 2, 1, 0]

Before: [1, 2, 3, 1]
7 3 1 0
After:  [2, 2, 3, 1]

Before: [1, 2, 3, 1]
14 2 2 1
After:  [1, 2, 3, 1]

Before: [0, 1, 0, 2]
9 2 1 2
After:  [0, 1, 1, 2]

Before: [2, 0, 2, 0]
1 0 2 1
After:  [2, 4, 2, 0]

Before: [1, 2, 1, 1]
0 1 2 2
After:  [1, 2, 3, 1]

Before: [1, 2, 2, 3]
7 2 3 0
After:  [6, 2, 2, 3]

Before: [2, 0, 3, 3]
7 2 3 0
After:  [9, 0, 3, 3]

Before: [2, 3, 3, 1]
14 2 2 3
After:  [2, 3, 3, 2]

Before: [0, 2, 2, 2]
1 3 2 1
After:  [0, 4, 2, 2]

Before: [2, 3, 2, 1]
8 2 2 3
After:  [2, 3, 2, 2]

Before: [0, 2, 0, 0]
13 0 0 0
After:  [0, 2, 0, 0]

Before: [1, 1, 2, 1]
6 3 0 3
After:  [1, 1, 2, 1]

Before: [2, 1, 3, 3]
14 2 2 2
After:  [2, 1, 2, 3]

Before: [3, 2, 2, 0]
15 3 2 1
After:  [3, 2, 2, 0]

Before: [2, 3, 1, 0]
4 2 1 3
After:  [2, 3, 1, 1]

Before: [3, 1, 1, 0]
2 2 1 1
After:  [3, 1, 1, 0]

Before: [0, 3, 3, 3]
8 3 1 0
After:  [3, 3, 3, 3]

Before: [0, 1, 0, 2]
9 2 1 1
After:  [0, 1, 0, 2]

Before: [1, 1, 0, 0]
9 2 1 2
After:  [1, 1, 1, 0]

Before: [0, 0, 1, 1]
13 0 0 0
After:  [0, 0, 1, 1]

Before: [0, 2, 1, 1]
13 0 0 0
After:  [0, 2, 1, 1]

Before: [3, 1, 2, 1]
12 3 2 2
After:  [3, 1, 3, 1]

Before: [2, 2, 1, 2]
3 1 2 2
After:  [2, 2, 4, 2]

Before: [2, 2, 3, 1]
11 2 0 3
After:  [2, 2, 3, 2]

Before: [1, 0, 3, 2]
7 2 3 3
After:  [1, 0, 3, 6]

Before: [2, 2, 3, 2]
11 2 0 2
After:  [2, 2, 2, 2]

Before: [2, 1, 0, 1]
2 3 1 2
After:  [2, 1, 1, 1]

Before: [1, 1, 2, 2]
15 0 3 2
After:  [1, 1, 3, 2]

Before: [2, 2, 0, 3]
3 0 2 1
After:  [2, 4, 0, 3]

Before: [3, 3, 1, 2]
10 0 3 3
After:  [3, 3, 1, 9]

Before: [2, 1, 1, 1]
2 2 1 1
After:  [2, 1, 1, 1]

Before: [0, 3, 1, 0]
13 0 0 3
After:  [0, 3, 1, 0]

Before: [3, 3, 3, 0]
10 2 3 1
After:  [3, 9, 3, 0]

Before: [0, 1, 2, 0]
5 0 2 2
After:  [0, 1, 0, 0]

Before: [2, 1, 0, 2]
12 3 1 1
After:  [2, 3, 0, 2]

Before: [3, 2, 2, 2]
1 2 2 0
After:  [4, 2, 2, 2]

Before: [1, 1, 1, 0]
9 3 1 1
After:  [1, 1, 1, 0]

Before: [0, 1, 3, 2]
12 3 1 2
After:  [0, 1, 3, 2]

Before: [1, 3, 1, 1]
6 2 0 2
After:  [1, 3, 1, 1]

Before: [0, 0, 3, 3]
8 3 0 2
After:  [0, 0, 3, 3]

Before: [2, 1, 2, 3]
1 0 2 1
After:  [2, 4, 2, 3]

Before: [1, 3, 1, 1]
4 2 1 3
After:  [1, 3, 1, 1]

Before: [1, 1, 3, 1]
12 3 2 0
After:  [3, 1, 3, 1]

Before: [0, 2, 2, 3]
14 3 2 0
After:  [2, 2, 2, 3]

Before: [1, 3, 2, 1]
10 1 3 0
After:  [9, 3, 2, 1]

Before: [3, 2, 2, 3]
14 3 2 2
After:  [3, 2, 2, 3]

Before: [0, 0, 3, 3]
8 3 1 2
After:  [0, 0, 3, 3]

Before: [1, 2, 3, 3]
14 2 2 1
After:  [1, 2, 3, 3]

Before: [2, 0, 1, 2]
3 0 2 2
After:  [2, 0, 4, 2]

Before: [1, 3, 2, 2]
1 3 2 1
After:  [1, 4, 2, 2]

Before: [1, 2, 3, 1]
12 3 2 1
After:  [1, 3, 3, 1]

Before: [1, 3, 1, 3]
6 2 0 3
After:  [1, 3, 1, 1]

Before: [0, 2, 1, 2]
0 0 1 2
After:  [0, 2, 2, 2]

Before: [0, 0, 3, 1]
12 3 2 2
After:  [0, 0, 3, 1]

Before: [3, 3, 0, 0]
10 0 3 2
After:  [3, 3, 9, 0]

Before: [2, 2, 2, 2]
1 3 2 3
After:  [2, 2, 2, 4]

Before: [3, 0, 2, 3]
7 0 2 3
After:  [3, 0, 2, 6]

Before: [0, 2, 1, 0]
13 0 0 2
After:  [0, 2, 0, 0]

Before: [1, 3, 1, 3]
15 0 3 2
After:  [1, 3, 3, 3]

Before: [3, 0, 2, 1]
1 2 2 1
After:  [3, 4, 2, 1]

Before: [2, 1, 0, 1]
9 2 1 2
After:  [2, 1, 1, 1]

Before: [1, 0, 0, 1]
6 3 0 0
After:  [1, 0, 0, 1]

Before: [0, 3, 1, 1]
10 1 3 2
After:  [0, 3, 9, 1]

Before: [3, 2, 2, 0]
0 3 1 0
After:  [2, 2, 2, 0]

Before: [3, 1, 0, 0]
9 2 1 1
After:  [3, 1, 0, 0]

Before: [0, 3, 0, 3]
13 0 0 3
After:  [0, 3, 0, 0]

Before: [1, 1, 0, 0]
9 2 1 3
After:  [1, 1, 0, 1]

Before: [0, 0, 1, 3]
15 0 3 2
After:  [0, 0, 3, 3]

Before: [0, 3, 2, 2]
14 1 2 0
After:  [2, 3, 2, 2]

Before: [0, 3, 3, 0]
10 2 3 0
After:  [9, 3, 3, 0]

Before: [0, 3, 3, 3]
0 0 1 1
After:  [0, 3, 3, 3]

Before: [0, 2, 3, 0]
11 2 1 1
After:  [0, 2, 3, 0]

Before: [0, 1, 3, 2]
7 2 3 2
After:  [0, 1, 6, 2]

Before: [1, 3, 1, 2]
4 2 1 1
After:  [1, 1, 1, 2]

Before: [1, 3, 1, 1]
6 3 0 2
After:  [1, 3, 1, 1]

Before: [0, 1, 1, 3]
2 2 1 0
After:  [1, 1, 1, 3]

Before: [2, 1, 1, 1]
2 3 1 1
After:  [2, 1, 1, 1]

Before: [2, 3, 2, 1]
14 1 2 1
After:  [2, 2, 2, 1]

Before: [1, 1, 1, 1]
2 2 1 1
After:  [1, 1, 1, 1]

Before: [1, 1, 0, 1]
9 2 1 3
After:  [1, 1, 0, 1]

Before: [1, 2, 3, 3]
7 0 1 0
After:  [2, 2, 3, 3]

Before: [3, 1, 1, 2]
15 1 3 2
After:  [3, 1, 3, 2]

Before: [0, 3, 1, 1]
0 0 2 0
After:  [1, 3, 1, 1]

Before: [3, 2, 0, 0]
5 2 0 1
After:  [3, 0, 0, 0]

Before: [1, 0, 1, 1]
6 2 0 1
After:  [1, 1, 1, 1]

Before: [3, 1, 0, 3]
9 2 1 0
After:  [1, 1, 0, 3]

Before: [2, 0, 2, 2]
1 3 2 0
After:  [4, 0, 2, 2]

Before: [3, 0, 2, 2]
1 3 2 3
After:  [3, 0, 2, 4]

Before: [3, 3, 1, 2]
4 2 1 2
After:  [3, 3, 1, 2]

Before: [2, 3, 3, 1]
14 2 2 2
After:  [2, 3, 2, 1]

Before: [0, 3, 1, 0]
13 0 0 2
After:  [0, 3, 0, 0]

Before: [0, 3, 3, 2]
10 2 3 3
After:  [0, 3, 3, 9]

Before: [0, 3, 3, 2]
10 3 3 2
After:  [0, 3, 6, 2]

Before: [0, 0, 1, 0]
5 1 0 0
After:  [0, 0, 1, 0]

Before: [2, 3, 1, 2]
3 0 2 3
After:  [2, 3, 1, 4]

Before: [2, 1, 2, 0]
1 0 2 0
After:  [4, 1, 2, 0]

Before: [1, 2, 0, 3]
3 1 2 2
After:  [1, 2, 4, 3]

Before: [1, 1, 2, 1]
2 3 1 3
After:  [1, 1, 2, 1]

Before: [2, 1, 0, 1]
9 2 1 0
After:  [1, 1, 0, 1]

Before: [1, 2, 3, 1]
4 3 1 1
After:  [1, 1, 3, 1]

Before: [0, 0, 2, 3]
15 1 2 3
After:  [0, 0, 2, 2]

Before: [3, 3, 1, 1]
10 1 3 1
After:  [3, 9, 1, 1]

Before: [3, 1, 0, 2]
9 2 1 2
After:  [3, 1, 1, 2]

Before: [0, 1, 2, 1]
15 2 1 1
After:  [0, 3, 2, 1]

Before: [1, 0, 3, 0]
10 0 2 2
After:  [1, 0, 2, 0]

Before: [1, 2, 3, 1]
12 3 2 3
After:  [1, 2, 3, 3]

Before: [0, 1, 3, 0]
13 0 0 2
After:  [0, 1, 0, 0]

Before: [1, 2, 1, 3]
6 2 0 3
After:  [1, 2, 1, 1]

Before: [0, 0, 2, 1]
5 0 3 2
After:  [0, 0, 0, 1]

Before: [3, 1, 3, 1]
2 3 1 1
After:  [3, 1, 3, 1]

Before: [2, 0, 2, 2]
1 3 2 1
After:  [2, 4, 2, 2]

Before: [1, 1, 0, 2]
9 2 1 0
After:  [1, 1, 0, 2]

Before: [1, 3, 3, 2]
4 0 1 1
After:  [1, 1, 3, 2]

Before: [1, 1, 3, 0]
9 3 1 2
After:  [1, 1, 1, 0]

Before: [0, 1, 1, 2]
12 3 1 1
After:  [0, 3, 1, 2]

Before: [3, 1, 2, 3]
14 3 2 2
After:  [3, 1, 2, 3]

Before: [1, 2, 3, 3]
7 3 3 0
After:  [9, 2, 3, 3]

Before: [0, 0, 2, 1]
8 2 2 2
After:  [0, 0, 2, 1]

Before: [1, 3, 0, 1]
4 0 1 3
After:  [1, 3, 0, 1]

Before: [1, 1, 2, 1]
6 3 0 1
After:  [1, 1, 2, 1]

Before: [2, 2, 3, 2]
14 2 2 0
After:  [2, 2, 3, 2]

Before: [2, 3, 0, 3]
3 0 2 0
After:  [4, 3, 0, 3]

Before: [2, 0, 3, 2]
5 1 0 2
After:  [2, 0, 0, 2]

Before: [3, 2, 2, 3]
7 0 3 1
After:  [3, 9, 2, 3]

Before: [0, 0, 1, 0]
0 0 2 2
After:  [0, 0, 1, 0]

Before: [2, 3, 1, 3]
7 1 3 1
After:  [2, 9, 1, 3]

Before: [2, 1, 1, 0]
9 3 1 0
After:  [1, 1, 1, 0]

Before: [2, 0, 3, 1]
11 2 0 1
After:  [2, 2, 3, 1]

Before: [0, 2, 1, 1]
5 0 1 0
After:  [0, 2, 1, 1]

Before: [3, 1, 1, 2]
12 3 1 0
After:  [3, 1, 1, 2]

Before: [1, 3, 3, 2]
7 2 3 0
After:  [6, 3, 3, 2]

Before: [2, 1, 0, 2]
3 0 2 3
After:  [2, 1, 0, 4]

Before: [2, 3, 2, 2]
8 2 2 2
After:  [2, 3, 2, 2]

Before: [0, 3, 1, 3]
7 3 3 3
After:  [0, 3, 1, 9]

Before: [2, 2, 3, 1]
11 2 0 2
After:  [2, 2, 2, 1]

Before: [0, 2, 1, 0]
5 0 1 2
After:  [0, 2, 0, 0]

Before: [2, 0, 2, 1]
10 0 3 1
After:  [2, 6, 2, 1]

Before: [1, 3, 2, 0]
14 1 2 0
After:  [2, 3, 2, 0]

Before: [1, 3, 3, 0]
4 0 1 0
After:  [1, 3, 3, 0]

Before: [1, 3, 2, 2]
10 3 3 3
After:  [1, 3, 2, 6]

Before: [1, 1, 2, 0]
7 1 2 0
After:  [2, 1, 2, 0]

Before: [1, 2, 0, 1]
6 3 0 1
After:  [1, 1, 0, 1]

Before: [0, 2, 3, 1]
11 2 1 0
After:  [2, 2, 3, 1]

Before: [0, 3, 1, 2]
3 3 2 1
After:  [0, 4, 1, 2]

Before: [2, 3, 1, 1]
10 1 3 2
After:  [2, 3, 9, 1]

Before: [1, 2, 1, 3]
15 2 3 1
After:  [1, 3, 1, 3]

Before: [1, 1, 3, 2]
14 2 2 3
After:  [1, 1, 3, 2]

Before: [2, 1, 0, 0]
9 3 1 0
After:  [1, 1, 0, 0]

Before: [1, 3, 1, 0]
4 0 1 1
After:  [1, 1, 1, 0]

Before: [3, 1, 1, 1]
10 0 3 2
After:  [3, 1, 9, 1]

Before: [1, 2, 3, 0]
10 1 3 1
After:  [1, 6, 3, 0]

Before: [3, 2, 3, 0]
0 3 1 2
After:  [3, 2, 2, 0]

Before: [0, 2, 2, 2]
8 2 0 3
After:  [0, 2, 2, 2]

Before: [2, 1, 2, 2]
15 1 3 1
After:  [2, 3, 2, 2]

Before: [0, 1, 2, 1]
2 3 1 0
After:  [1, 1, 2, 1]

Before: [3, 2, 1, 2]
10 0 3 0
After:  [9, 2, 1, 2]

Before: [2, 0, 0, 0]
3 0 2 0
After:  [4, 0, 0, 0]

Before: [1, 1, 0, 2]
12 3 1 0
After:  [3, 1, 0, 2]

Before: [3, 1, 3, 3]
7 3 3 1
After:  [3, 9, 3, 3]

Before: [2, 2, 2, 3]
8 2 0 1
After:  [2, 2, 2, 3]

Before: [0, 1, 2, 3]
14 3 2 2
After:  [0, 1, 2, 3]

Before: [1, 3, 1, 3]
4 2 1 0
After:  [1, 3, 1, 3]

Before: [2, 3, 1, 3]
3 0 2 3
After:  [2, 3, 1, 4]

Before: [2, 1, 2, 2]
1 0 2 0
After:  [4, 1, 2, 2]

Before: [1, 1, 1, 3]
2 2 1 1
After:  [1, 1, 1, 3]

Before: [1, 3, 2, 1]
4 0 1 2
After:  [1, 3, 1, 1]

Before: [0, 2, 1, 0]
5 0 2 2
After:  [0, 2, 0, 0]

Before: [3, 0, 3, 3]
8 3 0 0
After:  [3, 0, 3, 3]

Before: [1, 2, 2, 2]
7 0 2 1
After:  [1, 2, 2, 2]

Before: [0, 3, 2, 0]
5 0 1 1
After:  [0, 0, 2, 0]

Before: [3, 2, 3, 1]
12 3 2 3
After:  [3, 2, 3, 3]

Before: [1, 2, 3, 2]
3 3 2 1
After:  [1, 4, 3, 2]

Before: [1, 3, 2, 2]
7 0 2 0
After:  [2, 3, 2, 2]

Before: [3, 0, 2, 3]
15 1 3 1
After:  [3, 3, 2, 3]

Before: [2, 2, 3, 1]
4 3 1 2
After:  [2, 2, 1, 1]

Before: [2, 2, 0, 1]
3 1 2 1
After:  [2, 4, 0, 1]

Before: [0, 0, 2, 3]
14 3 2 1
After:  [0, 2, 2, 3]

Before: [1, 0, 2, 1]
6 3 0 2
After:  [1, 0, 1, 1]

Before: [1, 3, 2, 3]
4 0 1 2
After:  [1, 3, 1, 3]

Before: [0, 3, 1, 2]
5 0 3 1
After:  [0, 0, 1, 2]

Before: [0, 2, 3, 2]
0 0 2 0
After:  [3, 2, 3, 2]

Before: [0, 1, 0, 0]
9 3 1 0
After:  [1, 1, 0, 0]

Before: [3, 2, 3, 2]
14 2 2 1
After:  [3, 2, 3, 2]

Before: [0, 3, 2, 0]
5 0 1 3
After:  [0, 3, 2, 0]

Before: [3, 2, 3, 1]
14 2 2 0
After:  [2, 2, 3, 1]

Before: [3, 1, 1, 3]
8 3 1 0
After:  [3, 1, 1, 3]

Before: [0, 3, 0, 1]
13 0 0 1
After:  [0, 0, 0, 1]

Before: [2, 2, 0, 0]
3 1 2 3
After:  [2, 2, 0, 4]

Before: [1, 0, 2, 1]
6 3 0 0
After:  [1, 0, 2, 1]

Before: [1, 3, 0, 2]
4 0 1 3
After:  [1, 3, 0, 1]

Before: [1, 3, 2, 2]
0 0 1 3
After:  [1, 3, 2, 3]

Before: [0, 2, 2, 0]
1 2 2 2
After:  [0, 2, 4, 0]

Before: [0, 3, 1, 2]
0 2 1 2
After:  [0, 3, 3, 2]

Before: [0, 2, 0, 2]
0 0 1 0
After:  [2, 2, 0, 2]

Before: [0, 1, 1, 1]
13 0 0 3
After:  [0, 1, 1, 0]

Before: [2, 1, 3, 0]
9 3 1 2
After:  [2, 1, 1, 0]

Before: [1, 2, 0, 3]
7 1 3 2
After:  [1, 2, 6, 3]

Before: [0, 0, 3, 3]
0 1 2 2
After:  [0, 0, 3, 3]

Before: [1, 2, 3, 2]
3 1 2 1
After:  [1, 4, 3, 2]

Before: [0, 2, 0, 0]
3 1 2 0
After:  [4, 2, 0, 0]

Before: [2, 2, 1, 3]
7 3 3 3
After:  [2, 2, 1, 9]

Before: [3, 0, 0, 3]
10 3 2 2
After:  [3, 0, 6, 3]

Before: [1, 1, 0, 0]
9 3 1 2
After:  [1, 1, 1, 0]

Before: [2, 2, 0, 3]
3 0 2 3
After:  [2, 2, 0, 4]

Before: [0, 1, 2, 3]
1 2 2 1
After:  [0, 4, 2, 3]

Before: [1, 0, 1, 0]
6 2 0 3
After:  [1, 0, 1, 1]

Before: [1, 2, 0, 3]
0 1 0 0
After:  [3, 2, 0, 3]

Before: [0, 1, 3, 0]
9 3 1 3
After:  [0, 1, 3, 1]

Before: [0, 1, 0, 3]
9 2 1 1
After:  [0, 1, 0, 3]

Before: [1, 3, 2, 0]
4 0 1 3
After:  [1, 3, 2, 1]

Before: [2, 0, 3, 3]
3 0 2 1
After:  [2, 4, 3, 3]

Before: [2, 2, 3, 1]
11 2 1 3
After:  [2, 2, 3, 2]

Before: [3, 2, 0, 2]
3 1 2 1
After:  [3, 4, 0, 2]

Before: [0, 1, 0, 1]
13 0 0 3
After:  [0, 1, 0, 0]

Before: [1, 3, 2, 3]
7 3 3 0
After:  [9, 3, 2, 3]

Before: [0, 2, 2, 1]
4 3 1 2
After:  [0, 2, 1, 1]

Before: [0, 3, 1, 3]
13 0 0 2
After:  [0, 3, 0, 3]

Before: [0, 2, 1, 1]
0 2 1 3
After:  [0, 2, 1, 3]

Before: [3, 1, 0, 3]
10 3 2 3
After:  [3, 1, 0, 6]

Before: [2, 2, 1, 1]
7 3 1 2
After:  [2, 2, 2, 1]

Before: [0, 1, 0, 2]
15 1 3 1
After:  [0, 3, 0, 2]

Before: [2, 3, 3, 2]
7 2 3 0
After:  [6, 3, 3, 2]

Before: [2, 1, 3, 1]
2 3 1 1
After:  [2, 1, 3, 1]

Before: [1, 1, 2, 3]
15 1 2 0
After:  [3, 1, 2, 3]

Before: [3, 2, 3, 0]
14 2 2 2
After:  [3, 2, 2, 0]

Before: [0, 3, 0, 2]
0 0 1 1
After:  [0, 3, 0, 2]

Before: [0, 3, 3, 1]
13 0 0 1
After:  [0, 0, 3, 1]

Before: [1, 1, 0, 1]
9 2 1 2
After:  [1, 1, 1, 1]

Before: [1, 3, 2, 1]
10 2 3 2
After:  [1, 3, 6, 1]

Before: [2, 1, 1, 1]
2 3 1 2
After:  [2, 1, 1, 1]

Before: [0, 0, 0, 1]
5 2 0 0
After:  [0, 0, 0, 1]

Before: [0, 1, 2, 3]
5 0 2 2
After:  [0, 1, 0, 3]

Before: [2, 3, 3, 0]
11 2 0 3
After:  [2, 3, 3, 2]

Before: [2, 1, 3, 3]
7 0 3 0
After:  [6, 1, 3, 3]

Before: [3, 2, 1, 0]
0 2 0 1
After:  [3, 3, 1, 0]

Before: [3, 1, 1, 2]
2 2 1 2
After:  [3, 1, 1, 2]

Before: [1, 1, 2, 0]
1 2 2 2
After:  [1, 1, 4, 0]

Before: [2, 2, 0, 3]
7 1 3 0
After:  [6, 2, 0, 3]

Before: [3, 1, 0, 0]
9 3 1 3
After:  [3, 1, 0, 1]

Before: [3, 0, 0, 3]
0 1 0 2
After:  [3, 0, 3, 3]

Before: [3, 1, 3, 0]
9 3 1 2
After:  [3, 1, 1, 0]

Before: [0, 1, 3, 0]
5 0 1 1
After:  [0, 0, 3, 0]

Before: [2, 2, 0, 1]
4 3 1 0
After:  [1, 2, 0, 1]

Before: [0, 0, 2, 2]
1 2 2 1
After:  [0, 4, 2, 2]

Before: [0, 1, 3, 2]
14 2 2 3
After:  [0, 1, 3, 2]

Before: [1, 3, 1, 0]
4 2 1 1
After:  [1, 1, 1, 0]

Before: [2, 3, 1, 2]
15 2 3 0
After:  [3, 3, 1, 2]

Before: [1, 1, 0, 2]
12 3 1 2
After:  [1, 1, 3, 2]

Before: [1, 1, 3, 1]
10 0 2 2
After:  [1, 1, 2, 1]

Before: [2, 0, 1, 0]
0 0 2 1
After:  [2, 3, 1, 0]

Before: [0, 1, 1, 2]
12 3 1 3
After:  [0, 1, 1, 3]

Before: [3, 1, 0, 0]
9 3 1 2
After:  [3, 1, 1, 0]

Before: [3, 3, 0, 3]
7 0 3 0
After:  [9, 3, 0, 3]

Before: [3, 0, 2, 2]
5 1 0 2
After:  [3, 0, 0, 2]

Before: [0, 3, 0, 3]
0 2 1 2
After:  [0, 3, 3, 3]

Before: [2, 1, 1, 0]
0 2 0 0
After:  [3, 1, 1, 0]

Before: [0, 0, 2, 1]
13 0 0 1
After:  [0, 0, 2, 1]

Before: [1, 3, 2, 1]
6 3 0 3
After:  [1, 3, 2, 1]

Before: [0, 3, 0, 2]
3 3 2 3
After:  [0, 3, 0, 4]

Before: [0, 3, 3, 3]
13 0 0 0
After:  [0, 3, 3, 3]

Before: [2, 0, 2, 2]
1 3 2 3
After:  [2, 0, 2, 4]

Before: [1, 3, 0, 1]
6 3 0 3
After:  [1, 3, 0, 1]

Before: [0, 2, 3, 1]
13 0 0 3
After:  [0, 2, 3, 0]

Before: [1, 0, 0, 3]
8 3 3 1
After:  [1, 3, 0, 3]

Before: [1, 1, 3, 1]
6 3 0 0
After:  [1, 1, 3, 1]

Before: [1, 0, 2, 1]
6 3 0 1
After:  [1, 1, 2, 1]

Before: [0, 1, 2, 3]
13 0 0 1
After:  [0, 0, 2, 3]

Before: [2, 2, 3, 1]
11 2 1 0
After:  [2, 2, 3, 1]

Before: [2, 0, 2, 1]
12 3 2 0
After:  [3, 0, 2, 1]

Before: [0, 3, 3, 3]
14 2 2 3
After:  [0, 3, 3, 2]

Before: [3, 2, 2, 1]
12 3 2 1
After:  [3, 3, 2, 1]

Before: [3, 1, 0, 3]
15 2 3 2
After:  [3, 1, 3, 3]

Before: [0, 3, 2, 2]
8 2 0 1
After:  [0, 2, 2, 2]

Before: [2, 1, 0, 3]
0 1 0 0
After:  [3, 1, 0, 3]

Before: [3, 1, 1, 3]
2 2 1 0
After:  [1, 1, 1, 3]

Before: [1, 0, 2, 2]
1 2 2 0
After:  [4, 0, 2, 2]

Before: [2, 3, 2, 3]
1 2 2 2
After:  [2, 3, 4, 3]

Before: [1, 3, 2, 0]
14 1 2 1
After:  [1, 2, 2, 0]

Before: [3, 1, 1, 1]
0 2 0 2
After:  [3, 1, 3, 1]

Before: [1, 2, 3, 2]
11 2 3 3
After:  [1, 2, 3, 2]

Before: [1, 3, 3, 3]
8 3 3 2
After:  [1, 3, 3, 3]

Before: [0, 3, 3, 2]
13 0 0 0
After:  [0, 3, 3, 2]

Before: [0, 3, 2, 0]
1 2 2 3
After:  [0, 3, 2, 4]

Before: [3, 1, 2, 0]
10 2 3 3
After:  [3, 1, 2, 6]

Before: [3, 1, 2, 0]
9 3 1 0
After:  [1, 1, 2, 0]

Before: [3, 0, 2, 0]
5 1 0 2
After:  [3, 0, 0, 0]

Before: [0, 2, 3, 3]
13 0 0 2
After:  [0, 2, 0, 3]

Before: [2, 3, 1, 1]
0 0 2 3
After:  [2, 3, 1, 3]

Before: [1, 2, 2, 1]
0 1 0 3
After:  [1, 2, 2, 3]

Before: [1, 2, 2, 1]
4 3 1 1
After:  [1, 1, 2, 1]

Before: [1, 1, 1, 0]
2 2 1 2
After:  [1, 1, 1, 0]

Before: [1, 0, 1, 1]
6 2 0 0
After:  [1, 0, 1, 1]

Before: [0, 0, 1, 1]
13 0 0 1
After:  [0, 0, 1, 1]

Before: [3, 1, 2, 0]
9 3 1 3
After:  [3, 1, 2, 1]

Before: [3, 3, 0, 3]
8 3 3 0
After:  [3, 3, 0, 3]

Before: [3, 1, 0, 2]
5 2 0 1
After:  [3, 0, 0, 2]

Before: [2, 1, 3, 2]
11 2 3 3
After:  [2, 1, 3, 2]

Before: [1, 1, 1, 1]
6 3 0 2
After:  [1, 1, 1, 1]

Before: [3, 1, 0, 0]
9 2 1 3
After:  [3, 1, 0, 1]

Before: [0, 2, 0, 3]
8 3 0 1
After:  [0, 3, 0, 3]

Before: [1, 2, 2, 3]
0 1 0 0
After:  [3, 2, 2, 3]

Before: [1, 1, 3, 3]
15 1 2 1
After:  [1, 3, 3, 3]

Before: [1, 2, 2, 3]
7 0 1 3
After:  [1, 2, 2, 2]

Before: [3, 3, 3, 3]
14 2 2 1
After:  [3, 2, 3, 3]

Before: [0, 1, 3, 3]
8 3 1 3
After:  [0, 1, 3, 3]

Before: [2, 2, 3, 3]
11 2 1 3
After:  [2, 2, 3, 2]

Before: [0, 0, 2, 1]
8 2 2 0
After:  [2, 0, 2, 1]

Before: [1, 3, 3, 1]
12 3 2 1
After:  [1, 3, 3, 1]

Before: [0, 3, 0, 2]
0 0 3 0
After:  [2, 3, 0, 2]

Before: [1, 1, 3, 2]
3 3 2 2
After:  [1, 1, 4, 2]

Before: [1, 2, 0, 0]
3 1 2 3
After:  [1, 2, 0, 4]

Before: [2, 0, 2, 1]
0 1 0 0
After:  [2, 0, 2, 1]

Before: [0, 3, 2, 3]
1 2 2 2
After:  [0, 3, 4, 3]

Before: [2, 1, 2, 0]
7 1 2 2
After:  [2, 1, 2, 0]

Before: [3, 2, 3, 1]
4 3 1 0
After:  [1, 2, 3, 1]

Before: [2, 1, 3, 1]
12 3 2 0
After:  [3, 1, 3, 1]

Before: [0, 1, 0, 2]
13 0 0 2
After:  [0, 1, 0, 2]

Before: [2, 2, 0, 1]
3 1 2 2
After:  [2, 2, 4, 1]

Before: [1, 2, 1, 3]
6 2 0 1
After:  [1, 1, 1, 3]

Before: [3, 3, 1, 0]
10 1 3 2
After:  [3, 3, 9, 0]

Before: [3, 1, 0, 1]
10 1 2 0
After:  [2, 1, 0, 1]

Before: [1, 1, 0, 2]
9 2 1 3
After:  [1, 1, 0, 1]

Before: [2, 3, 1, 1]
4 2 1 2
After:  [2, 3, 1, 1]

Before: [0, 2, 2, 0]
1 1 2 2
After:  [0, 2, 4, 0]

Before: [0, 1, 1, 1]
2 3 1 0
After:  [1, 1, 1, 1]

Before: [1, 3, 2, 1]
14 1 2 1
After:  [1, 2, 2, 1]

Before: [1, 2, 2, 1]
7 3 1 1
After:  [1, 2, 2, 1]

Before: [2, 2, 3, 0]
3 1 2 1
After:  [2, 4, 3, 0]

Before: [2, 2, 3, 3]
3 0 2 3
After:  [2, 2, 3, 4]

Before: [3, 2, 0, 1]
4 3 1 3
After:  [3, 2, 0, 1]

Before: [1, 2, 0, 2]
10 0 2 0
After:  [2, 2, 0, 2]

Before: [1, 1, 2, 1]
6 3 0 2
After:  [1, 1, 1, 1]

Before: [0, 3, 2, 3]
13 0 0 1
After:  [0, 0, 2, 3]

Before: [3, 1, 2, 2]
14 0 2 3
After:  [3, 1, 2, 2]

Before: [1, 2, 1, 0]
6 2 0 0
After:  [1, 2, 1, 0]

Before: [3, 3, 3, 0]
14 2 2 1
After:  [3, 2, 3, 0]

Before: [0, 1, 0, 3]
8 3 0 1
After:  [0, 3, 0, 3]

Before: [1, 3, 2, 1]
14 1 2 0
After:  [2, 3, 2, 1]

Before: [0, 1, 2, 1]
5 0 3 1
After:  [0, 0, 2, 1]

Before: [3, 3, 3, 2]
10 0 3 2
After:  [3, 3, 9, 2]

Before: [0, 3, 1, 1]
4 2 1 2
After:  [0, 3, 1, 1]

Before: [3, 0, 0, 0]
5 1 0 0
After:  [0, 0, 0, 0]

Before: [2, 0, 0, 3]
5 1 0 1
After:  [2, 0, 0, 3]

Before: [1, 3, 2, 1]
1 2 2 0
After:  [4, 3, 2, 1]

Before: [2, 3, 2, 3]
8 2 0 0
After:  [2, 3, 2, 3]

Before: [1, 2, 1, 1]
6 2 0 2
After:  [1, 2, 1, 1]

Before: [3, 1, 1, 1]
2 2 1 3
After:  [3, 1, 1, 1]

Before: [3, 2, 2, 0]
1 1 2 2
After:  [3, 2, 4, 0]

Before: [2, 0, 3, 3]
8 3 3 1
After:  [2, 3, 3, 3]

Before: [1, 1, 3, 1]
6 3 0 1
After:  [1, 1, 3, 1]

Before: [0, 0, 2, 3]
14 3 2 3
After:  [0, 0, 2, 2]

Before: [1, 2, 1, 0]
6 2 0 2
After:  [1, 2, 1, 0]

Before: [3, 0, 2, 1]
7 0 2 0
After:  [6, 0, 2, 1]

Before: [0, 2, 3, 1]
11 2 1 2
After:  [0, 2, 2, 1]

Before: [2, 0, 3, 3]
3 0 2 2
After:  [2, 0, 4, 3]

Before: [0, 3, 3, 2]
14 2 2 3
After:  [0, 3, 3, 2]

Before: [1, 3, 1, 3]
6 2 0 1
After:  [1, 1, 1, 3]

Before: [1, 2, 3, 2]
11 2 3 0
After:  [2, 2, 3, 2]

Before: [1, 1, 2, 2]
12 3 1 1
After:  [1, 3, 2, 2]

Before: [3, 1, 3, 3]
14 2 2 0
After:  [2, 1, 3, 3]

Before: [3, 2, 3, 1]
4 3 1 2
After:  [3, 2, 1, 1]

Before: [0, 3, 2, 0]
8 2 0 2
After:  [0, 3, 2, 0]

Before: [3, 0, 2, 0]
10 2 3 3
After:  [3, 0, 2, 6]

Before: [1, 0, 3, 2]
14 2 2 0
After:  [2, 0, 3, 2]

Before: [1, 1, 2, 2]
12 3 1 2
After:  [1, 1, 3, 2]

Before: [0, 3, 2, 0]
5 0 1 2
After:  [0, 3, 0, 0]

Before: [1, 1, 1, 2]
2 2 1 1
After:  [1, 1, 1, 2]

Before: [0, 1, 0, 1]
9 2 1 2
After:  [0, 1, 1, 1]

Before: [2, 3, 3, 3]
11 2 0 3
After:  [2, 3, 3, 2]

Before: [0, 0, 1, 3]
15 2 3 1
After:  [0, 3, 1, 3]

Before: [1, 2, 1, 1]
3 1 2 2
After:  [1, 2, 4, 1]

Before: [2, 3, 0, 2]
3 3 2 0
After:  [4, 3, 0, 2]

Before: [3, 1, 3, 2]
12 3 1 3
After:  [3, 1, 3, 3]

Before: [3, 0, 1, 3]
15 2 3 3
After:  [3, 0, 1, 3]

Before: [1, 1, 1, 0]
9 3 1 0
After:  [1, 1, 1, 0]

Before: [2, 2, 3, 1]
10 2 3 2
After:  [2, 2, 9, 1]

Before: [0, 1, 1, 2]
12 3 1 0
After:  [3, 1, 1, 2]

Before: [0, 0, 0, 3]
15 0 3 1
After:  [0, 3, 0, 3]

Before: [3, 1, 1, 2]
2 2 1 1
After:  [3, 1, 1, 2]

Before: [1, 0, 0, 1]
6 3 0 2
After:  [1, 0, 1, 1]

Before: [1, 0, 1, 2]
6 2 0 2
After:  [1, 0, 1, 2]

Before: [1, 1, 1, 2]
2 2 1 3
After:  [1, 1, 1, 1]

Before: [1, 1, 1, 1]
6 2 0 1
After:  [1, 1, 1, 1]

Before: [2, 1, 2, 3]
8 3 1 3
After:  [2, 1, 2, 3]

Before: [3, 1, 1, 3]
7 3 3 2
After:  [3, 1, 9, 3]

Before: [2, 2, 3, 1]
11 2 1 1
After:  [2, 2, 3, 1]

Before: [1, 3, 0, 2]
4 0 1 0
After:  [1, 3, 0, 2]

Before: [0, 0, 3, 3]
0 0 2 1
After:  [0, 3, 3, 3]

Before: [0, 1, 3, 1]
2 3 1 0
After:  [1, 1, 3, 1]

Before: [3, 1, 1, 3]
8 3 0 2
After:  [3, 1, 3, 3]

Before: [1, 2, 1, 0]
6 2 0 1
After:  [1, 1, 1, 0]

Before: [1, 1, 0, 0]
9 3 1 0
After:  [1, 1, 0, 0]

Before: [3, 1, 0, 1]
9 2 1 1
After:  [3, 1, 0, 1]

Before: [0, 0, 2, 3]
8 2 0 3
After:  [0, 0, 2, 2]

Before: [0, 2, 3, 3]
14 2 2 0
After:  [2, 2, 3, 3]

Before: [2, 1, 1, 1]
15 0 1 3
After:  [2, 1, 1, 3]

Before: [3, 1, 1, 2]
3 3 2 0
After:  [4, 1, 1, 2]

Before: [0, 3, 1, 1]
5 0 3 3
After:  [0, 3, 1, 0]

Before: [0, 0, 2, 0]
15 3 2 1
After:  [0, 2, 2, 0]

Before: [1, 2, 0, 3]
8 3 3 0
After:  [3, 2, 0, 3]

Before: [1, 0, 1, 1]
6 3 0 0
After:  [1, 0, 1, 1]

Before: [0, 1, 1, 2]
0 0 2 3
After:  [0, 1, 1, 1]

Before: [1, 1, 3, 1]
6 3 0 3
After:  [1, 1, 3, 1]

Before: [1, 1, 2, 3]
8 2 2 2
After:  [1, 1, 2, 3]

Before: [0, 1, 2, 0]
9 3 1 2
After:  [0, 1, 1, 0]

Before: [1, 2, 1, 1]
6 3 0 0
After:  [1, 2, 1, 1]

Before: [2, 1, 1, 0]
9 3 1 1
After:  [2, 1, 1, 0]

Before: [1, 2, 3, 3]
0 0 1 2
After:  [1, 2, 3, 3]

Before: [0, 1, 0, 0]
13 0 0 1
After:  [0, 0, 0, 0]

Before: [2, 1, 3, 2]
12 3 1 1
After:  [2, 3, 3, 2]

Before: [3, 1, 2, 1]
2 3 1 2
After:  [3, 1, 1, 1]

Before: [0, 2, 2, 0]
5 0 2 3
After:  [0, 2, 2, 0]

Before: [1, 3, 0, 3]
4 0 1 0
After:  [1, 3, 0, 3]

Before: [2, 1, 2, 2]
12 3 1 3
After:  [2, 1, 2, 3]

Before: [2, 2, 0, 3]
3 0 2 2
After:  [2, 2, 4, 3]

Before: [2, 1, 2, 2]
8 2 0 3
After:  [2, 1, 2, 2]

Before: [1, 3, 1, 2]
6 2 0 3
After:  [1, 3, 1, 1]

Before: [0, 1, 2, 0]
15 0 1 3
After:  [0, 1, 2, 1]

Before: [2, 2, 1, 2]
3 3 2 0
After:  [4, 2, 1, 2]

Before: [3, 1, 2, 0]
1 2 2 1
After:  [3, 4, 2, 0]

Before: [1, 2, 2, 3]
7 1 3 3
After:  [1, 2, 2, 6]

Before: [2, 1, 1, 2]
0 1 0 2
After:  [2, 1, 3, 2]

Before: [0, 3, 3, 2]
11 2 3 1
After:  [0, 2, 3, 2]

Before: [0, 1, 0, 0]
9 3 1 1
After:  [0, 1, 0, 0]

Before: [1, 3, 3, 2]
11 2 3 2
After:  [1, 3, 2, 2]

Before: [1, 2, 1, 3]
6 2 0 0
After:  [1, 2, 1, 3]

Before: [1, 0, 1, 3]
6 2 0 3
After:  [1, 0, 1, 1]

Before: [0, 2, 2, 2]
15 0 2 1
After:  [0, 2, 2, 2]

Before: [3, 3, 0, 3]
5 2 0 2
After:  [3, 3, 0, 3]

Before: [3, 3, 3, 3]
14 2 2 0
After:  [2, 3, 3, 3]

Before: [3, 0, 0, 3]
8 3 3 3
After:  [3, 0, 0, 3]

Before: [0, 3, 2, 0]
13 0 0 1
After:  [0, 0, 2, 0]

Before: [3, 1, 3, 0]
9 3 1 3
After:  [3, 1, 3, 1]

Before: [0, 1, 0, 3]
9 2 1 2
After:  [0, 1, 1, 3]

Before: [3, 3, 1, 1]
4 2 1 1
After:  [3, 1, 1, 1]

Before: [0, 1, 3, 1]
12 3 2 1
After:  [0, 3, 3, 1]

Before: [1, 3, 2, 0]
8 2 2 3
After:  [1, 3, 2, 2]

Before: [0, 0, 3, 1]
13 0 0 2
After:  [0, 0, 0, 1]

Before: [0, 2, 3, 2]
13 0 0 3
After:  [0, 2, 3, 0]

Before: [0, 0, 3, 1]
13 0 0 0
After:  [0, 0, 3, 1]

Before: [1, 3, 2, 0]
7 1 2 1
After:  [1, 6, 2, 0]

Before: [3, 3, 0, 2]
0 2 0 1
After:  [3, 3, 0, 2]

Before: [3, 2, 0, 0]
10 1 3 1
After:  [3, 6, 0, 0]

Before: [3, 2, 1, 0]
10 0 3 0
After:  [9, 2, 1, 0]

Before: [1, 1, 1, 1]
2 2 1 2
After:  [1, 1, 1, 1]

Before: [2, 1, 3, 3]
11 2 0 1
After:  [2, 2, 3, 3]

Before: [2, 3, 3, 3]
14 2 2 0
After:  [2, 3, 3, 3]

Before: [0, 1, 1, 0]
9 3 1 0
After:  [1, 1, 1, 0]

Before: [1, 1, 2, 0]
9 3 1 3
After:  [1, 1, 2, 1]

Before: [2, 3, 2, 0]
1 2 2 0
After:  [4, 3, 2, 0]

Before: [3, 2, 1, 0]
3 1 2 1
After:  [3, 4, 1, 0]

Before: [1, 3, 2, 3]
15 0 2 1
After:  [1, 3, 2, 3]

Before: [2, 0, 1, 3]
8 3 3 3
After:  [2, 0, 1, 3]

Before: [3, 1, 0, 1]
2 3 1 3
After:  [3, 1, 0, 1]

Before: [0, 1, 1, 0]
13 0 0 3
After:  [0, 1, 1, 0]

Before: [1, 3, 1, 3]
0 0 1 1
After:  [1, 3, 1, 3]

Before: [1, 0, 2, 2]
15 0 2 1
After:  [1, 3, 2, 2]

Before: [1, 2, 2, 1]
12 3 2 2
After:  [1, 2, 3, 1]

Before: [1, 3, 3, 1]
10 0 2 0
After:  [2, 3, 3, 1]

Before: [2, 1, 0, 1]
2 3 1 0
After:  [1, 1, 0, 1]

Before: [1, 0, 1, 1]
6 3 0 1
After:  [1, 1, 1, 1]

Before: [3, 3, 1, 1]
4 2 1 0
After:  [1, 3, 1, 1]

Before: [0, 3, 0, 3]
13 0 0 0
After:  [0, 3, 0, 3]

Before: [0, 1, 0, 3]
13 0 0 0
After:  [0, 1, 0, 3]

Before: [2, 2, 3, 2]
11 2 0 3
After:  [2, 2, 3, 2]

Before: [2, 3, 1, 1]
4 2 1 1
After:  [2, 1, 1, 1]

Before: [1, 3, 3, 2]
11 2 3 3
After:  [1, 3, 3, 2]

Before: [1, 3, 0, 0]
4 0 1 0
After:  [1, 3, 0, 0]

Before: [0, 1, 1, 2]
2 2 1 2
After:  [0, 1, 1, 2]

Before: [1, 2, 2, 1]
0 2 0 3
After:  [1, 2, 2, 3]

Before: [2, 0, 3, 1]
12 3 2 0
After:  [3, 0, 3, 1]

Before: [0, 1, 1, 2]
2 2 1 3
After:  [0, 1, 1, 1]

Before: [1, 1, 0, 3]
7 3 3 3
After:  [1, 1, 0, 9]

Before: [1, 3, 1, 1]
6 2 0 0
After:  [1, 3, 1, 1]

Before: [3, 1, 3, 3]
8 3 3 0
After:  [3, 1, 3, 3]

Before: [3, 3, 2, 2]
14 0 2 0
After:  [2, 3, 2, 2]

Before: [0, 2, 0, 2]
3 1 2 2
After:  [0, 2, 4, 2]

Before: [0, 1, 1, 1]
2 2 1 2
After:  [0, 1, 1, 1]

Before: [1, 3, 0, 3]
4 0 1 1
After:  [1, 1, 0, 3]

Before: [0, 3, 2, 1]
0 0 1 2
After:  [0, 3, 3, 1]

Before: [3, 2, 2, 2]
1 3 2 1
After:  [3, 4, 2, 2]

Before: [0, 3, 2, 3]
8 2 2 3
After:  [0, 3, 2, 2]

Before: [2, 0, 3, 2]
3 0 2 3
After:  [2, 0, 3, 4]

Before: [1, 2, 3, 1]
11 2 1 1
After:  [1, 2, 3, 1]

Before: [0, 2, 3, 0]
11 2 1 3
After:  [0, 2, 3, 2]

Before: [1, 0, 1, 2]
6 2 0 0
After:  [1, 0, 1, 2]

Before: [0, 0, 2, 3]
13 0 0 0
After:  [0, 0, 2, 3]

Before: [0, 0, 3, 2]
11 2 3 0
After:  [2, 0, 3, 2]

Before: [0, 3, 1, 2]
4 2 1 1
After:  [0, 1, 1, 2]

Before: [0, 1, 1, 2]
15 2 3 0
After:  [3, 1, 1, 2]

Before: [0, 1, 2, 2]
13 0 0 0
After:  [0, 1, 2, 2]

Before: [2, 1, 0, 1]
2 3 1 1
After:  [2, 1, 0, 1]

Before: [2, 1, 1, 1]
2 3 1 3
After:  [2, 1, 1, 1]

Before: [0, 0, 0, 0]
5 3 0 0
After:  [0, 0, 0, 0]

Before: [1, 2, 2, 1]
10 1 3 3
After:  [1, 2, 2, 6]

Before: [3, 3, 2, 3]
14 1 2 1
After:  [3, 2, 2, 3]

Before: [1, 1, 1, 1]
6 3 0 3
After:  [1, 1, 1, 1]

Before: [2, 3, 3, 0]
11 2 0 1
After:  [2, 2, 3, 0]

Before: [1, 0, 3, 3]
8 3 3 2
After:  [1, 0, 3, 3]

Before: [1, 3, 1, 1]
10 1 2 2
After:  [1, 3, 6, 1]

Before: [3, 0, 0, 2]
5 2 0 2
After:  [3, 0, 0, 2]

Before: [3, 1, 3, 0]
14 2 2 0
After:  [2, 1, 3, 0]

Before: [3, 3, 3, 2]
11 2 3 3
After:  [3, 3, 3, 2]

Before: [3, 3, 3, 3]
8 3 1 3
After:  [3, 3, 3, 3]

Before: [0, 0, 2, 0]
8 2 0 0
After:  [2, 0, 2, 0]

Before: [2, 2, 2, 1]
1 2 2 0
After:  [4, 2, 2, 1]

Before: [2, 2, 3, 0]
11 2 1 1
After:  [2, 2, 3, 0]

Before: [3, 2, 2, 3]
14 0 2 3
After:  [3, 2, 2, 2]

Before: [2, 1, 2, 3]
1 0 2 0
After:  [4, 1, 2, 3]

Before: [3, 1, 1, 0]
9 3 1 0
After:  [1, 1, 1, 0]

Before: [1, 3, 1, 3]
4 2 1 1
After:  [1, 1, 1, 3]

Before: [2, 0, 0, 1]
3 0 2 2
After:  [2, 0, 4, 1]

Before: [2, 0, 3, 2]
14 2 2 2
After:  [2, 0, 2, 2]

Before: [0, 1, 3, 1]
5 0 1 0
After:  [0, 1, 3, 1]

Before: [0, 3, 1, 3]
8 3 0 0
After:  [3, 3, 1, 3]

Before: [1, 2, 3, 1]
15 0 2 2
After:  [1, 2, 3, 1]

Before: [2, 2, 3, 2]
11 2 3 2
After:  [2, 2, 2, 2]

Before: [0, 3, 3, 3]
14 2 2 1
After:  [0, 2, 3, 3]

Before: [1, 0, 3, 0]
14 2 2 0
After:  [2, 0, 3, 0]

Before: [1, 2, 1, 0]
6 2 0 3
After:  [1, 2, 1, 1]

Before: [2, 0, 2, 2]
0 1 3 0
After:  [2, 0, 2, 2]

Before: [0, 1, 2, 1]
8 2 2 0
After:  [2, 1, 2, 1]

Before: [0, 2, 2, 1]
12 3 2 3
After:  [0, 2, 2, 3]

Before: [1, 3, 2, 3]
7 2 3 3
After:  [1, 3, 2, 6]

Before: [3, 1, 0, 0]
0 2 0 3
After:  [3, 1, 0, 3]

Before: [1, 3, 2, 3]
4 0 1 1
After:  [1, 1, 2, 3]

Before: [0, 2, 2, 1]
13 0 0 0
After:  [0, 2, 2, 1]

Before: [3, 1, 2, 3]
8 3 3 2
After:  [3, 1, 3, 3]

Before: [0, 1, 1, 3]
2 2 1 1
After:  [0, 1, 1, 3]

Before: [2, 2, 1, 1]
4 3 1 2
After:  [2, 2, 1, 1]

Before: [2, 1, 0, 0]
9 3 1 1
After:  [2, 1, 0, 0]

Before: [3, 1, 2, 2]
12 3 1 0
After:  [3, 1, 2, 2]

Before: [0, 1, 1, 2]
3 3 2 2
After:  [0, 1, 4, 2]

Before: [0, 2, 3, 0]
11 2 1 0
After:  [2, 2, 3, 0]

Before: [2, 0, 1, 3]
3 0 2 2
After:  [2, 0, 4, 3]

Before: [3, 2, 3, 2]
11 2 1 3
After:  [3, 2, 3, 2]

Before: [1, 1, 1, 0]
6 2 0 0
After:  [1, 1, 1, 0]

Before: [1, 1, 1, 3]
2 2 1 0
After:  [1, 1, 1, 3]

Before: [1, 2, 2, 1]
7 0 2 3
After:  [1, 2, 2, 2]

Before: [3, 2, 0, 2]
3 3 2 2
After:  [3, 2, 4, 2]

Before: [1, 2, 0, 3]
3 1 2 0
After:  [4, 2, 0, 3]

Before: [1, 2, 3, 1]
4 3 1 2
After:  [1, 2, 1, 1]

Before: [3, 2, 2, 1]
14 0 2 2
After:  [3, 2, 2, 1]

Before: [2, 1, 3, 2]
11 2 3 2
After:  [2, 1, 2, 2]

Before: [0, 3, 1, 3]
5 0 3 3
After:  [0, 3, 1, 0]

Before: [3, 3, 2, 0]
1 2 2 1
After:  [3, 4, 2, 0]

Before: [1, 1, 0, 2]
9 2 1 2
After:  [1, 1, 1, 2]

Before: [3, 0, 2, 1]
12 3 2 3
After:  [3, 0, 2, 3]

Before: [3, 3, 0, 1]
10 0 3 1
After:  [3, 9, 0, 1]

Before: [0, 2, 3, 1]
10 1 3 2
After:  [0, 2, 6, 1]

Before: [2, 0, 2, 0]
10 2 3 3
After:  [2, 0, 2, 6]

Before: [0, 3, 2, 1]
5 0 2 0
After:  [0, 3, 2, 1]

Before: [3, 1, 3, 0]
9 3 1 1
After:  [3, 1, 3, 0]

Before: [0, 2, 2, 3]
8 3 0 3
After:  [0, 2, 2, 3]

Before: [0, 3, 0, 1]
13 0 0 2
After:  [0, 3, 0, 1]

Before: [0, 0, 0, 1]
13 0 0 0
After:  [0, 0, 0, 1]

Before: [1, 2, 0, 1]
6 3 0 2
After:  [1, 2, 1, 1]

Before: [2, 3, 2, 0]
15 3 2 1
After:  [2, 2, 2, 0]

Before: [1, 0, 2, 2]
0 2 0 1
After:  [1, 3, 2, 2]

Before: [2, 2, 0, 2]
10 0 3 3
After:  [2, 2, 0, 6]

Before: [2, 2, 3, 3]
8 3 3 1
After:  [2, 3, 3, 3]

Before: [0, 2, 3, 3]
5 0 3 2
After:  [0, 2, 0, 3]

Before: [0, 1, 2, 2]
8 2 2 0
After:  [2, 1, 2, 2]

Before: [2, 2, 2, 2]
8 2 2 3
After:  [2, 2, 2, 2]

Before: [1, 3, 1, 2]
4 0 1 0
After:  [1, 3, 1, 2]

Before: [2, 2, 3, 1]
14 2 2 0
After:  [2, 2, 3, 1]

Before: [3, 1, 1, 0]
9 3 1 1
After:  [3, 1, 1, 0]

Before: [1, 3, 3, 1]
6 3 0 2
After:  [1, 3, 1, 1]

Before: [3, 1, 0, 2]
9 2 1 1
After:  [3, 1, 0, 2]

Before: [2, 0, 3, 0]
11 2 0 3
After:  [2, 0, 3, 2]

Before: [0, 0, 3, 3]
8 3 3 2
After:  [0, 0, 3, 3]

Before: [3, 1, 3, 1]
15 1 2 0
After:  [3, 1, 3, 1]

Before: [3, 3, 2, 1]
12 3 2 3
After:  [3, 3, 2, 3]

Before: [1, 0, 1, 2]
6 2 0 1
After:  [1, 1, 1, 2]

Before: [2, 3, 1, 0]
4 2 1 2
After:  [2, 3, 1, 0]

Before: [2, 1, 2, 0]
9 3 1 1
After:  [2, 1, 2, 0]

Before: [2, 3, 2, 3]
8 3 1 0
After:  [3, 3, 2, 3]

Before: [0, 2, 1, 1]
4 3 1 2
After:  [0, 2, 1, 1]

Before: [0, 0, 0, 1]
13 0 0 3
After:  [0, 0, 0, 0]

Before: [0, 1, 2, 1]
8 2 2 3
After:  [0, 1, 2, 2]

Before: [1, 1, 0, 1]
10 3 2 1
After:  [1, 2, 0, 1]

Before: [1, 1, 1, 3]
6 2 0 0
After:  [1, 1, 1, 3]

Before: [1, 3, 1, 3]
6 2 0 2
After:  [1, 3, 1, 3]

Before: [2, 3, 3, 2]
11 2 3 0
After:  [2, 3, 3, 2]

Before: [1, 2, 0, 3]
8 3 3 2
After:  [1, 2, 3, 3]

Before: [2, 1, 1, 3]
10 3 2 0
After:  [6, 1, 1, 3]

Before: [2, 1, 1, 3]
2 2 1 1
After:  [2, 1, 1, 3]

Before: [1, 0, 2, 3]
1 2 2 2
After:  [1, 0, 4, 3]

Before: [3, 2, 2, 1]
8 2 2 3
After:  [3, 2, 2, 2]

Before: [1, 1, 0, 2]
12 3 1 3
After:  [1, 1, 0, 3]

Before: [0, 2, 3, 3]
5 0 2 1
After:  [0, 0, 3, 3]

Before: [0, 1, 3, 2]
3 3 2 1
After:  [0, 4, 3, 2]

Before: [0, 2, 3, 1]
14 2 2 3
After:  [0, 2, 3, 2]

Before: [3, 3, 3, 2]
7 2 3 3
After:  [3, 3, 3, 6]

Before: [1, 3, 2, 3]
14 3 2 1
After:  [1, 2, 2, 3]

Before: [0, 2, 3, 0]
13 0 0 2
After:  [0, 2, 0, 0]

Before: [0, 1, 0, 3]
13 0 0 2
After:  [0, 1, 0, 3]

Before: [1, 1, 1, 1]
6 2 0 3
After:  [1, 1, 1, 1]

Before: [1, 2, 3, 0]
3 1 2 1
After:  [1, 4, 3, 0]

Before: [0, 0, 3, 3]
15 0 3 1
After:  [0, 3, 3, 3]

Before: [0, 2, 3, 1]
11 2 1 3
After:  [0, 2, 3, 2]

Before: [1, 3, 2, 3]
14 1 2 0
After:  [2, 3, 2, 3]

Before: [0, 1, 0, 1]
2 3 1 0
After:  [1, 1, 0, 1]

Before: [0, 3, 1, 1]
13 0 0 3
After:  [0, 3, 1, 0]

Before: [0, 1, 3, 2]
11 2 3 1
After:  [0, 2, 3, 2]

Before: [3, 1, 1, 2]
12 3 1 2
After:  [3, 1, 3, 2]

Before: [3, 2, 3, 2]
3 1 2 0
After:  [4, 2, 3, 2]

Before: [0, 2, 3, 3]
5 0 3 0
After:  [0, 2, 3, 3]

Before: [3, 3, 0, 1]
5 2 0 1
After:  [3, 0, 0, 1]

Before: [1, 1, 1, 0]
6 2 0 2
After:  [1, 1, 1, 0]

Before: [1, 3, 1, 0]
6 2 0 1
After:  [1, 1, 1, 0]

Before: [0, 3, 1, 2]
0 0 3 1
After:  [0, 2, 1, 2]

Before: [0, 3, 1, 3]
0 2 1 0
After:  [3, 3, 1, 3]

Before: [1, 2, 3, 1]
6 3 0 1
After:  [1, 1, 3, 1]

Before: [0, 3, 1, 1]
4 2 1 3
After:  [0, 3, 1, 1]

Before: [1, 1, 1, 2]
12 3 1 3
After:  [1, 1, 1, 3]

Before: [3, 1, 3, 2]
10 0 3 3
After:  [3, 1, 3, 9]

Before: [0, 3, 0, 0]
5 2 0 2
After:  [0, 3, 0, 0]

Before: [2, 1, 1, 2]
12 3 1 0
After:  [3, 1, 1, 2]

Before: [2, 2, 3, 3]
7 1 3 1
After:  [2, 6, 3, 3]

Before: [1, 2, 2, 3]
7 0 1 0
After:  [2, 2, 2, 3]

Before: [2, 2, 0, 1]
3 0 2 2
After:  [2, 2, 4, 1]

Before: [1, 2, 0, 1]
3 1 2 3
After:  [1, 2, 0, 4]

Before: [0, 2, 0, 1]
4 3 1 1
After:  [0, 1, 0, 1]

Before: [3, 2, 2, 2]
1 1 2 1
After:  [3, 4, 2, 2]

Before: [2, 2, 1, 1]
0 1 2 0
After:  [3, 2, 1, 1]

Before: [1, 3, 3, 3]
4 0 1 3
After:  [1, 3, 3, 1]

Before: [1, 3, 1, 3]
8 3 3 0
After:  [3, 3, 1, 3]

Before: [3, 1, 1, 1]
10 0 3 3
After:  [3, 1, 1, 9]

Before: [2, 2, 0, 3]
3 1 2 3
After:  [2, 2, 0, 4]

Before: [1, 1, 3, 1]
15 0 2 3
After:  [1, 1, 3, 3]

Before: [1, 3, 2, 2]
1 3 2 3
After:  [1, 3, 2, 4]

Before: [3, 0, 2, 1]
8 2 2 0
After:  [2, 0, 2, 1]

Before: [3, 3, 2, 1]
7 0 2 2
After:  [3, 3, 6, 1]

Before: [3, 3, 2, 3]
14 1 2 2
After:  [3, 3, 2, 3]

Before: [3, 2, 0, 2]
3 3 2 0
After:  [4, 2, 0, 2]

Before: [2, 1, 1, 0]
2 2 1 2
After:  [2, 1, 1, 0]

Before: [1, 0, 3, 3]
14 2 2 1
After:  [1, 2, 3, 3]

Before: [1, 3, 2, 2]
14 1 2 2
After:  [1, 3, 2, 2]

Before: [1, 0, 3, 1]
12 3 2 0
After:  [3, 0, 3, 1]

Before: [3, 1, 3, 2]
11 2 3 1
After:  [3, 2, 3, 2]

Before: [2, 2, 2, 1]
1 2 2 1
After:  [2, 4, 2, 1]

Before: [3, 1, 3, 0]
9 3 1 0
After:  [1, 1, 3, 0]

Before: [3, 2, 2, 2]
1 1 2 3
After:  [3, 2, 2, 4]

Before: [1, 3, 2, 1]
6 3 0 1
After:  [1, 1, 2, 1]

Before: [0, 2, 2, 0]
0 0 1 2
After:  [0, 2, 2, 0]

Before: [0, 0, 0, 0]
5 1 0 1
After:  [0, 0, 0, 0]

Before: [0, 1, 2, 0]
1 2 2 0
After:  [4, 1, 2, 0]

Before: [2, 0, 3, 3]
11 2 0 2
After:  [2, 0, 2, 3]

Before: [3, 3, 2, 2]
14 1 2 1
After:  [3, 2, 2, 2]

Before: [1, 1, 0, 1]
9 2 1 0
After:  [1, 1, 0, 1]

Before: [2, 3, 0, 3]
7 0 3 2
After:  [2, 3, 6, 3]

Before: [2, 3, 3, 1]
12 3 2 2
After:  [2, 3, 3, 1]

Before: [0, 2, 3, 3]
11 2 1 3
After:  [0, 2, 3, 2]

Before: [3, 3, 0, 2]
5 2 0 1
After:  [3, 0, 0, 2]

Before: [1, 1, 1, 1]
6 3 0 1
After:  [1, 1, 1, 1]

Before: [2, 3, 0, 3]
10 3 2 1
After:  [2, 6, 0, 3]

Before: [2, 1, 2, 2]
7 1 2 0
After:  [2, 1, 2, 2]

Before: [0, 2, 2, 2]
1 1 2 0
After:  [4, 2, 2, 2]

Before: [0, 3, 1, 2]
10 3 3 2
After:  [0, 3, 6, 2]

Before: [3, 2, 3, 3]
3 1 2 3
After:  [3, 2, 3, 4]

Before: [1, 1, 2, 3]
7 3 3 1
After:  [1, 9, 2, 3]

Before: [2, 3, 3, 3]
3 0 2 2
After:  [2, 3, 4, 3]

Before: [1, 3, 1, 1]
6 2 0 1
After:  [1, 1, 1, 1]

Before: [3, 1, 1, 3]
15 2 3 3
After:  [3, 1, 1, 3]

Before: [1, 0, 2, 3]
8 3 0 3
After:  [1, 0, 2, 3]

Before: [0, 3, 2, 2]
14 1 2 3
After:  [0, 3, 2, 2]

Before: [1, 1, 0, 0]
9 3 1 1
After:  [1, 1, 0, 0]

Before: [2, 2, 3, 3]
3 1 2 2
After:  [2, 2, 4, 3]

Before: [2, 2, 3, 3]
11 2 0 1
After:  [2, 2, 3, 3]

Before: [0, 2, 0, 2]
3 3 2 3
After:  [0, 2, 0, 4]

Before: [2, 3, 2, 0]
10 2 3 1
After:  [2, 6, 2, 0]

Before: [3, 2, 3, 0]
11 2 1 3
After:  [3, 2, 3, 2]

Before: [1, 2, 3, 0]
15 0 2 2
After:  [1, 2, 3, 0]

Before: [0, 3, 1, 1]
4 2 1 0
After:  [1, 3, 1, 1]

Before: [1, 0, 3, 3]
7 2 3 1
After:  [1, 9, 3, 3]

Before: [2, 1, 3, 1]
11 2 0 0
After:  [2, 1, 3, 1]

Before: [0, 1, 2, 0]
15 0 1 0
After:  [1, 1, 2, 0]

Before: [1, 2, 1, 2]
6 2 0 0
After:  [1, 2, 1, 2]

Before: [3, 0, 2, 1]
12 3 2 1
After:  [3, 3, 2, 1]

Before: [0, 3, 2, 1]
12 3 2 3
After:  [0, 3, 2, 3]

Before: [0, 1, 0, 0]
9 2 1 3
After:  [0, 1, 0, 1]

Before: [1, 1, 1, 1]
2 2 1 3
After:  [1, 1, 1, 1]

Before: [3, 2, 3, 2]
11 2 3 1
After:  [3, 2, 3, 2]

Before: [3, 2, 3, 1]
10 2 3 3
After:  [3, 2, 3, 9]

Before: [1, 1, 3, 2]
11 2 3 3
After:  [1, 1, 3, 2]

Before: [0, 2, 1, 0]
3 1 2 2
After:  [0, 2, 4, 0]

Before: [0, 0, 1, 1]
5 0 3 3
After:  [0, 0, 1, 0]

Before: [1, 1, 1, 2]
6 2 0 3
After:  [1, 1, 1, 1]

Before: [0, 3, 1, 3]
4 2 1 2
After:  [0, 3, 1, 3]

Before: [2, 0, 1, 0]
5 1 0 3
After:  [2, 0, 1, 0]

Before: [2, 3, 2, 1]
14 1 2 2
After:  [2, 3, 2, 1]

Before: [0, 0, 1, 3]
15 1 3 3
After:  [0, 0, 1, 3]

Before: [2, 3, 0, 2]
7 1 3 0
After:  [6, 3, 0, 2]

Before: [1, 3, 0, 1]
6 3 0 2
After:  [1, 3, 1, 1]

Before: [3, 1, 3, 1]
12 3 2 2
After:  [3, 1, 3, 1]

Before: [2, 1, 3, 1]
10 3 2 3
After:  [2, 1, 3, 2]

Before: [0, 1, 0, 0]
9 2 1 1
After:  [0, 1, 0, 0]

Before: [2, 1, 2, 1]
8 2 0 0
After:  [2, 1, 2, 1]

Before: [3, 2, 2, 2]
10 0 3 3
After:  [3, 2, 2, 9]

Before: [0, 1, 3, 1]
2 3 1 2
After:  [0, 1, 1, 1]

Before: [1, 3, 3, 3]
15 0 2 0
After:  [3, 3, 3, 3]

Before: [3, 2, 2, 1]
12 3 2 0
After:  [3, 2, 2, 1]

Before: [0, 3, 2, 1]
12 3 2 1
After:  [0, 3, 2, 1]

Before: [0, 0, 2, 0]
8 2 2 1
After:  [0, 2, 2, 0]

Before: [0, 3, 0, 3]
7 3 3 2
After:  [0, 3, 9, 3]

Before: [1, 2, 2, 2]
7 0 1 0
After:  [2, 2, 2, 2]

Before: [0, 1, 1, 3]
5 0 3 0
After:  [0, 1, 1, 3]

Before: [2, 0, 3, 3]
0 1 2 2
After:  [2, 0, 3, 3]

Before: [3, 1, 0, 0]
9 2 1 2
After:  [3, 1, 1, 0]

Before: [0, 0, 0, 3]
8 3 0 1
After:  [0, 3, 0, 3]

Before: [3, 1, 2, 1]
12 3 2 3
After:  [3, 1, 2, 3]

Before: [3, 2, 0, 2]
5 2 0 0
After:  [0, 2, 0, 2]

Before: [0, 2, 1, 3]
7 3 3 3
After:  [0, 2, 1, 9]

Before: [2, 3, 2, 2]
1 2 2 0
After:  [4, 3, 2, 2]

Before: [1, 3, 2, 0]
7 0 2 1
After:  [1, 2, 2, 0]

Before: [0, 3, 3, 1]
12 3 2 2
After:  [0, 3, 3, 1]

Before: [3, 3, 1, 2]
4 2 1 1
After:  [3, 1, 1, 2]

Before: [0, 1, 3, 3]
15 1 2 0
After:  [3, 1, 3, 3]

Before: [0, 3, 1, 3]
8 3 0 2
After:  [0, 3, 3, 3]

Before: [3, 1, 2, 2]
15 1 3 3
After:  [3, 1, 2, 3]

Before: [0, 1, 2, 0]
13 0 0 1
After:  [0, 0, 2, 0]

Before: [1, 0, 1, 3]
7 3 3 2
After:  [1, 0, 9, 3]

Before: [2, 0, 1, 3]
7 0 3 3
After:  [2, 0, 1, 6]

Before: [0, 3, 1, 0]
4 2 1 0
After:  [1, 3, 1, 0]

Before: [0, 0, 0, 3]
13 0 0 3
After:  [0, 0, 0, 0]

Before: [2, 1, 0, 2]
9 2 1 0
After:  [1, 1, 0, 2]

Before: [1, 0, 0, 2]
3 3 2 3
After:  [1, 0, 0, 4]

Before: [0, 1, 0, 0]
9 2 1 2
After:  [0, 1, 1, 0]

Before: [3, 3, 0, 0]
10 1 3 2
After:  [3, 3, 9, 0]

Before: [0, 0, 2, 2]
15 1 2 3
After:  [0, 0, 2, 2]

Before: [1, 3, 1, 0]
4 2 1 2
After:  [1, 3, 1, 0]

Before: [0, 3, 0, 3]
13 0 0 1
After:  [0, 0, 0, 3]

Before: [0, 0, 3, 0]
5 1 0 0
After:  [0, 0, 3, 0]

Before: [0, 1, 1, 3]
2 2 1 3
After:  [0, 1, 1, 1]

Before: [0, 0, 2, 1]
12 3 2 0
After:  [3, 0, 2, 1]

Before: [0, 2, 2, 2]
5 0 1 0
After:  [0, 2, 2, 2]

Before: [0, 3, 1, 2]
13 0 0 1
After:  [0, 0, 1, 2]

Before: [0, 1, 2, 2]
7 1 2 2
After:  [0, 1, 2, 2]

Before: [1, 3, 1, 1]
4 0 1 1
After:  [1, 1, 1, 1]

Before: [0, 1, 0, 1]
9 2 1 0
After:  [1, 1, 0, 1]

Before: [0, 2, 3, 3]
7 3 3 3
After:  [0, 2, 3, 9]

Before: [0, 0, 2, 1]
10 2 3 1
After:  [0, 6, 2, 1]

Before: [3, 2, 3, 2]
11 2 3 3
After:  [3, 2, 3, 2]

Before: [2, 1, 1, 2]
12 3 1 3
After:  [2, 1, 1, 3]

Before: [0, 3, 3, 3]
13 0 0 1
After:  [0, 0, 3, 3]

Before: [0, 0, 2, 0]
13 0 0 3
After:  [0, 0, 2, 0]

Before: [2, 2, 3, 3]
3 1 2 0
After:  [4, 2, 3, 3]

Before: [1, 3, 3, 2]
10 1 3 1
After:  [1, 9, 3, 2]

Before: [0, 1, 2, 1]
2 3 1 3
After:  [0, 1, 2, 1]

Before: [2, 3, 1, 1]
0 2 1 1
After:  [2, 3, 1, 1]

Before: [1, 1, 0, 1]
9 2 1 1
After:  [1, 1, 0, 1]

Before: [3, 2, 1, 2]
10 3 3 1
After:  [3, 6, 1, 2]

Before: [1, 0, 2, 2]
0 1 3 3
After:  [1, 0, 2, 2]

Before: [3, 3, 2, 2]
14 0 2 3
After:  [3, 3, 2, 2]

Before: [2, 3, 0, 2]
10 1 2 2
After:  [2, 3, 6, 2]

Before: [1, 3, 2, 0]
4 0 1 0
After:  [1, 3, 2, 0]

Before: [1, 1, 1, 0]
2 2 1 1
After:  [1, 1, 1, 0]

Before: [1, 1, 2, 1]
2 3 1 0
After:  [1, 1, 2, 1]

Before: [0, 3, 0, 3]
15 0 3 0
After:  [3, 3, 0, 3]

Before: [0, 2, 2, 3]
8 2 0 2
After:  [0, 2, 2, 3]

Before: [0, 3, 3, 0]
13 0 0 3
After:  [0, 3, 3, 0]

Before: [3, 2, 2, 1]
4 3 1 1
After:  [3, 1, 2, 1]

Before: [3, 2, 2, 0]
14 0 2 0
After:  [2, 2, 2, 0]

Before: [0, 0, 1, 3]
7 3 3 3
After:  [0, 0, 1, 9]

Before: [2, 3, 3, 2]
11 2 3 2
After:  [2, 3, 2, 2]

Before: [1, 2, 3, 2]
11 2 1 0
After:  [2, 2, 3, 2]

Before: [1, 1, 3, 1]
12 3 2 3
After:  [1, 1, 3, 3]

Before: [2, 3, 1, 2]
3 0 2 1
After:  [2, 4, 1, 2]

Before: [1, 2, 1, 1]
6 3 0 2
After:  [1, 2, 1, 1]

Before: [0, 1, 2, 0]
9 3 1 3
After:  [0, 1, 2, 1]

Before: [1, 0, 2, 1]
15 0 2 1
After:  [1, 3, 2, 1]

Before: [1, 0, 2, 1]
12 3 2 0
After:  [3, 0, 2, 1]

Before: [3, 1, 2, 3]
8 3 3 0
After:  [3, 1, 2, 3]

Before: [1, 0, 2, 2]
15 1 2 2
After:  [1, 0, 2, 2]

Before: [2, 0, 1, 2]
0 2 0 1
After:  [2, 3, 1, 2]

Before: [1, 3, 1, 2]
4 2 1 3
After:  [1, 3, 1, 1]

Before: [0, 0, 0, 3]
5 2 0 2
After:  [0, 0, 0, 3]

Before: [2, 1, 2, 3]
1 2 2 0
After:  [4, 1, 2, 3]

Before: [0, 1, 1, 0]
2 2 1 1
After:  [0, 1, 1, 0]

Before: [1, 1, 1, 0]
6 2 0 1
After:  [1, 1, 1, 0]

Before: [2, 2, 1, 1]
3 0 2 3
After:  [2, 2, 1, 4]

Before: [0, 2, 3, 1]
4 3 1 2
After:  [0, 2, 1, 1]

Before: [2, 0, 2, 2]
8 2 2 3
After:  [2, 0, 2, 2]

Before: [1, 3, 1, 0]
0 0 1 2
After:  [1, 3, 3, 0]

Before: [1, 2, 1, 1]
6 3 0 1
After:  [1, 1, 1, 1]

Before: [1, 2, 0, 0]
7 0 1 0
After:  [2, 2, 0, 0]

Before: [1, 2, 2, 1]
12 3 2 1
After:  [1, 3, 2, 1]

Before: [0, 1, 1, 0]
2 2 1 2
After:  [0, 1, 1, 0]



12 3 3 2
12 3 2 0
12 2 1 1
0 1 2 1
10 1 1 1
1 1 3 3
8 3 1 1
10 2 0 2
3 2 2 2
12 0 2 3
12 2 2 0
9 3 2 3
10 3 2 3
1 1 3 1
8 1 3 3
10 0 0 1
3 1 1 1
10 2 0 0
3 0 3 0
0 2 0 1
10 1 1 1
1 3 1 3
12 2 0 0
10 1 0 1
3 1 1 1
12 3 1 2
7 1 0 2
10 2 1 2
1 3 2 3
8 3 2 2
10 2 0 1
3 1 2 1
12 0 0 3
12 3 0 0
11 0 1 1
10 1 2 1
10 1 1 1
1 1 2 2
12 0 0 1
12 1 3 3
12 2 1 0
12 3 1 0
10 0 2 0
1 2 0 2
8 2 2 3
10 1 0 1
3 1 1 1
10 3 0 0
3 0 3 0
12 0 2 2
4 2 0 2
10 2 3 2
10 2 1 2
1 3 2 3
12 2 1 2
10 0 0 1
3 1 2 1
6 2 0 0
10 0 3 0
1 3 0 3
8 3 1 1
12 0 1 2
12 2 2 3
12 2 3 0
2 0 3 2
10 2 1 2
1 2 1 1
12 1 1 3
12 0 1 2
13 0 3 0
10 0 2 0
1 0 1 1
8 1 2 2
12 2 0 1
12 2 2 3
12 2 0 0
2 0 3 1
10 1 3 1
1 1 2 2
8 2 0 1
12 1 0 3
10 3 0 0
3 0 1 0
12 2 0 2
8 0 2 0
10 0 2 0
1 0 1 1
8 1 3 0
12 3 2 2
12 3 1 1
12 3 3 3
12 2 3 1
10 1 3 1
1 0 1 0
12 0 2 2
12 0 3 3
12 2 2 1
15 1 3 3
10 3 1 3
1 0 3 0
8 0 0 3
12 2 3 0
12 3 2 2
12 3 0 1
6 0 1 0
10 0 3 0
1 0 3 3
8 3 3 1
12 1 3 2
12 2 1 0
12 2 2 3
2 0 3 0
10 0 3 0
1 1 0 1
12 2 0 0
10 3 0 2
3 2 3 2
15 0 3 2
10 2 1 2
10 2 3 2
1 1 2 1
10 2 0 0
3 0 3 0
12 0 1 2
5 2 3 2
10 2 1 2
1 1 2 1
8 1 2 0
12 3 3 3
12 1 3 2
12 3 1 1
14 1 2 3
10 3 3 3
10 3 1 3
1 0 3 0
8 0 2 2
10 2 0 0
3 0 3 0
12 1 0 1
12 2 1 3
7 1 3 1
10 1 3 1
1 2 1 2
8 2 1 1
12 1 1 0
12 2 0 2
12 3 2 3
8 0 2 0
10 0 2 0
1 1 0 1
8 1 2 3
12 0 1 2
12 0 1 0
10 1 0 1
3 1 1 1
12 2 1 1
10 1 3 1
1 1 3 3
8 3 3 1
12 0 1 3
12 2 0 2
12 1 2 0
8 0 2 3
10 3 1 3
1 3 1 1
8 1 0 2
12 3 3 1
12 3 0 3
12 2 1 0
11 1 0 0
10 0 2 0
10 0 3 0
1 2 0 2
8 2 1 0
12 0 0 3
12 3 2 2
12 1 3 1
5 3 2 1
10 1 3 1
1 1 0 0
8 0 0 3
12 0 1 1
12 1 2 0
10 0 2 2
10 2 1 2
1 2 3 3
10 3 0 0
3 0 2 0
12 3 1 2
10 0 0 1
3 1 2 1
0 1 2 2
10 2 1 2
1 3 2 3
8 3 0 1
12 3 3 2
12 2 0 3
0 0 2 3
10 3 3 3
1 1 3 1
8 1 2 2
12 1 2 0
12 0 3 3
12 3 0 1
3 0 1 3
10 3 3 3
1 3 2 2
8 2 2 1
12 2 1 3
12 0 2 2
12 2 3 0
2 0 3 0
10 0 1 0
1 0 1 1
8 1 0 2
12 0 0 1
12 2 0 0
15 0 3 1
10 1 2 1
1 1 2 2
8 2 3 1
12 3 1 2
2 0 3 2
10 2 2 2
1 2 1 1
12 3 3 0
12 2 0 2
6 2 0 3
10 3 2 3
1 1 3 1
8 1 0 0
12 2 3 3
12 1 1 1
12 1 2 2
7 1 3 3
10 3 2 3
1 0 3 0
8 0 0 3
10 1 0 2
3 2 0 2
12 1 0 0
10 1 2 1
10 1 3 1
10 1 1 1
1 3 1 3
8 3 0 2
12 2 1 3
12 2 2 0
12 1 0 1
2 0 3 0
10 0 2 0
1 0 2 2
12 2 3 0
10 3 0 3
3 3 1 3
12 0 0 1
13 0 3 3
10 3 1 3
10 3 2 3
1 2 3 2
12 1 1 3
10 1 0 1
3 1 1 1
7 1 0 1
10 1 3 1
1 2 1 2
8 2 2 0
12 0 3 3
10 0 0 2
3 2 3 2
12 0 2 1
5 3 2 3
10 3 1 3
1 0 3 0
8 0 2 1
12 1 1 0
12 2 0 3
1 0 0 0
10 0 1 0
1 1 0 1
8 1 1 0
12 0 3 2
12 1 2 1
12 0 3 3
12 3 1 3
10 3 3 3
1 3 0 0
8 0 1 3
12 1 1 0
10 0 2 1
10 1 3 1
1 3 1 3
8 3 1 1
12 3 2 0
10 2 0 2
3 2 3 2
12 0 2 3
5 3 2 2
10 2 2 2
1 2 1 1
8 1 2 3
12 2 0 0
12 3 3 2
12 3 0 1
11 1 0 1
10 1 3 1
10 1 2 1
1 1 3 3
8 3 3 1
12 1 1 0
10 2 0 2
3 2 2 2
12 1 0 3
8 0 2 2
10 2 2 2
1 2 1 1
12 1 3 2
1 3 3 0
10 0 2 0
10 0 1 0
1 0 1 1
12 3 3 2
12 0 1 3
12 1 2 0
10 0 2 2
10 2 1 2
1 1 2 1
8 1 3 3
12 3 3 0
10 0 0 2
3 2 0 2
12 1 3 1
4 2 0 0
10 0 1 0
1 0 3 3
8 3 3 1
12 1 1 3
12 2 2 2
12 3 1 0
1 3 3 2
10 2 2 2
1 2 1 1
10 1 0 3
3 3 0 3
10 2 0 0
3 0 1 0
12 2 3 2
9 3 2 0
10 0 1 0
1 0 1 1
12 2 1 3
12 1 3 2
12 2 1 0
2 0 3 2
10 2 1 2
1 1 2 1
10 0 0 0
3 0 3 0
12 3 2 2
10 0 0 3
3 3 0 3
5 3 2 3
10 3 3 3
1 3 1 1
8 1 0 3
12 0 1 2
12 3 2 1
4 2 0 0
10 0 1 0
1 0 3 3
12 2 3 2
12 1 3 0
12 0 0 1
3 0 1 0
10 0 2 0
10 0 3 0
1 0 3 3
8 3 1 1
10 3 0 3
3 3 2 3
12 1 3 0
12 0 1 2
5 2 3 3
10 3 1 3
10 3 1 3
1 3 1 1
8 1 1 3
12 2 3 1
10 3 0 0
3 0 2 0
10 0 0 2
3 2 3 2
0 0 2 1
10 1 3 1
10 1 2 1
1 3 1 3
12 3 0 0
12 2 2 2
12 2 1 1
0 2 0 0
10 0 2 0
1 3 0 3
8 3 3 0
12 0 2 3
12 3 1 3
10 3 3 3
1 3 0 0
12 3 1 1
10 2 0 3
3 3 0 3
10 2 0 2
3 2 1 2
14 1 2 2
10 2 2 2
10 2 1 2
1 2 0 0
10 2 0 3
3 3 3 3
12 1 3 2
14 1 2 1
10 1 2 1
1 0 1 0
12 3 3 1
12 2 1 2
12 0 2 3
6 2 1 2
10 2 3 2
10 2 1 2
1 0 2 0
8 0 1 3
12 1 3 0
12 3 0 2
12 0 0 1
3 0 1 1
10 1 1 1
1 3 1 3
8 3 3 1
10 2 0 2
3 2 2 2
10 2 0 3
3 3 1 3
12 2 1 0
13 0 3 3
10 3 1 3
1 1 3 1
12 2 1 3
2 0 3 2
10 2 3 2
1 2 1 1
8 1 0 2
12 3 1 1
10 1 0 3
3 3 1 3
3 3 1 1
10 1 2 1
1 2 1 2
8 2 1 0
12 0 2 3
12 0 2 1
12 3 1 2
12 2 3 2
10 2 1 2
1 0 2 0
8 0 1 2
12 3 2 3
12 0 2 0
10 3 0 1
3 1 2 1
11 3 1 1
10 1 2 1
10 1 3 1
1 2 1 2
8 2 0 3
12 0 1 2
10 2 0 0
3 0 1 0
10 1 0 1
3 1 2 1
1 0 0 2
10 2 2 2
1 2 3 3
12 0 2 2
1 0 0 1
10 1 2 1
1 1 3 3
12 3 1 0
10 3 0 2
3 2 2 2
12 1 1 1
6 2 0 1
10 1 1 1
1 1 3 3
8 3 2 1
12 0 1 2
12 1 3 3
12 2 2 0
10 3 2 2
10 2 3 2
1 2 1 1
8 1 0 0
12 2 1 3
12 0 3 1
12 2 3 2
15 2 3 2
10 2 3 2
1 0 2 0
8 0 3 2
10 0 0 0
3 0 1 0
12 1 3 3
3 0 1 1
10 1 1 1
1 2 1 2
8 2 1 1
12 2 0 2
12 2 1 0
13 0 3 0
10 0 2 0
1 1 0 1
8 1 0 0
12 2 0 3
12 3 1 2
12 3 3 1
14 1 2 3
10 3 3 3
10 3 3 3
1 0 3 0
8 0 3 2
12 1 1 0
12 2 3 3
12 1 0 1
7 1 3 1
10 1 3 1
1 2 1 2
8 2 2 3
10 0 0 0
3 0 2 0
12 2 1 2
12 3 0 1
6 2 1 0
10 0 3 0
1 0 3 3
8 3 0 1
10 1 0 3
3 3 2 3
10 3 0 0
3 0 2 0
2 0 3 3
10 3 2 3
1 1 3 1
8 1 2 0
12 1 3 1
12 1 1 3
10 0 0 2
3 2 3 2
10 1 2 3
10 3 1 3
1 0 3 0
8 0 0 1
12 0 0 3
10 0 0 2
3 2 2 2
12 0 1 0
9 3 2 0
10 0 1 0
1 1 0 1
8 1 0 2
12 2 1 0
12 1 0 1
12 1 2 3
13 0 3 3
10 3 3 3
1 2 3 2
8 2 1 0
12 0 0 1
12 0 2 2
12 1 3 3
3 3 1 1
10 1 3 1
1 0 1 0
12 3 1 1
12 2 3 3
5 2 3 3
10 3 2 3
1 0 3 0
8 0 1 2
12 2 0 1
12 2 2 0
10 3 0 3
3 3 2 3
2 0 3 0
10 0 1 0
10 0 3 0
1 2 0 2
8 2 2 0
12 2 2 2
12 3 0 1
6 2 1 1
10 1 2 1
1 0 1 0
8 0 1 3
12 2 1 1
10 3 0 0
3 0 1 0
8 0 2 1
10 1 2 1
1 3 1 3
12 3 0 1
12 0 1 0
6 2 1 1
10 1 1 1
1 1 3 3
12 0 2 1
12 3 3 0
12 3 0 2
12 1 2 1
10 1 1 1
10 1 1 1
1 3 1 3
12 1 0 0
12 3 1 1
12 0 2 2
3 0 1 2
10 2 1 2
1 3 2 3
12 3 3 2
12 2 0 0
12 1 0 1
10 1 2 2
10 2 3 2
1 3 2 3
8 3 0 2
10 0 0 3
3 3 1 3
1 3 3 1
10 1 2 1
1 2 1 2
8 2 1 3
12 0 2 2
12 3 0 0
12 0 1 1
4 2 0 2
10 2 2 2
1 2 3 3
8 3 0 0
10 2 0 1
3 1 2 1
12 0 0 3
12 0 1 2
15 1 3 2
10 2 3 2
10 2 1 2
1 2 0 0
8 0 0 2
12 3 0 1
12 3 3 3
12 1 3 0
3 0 1 1
10 1 1 1
1 1 2 2
8 2 2 0
10 1 0 3
3 3 2 3
12 0 2 2
12 0 1 1
5 2 3 2
10 2 3 2
1 0 2 0
12 0 1 2
5 2 3 1
10 1 2 1
1 1 0 0
8 0 3 1
12 1 3 0
7 0 3 2
10 2 1 2
1 1 2 1
8 1 3 2
10 2 0 1
3 1 0 1
12 1 0 3
3 3 1 0
10 0 1 0
10 0 2 0
1 0 2 2
8 2 2 0
10 1 0 3
3 3 3 3
10 3 0 1
3 1 1 1
12 1 2 2
14 3 2 2
10 2 3 2
1 0 2 0
8 0 1 1
12 2 0 3
12 0 1 2
12 2 1 0
5 2 3 0
10 0 2 0
1 0 1 1
12 3 2 0
12 2 0 2
10 1 0 3
3 3 0 3
6 2 0 2
10 2 2 2
10 2 3 2
1 1 2 1
12 2 2 3
12 2 0 0
12 3 3 2
4 0 2 3
10 3 1 3
1 3 1 1
8 1 3 3
12 3 2 1
0 0 2 0
10 0 2 0
1 0 3 3
8 3 1 0
12 1 3 3
10 3 0 1
3 1 1 1
12 0 2 2
10 1 2 1
10 1 3 1
1 1 0 0
8 0 1 1
12 2 2 3
12 1 0 0
12 3 1 2
7 0 3 0
10 0 3 0
1 1 0 1
8 1 2 2
12 1 0 1
10 2 0 0
3 0 2 0
12 1 0 3
7 3 0 0
10 0 2 0
1 2 0 2
12 2 3 3
12 2 2 0
2 0 3 1
10 1 2 1
1 2 1 2
8 2 3 1
12 0 1 0
12 3 1 2
12 1 0 3
10 3 2 0
10 0 2 0
1 0 1 1
8 1 1 2
12 2 3 0
12 0 3 1
13 0 3 0
10 0 3 0
10 0 2 0
1 2 0 2
12 2 2 0
12 3 3 1
7 3 0 1
10 1 3 1
1 1 2 2
8 2 2 0
12 3 1 2
10 3 0 1
3 1 2 1
0 1 2 3
10 3 2 3
10 3 3 3
1 0 3 0
12 3 2 1
12 0 3 3
5 3 2 1
10 1 3 1
10 1 1 1
1 1 0 0
8 0 0 3
12 0 3 2
12 2 2 0
12 3 0 1
11 1 0 0
10 0 2 0
1 3 0 3
8 3 0 1
12 0 3 3
10 0 0 0
3 0 3 0
10 2 0 2
3 2 2 2
9 3 2 2
10 2 3 2
1 1 2 1
12 2 1 2
15 2 3 2
10 2 2 2
10 2 1 2
1 2 1 1
12 2 0 3
12 0 3 2
4 2 0 2
10 2 3 2
1 2 1 1
8 1 3 3
10 1 0 2
3 2 3 2
12 2 1 1
12 0 2 0
0 1 2 1
10 1 3 1
1 1 3 3
8 3 1 1
10 0 0 2
3 2 0 2
12 3 2 3
10 3 0 0
3 0 1 0
10 0 2 0
10 0 3 0
10 0 2 0
1 0 1 1
8 1 2 2
10 1 0 1
3 1 2 1
10 1 0 0
3 0 2 0
12 1 3 1
10 1 2 1
1 2 1 2
12 1 3 3
10 3 0 1
3 1 3 1
6 0 1 3
10 3 3 3
10 3 2 3
1 3 2 2
12 2 2 3
12 1 3 0
7 0 3 1
10 1 3 1
1 2 1 2
10 1 0 0
3 0 0 0
10 3 0 3
3 3 1 3
12 1 0 1
1 3 3 0
10 0 1 0
1 2 0 2
8 2 3 1
12 2 3 3
12 1 3 0
12 1 1 2
7 0 3 3
10 3 2 3
1 3 1 1
8 1 3 2
12 2 0 0
12 2 3 3
12 3 2 1
2 0 3 1
10 1 3 1
1 2 1 2
8 2 3 1
12 3 3 3
12 3 2 0
12 2 3 2
0 2 0 2
10 2 1 2
10 2 1 2
1 2 1 1
8 1 1 0
INPUT;
    }

}
