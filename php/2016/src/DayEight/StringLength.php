<?php

namespace PatrickRose\DayEight;

use PatrickRose\AdventOfCode;

class StringLength extends AdventOfCode
{

    public function getDifference($input)
    {
        return $this->getStringLength($input) - $this->getActualLength($input);
    }

    public function getStringLength($input)
    {
        return strlen($input);
    }

    public function getActualLength($input)
    {
        $actualString = substr($input, 1, -1);

        return strlen(
            preg_replace('/\\\\(\\\\|"|x[0-9a-f]{2})/', 'x', $actualString)
        );
    }

    protected function runPuzzleInput()
    {
        $input = explode(PHP_EOL, file_get_contents(__DIR__ . '/input.txt'));
        return $this->calculateAnswer($input);
    }

    /**
     * @param $input
     * @return mixed
     */
    public function calculateAnswer(array $input)
    {
        $answer = 0;

        foreach($input as $string)
        {
            $answer += $this->getDifference($string);
        }

        return $answer;
    }

}