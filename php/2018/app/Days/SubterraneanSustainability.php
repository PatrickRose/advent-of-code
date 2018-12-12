<?php

namespace PatrickRose\AdventOfCode\Days;


class SubterraneanSustainability extends AbstractDay
{

    protected function getPuzzleInput(): string
    {
        return <<<INPUT
initial state: ####....#...######.###.#...##....#.###.#.###.......###.##..##........##..#.#.#..##.##...####.#..##.#

..#.. => .
#.#.# => #
#.### => #
.##.. => .
#.#.. => #
.#.#. => #
.###. => #
.#### => #
##... => #
#.##. => #
#..## => #
....# => .
###.# => .
##### => #
..... => .
..#.# => .
.#... => #
##.#. => .
.#.## => #
..##. => .
#...# => .
##.## => #
...#. => .
#..#. => .
..### => .
.##.# => .
#.... => .
.#..# => #
####. => .
...## => #
##..# => .
###.. => .
INPUT;
    }

    public function getAnswer(bool $partTwo): string
    {
        $input = $this->getPuzzleInput();

        $input = explode("\n", $input);

        $initial = str_replace('initial state: ', '', array_shift($input));
        array_shift($input);
        $plants = [];

        for ($i = 0; $i < strlen($initial); $i++) {
            $plants[$i] = $initial[$i] == '#';
        }

        $rules = [];

        foreach ($input as $row) {
            preg_match('/([#.]{5}) => ([#.])/', $row, $matches);
            $rules[$matches[1]] = $matches[2] == '#';
        }
        // We only care about plants where it has a field
        $numGenerations = $partTwo ? 50000000000 : 20;

        $initialSum = array_sum(array_keys(array_filter($plants)));
        $cache = [0 => $initialSum];

        for ($i = 1; $i <= $numGenerations; $i++) {
            // Make sure we have at least 5 empty to the left/right of this
            $minKey = min(array_keys($plants));
            $numToAdd = 5;

            while ($numToAdd > 0 && !($plants[$minKey + 5 - $numToAdd] ?? false)) {
                $numToAdd--;
            }

            for ($j = 1; $j <= $numToAdd; $j++) {
                $plants[$minKey - $j] = false;
            }
            $maxKey = max(array_keys($plants));
            $numToAdd = 5;

            while ($numToAdd > 0 && !($plants[$maxKey - 5 + $numToAdd] ?? false)) {
                $numToAdd--;
            }

            for ($j = 1; $j <= $numToAdd; $j++) {
                $plants[$maxKey + $j] = false;
            }

            $newPlants = [];

            foreach ($plants as $index => $plantIsThere) {
                // Build the pattern
                $pattern = '';
                for ($j = -2; $j <= 2; $j++) {
                    $pattern .= ($plants[$index + $j] ?? false) ? '#' : '.';
                }

                $newPlants[$index] = $rules[$pattern] ?? false;
            }

            $plants = $newPlants;

            $cache[$i] = array_sum(array_keys(array_filter($plants)));

            if ($i > 2 && $cache[$i] - $cache[$i-1] == $cache[$i-1] - $cache[$i-2]) {
                $stabilised = $cache[$i] - $cache[$i-1];

                return $cache[$i] + ($stabilised * ($numGenerations - $i));
            }
        }

        return array_sum(array_keys(array_filter($plants)));
    }
}
