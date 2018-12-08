<?php

namespace PatrickRose\AdventOfCode\Days;

use Symfony\Component\Console\Helper\QuestionHelper;
use Symfony\Component\Console\Question\Question;

class SumOfItsParts extends AbstractDay
{

    protected function getPuzzleInput(): string
    {
        return <<<INPUT
Step B must be finished before step X can begin.
Step V must be finished before step F can begin.
Step K must be finished before step C can begin.
Step S must be finished before step D can begin.
Step C must be finished before step A can begin.
Step H must be finished before step X can begin.
Step Q must be finished before step W can begin.
Step X must be finished before step F can begin.
Step J must be finished before step R can begin.
Step D must be finished before step O can begin.
Step F must be finished before step P can begin.
Step M must be finished before step Z can begin.
Step R must be finished before step I can begin.
Step Y must be finished before step O can begin.
Step G must be finished before step Z can begin.
Step Z must be finished before step P can begin.
Step O must be finished before step L can begin.
Step A must be finished before step P can begin.
Step U must be finished before step L can begin.
Step L must be finished before step W can begin.
Step P must be finished before step W can begin.
Step I must be finished before step W can begin.
Step E must be finished before step N can begin.
Step W must be finished before step N can begin.
Step T must be finished before step N can begin.
Step G must be finished before step E can begin.
Step K must be finished before step T can begin.
Step I must be finished before step T can begin.
Step V must be finished before step H can begin.
Step W must be finished before step T can begin.
Step M must be finished before step A can begin.
Step C must be finished before step W can begin.
Step B must be finished before step Y can begin.
Step Y must be finished before step N can begin.
Step L must be finished before step N can begin.
Step M must be finished before step R can begin.
Step L must be finished before step I can begin.
Step J must be finished before step N can begin.
Step K must be finished before step M can begin.
Step O must be finished before step U can begin.
Step P must be finished before step N can begin.
Step Y must be finished before step I can begin.
Step V must be finished before step Q can begin.
Step H must be finished before step R can begin.
Step M must be finished before step P can begin.
Step K must be finished before step L can begin.
Step J must be finished before step A can begin.
Step D must be finished before step F can begin.
Step Q must be finished before step P can begin.
Step C must be finished before step H can begin.
Step U must be finished before step I can begin.
Step A must be finished before step T can begin.
Step C must be finished before step P can begin.
Step U must be finished before step T can begin.
Step O must be finished before step T can begin.
Step O must be finished before step I can begin.
Step S must be finished before step I can begin.
Step Z must be finished before step E can begin.
Step Y must be finished before step T can begin.
Step K must be finished before step O can begin.
Step O must be finished before step A can begin.
Step Z must be finished before step T can begin.
Step Z must be finished before step U can begin.
Step U must be finished before step P can begin.
Step P must be finished before step I can begin.
Step S must be finished before step W can begin.
Step S must be finished before step P can begin.
Step S must be finished before step Q can begin.
Step C must be finished before step E can begin.
Step G must be finished before step U can begin.
Step D must be finished before step L can begin.
Step K must be finished before step S can begin.
Step R must be finished before step O can begin.
Step C must be finished before step G can begin.
Step V must be finished before step G can begin.
Step A must be finished before step W can begin.
Step Z must be finished before step O can begin.
Step J must be finished before step O can begin.
Step F must be finished before step E can begin.
Step U must be finished before step E can begin.
Step E must be finished before step W can begin.
Step M must be finished before step O can begin.
Step C must be finished before step U can begin.
Step G must be finished before step P can begin.
Step C must be finished before step I can begin.
Step Z must be finished before step A can begin.
Step C must be finished before step J can begin.
Step Q must be finished before step R can begin.
Step E must be finished before step T can begin.
Step F must be finished before step Y can begin.
Step Z must be finished before step N can begin.
Step I must be finished before step N can begin.
Step X must be finished before step E can begin.
Step I must be finished before step E can begin.
Step Q must be finished before step O can begin.
Step R must be finished before step L can begin.
Step K must be finished before step W can begin.
Step Y must be finished before step L can begin.
Step M must be finished before step I can begin.
Step F must be finished before step O can begin.
Step A must be finished before step E can begin.
INPUT;
    }

    public function getAnswer(bool $partTwo): string
    {
        $input = $this->getPuzzleInput();
//        $input = <<<INPUT
//Step C must be finished before step A can begin.
//Step C must be finished before step F can begin.
//Step A must be finished before step B can begin.
//Step A must be finished before step D can begin.
//Step B must be finished before step E can begin.
//Step D must be finished before step E can begin.
//Step F must be finished before step E can begin.
//INPUT;

        $conditions = [];
        $reverse = [];

        foreach (explode("\n", $input) as $row) {
            preg_match('/Step (\w) must be finished before step (\w) can begin./', $row, $matches);

            $conditions[$matches[2]][$matches[1]] = true;
            // Makes it easier to remove conditions
            $reverse[$matches[1]][] = $matches[2];

            if (!isset($conditions[$matches[1]])) {
                $conditions[$matches[1]] = [];
            }
        }

        $answer = '';
        $second = 0;
        $workersAvailable = 5;
        $finishesAt = [];
        while (count($conditions)) {
            if ($partTwo) {
                foreach ($finishesAt[$second] ?? [] as $finished) {
                    // This means that we need unset all the requirements for this
                    foreach ($reverse[$finished] ?? [] as $unset) {
                        unset($conditions[$unset][$finished]);
                        $workersAvailable++;
                    }
                    unset($conditions[$finished]);
                    $answer .= $finished;
                }

                if (count($conditions) == 0) {
                    break;
                }

                $possibles = array_filter(
                    $conditions,
                    function ($row) {
                        return count($row) == 0;
                    }
                );
                while ($workersAvailable > 0 && count($possibles) > 0) {
                    $keys = array_keys($possibles);
                    sort($keys);
                    unset($possibles[$keys[0]]);
                    if (!in_array($keys[0], $finishesAt)) {
                        // Implicit +60
                        $finishes = $second + ord($keys[0]) - 4;
                        $finishesAt[$finishes][] = $keys[0];
                        $workersAvailable--;
                    }
                }

                $nextHappens = array_filter(
                    array_keys($finishesAt),
                    function ($row) use ($second) {
                        return $row > $second;
                    }
                );
                sort($nextHappens);
                $second = $nextHappens[0] ?? $second;
            } else {
                // Find all the fields that don't have any requirements
                $possibles = array_filter(
                    $conditions,
                    function ($row) {
                        return count($row) == 0;
                    }
                );
                $keys = array_keys($possibles);
                sort($keys);
                $toAdd = $keys[0];

                $answer .= $toAdd;

                foreach ($reverse[$toAdd] ?? [] as $toRemove) {
                    unset($conditions[$toRemove][$toAdd]);
                }
                unset($conditions[$toAdd]);
            }
        }

        return $partTwo ? $second : $answer;
    }

}
