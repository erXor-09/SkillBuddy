const fs = require('fs');
const path = require('path');

const dir = './frontend/src';

const replacements = [
    { regex: /bg-\[#F9FAFB\]/g, replacement: 'bg-page' },
    { regex: /bg-white/g, replacement: 'bg-surface' },
    { regex: /border-gray-200/g, replacement: 'border-ui' },
    { regex: /border-gray-100/g, replacement: 'border-ui-light' },
    { regex: /text-gray-900/g, replacement: 'text-primary' },
    { regex: /text-gray-800/g, replacement: 'text-primary' },
    { regex: /text-gray-700/g, replacement: 'text-primary' },
    { regex: /text-gray-600/g, replacement: 'text-secondary' },
    { regex: /text-gray-500/g, replacement: 'text-secondary' },
    { regex: /text-gray-400/g, replacement: 'text-muted-clr' },
    { regex: /bg-gray-50/g, replacement: 'bg-page' },
    { regex: /bg-gray-100/g, replacement: 'bg-surface-2' },
];

function walk(currentDir) {
    fs.readdirSync(currentDir).forEach(file => {
        const fullPath = path.join(currentDir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            for (const { regex, replacement } of replacements) {
                if (regex.test(content)) {
                    content = content.replace(regex, replacement);
                    modified = true;
                }
            }
            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    });
}

walk(dir);
