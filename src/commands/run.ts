import chalk from 'chalk';
import executeScript from '../lib/executeScript.js';
import isProjectInitialized from '../lib/isProjectInitialized.js';

async function runCommand(args: string[]): Promise<void> {
    if (!isProjectInitialized()) {
        console.log(chalk.red('This command require a nautus project. Initialize it using ' + chalk.cyan('nautus create') + '!'));
        return;
    }

    if (args.join(' ').includes('--help')) {
        console.log('This command will run your code.');
        console.log('To define how to run your code, please edit ' + chalk.cyan('./nautus/scripts/@Run.js'));
    } else {
        const agentEngine = await import('../lib/agentEngine.js');
        await executeScript('Prep');
        agentEngine.default.runAll();
        let edr = false;
        await executeScript('Run', (async (runExitCode: number) => {
            edr = true;
            await executeScript('Cleanup', ((code: number) => {
                if (code !== 0) process.exit(code);
            }) as any);
            process.exit(runExitCode);
        }) as any);
        if (!edr) await executeScript('Cleanup');
        process.exit(); // Make sure agents aren't running anymore
    }
}

export default [runCommand, 'run [--help]', 'Runs your code'] as const;
