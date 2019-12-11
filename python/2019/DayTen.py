import sys
import math
import operator

puzzle_input = sys.stdin.readlines()
asteroids = {}
num_cols = num_rows = len(puzzle_input)

for i in range(len(puzzle_input)):
    line = puzzle_input[i]
    for j in range(len(line.strip())):
        if line[j] == '#':
            asteroids[(j,i)] = True

num_visible = {}

def get_angle_between(base, first, second):
    x1, y1 = first
    x1 -= base[0]
    y1 -= base[1]
    x2, y2 = second
    x2 -= base[0]
    y2 -= base[1]
    try:
        dot_product = (x1*x2 + y1*y2)
        first_length = math.sqrt(x1*x1+y1*y1)
        second_length = math.sqrt(x2*x2+y2*y2)
        to_solve = dot_product / (first_length * second_length)

        if to_solve < -1:
            to_solve = -1
        elif to_solve > 1:
            to_solve = 1
            
        radians = math.acos(to_solve)
        degree = math.degrees(radians)
    except ZeroDivisionError:
        degree = 0

    if x2 < x1:
        degree = 360 - degree

    return degree

def get_visible_asteroids(key):
    x,y = key
    count = []
    for to_check in asteroids:
        if to_check == key:
            continue
        x1,y1 = to_check
        d1,d2 = x1-x,y1-y
        gcd = math.gcd(d1, d2)
        dx,dy = d1/gcd, d2/gcd
        x2,y2 = x1,y1

        checked = []
            
        while x2 != x or y2 != y:
            checked.append((x2, y2))
            if (x2,y2) != to_check and (x2, y2) in asteroids:
                break
            x2 -= dx
            y2 -= dy

        if x2 == x and y2 == y:
            count.append(to_check)

    return count
            
for key in asteroids:
    num_visible[key] = len(get_visible_asteroids(key))
    
print ("Part one:", max(num_visible.values()))

max_key = max(num_visible.items(), key=operator.itemgetter(1))[0]

i = 1
visible_asteroids = []

# max_key = (9,2)

last_asteroid = (max_key[0], max_key[1] - 1)
destroyed = []

while i <= 200:
    if len(visible_asteroids) == 0:
        visible_asteroids = get_visible_asteroids(max_key)
        visible_asteroids.sort(key=lambda key: get_angle_between(max_key, last_asteroid, key))
        visible_asteroids.reverse()

    last_asteroid = visible_asteroids.pop()
    destroyed.append(last_asteroid)
    del asteroids[last_asteroid]
        
    i +=1 

print ("Part two", last_asteroid[0] * 100 + last_asteroid[1])
