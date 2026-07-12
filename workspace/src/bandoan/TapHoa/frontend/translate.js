const fs = require('fs');
const path = require('path');

const VI_JSON_PATH = path.join(__dirname, 'src/assets/i18n/vi.json');
const EN_JSON_PATH = path.join(__dirname, 'src/assets/i18n/en.json');

const vietnameseRegex = /[áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]/i;

function loadJson(p) {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function saveJson(p, data) {
    fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function processFile(filePath, moduleKey) {
    let html = fs.readFileSync(filePath, 'utf8');
    const viData = loadJson(VI_JSON_PATH);
    const enData = loadJson(EN_JSON_PATH);
    
    if (!viData[moduleKey]) viData[moduleKey] = {};
    if (!enData[moduleKey]) enData[moduleKey] = {};
    
    let keyCounter = Object.keys(viData[moduleKey]).length + 1;
    
    // Replace text nodes
    // Matches > text < where text contains vietnamese characters
    const textNodeRegex = />([^<]*[áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+[^<]*)</gi;
    html = html.replace(textNodeRegex, (match, p1) => {
        let text = p1.trim();
        if (!text) return match;
        
        // Skip if it contains interpolation {{ }}
        if (text.includes('{{')) return match;
        
        const key = `TXT_${keyCounter++}`;
        viData[moduleKey][key] = text;
        enData[moduleKey][key] = text; // Just placeholder for EN
        
        return match.replace(text, `{{ '${moduleKey}.${key}' | translate }}`);
    });
    
    // Replace placeholders
    const placeholderRegex = /placeholder="([^"]*[áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+[^"]*)"/gi;
    html = html.replace(placeholderRegex, (match, p1) => {
        const key = `TXT_${keyCounter++}`;
        viData[moduleKey][key] = p1;
        enData[moduleKey][key] = p1;
        return `[placeholder]="'${moduleKey}.${key}' | translate"`;
    });
    
    // Replace titles
    const titleRegex = / title="([^"]*[áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+[^"]*)"/gi;
    html = html.replace(titleRegex, (match, p1) => {
        const key = `TXT_${keyCounter++}`;
        viData[moduleKey][key] = p1;
        enData[moduleKey][key] = p1;
        return ` [title]="'${moduleKey}.${key}' | translate"`;
    });
    
    fs.writeFileSync(filePath, html, 'utf8');
    saveJson(VI_JSON_PATH, viData);
    saveJson(EN_JSON_PATH, enData);
    
    console.log(`Processed ${filePath} under module ${moduleKey}`);
}

const targetFile = process.argv[2];
const moduleName = process.argv[3];
if (targetFile && moduleName) {
    processFile(targetFile, moduleName);
} else {
    console.log("Usage: node translate.js <file> <MODULE_KEY>");
}
