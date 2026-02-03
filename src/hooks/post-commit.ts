import { join } from 'path';
import { readJSONSync } from 'fs-extra';
import { spawn } from 'child_process';
import chalk from 'chalk';

const spwnSilent = (comd: string, args: string[]): Promise<number> => {
    return new Promise((resolve) => {
        const prcss = spawn(comd, args, {
            cwd: process.cwd(),
            env: process.env,
            shell: true
        });

        prcss.stderr.on('data', (data) => {
            process.stderr.write(data.toString());
        });

        prcss.on('exit', (code) => {
            if ((code || 0) !== 0) process.exit(code);
            resolve(code || 0);
        });
    });
};

export default async (): Promise<void> => {
    const hookRules = readJSONSync(join(process.cwd(), 'nautus', '.internal', 'hook-rules.json'));
    
    if (hookRules['Fetch & Push git repo after commit (Not recommended in most cases)']) {
        await spwnSilent('git', ['fetch']);
        await spwnSilent('git', ['push']);
        console.log(chalk.green('✅ Pushed repo'));
    }
};
