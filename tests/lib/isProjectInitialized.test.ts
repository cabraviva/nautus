import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import isProjectInitialized from '../../src/lib/isProjectInitialized.js';

describe('isProjectInitialized', () => {
    const testDir = join(process.cwd(), 'test-project-check');
    const nautusDir = join(testDir, 'nautus');
    
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
        process.chdir(join(testDir, '..'));
        
        // Clean up test directory
        if (existsSync(testDir)) {
            rmSync(testDir, { recursive: true, force: true });
        }
    });
    
    it('should return false when nautus directory does not exist', () => {
        expect(isProjectInitialized()).toBe(false);
    });
    
    it('should return true when nautus directory exists', () => {
        mkdirSync(nautusDir);
        expect(isProjectInitialized()).toBe(true);
    });
});
