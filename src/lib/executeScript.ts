import { join } from 'path';
import { platform } from 'os';
import { exec, spawn } from 'child_process';
import { readdir, pathExists, readJson } from 'fs-extra';
import * as fs from 'fs';
import chalk from 'chalk';
import axios from 'axios';

type ExitFunction = (code: number) => never;
type CommandResult = [number, string];

async function findBinCommand(binCommand: string): Promise<string | undefined> {
    const nodeModulesDir = join(process.cwd(), 'node_modules');
    const packageJsonFiles = await readdir(nodeModulesDir);

    const binaryPaths: string[] = [];
    for (const packageJsonFile of packageJsonFiles) {
        const packageJsonPath = join(nodeModulesDir, packageJsonFile, 'package.json');

        if (await pathExists(packageJsonPath)) {
            const packageJson = await readJson(packageJsonPath);

            if (packageJson.bin && packageJson.bin[binCommand]) {
                const binaryPath = join(nodeModulesDir, packageJsonFile, packageJson.bin[binCommand]);
                binaryPaths.push(binaryPath);
            }
        }
    }

    return binaryPaths[0];
}

function cmd(command: string): Promise<CommandResult> {
    return new Promise((resolve, reject) => {
        if (typeof command !== 'string') throw new TypeError('command must be a string');
        exec('cd ' + process.cwd() + ' && ' + command, (error, stdout, stderr) => {
            if (error) {
                return reject([error.code || 1, (stdout || '') + (stderr || '')]);
            }
            resolve([0, (stdout || '') + (stderr || '')]);
        });
    });
}

function getOS(): string {
    const p = platform();
    if (p === 'darwin') return 'mac';
    if (p === 'win32') return 'windows';
    if (p === 'linux') return 'linux';
    return 'unknown';
}

function info(...what: any[]): void {
    console.log(...what);
}

function warn(...what: any[]): void {
    console.warn(chalk.yellow(...what));
}

function createError(exitfunc: ExitFunction) {
    return (...what: any[]): never => {
        console.error(chalk.red('Error:'));
        console.error(...what);
        exitfunc(1);
    };
}

function spwn(comd: string, args: string[] = [], silent: boolean = false): Promise<number> {
    return new Promise((resolve) => {
        const prcss = spawn(comd, args, {
            cwd: process.cwd(),
            env: process.env,
            shell: true
        });

        if (!silent) {
            prcss.stdout.on('data', (data) => {
                process.stdout.write(data.toString());
            });
        }

        prcss.stderr.on('data', (data) => {
            process.stderr.write(data.toString());
        });

        prcss.on('exit', (code) => {
            resolve(code || 0);
        });

        process.stdin.pipe(prcss.stdin);
    });
}

async function nodeBin(
    command: string,
    args: string[] = [],
    silent: boolean = false,
    errorFunc: ReturnType<typeof createError>
): Promise<number> {
    const binCmdPath = await findBinCommand(command);
    if (!binCmdPath) return errorFunc(`${command} not found. Make sure to install the right package locally!`);

    if (!(binCmdPath.endsWith('.js') || binCmdPath.endsWith('.mjs'))) {
        return await spwn('cmd', ['/c', binCmdPath, ...args], silent);
    } else {
        return await spwn('node', [binCmdPath, ...args], silent);
    }
}

export default async function runScript(
    scriptName: string,
    exitfunc: ExitFunction = process.exit as ExitFunction,
    isAgent: boolean = false
): Promise<void> {
    if (typeof scriptName !== 'string') throw new TypeError('scriptName must be a string');
    
    const scriptPath = isAgent
        ? join(process.cwd(), 'nautus', 'agents', `@${scriptName}.js`)
        : join(process.cwd(), 'nautus', 'scripts', `@${scriptName}.js`);

    // Dynamic import for user scripts
    const scriptModule = await import(scriptPath);
    const script = scriptModule.default || scriptModule;

    const error = createError(exitfunc);
    const exit = exitfunc;

    const nodeBinBound = (command: string, args: string[] = [], silent: boolean = false) => 
        nodeBin(command, args, silent, error);

    await script(cmd, getOS, info, warn, error, exit, runScript, spwn, {
        chalk,
        fse: await import('fs-extra'),
        fs,
        path: await import('path'),
        axios
    }, nodeBinBound);
}
