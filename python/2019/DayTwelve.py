import math
import sys

puzzle_input = sys.stdin.readlines()


class Moon:
    vel_x = 0
    vel_y = 0
    vel_z = 0

    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z

    def apply_gravity(self, moon):
        if moon.x != self.x:
            self.vel_x += 1 if moon.x > self.x else -1
        if moon.y != self.y:
            self.vel_y += 1 if moon.y > self.y else -1
        if moon.z != self.z:
            self.vel_z += 1 if moon.z > self.z else -1

    def apply_velocity(self):
        self.x += self.vel_x
        self.y += self.vel_y
        self.z += self.vel_z

    def total_energy(self):
        potential = sum([abs(x) for x in [self.x, self.y, self.z]])
        kinetic = sum([abs(x) for x in [self.vel_x, self.vel_y, self.vel_z]])

        return potential * kinetic

    def position_tuple(self):
        return [
            (self.x, self.vel_x),
            (self.y, self.vel_y),
            (self.z, self.vel_z),
        ]


def get_moon_from_line(line):
    split = line[1:-1].split(',')
    vals = [int(x.split('=')[1]) for x in split]

    return Moon(vals[0], vals[1], vals[2])


moons = [get_moon_from_line(x.strip()) for x in puzzle_input]

found_all_cycles = False
i = 0

x_cycle = (
    [x.position_tuple()[0] for x in moons],
    -1
)
y_cycle = (
    [x.position_tuple()[1] for x in moons],
    -1
)
z_cycle = (
    [x.position_tuple()[2] for x in moons],
    -1
)
while not found_all_cycles:
    i += 1
    for moon in moons:
        for second_moon in moons:
            moon.apply_gravity(second_moon)

    for moon in moons:
        moon.apply_velocity()

    if x_cycle[1] == -1 and [x.position_tuple()[0] for x in moons] == x_cycle[0]:
        x_cycle = (x_cycle[0], i)
    if y_cycle[1] == -1 and [x.position_tuple()[1] for x in moons] == y_cycle[0]:
        y_cycle = (y_cycle[0], i)
    if z_cycle[1] == -1 and [x.position_tuple()[2] for x in moons] == z_cycle[0]:
        z_cycle = (z_cycle[0], i)

    found_all_cycles = -1 not in ([x[1] for x in [x_cycle, y_cycle, z_cycle]])

    if i == 1000:
        print("Part 1:", sum([x.total_energy() for x in moons]))

lengths = [x[1] for x in [x_cycle, y_cycle, z_cycle]]

while len(lengths) >= 2:
    a = lengths.pop()
    b = lengths.pop()
    lengths.append(abs(a * b) // math.gcd(a, b))

print("Part two:", lengths[0])
