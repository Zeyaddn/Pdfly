const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/pdf-lib-engine-CkyWpul6.js","assets/preload-helper-B5titDsp.js","assets/pdfjs-engine-bD5tdcf4.js","assets/docx-engine-l1lNwAO9.js","assets/xlsx-engine-DKVn2ZHm.js","assets/pptx-engine-Cx45SnJN.js","assets/pdf-compress-engine-BaKlTR0n.js","assets/tesseract-engine-MvG8kqF6.js"])))=>i.map(i=>d[i]);
import { a as getToolById, c as i18n, i as formatFileSize, n as QUICK_TOOLS, o as getToolsByCategory, r as TOOL_CATEGORIES, s as theme, t as __vitePreload } from "./preload-helper-B5titDsp.js";
/* empty css                */
// src/main.js
function init() {
	theme.init();
	i18n.init();
	setupNavigation();
	renderQuickTools();
	renderCategories();
	renderFooterLinks();
	renderDropdownMenu();
	setupUploadArea();
	setupQuickConvertSelector();
	setupThemeToggle();
	setupLangToggle();
	initIcons();
}
function initIcons() {
	if (window.lucide) window.lucide.createIcons();
	else {
		const checkIcons = setInterval(() => {
			if (window.lucide) {
				clearInterval(checkIcons);
				window.lucide.createIcons();
			}
		}, 100);
		setTimeout(() => clearInterval(checkIcons), 5e3);
	}
}
function setupNavigation() {
	const mobileMenuBtn = document.getElementById("mobileMenuBtn");
	const mobileNav = document.getElementById("mobileNav");
	mobileMenuBtn?.addEventListener("click", () => {
		const isOpen = mobileNav.classList.toggle("open");
		mobileMenuBtn.setAttribute("aria-expanded", isOpen);
		const icon = mobileMenuBtn.querySelector("i");
		if (icon) {
			icon.setAttribute("data-lucide", isOpen ? "x" : "menu");
			if (window.lucide) window.lucide.createIcons();
		}
	});
	mobileNav?.querySelectorAll(".mobile-nav-link").forEach((link) => {
		link.addEventListener("click", () => {
			mobileNav.classList.remove("open");
			mobileMenuBtn.setAttribute("aria-expanded", "false");
			const icon = mobileMenuBtn.querySelector("i");
			if (icon) {
				icon.setAttribute("data-lucide", "menu");
				if (window.lucide) window.lucide.createIcons();
			}
		});
	});
	const catDropdown = document.getElementById("catDropdown");
	catDropdown?.addEventListener("click", (e) => {
		e.stopPropagation();
		catDropdown.classList.toggle("open");
	});
	document.addEventListener("click", () => {
		catDropdown?.classList.remove("open");
	});
	document.querySelectorAll("a[href^=\"#\"]").forEach((anchor) => {
		anchor.addEventListener("click", (e) => {
			const target = document.querySelector(anchor.getAttribute("href"));
			if (target) {
				e.preventDefault();
				target.scrollIntoView({
					behavior: "smooth",
					block: "start"
				});
			}
		});
	});
}
function setupThemeToggle() {
	document.getElementById("themeToggle")?.addEventListener("click", () => {
		theme.toggle();
		updateThemeIcon();
	});
	updateThemeIcon();
}
function updateThemeIcon() {
	const icon = document.getElementById("themeToggle")?.querySelector("i");
	if (icon) {
		icon.setAttribute("data-lucide", theme.isDark ? "moon" : "sun");
		if (window.lucide) window.lucide.createIcons();
	}
}
function setupLangToggle() {
	const langBtn = document.getElementById("langToggle");
	const footerLangBtn = document.getElementById("footerLangToggle");
	const toggle = () => {
		i18n.toggle();
		renderQuickTools();
		renderCategories();
		renderFooterLinks();
		renderDropdownMenu();
		renderMobileCatLinks();
		if (window.lucide) window.lucide.createIcons();
	};
	langBtn?.addEventListener("click", toggle);
	footerLangBtn?.addEventListener("click", toggle);
}
function lucideIcon(name, size = 20) {
	return `<i data-lucide="${name}" style="width:${size}px;height:${size}px;"></i>`;
}
function renderQuickTools() {
	const grid = document.getElementById("quickToolsGrid");
	if (!grid) return;
	grid.innerHTML = QUICK_TOOLS.map((toolId) => {
		const tool = getToolById(toolId);
		if (!tool) return "";
		return `
      <a href="/tool.html?id=${tool.id}" class="tool-card" data-category="${tool.category}" data-tool-id="${tool.id}">
        <div class="tool-card-icon">
          ${lucideIcon(tool.icon, 22)}
        </div>
        <div class="tool-card-name">${i18n.t(tool.nameKey)}</div>
        <div class="tool-card-desc">${i18n.t(tool.descKey)}</div>
      </a>
    `;
	}).join("");
	if (window.lucide) window.lucide.createIcons();
}
function renderCategories() {
	const container = document.getElementById("categoriesContainer");
	if (!container) return;
	const catColorMap = {
		"convert-pdf": {
			bg: "var(--cat-convert-subtle)",
			color: "var(--cat-convert)"
		},
		"convert-to-pdf": {
			bg: "var(--cat-convert-subtle)",
			color: "var(--cat-convert)"
		},
		"edit-pdf": {
			bg: "var(--cat-edit-subtle)",
			color: "var(--cat-edit)"
		},
		"organize-pdf": {
			bg: "var(--cat-organize-subtle)",
			color: "var(--cat-organize)"
		},
		"optimize-pdf": {
			bg: "var(--cat-optimize-subtle)",
			color: "var(--cat-optimize)"
		},
		"ocr": {
			bg: "var(--cat-ocr-subtle)",
			color: "var(--cat-ocr)"
		},
		"office": {
			bg: "var(--cat-office-subtle)",
			color: "var(--cat-office)"
		}
	};
	container.innerHTML = TOOL_CATEGORIES.map((cat) => {
		const tools = getToolsByCategory(cat.id);
		const colors = catColorMap[cat.id] || {
			bg: "var(--accent-subtle)",
			color: "var(--accent)"
		};
		return `
      <div class="category-group">
        <div class="category-header">
          <div class="category-icon" style="background:${colors.bg};color:${colors.color};">
            ${lucideIcon(cat.icon, 20)}
          </div>
          <h3 class="category-name">${i18n.t(cat.nameKey)}</h3>
        </div>
        <div class="category-tools-grid">
          ${tools.map((tool) => `
            <a href="/tool.html?id=${tool.id}" class="category-tool-item" data-tool-id="${tool.id}">
              <div class="category-tool-icon" style="background:${colors.bg};color:${colors.color};">
                ${lucideIcon(tool.icon, 16)}
              </div>
              <span class="category-tool-name">${i18n.t(tool.nameKey)}</span>
            </a>
          `).join("")}
        </div>
      </div>
    `;
	}).join("");
	if (window.lucide) window.lucide.createIcons();
}
function renderDropdownMenu() {
	const menu = document.getElementById("catDropdownMenu");
	if (!menu) return;
	const catColorMap = {
		"convert-pdf": {
			bg: "var(--cat-convert-subtle)",
			color: "var(--cat-convert)"
		},
		"convert-to-pdf": {
			bg: "var(--cat-convert-subtle)",
			color: "var(--cat-convert)"
		},
		"edit-pdf": {
			bg: "var(--cat-edit-subtle)",
			color: "var(--cat-edit)"
		},
		"organize-pdf": {
			bg: "var(--cat-organize-subtle)",
			color: "var(--cat-organize)"
		},
		"optimize-pdf": {
			bg: "var(--cat-optimize-subtle)",
			color: "var(--cat-optimize)"
		},
		"ocr": {
			bg: "var(--cat-ocr-subtle)",
			color: "var(--cat-ocr)"
		},
		"office": {
			bg: "var(--cat-office-subtle)",
			color: "var(--cat-office)"
		}
	};
	menu.innerHTML = TOOL_CATEGORIES.map((cat) => {
		const colors = catColorMap[cat.id] || {
			bg: "var(--accent-subtle)",
			color: "var(--accent)"
		};
		return `
      <a href="#all-tools" class="dropdown-item" role="menuitem">
        <div class="item-icon" style="background:${colors.bg};color:${colors.color};">
          ${lucideIcon(cat.icon, 18)}
        </div>
        <span>${i18n.t(cat.nameKey)}</span>
      </a>
    `;
	}).join("");
	if (window.lucide) window.lucide.createIcons();
}
function renderMobileCatLinks() {
	const container = document.getElementById("mobileCatLinks");
	if (!container) return;
	container.innerHTML = TOOL_CATEGORIES.map((cat) => {
		return `<a href="#all-tools" class="mobile-nav-link">${i18n.t(cat.nameKey)}</a>`;
	}).join("");
}
function renderFooterLinks() {
	const container = document.getElementById("footerToolLinks");
	if (!container) return;
	container.innerHTML = TOOL_CATEGORIES.map((cat) => {
		return `<a href="#all-tools" class="footer-link">${i18n.t(cat.nameKey)}</a>`;
	}).join("");
}
function setupUploadArea() {
	const uploadArea = document.getElementById("heroUpload");
	const fileInput = document.getElementById("heroFileInput");
	const browseBtn = document.getElementById("heroBrowseBtn");
	if (!uploadArea || !fileInput) return;
	browseBtn?.addEventListener("click", (e) => {
		e.stopPropagation();
		fileInput.click();
	});
	uploadArea.addEventListener("click", () => {
		fileInput.click();
	});
	uploadArea.addEventListener("keydown", (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			fileInput.click();
		}
	});
	fileInput.addEventListener("change", (e) => {
		handleFiles(e.target.files);
		fileInput.value = "";
	});
	uploadArea.addEventListener("dragover", (e) => {
		e.preventDefault();
		uploadArea.classList.add("drag-over");
	});
	uploadArea.addEventListener("dragleave", () => {
		uploadArea.classList.remove("drag-over");
	});
	uploadArea.addEventListener("drop", (e) => {
		e.preventDefault();
		uploadArea.classList.remove("drag-over");
		handleFiles(e.dataTransfer.files);
	});
	document.getElementById("selectedFileRemoveBtn")?.addEventListener("click", (e) => {
		e.stopPropagation();
		clearSelectedFile();
	});
}
var activeSelectedFile = null;
var secondMergeFile = null;
function clearSelectedFile() {
	activeSelectedFile = null;
	secondMergeFile = null;
	const preview = document.getElementById("selectedFilePreview");
	if (preview) preview.style.display = "none";
}
function handleFiles(files) {
	if (!files || files.length === 0) return;
	const file = files[0];
	activeSelectedFile = file;
	const ext = file.name.split(".").pop()?.toLowerCase();
	const preview = document.getElementById("selectedFilePreview");
	const nameEl = document.getElementById("selectedFileName");
	const sizeEl = document.getElementById("selectedFileSize");
	if (preview && nameEl && sizeEl) {
		nameEl.textContent = file.name;
		sizeEl.textContent = formatFileSize(file.size);
		preview.style.display = "block";
	}
	const fromSelect = document.getElementById("quickConvertFrom");
	if (fromSelect) {
		if (ext === "pdf") fromSelect.value = "pdf";
		else if (ext === "docx" || ext === "doc") fromSelect.value = "docx";
		else if (ext === "xlsx" || ext === "xls") fromSelect.value = "xlsx";
		else if (ext === "pptx" || ext === "ppt") fromSelect.value = "pptx";
		else if ([
			"jpg",
			"jpeg",
			"png",
			"webp",
			"bmp"
		].includes(ext)) fromSelect.value = "img";
		else if (ext === "txt") fromSelect.value = "txt";
		fromSelect.dispatchEvent(new Event("change"));
	}
	showToast(`تم اختيار الملف بنجاح: ${file.name}`, "success");
	const convertCard = document.getElementById("quickConvertCard");
	if (convertCard) {
		convertCard.scrollIntoView({
			behavior: "smooth",
			block: "nearest"
		});
		convertCard.classList.add("pulse-highlight");
		setTimeout(() => convertCard.classList.remove("pulse-highlight"), 1500);
	}
}
function setupQuickConvertSelector() {
	const fromSelect = document.getElementById("quickConvertFrom");
	const toSelect = document.getElementById("quickConvertTo");
	const goBtn = document.getElementById("quickConvertGoBtn");
	if (!fromSelect || !toSelect || !goBtn) return;
	const conversionMap = {
		pdf: [
			{
				id: "pdf-to-word",
				label: "Word (DOCX)"
			},
			{
				id: "pdf-to-excel",
				label: "Excel (XLSX)"
			},
			{
				id: "pdf-to-ppt",
				label: "PowerPoint (PPTX)"
			},
			{
				id: "pdf-to-images",
				label: "صور (JPG / PNG)"
			},
			{
				id: "pdf-to-txt",
				label: "نص (TXT)"
			},
			{
				id: "pdf-to-html",
				label: "صفحة HTML"
			},
			{
				id: "compress-pdf",
				label: "ضغط وتقليل الحجم"
			},
			{
				id: "merge-pdf",
				label: "دمج مع PDF آخر"
			},
			{
				id: "split-pdf",
				label: "تقسيم الصفحات"
			},
			{
				id: "rotate-pages",
				label: "تدوير الصفحات"
			},
			{
				id: "add-watermark",
				label: "إضافة علامة مائية"
			},
			{
				id: "ocr-arabic",
				label: "استخراج النص (OCR)"
			}
		],
		docx: [{
			id: "word-to-pdf",
			label: "ملف PDF"
		}, {
			id: "text-extraction",
			label: "استخراج نص عادي (TXT)"
		}],
		xlsx: [{
			id: "excel-to-pdf",
			label: "ملف PDF"
		}, {
			id: "extract-tables",
			label: "جدول بيانات (CSV)"
		}],
		pptx: [{
			id: "ppt-to-pdf",
			label: "ملف PDF"
		}],
		img: [
			{
				id: "images-to-pdf",
				label: "ملف PDF واحد"
			},
			{
				id: "ocr-arabic",
				label: "استخراج النص العربي (OCR)"
			},
			{
				id: "ocr-english",
				label: "استخراج النص الإنجليزي (OCR)"
			}
		],
		txt: [{
			id: "txt-to-pdf",
			label: "ملف PDF"
		}]
	};
	const extraContainer = document.getElementById("quickConvertExtra");
	const extraFields = document.getElementById("quickConvertExtraFields");
	function renderExtraFields() {
		const toolId = toSelect.value;
		if (!extraContainer || !extraFields) return;
		if (toolId === "add-watermark") {
			extraContainer.style.display = "block";
			extraFields.innerHTML = `
        <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center;">
          <div style="flex:1;min-width:200px;">
            <label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:6px;color:var(--text-secondary);">نص العلامة المائية:</label>
            <input type="text" id="quickWatermarkText" class="option-input" value="PDFly" placeholder="اكتب النص الذي تريده هنا..." style="width:100%;padding:10px 14px;border-radius:var(--radius-md);border:1px solid var(--border-secondary);background:var(--bg-tertiary);color:var(--text-primary);">
          </div>
          <div style="width:140px;">
            <label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:6px;color:var(--text-secondary);">الشفافية:</label>
            <select id="quickWatermarkOpacity" class="convert-select" style="padding:10px;">
              <option value="0.15" selected>خفيفة (15%)</option>
              <option value="0.3">متوسطة (30%)</option>
              <option value="0.5">واضحة (50%)</option>
            </select>
          </div>
        </div>
      `;
		} else if (toolId === "add-page-numbers") {
			extraContainer.style.display = "block";
			extraFields.innerHTML = `
        <div style="display:flex;gap:16px;align-items:center;">
          <div style="flex:1;">
            <label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:6px;color:var(--text-secondary);">موضع أرقام الصفحات:</label>
            <select id="quickPageNumPos" class="convert-select" style="padding:10px;">
              <option value="bottom-center" selected>أسفل - في الوسط</option>
              <option value="bottom-right">أسفل - يمين</option>
              <option value="bottom-left">أسفل - يسار</option>
              <option value="top-center">أعلى - في الوسط</option>
            </select>
          </div>
        </div>
      `;
		} else if (toolId === "merge-pdf") {
			extraContainer.style.display = "block";
			extraFields.innerHTML = `
        <div style="background:var(--bg-secondary);border:1px dashed var(--border-secondary);padding:14px;border-radius:var(--radius-md);">
          <label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:8px;color:var(--text-secondary);">اختر ملف الـ PDF الثاني لدمجه مع ملفك:</label>
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <input type="file" id="quickMergeSecondFile" accept=".pdf" style="display:none;">
            <button type="button" class="btn btn-secondary" id="quickMergeChooseBtn" style="padding:8px 16px;">
              <i data-lucide="plus-circle" style="width:16px;height:16px;"></i>
              <span>تحديد الملف الثاني</span>
            </button>
            <span id="quickMergeFileName" style="font-size:0.9rem;font-weight:500;color:var(--accent);">لم يتم اختيار ملف بعد</span>
          </div>
        </div>
      `;
			if (window.lucide) window.lucide.createIcons();
			const secondInput = document.getElementById("quickMergeSecondFile");
			const chooseBtn = document.getElementById("quickMergeChooseBtn");
			const nameLabel = document.getElementById("quickMergeFileName");
			chooseBtn?.addEventListener("click", () => secondInput?.click());
			secondInput?.addEventListener("change", (e) => {
				if (e.target.files && e.target.files[0]) {
					secondMergeFile = e.target.files[0];
					nameLabel.textContent = `الملف الثاني: ${secondMergeFile.name}`;
					nameLabel.style.color = "var(--success)";
				}
			});
		} else {
			extraContainer.style.display = "none";
			extraFields.innerHTML = "";
			secondMergeFile = null;
		}
	}
	function updateToOptions() {
		const fromVal = fromSelect.value;
		const available = conversionMap[fromVal] || [];
		toSelect.innerHTML = available.map((opt) => `<option value="${opt.id}">${opt.label}</option>`).join("");
		renderExtraFields();
	}
	fromSelect.addEventListener("change", updateToOptions);
	toSelect.addEventListener("change", renderExtraFields);
	updateToOptions();
	goBtn.addEventListener("click", async () => {
		const toolId = toSelect.value;
		if (!toolId) return;
		if (!activeSelectedFile) {
			showToast("يرجى اختيار ملف أولاً من زر تصفح الملفات بالأعلى", "error");
			document.getElementById("heroUpload")?.scrollIntoView({
				behavior: "smooth",
				block: "center"
			});
			return;
		}
		const tool = getToolById(toolId);
		if (!tool) {
			showToast("تعذر العثور على أداة التحويل المطلوبة", "error");
			return;
		}
		const options = {};
		const watermarkText = document.getElementById("quickWatermarkText");
		if (watermarkText) options.watermarkText = watermarkText.value;
		const watermarkOpacity = document.getElementById("quickWatermarkOpacity");
		if (watermarkOpacity) options.watermarkOpacity = parseFloat(watermarkOpacity.value);
		const pageNumPos = document.getElementById("quickPageNumPos");
		if (pageNumPos) options.pageNumPosition = pageNumPos.value;
		let filesToProcess = [activeSelectedFile];
		if (toolId === "merge-pdf") {
			if (!secondMergeFile) {
				showToast("يرجى تحديد الملف الثاني لإتمام عملية الدمج", "error");
				document.getElementById("quickMergeChooseBtn")?.scrollIntoView({
					behavior: "smooth",
					block: "center"
				});
				return;
			}
			filesToProcess.push(secondMergeFile);
		}
		await executeInPageConversion(filesToProcess, tool, options);
	});
}
async function executeInPageConversion(files, tool, options = {}) {
	const directWorkflow = document.getElementById("directWorkflow");
	if (!directWorkflow) return;
	directWorkflow.style.display = "block";
	directWorkflow.innerHTML = `
    <div class="processing-state" id="inPageProcessing">
      <div class="progress-ring">
        <div class="progress-spinner"></div>
      </div>
      <div class="progress-text">${i18n.t("ui.processing")}</div>
      <div class="progress-detail" id="inPageProgressDetail">${i18n.t("ui.readingFile")}</div>
    </div>
  `;
	directWorkflow.scrollIntoView({
		behavior: "smooth",
		block: "center"
	});
	window.updateProgress = (text) => {
		const el = document.getElementById("inPageProgressDetail");
		if (el) el.textContent = text;
	};
	try {
		let engineModule;
		switch (tool.engine) {
			case "pdf-lib":
				engineModule = await __vitePreload(() => import("./pdf-lib-engine-CkyWpul6.js"), __vite__mapDeps([0,1]));
				break;
			case "pdfjs":
				engineModule = await __vitePreload(() => import("./pdfjs-engine-bD5tdcf4.js"), __vite__mapDeps([2,1]));
				break;
			case "docx-convert":
				engineModule = await __vitePreload(() => import("./docx-engine-l1lNwAO9.js"), __vite__mapDeps([3,1]));
				break;
			case "xlsx-convert":
				engineModule = await __vitePreload(() => import("./xlsx-engine-DKVn2ZHm.js"), __vite__mapDeps([4,1]));
				break;
			case "pptx-convert":
				engineModule = await __vitePreload(() => import("./pptx-engine-Cx45SnJN.js"), __vite__mapDeps([5,1]));
				break;
			case "pdf-extract":
				engineModule = await __vitePreload(() => import("./pdf-extract-engine-CRlrJI4s.js"), []);
				break;
			case "pdf-compress":
				engineModule = await __vitePreload(() => import("./pdf-compress-engine-BaKlTR0n.js"), __vite__mapDeps([6,1]));
				break;
			case "tesseract":
				engineModule = await __vitePreload(() => import("./tesseract-engine-MvG8kqF6.js"), __vite__mapDeps([7,1]));
				break;
			default: throw new Error(`محرك غير مدعوم: ${tool.engine}`);
		}
		await new Promise((r) => setTimeout(r, 600));
		const filesArray = Array.isArray(files) ? files : [files];
		const result = await engineModule.process(filesArray, tool, options);
		directWorkflow.innerHTML = `
      <div class="result-state" style="background:var(--bg-elevated);border-radius:var(--radius-lg);border:1px solid var(--border-primary);box-shadow:var(--shadow-md);">
        <div class="result-icon success">
          <i data-lucide="check-circle" style="width:36px;height:36px;"></i>
        </div>
        <div class="result-title">${i18n.t("ui.conversionComplete")}</div>
        <div class="result-detail">
          <strong>${escapeHtml(result.fileName)}</strong> — ${formatFileSize(result.size)}
        </div>
        <div class="btn-group">
          <button class="btn btn-success btn-lg" id="inPageDownloadBtn">
            <i data-lucide="download" style="width:18px;height:18px;"></i>
            <span>${i18n.t("ui.downloadResult")}</span>
          </button>
          <button class="btn btn-secondary" id="inPageNewConvertBtn">
            <i data-lucide="refresh-cw" style="width:18px;height:18px;"></i>
            <span>تحويل ملف آخر</span>
          </button>
        </div>
      </div>
    `;
		if (window.lucide) window.lucide.createIcons();
		document.getElementById("inPageDownloadBtn")?.addEventListener("click", () => {
			downloadBlob(result.blob, result.fileName);
		});
		document.getElementById("inPageNewConvertBtn")?.addEventListener("click", () => {
			clearSelectedFile();
			directWorkflow.style.display = "none";
			document.getElementById("heroUpload")?.scrollIntoView({
				behavior: "smooth",
				block: "center"
			});
		});
	} catch (err) {
		console.error("In-page conversion error:", err);
		directWorkflow.innerHTML = `
      <div class="result-state" style="background:var(--bg-elevated);border-radius:var(--radius-lg);border:1px solid var(--border-primary);box-shadow:var(--shadow-md);">
        <div class="result-icon error">
          <i data-lucide="shield-alert" style="width:36px;height:36px;"></i>
        </div>
        <div class="result-title">${i18n.t("ui.error")}</div>
        <div class="result-detail">
          <p style="margin-bottom:8px;font-weight:500;">${i18n.t("ui.errorDesc")}</p>
          <span style="font-size:0.82rem;opacity:0.8;display:block;">${escapeHtml(err.message || "")}</span>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" id="inPageRetryBtn">
            <i data-lucide="refresh-cw" style="width:18px;height:18px;"></i>
            <span>${i18n.t("ui.tryAgain")}</span>
          </button>
        </div>
      </div>
    `;
		if (window.lucide) window.lucide.createIcons();
		document.getElementById("inPageRetryBtn")?.addEventListener("click", () => {
			directWorkflow.style.display = "none";
		});
	}
}
function downloadBlob(blob, fileName) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	setTimeout(() => URL.revokeObjectURL(url), 5e3);
}
function escapeHtml(str) {
	const div = document.createElement("div");
	div.textContent = str;
	return div.innerHTML;
}
function showToast(message, type = "info") {
	const container = document.getElementById("toastContainer");
	if (!container) return;
	const toast = document.createElement("div");
	toast.className = `toast ${type}`;
	toast.innerHTML = `
    <i data-lucide="${type === "success" ? "check-circle" : type === "error" ? "alert-circle" : "info"}" style="width:18px;height:18px;flex-shrink:0;"></i>
    <span>${message}</span>
  `;
	container.appendChild(toast);
	if (window.lucide) window.lucide.createIcons();
	setTimeout(() => {
		toast.style.opacity = "0";
		toast.style.transform = "translateY(12px)";
		setTimeout(() => toast.remove(), 300);
	}, 4e3);
}
window.showToast = showToast;
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
