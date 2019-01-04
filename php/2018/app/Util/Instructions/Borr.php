<?php

namespace PatrickRose\AdventOfCode\Util\Instructions;

class Borr extends AbstractBor
{
    protected function getBValue(int $b): int
    {
        return $this->registers->getValueOf($b);
    }
}
