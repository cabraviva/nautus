import chalk from 'chalk';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function helpCommand(args: string[]): Promise<void> {
    console.log('\n' + chalk.bgCyan(chalk.white('                                              Help                                              ')));
    
    function fillUp(txt: string, c: number): string {
        if (txt.length >= c) return txt;
        txt = txt + ' '.repeat(c - txt.length);
        return txt;
    }

    const commandsDir = __dirname;
    for (const registeredCMD of readdirSync(commandsDir)) {
        if (registeredCMD.startsWith('@')) continue;
        if (!registeredCMD.endsWith('.js')) continue; // Skip non-JS files
        const commandModule = await import(join(commandsDir, registeredCMD));
        const usage = commandModule.default[1];
        const explanation = commandModule.default[2];
        if (explanation !== '@dontshow') {
            console.log(fillUp(usage, 30) + chalk.grey(fillUp(explanation, 66)));
        }
    }
    
    console.log('\n\n' + chalk.bgCyan(chalk.white('                                           What\'s next                                          ')));
    console.log(`Create a nautus project using ${chalk.green('nautus create')}`);
    console.log(`Complete your info using ${chalk.green('nautus me')}\n\n`);
}

export default [helpCommand, 'help', 'Shows this help menu'] as const;
