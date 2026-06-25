const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'dist' || file === '.angular') continue;
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            filelist = walkSync(filepath, filelist);
        } else {
            filelist.push(filepath);
        }
    }
    return filelist;
};

const tsFiles = walkSync('src').filter(f => f.endsWith('.ts'));

for (const file of tsFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 1. Interfaces: id: number -> id: string; categoryId: number -> categoryId: string
    // e.g. "id: number" or "id?: number"
    const propRx = /\b(\w*id)\s*\??:\s*number/gi;
    if (propRx.test(content)) {
        content = content.replace(propRx, (match, p1) => {
            // we don't want to replace bounds like width: number, only *id: number
            if (p1.toLowerCase().endsWith('id')) {
                return match.replace('number', 'string');
            }
            return match;
        });
        changed = true;
    }

    // 2. Method params: (id: number) -> (id: string)
    // Only target common names like id, categoryId, productId
    const paramRx = /\b(\w*id)\s*:\s*number\b/gi;
    if (paramRx.test(content)) {
        content = content.replace(paramRx, (match, p1) => {
            if (p1.toLowerCase().endsWith('id')) {
                return match.replace('number', 'string');
            }
            return match;
        });
        changed = true;
    }

    // 3. Routing `+params['id']` -> `params['id']`
    if (content.includes("+this.route.snapshot.params['id']")) {
        content = content.replace(/\+this\.route\.snapshot\.params\['id'\]/g, "this.route.snapshot.params['id']");
        changed = true;
    }
    if (content.includes("+params['id']")) {
        content = content.replace(/\+params\['id'\]/g, "params['id']");
        changed = true;
    }
    if (content.includes("Number(params['id'])")) {
        content = content.replace(/Number\(params\['id'\]\)/g, "params['id']");
        changed = true;
    }
    if (content.includes("parseInt(")) {
        // e.g. parseInt(this.route.snapshot.paramMap.get('id')!)
        // we should just leave it string if it's assigned to a string. But typescript might complain so let's try generic replace
        // actually this is harder.
    }

    // Replace 0 with empty string in default models
    if (file.includes('models')) {
        content = content.replace(/id: 0/g, "id: ''");
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed TS file ' + file);
    }
}
