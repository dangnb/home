const fs = require('fs');
const path = require('path');

// Refactor BaseCrudService
const basePath = 'e:\\Word_Space\\job-out\\workspace\\src\\bandoan\\TapHoa\\frontend\\src\\app\\services\\base-crud.service.ts';
let baseContent = fs.readFileSync(basePath, 'utf8');
baseContent = baseContent.replace(/import { HttpClient, HttpParams } from '@angular\/common\/http';/, "import { HttpClient, HttpParams } from '@angular/common/http';\nimport { inject } from '@angular/core';");
baseContent = baseContent.replace(/    protected constructor\([\s\S]*?\) \{ \}/, "    protected http = inject(HttpClient);\n    protected abstract apiUrl: string;");
fs.writeFileSync(basePath, baseContent);
console.log('Updated', basePath);

// Refactor extended services
const extendedFiles = [
  'e:\\Word_Space\\job-out\\workspace\\src\\bandoan\\TapHoa\\frontend\\src\\app\\services\\category.service.ts',
  'e:\\Word_Space\\job-out\\workspace\\src\\bandoan\\TapHoa\\frontend\\src\\app\\services\\product.service.ts',
  'e:\\Word_Space\\job-out\\workspace\\src\\bandoan\\TapHoa\\frontend\\src\\app\\services\\purchase-order.service.ts'
];

for (const file of extendedFiles) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/    constructor\(protected override http: HttpClient\) \{\s*super\(http, `\$\{environment\.apiUrl\}\/([^`]+)`\);\s*\}/, "    protected override apiUrl = `${environment.apiUrl}/$1`;");
  fs.writeFileSync(file, content);
  console.log('Updated', file);
}
