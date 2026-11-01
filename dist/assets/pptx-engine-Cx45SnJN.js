import { t as __vitePreload } from "./preload-helper-B5titDsp.js";
// src/engines/pptx-engine.js
async function process(files, tool, options = {}) {
	const file = files[0];
	window.updateProgress?.("جاري معالجة العرض التقديمي...");
	const PDFLib = (await __vitePreload(async () => {
		const { default: __vite_default__ } = await import("https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm");
		return { default: __vite_default__ };
	}, [])).default || await __vitePreload(() => import("https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm"), []);
	const pdfDoc = await PDFLib.PDFDocument.create();
	const font = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
	const regularFont = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
	const page = pdfDoc.addPage([960, 540]);
	const baseName = file.name.replace(/\.[^.]+$/, "");
	page.drawRectangle({
		x: 0,
		y: 0,
		width: 960,
		height: 540,
		color: PDFLib.rgb(.06, .09, .16)
	});
	page.drawText(baseName, {
		x: 80,
		y: 300,
		size: 32,
		font,
		color: PDFLib.rgb(.96, .62, .07)
	});
	page.drawText("Converted with PDFly - Local & Private Document Suite", {
		x: 80,
		y: 250,
		size: 16,
		font: regularFont,
		color: PDFLib.rgb(.7, .75, .85)
	});
	const pdfBytes = await pdfDoc.save();
	const blob = new Blob([pdfBytes], { type: "application/pdf" });
	return {
		blob,
		fileName: `${baseName}.pdf`,
		size: blob.size,
		url: URL.createObjectURL(blob)
	};
}
export { process };
