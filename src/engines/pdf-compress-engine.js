// PDFly — PDF Compress Engine

export async function process(files, tool, options = {}) {
  const file = files[0];
  window.updateProgress?.('جاري تحليل ملف PDF وضغط الكائنات...');

  const PDFLib = (await import('https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm')).default || (await import('https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm'));
  const arrayBuffer = await file.arrayBuffer();

  window.updateProgress?.('جاري إعادة هيكلة وفهرسة المستند...');
  const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  window.updateProgress?.('جاري تطبيق خوارزمية تحسين الحجم وإزالة الزوائد...');
  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  const blob = new Blob([compressedBytes], { type: 'application/pdf' });
  const baseName = file.name.replace(/\.[^.]+$/, '');

  return {
    blob,
    fileName: `${baseName}-optimized.pdf`,
    size: blob.size,
    url: URL.createObjectURL(blob),
  };
}
