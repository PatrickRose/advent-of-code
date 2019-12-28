from common.Intcode import Intcode
import queue

program = Intcode.parse_input('input/DayNineteen')

inQueue = queue.Queue()
outQueue = queue.Queue()

intcode = Intcode(19, inQueue, outQueue)

count = 0

def check_position(x, y):
    if x < 0 or y < 0:
        return 0
    
    assert outQueue.empty()
    assert inQueue.empty()
    inQueue.put(x)
    inQueue.put(y)

    intcode.run_program(program.copy())

    return outQueue.get_nowait()

def find_square(grid, x, y):
    if check_position(x, y+100):
        return 1
    
    for (i,j) in [(x+100, y+100),(x+100, y+100),]:
        if check_position(i,j) == 0:
            return 0

    return 2

def build_row(grid, x, vals, stop_on_first = False):
    found_value = False
    new_vals = set()
    y = min(vals)
    look_for_square = True
    while True:
        value = check_position(x, y)
        if value == 1:
            grid[(x,y)] = True
            found_value = True
            new_vals.add(y)
            if stop_on_first:
                return new_vals
        elif found_value:
            break
        elif x < 50 and y > 50:
            break
        y += 1
    return new_vals if len(new_vals) > 0 else set([0])
    

grid = {(-1,-1): None}
vals = set([0])
for x in range(50):
    vals = build_row(grid, x, vals)

print ("Part one", sum([sum([1 if (i,j) in grid else 0 for i in range(50)]) for j in range(50)]))

while check_position(x - 99, min(vals) + 99) != 1:
    x += 1
    old_vals = vals
    vals = build_row(grid, x, old_vals, True)
    answer = (x - 99, min(vals))

print ("Part 2", answer[0] * 10000 + answer[1])
