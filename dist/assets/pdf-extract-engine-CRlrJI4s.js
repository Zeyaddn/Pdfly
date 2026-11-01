// src/engines/pdf-extract-engine.js
async function getPdfJs() {
	if (window.pdfjsLib) {
		window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
		return window.pdfjsLib;
	}
	await new Promise((resolve, reject) => {
		const s = document.createElement("script");
		s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
		s.onload = () => {
			window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
			resolve();
		};
		s.onerror = reject;
		document.head.appendChild(s);
	});
	return window.pdfjsLib;
}
async function process(files, tool, options = {}) {
	const file = files[0];
	window.updateProgress?.("جاري استخراج بيانات المستند...");
	const pdfjs = await getPdfJs();
	const arrayBuffer = await file.arrayBuffer();
	const pdfDoc = await pdfjs.getDocument({
		data: arrayBuffer,
		disableWorker: true,
		cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/",
		cMapPacked: true
	}).promise;
	const numPages = pdfDoc.numPages;
	let textArray = [];
	for (let i = 1; i <= numPages; i++) {
		window.updateProgress?.(`جاري استخراج محتوى الصفحة ${i} من ${numPages}...`);
		const tc = await (await pdfDoc.getPage(i)).getTextContent();
		const pageLines = [];
		let curLine = [];
		let lastY = null;
		for (const item of tc.items) {
			if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
				pageLines.push(curLine.join(" "));
				curLine = [];
			}
			curLine.push(item.str);
			lastY = item.transform[5];
		}
		if (curLine.length) pageLines.push(curLine.join(" "));
		textArray.push({
			pageNum: i,
			lines: pageLines
		});
	}
	const baseName = file.name.replace(/\.[^.]+$/, "");
	if (tool.id === "pdf-to-word") {
		window.updateProgress?.("جاري توليد مستند Word عالي الجودة ومنسق...");
		const bodyContent = textArray.map((p) => {
			const pageText = p.lines.map((l) => `<p style="margin:8px 0;line-height:1.8;font-size:14pt;font-family:'Calibri','Segoe UI',Arial,sans-serif;text-align:justify;">${escapeXml(l)}</p>`).join("");
			return `
        <div class="WordSection" style="page-break-after:always;padding:20px 0;">
          <div style="color:#888;font-size:10pt;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:16px;">— صفحة ${p.pageNum} —</div>
          ${pageText}
        </div>
      `;
		}).join("");
		const wordHtml = `\ufeff<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>${escapeXml(baseName)}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Segoe UI', 'Calibri', Arial, sans-serif; margin: 40px; direction: rtl; unicode-bidi: embed; }
          p { margin: 8px 0; }
        </style>
      </head>
      <body>
        ${bodyContent}
      </body>
    </html>`;
		const blob = new Blob([wordHtml], { type: "application/msword;charset=utf-8" });
		return {
			blob,
			fileName: `${baseName}.doc`,
			size: blob.size,
			url: URL.createObjectURL(blob)
		};
	} else if (tool.id === "pdf-to-excel" || tool.id === "extract-tables") {
		window.updateProgress?.("جاري استخراج وتنسيق جدول البيانات...");
		let csvContent = "﻿الصفحة,السطر,المحتوى النصي\n";
		textArray.forEach((p) => {
			p.lines.forEach((l, idx) => {
				csvContent += `"${p.pageNum}","${idx + 1}","${l.replace(/"/g, "\"\"")}"\n`;
			});
		});
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
		return {
			blob,
			fileName: `${baseName}-data.csv`,
			size: blob.size,
			url: URL.createObjectURL(blob)
		};
	} else if (tool.id === "pdf-to-html") {
		const html = `<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"><title>${escapeXml(baseName)}</title><style>body{max-width:850px;margin:40px auto;font-family:'Segoe UI',sans-serif;line-height:1.8;padding:0 24px;color:#222;}h2{color:#0284c7;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-top:30px;}p{margin:8px 0;}</style></head><body>` + textArray.map((p) => `<h2>الصفحة ${p.pageNum}</h2>` + p.lines.map((l) => `<p>${escapeXml(l)}</p>`).join("")).join("") + `</body></html>`;
		const blob = new Blob([html], { type: "text/html;charset=utf-8" });
		return {
			blob,
			fileName: `${baseName}.html`,
			size: blob.size,
			url: URL.createObjectURL(blob)
		};
	} else {
		const text = "﻿" + textArray.map((p) => `--- صفحة ${p.pageNum} ---\n` + p.lines.join("\n")).join("\n\n");
		const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
		return {
			blob,
			fileName: `${baseName}.txt`,
			size: blob.size,
			url: URL.createObjectURL(blob)
		};
	}
}
function escapeXml(unsafe) {
	return unsafe.replace(/[<>&'"]/g, (c) => {
		switch (c) {
			case "<": return "&lt;";
			case ">": return "&gt;";
			case "&": return "&amp;";
			case "'": return "&apos;";
			case "\"": return "&quot;";
		}
	});
}
export { process };
