<?php

namespace PatrickRose\AdventOfCode\Days;

class ChronalCoordinates extends AbstractDay
{
    protected function getPuzzleInput(): string
    {
        return <<<INPUT
69, 102
118, 274
150, 269
331, 284
128, 302
307, 192
238, 52
240, 339
111, 127
180, 156
248, 265
160, 69
58, 136
43, 235
154, 202
262, 189
309, 53
292, 67
335, 198
99, 199
224, 120
206, 313
359, 352
101, 147
301, 47
255, 347
121, 153
264, 343
252, 225
48, 90
312, 139
90, 277
203, 227
315, 328
330, 81
190, 191
89, 296
312, 255
218, 181
299, 149
151, 254
209, 212
42, 76
348, 183
333, 227
44, 210
293, 356
44, 132
175, 77
215, 109
INPUT;
    }

    public function getAnswer(bool $partTwo): string
    {
        $input = $this->getPuzzleInput();

        $coordinates = [];

        foreach (explode("\n", $input) as $row) {
            $coordinates[] = explode(", ", $row);
        }

        // Find the size of the grid
        $xMax = max(array_map(function ($coord) {
            return $coord[0];
        }, $coordinates));
        $yMax = max(array_map(function ($coord) {
            return $coord[1];
        }, $coordinates));

        $infinite = [];
        $areas = [];

        for ($x = 0; $x <= $xMax; $x++) {
            for ($y = 0; $y <= $yMax; $y++) {
                if ($partTwo) {
                    $manhattens = $this->getManhattens($x, $y, $coordinates);

                    if (array_sum($manhattens) < 10000)
                    {
                        $areas[0] = ($areas[0] ?? 0) + 1;
                    }
                } else {
                    $closestCoord = $this->getClosestCoord($x, $y, $coordinates);

                    if (isset($infinite[$closestCoord])) {
                        continue;
                    }

                    if ($x == 0 || $x == $xMax || $y == 0 || $y == $yMax) {
                        $infinite[$closestCoord] = true;
                        $areas[$closestCoord] = -1;
                    } else {
                        $areas[$closestCoord] = 1 + ($areas[$closestCoord] ?? 0);
                    }
                }
            }
        }

        return max($areas);
    }

    private function getManhattens(int $x, int $y, array $coordinates)
    {
        $distances = [];

        foreach ($coordinates as $i => $coordinate) {
            $distances[$i] = abs($x - $coordinate[0]) + abs($y - $coordinate[1]);
        }

        return $distances;
    }

    private function getClosestCoord(int $x, int $y, array $coordinates)
    {
        $distances = $this->getManhattens($x, $y, $coordinates);
        $minDistance = min($distances);

        $closestCoords = array_filter($distances, function ($val) use ($minDistance) {
            return $minDistance == $val;
        });
        return count($closestCoords) > 1 ? null : key($closestCoords);
    }
}
