<?php

namespace PatrickRose\AdventOfCode\Days;

class Firewall extends AbstractDay
{

    protected function getPuzzleInput(): string
    {
        return <<<INPUT
0: 5
1: 2
2: 3
4: 4
6: 6
8: 4
10: 8
12: 6
14: 6
16: 14
18: 6
20: 8
22: 8
24: 10
26: 8
28: 8
30: 10
32: 8
34: 12
36: 9
38: 20
40: 12
42: 12
44: 12
46: 12
48: 12
50: 12
52: 12
54: 12
56: 14
58: 14
60: 14
62: 20
64: 14
66: 14
70: 14
72: 14
74: 14
76: 14
78: 14
80: 12
90: 30
92: 17
94: 18
INPUT;
    }

    public function getAnswer(bool $partTwo): string
    {
        $firewall = $this->getFirewall();
        if (!$partTwo) {

            $currentPos = -1;
            $severity = 0;

            while ($currentPos < max(array_keys($firewall))) {
                $currentPos++;

                if (isset($firewall[$currentPos])) {
                    // Have we been caught
                    if ($firewall[$currentPos]['pos'] == 1) {
                        $severity += ($currentPos * $firewall[$currentPos]['max']);
                    }
                }

                // Now update the position of the firewall
                $firewall = $this->updateFirewall($firewall);
            }

            return $severity;
        } else {
            $toWait = -1;
            $caught = true;

            while ($caught) {
                $caught = false;
                $toWait++;

                foreach ($firewall as $index => $desc)
                {
                    if (($toWait + $index) % (($desc['max'] - 1)*2) == 0)
                    {
                        $caught = true;
                        break;
                    }
                }
            }

            return $toWait;
        }
    }

    /**
     * @return array
     */
    protected function getFirewall(): array
    {
        $input = $this->getPuzzleInput();

        $firewall = [];

        foreach (explode("\n", $input) as $line) {
            list($level, $depth) = explode(': ', $line);
            $firewall[$level] = ['max' => $depth, 'pos' => 1, 'down' => true];
        }
        return $firewall;
    }

    /**
     * @param $firewall
     * @return mixed
     */
    protected function updateFirewall($firewall)
    {
        foreach ($firewall as $index => $pos) {
            if ($pos['down']) {
                $firewall[$index]['pos']++;

                if ($firewall[$index]['pos'] == $pos['max']) {
                    $firewall[$index]['down'] = false;
                }
            } else {
                $firewall[$index]['pos']--;

                if ($firewall[$index]['pos'] == 1) {
                    $firewall[$index]['down'] = true;
                }
            }
        }
        return $firewall;
    }
}
