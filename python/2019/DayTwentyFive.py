import queue

import common.Queue
from common.IntcodeWaiter import Intcode

# Can't just read from stdin now!
with open('input/DayTwentyFive') as f:
    puzzle_input = [int(x) for x in f.readlines()[0].split(',')]

in_queue = queue.Queue()
out_queue = queue.Queue()

intcode = Intcode(23, in_queue, out_queue)
intcode.run_program(puzzle_input.copy())

while intcode.waiting:
    response = common.Queue.queue_to_list(out_queue)
    player_input = input(''.join(chr(x) for x in response))

    for char in player_input + "\n":
        in_queue.put(ord(char))

    intcode.resume()

response = common.Queue.queue_to_list(out_queue)
print(''.join(chr(x) for x in response))
