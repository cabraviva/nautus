import chalk from 'chalk';

async function docsCommand(args: string[]): Promise<void> {
    console.log(chalk.red('The docs command is not supported in this version.'));
    console.log(chalk.yellow('jsdoc-to-markdown dependency was removed due to compatibility issues.'));
    console.log(chalk.cyan('Consider using TypeDoc or JSDoc CLI directly for documentation generation.'));
}

export default [docsCommand, 'docs', 'Generates markdown docs (not supported in this version)'] as const;
