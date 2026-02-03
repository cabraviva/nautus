import { join } from 'path';
import * as fse from 'fs-extra';
import chalk from 'chalk';

const { readFileSync, writeFileSync } = fse;

export default function mergeScript(scriptName: string, code: string): void {
    try {
        let content = readFileSync(join(process.cwd(), 'nautus', 'scripts', `@${scriptName}.js`), 'utf8');
        content = content.replace(/\/\* PLEASE DON'T DELETE OR MODIFY THIS COMMENT.*?\*\//, `/* PLEASE DON'T DELETE OR MODIFY THIS COMMENT, IT WILL BE USED TO INJECT SCRIPTS BY KELP */
// Injected by kelp:
${code}
`);
        writeFileSync(join(process.cwd(), 'nautus', 'scripts', `@${scriptName}.js`), content);
    } catch (err) {
        console.log(chalk.red('Error while merging script:'));
        throw err;
    }
}
