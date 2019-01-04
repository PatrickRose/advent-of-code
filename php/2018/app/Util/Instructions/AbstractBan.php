<?php

namespace PatrickRose\AdventOfCode\Util\Instructions;

abstract class AbstractBan extends AbstractInstruction
{
    protected function performAction(int $a, int $b): int
    {
        return $a & $b;
    }

    protected function getAValue(int $a): int
    {
        return $this->registers->getValueOf($a);
    }
}
