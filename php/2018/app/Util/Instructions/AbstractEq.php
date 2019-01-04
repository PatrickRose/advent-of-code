<?php

namespace PatrickRose\AdventOfCode\Util\Instructions;

abstract class AbstractEq extends AbstractInstruction
{
    protected function performAction(int $a, int $b): int
    {
        return $a == $b ? 1 : 0;
    }
}
