// PDFly — Tesseract OCR Engine (Client-side Optical Character Recognition)

export async function process(files, tool, options = {}) {
  const file = files[0];
  window.updateProgress?.('جاري تحميل محرك الذكاء الاصطناعي للتعرف الضوئي على النصوص (OCR)...');

  const { createWorker } = await import('https://cdn.jsdelivr.net/npm/tesseract.js@5.0.4/+esm');

  let lang = 'ara+eng';
  if (tool.id === 'ocr-arabic') lang = 'ara';
  else if (tool.id === 'ocr-english') lang = 'eng';

  window.updateProgress?.(`جاري تهيئة قواميس اللغة (${lang})...`);
  const worker = await createWorker(lang, 1, {
    logger: m => {
      if (m.status === 'recognizing text') {
        const pct = Math.round((m.progress || 0) * 100);
        window.updateProgress?.(`جاري التعرف على الحروف والكلمات: ${pct}%`);
      }
    }
  });

  window.updateProgress?.('جاري معالجة الصورة واستخراج النص العربي/الإنجليزي...');
  const ret = await worker.recognize(file);
  await worker.terminate();

  const extractedText = ret.data.text || 'لم يتم العثور على نص واضح في هذه الصورة.';

  const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
  const baseName = file.name.replace(/\.[^.]+$/, '');

  return {
    blob,
    fileName: `${baseName}-ocr.txt`,
    size: blob.size,
    url: URL.createObjectURL(blob),
  };
}
