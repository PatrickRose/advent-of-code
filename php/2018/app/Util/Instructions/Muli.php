<?php

namespace PatrickRose\AdventOfCode\Util\Instructions;

class Muli extends AbstractMul
{
    protected function getBValue(int $b): int
    {
        return $b;
    }
}
