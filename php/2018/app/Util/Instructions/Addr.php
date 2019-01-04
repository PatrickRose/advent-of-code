<?php


namespace PatrickRose\AdventOfCode\Util\Instructions;


class Addr extends AbstractAdd
{
    protected function getBValue(int $b): int
    {
        return $this->registers->getValueOf($b);
    }
}
