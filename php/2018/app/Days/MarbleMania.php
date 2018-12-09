<?php

namespace PatrickRose\AdventOfCode\Days;

use PatrickRose\AdventOfCode\Util\LinkedListElement;

class MarbleMania extends AbstractDay
{

    protected function getPuzzleInput(): string
    {
        return "447 players; last marble is worth 71510 points";
    }

    public function getAnswer(bool $partTwo): string
    {
        $input = $this->getPuzzleInput();

        preg_match('/(\d+) players; last marble is worth (\d+) points/', $input, $matches);

        list(1 => $numPlayers, 2 => $finished) = $matches;
        $currentPlayer = 2;

        // Cheat and do turn one manually...
        $currentMarble = new LinkedListElement(0);

        $points = [1 => 0];

        if ($partTwo) {
            // On my machine, it segfaults
            // I can make it not segfault for longer if I trigger lots of gc_collect_cycles
            // There's no linked list in PHP, so there's probably some nasty
            // thing there
            $finished *= 100;
        }

        for ($i = 1; $i <= $finished; $i++) {
            if (($i % 23) == 0) {
                // BONUS POINTS!
                if (!isset($points[$currentPlayer])) {
                    $points[$currentPlayer] = 0;
                }

                $points[$currentPlayer] += $i;

                for ($j = 0; $j < 7; $j++) {
                    $currentMarble = $currentMarble->getBefore();
                }

                $points[$currentPlayer] += $currentMarble->getValue();

                $before = $currentMarble->getBefore();
                $after = $currentMarble->getAfter();
                $after->setBefore($before);
                $before->setAfter($after);
                $currentMarble = $after;
            } else {
                // Next counter clockwise
                $currentMarble = $currentMarble->getAfter()->insertAfter($i);
            }

            $currentPlayer++;

            if ($currentPlayer > $numPlayers) {
                $currentPlayer = 1;
            }
        }

        return max($points);
    }
}
