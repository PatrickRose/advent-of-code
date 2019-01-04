<?php

namespace PatrickRose\AdventOfCode\Util\Instructions;

class Banr extends AbstractBan
{
    protected function getBValue(int $b): int
    {
        return $this->registers->getValueOf($b);
    }
}
