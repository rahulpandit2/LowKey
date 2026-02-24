const fs = require('fs');
const path = require('path');

function replaceConstantsInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceConstantsInDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            if (content.includes('console.log(') || content.includes('console.error(') || content.includes('console.warn(')) {

                const srcAppPath = path.join(__dirname, '../src/app');
                const depth = fullPath.replace(srcAppPath, '').split(path.sep).length - 2;
                // if depth <= 0, we are in app root. But logger is in lib/logger.ts
                const relativePath = depth <= 0 ? '@/lib/logger' : '@/lib/logger';
                // Wait, using @/lib/logger is even better since tsconfig uses @ as src!

                if (!content.includes(`import { logger }`)) {
                    const importStatement = `import { logger } from '@/lib/logger';\n`;
                    // Insert after standard imports or at top
                    content = importStatement + content;
                }

                content = content.replace(/console\.log\(/g, 'logger.info(');
                content = content.replace(/console\.error\(/g, 'logger.error(');
                content = content.replace(/console\.warn\(/g, 'logger.warn(');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

replaceConstantsInDir(path.join(__dirname, '../src/app'));
