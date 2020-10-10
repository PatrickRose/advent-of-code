import queue
import sys
import threading

from common.Intcode import Intcode


def run_program(phases):
    signal = 0
    for phase in phases:
        q1 = queue.Queue()
        q1.put(phase)
        q1.put(signal)
        intcode = Intcode(7, q1)
        signal = intcode.run_program(puzzle_input.copy()).get()

    return signal


def run_part_two(phases):
    queues = []
    for phase in phases:
        q1 = queue.Queue()
        q1.put(phase)
        queues.append(q1)

    queues[0].put(0)

    threads = []

    for i in range(5):
        intcode = Intcode(7, queues[i], queues[(i + 1) % 5])
        thread = threading.Thread(target=intcode.run_program, args=(puzzle_input.copy(),))
        threads.append(thread)
        thread.start()

    [x.join() for x in threads]

    return queues[0].get(0)


puzzle_input = [int(x) for x in sys.stdin.readlines()[0].split(',')]

phases = []

for i in range(5):
    this_input = [i]
    for j in range(5):
        if j in this_input:
            continue
        this_input.append(j)
        for k in range(5):
            if k in this_input:
                continue
            this_input.append(k)
            for l in range(5):
                if l in this_input:
                    continue
                this_input.append(l)
                for p in range(5):
                    if p in this_input:
                        continue
                    this_input.append(p)
                    phases.append(this_input.copy())
                    this_input.pop()
                this_input.pop()

            this_input.pop()

        this_input.pop()

signals = [run_program(x) for x in phases]

print("Part one: " + str(max(signals)))

part_two_phases = [[x + 5 for x in y] for y in phases]

part_two = [run_part_two(x) for x in part_two_phases]

print("Part Two: " + str(max(part_two)))
