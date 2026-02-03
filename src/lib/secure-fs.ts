import * as fse from 'fs-extra';
import { select } from './prompts.js';

// Secure file system wrapper that prompts before overwriting files
const fs = {
    ...fse
};

// Override writeFile to prompt before overwriting
const originalWriteFile = fse.writeFile;
fs.writeFile = async (filePath: string, ...args: any[]): Promise<void> => {
    if (fse.existsSync(filePath as string)) {
        const answer = await select(
            `The generator wants to overwrite the file ${filePath.replace(process.cwd(), '')}`,
            [
                'Overwrite',
                'Skip',
                `Write into ${filePath.replace(process.cwd(), '')}.new`
            ]
        );
        
        if (answer === 'Overwrite') {
            return originalWriteFile(filePath, ...args);
        }
        if (answer === 'Skip') {
            return;
        }
        if (answer === `Write into ${filePath.replace(process.cwd(), '')}.new`) {
            return originalWriteFile(filePath + '.new', ...args);
        }
    } else {
        return originalWriteFile(filePath, ...args);
    }
};

// Override writeJSON to prompt before overwriting
const originalWriteJSON = fse.writeJSON;
fs.writeJSON = async (filePath: string, ...args: any[]): Promise<void> => {
    if (fse.existsSync(filePath)) {
        const answer = await select(
            `The generator wants to overwrite the file ${filePath.replace(process.cwd(), '')}`,
            [
                'Overwrite',
                'Skip',
                `Write into ${filePath.replace(process.cwd(), '')}.new`
            ]
        );
        
        if (answer === 'Overwrite') {
            return originalWriteJSON(filePath, ...args);
        }
        if (answer === 'Skip') {
            return;
        }
        if (answer === `Write into ${filePath.replace(process.cwd(), '')}.new`) {
            return originalWriteJSON(filePath + '.new', ...args);
        }
    } else {
        return originalWriteJSON(filePath, ...args);
    }
};

// Override writeJson to prompt before overwriting
const originalWriteJson = fse.writeJson;
fs.writeJson = async (filePath: string, ...args: any[]): Promise<void> => {
    if (fse.existsSync(filePath)) {
        const answer = await select(
            `The generator wants to overwrite the file ${filePath.replace(process.cwd(), '')}`,
            [
                'Overwrite',
                'Skip',
                `Write into ${filePath.replace(process.cwd(), '')}.new`
            ]
        );
        
        if (answer === 'Overwrite') {
            return originalWriteJson(filePath, ...args);
        }
        if (answer === 'Skip') {
            return;
        }
        if (answer === `Write into ${filePath.replace(process.cwd(), '')}.new`) {
            return originalWriteJson(filePath + '.new', ...args);
        }
    } else {
        return originalWriteJson(filePath, ...args);
    }
};

export default fs;
