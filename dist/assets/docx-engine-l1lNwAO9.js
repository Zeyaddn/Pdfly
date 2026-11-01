import { t as __vitePreload } from "./preload-helper-B5titDsp.js";
// src/engines/docx-engine.js
async function process(files, tool, options = {}) {
	const file = files[0];
	window.updateProgress?.("جاري معالجة مستند Word...");
	const mammoth = (await __vitePreload(async () => {
		const { default: __vite_default__ } = await import("https://cdn.jsdelivr.net/npm/mammoth@1.6.0/+esm");
		return { default: __vite_default__ };
	}, [])).default;
	const arrayBuffer = await file.arrayBuffer();
	window.updateProgress?.("جاري استخراج محتوى المستند وتنسيقه...");
	const text = (await mammoth.extractRawText({ arrayBuffer })).value || "";
	if (tool.id === "word-to-pdf") {
		window.updateProgress?.("جاري توليد ملف PDF عالي الجودة...");
		const PDFLib = (await __vitePreload(async () => {
			const { default: __vite_default__ } = await import("https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm");
			return { default: __vite_default__ };
		}, [])).default || await __vitePreload(() => import("https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm"), []);
		const pdfDoc = await PDFLib.PDFDocument.create();
		const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
		const lines = text.split("\n");
		let page = pdfDoc.addPage([595.28, 841.89]);
		let y = 800;
		const margin = 50;
		const lineHeight = 18;
		for (const rawLine of lines) {
			const line = rawLine.trim();
			if (!line) {
				y -= lineHeight;
				continue;
			}
			const words = line.split(" ");
			let curLine = "";
			for (const w of words) {
				const test = curLine ? `${curLine} ${w}` : w;
				if (test.length > 70) {
					if (y < 60) {
						page = pdfDoc.addPage([595.28, 841.89]);
						y = 800;
					}
					const safeLine = curLine.replace(/[^\x20-\x7E]/g, "?");
					page.drawText(safeLine, {
						x: margin,
						y,
						size: 11,
						font,
						color: PDFLib.rgb(.1, .1, .1)
					});
					y -= lineHeight;
					curLine = w;
				} else curLine = test;
			}
			if (curLine) {
				if (y < 60) {
					page = pdfDoc.addPage([595.28, 841.89]);
					y = 800;
				}
				const safeLine = curLine.replace(/[^\x20-\x7E]/g, "?");
				page.drawText(safeLine, {
					x: margin,
					y,
					size: 11,
					font,
					color: PDFLib.rgb(.1, .1, .1)
				});
				y -= lineHeight;
			}
		}
		const pdfBytes = await pdfDoc.save();
		const blob = new Blob([pdfBytes], { type: "application/pdf" });
		return {
			blob,
			fileName: `${file.name.replace(/\.[^.]+$/, "")}.pdf`,
			size: blob.size,
			url: URL.createObjectURL(blob)
		};
	} else {
		const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
		return {
			blob,
			fileName: `${file.name.replace(/\.[^.]+$/, "")}.txt`,
			size: blob.size,
			url: URL.createObjectURL(blob)
		};
	}
}
export { process };
