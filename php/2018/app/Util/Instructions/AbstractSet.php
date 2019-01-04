<?php

namespace PatrickRose\AdventOfCode\Util\Instructions;

abstract class AbstractSet extends AbstractInstruction
{
    protected function getBValue(int $b): int
    {
        return 0;
    }

    protected function performAction(int $a, int $b): int
    {
        return $a;
    }
}
