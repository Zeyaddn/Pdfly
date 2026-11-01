import { t as __vitePreload } from "./preload-helper-B5titDsp.js";
// src/engines/pdf-compress-engine.js
async function process(files, tool, options = {}) {
	const file = files[0];
	window.updateProgress?.("جاري تحليل ملف PDF وضغط الكائنات...");
	const PDFLib = (await __vitePreload(async () => {
		const { default: __vite_default__ } = await import("https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm");
		return { default: __vite_default__ };
	}, [])).default || await __vitePreload(() => import("https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm"), []);
	const arrayBuffer = await file.arrayBuffer();
	window.updateProgress?.("جاري إعادة هيكلة وفهرسة المستند...");
	const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
	window.updateProgress?.("جاري تطبيق خوارزمية تحسين الحجم وإزالة الزوائد...");
	const compressedBytes = await pdfDoc.save({
		useObjectStreams: true,
		addDefaultPage: false
	});
	const blob = new Blob([compressedBytes], { type: "application/pdf" });
	return {
		blob,
		fileName: `${file.name.replace(/\.[^.]+$/, "")}-optimized.pdf`,
		size: blob.size,
		url: URL.createObjectURL(blob)
	};
}
export { process };
