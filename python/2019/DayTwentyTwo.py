import re
import sys

PUZZLE_INPUT = [x.strip() for x in sys.stdin.readlines()]
CUT_REGEX = re.compile('cut (-?\d+)')
INCREMENT_REGEX = re.compile('deal with increment (\d+)')


def find_modular_inverse(increment, size):
    t = 0
    r = size
    newt = 1
    newr = increment

    while newr != 0:
        quotient = r // newr
        (r, newr) = (newr, r - (quotient * newr))
        (t, newt) = (newt, t - (quotient * newt))

    return int((1 / r) * t)


def pow_mod(x, n, m):
    y = 1

    while n > 0:
        if n % 2 == 1:
            y = (y * x) % m
        n = n // 2
        x = (x * x) % m

    return y


class CardList:
    increment = 1
    start = 0
    size = None

    def __init__(self, size):
        self.size = size

    def deal_into_new_stack(self):
        self.start = (self.start - self.increment) % self.size
        self.increment = -self.increment % self.size

    def cut_cards(self, cut):
        self.start = (self.start + (cut * self.increment)) % self.size

    def deal_with_increment(self, increment):
        # find x such that x * increment = 1 mod size
        mod_inverse = find_modular_inverse(increment, self.size)
        self.increment = (self.increment * mod_inverse) % self.size

    def make_list(self):
        to_return = []
        value = self.start
        for i in range(self.size):
            to_return.append(value)
            value = (value + self.increment) % self.size

        return to_return


def do_shuffle(deck_size: int, num_times: int):
    cards = CardList(deck_size)
    for line in PUZZLE_INPUT:
        if line == 'deal into new stack':
            cards.deal_into_new_stack()
        elif CUT_REGEX.match(line):
            cards.cut_cards(int(CUT_REGEX.match(line).group(1)))
        elif INCREMENT_REGEX.match(line):
            cards.deal_with_increment(int(INCREMENT_REGEX.match(line).group(1)))

    # Now that we've calculated the increment and start we can
    # just reapply this N times

    # To do that, we need to:
    # 1. Raise the increment to the Nth power
    # 2. Change the start to be start(1-increment^N)/(1-increment)
    new_increment = pow_mod(cards.increment, num_times, cards.size)
    mod_inverse = find_modular_inverse(1 - cards.increment, cards.size)
    new_start = (cards.start * (1 - new_increment)) * mod_inverse

    cards.increment = new_increment % cards.size
    cards.start = new_start % cards.size

    return cards


print("Part one: %s" % do_shuffle(10007, 1).make_list().index(2019))
cards = do_shuffle(119315717514047, 101741582076661)
answer = (cards.start + (2020 * cards.increment)) % cards.size
print("Part two: %s" % answer)
