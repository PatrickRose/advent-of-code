<?php

namespace PatrickRose\DayFive;


class NewNaughtyOrNice extends  NaughtyOrNice
{
    public function isNice($input)
    {
        return $this->hasPairOfTwoLetters($input) && $this->hasRepeatedLetter($input);
    }

    public function hasPairOfTwoLetters($input)
    {
        return preg_match('/([a-z][a-z]).*\1/', $input) === 1;
    }

    public function hasRepeatedLetter($input)
    {
        return preg_match('/([a-z])[a-z]\1/', $input) === 1;
    }
}