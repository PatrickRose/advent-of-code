import sys
import re
import math
import queue
import threading
import itertools

import common.Queue

puzzle_input = sys.stdin.readlines()

grid = {}
keys = set()
positions = {}
points_to_do = set()
split_keys = [set(),set(),set(),set()]
split_grids = [{}, {}, {}, {}]
split_positions = [{}, {}, {}, {}]
split_points_to_do = [set(), set(), set(), set()]

regex = re.compile('[a-z]')
door_regex = re.compile('[A-Z]')

for y in range(len(puzzle_input)):
    line = puzzle_input[y].strip()
    for x in range(len(line)):
        if line[x] == '#':
            continue
        grid[(x,y)] = line[x]
        y_pos = 0 if y < len(puzzle_input) / 2 else 1
        x_pos = 0 if x < len(line) / 2 else 2
        split_grids[y_pos | x_pos][(x,y)] = line[x]
        if regex.match(line[x]):
            keys.add(line[x])
            split_keys[y_pos | x_pos].add(line[x])
        elif line[x] == '@':
            points_to_do.add((x,y))
            positions[(x,y)] = {'': 0}
            split_positions[0][(x-1,y-1)] = {'': 0}
            split_points_to_do[0].add((x-1,y-1))
            split_positions[1][(x-1,y+1)] = {'': 0}
            split_points_to_do[1].add((x-1,y+1))
            split_positions[2][(x+1,y-1)] = {'': 0}
            split_points_to_do[2].add((x+1,y-1))
            split_positions[3][(x+1,y+1)] = {'': 0}
            split_points_to_do[3].add((x+1,y+1))
            
def find_all_keys(grid, all_keys, points_to_do, positions):
    num_steps = 0
    made_change = True
    while True:
        assert made_change
        made_change = False
        to_do = set()
        for pos in points_to_do:
            for key,value in positions[pos].items():
                if value == num_steps:
                    to_do.add((pos,key))
        num_steps += 1

        new_set = set()
        
        for (x,y), collected_keys in to_do:
            for point in [(x+1, y),(x-1, y),(x, y+1),(x, y-1),]:
                key_set = set(collected_keys.split(','))
                if '' in key_set:
                    key_set.remove('')
                if point not in grid:
                    # No point, can't go that way
                    continue

                if door_regex.match(grid[point]):
                    if grid[point].lower() not in key_set and grid[point].lower() in all_keys:
                        continue

                if regex.match(grid[point]):
                    key_set.add(grid[point])
                    if key_set == all_keys:
                        return num_steps

                object_keys = list(key_set)
                object_keys.sort()
                obj_key = ','.join(object_keys)
                if point not in positions:
                    positions[point] = {}
                if obj_key not in positions[point]:
                    positions[point][obj_key] = math.inf
                if positions[point][obj_key] > num_steps:
                    new_set.add(point)
                    positions[point][obj_key] = num_steps
                    made_change = True

        points_to_do = new_set

print ("Part one:", find_all_keys(grid, keys, points_to_do, positions.copy()))

# We don't need to convert the other grids - the input already adds the walls
# It means we check some squares that are known dead ends but eh, I don't really care
sum = 0
for i in range(4):
    sum += find_all_keys(split_grids[i], split_keys[i], split_points_to_do[i], split_positions[i])

print ("Part two:", sum)
