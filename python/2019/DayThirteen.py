import collections
import queue
import sys

import common.Queue
from common.Intcode import Intcode

puzzle_input = [int(x) for x in sys.stdin.readlines()[0].split(',')]

intcode = Intcode(13)

intcode.run_program(puzzle_input.copy())

output = common.Queue.queue_to_list(intcode.output)

grid_def = [(x[0], x[1], x[2]) for x in [output[y:y + 3] for y in range(0, len(output), 3)]]

xs = []
ys = []

grid = collections.defaultdict(lambda: 0)

for definition in grid_def:
    grid[(definition[0], definition[1])] = definition[2]
    xs.append(definition[0])
    ys.append(definition[1])

EMPTY, WALL, BLOCK, PADDLE, BALL = (0, 1, 2, 3, 4)
print("Part one:", len(list(filter(lambda x: x == 2, grid.values()))))

next_input = puzzle_input.copy()
next_input[0] = 2


class JoystickInput:

    def __init__(self, q1):
        self.q1 = q1
        self.ball_x = None
        self.paddle_x = None
        self.score = None

    def get(self):
        while not self.q1.empty():
            (x, y, block_type) = (self.q1.get_nowait(), self.q1.get_nowait(), self.q1.get_nowait())
            if (x, y) == (-1, 0):
                self.score = block_type
            elif block_type == BALL:
                self.ball_x = x
            elif block_type == PADDLE:
                self.paddle_x = x

        while True:
            try:
                self.q1.get_nowait()
            except queue.Empty:
                break

        if self.ball_x == self.paddle_x:
            return 0
        else:
            return -1 if self.ball_x < self.paddle_x else 1


q1 = queue.Queue()

joystick = JoystickInput(q1)

intcode = Intcode(13, joystick, q1)
intcode.run_program(next_input)

joystick.get()

print("Part two", joystick.score)
