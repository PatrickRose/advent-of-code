<?php


namespace PatrickRose\AdventOfCode\Util\Instructions;


class Mulr extends AbstractMul
{
    protected function getBValue(int $b): int
    {
        return $this->registers->getValueOf($b);
    }
}
