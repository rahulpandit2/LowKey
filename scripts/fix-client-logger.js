const fs = require('fs');
const path = require('path');

function fixClientLogger(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixClientLogger(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');

            if (content.includes("'use client'") || content.includes('"use client"')) {
                if (content.includes("import { logger } from '@/lib/logger';")) {
                    content = content.replace("import { logger } from '@/lib/logger';", "import { logger } from '@/lib/client-logger';");
                    fs.writeFileSync(fullPath, content);
                    console.log(`Fixed client logger in ${fullPath}`);
                }
            }
        }
    }
}

fixClientLogger(path.join(__dirname, '../src/app'));
fixClientLogger(path.join(__dirname, '../src/components'));
