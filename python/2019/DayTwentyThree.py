import sys

import common.Queue
import queue

from common.IntcodeWaiter import Intcode


puzzle_input = [int(x) for x in sys.stdin.readlines()[0].split(',')]

inputs = []
outputs = []
intcodes = []

for i in range(50):
    in_queue = queue.Queue()
    inputs.append(in_queue)
    out_queue = queue.Queue()
    outputs.append(out_queue)
    in_queue.put(i)

    this_intcode = Intcode(23, in_queue, out_queue)
    intcodes.append(this_intcode)
    this_intcode.run_program(puzzle_input.copy())

first_255 = True
nat_packet = None

idle_ticks = 0

values_passed = {}

while True:
    idle_ticks += 1
    for i in range(50):
        out_queue = outputs[i]
        this_intcode = intcodes[i]

        while True:
            try:
                address = out_queue.get_nowait()
            except queue.Empty:
                break

            if address == 255:
                nat_packet = (out_queue.get_nowait(), out_queue.get_nowait())
                if first_255:
                    first_255 = False
                    print("First packet to 255 was", nat_packet)
            else:
                in_queue = inputs[address]
                in_queue.put(out_queue.get_nowait())
                in_queue.put(out_queue.get_nowait())

        in_queue = inputs[i]

        if in_queue.empty():
            in_queue.put(-1)
        else:
            idle_ticks = 0

        this_intcode.resume()

    # If nothing happens after 5 iterations then assume everything is empty
    if idle_ticks > 5:
        (x,y) = nat_packet
        if y in values_passed:
            print(y)
            break

        values_passed[y] = True
        idle_ticks = 0
        inputs[0].put(x)
        inputs[0].put(y)