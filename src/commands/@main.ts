import chalk from 'chalk';
import isProjectInitialized from '../lib/isProjectInitialized.js';
import helpCommand from './help.js';

async function mainCommand(args: string[]): Promise<void> {
    console.log(
        chalk.cyan("                                                             ") + chalk.redBright("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n") +
        chalk.cyan("                                                             ") + chalk.redBright("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢷⣤⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n") +
        chalk.cyan("                                                             ") + chalk.redBright("⠀⠀⠀⠀⠀⠀⠀⢰⡗⠀⠀⢠⡀⣠⡄⠀⠈⣿⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀\n") +
        chalk.cyan("    ███▄    █  ▄▄▄      █    ██ ▄▄▄█████▓ █    ██   ██████   ") + chalk.redBright("⠀⠀⠀⠸⢶⣤⣄⢿⡇⠀⠀⠈⣿⠏⠀⠀⠀⣿⡀⠀⣴⠟⠁⠀⠀⠀⠀⠀⠀⠀\n") +
        chalk.cyan("    ██ ▀█   █ ▒████▄    ██  ▓██▒▓  ██▒ ▓▒ ██  ▓██▒▒██    ▒   ") + chalk.redBright("⠀⠀⠀⠀⠀⠀⠙⠻⣿⣦⡀⢸⡏⠀⠀⠀⠀⢹⣇⣼⣏⣀⣀⣠⣤⡦⠀⠀⠀⠀\n") +
        chalk.cyan("   ▓██  ▀█ ██▒▒██  ▀█▄ ▓██  ▒██░▒ ▓██░ ▒░▓██  ▒██░░ ▓██▄     ") + chalk.redBright("⠀⠀⠀⢰⣶⡄⠀⠀⠘⢿⣿⣾⣧⠀⠀⠀⠀⣼⣿⠟⠉⠉⠉⢉⡀⠀⠀⠀⠀⠀\n") +
        chalk.cyan("   ▓██▒  ▐▌██▒░██▄▄▄▄██▓▓█  ░██░░ ▓██▓ ░ ▓▓█  ░██░  ▒   ██▒  ") + chalk.redBright("⠀⠘⠷⠶⢿⣿⡄⠀⠀⠀⠙⠿⣿⣦⣄⡀⣼⣿⠃⠀⠰⣦⣀⣸⡇⠀⠀⠀⠀⠀\n") +
        chalk.cyan("   ▒██░   ▓██░▒▓█   ▓██▒▒█████▓   ▒██▒ ░ ▒▒█████▓ ▒██████▒▒  ") + chalk.redBright("⠀⠀⠀⠀⠈⣿⣷⠀⠀⠀⢀⠀⠈⠛⠿⣿⣿⡏⠀⠀⠀⠈⣹⡟⠀⠀⣀⣤⣄⠀\n") +
        chalk.cyan("   ░ ▒░   ▒ ▒ ░▒▒   ▓▒█░▒▓▒ ▒ ▒   ▒ ░░   ░▒▓▒ ▒ ▒ ▒ ▒▓▒ ▒ ░  ") + chalk.redBright("⠀⠀⢠⡶⠟⠻⣿⣧⡀⣰⠏⠀⠀⠀⠀⢸⣿⡇⠀⣀⣠⣾⣯⣶⣶⣾⡏⠁⠀⠀\n") +
        chalk.cyan("   ░ ░░   ░ ▒░░ ░   ▒▒ ░░▒░ ░ ░     ░    ░░▒░ ░ ░ ░ ░▒  ░ ░  ") + chalk.redBright("⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣀⠀⠀⠀⠀⠸⣿⣷⣿⣿⣿⣯⣉⡉⠉⠙⢷⡄⠀⠀\n") +
        chalk.cyan("   ░   ░ ░   ░   ▒   ░░░ ░ ░   ░       ░░░ ░ ░ ░  ░  ░       ") + chalk.redBright("⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣷⣦⣄⣠⣾⣿⠋⠀⠀⠀⠈⣩⡿⠷⣤⠀⠀⠀⠀\n") +
        chalk.cyan("           ░       ░     ░                 ░           ░     ") + chalk.redBright("⠀⠀⠀⠀⠀⠀⠶⠶⣶⡶⠟⠛⠛⢿⣿⡿⠁⠀⠀⠀⠀⣰⡟⠁⠀⠀⠀⠀⠀⠀\n") +
        chalk.cyan("     Your one & only ultimate software development tool      ") + chalk.redBright("⠀⠀⠀⠀⠀⠀⠀⠀⠹⠇ ⠀⠀ ⣿⣿⠀⠀⠀⠀⠀⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀\n") +
        chalk.cyan("                                                             ") + chalk.redBright("⠀⠀⠀⠀⠀⠀⠀⠀  ⠀⠀⠀⣼⣿⠃⠀⠀⠀⠀⠀  ⠀⠀⠀⠀⠀⠀⠀\n") +
        chalk.cyan("                                                             ") + chalk.redBright("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n")
    );
    console.log('');
    if (isProjectInitialized()) {
        console.log(chalk.gray(`Use ${chalk.italic('nautus help')} to get a list of commands`));
        console.log('\n' + chalk.bgCyan(chalk.white('                                          What\'s next                                          ')));
        // TODO: What's next
        console.log('- Check out the nautus/scripts folder to define run & build scripts');
        console.log('- Run your code using ' + chalk.cyan('nautus run'));
        console.log('- Create boilerplate code using ' + chalk.cyan('nautus kelp'));
        console.log('- Add additional library / framework / runtime support using ' + chalk.cyan('nautus use'));
        console.log('- Separate your code using ' + chalk.cyan('nautus tank'));
        console.log('- Check out the README on GitHub: ' + chalk.cyan('https://github.com/greencoder001/nautus#readme'));
    } else {
        await helpCommand[0](args);
    }
}

export default [mainCommand, '', 'Main Menu'] as const;
