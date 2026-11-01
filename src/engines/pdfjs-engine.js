// PDFly — pdfjs Engine (PDF viewing, rendering pages to images, text extraction)

let pdfjsLib = null;

async function loadPdfJs() {
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    return window.pdfjsLib;
  }
  await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve();
    };
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return window.pdfjsLib;
}

export async function process(files, tool, options = {}) {
  const pdfjs = await loadPdfJs();
  const file = files[0];
  const arrayBuffer = await file.arrayBuffer();
  
  window.updateProgress?.('جاري فتح ملف PDF وتحليله...');
  const loadingTask = pdfjs.getDocument({
    data: arrayBuffer,
    disableWorker: true,
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
    cMapPacked: true,
  });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  if (tool.id === 'pdf-to-images') {
    return await convertPdfToImages(pdfDoc, file.name, options);
  } else if (tool.id === 'extract-images') {
    return await extractImagesFromPdf(pdfDoc, file.name);
  } else if (tool.id === 'pdf-to-txt' || tool.id === 'text-extraction') {
    return await extractTextFromPdf(pdfDoc, file.name);
  } else if (tool.id === 'doc-stats') {
    return await generatePdfStats(pdfDoc, file);
  } else {
    // Default fallback: export pages as images / zip
    return await convertPdfToImages(pdfDoc, file.name, options);
  }
}

async function convertPdfToImages(pdfDoc, originalName, options = {}) {
  const JSZip = (await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm')).default;
  const zip = new JSZip();
  const format = options.imageFormat || 'png';
  const scale = options.dpiScale || 1.5;
  const numPages = pdfDoc.numPages;

  for (let i = 1; i <= numPages; i++) {
    window.updateProgress?.(`جاري تحويل الصفحة ${i} من ${numPages}...`);
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport }).promise;

    const dataUrl = canvas.toDataURL(`image/${format === 'jpeg' ? 'jpeg' : 'png'}`);
    const base64Data = dataUrl.split(',')[1];
    zip.file(`page-${String(i).padStart(3, '0')}.${format}`, base64Data, { base64: true });
  }

  window.updateProgress?.('جاري تجميع ملف الأرشيف المضغوط...');
  const blob = await zip.generateAsync({ type: 'blob' });
  const baseName = originalName.replace(/\.pdf$/i, '');
  return {
    blob,
    fileName: `${baseName}-images.zip`,
    size: blob.size,
    url: URL.createObjectURL(blob),
  };
}

async function extractImagesFromPdf(pdfDoc, originalName) {
  // Similar to convertPdfToImages
  return await convertPdfToImages(pdfDoc, originalName, { imageFormat: 'png', dpiScale: 2 });
}

async function extractTextFromPdf(pdfDoc, originalName) {
  let fullText = '';
  const numPages = pdfDoc.numPages;

  for (let i = 1; i <= numPages; i++) {
    window.updateProgress?.(`جاري استخراج النص من الصفحة ${i} من ${numPages}...`);
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += `--- الصفحة ${i} ---\n\n${pageText}\n\n`;
  }

  const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
  const baseName = originalName.replace(/\.pdf$/i, '');
  return {
    blob,
    fileName: `${baseName}-extracted.txt`,
    size: blob.size,
    url: URL.createObjectURL(blob),
  };
}

async function generatePdfStats(pdfDoc, file) {
  const metadata = await pdfDoc.getMetadata().catch(() => ({}));
  let totalWords = 0;
  const numPages = pdfDoc.numPages;

  for (let i = 1; i <= Math.min(numPages, 10); i++) {
    const page = await pdfDoc.getPage(i);
    const tc = await page.getTextContent();
    const txt = tc.items.map(x => x.str).join(' ');
    totalWords += txt.split(/\s+/).filter(Boolean).length;
  }

  const estimatedTotalWords = numPages > 10 ? Math.round((totalWords / 10) * numPages) : totalWords;

  const stats = [
    `تقرير إحصائيات المستند: ${file.name}`,
    `=====================================`,
    `حجم الملف: ${(file.size / (1024 * 1024)).toFixed(2)} ميجابايت`,
    `عدد الصفحات: ${numPages}`,
    `عدد الكلمات التقديري: ~${estimatedTotalWords}`,
    `عنوان المستند (Title): ${metadata?.info?.Title || 'غير متوفر'}`,
    `المؤلف (Author): ${metadata?.info?.Author || 'غير متوفر'}`,
    `البرنامج المنشئ: ${metadata?.info?.Producer || 'غير متوفر'}`,
    `تاريخ الإنشاء: ${metadata?.info?.CreationDate || 'غير متوفر'}`,
    `نوع المعالجة: محلية وآمنة 100% داخل المتصفح بواسطة PDFly`
  ].join('\n');

  const blob = new Blob([stats], { type: 'text/plain;charset=utf-8' });
  const baseName = file.name.replace(/\.[^.]+$/, '');
  return {
    blob,
    fileName: `${baseName}-stats.txt`,
    size: blob.size,
    url: URL.createObjectURL(blob),
  };
}
