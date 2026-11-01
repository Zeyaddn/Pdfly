import { t as __vitePreload } from "./preload-helper-B5titDsp.js";
// src/engines/pdf-lib-engine.js
var PDFLib = null;
async function loadPdfLib() {
	if (PDFLib) return PDFLib;
	window.updateProgress?.("Loading PDF engine...");
	PDFLib = await __vitePreload(() => import("https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm"), []);
	return PDFLib;
}
async function process(files, tool, options = {}) {
	const lib = await loadPdfLib();
	switch (tool.id) {
		case "merge-pdf": return await mergePdf(files, lib);
		case "split-pdf": return await splitPdf(files[0], lib, options);
		case "extract-pages": return await extractPages(files[0], lib, options);
		case "delete-pages": return await deletePages(files[0], lib, options);
		case "reorder-pages": return await reorderPages(files[0], lib, options);
		case "rotate-pages": return await rotatePages(files[0], lib, options);
		case "images-to-pdf": return await imagesToPdf(files, lib);
		case "txt-to-pdf": return await txtToPdf(files[0], lib);
		case "add-watermark": return await addWatermark(files[0], lib, options);
		case "add-page-numbers": return await addPageNumbers(files[0], lib, options);
		case "add-text": return await addText(files[0], lib, options);
		case "add-images": return await addImagesToPdf(files[0], lib, options);
		case "add-signature": return await addSignature(files[0], lib, options);
		case "crop-pages": return await cropPages(files[0], lib, options);
		case "edit-metadata": return await editMetadata(files[0], lib, options);
		case "highlight":
		case "draw-annotate": return await annotate(files[0], lib, options);
		default: throw new Error(`Unsupported tool: ${tool.id}`);
	}
}
async function mergePdf(files, lib) {
	window.updateProgress?.("Merging PDFs...");
	const mergedDoc = await lib.PDFDocument.create();
	for (let i = 0; i < files.length; i++) {
		window.updateProgress?.(`Processing file ${i + 1} of ${files.length}...`);
		const bytes = await files[i].arrayBuffer();
		let srcDoc;
		try {
			srcDoc = await lib.PDFDocument.load(bytes, { ignoreEncryption: true });
		} catch (e) {
			throw new Error(`Failed to load ${files[i].name}: ${e.message}`);
		}
		(await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices())).forEach((page) => mergedDoc.addPage(page));
	}
	window.updateProgress?.("Generating output...");
	const pdfBytes = await mergedDoc.save();
	const blob = new Blob([pdfBytes], { type: "application/pdf" });
	return {
		blob,
		fileName: "merged.pdf",
		size: blob.size
	};
}
async function splitPdf(file, lib, options) {
	window.updateProgress?.("Reading PDF...");
	const bytes = await file.arrayBuffer();
	const srcDoc = await lib.PDFDocument.load(bytes, { ignoreEncryption: true });
	const totalPages = srcDoc.getPageCount();
	if (options.splitMethod === "each") {
		window.updateProgress?.("Splitting pages...");
		const { default: JSZip } = await __vitePreload(async () => {
			const { default: JSZip } = await import("https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm");
			return { default: JSZip };
		}, []);
		const zip = new JSZip();
		for (let i = 0; i < totalPages; i++) {
			window.updateProgress?.(`Page ${i + 1} of ${totalPages}...`);
			const newDoc = await lib.PDFDocument.create();
			const [copiedPage] = await newDoc.copyPages(srcDoc, [i]);
			newDoc.addPage(copiedPage);
			const pageBytes = await newDoc.save();
			zip.file(`page_${i + 1}.pdf`, pageBytes);
		}
		window.updateProgress?.("Creating ZIP archive...");
		const zipBlob = await zip.generateAsync({ type: "blob" });
		return {
			blob: zipBlob,
			fileName: "split_pages.zip",
			size: zipBlob.size
		};
	} else {
		const ranges = parsePageRanges(options.splitRange, totalPages);
		if (ranges.length === 0) throw new Error("Invalid page range");
		const newDoc = await lib.PDFDocument.create();
		const indices = [...new Set(ranges)].sort((a, b) => a - b);
		(await newDoc.copyPages(srcDoc, indices)).forEach((p) => newDoc.addPage(p));
		window.updateProgress?.("Generating output...");
		const pdfBytes = await newDoc.save();
		const blob = new Blob([pdfBytes], { type: "application/pdf" });
		return {
			blob,
			fileName: "split.pdf",
			size: blob.size
		};
	}
}
async function extractPages(file, lib, options) {
	window.updateProgress?.("Reading PDF...");
	const bytes = await file.arrayBuffer();
	const srcDoc = await lib.PDFDocument.load(bytes, { ignoreEncryption: true });
	const totalPages = srcDoc.getPageCount();
	const newDoc = await lib.PDFDocument.create();
	const half = Math.ceil(totalPages / 2);
	const indices = Array.from({ length: half }, (_, i) => i);
	window.updateProgress?.("Extracting pages...");
	(await newDoc.copyPages(srcDoc, indices)).forEach((p) => newDoc.addPage(p));
	const pdfBytes = await newDoc.save();
	const blob = new Blob([pdfBytes], { type: "application/pdf" });
	return {
		blob,
		fileName: "extracted.pdf",
		size: blob.size
	};
}
async function deletePages(file, lib, options) {
	window.updateProgress?.("Reading PDF...");
	const bytes = await file.arrayBuffer();
	const srcDoc = await lib.PDFDocument.load(bytes, { ignoreEncryption: true });
	const totalPages = srcDoc.getPageCount();
	if (totalPages <= 1) throw new Error("Cannot delete pages from a single-page document");
	const newDoc = await lib.PDFDocument.create();
	const indices = Array.from({ length: totalPages - 1 }, (_, i) => i);
	window.updateProgress?.("Removing pages...");
	(await newDoc.copyPages(srcDoc, indices)).forEach((p) => newDoc.addPage(p));
	const pdfBytes = await newDoc.save();
	const blob = new Blob([pdfBytes], { type: "application/pdf" });
	return {
		blob,
		fileName: "modified.pdf",
		size: blob.size
	};
}
async function reorderPages(file, lib, options) {
	window.updateProgress?.("Reading PDF...");
	const bytes = await file.arrayBuffer();
	const srcDoc = await lib.PDFDocument.load(bytes, { ignoreEncryption: true });
	const totalPages = srcDoc.getPageCount();
	const newDoc = await lib.PDFDocument.create();
	const indices = Array.from({ length: totalPages }, (_, i) => totalPages - 1 - i);
	window.updateProgress?.("Reordering pages...");
	(await newDoc.copyPages(srcDoc, indices)).forEach((p) => newDoc.addPage(p));
	const pdfBytes = await newDoc.save();
	const blob = new Blob([pdfBytes], { type: "application/pdf" });
	return {
		blob,
		fileName: "reordered.pdf",
		size: blob.size
	};
}
async function rotatePages(file, lib, options) {
	window.updateProgress?.("Reading PDF...");
	const bytes = await file.arrayBuffer();
	const doc = await lib.PDFDocument.load(bytes, { ignoreEncryption: true });
	const rotation = options.rotation || 90;
	window.updateProgress?.("Rotating pages...");
	const pages = doc.getPages();
	for (const page of pages) {
		const currentRotation = page.getRotation().angle;
		page.setRotation(lib.degrees(currentRotation + rotation));
	}
	const pdfBytes = await doc.save();
	const blob = new Blob([pdfBytes], { type: "application/pdf" });
	return {
		blob,
		fileName: "rotated.pdf",
		size: blob.size
	};
}
async function imagesToPdf(files, lib) {
	window.updateProgress?.("Creating PDF...");
	const doc = await lib.PDFDocument.create();
	for (let i = 0; i < files.length; i++) {
		window.updateProgress?.(`Adding image ${i + 1} of ${files.length}...`);
		const imgBytes = await files[i].arrayBuffer();
		const uint8 = new Uint8Array(imgBytes);
		let image;
		const type = files[i].type;
		if (type === "image/png") image = await doc.embedPng(uint8);
		else if (type === "image/jpeg" || type === "image/jpg") image = await doc.embedJpg(uint8);
		else {
			const bitmap = await createImageBitmap(files[i]);
			const canvas = document.createElement("canvas");
			canvas.width = bitmap.width;
			canvas.height = bitmap.height;
			canvas.getContext("2d").drawImage(bitmap, 0, 0);
			const pngDataUrl = canvas.toDataURL("image/png");
			const pngBytes = Uint8Array.from(atob(pngDataUrl.split(",")[1]), (c) => c.charCodeAt(0));
			image = await doc.embedPng(pngBytes);
			canvas.width = 0;
			canvas.height = 0;
			bitmap.close();
		}
		const { width, height } = image.scale(1);
		doc.addPage([width, height]).drawImage(image, {
			x: 0,
			y: 0,
			width,
			height
		});
	}
	window.updateProgress?.("Generating PDF...");
	const pdfBytes = await doc.save();
	const blob = new Blob([pdfBytes], { type: "application/pdf" });
	return {
		blob,
		fileName: "images.pdf",
		size: blob.size
	};
}
async function txtToPdf(file, lib) {
	window.updateProgress?.("Reading text file...");
	const text = await file.text();
	const doc = await lib.PDFDocument.create();
	const font = await doc.embedFont(lib.StandardFonts.Helvetica);
	const fontSize = 12;
	const margin = 50;
	const lineHeight = fontSize * 1.5;
	const lines = text.split("\n");
	let page = doc.addPage([612, 792]);
	let y = 742;
	window.updateProgress?.("Creating PDF pages...");
	for (const line of lines) {
		if (y < 68) {
			page = doc.addPage([612, 792]);
			y = 742;
		}
		const truncatedLine = line.substring(0, 200);
		try {
			page.drawText(truncatedLine || " ", {
				x: margin,
				y,
				size: fontSize,
				font,
				color: lib.rgb(0, 0, 0)
			});
		} catch {
			page.drawText("[unsupported characters]", {
				x: margin,
				y,
				size: fontSize,
				font,
				color: lib.rgb(.5, .5, .5)
			});
		}
		y -= lineHeight;
	}
	const pdfBytes = await doc.save();
	const blob = new Blob([pdfBytes], { type: "application/pdf" });
	return {
		blob,
		fileName: file.name.replace(/\.txt$/i, "") + ".pdf",
		size: blob.size
	};
}
async function addWatermark(file, lib, options) {
	window.updateProgress?.("Reading PDF...");
	const bytes = await file.arrayBuffer();
	const doc = await lib.PDFDocument.load(bytes, { ignoreEncryption: true });
	const text = options.watermarkText || "PDFly";
	const opacity = options.watermarkOpacity || .15;
	const font = await doc.embedFont(lib.StandardFonts.HelveticaBold);
	window.updateProgress?.("Adding watermark...");
	const pages = doc.getPages();
	for (const page of pages) {
		const { width, height } = page.getSize();
		const fontSize = Math.min(width, height) * .12;
		page.drawText(text, {
			x: width / 2 - font.widthOfTextAtSize(text, fontSize) / 2,
			y: height / 2,
			size: fontSize,
			font,
			color: lib.rgb(.5, .5, .5),
			opacity,
			rotate: lib.degrees(-45)
		});
	}
	const pdfBytes = await doc.save();
	const blob = new Blob([pdfBytes], { type: "application/pdf" });
	return {
		blob,
		fileName: "watermarked.pdf",
		size: blob.size
	};
}
async function addPageNumbers(file, lib, options) {
	window.updateProgress?.("Reading PDF...");
	const bytes = await file.arrayBuffer();
	const doc = await lib.PDFDocument.load(bytes, { ignoreEncryption: true });
	const font = await doc.embedFont(lib.StandardFonts.Helvetica);
	const fontSize = 10;
	const position = options.pageNumPosition || "bottom-center";
	window.updateProgress?.("Adding page numbers...");
	const pages = doc.getPages();
	pages.forEach((page, idx) => {
		const { width, height } = page.getSize();
		const text = `${idx + 1} / ${pages.length}`;
		const textWidth = font.widthOfTextAtSize(text, fontSize);
		let x, y;
		switch (position) {
			case "bottom-center":
				x = (width - textWidth) / 2;
				y = 25;
				break;
			case "bottom-right":
				x = width - textWidth - 30;
				y = 25;
				break;
			case "bottom-left":
				x = 30;
				y = 25;
				break;
			case "top-center":
				x = (width - textWidth) / 2;
				y = height - 30;
				break;
			default:
				x = (width - textWidth) / 2;
				y = 25;
		}
		page.drawText(text, {
			x,
			y,
			size: fontSize,
			font,
			color: lib.rgb(.3, .3, .3)
		});
	});
	const pdfBytes = await doc.save();
	const blob = new Blob([pdfBytes], { type: "application/pdf" });
	return {
		blob,
		fileName: "numbered.pdf",
		size: blob.size
	};
}
async function addText(file, lib, options) {
	window.updateProgress?.("Reading PDF...");
	const bytes = await file.arrayBuffer();
	const doc = await lib.PDFDocument.load(bytes, { ignoreEncryption: true });
	const font = await doc.embedFont(lib.StandardFonts.Helvetica);
	const text = options.text || "PDFly";
	window.updateProgress?.("Adding text...");
	const page = doc.getPages()[0];
	const { width } = page.getSize();
	page.drawText(text, {
		x: 50,
		y: 50,
		size: 16,
		font,
		color: lib.rgb(0, 0, 0)
	});
	const pdfBytes = await doc.save();
	const blob = new Blob([pdfBytes], { type: "application/pdf" });
	return {
		blob,
		fileName: "text_added.pdf",
		size: blob.size
	};
}
async function addImagesToPdf(file, lib, options) {
	throw new Error("This tool requires the interactive page editor. Coming soon.");
}
async function addSignature(file, lib, options) {
	throw new Error("Signature drawing requires the interactive canvas editor. Coming soon.");
}
async function cropPages(file, lib, options) {
	window.updateProgress?.("Reading PDF...");
	const bytes = await file.arrayBuffer();
	const doc = await lib.PDFDocument.load(bytes, { ignoreEncryption: true });
	window.updateProgress?.("Cropping pages...");
	const pages = doc.getPages();
	for (const page of pages) {
		const { width, height } = page.getSize();
		const cropX = width * .1;
		const cropY = height * .1;
		page.setCropBox(cropX, cropY, width - cropX * 2, height - cropY * 2);
	}
	const pdfBytes = await doc.save();
	const blob = new Blob([pdfBytes], { type: "application/pdf" });
	return {
		blob,
		fileName: "cropped.pdf",
		size: blob.size
	};
}
async function editMetadata(file, lib, options) {
	window.updateProgress?.("Reading PDF...");
	const bytes = await file.arrayBuffer();
	const doc = await lib.PDFDocument.load(bytes, { ignoreEncryption: true });
	window.updateProgress?.("Updating metadata...");
	doc.setTitle(options.title || "Untitled");
	doc.setAuthor(options.author || "PDFly");
	doc.setSubject(options.subject || "");
	doc.setCreator("PDFly — Browser PDF Tools");
	doc.setProducer("PDFly");
	doc.setCreationDate(/* @__PURE__ */ new Date());
	doc.setModificationDate(/* @__PURE__ */ new Date());
	const pdfBytes = await doc.save();
	const blob = new Blob([pdfBytes], { type: "application/pdf" });
	return {
		blob,
		fileName: "metadata_updated.pdf",
		size: blob.size
	};
}
async function annotate(file, lib, options) {
	throw new Error("Annotation tools require the interactive canvas editor. Coming soon.");
}
function parsePageRanges(rangeStr, totalPages) {
	if (!rangeStr) return [];
	const indices = [];
	const parts = rangeStr.split(",").map((s) => s.trim());
	for (const part of parts) if (part.includes("-")) {
		const [start, end] = part.split("-").map((n) => parseInt(n.trim()));
		if (isNaN(start) || isNaN(end)) continue;
		for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) indices.push(i - 1);
	} else {
		const num = parseInt(part);
		if (!isNaN(num) && num >= 1 && num <= totalPages) indices.push(num - 1);
	}
	return indices;
}
export { process };
