<?php

use PatrickRose\DayNine\ShortestRoute;

class ShortestRouteTest extends PHPUnit_Framework_TestCase
{
    /**
     * @var ShortestRoute
     */
    private $shortestRoute;

    protected function setUp()
    {
        $this->shortestRoute = new ShortestRoute();
    }

    public function testGetShortestRouteForInput()
    {
        $this->assertEquals(
            605,
            $this->shortestRoute->getShortestRoute(
                [
                    'London to Dublin = 464',
                    'London to Belfast = 518',
                    'Dublin to Belfast = 141',
                ]
            )
        );
    }

}
