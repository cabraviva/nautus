import { existsSync } from 'fs';
import { join } from 'path';

export default function isProjectInitialized(): boolean {
    return existsSync(join(process.cwd(), 'nautus'));
}
