'use strict';
const express  = require('express');
const multer   = require('multer');
const cors     = require('cors');
const path     = require('path');
const fs       = require('fs');
const os       = require('os');
const { exec, execFile, execSync } = require('child_process');
const { convertPdfToDocx } = require('./converter_core');

const app  = express();
const PORT = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// Detect Python executable (check PATH + common install paths)
// ============================================================
function findPython() {
  const candidates = [
    // Actual install path for this machine (winget install Python.Python.3.12)
    'C:\\Users\\DANGHP\\AppData\\Local\\Programs\\Python\\Python312\\python.exe',
    'python',
    'python3',
    'py',
    'C:\\Python312\\python.exe',
    'C:\\Python311\\python.exe',
    'C:\\Python310\\python.exe',
    'C:\\Users\\DANGHP\\AppData\\Local\\Programs\\Python\\Python311\\python.exe',
    'C:\\Users\\DANGHP\\AppData\\Local\\Programs\\Python\\Python310\\python.exe',
  ];
  for (const py of candidates) {
    try {
      const v = execSync(`"${py}" --version 2>&1`, { timeout: 5000 }).toString().trim();
      if (v.startsWith('Python 3')) {
        console.log('✅ Python found:', py, '→', v);
        return py;
      }
    } catch {}
  }
  return null;
}

function checkPdf2docx(python) {
  try {
    execSync(`"${python}" -c "import pdf2docx; print('ok')"`, { timeout: 5000 });
    return true;
  } catch { return false; }
}

let PYTHON_EXE  = null;
let PDF2DOCX_OK = false;

// Detect at startup
try { PYTHON_EXE = findPython(); } catch {}
if (PYTHON_EXE) {
  try { PDF2DOCX_OK = checkPdf2docx(PYTHON_EXE); } catch {}
}

console.log(`Python: ${PYTHON_EXE || 'NOT FOUND'}`);
console.log(`pdf2docx: ${PDF2DOCX_OK ? 'READY ✅' : 'NOT INSTALLED ❌'}`);

// ============================================================
// Convert using pdf2docx (Python) — highest fidelity
// ============================================================
function convertWithPdf2docx(inputPath, outputPath, addLog) {
  return new Promise((resolve, reject) => {
    const pyScript = path.join(__dirname, 'pdf2word.py');
    addLog('Đang dùng pdf2docx (Python) — giữ nguyên layout 100%...');

    const child = execFile(PYTHON_EXE, [pyScript, inputPath, outputPath], {
      timeout: 10 * 60 * 1000,  // 10 minutes max
      maxBuffer: 50 * 1024 * 1024,
    }, (err, stdout, stderr) => {
      if (stdout) stdout.split('\n').filter(Boolean).forEach(l => addLog(l));
      if (err) {
        const msg = stderr || err.message;
        reject(new Error(msg));
      } else {
        resolve();
      }
    });
  });
}

// ============================================================
// Multer upload
// ============================================================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 },
});

// ============================================================
// Health / capability check
// ============================================================
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    timestamp: new Date().toISOString(),
    python: !!PYTHON_EXE,
    pdf2docx: PDF2DOCX_OK,
    engine: PDF2DOCX_OK ? 'pdf2docx (Python) — layout 100%' : 'pdfjs (Node.js) — best-effort',
  });
});

// ============================================================
// Main convert endpoint
// ============================================================
app.post('/api/convert', upload.single('pdfFile'), async (req, res) => {
  const taskId = 'task_' + Date.now();
  const logs = [];
  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString('vi-VN');
    const line = `[${time}] ${msg}`;
    logs.push(line);
    console.log(line);
  };

  let tmpInput  = null;
  let tmpOutput = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Vui lòng chọn một file PDF hợp lệ!' });
    }

    const originalName   = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
    const baseName       = path.basename(originalName, path.extname(originalName));
    const outputFilename = `${baseName}.docx`;

    addLog(`Đã nhận file: "${originalName}" (${(req.file.size / 1024 / 1024).toFixed(2)} MB)`);

    let docBuffer;

    if (PDF2DOCX_OK) {
      // ---- Method 1: pdf2docx (Python) — highest fidelity ----
      addLog(`Engine: pdf2docx (Python) — ưu tiên text, giữ nguyên layout`);
      tmpInput  = path.join(os.tmpdir(), `pdfin_${Date.now()}.pdf`);
      tmpOutput = path.join(os.tmpdir(), `pdout_${Date.now()}.docx`);
      fs.writeFileSync(tmpInput, req.file.buffer);

      await convertWithPdf2docx(tmpInput, tmpOutput, addLog);

      if (!fs.existsSync(tmpOutput)) throw new Error('pdf2docx không tạo được file output!');
      docBuffer = fs.readFileSync(tmpOutput);
      addLog(`✅ pdf2docx hoàn tất! (${(docBuffer.length / 1024 / 1024).toFixed(2)} MB)`);

    } else {
      // ---- Method 2: Node.js pdfjs engine (fallback) ----
      addLog(`Engine: pdfjs (Node.js) — fallback (pdf2docx chưa cài)`);
      docBuffer = await convertPdfToDocx(req.file.buffer, { docTitle: baseName }, addLog);
    }

    // Save to Downloads
    const downloadsDir = 'C:\\Users\\DANGHP\\Downloads';
    let savedLocalPath = '';
    if (fs.existsSync(downloadsDir)) {
      savedLocalPath = path.join(downloadsDir, outputFilename);
      fs.writeFileSync(savedLocalPath, docBuffer);
      addLog(`Đã lưu bản sao tại: ${savedLocalPath}`);
    }

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(outputFilename)}"`,
      'Content-Length': docBuffer.length,
      'X-Saved-Path': encodeURIComponent(savedLocalPath),
    });
    res.send(docBuffer);

  } catch (error) {
    addLog(`LỖI: ${error.message}`);
    console.error(error);
    res.status(500).json({ error: error.message, logs });
  } finally {
    // Cleanup temp files
    try { if (tmpInput  && fs.existsSync(tmpInput))  fs.unlinkSync(tmpInput);  } catch {}
    try { if (tmpOutput && fs.existsSync(tmpOutput)) fs.unlinkSync(tmpOutput); } catch {}
  }
});

// ============================================================
// Install pdf2docx on demand
// ============================================================
app.post('/api/install-pdf2docx', (req, res) => {
  if (!PYTHON_EXE) {
    return res.status(400).json({ error: 'Python chưa được cài đặt!' });
  }
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.write('Đang cài pdf2docx...\n');

  const child = exec(`"${PYTHON_EXE}" -m pip install pdf2docx --upgrade`, { timeout: 300000 });
  child.stdout.on('data', d => res.write(d));
  child.stderr.on('data', d => res.write(d));
  child.on('close', code => {
    if (code === 0) {
      PDF2DOCX_OK = true;
      res.write('\n✅ pdf2docx đã cài xong! Reload trang để dùng.\n');
    } else {
      res.write(`\n❌ Cài thất bại (code ${code})\n`);
    }
    res.end();
  });
});

// ============================================================
// Open file in Word
// ============================================================
app.post('/api/open-word', (req, res) => {
  const { filePath } = req.body;
  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File không tồn tại!' });
  }
  exec(`start "" "${filePath}"`, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// ============================================================
// Start
// ============================================================
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 PDF to Word Converter App is RUNNING!`);
  console.log(`🌐 Truy cập ứng dụng tại: http://localhost:${PORT}`);
  if (PDF2DOCX_OK) {
    console.log(`✅ Engine: pdf2docx (Python) — layout 100%`);
  } else if (PYTHON_EXE) {
    console.log(`⚠️  Python có nhưng pdf2docx chưa cài — gọi POST /api/install-pdf2docx`);
  } else {
    console.log(`⚠️  Python chưa cài — dùng Node.js fallback`);
  }
  console.log(`======================================================\n`);
});
