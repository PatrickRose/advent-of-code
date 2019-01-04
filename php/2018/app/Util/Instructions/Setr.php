<?php

namespace PatrickRose\AdventOfCode\Util\Instructions;

class Setr extends AbstractSet
{
    protected function getAValue(int $a): int
    {
        return $this->registers->getValueOf($a);
    }
}
