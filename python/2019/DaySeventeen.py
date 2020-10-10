import queue
import re
import sys

from common.Intcode import Intcode

puzzle_input = [int(x) for x in sys.stdin.readlines()[0].split(',')]

intcode = Intcode(17)

intcode.run_program(puzzle_input.copy())


class Robot:
    turns = {
        (0, -1): {'L': (-1, 0), 'R': (1, 0)},
        (0, 1): {'L': (1, 0), 'R': (-1, 0)},
        (1, 0): {'L': (0, -1), 'R': (0, 1)},
        (-1, 0): {'L': (0, 1), 'R': (0, -1)}
    }

    def __init__(self, position, char, grid):
        self.position = position
        self.grid = grid
        self.direction = {
            '^': (0, -1),
            '>': (1, 0),
            'v': (0, 1),
            '<': (-1, 0)
        }[char]

    def get_path(self):
        path = []
        grid = {}
        for key in self.grid:
            grid[key] = False
        num_steps = 0
        while False in grid.values():
            grid[self.position] = True
            new_position = (self.position[0] + self.direction[0], self.position[1] + self.direction[1])
            num_steps += 1
            if new_position not in grid:
                # Then we need to turn
                # Because we've gone all the way to the end, we should only need to go left or right
                for check in self.turns[self.direction]:
                    new_direction = self.turns[self.direction][check]
                    new_position = (self.position[0] + new_direction[0], self.position[1] + new_direction[1])
                    if new_position in self.grid:
                        if num_steps > 1:
                            path.append(str(num_steps))
                        path.append(check)
                        num_steps = 0
                        self.direction = new_direction
                        break

            self.position = new_position

        path.append(str(num_steps))
        return path


out = intcode.output

grid = {}
x = 0
y = 0

while not out.empty():
    val = out.get_nowait()
    char = chr(val)
    if val == 10:
        x = -1
        y += 1
    elif char != '.':
        grid[(x, y)] = '#'
        if char != '#':
            robot = Robot((x, y), char, grid)
    x += 1


# Find the intersections
def get_alignment(position):
    x, y = position
    to_check = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    for val in to_check:
        if (x + val[0], y + val[1]) not in grid:
            return 0

    return x * y


print("Part one", sum([get_alignment(x) for x in grid]))

# Work out the whole path
path = robot.get_path()

final_check = re.compile('^[ABC]+$')


def list_replace(base, search, replace):
    to_return = base.copy()
    i = 0
    k = len(search)

    while i < len(to_return):
        if to_return[i:i + k] == search:
            to_return = to_return[:i] + replace + to_return[i + k:]
        else:
            i += 1

    return to_return


# the final path must begin with A+B
# Each substring can only be 10 chars long
for i in range(1, 11):
    for j in range(1, 11):
        final_path = path.copy()
        command_a = final_path[:i]
        final_path = list_replace(final_path, command_a, ['A'])

        for k in range(len(final_path)):
            if final_path[k] != 'A':
                break

        command_b = final_path[k:k + j]

        if 'A' in command_b:
            # No point increasing the size of B
            break

        final_path = list_replace(final_path, command_b, ['B'])

        command_c = []

        for k in range(len(final_path)):
            if final_path[k] in ['A', 'B'] or len(command_c) == 10:
                if len(command_c) > 0:
                    break
                else:
                    continue

            command_c.append(final_path[k])

        final_path = list_replace(final_path, command_c, ['C'])

        [print(''.join(x)) for x in [final_path, command_a, command_b, command_c]]

        if final_check.match(''.join(final_path)):
            program = puzzle_input.copy()
            program[0] = 2
            q1 = queue.Queue()
            full_input = "\n".join([
                ','.join(final_path),
                ','.join(command_a),
                ','.join(command_b),
                ','.join(command_c),
                'n',
            ]) + '\n'

            print(full_input)

            [q1.put(ord(x)) for x in full_input]
            intcode = Intcode(17, q1)
            intcode.run_program(program)

            out = intcode.output

            while True:
                val = out.get_nowait()
                if val > 255:
                    print("Part 2", val)
                    exit(0)

print("Didn't compress?")
