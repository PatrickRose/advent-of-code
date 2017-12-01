<?php

namespace PatrickRose\DayNine;

use PatrickRose\AdventOfCode;

class ShortestRoute extends AdventOfCode
{

    private $distanceMap;

    public function parseInput($string)
    {
        preg_match('/(.+ to .+) = (\d+)/', $string, $matches);
        unset($matches[0]);

        return array_merge($matches);
    }

    protected function runPuzzleInput()
    {
        return $this->getShortestRoute(
            explode(PHP_EOL, file_get_contents(__DIR__ . '/input.txt'))
        );
    }

    public function getShortestRoute(array $distances)
    {
        $this->getDistanceMap($distances);

        $answer = 0;

        $locations = [];

        foreach ($this->distanceMap as $firstPlaceToSecondPlace => $distance) {

            list($first, $second) = $this->getFirstPlaceAndSecondPlace(
                $firstPlaceToSecondPlace
            );
            echo 'Checking ' . $firstPlaceToSecondPlace . PHP_EOL;

            if (isset($locations[$first], $locations[$second])) {
                // Have both these locations - move on
                continue;
            }

            if (isset($locations[$first])) {
                $locations[$second] = $first;
            }
            else {
                $locations[$first] = $second;
            }

            echo 'Added ' . $firstPlaceToSecondPlace . PHP_EOL;
            $answer += $distance;
        }

        $visited = ['Faerun'];
        $from = 'Faerun';

        while (count($visited) != count($locations)) {
            $from = $locations[$from];
            $visited[] = $from;
        }
        print_r($visited);

        return $answer;
    }

    /**
     * @param array $distances
     */
    protected function getDistanceMap(array $distances)
    {
        foreach ($distances as $input) {
            list($firstPlaceToSecondPlace, $distance) = $this->parseInput(
                $input
            );
            $this->distanceMap[$firstPlaceToSecondPlace] = $distance;
        }

        asort($this->distanceMap);
    }

    protected function getFirstPlaceAndSecondPlace($firstPlaceToSecondPlace)
    {
        return explode(' to ', $firstPlaceToSecondPlace);
    }
}