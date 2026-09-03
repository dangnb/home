const fs = require('fs');
const path = require('path');
const { convertPdfToDocx } = require('./converter_core');

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("SỬ DỤNG LỆNH CLI:");
    console.log("  node cli.js <duong_dan_file_pdf> [duong_dan_file_docx_dau_ra]\n");
    console.log("Ví dụ:");
    console.log("  node cli.js \"C:\\Users\\DANGHP\\Downloads\\QD 1233.pdf\"");
    process.exit(1);
  }

  const pdfPath = path.resolve(args[0]);
  if (!fs.existsSync(pdfPath)) {
    console.error(`[LỖI] Không tìm thấy file PDF tại: ${pdfPath}`);
    process.exit(1);
  }

  let outPath = args[1];
  if (!outPath) {
    const dir = path.dirname(pdfPath);
    const base = path.basename(pdfPath, path.extname(pdfPath));
    outPath = path.join(dir, `${base}.docx`);
  } else {
    outPath = path.resolve(outPath);
  }

  console.log(`\n======================================================`);
  console.log(`📄 Đang xử lý file PDF: ${pdfPath}`);
  console.log(`🎯 File Word đầu ra: ${outPath}`);
  console.log(`======================================================\n`);

  const pdfBuffer = fs.readFileSync(pdfPath);
  const docBuffer = await convertPdfToDocx(pdfBuffer, {
    docTitle: path.basename(pdfPath, path.extname(pdfPath))
  }, console.log);

  fs.writeFileSync(outPath, docBuffer);
  console.log(`\n✅ HOÀN TẤT! File Word đã được tạo thành công tại:`);
  console.log(`👉 ${outPath}\n`);
}

main().catch(err => {
  console.error("\n[LỖI XỬ LÝ]:", err);
  process.exit(1);
});
