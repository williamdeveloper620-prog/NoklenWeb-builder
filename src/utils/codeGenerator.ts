import { Project, Page, BuilderComponent } from '../types/builder';

export function renderComponentToHtml(component: BuilderComponent): string {
  switch (component.type) {
    case 'divider': {
      const borderStyles = {
        solid: 'border-solid',
        dashed: 'border-dashed',
        dotted: 'border-dotted',
        gradient: 'border-solid',
      }[component.style] || 'border-solid';

      const widthClasses = {
        full: 'w-full',
        half: 'w-1/2 mx-auto',
        quarter: 'w-1/4 mx-auto',
      }[component.width] || 'w-full';

      if (component.hasLabel && component.label) {
        return `
        <div class="noklen-divider-container my-6 flex items-center ${widthClasses}">
          <div class="flex-grow border-t" style="border-color: ${component.color}; border-width: ${component.thickness};"></div>
          <span class="px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">${escapeHtml(component.label)}</span>
          <div class="flex-grow border-t" style="border-color: ${component.color}; border-width: ${component.thickness};"></div>
        </div>`;
      }

      return `
      <div class="noklen-divider my-6 ${widthClasses}">
        <hr class="${borderStyles}" style="border-color: ${component.color}; border-width: ${component.thickness};" />
      </div>`;
    }

    case 'heading': {
      const tag = component.level || 'h2';
      const alignClass = component.align === 'center' ? 'text-center' : component.align === 'left' ? 'text-left' : 'text-right';
      const sizeClass = tag === 'h1' ? 'text-3xl md:text-5xl font-extrabold' : tag === 'h2' ? 'text-2xl md:text-3xl font-bold' : 'text-xl md:text-2xl font-semibold';
      return `
      <div class="noklen-heading my-6 ${alignClass}">
        <${tag} class="${sizeClass} text-white tracking-tight leading-tight">${escapeHtml(component.text)}</${tag}>
        ${component.subtitle ? `<p class="mt-2 text-slate-400 text-sm md:text-base max-w-2xl ${component.align === 'center' ? 'mx-auto' : ''}">${escapeHtml(component.subtitle)}</p>` : ''}
      </div>`;
    }

    case 'paragraph': {
      const alignClass = component.align === 'center' ? 'text-center' : component.align === 'left' ? 'text-left' : 'text-right';
      const sizeClass = component.size === 'lg' ? 'text-lg md:text-xl text-slate-200' : component.size === 'sm' ? 'text-xs md:text-sm text-slate-400' : 'text-base text-slate-300';
      return `
      <div class="noklen-paragraph my-4 ${alignClass}">
        <p class="${sizeClass} leading-relaxed">${escapeHtml(component.text)}</p>
      </div>`;
    }

    case 'button': {
      const effectiveButtonId = component.buttonId || component.id;
      const alignClass = component.align === 'center' ? 'text-center' : component.align === 'end' ? 'text-left' : component.align === 'full' ? 'block w-full' : 'text-right';
      const variantClass = {
        primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20',
        secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700',
        outline: 'bg-transparent hover:bg-slate-800 text-indigo-400 border border-indigo-500',
        ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-300',
        danger: 'bg-rose-600 hover:bg-rose-500 text-white',
        success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      }[component.variant] || 'bg-indigo-600 text-white';

      const sizeClass = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm font-semibold',
        lg: 'px-7 py-3.5 text-base font-bold',
      }[component.size] || 'px-5 py-2.5 text-sm';

      return `
      <div class="noklen-button-wrapper my-4 ${alignClass}">
        <button id="${effectiveButtonId}"
                data-button-id="${effectiveButtonId}"
                data-action="${component.actionType}" 
                data-target="${escapeHtml(component.targetPageId || component.url || component.downloadFileName || component.alertText || component.copyText || component.targetElementId || '')}"
                data-page="${component.targetPageId || ''}"
                data-file="${escapeHtml(component.downloadFileName || '')}"
                data-url="${escapeHtml(component.url || '')}"
                data-newtab="${component.openInNewTab !== false ? 'true' : 'false'}"
                data-alert="${escapeHtml(component.alertText || '')}"
                data-copy="${escapeHtml(component.copyText || '')}"
                class="noklen-btn ${variantClass} ${sizeClass} rounded-lg transition-all active:scale-95 inline-flex items-center gap-2">
          <span class="btn-label">${escapeHtml(component.text)}</span>
          ${component.actionType === 'navigate_page' ? '<span class="text-xs opacity-75 font-mono">→</span>' : ''}
        </button>
      </div>`;
    }

    case 'image_with_caption': {
      const roundedClass = {
        none: 'rounded-none',
        md: 'rounded-md',
        lg: 'rounded-xl',
        '2xl': 'rounded-2xl',
        full: 'rounded-full',
      }[component.rounded] || 'rounded-xl';

      return `
      <figure class="noklen-image-card my-6 bg-slate-900 border border-slate-800 ${roundedClass} overflow-hidden shadow-xl">
        <div class="relative overflow-hidden bg-slate-950">
          <img src="${component.imageUrl}" alt="${escapeHtml(component.alt || component.caption)}" class="w-full object-cover transition-transform duration-300 hover:scale-102" loading="lazy" />
        </div>
        <figcaption class="p-4 md:p-5 border-t border-slate-800/80">
          <h4 class="text-base md:text-lg font-bold text-slate-100">${escapeHtml(component.caption)}</h4>
          ${component.description ? `<p class="mt-1.5 text-sm text-slate-400 leading-relaxed">${escapeHtml(component.description)}</p>` : ''}
        </figcaption>
      </figure>`;
    }

    case 'file_attachment': {
      const typeIcons: Record<string, string> = {
        pdf: '📄 PDF',
        zip: '📦 ZIP',
        code: '💻 CODE',
        doc: '📝 DOC',
        image: '🖼️ IMG',
        audio: '🎵 AUDIO',
      };
      const iconLabel = typeIcons[component.fileType] || '📎 FILE';

      return `
      <div class="noklen-file-card my-4 p-4 md:p-5 bg-slate-900/90 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-start gap-3.5">
          <div class="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold shrink-0">
            ${iconLabel}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-slate-100 text-sm md:text-base">${escapeHtml(component.fileName)}</h4>
              <span class="text-xs text-slate-500 font-mono">${escapeHtml(component.fileSize)}</span>
            </div>
            <p class="text-xs md:text-sm text-slate-400 mt-1">${escapeHtml(component.description)}</p>
          </div>
        </div>
        <button class="noklen-download-btn px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-lg text-xs font-semibold transition-colors shrink-0 flex items-center justify-center gap-1.5"
                onclick="alert('جاري تنزيل الملف: ${escapeHtml(component.fileName)}')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          <span>${escapeHtml(component.buttonText || 'تحميل')}</span>
        </button>
      </div>`;
    }

    case 'choices': {
      return `
      <div class="noklen-choices my-6 p-5 bg-slate-900/70 border border-slate-800 rounded-xl">
        <h4 class="text-base font-bold text-slate-100 mb-1">${escapeHtml(component.title)}</h4>
        ${component.description ? `<p class="text-xs text-slate-400 mb-4">${escapeHtml(component.description)}</p>` : ''}
        <div class="space-y-2 mt-3">
          ${component.options.map(opt => `
            <label class="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-colors">
              <div class="flex items-center gap-3">
                <input type="${component.choiceType === 'radio' ? 'radio' : 'checkbox'}" 
                       name="choice_${component.id}" 
                       value="${escapeHtml(opt.value)}"
                       ${opt.checked ? 'checked' : ''} 
                       data-target-btn="${escapeHtml(opt.targetButtonId || '')}"
                       data-btn-text="${escapeHtml(opt.buttonNewText || '')}"
                       data-btn-action="${escapeHtml(opt.buttonNewAction || '')}"
                       data-btn-target="${escapeHtml(opt.buttonNewTarget || '')}"
                       data-btn-variant="${escapeHtml(opt.buttonNewVariant || '')}"
                       class="noklen-choice-input w-4 h-4 accent-indigo-600 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                <span class="text-sm text-slate-300 select-none">${escapeHtml(opt.label)}</span>
              </div>
              ${opt.targetButtonId ? `<span class="text-[10px] text-indigo-400 font-mono bg-indigo-950/60 border border-indigo-500/20 px-2 py-0.5 rounded-full">⚡ يغير #${escapeHtml(opt.targetButtonId)}</span>` : ''}
            </label>
          `).join('')}
        </div>
      </div>`;
    }

    case 'list': {
      const renderItem = (item: any, idx: number) => {
        if (component.listType === 'numbered') {
          return `
          <li class="flex items-start gap-3 py-2 border-b border-slate-800/60 last:border-0">
            <span class="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-xs flex items-center justify-center shrink-0 font-bold">${idx + 1}</span>
            <div>
              <div class="text-sm font-semibold text-slate-200">${escapeHtml(item.title)}</div>
              ${item.description ? `<div class="text-xs text-slate-400 mt-0.5">${escapeHtml(item.description)}</div>` : ''}
            </div>
          </li>`;
        }
        if (component.listType === 'check') {
          return `
          <li class="flex items-start gap-3 py-2 border-b border-slate-800/60 last:border-0">
            <span class="text-emerald-400 mt-0.5 shrink-0">✓</span>
            <div>
              <div class="text-sm font-semibold text-slate-200">${escapeHtml(item.title)}</div>
              ${item.description ? `<div class="text-xs text-slate-400 mt-0.5">${escapeHtml(item.description)}</div>` : ''}
            </div>
          </li>`;
        }
        return `
        <li class="flex items-start gap-2.5 py-1.5">
          <span class="text-indigo-400 mt-1">•</span>
          <div>
            <div class="text-sm font-medium text-slate-200">${escapeHtml(item.title)}</div>
            ${item.description ? `<div class="text-xs text-slate-400">${escapeHtml(item.description)}</div>` : ''}
          </div>
        </li>`;
      };

      return `
      <div class="noklen-list my-5 p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
        ${component.title ? `<h4 class="text-sm font-bold text-slate-100 mb-3">${escapeHtml(component.title)}</h4>` : ''}
        <ul class="space-y-1">
          ${component.items.map((it, i) => renderItem(it, i)).join('')}
        </ul>
      </div>`;
    }

    case 'navbar': {
      return `
      <header class="noklen-navbar border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 mb-6">
        <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <a href="#" class="text-lg font-black text-indigo-400 tracking-tight">${escapeHtml(component.brandName)}</a>
            ${component.brandTagline ? `<span class="hidden sm:inline text-xs text-slate-400 border-r border-slate-700 pr-3">${escapeHtml(component.brandTagline)}</span>` : ''}
          </div>
          <nav class="flex items-center gap-4 text-xs md:text-sm font-medium">
            ${component.links.map(link => `
              <button class="noklen-nav-link text-slate-300 hover:text-white transition-colors" data-page="${link.pageId || ''}">${escapeHtml(link.label)}</button>
            `).join('')}
            ${component.ctaText ? `
              <button class="noklen-btn px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold" data-action="${component.ctaAction || 'navigate_page'}" data-page="${component.ctaTarget || ''}">${escapeHtml(component.ctaText)}</button>
            ` : ''}
          </nav>
        </div>
      </header>`;
    }

    case 'card': {
      return `
      <div class="noklen-card my-5 p-5 bg-slate-900 border border-slate-800 rounded-xl">
        ${component.badge ? `<span class="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 block">${escapeHtml(component.badge)}</span>` : ''}
        <h4 class="text-lg font-bold text-white mb-2">${escapeHtml(component.title)}</h4>
        <p class="text-sm text-slate-300 leading-relaxed mb-4">${escapeHtml(component.description)}</p>
        ${component.buttonText ? `
          <button class="noklen-btn px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold" data-page="${component.buttonPageId || ''}">
            ${escapeHtml(component.buttonText)}
          </button>
        ` : ''}
      </div>`;
    }

    case 'form_input': {
      return `
      <div class="noklen-form my-5 p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
        <label class="block text-sm font-semibold text-slate-200 mb-2">${escapeHtml(component.label)}</label>
        <div class="flex gap-2">
          <input type="${component.inputType === 'textarea' ? 'text' : component.inputType}" 
                 placeholder="${escapeHtml(component.placeholder)}" 
                 class="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" />
          <button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shrink-0 transition-colors"
                  onclick="alert('${escapeHtml(component.successMessage || 'تم الإرسال بنجاح!')}')">
            ${escapeHtml(component.buttonText || 'إرسال')}
          </button>
        </div>
      </div>`;
    }

    default:
      return '';
  }
}

export function generatePageHtml(page: Page, project: Project): string {
  const activeId = project.activePageId || (project.pages.find(p => p.isHome) || project.pages[0])?.id;
  const isActive = page.id === activeId || (!project.pages.some(p => p.id === activeId) && page.isHome);
  const componentsHtml = page.components.map(renderComponentToHtml).join('\n');
  return `
    <div id="page-${page.id}" class="noklen-page-view ${isActive ? 'active' : 'hidden'}">
      <div class="max-w-4xl mx-auto px-4 py-6">
        ${componentsHtml}
      </div>
    </div>`;
}

export function generateFullWebsiteHtml(project: Project): string {
  const activeId = project.activePageId || (project.pages.find(p => p.isHome) || project.pages[0])?.id || '';
  const pagesHtml = project.pages.map(page => generatePageHtml(page, project)).join('\n');
  const pagesJson = JSON.stringify(project.pages.map(p => ({ id: p.id, title: p.title, slug: p.slug, isHome: p.isHome })));

  return `<!DOCTYPE html>
<html lang="ar" dir="${project.settings.direction || 'rtl'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(project.name)}</title>
  <meta name="description" content="${escapeHtml(project.description)}">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: '${project.settings.fontFamily || 'Cairo'}', system-ui, -apple-system, sans-serif;
      background-color: #0b0f19;
      color: #f1f5f9;
      min-height: 100vh;
    }
    .hidden { display: none !important; }
    .active { display: block !important; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">

  <!-- Pages Container -->
  <main id="noklen-root">
    ${pagesHtml}
  </main>

  <!-- Client-side Router and Interaction Script -->
  <script>
    const PAGES = ${pagesJson};
    let currentPageId = "${activeId}";

    function navigateToPage(pageId) {
      if (!pageId) return;
      const targetPage = PAGES.find(p => p.id === pageId || p.slug === pageId);
      if (!targetPage) return;

      document.querySelectorAll('.noklen-page-view').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('active');
      });

      const activeEl = document.getElementById('page-' + targetPage.id);
      if (activeEl) {
        activeEl.classList.remove('hidden');
        activeEl.classList.add('active');
        currentPageId = targetPage.id;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log("Navigated to:", targetPage.title);
      }
    }

    // Safety fallback on page load: ensure at least one page is visible
    document.addEventListener('DOMContentLoaded', () => {
      const activeVisible = document.querySelector('.noklen-page-view.active');
      if (!activeVisible) {
        const firstPage = document.querySelector('.noklen-page-view');
        if (firstPage) {
          firstPage.classList.remove('hidden');
          firstPage.classList.add('active');
        }
      }
    });

    // Dynamic Choice to Button ID Mutation Listener
    document.addEventListener('change', (e) => {
      const input = e.target;
      if (input && input.classList && input.classList.contains('noklen-choice-input') && input.checked) {
        const targetBtnId = input.getAttribute('data-target-btn');
        if (targetBtnId) {
          const btn = document.querySelector('#' + targetBtnId + ', [data-button-id="' + targetBtnId + '"]');
          if (btn) {
            const newText = input.getAttribute('data-btn-text');
            const newAction = input.getAttribute('data-btn-action');
            const newTarget = input.getAttribute('data-btn-target');
            const newVariant = input.getAttribute('data-btn-variant');

            if (newText) {
              const label = btn.querySelector('.btn-label') || btn;
              label.textContent = newText;
            }
            if (newAction) btn.setAttribute('data-action', newAction);
            if (newTarget) {
              btn.setAttribute('data-target', newTarget);
              btn.setAttribute('data-page', newTarget);
              btn.setAttribute('data-file', newTarget);
              btn.setAttribute('data-url', newTarget);
              btn.setAttribute('data-alert', newTarget);
              btn.setAttribute('data-copy', newTarget);
            }
            if (newVariant) {
              btn.className = btn.className.replace(/bg-\S+|text-\S+|border-\S+/g, '');
              if (newVariant === 'success') {
                btn.className += ' bg-emerald-600 hover:bg-emerald-500 text-white';
              } else if (newVariant === 'danger') {
                btn.className += ' bg-rose-600 hover:bg-rose-500 text-white';
              } else if (newVariant === 'secondary') {
                btn.className += ' bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700';
              } else if (newVariant === 'outline') {
                btn.className += ' bg-transparent hover:bg-slate-800 text-indigo-400 border border-indigo-500';
              } else {
                btn.className += ' bg-indigo-600 hover:bg-indigo-500 text-white';
              }
            }
            btn.classList.add('ring-4', 'ring-emerald-400', 'scale-105');
            setTimeout(() => btn.classList.remove('ring-4', 'ring-emerald-400', 'scale-105'), 1200);
          }
        }
      }
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.noklen-btn, [data-action]');
      if (btn) {
        const action = btn.getAttribute('data-action');
        const target = btn.getAttribute('data-target');

        if (action === 'navigate_page') {
          e.preventDefault();
          const pageId = btn.getAttribute('data-page') || target;
          navigateToPage(pageId);
          return;
        }

        if (action === 'open_url') {
          e.preventDefault();
          const url = btn.getAttribute('data-url') || target;
          const newTab = btn.getAttribute('data-newtab') !== 'false';
          if (url) window.open(url, newTab ? '_blank' : '_self');
          return;
        }

        if (action === 'download_file') {
          e.preventDefault();
          const fileName = btn.getAttribute('data-file') || target || 'downloaded-file.txt';
          const blob = new Blob(['تم تنزيل هذا الملف عبر موقع NoklenWeb: ' + fileName], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          alert('📥 جاري تنزيل الملف على جهازك:\\n' + fileName);
          return;
        }

        if (action === 'alert_message') {
          e.preventDefault();
          const alertMsg = btn.getAttribute('data-alert') || target || 'مرحباً بك!';
          alert(alertMsg);
          return;
        }

        if (action === 'copy_text') {
          e.preventDefault();
          const text = btn.getAttribute('data-copy') || target || '';
          navigator.clipboard.writeText(text);
          alert('📋 تم نسخ النص التالي إلى الحافظة بنجاح:\\n"' + text + '"');
          return;
        }

        if (action === 'scroll_to') {
          e.preventDefault();
          const el = document.getElementById(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          return;
        }

        if (action === 'toggle_element') {
          e.preventDefault();
          const el = document.getElementById(target);
          if (el) el.classList.toggle('hidden');
          return;
        }

        if (action === 'firebase_submit') {
          e.preventDefault();
          alert('🔥 تم إرسال البيانات بنجاح إلى Firebase Firestore في مجموعة (' + (target || 'messages') + ')!');
          return;
        }
      }

      const pageTrigger = e.target.closest('[data-page]');
      if (pageTrigger) {
        e.preventDefault();
        const targetPage = pageTrigger.getAttribute('data-page');
        navigateToPage(targetPage);
        return;
      }

      const alertTrigger = e.target.closest('[data-alert]');
      if (alertTrigger) {
        e.preventDefault();
        alert(alertTrigger.getAttribute('data-alert'));
        return;
      }
    });

    window.navigateToPage = navigateToPage;
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
