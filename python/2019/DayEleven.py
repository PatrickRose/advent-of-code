import sys
import collections

from common.Intcode import Intcode

puzzle_input = [int(x) for x in sys.stdin.readlines()[0].split(',')]

class RobotPos:

    def __init__(self, robot_pos):
        self.robot_pos = robot_pos

class ScanInput:

    def __init__(self, grid, robot_pos):
        self.grid = grid
        self.robot_pos = robot_pos
    
    def get(self):
        return self.grid[robot_pos.robot_pos]

class PaintOutput:

    paint = True

    def __init__(self, grid, robot_pos):
        self.grid = grid
        self.robot_pos = robot_pos
        self.direction = 0

    def put(self, value):
        if self.paint:
            grid[self.robot_pos.robot_pos] = value
        else:
            if value == 0:
                self.direction -= 1
            else:
                self.direction += 1
            self.direction %= 4

            x, y = self.robot_pos.robot_pos
            
            if self.direction == 0:
                y -= 1
            elif self.direction == 1:
                x += 1
            elif self.direction == 2:
                y += 1
            elif self.direction == 3:
                x -= 1

            self.robot_pos.robot_pos = (x,y)
        
        
        self.paint = not self.paint
            

robot_pos = RobotPos((0, 0))
grid = collections.defaultdict(lambda: 0)
intcode = Intcode(11, ScanInput(grid, robot_pos), PaintOutput(grid, robot_pos))

intcode.run_program(puzzle_input.copy())

print ("Part one", len(grid))

robot_pos = RobotPos((0, 0))
grid = collections.defaultdict(lambda: 0)
grid[(0,0)] = 1
intcode = Intcode(11, ScanInput(grid, robot_pos), PaintOutput(grid, robot_pos))

intcode.run_program(puzzle_input.copy())

## Find the min/max x/y
xs = [x[0] for x in grid]
ys = [x[1] for x in grid]

min_x = min(xs)
max_x = max(xs)
min_y = min(ys)
max_y = max(ys)

message = ''

for y in range(min_y, max_y+1):
    for x in range(min_x, max_x+1):
        if grid[(x,y)] == 1:
            message += '#'
        else:
            message += ' '
    message += "\n"

print ("Part two\n", message)
