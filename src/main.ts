#!/usr/bin/env node

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const argv = process.argv.slice(2);
const cmd = argv[0] || '@main';
argv[0] = cmd;
const args = argv.slice(1);

// Read package.json for version
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));
const version = packageJson.version;

(async () => {
    const commandsDir = join(__dirname, 'commands');
    const registeredCMDs = readdirSync(commandsDir);
    
    for (const registeredCMD of registeredCMDs) {
        const cmdName = registeredCMD.substring(0, registeredCMD.length - 3);
        if (cmd.toLowerCase() === cmdName.toLowerCase()) {
            const commandModule = await import(join(commandsDir, registeredCMD));
            const com = commandModule.default[0];
            await com(args);
            try {
                const response = await axios.get('https://registry.npmjs.org/nautus');
                const newest = response.data['dist-tags'].latest;
                if (newest > version) {
                    console.log(chalk.yellow('[INFO] A newer version of nautus is available! Use ') + chalk.cyan('npm i nautus -g') + chalk.yellow(' to update!'));
                }
            } catch { }
            return;
        }
    }

    if (cmd.startsWith('@hook/')) {
        const hookName = cmd.substring(6);
        try {
            // deepcode ignore CodeInjection: We trust our users
            const hookModule = await import(`./hooks/${hookName}.js`);
            await hookModule.default();
        } catch (err) {
            console.log(chalk.yellow(`Warn: Hook ${hookName} not found!`));
            console.log(err);
        }
        return;
    }

    console.log(chalk.red(`Error: Command ${cmd} not found. Use ${chalk.cyan('nautus help')} for a list of commands!`));
})();
