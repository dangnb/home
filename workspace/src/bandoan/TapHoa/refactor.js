const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'bin' || file === 'obj' || file === 'node_modules' || file === '.git' || file === '.angular') continue;
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            filelist = walkSync(filepath, filelist);
        } else {
            filelist.push(filepath);
        }
    }
    return filelist;
};

const csFiles = walkSync('.').filter(f => f.endsWith('.cs'));

for (const file of csFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 1. Domain Entities 'public int Id { get; private set; }' -> 'public Guid Id { get; private set; } = Guid.CreateVersion7();'
    const idRegex = /public int Id \{ get; private set; \}/g;
    if (idRegex.test(content)) {
        content = content.replace(idRegex, 'public Guid Id { get; private set; } = Guid.CreateVersion7();');
        changed = true;
    }

    // 2. Change all foreign key properties from int to Guid
    const fkProps = ['CompanyId', 'ProductId', 'StoreId', 'CategoryId', 'TransactionId', 'RoleId', 'UserId'];
    for (const fk of fkProps) {
        // public int XXXId
        const propRegex = new RegExp(`public int ${fk}`, 'g');
        if (propRegex.test(content)) {
            content = content.replace(propRegex, `public Guid ${fk}`);
            changed = true;
        }

        // Constructor parameters: int XXXId -> Guid XXXId (also handles int xxxId)
        const lowerFk = fk.charAt(0).toLowerCase() + fk.slice(1);
        const paramRegex = new RegExp(`int ${lowerFk}(?=[,\\)\\s=])`, 'g');
        if (paramRegex.test(content)) {
            content = content.replace(paramRegex, `Guid ${lowerFk}`);
            changed = true;
        }

        // Also if we have int?
        const paramNullableRegex = new RegExp(`int\\? ${lowerFk}(?=[,\\)\\s=])`, 'g');
        if (paramNullableRegex.test(content)) {
            content = content.replace(paramNullableRegex, `Guid? ${lowerFk}`);
            changed = true;
        }
    }

    // Replace generic GetByIdAsync(int id, ...) -> GetByIdAsync(Guid id, ...)
    const methodIntIdRegex = /(Get\w+Async)\s*\(\s*int\s+id/g;
    if (methodIntIdRegex.test(content)) {
        content = content.replace(methodIntIdRegex, '$1(Guid id');
        changed = true;
    }
    const methodIntProductIdRegex = /(GetByProductId\w*Async)\s*\(\s*int\s+productId/g;
    if (methodIntProductIdRegex.test(content)) {
        content = content.replace(methodIntProductIdRegex, '$1(Guid productId');
        changed = true;
    }
    const methodIntStoreIdRegex = /,\s*int\s+storeId/g;
    if (methodIntStoreIdRegex.test(content)) {
        content = content.replace(methodIntStoreIdRegex, ', Guid storeId');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated: ' + file);
    }
}
