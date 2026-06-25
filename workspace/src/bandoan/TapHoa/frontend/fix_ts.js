const fs = require('fs');

function fixFile(file) {
    let content = fs.readFileSync(file, 'utf8');

    // Replace '.id = 0' -> '.id = ""'
    content = content.replace(/\.id\s*=\s*0/g, '.id = ""');
    // Replace 'id: 0' -> 'id: ""'
    content = content.replace(/\bid:\s*0/g, 'id: ""');
    content = content.replace(/\bcategoryId:\s*0/g, 'categoryId: ""');
    content = content.replace(/\.categoryId\s*=\s*0/g, '.categoryId = ""');
    content = content.replace(/\bproductId:\s*0/g, 'productId: ""');
    content = content.replace(/\.productId\s*=\s*0/g, '.productId = ""');

    // Transaction create: 'ProductDto | undefined'
    // p.id === productId : if productId is string, this should just work
    // Number()
    content = content.replace(/Number\(([^)]+)\)/g, '$1');

    fs.writeFileSync(file, content, 'utf8');
}

fixFile('src/app/admin/categories/categories.component.ts');
fixFile('src/app/admin/products/products.component.ts');
fixFile('src/app/admin/roles/roles.component.ts');
fixFile('src/app/admin/transaction-create/transaction-create.component.ts');
console.log('Fixed TS files');
