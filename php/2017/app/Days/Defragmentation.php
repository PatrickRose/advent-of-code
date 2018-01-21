<?php

namespace PatrickRose\AdventOfCode\Days;

use Symfony\Component\Console\Helper\QuestionHelper;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;

class Defragmentation extends AbstractDay
{

    private $input = [];

    protected function getPuzzleInput(): string
    {
        return 'xlqgujun';
    }

    public function getAnswer(bool $partTwo): string
    {
        $count = 0;
        $input = $this->getPuzzleInput();

        foreach (range(0, 127) as $row) {
            $thisInput = "$input-$row";
            $hash = KnotHashing::getKnotHash(array_map('ord', str_split($thisInput)));

            foreach (str_split($hash) as $char) {
                $decimal = hexdec($char);

                switch ($decimal) {
                    case 0:
                        $bin = '0000';
                        break;
                    case 1:
                        $bin = '0001';
                        break;
                    case 2:
                        $bin = '0010';
                        break;
                    case 3:
                        $bin = '0011';
                        break;
                    case 4:
                        $bin = '0100';
                        break;
                    case 5:
                        $bin = '0101';
                        break;
                    case 6:
                        $bin = '0110';
                        break;
                    case 7:
                        $bin = '0111';
                        break;
                    case 8:
                        $bin = '1000';
                        break;
                    case 9:
                        $bin = '1001';
                        break;
                    case 10:
                        $bin = '1010';
                        break;
                    case 11:
                        $bin = '1011';
                        break;
                    case 12:
                        $bin = '1100';
                        break;
                    case 13:
                        $bin = '1101';
                        break;
                    case 14:
                        $bin = '1110';
                        break;
                    case 15:
                        $bin = '1111';
                        break;
                    default:
                        throw new InvalidArgumentException("$hash has a non-hex char? $char");
                }
                $bin = array_map(function ($input) {
                    return $input == '1';
                }, str_split($bin));

                if ($partTwo) {
                    $this->input[$row] = array_merge($this->input[$row] ?? [], $bin);
                } else {
                    $count += count(array_filter($bin));
                }
            }
        }

        if ($partTwo) {
            $count = 0;
            foreach ($this->input as $x => $_) {
                foreach ($_ as $y => $__) {
                    if ($this->countRegion($x, $y)) {
                        $count += 1;
                    }
                }
            }
        }

        return $count;
    }

    private function countRegion($x, $y): bool
    {
        if (!isset($this->input[$x][$y]) || $this->input[$x][$y] !== true) {
            return false;
        }

        $this->input[$x][$y] = false;
        $this->countRegion($x - 1, $y);
        $this->countRegion($x + 1, $y);
        $this->countRegion($x, $y - 1);
        $this->countRegion($x, $y + 1);
        return true;
    }
}
