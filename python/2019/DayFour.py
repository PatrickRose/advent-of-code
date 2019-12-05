import sys

def meets_criteria(number):
    number = str(number)
    last_number = 0
    hit_double = False
    for i in range(0, len(number)):
        if int(number[i]) < last_number:
            return False

        if i > 0 and number[i] == number[i-1]:
            hit_double = True

        last_number = int(number[i])

    return hit_double

def meets_criteria_two(number):
    number = str(number)
    last_number = 0
    hit_double = False

    for i in number:
        if int(i) < last_number:
            return False

        last_number = int(i)

    doubleCount = {}

    for i in range(10):
        doubleCount[str(i)] = 0

    last_number = number[:1]

    for i in number[1:]:
        if i == last_number:
            doubleCount[i] += 1
        else:
            last_number = i
    

    return 1 in doubleCount.values()

lowest,highest = [int(x) for x in sys.stdin.readlines()[0].split('-')]

valid_passwords = filter(meets_criteria, range(int(lowest), int(highest)+1))

print("Part 1: " + str(len(list(valid_passwords))))

valid_passwords = filter(meets_criteria_two, range(int(lowest), int(highest)+1))

print("Part 2: " + str(len(list(valid_passwords))))                         
