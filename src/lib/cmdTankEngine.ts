import { join } from 'path';
import { existsSync, readFileSync, moveSync, rmSync } from 'fs-extra';
import chalk from 'chalk';
import { spawn } from 'child_process';
import { parse } from 'yaml';
import { v4 as uuid4 } from 'uuid';
import { homedir } from 'os';
import { resolveFiles, resolveFilesPlusFolders, resolveMinimum } from './pathResolver.js';

const spwn = (comd: string, args: string[], cwd: string | null = null): Promise<number> => {
    return new Promise((resolve) => {
        const prcss = spawn(comd, args, {
            cwd: cwd || process.cwd(),
            env: process.env,
            shell: true
        });

        prcss.stdout.on('data', (data) => {
            process.stdout.write(data.toString());
        });

        prcss.stderr.on('data', (data) => {
            process.stderr.write(data.toString());
        });

        prcss.on('exit', (code) => {
            resolve(code || 0);
        });

        process.stdin.pipe(prcss.stdin);
    });
};

const f = async (filename: string, fix: boolean, tank: string, rawData: any = null): Promise<boolean> => {
    let cmd: string;
    if (rawData) {
        cmd = rawData;
    } else {
        const PATH = join(process.cwd(), 'nautus', filename);
        if (!existsSync(PATH)) {
            console.log(chalk.red('Error: Please make sure file ' + PATH + ' exists!'));
            return false;
        }
        const parsed = parse(readFileSync(PATH, 'utf8'));
        const commandIdentifier = fix ? 'fixCommand' : 'command';
        if (!parsed.tanks[tank]) {
            console.log(chalk.red('Error: Tank ' + tank + ' not found in yaml file'));
            return false;
        }
        const t = parsed.tanks[tank];
        if (!t[commandIdentifier]) {
            console.log(chalk.red('Error: command not specified'));
            return false;
        }
        cmd = t[commandIdentifier];
    }

    // Parse cmd

    // Run it
    if (cmd.startsWith('@ONCE')) {
        if (await spwn(cmd.substring(5), []) !== 0) {
            console.log(chalk.red('Error while running command!'));
            return false;
        }
    } else if (cmd.startsWith('@COPY')) {
        cmd = cmd.substring(5);
        const cpp = join(homedir(), `nautus-random-path-${uuid4()}`);
        const res = resolveMinimum([], []);
        for (const fp of res) {
            moveSync(fp, join(cpp, fp), { overwrite: true });
        }
        cmd = cmd.replace(/\$\{filename\}/gi, cpp);
        if (await spwn(cmd, [], cpp) !== 0) {
            console.log(chalk.red('Error while running command!'));
            for (const fp of res) {
                moveSync(join(cpp, fp), fp, { overwrite: true });
            }
            rmSync(cpp);
            return false;
        }
        for (const fp of res) {
            moveSync(join(cpp, fp), fp, { overwrite: true });
        }
        rmSync(cpp);
    } else {
        for (const fp of resolveFiles([], [])) {
            if (await spwn(cmd.replace(/\$\{filename\}/gi, fp), []) !== 0) {
                console.log(chalk.red('Error while running command!'));
                return false;
            }
        }
    }
    
    return true;
};

export default async (...args: [string, boolean, string, any?]): Promise<void> => {
    if (await f(...args) !== true) {
        process.exit(1);
    }
    return;
};
