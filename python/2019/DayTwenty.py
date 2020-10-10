import math
import re
import sys

puzzle_input = [x.strip("\n") for x in sys.stdin.readlines()]

# First, we need to get all the 
positions = set()

grid = {}
portal_defs = {}

regex = re.compile('[A-Z]')


def get_portal(grid, x, y):
    to_check = [
        ((x, y + 1), (x, y + 2)),
        ((x, y + 1), (x, y - 1)),
        ((x + 1, y), (x + 2, y)),
        ((x + 1, y), (x - 1, y)),
    ]

    for (x1, y1), (x2, y2) in to_check:
        if y1 < 0 or y1 >= len(grid):
            continue
        if x1 < 0 or x1 >= len(grid[0]):
            continue
        if y2 < 0 or y2 >= len(grid):
            continue
        if x2 < 0 or x2 >= len(grid[0]):
            continue

        if grid[y1][x1] in [' ', '.', '#']:
            continue

        if grid[y2][x2] == '.':
            return grid[y][x] + grid[y1][x1], (x2, y2)

    return None


for y in range(len(puzzle_input)):
    for x in range(len(puzzle_input[y])):
        char = puzzle_input[y][x]

        if char in ' #':
            continue
        elif char == '.':
            grid[(x, y)] = math.inf
        else:
            portal_def = get_portal(puzzle_input, x, y)

            if portal_def is None:
                continue

            portal_name, portal_position = portal_def

            if portal_name == 'AA':
                positions.add(portal_position)
                start_position = portal_position
            elif portal_name == 'ZZ':
                end = portal_position
            else:
                if portal_name not in portal_defs:
                    portal_defs[portal_name] = set()

                portal_defs[portal_name].add(portal_position)

# Now convert the portals into objects
portals = {}

for portal in portal_defs:
    pos1, pos2 = portal_defs[portal]
    portals[pos1] = pos2
    portals[pos2] = pos1

num_steps = 0

## We need this for part two
base_grid = grid.copy()
grid[start_position] = 0

while end not in positions:
    to_do = set()
    for position in positions:
        x, y = position
        if position in portals:
            to_do.add(portals[position])

        for check in [(x - 1, y), (x + 1, y), (x, y + 1), (x, y - 1)]:
            if check in grid:
                to_do.add(check)

    num_steps += 1
    positions = set()
    for position in to_do:
        if grid[position] > num_steps:
            positions.add(position)
            grid[position] = num_steps

    assert positions

print("Part 1", num_steps)

dimensions = [base_grid.copy()]
dimensions[0][start_position] = 0

positions = set()
positions.add((start_position, 0))

xs = []
ys = []

for x, y in portals:
    xs.append(x)
    ys.append(y)

move_back_x = [min(xs), max(xs)]
move_back_y = [min(ys), max(ys)]

num_steps = 0

while (end, 0) not in positions:
    to_do = set()
    for position, dimension in positions:
        x, y = position
        if position in portals:
            if dimension == 0:
                if x not in move_back_x and y not in move_back_y:
                    to_do.add((portals[position], dimension + 1))
            else:
                next_dimension = dimension - 1 if x in move_back_x or y in move_back_y else dimension + 1
                to_do.add((portals[position], next_dimension))

        for check in [(x - 1, y), (x + 1, y), (x, y + 1), (x, y - 1)]:
            if check in grid:
                to_do.add((check, dimension))

    num_steps += 1
    positions = set()
    for position, dimension in to_do:
        while dimension >= len(dimensions):
            dimensions.append(base_grid.copy())

        if dimensions[dimension][position] > num_steps:
            positions.add((position, dimension))
            dimensions[dimension][position] = num_steps

    assert positions

print("Part 2", num_steps)
