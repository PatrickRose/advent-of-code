<?php

namespace PatrickRose\AdventOfCode\Util\Instructions;

class Addi extends AbstractAdd
{
    public function getBValue(int $b): int
    {
        return $b;
    }
}
