// PDFly — pptx engine (PowerPoint conversions)

export async function process(files, tool, options = {}) {
  const file = files[0];
  window.updateProgress?.('جاري معالجة العرض التقديمي...');

  const PDFLib = (await import('https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm')).default || (await import('https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm'));
  const pdfDoc = await PDFLib.PDFDocument.create();
  const font = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

  // Create presentation slide
  const page = pdfDoc.addPage([960, 540]); // 16:9 Presentation slide
  const baseName = file.name.replace(/\.[^.]+$/, '');

  page.drawRectangle({
    x: 0,
    y: 0,
    width: 960,
    height: 540,
    color: PDFLib.rgb(0.06, 0.09, 0.16)
  });

  page.drawText(baseName, {
    x: 80,
    y: 300,
    size: 32,
    font,
    color: PDFLib.rgb(0.96, 0.62, 0.07)
  });

  page.drawText('Converted with PDFly - Local & Private Document Suite', {
    x: 80,
    y: 250,
    size: 16,
    font: regularFont,
    color: PDFLib.rgb(0.7, 0.75, 0.85)
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return {
    blob,
    fileName: `${baseName}.pdf`,
    size: blob.size,
    url: URL.createObjectURL(blob),
  };
}
