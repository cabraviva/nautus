import chalk from 'chalk';
import executeScript from '../lib/executeScript.js';
import isProjectInitialized from '../lib/isProjectInitialized.js';

async function execCommand(args: string[]): Promise<void> {
    if (!isProjectInitialized()) {
        console.log(chalk.red('This command require a nautus project. Initialize it using ' + chalk.cyan('nautus create') + '!'));
        return;
    }
    
    if (typeof args[0] !== 'string' || args[0].length < 1) {
        console.log(chalk.red('Error: Please provide a script name'));
        console.log(chalk.cyan('Example: nautus exec Run'));
        process.exit(1);
    }

    await executeScript(args[0]);
}

export default [execCommand, 'exec <script>', 'Run specific script'] as const;
