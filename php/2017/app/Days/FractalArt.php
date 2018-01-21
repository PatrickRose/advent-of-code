<?php


namespace PatrickRose\AdventOfCode\Days;

use Exception;

/**
 * You find a program trying to generate some art. It uses a strange process
 * that involves repeatedly enhancing the detail of an image through a set of
 * rules.
 *
 * The image consists of a two-dimensional square grid of pixels that are
 * either on (#) or off (.). The program always begins with this pattern:
 *
 * .#.
 * ..#
 * ###
 *
 * Because the pattern is both 3 pixels wide and 3 pixels tall, it is said to
 * have a size of 3.
 *
 * Then, the program repeats the following process:
 *
 * If the size is evenly divisible by 2, break the pixels up into 2x2 squares,
 * and convert each 2x2 square into a 3x3 square by following the corresponding
 * enhancement rule. Otherwise, the size is evenly divisible by 3; break the
 * pixels up into 3x3 squares, and convert each 3x3 square into a 4x4 square by
 * following the corresponding enhancement rule.
 *
 * Because each square of pixels is replaced by a larger one, the image gains
 * pixels and so its size increases.
 *
 * The artist's book of enhancement rules is nearby (your puzzle input);
 * however, it seems to be missing rules. The artist explains that sometimes,
 * one must rotate or flip the input pattern to find a match. (Never rotate or
 * flip the output pattern, though.) Each pattern is written concisely: rows
 * are listed as single units, ordered top-down, and separated by slashes. For
 * example, the following rules correspond to the adjacent patterns:
 *
 * ../.#  =  ..
 * .#
 *
 * .#.
 * .#./..#/###  =  ..#
 * ###
 *
 * #..#
 * #..#/..../#..#/.##.  =  ....
 * #..#
 * .##.
 *
 * When searching for a rule to use, rotate and flip the pattern as necessary.
 * For example, all of the following patterns match the same rule:
 *
 * .#.   .#.   #..   ###
 * ..#   #..   #.#   ..#
 * ###   ###   ##.   .#.
 *
 * Suppose the book contained the following two rules:
 *
 * ../.# => ##./#../...
 * .#./..#/### => #..#/..../..../#..#
 *
 * As before, the program begins with this pattern:
 *
 * .#.
 * ..#
 * ###
 *
 * The size of the grid (3) is not divisible by 2, but it is divisible by 3. It
 * divides evenly into a single square; the square matches the second rule,
 * which produces:
 *
 * #..#
 * ....
 * ....
 * #..#
 *
 * The size of this enhanced grid (4) is evenly divisible by 2, so that rule is
 * used. It divides evenly into four squares:
 *
 * #.|.#
 * ..|..
 * --+--
 * ..|..
 * #.|.#
 *
 * Each of these squares matches the same rule (../.# => ##./#../...), three of
 * which require some flipping and rotation to line up with the rule. The
 * output for the rule is the same in all four cases:
 *
 * ##.|##.
 * #..|#..
 * ...|...
 * ---+---
 * ##.|##.
 * #..|#..
 * ...|...
 *
 * Finally, the squares are joined into a new grid:
 *
 * ##.##.
 * #..#..
 * ......
 * ##.##.
 * #..#..
 * ......
 *
 * Thus, after 2 iterations, the grid contains 12 pixels that are on.
 *
 * How many pixels stay on after 5 iterations?
 */
class FractalArt extends AbstractDay
{

    private $actions = [];

    protected function getPuzzleInput(): string
    {
        return <<<INPUT
../.. => .##/..#/##.
#./.. => ##./#../#..
##/.. => ###/#.#/..#
.#/#. => .../#../##.
##/#. => ###/#../###
##/## => .##/.##/#.#
.../.../... => #.##/#.##/###./..##
#../.../... => ##.#/..##/#.#./##.#
.#./.../... => ###./.#.#/.#../.###
##./.../... => ##.#/###./..../##..
#.#/.../... => ##.#/.###/.##./#.#.
###/.../... => #..#/.##./#.../.#.#
.#./#../... => .##./####/#..#/###.
##./#../... => ##../..#./#.##/..##
..#/#../... => #.##/.#.#/##../..##
#.#/#../... => #.../##../..#./.##.
.##/#../... => #.#./.#.#/#.##/#..#
###/#../... => .#../.#../...#/##..
.../.#./... => ..#./..#./##../.#.#
#../.#./... => ##../####/##../.###
.#./.#./... => ..../#..#/#.#./....
##./.#./... => ..##/####/..../##..
#.#/.#./... => #.##/##../#.../..#.
###/.#./... => ..../..../####/#..#
.#./##./... => ..../####/##.#/....
##./##./... => ####/#.../.###/#.##
..#/##./... => .#.#/.#../###./.#..
#.#/##./... => .#.#/###./..../..##
.##/##./... => #.../.#.#/.#.#/...#
###/##./... => #.##/.#../.#../#...
.../#.#/... => ###./..#./.#../..##
#../#.#/... => #..#/#.##/.#../...#
.#./#.#/... => ####/..#./..../..#.
##./#.#/... => #.#./..../.###/..#.
#.#/#.#/... => #..#/.#../#.#./.###
###/#.#/... => .##./#..#/.#.#/..#.
.../###/... => .#../#..#/...#/.##.
#../###/... => .##./##../###./##.#
.#./###/... => ...#/..##/###./...#
##./###/... => .#.#/##.#/.###/.#..
#.#/###/... => #.#./##../#.#./..#.
###/###/... => .#.#/####/###./####
..#/.../#.. => .#../#.##/..../..#.
#.#/.../#.. => ..../.#.#/##../#..#
.##/.../#.. => #.##/.#.#/#..#/.#.#
###/.../#.. => #..#/.#.#/#.#./##.#
.##/#../#.. => ##../##.#/##.#/#..#
###/#../#.. => ..../#..#/###./#.##
..#/.#./#.. => ..../.#../..../.##.
#.#/.#./#.. => #..#/#.##/.###/....
.##/.#./#.. => ###./..../##.#/#.#.
###/.#./#.. => #.../###./.#.#/..#.
.##/##./#.. => ..../.#../..#./#.#.
###/##./#.. => ...#/.###/###./####
#../..#/#.. => ..../.##./..##/..##
.#./..#/#.. => .#.#/#.../#..#/###.
##./..#/#.. => #.#./.##./.##./....
#.#/..#/#.. => #..#/..##/##.#/##..
.##/..#/#.. => ..#./#.../.##./##.#
###/..#/#.. => ##../.##./####/.##.
#../#.#/#.. => ###./#.#./###./.#.#
.#./#.#/#.. => .##./#.#./#..#/..#.
##./#.#/#.. => .#.#/#.#./#.../##.#
..#/#.#/#.. => .##./##.#/.#.#/.#.#
#.#/#.#/#.. => .#../.##./###./#...
.##/#.#/#.. => ####/##../.##./##.#
###/#.#/#.. => ###./.##./##.#/#...
#../.##/#.. => ...#/#.#./..##/####
.#./.##/#.. => #.../##.#/.##./###.
##./.##/#.. => ##.#/.#.#/..../#.#.
#.#/.##/#.. => ..../#.../.#.#/..#.
.##/.##/#.. => ##../..../..#./#.##
###/.##/#.. => ..#./...#/#..#/...#
#../###/#.. => ..../.#../#.../###.
.#./###/#.. => ..../#.#./.#.#/...#
##./###/#.. => ###./###./..#./.###
..#/###/#.. => #.##/..#./..##/#...
#.#/###/#.. => ##.#/.#.#/##../#..#
.##/###/#.. => ###./..##/#.../....
###/###/#.. => .###/###./#.../..#.
.#./#.#/.#. => ..##/##.#/.##./####
##./#.#/.#. => ..../.#.#/#.../###.
#.#/#.#/.#. => ##.#/###./..#./.#..
###/#.#/.#. => .###/##../.###/....
.#./###/.#. => ####/.###/.###/....
##./###/.#. => #.#./#..#/#..#/###.
#.#/###/.#. => #.#./.#.#/#.##/####
###/###/.#. => #.#./.###/..#./#.#.
#.#/..#/##. => ###./.#.#/##../##..
###/..#/##. => #.../.###/#.../..#.
.##/#.#/##. => #..#/.#.#/...#/.#..
###/#.#/##. => ...#/###./..##/.#.#
#.#/.##/##. => ###./...#/..../#...
###/.##/##. => ...#/#.../#.##/##..
.##/###/##. => .###/.###/..#./#...
###/###/##. => #.../##../##.#/.###
#.#/.../#.# => ##../#.##/..#./.###
###/.../#.# => #.#./.##./.##./#..#
###/#../#.# => #.../##../####/..##
#.#/.#./#.# => #.../.#../#.../..##
###/.#./#.# => #..#/###./####/#...
###/##./#.# => ##../..##/#.#./##..
#.#/#.#/#.# => .#../.#.#/#.#./.#.#
###/#.#/#.# => ..##/####/####/.###
#.#/###/#.# => .###/##../#..#/..#.
###/###/#.# => ##../#.../##.#/##..
###/#.#/### => ###./...#/####/..#.
###/###/### => .##./##../..../..#.
INPUT;
    }

    public function getAnswer(bool $partTwo): string
    {
        $lights = [
            [false, true, false],
            [false, false, true],
            [true, true, true]
        ];

        $input = $this->getPuzzleInput();
        $this->makeAction($input);

        $steps = $partTwo ? 18 : 5;

        return $this->countLights($lights, $steps);
    }

    /**
     * @param $lights
     * @return string
     */
    protected function lightsToString($lights): string
    {
        return implode(
            '/',
            array_map(
                function ($value) {
                    return array_reduce(
                        $value,
                        function ($carry, $val) {
                            return $carry . ($val ? '#' : '.');
                        }
                    );
                },
                $lights
            )
        );
    }

    /**
     * @param $input
     * @return array
     */
    protected function stringToLights($input): array
    {
        $nextValue = [];

        foreach (explode('/', $input) as $row) {
            $nextValue[] = array_map(
                function ($value) {
                    return $value == '#';
                },
                str_split($row)
            );
        }
        return $nextValue;
    }

    private function countLights($lights, $steps)
    {
        for ($i = $steps; $i > 0; $i--) {
            $new = [];

            $count = count($lights);
            
            if ($count == 9) {
                $toReturn = 0;
                for ($y = 0; $y < $count; $y+=3) {
                    for ($x = 0; $x < $count; $x+=3) {
                        $toReturn += $this->countLights(
                            [
                                [$lights[$y + 0][$x + 0],$lights[$y + 0][$x + 1],$lights[$y + 0][$x + 2],],
                                [$lights[$y + 1][$x + 0],$lights[$y + 1][$x + 1],$lights[$y + 1][$x + 2],],
                                [$lights[$y + 2][$x + 0],$lights[$y + 2][$x + 1],$lights[$y + 2][$x + 2],],
                            ],
                            $i
                        );
                    }
                }
                
                return $toReturn;
            }

            if (($count % 2) == 0) {
                for ($y = 0; $y < $count; $y += 2) {
                    for ($x = 0; $x < $count; $x += 2) {
                        $toChange = [
                            [$lights[$y][$x], $lights[$y][$x + 1]],
                            [$lights[$y + 1][$x], $lights[$y + 1][$x + 1]]
                        ];
                        $key = $this->lightsToString($toChange);

                        if (isset($this->actions[$key])) {
                            $new[] = [
                                'x' => (($x / 2)) * 3,
                                'y' => (($y / 2)) * 3,
                                'values' => $this->actions[$key]
                            ];
                        } else {
                            throw new \LogicException("$i: Haven't done $key");
                        }
                    }
                }
            } else {
                for ($y = 0; $y < $count; $y += 3) {
                    for ($x = 0; $x < $count; $x += 3) {
                        $toChange = [
                            [$lights[$y][$x], $lights[$y][$x + 1], $lights[$y][$x + 2]],
                            [$lights[$y + 1][$x], $lights[$y + 1][$x + 1], $lights[$y + 1][$x + 2]],
                            [$lights[$y + 2][$x], $lights[$y + 2][$x + 1], $lights[$y + 2][$x + 2]],
                        ];
                        $key = $this->lightsToString($toChange);

                        if (isset($this->actions[$key])) {
                            $new[] = [
                                'x' => (($x / 3)) * 4,
                                'y' => (($y / 3)) * 4,
                                'values' => $this->actions[$key]
                            ];
                        } else {
                            throw new \LogicException("$i: Haven't done $key");
                        }
                    }
                }
            }

            $nextLights = [];

            if (empty($new)) {
                throw new Exception('What?');
            }

            foreach ($new as $value) {
                foreach ($value['values'] as $y => $yRow) {
                    foreach ($yRow as $x => $xVal) {
                        $yKey = $y + $value['y'];
                        $xKey = $x + $value['x'];

                        $nextLights[$yKey][$xKey] = $xVal;
                    }
                }
            }

            foreach ($nextLights as &$row) {
                ksort($row);
            }

            ksort($nextLights);

            $lights = $nextLights;
        }

        return array_sum(
            array_map(
                function ($array) {
                    return count(array_filter($array));
                },
                $lights
            )
        );
    }

    /**
     * @param $input
     */
    protected function makeAction($input): void
    {
        $actions = [];
        foreach (explode("\n", $input) as $line) {
            list($current, $next) = explode(' => ', $line);

            $nextValue = $this->stringToLights($next);

            $flip = function ($input) {
                return $input;
            };
            $flipX = function ($input) {
                $array = $this->stringToLights($input);
                $numRows = count($array);

                foreach ($array as &$row) {
                    $baseX = $row[0];
                    $row[0] = $row[$numRows - 1];
                    $row[$numRows - 1] = $baseX;
                }

                return $this->lightsToString($array);

                return $input;
            };
            $flipY = function ($input) {
                $array = $this->stringToLights($input);

                $baseY = $array[0];
                $numRows = count($array);

                $array[0] = $array[$numRows - 1];
                $array[$numRows - 1] = $baseY;

                return $this->lightsToString($array);
            };

            $rot0 = function ($input) {
                return $input;
            };
            $rot1 = function ($input) {
                $array = $this->stringToLights($input);

                if (count($array) == 2) {
                    $newArray = [
                        [$array[1][0], $array[0][0]],
                        [$array[1][1], $array[0][1]],
                    ];
                } else {
                    $newArray = [
                        [$array[2][0], $array[1][0], $array[0][0]],
                        [$array[2][1], $array[1][1], $array[0][1]],
                        [$array[2][2], $array[1][2], $array[0][2]],
                    ];
                }

                return $this->lightsToString($newArray);
            };
            $rot2 = function ($input) {
                $array = $this->stringToLights($input);

                if (count($array) == 2) {
                    $newArray = [
                        [$array[1][1], $array[1][0]],
                        [$array[0][1], $array[0][0]],
                    ];
                } else {
                    $newArray = [
                        [$array[2][2], $array[2][1], $array[2][0]],
                        [$array[1][2], $array[1][1], $array[1][0]],
                        [$array[0][2], $array[0][1], $array[0][0]],
                    ];
                }

                return $this->lightsToString($newArray);
            };
            $rot3 = function ($input) {
                $array = $this->stringToLights($input);

                if (count($array) == 2) {
                    $newArray = [
                        [$array[0][1], $array[1][1]],
                        [$array[0][0], $array[1][0]],
                    ];
                } else {
                    $newArray = [
                        [$array[0][2], $array[1][2], $array[2][2]],
                        [$array[0][1], $array[1][1], $array[2][1]],
                        [$array[0][0], $array[1][0], $array[2][0]],
                    ];
                }

                return $this->lightsToString($newArray);
            };
            $flipFn = null;
            $rotFn = null;

            foreach (['flip', 'flipx', 'flipy'] as $toFlip) {
                switch ($toFlip) {
                    case 'flip':
                        $flipFn = $flip;
                        break;
                    case 'flipx':
                        $flipFn = $flipX;
                        break;
                    case 'flipy':
                        $flipFn = $flipY;
                        break;
                }
                foreach (['rot0', 'rot1', 'rot2', 'rot3'] as $toRot) {
                    switch ($toRot) {
                        case 'rot0':
                            $rotFn = $rot0;
                            break;
                        case 'rot1':
                            $rotFn = $rot1;
                            break;
                        case 'rot2':
                            $rotFn = $rot2;
                            break;
                        case 'rot3':
                            $rotFn = $rot3;
                            break;
                    }

                    // Do a flip then rotate
                    $flipThenRotate = $rotFn($flipFn($current));
                    $actions[$flipThenRotate] = $nextValue;
                    // Do a rotate then a flip
                    $rotateThenFlip = $flipFn($rotFn($current));
                    $actions[$rotateThenFlip] = $nextValue;
                }
            }
        }

        $this->actions = $actions;
    }
}
