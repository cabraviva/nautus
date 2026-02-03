import chalk from 'chalk';
import isProjectInitialized from '../lib/isProjectInitialized.js';
import initializeProject from '../lib/initializeProject.js';

async function createCommand(args: string[]): Promise<void> {
    if (isProjectInitialized()) {
        console.log(chalk.red('Error: Directory is already a project. Please use nautus delete first!'));
        return;
    }

    await initializeProject();

    console.log(chalk.green(`Project created successfully. Use ${chalk.cyan('nautus')} to get recommendations on what to do next!`));
}

export default [createCommand, 'create', 'Creates a nautus project in the current directory (can be in use)'] as const;
