import { t as __vitePreload } from "./preload-helper-B5titDsp.js";
// src/engines/xlsx-engine.js
async function process(files, tool, options = {}) {
	const file = files[0];
	window.updateProgress?.("جاري قراءة ملف Excel وتحليل الجداول...");
	const XLSX = (await __vitePreload(async () => {
		const { default: __vite_default__ } = await import("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm");
		return { default: __vite_default__ };
	}, [])).default;
	const arrayBuffer = await file.arrayBuffer();
	const workbook = XLSX.read(arrayBuffer, { type: "array" });
	const firstSheetName = workbook.SheetNames[0];
	const worksheet = workbook.Sheets[firstSheetName];
	const csv = XLSX.utils.sheet_to_csv(worksheet);
	if (tool.id === "excel-to-pdf") {
		window.updateProgress?.("جاري تنسيق الجداول وتوليد PDF...");
		const PDFLib = (await __vitePreload(async () => {
			const { default: __vite_default__ } = await import("https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm");
			return { default: __vite_default__ };
		}, [])).default || await __vitePreload(() => import("https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm"), []);
		const pdfDoc = await PDFLib.PDFDocument.create();
		const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
		const rows = csv.split("\n");
		let page = pdfDoc.addPage([841.89, 595.28]);
		let y = 550;
		const margin = 40;
		const lineHeight = 16;
		for (const row of rows) {
			if (!row.trim()) continue;
			if (y < 40) {
				page = pdfDoc.addPage([841.89, 595.28]);
				y = 550;
			}
			const safeText = row.substring(0, 110).replace(/[^\x20-\x7E]/g, " ");
			page.drawText(safeText, {
				x: margin,
				y,
				size: 9,
				font,
				color: PDFLib.rgb(.15, .15, .15)
			});
			y -= lineHeight;
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
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
		return {
			blob,
			fileName: `${file.name.replace(/\.[^.]+$/, "")}.csv`,
			size: blob.size,
			url: URL.createObjectURL(blob)
		};
	}
}
export { process };
