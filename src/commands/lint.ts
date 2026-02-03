import chalk from 'chalk';
import isProjectInitialized from '../lib/isProjectInitialized.js';

async function lintCommand(args: string[]): Promise<void> {
    if (!isProjectInitialized()) {
        console.log(chalk.red('This command require a nautus project. Initialize it using ' + chalk.cyan('nautus create') + '!'));
        return;
    }
    
    if (args.join(' ').includes('--help')) {
        console.log('This command can help you lint your code. To configure it take a look at ./nautus/lint.yaml. To run use nautus lint [--fix]');
    } else {
        const cmdTankEngine = (await import('../lib/cmdTankEngine.js')).default;
        await cmdTankEngine('lint.yaml', args.join(' ').includes('--fix'), 'main');
        console.log(chalk.green('Successfully linted ' + (args.join(' ').includes('--fix') ? '& fixed ' : '') + ' your code!'));
    }
}

export default [lintCommand, 'lint [--help] [--fix]', 'Lints your code'] as const;
