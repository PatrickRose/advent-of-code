import math
import sys

from common.Intcode import Intcode

puzzle_input = [int(x) for x in sys.stdin.readlines()[0].split(',')]


class Robot:
    min_x = 0
    min_y = 0
    max_x = 0
    max_y = 0

    backtracking = False

    directions = []

    def __init__(self):
        self.grid = {(0, 0): 1}
        self.pos = (0, 0)
        self.num_steps = 0

    def move(self, direction):
        self.direction = direction
        self.backtracking = False

    def move_back(self):
        if len(self.directions) > 0:
            self.move(self.directions.pop())
            self.backtracking = True
            return self.direction
        else:
            return -1

    def update_grid(self, output):
        if self.direction == 1:
            pos = (self.pos[0], self.pos[1] - 1)
        elif self.direction == 2:
            pos = (self.pos[0], self.pos[1] + 1)
        elif self.direction == 3:
            pos = (self.pos[0] - 1, self.pos[1])
        elif self.direction == 4:
            pos = (self.pos[0] + 1, self.pos[1])

        if self.min_x > pos[0]:
            self.min_x = pos[0]
        elif self.max_x < pos[0]:
            self.max_x = pos[0]

        if self.min_y > pos[1]:
            self.min_y = pos[1]
        elif self.max_y < pos[1]:
            self.max_y = pos[1]

        if output != 0:
            self.pos = pos

            if not self.backtracking:
                reverse = {
                    1: 2,
                    2: 1,
                    3: 4,
                    4: 3
                }

                self.directions.append(reverse[self.direction])
                self.num_steps += 1
            else:
                self.num_steps -= 1

        self.grid[pos] = output
        # self.print_grid()

    def print_grid(self):
        mapping = {
            -1: ' ',
            0: u'\u25A0',
            1: '.',
            2: u'\u25A1'
        }

        print('-' * 30, len(self.grid))

        for y in range(self.min_y - 1, self.max_y + 1):
            line = ''
            for x in range(self.min_x - 1, self.max_x + 1):
                val = self.grid.get((x, y), -1)
                if (x, y) == self.pos:
                    line += 'o'
                else:
                    line += mapping[val]
            print(line)
        print('-' * 30)

    def need_to_check(self):
        to_check = {
            1: (0, -1), 2: (0, 1),
            4: (1, 0), 3: (-1, 0),
        }

        to_return = []

        for direction in to_check:
            diff = to_check[direction]
            pos = (self.pos[0] + diff[0], self.pos[1] + diff[1])
            if pos not in self.grid:
                to_return.append(direction)

        return to_return


class ProvideInput:

    def __init__(self, robot):
        self.robot = robot

    def get(self):
        to_check = self.robot.need_to_check()

        if len(to_check) == 0:
            # Then move back a step
            return self.robot.move_back()
        else:
            # Otherwise just take the first option
            direction = to_check[0]

        self.robot.move(direction)

        return direction


class TakeOutput:
    part_one = False

    def __init__(self, robot):
        self.robot = robot

    def put(self, value):
        self.robot.update_grid(value)
        if (not self.part_one) and (value == 2):
            print("Part one:", self.robot.num_steps)


robot = Robot()

input = ProvideInput(robot)
out = TakeOutput(robot)

intcode = Intcode(15, input, out)

intcode.run_program(puzzle_input)

grid = {}

for key in robot.grid:
    if robot.grid[key] == 1:
        grid[key] = math.inf
    elif robot.grid[key] == 2:
        grid[key] = 0

steps = 0

while math.inf in grid.values():
    items = []

    for key, value in grid.items():
        if value == steps:
            items.append(key)

    steps += 1

    for key in items:
        x, y = key

        points_to_check = [
            (x - 1, y),
            (x + 1, y),
            (x, y - 1),
            (x, y + 1),
        ]

        for point in points_to_check:
            if point in grid and grid[point] > steps:
                grid[point] = steps

print("Part two", steps)
