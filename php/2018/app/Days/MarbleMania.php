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
            $finished *= 100;
            // On my machine, it segfaults because the GC hits a stack overflow.
            // This fixes the issue
            gc_disable();
            ini_set('memory_limit', -1);
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

                $currentMarble = $currentMarble->remove();
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
