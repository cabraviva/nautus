// Nautus Script Executor
// This file is used by the Rust version of Nautus to execute JavaScript scripts
// with the same API as the original JavaScript version

const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');

const scriptPath = process.argv[2];
const isAgent = process.argv[3] === 'true';

if (!scriptPath) {
    console.error('Error: No script path provided');
    process.exit(1);
}

if (!fs.existsSync(scriptPath)) {
    console.error(`Error: Script not found: ${scriptPath}`);
    process.exit(1);
}

// Load the script
let scriptFunc;
try {
    scriptFunc = require(path.resolve(scriptPath));
} catch (err) {
    console.error(`Error loading script: ${err.message}`);
    process.exit(1);
}

// Define the API functions
const cmd = (command) => {
    return new Promise((resolve, reject) => {
        if (typeof command !== 'string') throw new TypeError('command must be a string');
        exec('cd ' + process.cwd() + ' && ' + command, (error, stdout, stderr) => {
            if (error) {
                return reject([error.code, (stdout || '') + (stderr || '')]);
            }
            resolve([0, (stdout || '') + (stderr || '')]);
        });
    });
};

const os = () => {
    const platform = require('os').platform();
    if (platform === 'darwin') return 'mac';
    if (platform === 'win32') return 'windows';
    if (platform === 'linux') return 'linux';
    return 'unknown';
};

const info = (...what) => {
    console.log(...what);
};

const warn = (...what) => {
    console.warn('\x1b[33m', ...what, '\x1b[0m');
};

const error = (...what) => {
    console.error('\x1b[31mError:\x1b[0m');
    console.error(...what);
    process.exit(1);
};

const exit = (code) => {
    process.exit(code || 0);
};

const spwn = (comd, args = [], silent = false) => {
    return new Promise((resolve, reject) => {
        const prcss = spawn(comd, args, {
            cwd: process.cwd(),
            env: process.env,
            shell: true
        });

        if (!silent) {
            prcss.stdout.on('data', (data) => {
                process.stdout.write(data.toString());
            });
        }

        prcss.stderr.on('data', (data) => {
            process.stderr.write(data.toString());
        });

        prcss.on('exit', (code) => {
            resolve(code || 0);
        });

        process.stdin.pipe(prcss.stdin);
    });
};

async function findBinCommand(binCommand) {
    const nodeModulesDir = path.join(process.cwd(), 'node_modules');
    if (!fs.existsSync(nodeModulesDir)) return null;
    
    const packageJsonFiles = fs.readdirSync(nodeModulesDir);

    for (const packageJsonFile of packageJsonFiles) {
        const packageJsonPath = path.join(nodeModulesDir, packageJsonFile, 'package.json');

        if (fs.existsSync(packageJsonPath)) {
            try {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

                if (packageJson.bin && packageJson.bin[binCommand]) {
                    const binaryPath = path.join(nodeModulesDir, packageJsonFile, packageJson.bin[binCommand]);
                    return binaryPath;
                }
            } catch (err) {
                // Skip invalid package.json files
            }
        }
    }

    return null;
}

const nodeBin = async (command, args = [], silent = false) => {
    const binCmdPath = await findBinCommand(command);
    if (!binCmdPath) {
        error(`${command} not found. Make sure to install the right package locally!`);
        return 1;
    }
    
    if (!(binCmdPath.endsWith('.js') || binCmdPath.endsWith('.mjs'))) {
        return await spwn('cmd', ['/c', binCmdPath, ...args], silent);
    } else {
        return await spwn('node', [binCmdPath, ...args], silent);
    }
};

const runScript = async (scriptName) => {
    // Recursively run another nautus script
    const scriptPath = path.resolve(process.cwd(), 'nautus', 'scripts', `@${scriptName}.js`);
    if (!fs.existsSync(scriptPath)) {
        warn(`Script @${scriptName}.js not found`);
        return;
    }
    const script = require(scriptPath);
    await script(cmd, os, info, warn, error, exit, runScript, spwn, modules, nodeBin);
};

const modules = {
    get chalk() {
        try {
            return require('chalk');
        } catch (e) {
            console.warn('Warning: chalk module not found. Install with: npm install chalk');
            return {};
        }
    },
    get fse() {
        try {
            return require('fs-extra');
        } catch (e) {
            console.warn('Warning: fs-extra module not found. Install with: npm install fs-extra');
            return fs;
        }
    },
    fs: fs,
    path: path,
    get axios() {
        try {
            return require('axios');
        } catch (e) {
            console.warn('Warning: axios module not found. Install with: npm install axios');
            return null;
        }
    }
};

// Execute the script
(async () => {
    try {
        await scriptFunc(cmd, os, info, warn, error, exit, runScript, spwn, modules, nodeBin);
    } catch (err) {
        console.error('\x1b[31mError executing script:\x1b[0m');
        console.error(err);
        process.exit(1);
    }
})();
