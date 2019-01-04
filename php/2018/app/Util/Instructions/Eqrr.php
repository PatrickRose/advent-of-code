<?php

namespace PatrickRose\AdventOfCode\Util\Instructions;

class Eqrr extends AbstractEq
{
    protected function getAValue(int $a): int
    {
        return $this->registers->getValueOf($a);
    }

    protected function getBValue(int $b): int
    {
        return $this->registers->getValueOf($b);
    }
}
