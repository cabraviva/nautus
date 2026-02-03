import { parse } from 'yaml';
import { join } from 'path';
import { readFileSync, existsSync, readdirSync } from 'fs-extra';
import chalk from 'chalk';
import chokidar from 'chokidar';
import { minimatch } from 'minimatch';
import { spawn } from 'child_process';
import { platform } from 'os';
import executeScript from './executeScript.js';

interface AgentWatches {
    tanks?: string[];
}

interface Agent {
    watches?: AgentWatches;
}

interface AgentsYAML {
    agents: Record<string, Agent>;
}

interface Tank {
    id: string;
    paths: {
        include: string[];
        exclude: string[];
    };
}

const getYML = (): Record<string, Agent> => {
    const yml = parse(readFileSync(join(process.cwd(), 'nautus', 'agents', 'agents.yaml'), 'utf8')) as AgentsYAML;
    return yml.agents;
};

const engine = async (agentName: string): Promise<void> => {
    if (!existsSync(join(process.cwd(), 'nautus', 'agents', `@${agentName}.js`))) {
        console.log(chalk.red(`[ERROR] Agent ${agentName} not found! Create it using nautus agent create ${agentName}`));
        process.exit(1);
    }

    const tanks = ((getYML()[agentName] || { watches: { tanks: ['main'] } }).watches || { tanks: ['main'] }).tanks || ['main'];

    // Tank existence
    for (const tank of tanks) {
        // Check if tank exists
        const tanksData: Tank[] = JSON.parse(readFileSync(join(process.cwd(), 'nautus', '.internal', 'tanks.json'), 'utf8'));
        if (!tanksData.map(e => e.id).includes(tank)) {
            console.log(chalk.yellow(`[WARN] Tank ${tank} doesn't exist! Skipping watch process for this tank!`));
            continue;
        }
    }

    function getIncluded(t: string): string[] {
        const tanksData: Tank[] = JSON.parse(readFileSync(join(process.cwd(), 'nautus', '.internal', 'tanks.json'), 'utf8'));
        return tanksData.filter(e => e.id === t)[0].paths.include;
    }

    function getExcluded(t: string): string[] {
        const tanksData: Tank[] = JSON.parse(readFileSync(join(process.cwd(), 'nautus', '.internal', 'tanks.json'), 'utf8'));
        return tanksData.filter(e => e.id === t)[0].paths.exclude;
    }

    // Watch
    function isPathInTank($path: string, tank: string): boolean {
        const include = getIncluded(tank);
        const exclude = getExcluded(tank);
        $path = $path.replace(process.cwd(), '');
        $path = $path.replace(/\\/g, '/');
        if ($path.startsWith('nautus/')) return false;
        if ($path.startsWith('/')) $path = $path.substring(1);
        let oi = false;
        for (const i of include) {
            if (minimatch($path, i)) oi = true;
        }
        for (const x of exclude) {
            if (minimatch($path, x)) return false;
        }
        return oi;
    }

    const watcher = chokidar.watch(process.cwd(), {
        ignored: /^nautus\//, // ignore nautus dir
        persistent: true,
        ignoreInitial: true // ignore initial add events
    });

    let operating = false;

    const runAgent = async ($path: string): Promise<void> => {
        await executeScript(agentName, process.exit as any, true);
    };

    const rAgent = async ($path: string): Promise<void> => {
        // Check if operating
        if (!operating) {
            // Only run when not operating atm
            operating = true;
            // Check if agent is responsible for $path
            for (const tank of tanks) {
                if (isPathInTank($path, tank)) {
                    // Found, stop checking
                    await runAgent($path);
                    break;
                }
            }
            operating = false;
        }
    };

    watcher
        .on('add', $path => rAgent($path))
        .on('change', $path => rAgent($path))
        .on('unlink', $path => rAgent($path))
        .on('unlinkDir', $path => rAgent($path));

    console.log(chalk.gray(`[INFO] Agent ${agentName} is running in background and watches tanks ${tanks.join(', ')}`));
};

engine.runAll = async (): Promise<void> => {
    const yml = getYML();
    const agents: Promise<void>[] = [];

    for (const name of Object.keys(yml)) {
        const agent = yml[name];
        if (!existsSync(join(process.cwd(), 'nautus', 'agents', `@${name}.js`))) {
            console.log(chalk.red(`[ERROR] Agent ${name} not found! Create it using nautus agent create ${name}`));
            process.exit(1);
        }
        agents.push(engine(name));
    }

    const bgAgents = readdirSync(join(process.cwd(), 'nautus', 'agents')).filter(f => f.startsWith('@') && (f.endsWith('.sh') || f.endsWith('.cmd') || f.endsWith('.bat')));
    const bgAgentsWin = bgAgents.filter(f => f.endsWith('.bat') || f.endsWith('.cmd'));
    const bgAgentsTux = bgAgents.filter(f => f.endsWith('.sh'));

    for (const bgAgent of platform() === 'win32' ? bgAgentsWin : bgAgentsTux) {
        // Check if stdout should be enabled
        const printStdout = readFileSync(join(process.cwd(), 'nautus', 'agents', bgAgent), 'utf8').includes('$NAUTUS_ENABLE_STDOUT');
        if (platform() === 'win32') {
            // Windows
            const prcss = spawn('cmd.exe', ['/c', join(process.cwd(), 'nautus', 'agents', bgAgent)], {
                shell: true,
                env: process.env,
                cwd: process.cwd()
            });

            if (printStdout) {
                prcss.stdout.on('data', (data) => {
                    process.stdout.write(data.toString());
                });

                prcss.stderr.on('data', (data) => {
                    process.stderr.write(data.toString());
                });

                process.stdin.pipe(prcss.stdin);
            }

            prcss.on('exit', (code) => {
                if (code === 0) return;
                console.log(chalk.red('Error: Background agent exited with code ' + code + '. Please add "echo $NAUTUS_ENABLE_STDOUT" to your agent to see the reason!'));
            });
        } else {
            // Linux / MacOS
            const prcss = spawn('sh', [join(process.cwd(), 'nautus', 'agents', bgAgent)], {
                shell: true,
                env: process.env,
                cwd: process.cwd()
            });

            if (printStdout) {
                prcss.stdout.on('data', (data) => {
                    process.stdout.write(data.toString());
                });

                prcss.stderr.on('data', (data) => {
                    process.stderr.write(data.toString());
                });

                process.stdin.pipe(prcss.stdin);
            }

            prcss.on('exit', (code) => {
                if (code === 0) return;
                console.log(chalk.red('Error: Background agent exited with code ' + code + '. Please add "echo $NAUTUS_ENABLE_STDOUT" to your agent to see the reason!'));
            });
        }
    }

    await Promise.all(agents);
};

export default engine;
