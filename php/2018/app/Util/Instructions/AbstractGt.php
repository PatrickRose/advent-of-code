<?php

namespace PatrickRose\AdventOfCode\Util\Instructions;

abstract class AbstractGt extends AbstractInstruction
{
    protected function performAction(int $a, int $b): int
    {
        return $a > $b ? 1 : 0;
    }
}
