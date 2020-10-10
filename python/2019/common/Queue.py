import queue


def queue_to_list(q1):
    l1 = []
    while True:
        try:
            l1.append(q1.get_nowait())
        except queue.Empty:
            break
    return l1
