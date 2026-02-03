import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, rmSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import detectFrameworks from '../../src/lib/detectFrameworks.js';

describe('detectFrameworks', () => {
    const testDir = join(process.cwd(), 'test-detect-frameworks');
    const originalCwd = process.cwd();
    
    beforeEach(() => {
        // Clean up any existing test directory
        if (existsSync(testDir)) {
            rmSync(testDir, { recursive: true, force: true });
        }
        mkdirSync(testDir, { recursive: true });
        
        // Change to test directory
        process.chdir(testDir);
    });
    
    afterEach(() => {
        // Change back to original directory
        process.chdir(originalCwd);
        
        // Clean up test directory
        if (existsSync(testDir)) {
            rmSync(testDir, { recursive: true, force: true });
        }
    });
    
    it('should detect node and npm when package.json exists', () => {
        writeFileSync('package.json', '{}');
        const frameworks = detectFrameworks();
        expect(frameworks).toContain('node');
        expect(frameworks).toContain('npm');
    });
    
    it('should detect TypeScript when .ts files exist', () => {
        writeFileSync('test.ts', 'const x: number = 1;');
        const frameworks = detectFrameworks();
        expect(frameworks).toContain('ts');
    });
    
    it('should detect JavaScript when .js files exist', () => {
        writeFileSync('test.js', 'const x = 1;');
        const frameworks = detectFrameworks();
        expect(frameworks).toContain('js');
    });
    
    it('should detect HTML when .html files exist', () => {
        writeFileSync('index.html', '<html></html>');
        const frameworks = detectFrameworks();
        expect(frameworks).toContain('html');
    });
    
    it('should return empty array when no frameworks are detected', () => {
        const frameworks = detectFrameworks();
        expect(frameworks).toEqual([]);
    });
});
