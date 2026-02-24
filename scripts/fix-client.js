const fs = require('fs');
const path = require('path');

function fixUseClient(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixUseClient(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');

            // If the file contains 'use client', ensure it's at the very top
            if (content.includes("'use client'") || content.includes('"use client"')) {
                // remove all uses of 'use client'
                content = content.replace(/'use client';?\n?/g, '');
                content = content.replace(/"use client";?\n?/g, '');

                // add it to the very top
                content = "'use client';\n" + content;
                fs.writeFileSync(fullPath, content);
                console.log(`Fixed use client in ${fullPath}`);
            }
        }
    }
}

fixUseClient(path.join(__dirname, '../src/app'));
// and components
fixUseClient(path.join(__dirname, '../src/components'));
