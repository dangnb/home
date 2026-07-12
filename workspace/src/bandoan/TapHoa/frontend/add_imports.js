const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processComponent(tsPath) {
    if (!tsPath.endsWith('.component.ts')) return;
    
    let tsContent = fs.readFileSync(tsPath, 'utf8');
    const htmlPath = tsPath.replace('.component.ts', '.component.html');
    
    if (!fs.existsSync(htmlPath)) return;
    
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Check if translation is used in HTML
    if (!htmlContent.includes('| translate')) return;
    
    let modified = false;
    
    // Add import statement if not present
    if (!tsContent.includes('@ngx-translate/core')) {
        // Insert after the last import statement
        const importMatch = [...tsContent.matchAll(/^import .*$/gm)];
        if (importMatch.length > 0) {
            const lastImport = importMatch[importMatch.length - 1];
            const insertPos = lastImport.index + lastImport[0].length;
            tsContent = tsContent.substring(0, insertPos) + "\nimport { TranslatePipe } from '@ngx-translate/core';" + tsContent.substring(insertPos);
            modified = true;
        } else {
            tsContent = "import { TranslatePipe } from '@ngx-translate/core';\n" + tsContent;
            modified = true;
        }
    } else if (tsContent.includes('@ngx-translate/core') && !tsContent.includes('TranslatePipe') && !tsContent.includes('TranslateModule')) {
        // It imports from ngx-translate but not TranslatePipe/Module? This is rare. We can just replace it.
        tsContent = tsContent.replace(/import {([^}]*)} from '@ngx-translate\/core';/, (m, p1) => {
            return `import {${p1}, TranslatePipe} from '@ngx-translate/core';`;
        });
        modified = true;
    }
    
    // Add to imports array
    const importsRegex = /imports:\s*\[([\s\S]*?)\]/;
    if (importsRegex.test(tsContent)) {
        const match = tsContent.match(importsRegex);
        const currentImports = match[1];
        if (!currentImports.includes('TranslatePipe') && !currentImports.includes('TranslateModule')) {
            const newImports = currentImports.trim() ? `${currentImports.trim()}, TranslatePipe` : `TranslatePipe`;
            tsContent = tsContent.replace(importsRegex, `imports: [${newImports}]`);
            modified = true;
        }
    }
    
    if (modified) {
        fs.writeFileSync(tsPath, tsContent, 'utf8');
        console.log(`Updated ${tsPath}`);
    }
}

walkDir(path.join(__dirname, 'src/app'), processComponent);
