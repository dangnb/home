const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'bin' || file === 'obj' || file === 'node_modules' || file === '.git') continue;
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            filelist = walkSync(filepath, filelist);
        } else {
            filelist.push(filepath);
        }
    }
    return filelist;
};

const csFiles = walkSync('TapHoa.Application').filter(f => f.endsWith('.cs'));

for (const file of csFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Change IRequest<int> to IRequest<Guid>
    if (content.includes('IRequest<int>')) {
        content = content.replace(/IRequest<int>/g, 'IRequest<Guid>');
        changed = true;
    }
    if (content.includes('IRequestHandler<CreateCategoryCommand, int>')) {
        content = content.replace(/IRequestHandler<(.*?), int>/g, 'IRequestHandler<$1, Guid>');
        changed = true;
    }
    if (content.includes('IRequestHandler<CreateProductCommand, int>')) {
        content = content.replace(/IRequestHandler<(.*?), int>/g, 'IRequestHandler<$1, Guid>');
        changed = true;
    }
    if (content.includes('IRequestHandler<CreateInboundTransactionCommand, int>')) {
        content = content.replace(/IRequestHandler<(.*?), int>/g, 'IRequestHandler<$1, Guid>');
        changed = true;
    }

    // Change 'public int Id' in Queries DTOs to 'public Guid Id'
    const propRegex = /public int Id \{ get;/g;
    if (propRegex.test(content)) {
        content = content.replace(propRegex, 'public Guid Id { get;');
        changed = true;
    }

    const commandIdEx = /public int \w+Id \{ get;/g;
    if (commandIdEx.test(content)) {
        content = content.replace(/public int (\w+Id)/g, 'public Guid $1');
        changed = true;
    }

    // CheckoutRetailOrderCommand: public int StoreId = 1; (invalid for Guid)
    if (content.includes('public Guid StoreId { get; set; } = 1;')) {
        content = content.replace('public Guid StoreId { get; set; } = 1;', 'public Guid StoreId { get; set; }');
        changed = true;
    }

    // Check specific known errors
    if (file.includes('GetTransactionByIdQuery.cs')) {
        content = content.replace(/public int Id/, 'public Guid Id');
        changed = true;
    }
    if (file.includes('GetTransactionByIdQueryHandler.cs')) {
        content = content.replace(/<GetTransactionByIdQuery, int>/g, '<GetTransactionByIdQuery, Guid>');
        changed = true;
    }


    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed DTOs in ' + file);
    }
}
