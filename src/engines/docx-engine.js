// PDFly — docx engine (Word to PDF & text conversion)

export async function process(files, tool, options = {}) {
  const file = files[0];
  window.updateProgress?.('جاري معالجة مستند Word...');

  const mammoth = (await import('https://cdn.jsdelivr.net/npm/mammoth@1.6.0/+esm')).default;
  const arrayBuffer = await file.arrayBuffer();

  window.updateProgress?.('جاري استخراج محتوى المستند وتنسيقه...');
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value || '';

  if (tool.id === 'word-to-pdf') {
    // Generate PDF using pdf-lib
    window.updateProgress?.('جاري توليد ملف PDF عالي الجودة...');
    const PDFLib = (await import('https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm')).default || (await import('https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm'));
    const pdfDoc = await PDFLib.PDFDocument.create();
    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

    const lines = text.split('\n');
    let page = pdfDoc.addPage([595.28, 841.89]); // A4
    let y = 800;
    const margin = 50;
    const lineHeight = 18;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        y -= lineHeight;
        continue;
      }

      // Simple line wrapping
      const words = line.split(' ');
      let curLine = '';
      for (const w of words) {
        const test = curLine ? `${curLine} ${w}` : w;
        if (test.length > 70) {
          if (y < 60) {
            page = pdfDoc.addPage([595.28, 841.89]);
            y = 800;
          }
          // Sanitize characters for standard font
          const safeLine = curLine.replace(/[^\x20-\x7E]/g, '?');
          page.drawText(safeLine, { x: margin, y, size: 11, font, color: PDFLib.rgb(0.1, 0.1, 0.1) });
          y -= lineHeight;
          curLine = w;
        } else {
          curLine = test;
        }
      }

      if (curLine) {
        if (y < 60) {
          page = pdfDoc.addPage([595.28, 841.89]);
          y = 800;
        }
        const safeLine = curLine.replace(/[^\x20-\x7E]/g, '?');
        page.drawText(safeLine, { x: margin, y, size: 11, font, color: PDFLib.rgb(0.1, 0.1, 0.1) });
        y -= lineHeight;
      }
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const baseName = file.name.replace(/\.[^.]+$/, '');
    return {
      blob,
      fileName: `${baseName}.pdf`,
      size: blob.size,
      url: URL.createObjectURL(blob),
    };
  } else {
    // Return extracted text as text file
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const baseName = file.name.replace(/\.[^.]+$/, '');
    return {
      blob,
      fileName: `${baseName}.txt`,
      size: blob.size,
      url: URL.createObjectURL(blob),
    };
  }
}
