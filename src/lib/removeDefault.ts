import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs-extra';
import chalk from 'chalk';

export default function removeDefault(scriptName: string): void {
    try {
        let content = readFileSync(join(process.cwd(), 'nautus', 'scripts', `@${scriptName}.js`), 'utf8');
        content = content.replace(/return error\('No (.*?) script defined, please edit \.\/nautus\/scripts\/@(\w*?)\.js'\)/, '');
        writeFileSync(join(process.cwd(), 'nautus', 'scripts', `@${scriptName}.js`), content);
    } catch (err) {
        console.log(chalk.red('Error while removing default in script:'));
        throw err;
    }
}
