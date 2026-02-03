import { join, sep } from 'path';
import * as fse from 'fs-extra';
import { minimatch } from 'minimatch';

const { readdirSync } = fse;

function findFilesRecursive(): string[] {
    const result: string[] = [];

    function traverse(currentPath: string): void {
        const files = readdirSync(currentPath, { withFileTypes: true });
        for (const file of files) {
            if (file.isFile()) {
                result.push(join(currentPath, file.name).replace(process.cwd() + sep, ''));
            } else if (file.isDirectory()) {
                traverse(join(currentPath, file.name));
            }
        }
    }

    traverse(process.cwd());
    return result;
}

function findFilesAndFoldersRecursive(): string[] {
    const result: string[] = [];

    function traverse(currentPath: string): void {
        const files = readdirSync(currentPath, { withFileTypes: true });
        for (const file of files) {
            const fullPath = join(currentPath, file.name).replace(process.cwd() + sep, '');
            if (file.isFile()) {
                result.push(fullPath);
            } else if (file.isDirectory()) {
                result.push(fullPath + '/');
                traverse(join(currentPath, file.name));
            }
        }
    }

    traverse(process.cwd());
    return result;
}

function engine($path: string, include: string[], exclude: string[]): boolean {
    $path = $path.replace(/\\/g, '/');
    if ($path.startsWith('nautus/')) return false;
    let oi = false;
    for (const i of include) {
        if (minimatch($path, i)) oi = true;
    }
    for (const x of exclude) {
        if (minimatch($path, x)) return false;
    }
    return oi;
}

export function resolveMinimum(include: string[], exclude: string[]): string[] {
    const files = readdirSync(process.cwd(), { withFileTypes: true });
    const names = files.map((file) => file.name);
    return names.filter(name => engine(name, include, exclude));
}

export function resolveFiles(include: string[], exclude: string[]): string[] {
    return findFilesRecursive().filter(name => engine(name, include, exclude));
}

export function resolveFilesPlusFolders(include: string[], exclude: string[]): string[] {
    return findFilesAndFoldersRecursive().filter(name => engine(name, include, exclude));
}
