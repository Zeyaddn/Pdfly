async function getPdfJs() {
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    return window.pdfjsLib;
  }
  // Fallback load
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
  const file = files[0];
  window.updateProgress?.('جاري استخراج بيانات المستند...');

  const pdfjs = await getPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({
    data: arrayBuffer,
    disableWorker: true, // Prevents fake-worker "require is not defined" error in all browsers
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
    cMapPacked: true,
  });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  let pageData = [];
  for (let i = 1; i <= numPages; i++) {
    window.updateProgress?.(`جاري استخراج وتنسيق الصفحة ${i} من ${numPages}...`);
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 1.0 });
    const tc = await page.getTextContent();
    
    // Group and sort items by vertical position Y (descending) and horizontal X (ascending)
    const items = tc.items.map(it => ({
      str: it.str,
      x: it.transform[4],
      y: it.transform[5],
      fontSize: Math.sqrt(it.transform[0] * it.transform[0] + it.transform[1] * it.transform[1]) || 12,
      fontName: it.fontName || '',
      width: it.width,
      height: it.height
    })).filter(it => it.str && it.str.trim().length > 0);

    // Group into visual lines
    items.sort((a, b) => b.y - a.y || a.x - b.x);

    const lines = [];
    let currentLine = [];
    let currentY = null;

    for (const item of items) {
      if (currentY === null || Math.abs(item.y - currentY) > (item.fontSize * 0.6)) {
        if (currentLine.length > 0) {
          // Sort items in this line by X position
          currentLine.sort((a, b) => a.x - b.x);
          lines.push({
            y: currentY,
            fontSize: currentLine[0].fontSize,
            text: currentLine.map(t => t.str).join(' ')
          });
          currentLine = [];
        }
        currentY = item.y;
      }
      currentLine.push(item);
    }
    if (currentLine.length > 0) {
      currentLine.sort((a, b) => a.x - b.x);
      lines.push({
        y: currentY,
        fontSize: currentLine[0].fontSize,
        text: currentLine.map(t => t.str).join(' ')
      });
    }

    pageData.push({ pageNum: i, width: viewport.width, height: viewport.height, lines });
  }

  const baseName = file.name.replace(/\.[^.]+$/, '');

  if (tool.id === 'pdf-to-word') {
    window.updateProgress?.('جاري توليد مستند Word متناسق مع المستند الأصلي...');
    const bodyContent = pageData.map(p => {
      const pageElements = p.lines.map(line => {
        const isHeading = line.fontSize >= 16;
        const isSubHeading = line.fontSize >= 13 && line.fontSize < 16;
        const fontSz = Math.round(Math.max(11, Math.min(24, line.fontSize)));

        if (isHeading) {
          return `<h2 style="margin:16px 0 8px 0;font-size:${fontSz}pt;color:#1e3a8a;font-weight:bold;line-height:1.4;">${escapeXml(line.text)}</h2>`;
        } else if (isSubHeading) {
          return `<h3 style="margin:12px 0 6px 0;font-size:${fontSz}pt;color:#1d4ed8;font-weight:600;line-height:1.4;">${escapeXml(line.text)}</h3>`;
        } else {
          return `<p style="margin:6px 0;font-size:${fontSz}pt;line-height:1.75;text-align:justify;color:#1e293b;">${escapeXml(line.text)}</p>`;
        }
      }).join('');

      return `
        <div class="WordSection" style="page-break-after:always;padding:40px 0;border-bottom:1px solid #e2e8f0;margin-bottom:30px;">
          <div style="color:#64748b;font-size:9pt;font-weight:bold;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px;border-bottom:1px solid #cbd5e1;padding-bottom:4px;">
            صفحة ${p.pageNum} من ${numPages}
          </div>
          ${pageElements || '<p style="color:#94a3b8;font-style:italic;">[صفحة خالية من النصوص القابلة للفرز أو تحتوي صور فقط]</p>'}
        </div>
      `;
    }).join('');

    const wordHtml = `\ufeff<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>${escapeXml(baseName)}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page { size: A4; margin: 25mm 20mm; }
          body { font-family: 'Segoe UI', Calibri, Tahoma, Arial, sans-serif; margin: 30px auto; max-width: 820px; direction: rtl; unicode-bidi: embed; color: #1e293b; }
          h2, h3 { font-family: 'Segoe UI', Tahoma, sans-serif; }
          p { margin: 6px 0; }
        </style>
      </head>
      <body>
        ${bodyContent}
      </body>
    </html>`;

    const blob = new Blob([wordHtml], { type: 'application/msword;charset=utf-8' });
    return {
      blob,
      fileName: `${baseName}.doc`,
      size: blob.size,
      url: URL.createObjectURL(blob),
    };
  } else if (tool.id === 'pdf-to-ppt') {
    window.updateProgress?.('جاري توليد عرض PowerPoint (PPTX) حقيقي بالشرائح...');
    const JSZip = (await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm')).default;
    const zip = new JSZip();

    // Create PowerPoint OpenXML presentation package
    zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  ${pageData.map((_, i) => `<Override PartName="/ppt/slides/slide${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join('\n  ')}
</Types>`);

    zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`);

    const slideRels = pageData.map((_, i) => `<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i+1}.xml"/>`).join('\n  ');

    zip.file('ppt/presentation.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <p:sldIdLst>
    ${pageData.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i+1}"/>`).join('\n    ')}
  </p:sldIdLst>
  <p:sldSz cx="9144000" cy="5143500"/>
</p:presentation>`);

    zip.file('ppt/_rels/presentation.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${slideRels}
</Relationships>`);

    // Add each slide XML with slide title and content extracted from page
    pageData.forEach((p, idx) => {
      const slideTitle = p.lines[0]?.text || `شريحة رقم ${idx + 1}`;
      const slideBody = p.lines.slice(1, 8).map(l => l.text).join('\n') || 'محتوى الشريحة';

      zip.file(`ppt/slides/slide${idx + 1}.xml`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/></a:xfrm></p:grpSpPr>
      <p:sp>
        <p:nvSpPr><p:cNvPr id="2" name="Title"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr/></p:nvSpPr>
        <p:spPr><a:xfrm><a:off x="457200" y="457200"/><a:ext cx="8229600" cy="914400"/></a:xfrm></p:spPr>
        <p:txBody><a:bodyPr rtlCol="1"/><a:p><a:r><a:rPr lang="ar-SA" sz="3200" b="1"/><a:t>${escapeXml(slideTitle)}</a:t></a:r></a:p></p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr><p:cNvPr id="3" name="Content"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr/></p:nvSpPr>
        <p:spPr><a:xfrm><a:off x="457200" y="1600200"/><a:ext cx="8229600" cy="3000000"/></a:xfrm></p:spPr>
        <p:txBody><a:bodyPr rtlCol="1"/><a:p><a:r><a:rPr lang="ar-SA" sz="1800"/><a:t>${escapeXml(slideBody)}</a:t></a:r></a:p></p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
</p:sld>`);
    });

    const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
    return {
      blob,
      fileName: `${baseName}.pptx`,
      size: blob.size,
      url: URL.createObjectURL(blob),
    };
  } else if (tool.id === 'pdf-to-excel' || tool.id === 'extract-tables') {
    window.updateProgress?.('جاري استخراج وتنسيق جدول البيانات...');
    let csvContent = '\ufeffالصفحة,السطر,المحتوى النصي\n';
    pageData.forEach(p => {
      p.lines.forEach((l, idx) => {
        csvContent += `"${p.pageNum}","${idx + 1}","${l.text.replace(/"/g, '""')}"\n`;
      });
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    return {
      blob,
      fileName: `${baseName}-data.csv`,
      size: blob.size,
      url: URL.createObjectURL(blob),
    };
  } else if (tool.id === 'pdf-to-html') {
    const html = `<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"><title>${escapeXml(baseName)}</title><style>body{max-width:850px;margin:40px auto;font-family:'Segoe UI',sans-serif;line-height:1.8;padding:0 24px;color:#222;}h2{color:#0284c7;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-top:30px;}p{margin:8px 0;}</style></head><body>` +
      pageData.map(p => `<h2>الصفحة ${p.pageNum}</h2>` + p.lines.map(l => `<p>${escapeXml(l.text)}</p>`).join('')).join('') +
      `</body></html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    return {
      blob,
      fileName: `${baseName}.html`,
      size: blob.size,
      url: URL.createObjectURL(blob),
    };
  } else {
    // Plain text
    const text = '\ufeff' + pageData.map(p => `--- صفحة ${p.pageNum} ---\n` + p.lines.map(l => l.text).join('\n')).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    return {
      blob,
      fileName: `${baseName}.txt`,
      size: blob.size,
      url: URL.createObjectURL(blob),
    };
  }
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}
