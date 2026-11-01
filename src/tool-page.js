// PDFly Tool Page — Main Controller
import { i18n } from './i18n.js';
import { theme } from './theme.js';
import { getToolById, formatFileSize } from './tools.js';

// ==================== STATE ====================

let currentTool = null;
let selectedFiles = [];
let processingState = 'idle'; // idle, uploading, processing, done, error

// ==================== INITIALIZATION ====================

function init() {
  theme.init();
  i18n.init();

  const params = new URLSearchParams(window.location.search);
  const toolId = params.get('id');

  if (!toolId) {
    window.location.href = '/';
    return;
  }

  currentTool = getToolById(toolId);
  if (!currentTool) {
    window.location.href = '/';
    return;
  }

  renderToolHeader();
  renderUploadState();
  setupControls();
  initIcons();
}

function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  } else {
    const check = setInterval(() => {
      if (window.lucide) {
        clearInterval(check);
        window.lucide.createIcons();
      }
    }, 100);
    setTimeout(() => clearInterval(check), 5000);
  }
}

// ==================== CONTROLS ====================

function setupControls() {
  // Theme toggle
  const themeBtn = document.getElementById('themeToggle');
  themeBtn?.addEventListener('click', () => {
    theme.toggle();
    const icon = themeBtn.querySelector('i');
    if (icon) {
      icon.setAttribute('data-lucide', theme.isDark ? 'moon' : 'sun');
      if (window.lucide) window.lucide.createIcons();
    }
  });

  // Language toggle
  const langBtn = document.getElementById('langToggle');
  langBtn?.addEventListener('click', () => {
    i18n.toggle();
    renderToolHeader();
    // Re-render current state
    if (processingState === 'idle') renderUploadState();
    if (window.lucide) window.lucide.createIcons();
  });

  // Mobile menu
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  mobileMenuBtn?.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    const icon = mobileMenuBtn.querySelector('i');
    if (icon) {
      icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
      if (window.lucide) window.lucide.createIcons();
    }
  });
}

// ==================== RENDER TOOL HEADER ====================

function renderToolHeader() {
  const iconEl = document.getElementById('toolIcon');
  const titleEl = document.getElementById('toolTitle');
  const descEl = document.getElementById('toolDesc');

  if (!currentTool) return;

  // Category color
  const colorMap = {
    'convert-pdf': { bg: 'var(--cat-convert-subtle)', color: 'var(--cat-convert)' },
    'convert-to-pdf': { bg: 'var(--cat-convert-subtle)', color: 'var(--cat-convert)' },
    'edit-pdf': { bg: 'var(--cat-edit-subtle)', color: 'var(--cat-edit)' },
    'organize-pdf': { bg: 'var(--cat-organize-subtle)', color: 'var(--cat-organize)' },
    'optimize-pdf': { bg: 'var(--cat-optimize-subtle)', color: 'var(--cat-optimize)' },
    'ocr': { bg: 'var(--cat-ocr-subtle)', color: 'var(--cat-ocr)' },
    'office': { bg: 'var(--cat-office-subtle)', color: 'var(--cat-office)' },
  };
  const colors = colorMap[currentTool.category] || { bg: 'var(--accent-subtle)', color: 'var(--accent)' };

  iconEl.style.background = colors.bg;
  iconEl.style.color = colors.color;
  iconEl.innerHTML = `<i data-lucide="${currentTool.icon}" style="width:32px;height:32px;"></i>`;

  titleEl.textContent = i18n.t(currentTool.nameKey);
  descEl.textContent = i18n.t(currentTool.descKey);

  document.title = `PDFly — ${i18n.t(currentTool.nameKey)}`;

  if (window.lucide) window.lucide.createIcons();
}

// ==================== RENDER UPLOAD STATE ====================

function renderUploadState() {
  processingState = 'idle';
  selectedFiles = [];

  const workflow = document.getElementById('toolWorkflow');
  if (!workflow) return;

  const isMulti = currentTool.multiFile;

  workflow.innerHTML = `
    <div class="file-upload-zone" id="fileUploadZone" role="button" tabindex="0">
      <div class="upload-icon">
        <i data-lucide="upload-cloud" style="width:28px;height:28px;"></i>
      </div>
      <div class="upload-text">${i18n.t(isMulti ? 'ui.selectFiles' : 'ui.selectFile')}</div>
      <div class="upload-hint">${i18n.t('ui.dragDrop')}</div>
      <button class="browse-btn" id="browseBtn">
        <i data-lucide="folder-open" style="width:18px;height:18px;"></i>
        <span>${i18n.t('hero.browse')}</span>
      </button>
      <div style="margin-top:var(--space-3);">
        <span style="font-size:0.8rem;color:var(--text-tertiary);">
          ${i18n.t('ui.supportedFormats')}: ${currentTool.accept.replace(/\./g, '').toUpperCase().replace(/,/g, ', ')}
        </span>
      </div>
      <div style="margin-top:var(--space-2);">
        <span style="font-size:0.8rem;color:var(--text-tertiary);">
          ${i18n.t('ui.maxFileSize')}: ${formatFileSize(currentTool.maxSize)}
        </span>
      </div>
      <input type="file" id="toolFileInput" class="sr-only"
             accept="${currentTool.accept}"
             ${isMulti ? 'multiple' : ''}>
    </div>
  `;

  setupFileUpload();
  if (window.lucide) window.lucide.createIcons();
}

// ==================== FILE UPLOAD HANDLING ====================

function setupFileUpload() {
  const zone = document.getElementById('fileUploadZone');
  const input = document.getElementById('toolFileInput');
  const browseBtn = document.getElementById('browseBtn');

  if (!zone || !input) return;

  browseBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    input.click();
  });

  zone.addEventListener('click', () => input.click());
  zone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      input.click();
    }
  });

  input.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleToolFiles(Array.from(e.target.files));
    }
  });

  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('drag-over');
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    if (e.dataTransfer.files.length > 0) {
      handleToolFiles(Array.from(e.dataTransfer.files));
    }
  });
}

function handleToolFiles(files) {
  // Validate files
  const validFiles = [];
  const acceptedExts = currentTool.accept.split(',').map((e) => e.trim().toLowerCase());

  for (const file of files) {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();

    // Extension check
    if (!acceptedExts.includes(ext)) {
      showToast(`${i18n.t('ui.invalidFile')}: ${file.name}`, 'error');
      continue;
    }

    // Size check
    if (file.size > currentTool.maxSize) {
      showToast(`${i18n.t('ui.fileTooLarge')}: ${file.name} (${formatFileSize(file.size)})`, 'error');
      continue;
    }

    // Empty file check
    if (file.size === 0) {
      showToast(`${i18n.t('ui.error')}: ${file.name}`, 'error');
      continue;
    }

    validFiles.push(file);
  }

  if (validFiles.length === 0) return;

  if (currentTool.multiFile) {
    selectedFiles = [...selectedFiles, ...validFiles];
    renderFileList();
  } else {
    selectedFiles = [validFiles[0]];
    renderFileInfo();
  }
}

// ==================== RENDER FILE INFO (single file) ====================

function renderFileInfo() {
  const workflow = document.getElementById('toolWorkflow');
  if (!workflow || selectedFiles.length === 0) return;

  const file = selectedFiles[0];

  workflow.innerHTML = `
    <div class="file-info-card">
      <div class="file-info-row">
        <span class="file-info-label">${i18n.t('ui.fileName')}</span>
        <span class="file-info-value">${escapeHtml(file.name)}</span>
      </div>
      <div class="file-info-row">
        <span class="file-info-label">${i18n.t('ui.fileSize')}</span>
        <span class="file-info-value">${formatFileSize(file.size)}</span>
      </div>
      <div class="file-info-row">
        <span class="file-info-label">${i18n.t('ui.fileType')}</span>
        <span class="file-info-value">${file.type || file.name.split('.').pop()?.toUpperCase()}</span>
      </div>
    </div>

    ${renderToolOptions()}

    <div class="btn-group">
      <button class="btn btn-primary btn-lg" id="startProcessBtn">
        <i data-lucide="play" style="width:18px;height:18px;"></i>
        ${i18n.t('ui.startConversion')}
      </button>
      <button class="btn btn-ghost" id="resetBtn">
        <i data-lucide="x" style="width:18px;height:18px;"></i>
        ${i18n.t('ui.reset')}
      </button>
    </div>
  `;

  document.getElementById('startProcessBtn')?.addEventListener('click', startProcessing);
  document.getElementById('resetBtn')?.addEventListener('click', renderUploadState);
  setupDynamicOptions();

  if (window.lucide) window.lucide.createIcons();
}

// ==================== RENDER FILE LIST (multi file) ====================

function renderFileList() {
  const workflow = document.getElementById('toolWorkflow');
  if (!workflow) return;

  workflow.innerHTML = `
    <div class="file-list" id="fileList">
      ${selectedFiles.map((file, idx) => `
        <div class="file-list-item" data-index="${idx}">
          <div class="file-list-item-info">
            <div class="file-list-item-name">${escapeHtml(file.name)}</div>
            <div class="file-list-item-size">${formatFileSize(file.size)}</div>
          </div>
          <button class="file-list-item-remove" data-remove="${idx}" title="${i18n.t('ui.remove')}">
            <i data-lucide="x" style="width:14px;height:14px;"></i>
          </button>
        </div>
      `).join('')}
    </div>

    <div class="btn-group" style="margin-bottom:var(--space-4);">
      <button class="btn btn-secondary" id="addMoreBtn">
        <i data-lucide="plus" style="width:18px;height:18px;"></i>
        ${i18n.t('ui.addFiles')}
      </button>
      <button class="btn btn-ghost" id="removeAllBtn">
        <i data-lucide="trash-2" style="width:18px;height:18px;"></i>
        ${i18n.t('ui.removeAll')}
      </button>
    </div>

    ${renderToolOptions()}

    <div class="btn-group">
      <button class="btn btn-primary btn-lg" id="startProcessBtn">
        <i data-lucide="play" style="width:18px;height:18px;"></i>
        ${i18n.t('ui.startConversion')}
      </button>
    </div>

    <input type="file" id="addMoreInput" class="sr-only" accept="${currentTool.accept}" multiple>
  `;

  // Remove individual files
  workflow.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-remove'));
      selectedFiles.splice(idx, 1);
      if (selectedFiles.length === 0) {
        renderUploadState();
      } else {
        renderFileList();
      }
    });
  });

  // Add more files
  const addMoreBtn = document.getElementById('addMoreBtn');
  const addMoreInput = document.getElementById('addMoreInput');
  addMoreBtn?.addEventListener('click', () => addMoreInput?.click());
  addMoreInput?.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleToolFiles(Array.from(e.target.files));
    }
  });

  // Remove all
  document.getElementById('removeAllBtn')?.addEventListener('click', renderUploadState);

  // Start processing
  document.getElementById('startProcessBtn')?.addEventListener('click', startProcessing);
  setupDynamicOptions();

  if (window.lucide) window.lucide.createIcons();
}

// ==================== TOOL-SPECIFIC OPTIONS ====================

function renderToolOptions() {
  // Return options panel HTML based on tool type
  const toolId = currentTool.id;

  if (toolId === 'compress-pdf') {
    return `
      <div class="options-panel">
        <div class="options-title">${i18n.t('ui.quality')}</div>
        <div class="option-group">
          <label class="option-label">${i18n.t('ui.quality')}</label>
          <select class="option-select" id="optQuality">
            <option value="high">${i18n.t('ui.high')} — ${i18n.isRTL ? 'أفضل جودة' : 'Best quality'}</option>
            <option value="medium" selected>${i18n.t('ui.medium')} — ${i18n.isRTL ? 'توازن بين الحجم والجودة' : 'Balance of size and quality'}</option>
            <option value="low">${i18n.t('ui.low')} — ${i18n.isRTL ? 'أصغر حجم' : 'Smallest size'}</option>
          </select>
        </div>
      </div>
    `;
  }

  if (toolId === 'add-watermark') {
    return `
      <div class="options-panel">
        <div class="options-title">${i18n.isRTL ? 'إعدادات العلامة المائية' : 'Watermark Settings'}</div>
        <div class="option-group">
          <label class="option-label">${i18n.isRTL ? 'نص العلامة المائية' : 'Watermark Text'}</label>
          <input type="text" class="option-input" id="optWatermarkText" placeholder="${i18n.isRTL ? 'أدخل النص...' : 'Enter text...'}" value="PDFly">
        </div>
        <div class="option-group">
          <label class="option-label">${i18n.isRTL ? 'الشفافية' : 'Opacity'}</label>
          <input type="range" class="option-range" id="optWatermarkOpacity" min="0.05" max="0.5" step="0.05" value="0.15">
        </div>
      </div>
    `;
  }

  if (toolId === 'add-page-numbers') {
    return `
      <div class="options-panel">
        <div class="options-title">${i18n.isRTL ? 'إعدادات الترقيم' : 'Page Number Settings'}</div>
        <div class="option-group">
          <label class="option-label">${i18n.isRTL ? 'الموقع' : 'Position'}</label>
          <select class="option-select" id="optPageNumPosition">
            <option value="bottom-center">${i18n.isRTL ? 'أسفل - وسط' : 'Bottom Center'}</option>
            <option value="bottom-right">${i18n.isRTL ? 'أسفل - يمين' : 'Bottom Right'}</option>
            <option value="bottom-left">${i18n.isRTL ? 'أسفل - يسار' : 'Bottom Left'}</option>
            <option value="top-center">${i18n.isRTL ? 'أعلى - وسط' : 'Top Center'}</option>
          </select>
        </div>
      </div>
    `;
  }

  if (toolId === 'rotate-pages') {
    return `
      <div class="options-panel">
        <div class="options-title">${i18n.isRTL ? 'زاوية التدوير' : 'Rotation Angle'}</div>
        <div class="option-group">
          <select class="option-select" id="optRotation">
            <option value="90">90° ${i18n.isRTL ? 'مع عقارب الساعة' : 'Clockwise'}</option>
            <option value="180">180°</option>
            <option value="270">270° ${i18n.isRTL ? 'عكس عقارب الساعة' : 'Counter-clockwise'}</option>
          </select>
        </div>
      </div>
    `;
  }

  if (toolId === 'pdf-to-images') {
    return `
      <div class="options-panel">
        <div class="options-title">${i18n.isRTL ? 'إعدادات الصورة' : 'Image Settings'}</div>
        <div class="option-group">
          <label class="option-label">${i18n.isRTL ? 'الصيغة' : 'Format'}</label>
          <select class="option-select" id="optImageFormat">
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
          </select>
        </div>
        <div class="option-group">
          <label class="option-label">${i18n.isRTL ? 'الدقة (DPI)' : 'Resolution (DPI)'}</label>
          <select class="option-select" id="optDpi">
            <option value="1">72 DPI</option>
            <option value="1.5">108 DPI</option>
            <option value="2" selected>144 DPI</option>
            <option value="3">216 DPI</option>
          </select>
        </div>
      </div>
    `;
  }

  if (toolId === 'split-pdf') {
    return `
      <div class="options-panel">
        <div class="options-title">${i18n.isRTL ? 'طريقة التقسيم' : 'Split Method'}</div>
        <div class="option-group">
          <select class="option-select" id="optSplitMethod">
            <option value="each">${i18n.isRTL ? 'كل صفحة كملف منفصل' : 'Each page as separate file'}</option>
            <option value="range">${i18n.isRTL ? 'نطاق صفحات محدد' : 'Custom page range'}</option>
          </select>
        </div>
        <div class="option-group" id="splitRangeGroup" style="display:none;">
          <label class="option-label">${i18n.isRTL ? 'النطاق (مثال: 1-3, 5, 7-10)' : 'Range (e.g. 1-3, 5, 7-10)'}</label>
          <input type="text" class="option-input" id="optSplitRange" placeholder="1-3, 5, 7-10">
        </div>
      </div>
    `;
  }

  return '';
}

function setupDynamicOptions() {
  // Split-pdf: toggle range input visibility
  const splitMethod = document.getElementById('optSplitMethod');
  const rangeGroup = document.getElementById('splitRangeGroup');
  if (splitMethod && rangeGroup) {
    splitMethod.addEventListener('change', () => {
      rangeGroup.style.display = splitMethod.value === 'range' ? 'block' : 'none';
    });
  }
}

// ==================== PROCESSING ====================

async function startProcessing() {
  if (selectedFiles.length === 0) return;

  processingState = 'processing';
  renderProcessingState();

  try {
    // Dynamic import of the appropriate engine
    const engine = await loadEngine(currentTool);
    const result = await engine.process(selectedFiles, currentTool, getOptions());

    processingState = 'done';
    renderResultState(result);
  } catch (err) {
    console.error('Processing error:', err);
    processingState = 'error';
    renderErrorState(err.message || i18n.t('ui.error'));
  }
}

function getOptions() {
  const opts = {};

  // Collect all option values
  const quality = document.getElementById('optQuality');
  if (quality) opts.quality = quality.value;

  const watermarkText = document.getElementById('optWatermarkText');
  if (watermarkText) opts.watermarkText = watermarkText.value;

  const watermarkOpacity = document.getElementById('optWatermarkOpacity');
  if (watermarkOpacity) opts.watermarkOpacity = parseFloat(watermarkOpacity.value);

  const pageNumPosition = document.getElementById('optPageNumPosition');
  if (pageNumPosition) opts.pageNumPosition = pageNumPosition.value;

  const rotation = document.getElementById('optRotation');
  if (rotation) opts.rotation = parseInt(rotation.value);

  const imageFormat = document.getElementById('optImageFormat');
  if (imageFormat) opts.imageFormat = imageFormat.value;

  const dpi = document.getElementById('optDpi');
  if (dpi) opts.dpiScale = parseFloat(dpi.value);

  const splitMethod = document.getElementById('optSplitMethod');
  if (splitMethod) opts.splitMethod = splitMethod.value;

  const splitRange = document.getElementById('optSplitRange');
  if (splitRange) opts.splitRange = splitRange.value;

  return opts;
}

async function loadEngine(tool) {
  updateProgress(i18n.t('ui.initEngine'));

  // Special routing for text-extraction with DOCX files
  if (tool.id === 'text-extraction' && selectedFiles.length > 0) {
    const ext = selectedFiles[0].name.split('.').pop()?.toLowerCase();
    if (ext === 'docx' || ext === 'doc') {
      return await import('./engines/docx-engine.js');
    }
    if (ext === 'txt') {
      // For plain text, just read and return
      return {
        process: async (files) => {
          const text = await files[0].text();
          const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
          const baseName = files[0].name.replace(/\.[^.]+$/, '');
          return { blob, fileName: `${baseName}-extracted.txt`, size: blob.size };
        }
      };
    }
  }

  switch (tool.engine) {
    case 'pdf-lib':
      return await import('./engines/pdf-lib-engine.js');
    case 'pdfjs':
      return await import('./engines/pdfjs-engine.js');
    case 'docx-convert':
      return await import('./engines/docx-engine.js');
    case 'xlsx-convert':
      return await import('./engines/xlsx-engine.js');
    case 'pptx-convert':
      return await import('./engines/pptx-engine.js');
    case 'pdf-extract':
      return await import('./engines/pdf-extract-engine.js');
    case 'pdf-compress':
      return await import('./engines/pdf-compress-engine.js');
    case 'tesseract':
      return await import('./engines/tesseract-engine.js');
    default:
      throw new Error(`Unknown engine: ${tool.engine}`);
  }
}

// ==================== PROCESSING STATE ====================

function renderProcessingState() {
  const workflow = document.getElementById('toolWorkflow');
  if (!workflow) return;

  workflow.innerHTML = `
    <div class="processing-state" id="processingState">
      <div class="progress-ring">
        <div class="progress-spinner"></div>
      </div>
      <div class="progress-text" id="progressText">${i18n.t('ui.processing')}</div>
      <div class="progress-detail" id="progressDetail">${i18n.t('ui.readingFile')}</div>
    </div>
  `;
}

function updateProgress(detail) {
  const el = document.getElementById('progressDetail');
  if (el) el.textContent = detail;
}

// Make it available for engines
window.updateProgress = updateProgress;

// ==================== RESULT STATE ====================

function renderResultState(result) {
  const workflow = document.getElementById('toolWorkflow');
  if (!workflow) return;

  workflow.innerHTML = `
    <div class="result-state">
      <div class="result-icon success">
        <i data-lucide="check-circle" style="width:32px;height:32px;"></i>
      </div>
      <div class="result-title">${i18n.t('ui.conversionComplete')}</div>
      <div class="result-detail">
        ${result.fileName} — ${formatFileSize(result.size)}
      </div>
      <div class="btn-group">
        <button class="btn btn-success btn-lg" id="downloadBtn">
          <i data-lucide="download" style="width:18px;height:18px;"></i>
          ${i18n.t('ui.downloadResult')}
        </button>
        <button class="btn btn-secondary" id="processAnotherBtn">
          <i data-lucide="refresh-cw" style="width:18px;height:18px;"></i>
          ${i18n.t('ui.processAnother')}
        </button>
        <a href="/" class="btn btn-ghost">
          <i data-lucide="arrow-left" style="width:18px;height:18px;"></i>
          ${i18n.t('ui.backToTools')}
        </a>
      </div>
    </div>
  `;

  document.getElementById('downloadBtn')?.addEventListener('click', () => {
    downloadBlob(result.blob, result.fileName);
    // Clean up
    setTimeout(() => {
      if (result.url) URL.revokeObjectURL(result.url);
    }, 1000);
  });

  document.getElementById('processAnotherBtn')?.addEventListener('click', () => {
    // Clean up previous result
    if (result.url) URL.revokeObjectURL(result.url);
    renderUploadState();
  });

  if (window.lucide) window.lucide.createIcons();
}

// ==================== ERROR STATE ====================

function renderErrorState(errorMsg) {
  const workflow = document.getElementById('toolWorkflow');
  if (!workflow) return;

  const friendlyMessage = errorMsg || i18n.t('ui.errorDesc');

  workflow.innerHTML = `
    <div class="result-state">
      <div class="result-icon error">
        <i data-lucide="shield-alert" style="width:36px;height:36px;"></i>
      </div>
      <div class="result-title">${i18n.t('ui.error')}</div>
      <div class="result-detail">
        <p style="margin-bottom:8px;font-weight:500;">${i18n.t('ui.errorDesc')}</p>
        <span style="font-size:0.82rem;opacity:0.8;display:block;">${escapeHtml(friendlyMessage)}</span>
      </div>
      <div class="btn-group">
        <button class="btn btn-primary" id="retryBtn">
          <i data-lucide="refresh-cw" style="width:18px;height:18px;"></i>
          <span>${i18n.t('ui.tryAgain')}</span>
        </button>
        <a href="/" class="btn btn-secondary">
          <i data-lucide="layout-grid" style="width:18px;height:18px;"></i>
          <span>${i18n.t('ui.backToTools')}</span>
        </a>
      </div>
    </div>
  `;

  document.getElementById('retryBtn')?.addEventListener('click', renderUploadState);

  if (window.lucide) window.lucide.createIcons();
}

// ==================== UTILITIES ====================

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const iconName = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info';
  toast.innerHTML = `
    <i data-lucide="${iconName}" style="width:18px;height:18px;flex-shrink:0;"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==================== START ====================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
