<?php


namespace PatrickRose\AdventOfCode\Days;


use Symfony\Component\Console\Output\Output;

class SpiralMemory extends AbstractDay
{

    protected function getPuzzleInput(): string
    {
        return "277678";
    }

    public function getAnswer(bool $partTwo): string
    {
        $maxX = 0;
        $maxY = 0;
        $minX = 0;
        $minY = 0;

        $direction = 1;
        $index = 1;
        $gridBySquares = [];
        $x = 0;
        $y = 0;
        $gridByValues = [];

        while ($index <= $this->getPuzzleInput()) {
            $gridBySquares[$index] = [$x, $y];

            if ($index == 1)
            {
                $gridByValues[$x][$y] = 1;
            }
            else
            {
                $val = 0;
                foreach (range($x - 1, $x + 1) as $row)
                {
                    foreach(range($y - 1, $y + 1) as $col)
                    {
                        $val += $gridByValues[$row][$col] ?? 0;
                    }
                }
                $gridByValues[$x][$y] = $val;

                if ($partTwo && $val > $this->getPuzzleInput())
                {
                    return $val;
                }
            }

            $index++;

            $this->output->writeln(
                print_r(
                    compact('x', 'y', 'direction', 'index', 'maxX', 'minX', 'maxY', 'minY'),
                    true
                ),
                Output::VERBOSITY_DEBUG
            );

            switch ($direction) {
                case 1:
                    $x += 1;
                    if ($x > $maxX) {
                        $maxX = $x;
                        $direction = 2;
                    }
                    break;
                case 2:
                    $y += 1;
                    if ($y > $maxY) {
                        $maxY = $y;
                        $direction = 3;
                    }
                    break;
                case 3:
                    $x -= 1;
                    if ($x < $minX) {
                        $minX = $x;
                        $direction = 4;
                    }
                    break;
                case 4:
                    $y -= 1;
                    if ($y < $minY) {
                        $minY = $y;
                        $direction = 1;
                    }
                    break;
            }
        }

        $element = $gridBySquares[$this->getPuzzleInput()];

        $this->output->writeln(print_r($element, true));

        return (string) (abs($element[0]) + abs($element[1]));
    }

    private function buildGrid($maxNumber)
    {}

}
