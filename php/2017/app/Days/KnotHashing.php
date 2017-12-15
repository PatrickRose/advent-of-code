<?php

namespace PatrickRose\AdventOfCode\Days;

class KnotHashing extends AbstractDay
{

    protected function getPuzzleInput(): string
    {
        return "97,167,54,178,2,11,209,174,119,248,254,0,255,1,64,190";
    }

    public function getAnswer(bool $partTwo): string
    {
        $input = $this->getPuzzleInput();

        if ($partTwo)
        {
            $input = implode(
                ',',
                array_merge(
                    array_map('ord', str_split($input)),
                    [17, 31, 73, 47, 23]
                )
            );
        }

        $position = 0;
        $skipCount = 0;
        $list = range(0, 255);
        $listLength = count($list);
        $numIterations = $partTwo ? 64 : 1;

        for($iteration = 0; $iteration < $numIterations; $iteration++) {
            foreach (explode(',', $input) as $length) {
                $toReverse = [];

                foreach (range(0, $length - 1) as $i) {
                    $toReverse[] = $list[($position + $i) % $listLength];
                }

                foreach (array_reverse($toReverse) as $i => $val) {
                    $list[($position + $i) % $listLength] = $val;
                }

                $position += ($length + $skipCount) % $listLength;
                $skipCount += 1;
            }
        }

        if (!$partTwo)
        {
            return $list[0] * $list[1];
        }

        // Now create the dense hash
        return array_reduce(
            array_map(
                function ($elementsToXor)
                {
                    return array_reduce(
                        $elementsToXor,
                        function ($result, $item) {
                            return is_null($result) ? $item : $item ^ $result;
                        }
                    );
                },
                array_chunk($list, 16)
            ),
            function ($result, $item) {
                $item = dechex($item);

                if (strlen($item) < 2)
                {
                    $item = "0$item";
                }

                return $result . $item;
            }
        );
    }
}
