import getInput from "./util/getInput";

const input = getInput(7);

class IP {

    private hypernets: string[];
    private sequences: string[];

    constructor(public readonly input: string) {
        this.hypernets = input.match(/\[([^\]]+)]/g) || [];
        this.sequences = input.replace(/\[([^\]]+)]/g, ' ').split(' ');
    }

    private static hasABBA(sequence: string): boolean {
        const reqex = sequence.match(/(.)(.)\2\1/);
        if (!reqex) {
            return false;
        }

        return reqex[1] != reqex[2];
    }

    private static getABA(sequence: string): [string, string, string][] {
        const sequences: string[] = sequence.split('').map(
            (char, index, list) => list.slice(index, index + 3).join('')
        )

        return sequences.filter(s => s.match(/^(.)(.)\1$/) && !s.match(/^(.)\1\1$/)).map(s => [s[0], s[1], s[2]]);
    }

    public supportsTLS(): boolean {
        return this.sequences.some(IP.hasABBA)
            && !this.hypernets.some(IP.hasABBA);
    }

    public supportsSSL(): boolean {
        const aba = this.sequences.map(IP.getABA).reduce(
            (previousValue, currentValue) => {
                previousValue.push(...currentValue)
                return previousValue;
            },
            []
        );

        return aba.some(
            aba => this.hypernets.some(s => s.includes(aba[1] + aba[0] + aba[1]))
        );
    }
}

const ips: IP[] = input.split('\n').map(row => new IP(row));

console.log(`Part 1: ${ips.filter(ip => ip.supportsTLS()).length}`);
console.log(`Part 2: ${ips.filter(ip => ip.supportsSSL()).length}`);

