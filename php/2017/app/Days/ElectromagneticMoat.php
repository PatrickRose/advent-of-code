<?php


namespace PatrickRose\AdventOfCode\Days;

/**
 * The CPU itself is a large, black building surrounded by a bottomless pit. Enormous metal tubes extend outward from the side of the building at regular intervals and descend down into the void. There's no way to cross, but you need to get inside.
 *
 * No way, of course, other than building a bridge out of the magnetic components strewn about nearby.
 *
 * Each component has two ports, one on each end. The ports come in all different types, and only matching types can be connected. You take an inventory of the components by their port types (your puzzle input). Each port is identified by the number of pins it uses; more pins mean a stronger connection for your bridge. A 3/7 component, for example, has a type-3 port on one side, and a type-7 port on the other.
 *
 * Your side of the pit is metallic; a perfect surface to connect a magnetic, zero-pin port. Because of this, the first port you use must be of type 0. It doesn't matter what type of port you end with; your goal is just to make the bridge as strong as possible.
 *
 * The strength of a bridge is the sum of the port types in each component. For example, if your bridge is made of components 0/3, 3/7, and 7/4, your bridge has a strength of 0+3 + 3+7 + 7+4 = 24.
 *
 * For example, suppose you had the following components:
 *
 * 0/2
 * 2/2
 * 2/3
 * 3/4
 * 3/5
 * 0/1
 * 10/1
 * 9/10
 *
 * With them, you could make the following valid bridges:
 *
 * 0/1
 * 0/1--10/1
 * 0/1--10/1--9/10
 * 0/2
 * 0/2--2/3
 * 0/2--2/3--3/4
 * 0/2--2/3--3/5
 * 0/2--2/2
 * 0/2--2/2--2/3
 * 0/2--2/2--2/3--3/4
 * 0/2--2/2--2/3--3/5
 *
 * (Note how, as shown by 10/1, order of ports within a component doesn't matter. However, you may only use each port on a component once.)
 *
 * Of these bridges, the strongest one is 0/1--10/1--9/10; it has a strength of 0+1 + 1+10 + 10+9 = 31.
 *
 * What is the strength of the strongest bridge you can make with the components you have available?
 */
class ElectromagneticMoat extends AbstractDay
{

    /**
     * @var Component[]
     */
    private $ports;

    /**
     * @var int[]
     */
    private $bridgeStrength;

    protected function getPuzzleInput(): string
    {
        return <<<INPUT
24/14
30/24
29/44
47/37
6/14
20/37
14/45
5/5
26/44
2/31
19/40
47/11
0/45
36/31
3/32
30/35
32/41
39/30
46/50
33/33
0/39
44/30
49/4
41/50
50/36
5/31
49/41
20/24
38/23
4/30
40/44
44/5
0/43
38/20
20/16
34/38
5/37
40/24
22/17
17/3
9/11
41/35
42/7
22/48
47/45
6/28
23/40
15/15
29/12
45/11
21/31
27/8
18/44
2/17
46/17
29/29
45/50
INPUT;
    }

    public function getAnswer(bool $partTwo): string
    {
        $puzzleInput = $this->getPuzzleInput();

        foreach (explode("\n", $puzzleInput) as $line) {
            $ports = explode('/', $line);
            $component = new Component($ports);

            $this->ports[$ports[0]][] = $component;
            $this->ports[$ports[1]][] = $component;
        }

        $this->createBridges();

        if (!$partTwo) {
            return max($this->bridgeStrength);
        }

        $maxLength = max(array_keys($this->bridgeStrength));

        return $this->bridgeStrength[$maxLength];
    }

    private function createBridges($acceptablePort = 0, $currentBridge = [])
    {
        if (!empty($currentBridge)) {
            $count = count($currentBridge);
            if (!isset($this->bridgeStrength[$count])) {
                $this->bridgeStrength[$count] = 0;
            }

            $thisStrength = array_reduce(
                $currentBridge,
                function ($carry, Component $item) {
                    return $carry + $item->strength();
                }
            );

            if ($thisStrength > $this->bridgeStrength[$count]) {
                $this->bridgeStrength[$count] = $thisStrength;
            }
        }

        foreach ($this->ports[$acceptablePort] as $port) {
            /** @var Component $port */
            if ($port->inUse()) {
                continue;
            }

            $port->use();


            $newBridge = $currentBridge;
            $newBridge[] = $port;

            $this->createBridges(
                $port->otherPort($acceptablePort),
                $newBridge
            );

            $port->free();
        }
    }
}

class Component
{

    private $ports = [];

    private $inUse = false;

    public function __construct(array $ports)
    {
        $this->ports = $ports;
    }

    public function strength()
    {
        return array_sum($this->ports);
    }

    public function inUse()
    {
        return $this->inUse;
    }

    public function use()
    {
        $this->inUse = true;
    }

    public function free()
    {
        $this->inUse = false;
    }

    public function otherPort(int $portToBeUsed)
    {
        return $portToBeUsed == $this->ports[0] ? $this->ports[1] : $this->ports[0];
    }

    public function getName()
    {
        return implode('/', $this->ports);
    }

}
