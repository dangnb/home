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

    const recordRx = /int (\w*Id)\b/g;
    if (recordRx.test(content)) {
        content = content.replace(recordRx, 'Guid $1');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed record INT -> GUID in ' + file);
    }
}
