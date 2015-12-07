<?php

namespace PatrickRose\DaySix;


class NewLights extends Lights
{
    public function __construct()
    {
        foreach (range(0, 999) as $x) {
            foreach (range(0, 999) as $y) {
                $this->lights[$x][$y] = 0;
            }
        }
    }

    public function countLights($carry, $innerArray)
    {
        return $carry + array_sum($innerArray);
    }

    protected function turnOn($actOnX, $actOnY)
    {
        $this->lights[$actOnX][$actOnY]++;
    }

    protected function toggle($actOnX, $actOnY)
    {
        $this->lights[$actOnX][$actOnY] += 2;
    }

    protected function turnOff($actOnX, $actOnY)
    {
        $this->lights[$actOnX][$actOnY] = max(0, $this->lights[$actOnX][$actOnY] - 1);
    }


}