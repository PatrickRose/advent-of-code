<?php

namespace PatrickRose\AdventOfCode\Util\Instructions;

class Gtrr extends AbstractGt
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
