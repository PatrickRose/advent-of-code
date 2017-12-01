<?php

namespace PatrickRose\DayFive;


use PatrickRose\AdventOfCode;

class NaughtyOrNice extends AdventOfCode
{

    protected function runPuzzleInput()
    {
        return $this->countAllNaughtyOrNice(file_get_contents(__DIR__ . '/input.txt'));
    }

    public function countAllNaughtyOrNice($input)
    {
        return count(array_filter(explode(PHP_EOL, $input), [$this, 'isNice']));
    }

    public function isNice($input)
    {
        return $this->containsThreeVowels($input)
            && $this->hasDoubleLetter($input)
            && !$this->hasBadString($input);
    }

    public function containsThreeVowels($input)
    {
        $allowedVowels = ['a','e','i','o','u'];

        $numberofVowels = 0;

        foreach($allowedVowels as $vowel)
        {
            $numberofVowels += substr_count($input, $vowel);
        }

        return $numberofVowels >= 3;
    }

    public function hasDoubleLetter($input)
    {
        return preg_match('/([a-z])\1/', $input) === 1;
    }

    public function hasBadString($input)
    {
        $badStrings = ['ab','cd','pq','xy'];
        foreach($badStrings as $badString)
        {
            if (strpos($input, $badString) !== false)
            {
                return true;
            }
        }

        return false;
    }

}