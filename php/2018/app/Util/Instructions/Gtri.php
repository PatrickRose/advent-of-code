<?php

namespace PatrickRose\AdventOfCode\Util\Instructions;

class Gtri extends AbstractGt
{

    protected function getAValue(int $a): int
    {
        return $this->registers->getValueOf($a);
    }

    protected function getBValue(int $b): int
    {
        return $b;
    }
}
