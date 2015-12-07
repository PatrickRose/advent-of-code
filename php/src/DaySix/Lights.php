<?php

namespace PatrickRose\DaySix;


use PatrickRose\AdventOfCode;

class Lights extends AdventOfCode
{
    const COMMAND_REGEX = '/(turn on|toggle|turn off) (\d+,\d+) through (\d+,\d+)/';

    protected $lights = [];

    public function __construct()
    {
        foreach (range(0, 999) as $x) {
            foreach (range(0, 999) as $y) {
                $this->lights[$x][$y] = false;
            }
        }
    }

    public function parseInput($input)
    {
        if (preg_match(self::COMMAND_REGEX, $input, $matches) !== 1) {
            throw new \InvalidArgumentException(
                'Could not match input: ' . $input
            );
        }

        $command = $matches[1];
        list($fromX, $fromY) = explode(',', $matches[2]);
        list($toX, $toY) = explode(',', $matches[3]);

        foreach (range($fromX, $toX) as $actOnX) {
            foreach (range($fromY, $toY) as $actOnY) {
                switch ($command) {
                    case 'turn on':
                        $this->turnOn($actOnX, $actOnY);
                        break;
                    case 'toggle':
                        $this->toggle($actOnX, $actOnY);
                        break;
                    case 'turn off':
                        $this->turnOff($actOnX, $actOnY);
                        break;
                }
            }
        }
    }

    protected function runPuzzleInput()
    {
        foreach (
            explode(
                PHP_EOL,
                file_get_contents(__DIR__ . '/input.txt')
            ) as $input) {
            $this->parseInput($input);
        }

        return array_reduce(
            $this->lights,
            [$this, 'countLights'],
            0
        );
    }

    public function countLights($carry, $innerArray)
    {
        return $carry + count(array_filter($innerArray));
    }

    /**
     * @param $actOnX
     * @param $actOnY
     */
    protected function turnOn($actOnX, $actOnY)
    {
        $this->lights[$actOnX][$actOnY] = true;
    }

    /**
     * @param $actOnX
     * @param $actOnY
     */
    protected function toggle($actOnX, $actOnY)
    {
        $this->lights[$actOnX][$actOnY] = !$this->lights[$actOnX][$actOnY];
    }

    /**
     * @param $actOnX
     * @param $actOnY
     */
    protected function turnOff($actOnX, $actOnY)
    {
        $this->lights[$actOnX][$actOnY] = false;
    }
}