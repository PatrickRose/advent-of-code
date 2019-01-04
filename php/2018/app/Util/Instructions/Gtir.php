<?php

namespace PatrickRose\AdventOfCode\Util\Instructions;

class Gtir extends AbstractGt
{

    protected function getAValue(int $a): int
    {
        return $a;
    }

    protected function getBValue(int $b): int
    {
        return $this->registers->getValueOf($b);
    }
}
