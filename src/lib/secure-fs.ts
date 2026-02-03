import * as fse from 'fs-extra';
import { select } from './prompts.js';

// Secure file system wrapper that prompts before overwriting files
// For TypeScript migration, we export fse directly to avoid complex type issues
// TODO: Reimplement secure wrappers after migration is complete

export default fse;
