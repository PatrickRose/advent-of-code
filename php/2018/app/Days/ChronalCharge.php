<?php

namespace PatrickRose\AdventOfCode\Days;


class ChronalCharge extends AbstractDay
{

    protected function getPuzzleInput(): string
    {
        return '7403';
    }

    public function getAnswer(bool $partTwo): string
    {
        $input = $this->getPuzzleInput();

        $grid = [];

        for ($x = 1; $x <= 300; $x++) {
            for ($y = 1; $y <= 300; $y++) {
                $rackID = $x + 10;
                $fuelCell = $rackID * $y;
                $fuelCell += $input;
                $fuelCell *= $rackID;
                $powerLevel = $fuelCell % 1000;

                if ($powerLevel < 100) {
                    $powerLevel = 0;
                } else {
                    $powerLevel = ((string)$powerLevel)[0];
                }

                $grid[$x][$y] = $powerLevel - 5;
            }
        }

        $max = null;
        $answer = [1, 1, 300];

        $progress = new \Symfony\Component\Console\Helper\ProgressBar($this->output, 300);
        $progress->start();

        foreach ($partTwo ? range(1, 300) : [3] as $size) {
            $progress->advance();
            for ($x = 1; $x <= (300 - $size + 1); $x++) {
                for ($y = 1; $y <= (300 - $size + 1); $y++) {
                    $thisValue = 0;
                    for ($xAdd = 0; $xAdd < $size; $xAdd++) {
                        for ($yAdd = 0; $yAdd < $size; $yAdd++) {
                            $thisValue += $grid[$x + $xAdd][$y + $yAdd];
                        }
                    }

                    if (is_null($max) || $thisValue > $max) {
                        $max = $thisValue;
                        $answer = [$x, $y, $size];
                    }
                }
            }
        }

        $progress->clear();

        return implode(',', $answer);
    }
}
