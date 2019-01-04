<?php

namespace PatrickRose\AdventOfCode\Util\Instructions;

abstract class AbstractBor extends AbstractInstruction
{
    protected function getAValue(int $a): int
    {
        return $this->registers->getValueOf($a);
    }

    protected function performAction(int $a, int $b): int
    {
        return $a | $b;
    }
}
