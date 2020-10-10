import sys


class Orbit:

    def __init__(self, orbiteer, orbiting):
        self.orbiting = orbiting
        self.orbiteer = orbiteer
        self.is_orbiting = {}
        self.is_orbiting[orbiting] = True

    def test_if_orbiting(self, to_test):
        if not (to_test in self.is_orbiting):
            if self.orbiteer == to_test:
                returns = False
            elif self.orbiting in orbits:
                returns = orbits[self.orbiting].test_if_orbiting(to_test)
            else:
                returns = False

            self.is_orbiting[to_test] = returns

        return self.is_orbiting[to_test]

    def number_of_orbits(self):
        count = 0

        for x in self.is_orbiting:
            if self.is_orbiting[x]:
                count += 1

        return count


puzzle_input = sys.stdin.readlines()

orbits = {}
bodies = set()

for line in puzzle_input:
    orbiting, orbiteer = line.strip().split(')')
    orbits[orbiteer] = Orbit(orbiteer, orbiting)
    bodies.add(orbiteer)
    bodies.add(orbiting)

for key in bodies:
    [orbits[x].test_if_orbiting(key) for x in orbits]

part_one = sum([orbits[x].number_of_orbits() for x in orbits])

print("Part one: " + str(part_one))


def generate_path(element):
    path = []
    while element in orbits:
        element = orbits[element].orbiting
        path.append(element)

    return path


def distance_between(first, second):
    first_path = generate_path(first)
    first_path.reverse()
    second_path = generate_path(second)

    ## Shortest path is position of the first element that's in first_path and in second_path
    ## Then add the steps needed to get to the end of second_path from that element
    path = 0
    to_check = first_path.pop()

    while not (to_check in second_path):
        path += 1
        to_check = first_path.pop()

    return path + second_path.index(to_check)


print("Part two: " + str(distance_between('YOU', 'SAN')))
