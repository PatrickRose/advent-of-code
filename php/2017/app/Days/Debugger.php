<?php


namespace PatrickRose\AdventOfCode\Days;


class Debugger extends AbstractDay
{

    protected function getPuzzleInput(): string
    {
        return "0	5	10	0	11	14	13	4	11	8	8	7	1	4	12	11";
    }

    public function getAnswer(bool $partTwo): string
    {
        $input = $this->getPuzzleInput();

        $blocks = explode("\t", $input);

        $seen = [];
        $steps = 0;

        while(!in_array($blocks, $seen))
        {
            $seen[] = $blocks;
            $steps++;

            $max = max($blocks);
            $index = array_search($max, $blocks);
            $blocks[$index] = 0;
            foreach(range(1, $max) as $i)
            {
                $blocks[($index + $i) % count($blocks)]++;
            }
        }

        if ($partTwo)
        {
            return $steps - array_search($blocks, $seen);
        }
        else
        {
            return $steps;
        }
    }
}
