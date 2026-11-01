// \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
// src/i18n.js
var translations = {
	ar: {
		"nav.tools": "الأدوات",
		"nav.categories": "التصنيفات",
		"nav.about": "حول",
		"nav.privacy": "الخصوصية",
		"nav.allTools": "جميع الأدوات",
		"hero.title": "كل اللي محتاجه علشان تتعامل مع ملفاتك بسهولة",
		"hero.subtitle": "حوّل، نظّم، عدّل، وحسّن مستنداتك مباشرة في متصفحك. مصمم للخصوصية.",
		"hero.upload": "اختر ملفاً أو اسحبه هنا",
		"hero.uploadHint": "أو اسحب وأفلت الملف هنا",
		"hero.browse": "تصفح الملفات",
		"hero.privacy": "ملفاتك لا تغادر جهازك أبداً",
		"hero.supported": "PDF, DOCX, XLSX, PPTX, TXT, JPG, PNG",
		"quick.title": "أدوات سريعة",
		"quick.subtitle": "الأدوات الأكثر استخداماً في متناول يدك",
		"cat.title": "جميع الأدوات",
		"cat.subtitle": "استكشف مجموعة أدواتنا الكاملة",
		"cat.convertPdf": "تحويل PDF",
		"cat.convertToPdf": "تحويل إلى PDF",
		"cat.editPdf": "تعديل PDF",
		"cat.organizePdf": "تنظيم PDF",
		"cat.optimizePdf": "تحسين PDF",
		"cat.ocr": "OCR واستخراج النصوص",
		"cat.office": "مستندات أوفيس",
		"how.title": "كيف يعمل",
		"how.subtitle": "ثلاث خطوات بسيطة",
		"how.step1.title": "اختر ملفك",
		"how.step1.desc": "اسحب وأفلت أو اختر الملف من جهازك",
		"how.step2.title": "المعالجة في متصفحك",
		"how.step2.desc": "يتم تحويل ملفك مباشرة في المتصفح بدون أي سيرفر",
		"how.step3.title": "حمّل النتيجة",
		"how.step3.desc": "احصل على ملفك المحوّل فوراً",
		"privacy.title": "خصوصيتك أولاً",
		"privacy.subtitle": "معالجة كاملة على جهازك",
		"privacy.desc": "جميع عمليات التحويل والمعالجة تتم محلياً في متصفحك. ملفاتك لا تُرسل إلى أي سيرفر خارجي. نقوم فقط بتحميل محركات المعالجة (مكتبات برمجية ثابتة)، أما محتوى ملفاتك فيبقى على جهازك دائماً.",
		"privacy.point1": "لا رفع ملفات لأي سيرفر",
		"privacy.point2": "لا تخزين سحابي",
		"privacy.point3": "لا حسابات مستخدمين",
		"privacy.point4": "معالجة كاملة في المتصفح",
		"footer.brand": "PDFly",
		"footer.tagline": "كل ملفاتك. كل أدواتك. في مكان واحد.",
		"footer.tools": "الأدوات",
		"footer.company": "الشركة",
		"footer.about": "حول PDFly",
		"footer.privacyPolicy": "سياسة الخصوصية",
		"footer.terms": "شروط الاستخدام",
		"footer.copyright": "© 2026 PDFly. جميع الحقوق محفوظة.",
		"footer.legal": "معلومات قانونية",
		"tool.wordToPdf": "Word إلى PDF",
		"tool.pdfToWord": "PDF إلى Word",
		"tool.excelToPdf": "Excel إلى PDF",
		"tool.pdfToExcel": "PDF إلى Excel",
		"tool.pptToPdf": "PowerPoint إلى PDF",
		"tool.pdfToPpt": "PDF إلى PowerPoint",
		"tool.txtToPdf": "نص إلى PDF",
		"tool.imgToPdf": "صور إلى PDF",
		"tool.pdfToImg": "PDF إلى صور",
		"tool.pdfToTxt": "PDF إلى نص",
		"tool.pdfToHtml": "PDF إلى HTML",
		"tool.mergePdf": "دمج PDF",
		"tool.splitPdf": "تقسيم PDF",
		"tool.extractPages": "استخراج صفحات",
		"tool.deletePages": "حذف صفحات",
		"tool.reorderPages": "إعادة ترتيب الصفحات",
		"tool.rotatePages": "تدوير الصفحات",
		"tool.addText": "إضافة نص",
		"tool.addImages": "إضافة صور",
		"tool.addWatermark": "إضافة علامة مائية",
		"tool.addPageNumbers": "إضافة أرقام الصفحات",
		"tool.addSignature": "إضافة توقيع",
		"tool.highlight": "تظليل المحتوى",
		"tool.drawAnnotate": "رسم وتعليق",
		"tool.cropPages": "اقتصاص الصفحات",
		"tool.editMetadata": "تعديل البيانات الوصفية",
		"tool.compressPdf": "ضغط PDF",
		"tool.optimizePdf": "تحسين PDF",
		"tool.grayscale": "تحويل لتدرج الرمادي",
		"tool.ocrArabic": "OCR عربي",
		"tool.ocrEnglish": "OCR إنجليزي",
		"tool.ocrMixed": "OCR عربي + إنجليزي",
		"tool.extractImages": "استخراج الصور",
		"tool.extractTables": "استخراج الجداول",
		"tool.textExtraction": "استخراج النصوص",
		"tool.docCompare": "مقارنة المستندات",
		"tool.docStats": "إحصائيات المستند",
		"tool.wordToPdf.desc": "تحويل مستندات Word إلى PDF",
		"tool.pdfToWord.desc": "تحويل PDF إلى مستند Word قابل للتعديل",
		"tool.excelToPdf.desc": "تحويل جداول Excel إلى PDF",
		"tool.pdfToExcel.desc": "استخراج جداول البيانات من PDF",
		"tool.imgToPdf.desc": "تحويل صور متعددة إلى ملف PDF واحد",
		"tool.pdfToImg.desc": "تحويل صفحات PDF إلى صور",
		"tool.mergePdf.desc": "دمج عدة ملفات PDF في ملف واحد",
		"tool.splitPdf.desc": "تقسيم ملف PDF إلى ملفات متعددة",
		"tool.compressPdf.desc": "تقليل حجم ملف PDF",
		"tool.ocrArabic.desc": "استخراج النص العربي من الصور والمستندات الممسوحة",
		"tool.addWatermark.desc": "إضافة علامة مائية نصية أو صورة",
		"tool.rotatePages.desc": "تدوير صفحات PDF بزاوية محددة",
		"tool.extractPages.desc": "استخراج صفحات محددة من ملف PDF",
		"tool.deletePages.desc": "حذف صفحات من ملف PDF",
		"tool.reorderPages.desc": "إعادة ترتيب صفحات PDF بالسحب والإفلات",
		"tool.pdfToTxt.desc": "استخراج النص من ملفات PDF",
		"tool.txtToPdf.desc": "تحويل ملفات نصية إلى PDF",
		"tool.pdfToHtml.desc": "تحويل PDF إلى صفحة HTML",
		"tool.pptToPdf.desc": "تحويل عروض PowerPoint إلى PDF",
		"tool.pdfToPpt.desc": "تحويل PDF إلى عرض PowerPoint",
		"tool.addText.desc": "إضافة نص على صفحات PDF",
		"tool.addImages.desc": "إضافة صور على صفحات PDF",
		"tool.addPageNumbers.desc": "إضافة أرقام تلقائية للصفحات",
		"tool.addSignature.desc": "إضافة توقيع رقمي أو مرسوم",
		"tool.highlight.desc": "تظليل النصوص في PDF",
		"tool.drawAnnotate.desc": "رسم وإضافة تعليقات",
		"tool.cropPages.desc": "اقتصاص صفحات PDF",
		"tool.editMetadata.desc": "تعديل عنوان ومؤلف وبيانات PDF",
		"tool.optimizePdf.desc": "تحسين بنية ملف PDF",
		"tool.grayscale.desc": "تحويل ألوان PDF إلى تدرج الرمادي",
		"tool.ocrEnglish.desc": "استخراج النص الإنجليزي من الصور",
		"tool.ocrMixed.desc": "استخراج نص عربي وإنجليزي معاً",
		"tool.extractImages.desc": "استخراج جميع الصور من ملف PDF",
		"tool.extractTables.desc": "استخراج الجداول من PDF",
		"tool.textExtraction.desc": "استخراج جميع النصوص من مستند",
		"tool.docCompare.desc": "مقارنة مستندين لإيجاد الفروقات",
		"tool.docStats.desc": "إحصائيات تفصيلية عن المستند",
		"ui.darkMode": "الوضع الداكن",
		"ui.lightMode": "الوضع الفاتح",
		"ui.language": "English",
		"ui.download": "تحميل",
		"ui.process": "معالجة",
		"ui.cancel": "إلغاء",
		"ui.reset": "إعادة تعيين",
		"ui.back": "رجوع",
		"ui.next": "التالي",
		"ui.close": "إغلاق",
		"ui.selectFile": "اختر ملفاً",
		"ui.selectFiles": "اختر ملفات",
		"ui.dragDrop": "أو اسحب وأفلت هنا",
		"ui.processing": "جاري إتمام المعالجة بكل دقة...",
		"ui.success": "تمت العملية بنجاح تام وبأعلى جودة",
		"ui.error": "عذراً، تعذرت المعالجة",
		"ui.errorDesc": "نعتذر منك، واجه النظام صعوبة أثناء قراءة أو معالجة المستند. يرجى التأكد من سلامة الملف والمحاولة مجدداً.",
		"ui.tryAgain": "إعادة المحاولة الآن",
		"ui.processAnother": "معالجة ملف جديد",
		"ui.backToTools": "العودة لجميع الأدوات",
		"ui.fileInfo": "تفاصيل المستند",
		"ui.fileName": "اسم الملف",
		"ui.fileSize": "الحجم الإجمالي",
		"ui.fileType": "نوع الملف",
		"ui.pages": "عدد الصفحات",
		"ui.startConversion": "بدء المعالجة والتحويل",
		"ui.converting": "جاري المعالجة الآمنة في متصفحك...",
		"ui.readingFile": "جاري قراءة محتويات الملف محلياً...",
		"ui.initEngine": "جاري تهيئة محرك المعالجة المتطور...",
		"ui.generatingOutput": "جاري إنشاء المستند النهائي بأعلى دقة...",
		"ui.preparingDownload": "الملف جاهز للتحميل المباشر...",
		"ui.conversionComplete": "تم تجهيز مستندك بنجاح",
		"ui.downloadResult": "تحميل المستند الآن",
		"ui.invalidFile": "عذراً، صيغة هذا الملف غير مدعومة في هذه الأداة",
		"ui.fileTooLarge": "عذراً، حجم الملف يتجاوز الحد المسموح به للمعالجة الفورية",
		"ui.corruptedFile": "يبدو أن الملف تالف أو محمي بكلمة مرور لا يمكن فكها",
		"ui.maxFileSize": "أقصى حجم مسموح به",
		"ui.supportedFormats": "الصيغ المتوافقة",
		"ui.quality": "مستوى الجودة والدقة",
		"ui.high": "عالية وفائقة الوضوح",
		"ui.medium": "متوازنة ومثالية",
		"ui.low": "مضغوطة وخفيفة الحجم",
		"ui.addFiles": "إضافة ملفات",
		"ui.removeAll": "إزالة الكل",
		"ui.remove": "إزالة",
		"ui.page": "صفحة",
		"ui.of": "من",
		"ui.menu": "القائمة"
	},
	en: {
		"nav.tools": "Tools",
		"nav.categories": "Categories",
		"nav.about": "About",
		"nav.privacy": "Privacy",
		"nav.allTools": "All Tools",
		"hero.title": "Everything you need to work with documents",
		"hero.subtitle": "Convert, organize, edit, and optimize your documents directly in your browser. Private by design.",
		"hero.upload": "Choose a file or drag it here",
		"hero.uploadHint": "or drag and drop files here",
		"hero.browse": "Browse Files",
		"hero.privacy": "Your files never leave your device",
		"hero.supported": "PDF, DOCX, XLSX, PPTX, TXT, JPG, PNG",
		"quick.title": "Quick Tools",
		"quick.subtitle": "Most used tools at your fingertips",
		"cat.title": "All Tools",
		"cat.subtitle": "Explore our complete toolkit",
		"cat.convertPdf": "Convert PDF",
		"cat.convertToPdf": "Convert to PDF",
		"cat.editPdf": "Edit PDF",
		"cat.organizePdf": "Organize PDF",
		"cat.optimizePdf": "Optimize PDF",
		"cat.ocr": "OCR & Text Extraction",
		"cat.office": "Office Documents",
		"how.title": "How It Works",
		"how.subtitle": "Three simple steps",
		"how.step1.title": "Choose Your File",
		"how.step1.desc": "Drag and drop or select files from your device",
		"how.step2.title": "Process in Your Browser",
		"how.step2.desc": "Your file is converted directly in the browser — no server involved",
		"how.step3.title": "Download Result",
		"how.step3.desc": "Get your converted file instantly",
		"privacy.title": "Privacy First",
		"privacy.subtitle": "Complete on-device processing",
		"privacy.desc": "All conversion and processing happens locally in your browser. Your files are never sent to any external server. We only download processing engines (static software libraries) — your document contents always stay on your device.",
		"privacy.point1": "No file uploads to any server",
		"privacy.point2": "No cloud storage",
		"privacy.point3": "No user accounts",
		"privacy.point4": "Complete in-browser processing",
		"footer.brand": "PDFly",
		"footer.tagline": "All your files. All your tools. In one place.",
		"footer.tools": "Tools",
		"footer.company": "Company",
		"footer.about": "About PDFly",
		"footer.privacyPolicy": "Privacy Policy",
		"footer.terms": "Terms of Use",
		"footer.copyright": "© 2026 PDFly. All rights reserved.",
		"footer.legal": "Legal",
		"tool.wordToPdf": "Word to PDF",
		"tool.pdfToWord": "PDF to Word",
		"tool.excelToPdf": "Excel to PDF",
		"tool.pdfToExcel": "PDF to Excel",
		"tool.pptToPdf": "PowerPoint to PDF",
		"tool.pdfToPpt": "PDF to PowerPoint",
		"tool.txtToPdf": "Text to PDF",
		"tool.imgToPdf": "Images to PDF",
		"tool.pdfToImg": "PDF to Images",
		"tool.pdfToTxt": "PDF to Text",
		"tool.pdfToHtml": "PDF to HTML",
		"tool.mergePdf": "Merge PDF",
		"tool.splitPdf": "Split PDF",
		"tool.extractPages": "Extract Pages",
		"tool.deletePages": "Delete Pages",
		"tool.reorderPages": "Reorder Pages",
		"tool.rotatePages": "Rotate Pages",
		"tool.addText": "Add Text",
		"tool.addImages": "Add Images",
		"tool.addWatermark": "Add Watermark",
		"tool.addPageNumbers": "Add Page Numbers",
		"tool.addSignature": "Add Signature",
		"tool.highlight": "Highlight Content",
		"tool.drawAnnotate": "Draw & Annotate",
		"tool.cropPages": "Crop Pages",
		"tool.editMetadata": "Edit Metadata",
		"tool.compressPdf": "Compress PDF",
		"tool.optimizePdf": "Optimize PDF",
		"tool.grayscale": "Convert to Grayscale",
		"tool.ocrArabic": "OCR Arabic",
		"tool.ocrEnglish": "OCR English",
		"tool.ocrMixed": "OCR Arabic + English",
		"tool.extractImages": "Extract Images",
		"tool.extractTables": "Extract Tables",
		"tool.textExtraction": "Text Extraction",
		"tool.docCompare": "Document Comparison",
		"tool.docStats": "Document Statistics",
		"tool.wordToPdf.desc": "Convert Word documents to PDF format",
		"tool.pdfToWord.desc": "Convert PDF to editable Word document",
		"tool.excelToPdf.desc": "Convert Excel spreadsheets to PDF",
		"tool.pdfToExcel.desc": "Extract spreadsheet data from PDF",
		"tool.imgToPdf.desc": "Combine multiple images into one PDF",
		"tool.pdfToImg.desc": "Convert PDF pages to images",
		"tool.mergePdf.desc": "Combine multiple PDFs into one file",
		"tool.splitPdf.desc": "Split PDF into multiple files",
		"tool.compressPdf.desc": "Reduce PDF file size",
		"tool.ocrArabic.desc": "Extract Arabic text from scanned documents",
		"tool.addWatermark.desc": "Add text or image watermark",
		"tool.rotatePages.desc": "Rotate PDF pages to any angle",
		"tool.extractPages.desc": "Extract specific pages from PDF",
		"tool.deletePages.desc": "Remove pages from PDF",
		"tool.reorderPages.desc": "Reorder PDF pages with drag and drop",
		"tool.pdfToTxt.desc": "Extract text content from PDF files",
		"tool.txtToPdf.desc": "Convert text files to PDF format",
		"tool.pdfToHtml.desc": "Convert PDF to HTML page",
		"tool.pptToPdf.desc": "Convert PowerPoint presentations to PDF",
		"tool.pdfToPpt.desc": "Convert PDF to PowerPoint format",
		"tool.addText.desc": "Add text overlays to PDF pages",
		"tool.addImages.desc": "Insert images into PDF pages",
		"tool.addPageNumbers.desc": "Add automatic page numbering",
		"tool.addSignature.desc": "Add digital or drawn signatures",
		"tool.highlight.desc": "Highlight text content in PDF",
		"tool.drawAnnotate.desc": "Draw and add annotations",
		"tool.cropPages.desc": "Crop PDF page dimensions",
		"tool.editMetadata.desc": "Edit PDF title, author, and metadata",
		"tool.optimizePdf.desc": "Optimize PDF file structure",
		"tool.grayscale.desc": "Convert PDF colors to grayscale",
		"tool.ocrEnglish.desc": "Extract English text from images",
		"tool.ocrMixed.desc": "Extract mixed Arabic and English text",
		"tool.extractImages.desc": "Extract all images from a PDF file",
		"tool.extractTables.desc": "Extract tables from PDF documents",
		"tool.textExtraction.desc": "Extract all text from a document",
		"tool.docCompare.desc": "Compare two documents for differences",
		"tool.docStats.desc": "Detailed document statistics",
		"ui.darkMode": "Dark Mode",
		"ui.lightMode": "Light Mode",
		"ui.language": "العربية",
		"ui.download": "Download",
		"ui.process": "Process",
		"ui.cancel": "Cancel",
		"ui.reset": "Reset",
		"ui.back": "Back",
		"ui.next": "Next",
		"ui.close": "Close",
		"ui.selectFile": "Select File",
		"ui.selectFiles": "Select Files",
		"ui.dragDrop": "or drag and drop here",
		"ui.processing": "Processing with precision...",
		"ui.success": "Completed successfully with high quality",
		"ui.error": "Processing encountered an issue",
		"ui.errorDesc": "We could not complete processing this file. Please ensure the document is not corrupted or password-protected, then try again.",
		"ui.tryAgain": "Try Again",
		"ui.processAnother": "Process Another File",
		"ui.backToTools": "Back to All Tools",
		"ui.fileInfo": "Document Details",
		"ui.fileName": "File Name",
		"ui.fileSize": "Total Size",
		"ui.fileType": "File Type",
		"ui.pages": "Pages",
		"ui.startConversion": "Start Processing",
		"ui.converting": "Processing securely in your browser...",
		"ui.readingFile": "Reading file locally...",
		"ui.initEngine": "Initializing processing engine...",
		"ui.generatingOutput": "Generating high-fidelity output...",
		"ui.preparingDownload": "Preparing download...",
		"ui.conversionComplete": "Document Ready",
		"ui.downloadResult": "Download File Now",
		"ui.invalidFile": "Unsupported file format for this tool",
		"ui.fileTooLarge": "File size exceeds maximum supported limit",
		"ui.corruptedFile": "The document seems damaged or password-protected",
		"ui.maxFileSize": "Max Allowed Size",
		"ui.supportedFormats": "Supported Formats",
		"ui.quality": "Quality Level",
		"ui.high": "High & Crisp",
		"ui.medium": "Balanced",
		"ui.low": "Compact",
		"ui.addFiles": "Add Files",
		"ui.removeAll": "Remove All",
		"ui.remove": "Remove",
		"ui.page": "Page",
		"ui.of": "of",
		"ui.menu": "Menu"
	}
};
var I18n = class {
	constructor() {
		this.currentLang = localStorage.getItem("pdfly-lang") || "ar";
		this.listeners = [];
	}
	t(key) {
		return translations[this.currentLang]?.[key] || translations["en"]?.[key] || key;
	}
	get lang() {
		return this.currentLang;
	}
	get dir() {
		return this.currentLang === "ar" ? "rtl" : "ltr";
	}
	get isRTL() {
		return this.currentLang === "ar";
	}
	toggle() {
		this.setLang(this.currentLang === "ar" ? "en" : "ar");
	}
	setLang(lang) {
		this.currentLang = lang;
		localStorage.setItem("pdfly-lang", lang);
		document.documentElement.lang = lang;
		document.documentElement.dir = this.dir;
		this.listeners.forEach((fn) => fn(lang));
		this.updateDOM();
	}
	onChange(fn) {
		this.listeners.push(fn);
	}
	updateDOM() {
		document.querySelectorAll("[data-i18n]").forEach((el) => {
			const key = el.getAttribute("data-i18n");
			el.textContent = this.t(key);
		});
		document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
			const key = el.getAttribute("data-i18n-placeholder");
			el.placeholder = this.t(key);
		});
		document.querySelectorAll("[data-i18n-title]").forEach((el) => {
			const key = el.getAttribute("data-i18n-title");
			el.title = this.t(key);
		});
		document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
			const key = el.getAttribute("data-i18n-aria");
			el.setAttribute("aria-label", this.t(key));
		});
	}
	init() {
		document.documentElement.lang = this.currentLang;
		document.documentElement.dir = this.dir;
		this.updateDOM();
	}
};
var i18n = new I18n();
// src/theme.js
var ThemeManager = class {
	constructor() {
		this.theme = localStorage.getItem("pdfly-theme") || "light";
		this.listeners = [];
	}
	get isDark() {
		return this.theme === "dark";
	}
	toggle() {
		this.setTheme(this.theme === "dark" ? "light" : "dark");
	}
	setTheme(theme) {
		this.theme = theme;
		localStorage.setItem("pdfly-theme", theme);
		document.documentElement.setAttribute("data-theme", theme);
		this.listeners.forEach((fn) => fn(theme));
	}
	onChange(fn) {
		this.listeners.push(fn);
	}
	init() {
		document.documentElement.setAttribute("data-theme", this.theme);
	}
};
var theme = new ThemeManager();
// src/tools.js
var TOOL_CATEGORIES = [
	{
		id: "convert-pdf",
		nameKey: "cat.convertPdf",
		icon: "file-output"
	},
	{
		id: "convert-to-pdf",
		nameKey: "cat.convertToPdf",
		icon: "file-input"
	},
	{
		id: "edit-pdf",
		nameKey: "cat.editPdf",
		icon: "pencil"
	},
	{
		id: "organize-pdf",
		nameKey: "cat.organizePdf",
		icon: "layout-grid"
	},
	{
		id: "optimize-pdf",
		nameKey: "cat.optimizePdf",
		icon: "gauge"
	},
	{
		id: "ocr",
		nameKey: "cat.ocr",
		icon: "scan-text"
	},
	{
		id: "office",
		nameKey: "cat.office",
		icon: "file-spreadsheet"
	}
];
var TOOLS = [
	{
		id: "pdf-to-word",
		nameKey: "tool.pdfToWord",
		descKey: "tool.pdfToWord.desc",
		icon: "file-text",
		category: "convert-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "docx",
		maxSize: 104857600,
		multiFile: false,
		engine: "pdf-extract"
	},
	{
		id: "pdf-to-excel",
		nameKey: "tool.pdfToExcel",
		descKey: "tool.pdfToExcel.desc",
		icon: "table",
		category: "convert-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "xlsx",
		maxSize: 104857600,
		multiFile: false,
		engine: "pdf-extract"
	},
	{
		id: "pdf-to-ppt",
		nameKey: "tool.pdfToPpt",
		descKey: "tool.pdfToPpt.desc",
		icon: "presentation",
		category: "convert-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "pptx",
		maxSize: 104857600,
		multiFile: false,
		engine: "pdf-extract"
	},
	{
		id: "pdf-to-images",
		nameKey: "tool.pdfToImg",
		descKey: "tool.pdfToImg.desc",
		icon: "image",
		category: "convert-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "png",
		maxSize: 209715200,
		multiFile: false,
		engine: "pdfjs"
	},
	{
		id: "pdf-to-text",
		nameKey: "tool.pdfToTxt",
		descKey: "tool.pdfToTxt.desc",
		icon: "file-type",
		category: "convert-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "txt",
		maxSize: 104857600,
		multiFile: false,
		engine: "pdfjs"
	},
	{
		id: "pdf-to-html",
		nameKey: "tool.pdfToHtml",
		descKey: "tool.pdfToHtml.desc",
		icon: "code",
		category: "convert-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "html",
		maxSize: 104857600,
		multiFile: false,
		engine: "pdfjs"
	},
	{
		id: "word-to-pdf",
		nameKey: "tool.wordToPdf",
		descKey: "tool.wordToPdf.desc",
		icon: "file-text",
		category: "convert-to-pdf",
		accept: ".docx,.doc",
		acceptMime: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
		outputFormat: "pdf",
		maxSize: 104857600,
		multiFile: false,
		engine: "docx-convert"
	},
	{
		id: "excel-to-pdf",
		nameKey: "tool.excelToPdf",
		descKey: "tool.excelToPdf.desc",
		icon: "table",
		category: "convert-to-pdf",
		accept: ".xlsx,.xls",
		acceptMime: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
		outputFormat: "pdf",
		maxSize: 104857600,
		multiFile: false,
		engine: "xlsx-convert"
	},
	{
		id: "ppt-to-pdf",
		nameKey: "tool.pptToPdf",
		descKey: "tool.pptToPdf.desc",
		icon: "presentation",
		category: "convert-to-pdf",
		accept: ".pptx,.ppt",
		acceptMime: ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
		outputFormat: "pdf",
		maxSize: 209715200,
		multiFile: false,
		engine: "pptx-convert"
	},
	{
		id: "txt-to-pdf",
		nameKey: "tool.txtToPdf",
		descKey: "tool.txtToPdf.desc",
		icon: "file-type",
		category: "convert-to-pdf",
		accept: ".txt",
		acceptMime: ["text/plain"],
		outputFormat: "pdf",
		maxSize: 52428800,
		multiFile: false,
		engine: "pdf-lib"
	},
	{
		id: "images-to-pdf",
		nameKey: "tool.imgToPdf",
		descKey: "tool.imgToPdf.desc",
		icon: "images",
		category: "convert-to-pdf",
		accept: ".jpg,.jpeg,.png,.webp,.bmp,.gif",
		acceptMime: [
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/bmp",
			"image/gif"
		],
		outputFormat: "pdf",
		maxSize: 52428800,
		multiFile: true,
		engine: "pdf-lib"
	},
	{
		id: "merge-pdf",
		nameKey: "tool.mergePdf",
		descKey: "tool.mergePdf.desc",
		icon: "merge",
		category: "organize-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "pdf",
		maxSize: 209715200,
		multiFile: true,
		engine: "pdf-lib"
	},
	{
		id: "split-pdf",
		nameKey: "tool.splitPdf",
		descKey: "tool.splitPdf.desc",
		icon: "split",
		category: "organize-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "pdf",
		maxSize: 209715200,
		multiFile: false,
		engine: "pdf-lib"
	},
	{
		id: "extract-pages",
		nameKey: "tool.extractPages",
		descKey: "tool.extractPages.desc",
		icon: "file-minus",
		category: "organize-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "pdf",
		maxSize: 209715200,
		multiFile: false,
		engine: "pdf-lib"
	},
	{
		id: "delete-pages",
		nameKey: "tool.deletePages",
		descKey: "tool.deletePages.desc",
		icon: "trash-2",
		category: "organize-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "pdf",
		maxSize: 209715200,
		multiFile: false,
		engine: "pdf-lib"
	},
	{
		id: "reorder-pages",
		nameKey: "tool.reorderPages",
		descKey: "tool.reorderPages.desc",
		icon: "arrow-up-down",
		category: "organize-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "pdf",
		maxSize: 209715200,
		multiFile: false,
		engine: "pdf-lib"
	},
	{
		id: "rotate-pages",
		nameKey: "tool.rotatePages",
		descKey: "tool.rotatePages.desc",
		icon: "rotate-cw",
		category: "organize-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "pdf",
		maxSize: 209715200,
		multiFile: false,
		engine: "pdf-lib"
	},
	{
		id: "add-text",
		nameKey: "tool.addText",
		descKey: "tool.addText.desc",
		icon: "type",
		category: "edit-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "pdf",
		maxSize: 104857600,
		multiFile: false,
		engine: "pdf-lib"
	},
	{
		id: "add-images",
		nameKey: "tool.addImages",
		descKey: "tool.addImages.desc",
		icon: "image-plus",
		category: "edit-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "pdf",
		maxSize: 104857600,
		multiFile: false,
		engine: "pdf-lib"
	},
	{
		id: "add-watermark",
		nameKey: "tool.addWatermark",
		descKey: "tool.addWatermark.desc",
		icon: "droplets",
		category: "edit-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "pdf",
		maxSize: 104857600,
		multiFile: false,
		engine: "pdf-lib"
	},
	{
		id: "add-page-numbers",
		nameKey: "tool.addPageNumbers",
		descKey: "tool.addPageNumbers.desc",
		icon: "hash",
		category: "edit-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "pdf",
		maxSize: 104857600,
		multiFile: false,
		engine: "pdf-lib"
	},
	{
		id: "add-signature",
		nameKey: "tool.addSignature",
		descKey: "tool.addSignature.desc",
		icon: "pen-tool",
		category: "edit-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "pdf",
		maxSize: 104857600,
		multiFile: false,
		engine: "pdf-lib"
	},
	{
		id: "highlight",
		nameKey: "tool.highlight",
		descKey: "tool.highlight.desc",
		icon: "highlighter",
		category: "edit-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "pdf",
		maxSize: 104857600,
		multiFile: false,
		engine: "pdf-lib"
	},
	{
		id: "draw-annotate",
		nameKey: "tool.drawAnnotate",
		descKey: "tool.drawAnnotate.desc",
		icon: "pencil",
		category: "edit-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "pdf",
		maxSize: 104857600,
		multiFile: false,
		engine: "pdf-lib"
	},
	{
		id: "crop-pages",
		nameKey: "tool.cropPages",
		descKey: "tool.cropPages.desc",
		icon: "crop",
		category: "edit-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "pdf",
		maxSize: 104857600,
		multiFile: false,
		engine: "pdf-lib"
	},
	{
		id: "edit-metadata",
		nameKey: "tool.editMetadata",
		descKey: "tool.editMetadata.desc",
		icon: "info",
		category: "edit-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "pdf",
		maxSize: 104857600,
		multiFile: false,
		engine: "pdf-lib"
	},
	{
		id: "compress-pdf",
		nameKey: "tool.compressPdf",
		descKey: "tool.compressPdf.desc",
		icon: "minimize-2",
		category: "optimize-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "pdf",
		maxSize: 209715200,
		multiFile: false,
		engine: "pdf-compress"
	},
	{
		id: "optimize-pdf",
		nameKey: "tool.optimizePdf",
		descKey: "tool.optimizePdf.desc",
		icon: "zap",
		category: "optimize-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "pdf",
		maxSize: 209715200,
		multiFile: false,
		engine: "pdf-compress"
	},
	{
		id: "grayscale",
		nameKey: "tool.grayscale",
		descKey: "tool.grayscale.desc",
		icon: "contrast",
		category: "optimize-pdf",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "pdf",
		maxSize: 209715200,
		multiFile: false,
		engine: "pdf-compress"
	},
	{
		id: "ocr-arabic",
		nameKey: "tool.ocrArabic",
		descKey: "tool.ocrArabic.desc",
		icon: "scan-text",
		category: "ocr",
		accept: ".pdf,.jpg,.jpeg,.png,.webp,.bmp,.tiff",
		acceptMime: [
			"application/pdf",
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/bmp",
			"image/tiff"
		],
		outputFormat: "txt",
		maxSize: 52428800,
		multiFile: false,
		engine: "tesseract",
		ocrLang: "ara"
	},
	{
		id: "ocr-english",
		nameKey: "tool.ocrEnglish",
		descKey: "tool.ocrEnglish.desc",
		icon: "scan-text",
		category: "ocr",
		accept: ".pdf,.jpg,.jpeg,.png,.webp,.bmp,.tiff",
		acceptMime: [
			"application/pdf",
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/bmp",
			"image/tiff"
		],
		outputFormat: "txt",
		maxSize: 52428800,
		multiFile: false,
		engine: "tesseract",
		ocrLang: "eng"
	},
	{
		id: "ocr-mixed",
		nameKey: "tool.ocrMixed",
		descKey: "tool.ocrMixed.desc",
		icon: "scan-text",
		category: "ocr",
		accept: ".pdf,.jpg,.jpeg,.png,.webp,.bmp,.tiff",
		acceptMime: [
			"application/pdf",
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/bmp",
			"image/tiff"
		],
		outputFormat: "txt",
		maxSize: 52428800,
		multiFile: false,
		engine: "tesseract",
		ocrLang: "ara+eng"
	},
	{
		id: "extract-images",
		nameKey: "tool.extractImages",
		descKey: "tool.extractImages.desc",
		icon: "image-down",
		category: "ocr",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "zip",
		maxSize: 209715200,
		multiFile: false,
		engine: "pdfjs"
	},
	{
		id: "extract-tables",
		nameKey: "tool.extractTables",
		descKey: "tool.extractTables.desc",
		icon: "table-2",
		category: "ocr",
		accept: ".pdf",
		acceptMime: ["application/pdf"],
		outputFormat: "xlsx",
		maxSize: 104857600,
		multiFile: false,
		engine: "pdfjs"
	},
	{
		id: "text-extraction",
		nameKey: "tool.textExtraction",
		descKey: "tool.textExtraction.desc",
		icon: "file-search",
		category: "ocr",
		accept: ".pdf,.docx,.txt",
		acceptMime: [
			"application/pdf",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"text/plain"
		],
		outputFormat: "txt",
		maxSize: 104857600,
		multiFile: false,
		engine: "pdfjs"
	},
	{
		id: "doc-compare",
		nameKey: "tool.docCompare",
		descKey: "tool.docCompare.desc",
		icon: "diff",
		category: "ocr",
		accept: ".pdf,.txt,.docx",
		acceptMime: [
			"application/pdf",
			"text/plain",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		],
		outputFormat: "html",
		maxSize: 52428800,
		multiFile: true,
		engine: "pdfjs"
	},
	{
		id: "doc-stats",
		nameKey: "tool.docStats",
		descKey: "tool.docStats.desc",
		icon: "bar-chart-3",
		category: "ocr",
		accept: ".pdf,.txt,.docx",
		acceptMime: [
			"application/pdf",
			"text/plain",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		],
		outputFormat: "html",
		maxSize: 104857600,
		multiFile: false,
		engine: "pdfjs"
	}
];
var QUICK_TOOLS = [
	"merge-pdf",
	"split-pdf",
	"compress-pdf",
	"word-to-pdf",
	"pdf-to-word",
	"images-to-pdf",
	"pdf-to-images",
	"rotate-pages",
	"add-watermark",
	"ocr-arabic",
	"extract-pages",
	"add-page-numbers"
];
function getToolById(id) {
	return TOOLS.find((t) => t.id === id);
}
function getToolsByCategory(categoryId) {
	return TOOLS.filter((t) => t.category === categoryId);
}
function formatFileSize(bytes) {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = [
		"B",
		"KB",
		"MB",
		"GB"
	];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
// \0vite/preload-helper.js
var scriptRel = "modulepreload";
var assetsURL = function(dep) {
	return "/" + dep;
};
var seen = {};
var isCssPreloadUrl = function isCssPreloadUrl(url) {
	return url.pathname.endsWith(".css");
};
var preloadOnce = function preloadOnce(seen, href, preload) {
	if (href in seen) return seen[href];
	const promise = preload();
	if (!promise) {
		seen[href] = void 0;
		return;
	}
	const preloadPromise = promise.then(() => {
		seen[href] = void 0;
	}, (err) => {
		seen[href] = void 0;
		throw err;
	});
	seen[href] = preloadPromise;
	return preloadPromise;
};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		let preloadedHrefs;
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		function importMetaResolve(specifier) {
			if (import.meta.resolve) return new URL(import.meta.resolve(specifier));
			return new URL(
				specifier,
				/** #__KEEP__ */
				import.meta.url
			);
		}
		promise = allSettled(deps.map((depString) => {
			depString = assetsURL(depString, importerUrl);
			const dep = importMetaResolve(depString);
			const isCss = isCssPreloadUrl(dep);
			return preloadOnce(seen, dep.href, () => {
				if (preloadedHrefs === void 0) {
					preloadedHrefs = {
						all: /* @__PURE__ */ new Set(),
						styles: /* @__PURE__ */ new Set()
					};
					const links = document.getElementsByTagName("link");
					for (let i = links.length - 1; i >= 0; i--) {
						const link = links[i];
						preloadedHrefs.all.add(link.href);
						if (link.rel === "stylesheet") preloadedHrefs.styles.add(link.href);
					}
				}
				if ((isCss ? preloadedHrefs.styles : preloadedHrefs.all).has(dep.href)) return;
				const link = document.createElement("link");
				link.rel = isCss ? "stylesheet" : scriptRel;
				if (!isCss) link.as = "script";
				link.crossOrigin = "";
				link.href = dep.href;
				if (cspNonce) link.setAttribute("nonce", cspNonce);
				document.head.appendChild(link);
				if (isCss) return new Promise((res, rej) => {
					link.addEventListener("load", res);
					link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
				});
			});
		}).filter((p) => p !== void 0));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
export { getToolById as a, i18n as c, formatFileSize as i, QUICK_TOOLS as n, getToolsByCategory as o, TOOL_CATEGORIES as r, theme as s, __vitePreload as t };
