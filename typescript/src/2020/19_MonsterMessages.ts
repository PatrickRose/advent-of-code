import getInput from "./util/getInput";

const input = getInput(19);

const rawRules = input.split("\n\n")[0].split("\n");
const messages = input.split("\n\n")[1].split("\n");

interface Rule {
    toRegex(): RegExp
}

class SingleChar implements Rule {

    constructor(private char: string) {
    }

    toRegex(): RegExp {
        return new RegExp(this.char);
    }
}

type AllRules = Map<number, Rule>;

class SubRules implements Rule {
    private subRules: undefined | Array<Rule> = undefined;
    private regex: undefined | RegExp;

    constructor(private rules: AllRules, private baseSubRules: Array<number>) {
    }

    toRegex(): RegExp {
        if (this.regex === undefined) {
            const subRules: Array<Rule> = this.getSubRules();

            const subRegex: Array<RegExp> = subRules.map(sub => sub.toRegex());

            this.regex = new RegExp(subRegex.map(regex => regex.source).join(''))
        }

        return this.regex;
    }

    private getSubRules() {
        if (this.subRules === undefined) {
            this.subRules = this.baseSubRules.map(val => {
                const sub = this.rules.get(val);

                if (sub === undefined) {
                    throw new Error(`Unknown rule ${val}`);
                }

                return sub;
            })
        }

        return this.subRules;
    }
}

class MultiRules implements Rule {
    private regex: undefined | RegExp;

    constructor(private ruleNum: number, private subRules: Array<SubRules>) {
    }

    toRegex(): RegExp {
        if (this.regex === undefined) {
            this.regex = new RegExp(
                '('
                + this.subRules.map(sub => sub.toRegex().source).join('|')
                + ')'
            );
        }


        return this.regex;
    }
}

class Special8 implements Rule {
    private regex: RegExp | undefined;

    constructor(private allRules: AllRules) {
    }

    toRegex(): RegExp {
        if (this.regex === undefined) {
            const rule42 = this.allRules.get(42);

            if (rule42 === undefined) {
                throw new Error('Can\'t find rule 42');
            }

            this.regex = new RegExp('(' + rule42.toRegex().source + ')+');
        }

        return this.regex;
    }
}

class Special11 implements Rule {
    private regex: RegExp | undefined;

    constructor(private allRules: AllRules) {
    }

    toRegex(): RegExp {
        if (this.regex === undefined) {
            const rule42 = this.allRules.get(42);
            const rule31 = this.allRules.get(31)

            if (rule42 === undefined || rule31 === undefined) {
                throw new Error('Can\'t find rule 42 / 31');
            }

            const regex42 = rule42.toRegex().source;
            const regex31 = rule31.toRegex().source;

            const cases: Array<string> = [1, 2, 3, 4, 5].map(
                val => {
                    return regex42.repeat(val) + regex31.repeat(val);
                }
            );

            this.regex = new RegExp('(' + cases.join('|') + ')');
        }

        return this.regex;
    }
}

const rules: AllRules = new Map<number, Rule>();
const rules2: AllRules = new Map<number, Rule>();

function stringToRule(rawRule: string, allRules: AllRules, baseRuleNum: number): Rule {
    const singleCharMatch = rawRule.match(/"([a-z])"/);

    if (singleCharMatch !== null) {
        return new SingleChar(singleCharMatch[1]);
    }

    const subRuleMatch = rawRule.match(/^(\d+| \d+)+$/);

    if (subRuleMatch !== null) {
        return new SubRules(allRules, rawRule.split(' ').map(num => {
            const ruleNum = Number(num);

            if (isNaN(ruleNum)) {
                throw new Error(`Invalid number for ${rawRule} (${num})`);
            }

            return ruleNum;
        }));
    }

    const multiRuleMatch = rawRule.match(/^(\d+| \d+)+( \|( \d+)+)+$/);

    if (multiRuleMatch !== null) {
        const subRules: Array<SubRules> = rawRule.split(' | ').map(
            (val): SubRules => {
                return new SubRules(
                    allRules,
                    val.split(' ').map(
                        num => {
                            const ruleNum = Number(num);

                            if (isNaN(ruleNum)) {
                                throw new Error(`Invalid number for ${rawRule} (${num})`);
                            }

                            return ruleNum;
                        }
                    )
                );
            }
        );

        return new MultiRules(baseRuleNum, subRules);
    }

    throw new Error(`Unknown rule type ${rawRule}`);
}

rawRules.forEach(row => {
    const matches = row.match(/(\d+): (.+)/);

    if (matches === null) {
        throw new Error(`Unable to parse ${row}`);
    }

    const ruleNum = Number(matches[1]);

    if (isNaN(ruleNum)) {
        throw new Error(`Unable to parse ${row} (${matches[1]} was not a number)`);
    }

    rules.set(ruleNum, stringToRule(matches[2], rules, ruleNum));

    switch (ruleNum) {
        case 8:
            rules2.set(ruleNum, new Special8(rules2));
            break;
        case 11:
            rules2.set(ruleNum, new Special11(rules2));
            break;
        default:
            rules2.set(ruleNum, stringToRule(matches[2], rules2, ruleNum));
    }
})

const parts: Array<AllRules> = [rules, rules2];

[1, 2].forEach(index => {
    const allRules = parts[index - 1];
    const rule0 = allRules.get(0);

    if (rule0 === undefined) {
        throw new Error(`Rule 0 doesn't exist!`);
    }

    const validMessages = messages.filter(
        message => {
            const result = message.match('^' + rule0.toRegex().source + '$');

            return result !== null;
        }
    );

    console.log(`Part ${index}: ${validMessages.length}`);
});
