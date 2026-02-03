import chalk from 'chalk';
import { removeSync } from 'fs-extra';
import { join } from 'path';
import isProjectInitialized from '../lib/isProjectInitialized.js';

async function deleteCommand(args: string[]): Promise<void> {
    if (!isProjectInitialized()) {
        console.log(chalk.red('Error: Directory isn\'t a project. Please use nautus create first!'));
        return;
    }

    removeSync(join(process.cwd(), 'nautus'));

    console.log(chalk.green('Deleted Nautus project successfully'));
}

export default [deleteCommand, 'delete', 'Deletes a nautus project in the current directory (can be in use)'] as const;
