import getInput from "./util/getInput";
import {isSharedArrayBuffer} from "node:util/types";

const testInputs = {}

const input = getInput(testInputs, 22);

const stats = input.split('\n').map(row => Number.parseInt(row.split(': ')[1]));

const boss = {
    hp: stats[0],
    damage: stats[1]
}

type State = {
    mannaSpent: number,
    mannaLeft: number,
    ourHp: number,
    bossHp: number,
    shield: number,
    poison: number,
    recharge: number
}

type Spell = (state: State) => State | null;

const spells: Spell[] = [
    // Magic Missile
    (state: State) => {
        const {mannaSpent, mannaLeft, bossHp} = state;
        const cost = 53;

        if (mannaLeft < cost) {
            return null;
        }

        return {
            ...state,
            mannaSpent: mannaSpent + cost,
            mannaLeft: mannaLeft - cost,
            bossHp: bossHp - 4
        }
    },

    // Drain
    (state: State) => {
        const {mannaSpent, mannaLeft, bossHp, ourHp} = state;
        const cost = 73;

        if (mannaLeft < cost) {
            return null;
        }

        return {
            ...state,
            mannaSpent: mannaSpent + cost,
            mannaLeft: mannaLeft - cost,
            bossHp: bossHp - 2,
            ourHp: ourHp + 2
        }
    },

    // Shield
    (state: State) => {
        const {mannaSpent, mannaLeft, shield} = state;
        const cost = 113;

        if (mannaLeft < cost || shield != 0) {
            return null;
        }

        return {
            ...state,
            mannaSpent: mannaSpent + cost,
            mannaLeft: mannaLeft - cost,
            shield: 6
        }
    },

    // Poison
    (state: State) => {
        const {mannaSpent, mannaLeft, poison} = state;
        const cost = 173;

        if (mannaLeft < cost || poison != 0) {
            return null;
        }

        return {
            ...state,
            mannaSpent: mannaSpent + cost,
            mannaLeft: mannaLeft - cost,
            poison: 6
        }
    },

    // Shield
    (state: State) => {
        const {mannaSpent, mannaLeft, recharge} = state;
        const cost = 229;

        if (mannaLeft < cost || recharge != 0) {
            return null;
        }

        return {
            ...state,
            mannaSpent: mannaSpent + cost,
            mannaLeft: mannaLeft - cost,
            recharge: 5
        }
    },
];

function findMinManna(currState: State, ourTurn: boolean, hardMode: boolean): number {
    // Make sure we definitely don't have any references
    const state = {...currState};

    if (ourTurn && hardMode) {
        state.ourHp--;

        if (state.ourHp == 0) {
            return Infinity;
        }
    }

    // First, apply all effects
    const ourArmour = (state.shield > 0) ? 7 : 0;
    if (state.shield > 0) {
        state.shield--;
    }

    if (state.poison > 0) {
        state.poison--;
        state.bossHp -= 3;
    }

    if (state.recharge > 0) {
        state.recharge--;
        state.mannaLeft += 101;
    }

    if (state.bossHp <= 0) {
        // End here if we killed them
        return state.mannaSpent;
    }

    if (!ourTurn) {
        state.ourHp -= Math.max(1, boss.damage - ourArmour);

        // We died, this is a bad place
        if (state.ourHp <= 0) {
            return Infinity;
        }

        return findMinManna(state, true, hardMode);
    }

    const possibleStates: number[] = spells
        .map(val => {
            const newState = val(state);

            if (newState === null) {
                return Infinity;
            }

            return findMinManna(newState, false, hardMode);
        })

    return Math.min(...possibleStates);
}

const startingState: State = {
    bossHp: boss.hp,
    mannaLeft: 500,
    mannaSpent: 0,
    ourHp: 50,
    poison: 0,
    recharge: 0,
    shield: 0
}

console.log(`Part 1: ${findMinManna(startingState, true, false)}`);
console.log(`Part 2: ${findMinManna(startingState, true, true)}`);
