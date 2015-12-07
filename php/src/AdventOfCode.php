<?php

namespace PatrickRose;


abstract class AdventOfCode
{
    public function getAnswer()
    {
        return $this->runPuzzleInput();
    }

    abstract protected function runPuzzleInput();
}