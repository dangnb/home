const fs = require('fs');
const path = require('path');

const files = [
  'e:\\Word_Space\\job-out\\workspace\\src\\bandoan\\TapHoa\\frontend\\src\\app\\services\\supplier.service.ts',
  'e:\\Word_Space\\job-out\\workspace\\src\\bandoan\\TapHoa\\frontend\\src\\app\\services\\supplier-ledger.service.ts',
  'e:\\Word_Space\\job-out\\workspace\\src\\bandoan\\TapHoa\\frontend\\src\\app\\services\\role.service.ts',
  'e:\\Word_Space\\job-out\\workspace\\src\\bandoan\\TapHoa\\frontend\\src\\app\\services\\report.service.ts',
  'e:\\Word_Space\\job-out\\workspace\\src\\bandoan\\TapHoa\\frontend\\src\\app\\core\\services\\stock-take.service.ts',
  'e:\\Word_Space\\job-out\\workspace\\src\\bandoan\\TapHoa\\frontend\\src\\app\\core\\services\\dashboard.service.ts',
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('import { inject }') && !content.includes('import {inject}')) {
    content = content.replace(/import { Injectable } from '@angular\/core';/, "import { Injectable, inject } from '@angular/core';");
  }

  content = content.replace(/[ \t]*constructor\(private http: HttpClient\) \{ \}/, '  private http = inject(HttpClient);');
  
  fs.writeFileSync(file, content);
  console.log('Updated', file);
}
