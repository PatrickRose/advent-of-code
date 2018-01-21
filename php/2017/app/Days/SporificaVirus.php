<?php


namespace PatrickRose\AdventOfCode\Days;

use Symfony\Component\Console\Output\OutputInterface;

/**
 * Diagnostics indicate that the local grid computing cluster has been contaminated with the Sporifica Virus. The grid computing cluster is a seemingly-infinite two-dimensional grid of compute nodes. Each node is either clean or infected by the virus.
 *
 * To prevent overloading the nodes (which would render them useless to the virus) or detection by system administrators, exactly one virus carrier moves through the network, infecting or cleaning nodes as it moves. The virus carrier is always located on a single node in the network (the current node) and keeps track of the direction it is facing.
 *
 * To avoid detection, the virus carrier works in bursts; in each burst, it wakes up, does some work, and goes back to sleep. The following steps are all executed in order one time each burst:
 *
 * If the current node is infected, it turns to its right. Otherwise, it turns to its left. (Turning is done in-place; the current node does not change.)
 * If the current node is clean, it becomes infected. Otherwise, it becomes cleaned. (This is done after the node is considered for the purposes of changing direction.)
 * The virus carrier moves forward one node in the direction it is facing.
 *
 * Diagnostics have also provided a map of the node infection status (your puzzle input). Clean nodes are shown as .; infected nodes are shown as #. This map only shows the center of the grid; there are many more nodes beyond those shown, but none of them are currently infected.
 *
 * The virus carrier begins in the middle of the map facing up.
 *
 * For example, suppose you are given a map like this:
 *
 * ..#
 * #..
 * ...
 *
 * Then, the middle of the infinite grid looks like this, with the virus carrier's position marked with [ ]:
 *
 * . . . . . . . . .
 * . . . . . . . . .
 * . . . . . . . . .
 * . . . . . # . . .
 * . . . #[.]. . . .
 * . . . . . . . . .
 * . . . . . . . . .
 * . . . . . . . . .
 *
 * The virus carrier is on a clean node, so it turns left, infects the node, and moves left:
 *
 * . . . . . . . . .
 * . . . . . . . . .
 * . . . . . . . . .
 * . . . . . # . . .
 * . . .[#]# . . . .
 * . . . . . . . . .
 * . . . . . . . . .
 * . . . . . . . . .
 *
 * The virus carrier is on an infected node, so it turns right, cleans the node, and moves up:
 *
 * . . . . . . . . .
 * . . . . . . . . .
 * . . . . . . . . .
 * . . .[.]. # . . .
 * . . . . # . . . .
 * . . . . . . . . .
 * . . . . . . . . .
 * . . . . . . . . .
 *
 * Four times in a row, the virus carrier finds a clean, infects it, turns left, and moves forward, ending in the same place and still facing up:
 *
 * . . . . . . . . .
 * . . . . . . . . .
 * . . . . . . . . .
 * . . #[#]. # . . .
 * . . # # # . . . .
 * . . . . . . . . .
 * . . . . . . . . .
 * . . . . . . . . .
 *
 * Now on the same node as before, it sees an infection, which causes it to turn right, clean the node, and move forward:
 *
 * . . . . . . . . .
 * . . . . . . . . .
 * . . . . . . . . .
 * . . # .[.]# . . .
 * . . # # # . . . .
 * . . . . . . . . .
 * . . . . . . . . .
 * . . . . . . . . .
 *
 * After the above actions, a total of 7 bursts of activity had taken place. Of them, 5 bursts of activity caused an infection.
 *
 * After a total of 70, the grid looks like this, with the virus carrier facing up:
 *
 * . . . . . # # . .
 * . . . . # . . # .
 * . . . # . . . . #
 * . . # . #[.]. . #
 * . . # . # . . # .
 * . . . . . # # . .
 * . . . . . . . . .
 * . . . . . . . . .
 *
 * By this time, 41 bursts of activity caused an infection (though most of those nodes have since been cleaned).
 *
 * After a total of 10000 bursts of activity, 5587 bursts will have caused an infection.
 *
 * Given your actual map, after 10000 bursts of activity, how many bursts cause a node to become infected? (Do not count nodes that begin infected.)
 */
class SporificaVirus extends AbstractDay
{

    protected function getPuzzleInput(): string
    {
        return <<<INPUT
..#..##...##.######.##...
..#...#####..#.#####..#..
...##.#..##.#.##....#...#
#.#.#.#..###...#....##..#
..#..#####.....##..#.#..#
.##.#####.#.....###.#..#.
##..####...#.##.#...##...
###.#.#####...##.#.##..#.
#.##..##.#....#.#..#.##..
###.######......####..#.#
###.....#.##.##.######..#
...####.###.#....#..##.##
#..####.#.....#....###.#.
#..##..#.####.#.##..#.#..
#..#.#.##...#...#####.##.
#.###..#.##.#..##.#######
...###..#..####.####.#.#.
.#..###..###.#....#######
.####..##.#####.#.#..#.#.
#.#....##.....##.##.....#
....####.....#..#.##..##.
######..##..#.###...###..
..##...##.....#..###.###.
##.#.#..##.#.#.##....##.#
.#.###..##..#....#...##.#
INPUT;

    }

    public function getAnswer(bool $partTwo): string
    {
        $grid = [];

        $puzzleInput = $this->getPuzzleInput();

        foreach (explode("\n", $puzzleInput) as $i => $line) {
            $grid[$i] = array_map(
                function ($char) {
                    return $char == '#' ? 'I' : 'C';
                },
                str_split($line)
            );
        }

        $steps = $partTwo ? 10000000 : 10000;
        $count = 0;
        $x = ((count($grid) + 1) / 2) - 1;
        $y = $x;
        $direction = 0;

        for ($i = 0; $i < $steps; $i++) {
            if (!isset($grid[$x][$y])) {
                $grid[$x][$y] = 'C';
            }

            if ($this->output->isDebug()) {
                $min = [];
                $max = [];

                foreach ($grid as $line) {
                    $min[] = min(array_keys($line));
                    $max[] = max(array_keys($line));
                }

                $min = min($min);
                $max = min($max);
                foreach ($grid as $j => $line) {
                    for ($i = $min; $i <= $max; $i++) {
                        $char = ($line[$i] ?? 'C');

                        if ($x == $j && $i == $y) {
                            $toWrite = "[$char]";
                        } else {
                            $toWrite = " $char ";
                        }

                        $this->output->write($toWrite);
                    }
                    $this->output->write('', true);
                }
            }

            switch ($grid[$x][$y]) {
                case 'C':
                    $direction += 3;
                    break;
                case 'W':
                    break;
                case 'I':
                    $direction += 1;
                    break;
                case 'F':
                    $direction += 2;
                    break;
            }

            $direction = $direction % 4;

            switch ($grid[$x][$y]) {
                case 'C':
                    $grid[$x][$y] = $partTwo ? 'W' : 'I';
                    break;
                case 'W':
                    $grid[$x][$y] = 'I';
                    break;
                case 'I':
                    $grid[$x][$y] = $partTwo ? 'F' : 'C';
                    break;
                case 'F':
                    $grid[$x][$y] = 'C';
                    break;
            }

            if ($grid[$x][$y] == 'I') {
                $count++;
            }

            switch ($direction) {
                case 0:
                    $x--;
                    break;
                case 1:
                    $y++;
                    break;
                case 2:
                    $x++;
                    break;
                case 3:
                    $y--;
                    break;
            }
        }

        return $count;
    }


}
