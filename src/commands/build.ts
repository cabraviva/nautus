import chalk from 'chalk';
import executeScript from '../lib/executeScript.js';
import isProjectInitialized from '../lib/isProjectInitialized.js';

async function buildCommand(args: string[]): Promise<void> {
    if (!isProjectInitialized()) {
        console.log(chalk.red('This command require a nautus project. Initialize it using ' + chalk.cyan('nautus create') + '!'));
        return;
    }

    if (args.join(' ').includes('--help')) {
        console.log('This command will build your code.');
        console.log('To define how to build your code, please edit ' + chalk.cyan('./nautus/scripts/@Build.js'));
    } else {
        await executeScript('Build');
    }
}

export default [buildCommand, 'build [--help]', 'Builds your code'] as const;
