import React from 'react';
import { 
  BuilderComponent, 
  Page 
} from '../types/builder';
import { 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Settings2, 
  FileText, 
  Download, 
  ExternalLink,
  CheckCircle2,
  FileCode,
  FileArchive,
  FileSpreadsheet,
  Image as ImageIcon
} from 'lucide-react';

interface ComponentRendererProps {
  component: BuilderComponent;
  isSelected?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isInteractivePreview?: boolean;
  pages?: Page[];
  onNavigatePage?: (pageId: string) => void;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected = false,
  isFirst = false,
  isLast = false,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  isInteractivePreview = false,
  pages = [],
  onNavigatePage,
}) => {
  // Action handler for preview interactions
  const handleButtonClick = (e: React.MouseEvent) => {
    if (!isInteractivePreview) return;
    e.stopPropagation();

    if (component.type === 'button') {
      const action = (e.currentTarget.getAttribute('data-action') as any) || component.actionType;
      const target = e.currentTarget.getAttribute('data-target') || component.targetPageId || component.url || component.downloadFileName;

      if (action === 'navigate_page') {
        const pageId = e.currentTarget.getAttribute('data-page') || component.targetPageId;
        if (pageId && onNavigatePage) {
          onNavigatePage(pageId);
        }
      } else if (action === 'open_url') {
        const url = e.currentTarget.getAttribute('data-target') || component.url;
        if (url) {
          window.open(url, component.openInNewTab ? '_blank' : '_self');
        }
      } else if (action === 'download_file') {
        const fileName = e.currentTarget.getAttribute('data-file') || component.downloadFileName || 'downloaded-file.txt';
        const blob = new Blob([`تم تنزيل هذا الملف عبر زر NoklenWeb: ${component.text}\nاسم الملف: ${fileName}\nتاريخ التنزيل: ${new Date().toLocaleString('ar')}`], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = component.downloadFileUrl || url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        alert(`📥 جاري تحميل الملف على جهازك:\n${fileName}`);
      } else if (action === 'alert_message') {
        const alertMsg = e.currentTarget.getAttribute('data-target') || component.alertText || 'مرحباً بك في موقع NoklenWeb!';
        alert(alertMsg);
      } else if (action === 'copy_text') {
        const textToCopy = e.currentTarget.getAttribute('data-target') || component.copyText || component.text;
        navigator.clipboard.writeText(textToCopy);
        alert(`📋 تم نسخ النص التالي إلى الحافظة بنجاح:\n"${textToCopy}"`);
      } else if (action === 'scroll_to') {
        const targetId = component.targetElementId;
        if (targetId) {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          else alert(`لم يتم العثور على عنصر بالمعرف #${targetId}`);
        }
      } else if (action === 'toggle_element') {
        const targetId = component.targetElementId;
        if (targetId) {
          const el = document.getElementById(targetId);
          if (el) el.classList.toggle('hidden');
        }
      } else if (action === 'firebase_submit') {
        alert(`🔥 تم إرسال البيانات بنجاح إلى Firebase Firestore في مجموعة (${component.firebaseCollection || 'messages'})!`);
      } else if (action === 'custom_js' && component.customScript) {
        try {
          // eslint-disable-next-line no-eval
          eval(component.customScript);
        } catch (err: any) {
          alert('خطأ في السكربت: ' + err.message);
        }
      }
    }
  };

  const handleChoiceSelect = (opt: any, isChecked: boolean) => {
    if (isChecked && opt.targetButtonId) {
      const targetBtn = document.querySelector(
        `[data-button-id="${opt.targetButtonId}"], #${opt.targetButtonId}`
      ) as HTMLElement;

      if (targetBtn) {
        if (opt.buttonNewText) {
          const textSpan = targetBtn.querySelector('.btn-label') || targetBtn.querySelector('span');
          if (textSpan) {
            textSpan.textContent = opt.buttonNewText;
          }
        }
        if (opt.buttonNewAction) {
          targetBtn.setAttribute('data-action', opt.buttonNewAction);
        }
        if (opt.buttonNewTarget) {
          targetBtn.setAttribute('data-target', opt.buttonNewTarget);
          targetBtn.setAttribute('data-page', opt.buttonNewTarget);
          targetBtn.setAttribute('data-file', opt.buttonNewTarget);
          targetBtn.setAttribute('data-url', opt.buttonNewTarget);
          targetBtn.setAttribute('data-alert', opt.buttonNewTarget);
          targetBtn.setAttribute('data-copy', opt.buttonNewTarget);
        }

        // Apply new variant styling if specified
        if (opt.buttonNewVariant) {
          targetBtn.classList.remove(
            'bg-indigo-600', 'hover:bg-indigo-500', 
            'bg-emerald-600', 'hover:bg-emerald-500', 
            'bg-rose-600', 'hover:bg-rose-500', 
            'bg-neutral-800', 'hover:bg-neutral-700',
            'border-indigo-500', 'text-indigo-400'
          );

          if (opt.buttonNewVariant === 'success') {
            targetBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-500', 'text-white');
          } else if (opt.buttonNewVariant === 'danger') {
            targetBtn.classList.add('bg-rose-600', 'hover:bg-rose-500', 'text-white');
          } else if (opt.buttonNewVariant === 'primary') {
            targetBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-500', 'text-white');
          } else if (opt.buttonNewVariant === 'secondary') {
            targetBtn.classList.add('bg-neutral-800', 'hover:bg-neutral-700', 'text-neutral-100');
          } else if (opt.buttonNewVariant === 'outline') {
            targetBtn.classList.add('bg-transparent', 'border', 'border-indigo-500', 'text-indigo-400');
          }
        }

        // Visual indicator that button was updated
        targetBtn.classList.add('ring-4', 'ring-emerald-400', 'scale-105');
        setTimeout(() => {
          targetBtn.classList.remove('ring-4', 'ring-emerald-400', 'scale-105');
        }, 1200);

        if (isInteractivePreview) {
          console.log(`⚡ Changed Button #${opt.targetButtonId} action to ${opt.buttonNewAction}`);
        }
      }
    }
  };

  const handleFileDownload = (e: React.MouseEvent, fileName: string) => {
    if (!isInteractivePreview) return;
    e.stopPropagation();
    alert(`📥 جاري تحميل الملف: ${fileName}\nتم تجهيز الملف بنجاح للتنزيل على جهازك!`);
  };

  const renderContent = () => {
    switch (component.type) {
      case 'divider': {
        const borderStyles: Record<string, string> = {
          solid: 'border-solid',
          dashed: 'border-dashed',
          dotted: 'border-dotted',
          gradient: 'border-solid',
        };

        const widthClasses: Record<string, string> = {
          full: 'w-full',
          half: 'w-1/2 mx-auto',
          quarter: 'w-1/4 mx-auto',
        };

        const borderStyle = borderStyles[component.style] || 'border-solid';
        const widthClass = widthClasses[component.width] || 'w-full';

        if (component.hasLabel && component.label) {
          return (
            <div className={`my-4 flex items-center ${widthClass}`}>
              <div
                className="flex-grow border-t"
                style={{ borderColor: component.color, borderWidth: component.thickness }}
              />
              <span className="px-3 text-xs font-semibold text-neutral-400 select-none">
                {component.label}
              </span>
              <div
                className="flex-grow border-t"
                style={{ borderColor: component.color, borderWidth: component.thickness }}
              />
            </div>
          );
        }

        return (
          <div className={`my-4 ${widthClass}`}>
            <hr
              className={borderStyle}
              style={{ borderColor: component.color, borderWidth: component.thickness }}
            />
          </div>
        );
      }

      case 'heading': {
        const Tag = component.level || 'h2';
        const alignClass =
          component.align === 'center'
            ? 'text-center'
            : component.align === 'left'
            ? 'text-left'
            : 'text-right';

        const sizeClasses = {
          h1: 'text-3xl md:text-4xl font-extrabold',
          h2: 'text-2xl md:text-3xl font-bold',
          h3: 'text-xl md:text-2xl font-semibold',
        };

        return (
          <div className={`my-4 ${alignClass}`}>
            <Tag className={`${sizeClasses[component.level || 'h2']} text-white tracking-tight`}>
              {component.text}
            </Tag>
            {component.subtitle && (
              <p
                className={`mt-2 text-neutral-400 text-sm md:text-base max-w-2xl ${
                  component.align === 'center' ? 'mx-auto' : ''
                }`}
              >
                {component.subtitle}
              </p>
            )}
          </div>
        );
      }

      case 'paragraph': {
        const alignClass =
          component.align === 'center'
            ? 'text-center'
            : component.align === 'left'
            ? 'text-left'
            : 'text-right';

        const sizeClasses = {
          sm: 'text-xs md:text-sm text-neutral-400',
          base: 'text-sm md:text-base text-neutral-300',
          lg: 'text-base md:text-lg text-neutral-200',
        };

        return (
          <div className={`my-3 ${alignClass}`}>
            <p className={`${sizeClasses[component.size || 'base']} leading-relaxed`}>
              {component.text}
            </p>
          </div>
        );
      }

      case 'button': {
        const alignClass =
          component.align === 'center'
            ? 'text-center'
            : component.align === 'end'
            ? 'text-left'
            : component.align === 'full'
            ? 'block w-full'
            : 'text-right';

        const variantClasses = {
          primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20',
          secondary: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700',
          outline: 'bg-transparent hover:bg-neutral-800 text-indigo-400 border border-indigo-500',
          ghost: 'bg-transparent hover:bg-neutral-800 text-neutral-300',
          danger: 'bg-rose-600 hover:bg-rose-500 text-white',
          success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
        };

        const sizeClasses = {
          sm: 'px-3 py-1.5 text-xs',
          md: 'px-5 py-2.5 text-sm font-semibold',
          lg: 'px-7 py-3 text-base font-bold',
        };

        // Find target page title for badge in editor
        const targetPage = pages.find((p) => p.id === component.targetPageId);

        // Button ID for dynamic wiring
        const effectiveButtonId = component.buttonId || component.id;

        return (
          <div className={`my-3 ${alignClass}`}>
            <button
              id={effectiveButtonId}
              data-button-id={effectiveButtonId}
              data-action={component.actionType}
              data-target={
                component.actionType === 'navigate_page'
                  ? component.targetPageId
                  : component.actionType === 'open_url'
                  ? component.url
                  : component.actionType === 'download_file'
                  ? component.downloadFileName
                  : component.actionType === 'alert_message'
                  ? component.alertText
                  : component.actionType === 'copy_text'
                  ? component.copyText
                  : component.targetElementId || ''
              }
              data-page={component.targetPageId || ''}
              data-file={component.downloadFileName || ''}
              onClick={handleButtonClick}
              className={`rounded-lg transition-all inline-flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                variantClasses[component.variant || 'primary']
              } ${sizeClasses[component.size || 'md']} ${
                component.align === 'full' ? 'w-full' : ''
              }`}
            >
              <span className="btn-label">{component.text}</span>
              {component.actionType === 'navigate_page' && (
                <span className="text-xs opacity-75 font-mono">→</span>
              )}
              {component.actionType === 'download_file' && (
                <Download className="w-3.5 h-3.5 opacity-80" />
              )}
            </button>

            {!isInteractivePreview && (
              <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
                <span className="text-[10px] text-indigo-400/90 font-mono bg-indigo-950/60 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                  ID: #{effectiveButtonId}
                </span>
                {component.actionType === 'navigate_page' && (
                  <span className="text-[11px] text-neutral-500">
                    ينتقل إلى: {targetPage ? targetPage.title : 'غير محدد'}
                  </span>
                )}
                {component.actionType === 'download_file' && (
                  <span className="text-[11px] text-emerald-400">
                    تحميل: {component.downloadFileName || 'ملف'}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      }

      case 'image_with_caption': {
        const roundedClasses = {
          none: 'rounded-none',
          md: 'rounded-md',
          lg: 'rounded-xl',
          '2xl': 'rounded-2xl',
          full: 'rounded-full',
        };

        return (
          <figure
            className={`my-4 bg-neutral-900 border border-neutral-800 ${
              roundedClasses[component.rounded || 'lg']
            } overflow-hidden shadow-lg`}
          >
            <div className="relative overflow-hidden bg-neutral-950 flex items-center justify-center min-h-48">
              {component.imageUrl ? (
                <img
                  src={component.imageUrl}
                  alt={component.alt || component.caption}
                  className="w-full h-auto object-cover max-h-96"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to placeholder if broken
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="p-8 text-center text-neutral-500 flex flex-col items-center">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <span>لم يتم تحديد رابط الصورة</span>
                </div>
              )}
            </div>
            {(component.caption || component.description) && (
              <figcaption className="p-4 border-t border-neutral-800/80 bg-neutral-900/90 text-right">
                {component.caption && (
                  <h4 className="text-sm md:text-base font-bold text-neutral-100">
                    {component.caption}
                  </h4>
                )}
                {component.description && (
                  <p className="mt-1 text-xs md:text-sm text-neutral-400 leading-relaxed">
                    {component.description}
                  </p>
                )}
              </figcaption>
            )}
          </figure>
        );
      }

      case 'file_attachment': {
        const typeIcons: Record<string, { label: string; icon: React.ReactNode }> = {
          pdf: { label: 'PDF', icon: <FileText className="w-5 h-5 text-rose-400" /> },
          zip: { label: 'ZIP', icon: <FileArchive className="w-5 h-5 text-amber-400" /> },
          code: { label: 'CODE', icon: <FileCode className="w-5 h-5 text-sky-400" /> },
          doc: { label: 'DOC', icon: <FileSpreadsheet className="w-5 h-5 text-blue-400" /> },
          image: { label: 'IMG', icon: <ImageIcon className="w-5 h-5 text-emerald-400" /> },
          audio: { label: 'AUDIO', icon: <FileText className="w-5 h-5 text-purple-400" /> },
        };

        const fileMeta = typeIcons[component.fileType] || {
          label: 'FILE',
          icon: <FileText className="w-5 h-5 text-neutral-400" />,
        };

        return (
          <div className="my-3 p-4 bg-neutral-900/90 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-right">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 shrink-0">
                {fileMeta.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-neutral-100 text-sm">
                    {component.fileName || 'ملف بدون اسم'}
                  </h4>
                  {component.fileSize && (
                    <span className="text-[11px] text-neutral-500 font-mono">
                      {component.fileSize}
                    </span>
                  )}
                </div>
                {component.description && (
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    {component.description}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={(e) => handleFileDownload(e, component.fileName)}
              className="px-3.5 py-2 bg-indigo-600/15 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{component.buttonText || 'تحميل الملف'}</span>
            </button>
          </div>
        );
      }

      case 'choices': {
        return (
          <div className="my-4 p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl text-right">
            <h4 className="text-sm font-bold text-neutral-100 mb-1">{component.title}</h4>
            {component.description && (
              <p className="text-xs text-neutral-400 mb-3">{component.description}</p>
            )}
            <div className="space-y-2 mt-2">
              {component.options.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80 hover:border-neutral-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type={component.choiceType === 'radio' ? 'radio' : 'checkbox'}
                      name={`choice_${component.id}`}
                      value={opt.value}
                      defaultChecked={opt.checked}
                      onChange={(e) => handleChoiceSelect(opt, e.target.checked)}
                      className="w-4 h-4 accent-indigo-600 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className="text-xs text-neutral-300 select-none">{opt.label}</span>
                  </div>

                  {opt.targetButtonId && (
                    <span className="text-[10px] text-indigo-400 bg-indigo-950/80 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
                      ⚡ يغير زر (#{opt.targetButtonId})
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        );
      }

      case 'list': {
        return (
          <div className="my-3 p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl text-right">
            {component.title && (
              <h4 className="text-xs font-bold text-neutral-200 mb-2">{component.title}</h4>
            )}
            <ul className="space-y-1.5">
              {component.items.map((item, idx) => (
                <li
                  key={item.id}
                  className="flex items-start gap-2.5 py-1 text-xs border-b border-neutral-800/50 last:border-0"
                >
                  {component.listType === 'numbered' ? (
                    <span className="w-5 h-5 rounded-full bg-indigo-600/20 text-indigo-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                  ) : component.listType === 'check' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <span className="text-indigo-400 shrink-0 font-bold">•</span>
                  )}
                  <div>
                    <span className="font-semibold text-neutral-200">{item.title}</span>
                    {item.description && (
                      <p className="text-[11px] text-neutral-400 mt-0.5">{item.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      }

      case 'navbar': {
        return (
          <header className="border-b border-neutral-800 bg-neutral-950/80 px-4 py-2.5 rounded-lg mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-indigo-400 text-sm">{component.brandName}</span>
              {component.brandTagline && (
                <span className="text-[11px] text-neutral-500 hidden sm:inline border-r border-neutral-800 pr-2">
                  {component.brandTagline}
                </span>
              )}
            </div>
            <nav className="flex items-center gap-3 text-xs">
              {component.links.map((link) => (
                <button
                  key={link.id}
                  onClick={(e) => {
                    if (isInteractivePreview && link.pageId && onNavigatePage) {
                      e.stopPropagation();
                      onNavigatePage(link.pageId);
                    }
                  }}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
              {component.ctaText && (
                <button
                  onClick={(e) => {
                    if (isInteractivePreview && component.ctaTarget && onNavigatePage) {
                      e.stopPropagation();
                      onNavigatePage(component.ctaTarget);
                    }
                  }}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium cursor-pointer"
                >
                  {component.ctaText}
                </button>
              )}
            </nav>
          </header>
        );
      }

      case 'card': {
        return (
          <div className="my-4 p-5 bg-neutral-900 border border-neutral-800 rounded-xl text-right">
            {component.badge && (
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1 block">
                {component.badge}
              </span>
            )}
            <h4 className="text-base font-bold text-white mb-1.5">{component.title}</h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              {component.description}
            </p>
            {component.buttonText && (
              <button
                onClick={(e) => {
                  if (isInteractivePreview && component.buttonPageId && onNavigatePage) {
                    e.stopPropagation();
                    onNavigatePage(component.buttonPageId);
                  }
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                {component.buttonText}
              </button>
            )}
          </div>
        );
      }

      case 'form_input': {
        return (
          <div className="my-4 p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl text-right">
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              {component.label}
            </label>
            <div className="flex gap-2">
              <input
                type={component.inputType === 'textarea' ? 'text' : component.inputType}
                placeholder={component.placeholder}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => {
                  if (isInteractivePreview) {
                    alert(component.successMessage || 'تم الإرسال بنجاح!');
                  }
                }}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shrink-0 cursor-pointer"
              >
                {component.buttonText || 'إرسال'}
              </button>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  // If in interactive preview mode, just return content cleanly
  if (isInteractivePreview) {
    return <div className="transition-all">{renderContent()}</div>;
  }

  // Builder Canvas Mode with selection boundary and quick action toolbar
  return (
    <div
      onClick={onSelect}
      className={`relative group rounded-xl transition-all ${
        isSelected
          ? 'ring-2 ring-indigo-500 bg-indigo-950/10 p-1.5'
          : 'hover:ring-1 hover:ring-neutral-700/80 p-1.5'
      }`}
    >
      {/* Component Type Badge & Quick Controls */}
      <div
        className={`absolute -top-3.5 right-3 z-20 flex items-center gap-1 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-md shadow-md text-[10px] ${
          isSelected ? 'opacity-100 border-indigo-500/60' : 'opacity-0 group-hover:opacity-100'
        } transition-opacity`}
      >
        <span className="font-semibold text-neutral-300">
          {component.type === 'divider'
            ? 'فاصلة'
            : component.type === 'list'
            ? 'قائمة'
            : component.type === 'choices'
            ? 'اختيارات'
            : component.type === 'button'
            ? 'زر'
            : component.type === 'image_with_caption'
            ? 'صورة مع وصف'
            : component.type === 'file_attachment'
            ? 'ملف مع وصف'
            : component.type === 'heading'
            ? 'عنوان'
            : component.type === 'paragraph'
            ? 'فقرة'
            : component.type === 'navbar'
            ? 'شريط علوي'
            : component.type === 'card'
            ? 'بطاقة'
            : 'حقل إدخال'}
        </span>

        <div className="flex items-center gap-0.5 border-r border-neutral-700 pr-1 mr-1">
          {!isFirst && onMoveUp && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              className="p-0.5 text-neutral-400 hover:text-white rounded"
              title="تحريك لأعلى"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
          )}

          {!isLast && onMoveDown && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              className="p-0.5 text-neutral-400 hover:text-white rounded"
              title="تحريك لأسفل"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          )}

          {onDuplicate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              className="p-0.5 text-neutral-400 hover:text-indigo-400 rounded"
              title="تكرار المكون"
            >
              <Copy className="w-3 h-3" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-0.5 text-neutral-400 hover:text-rose-400 rounded"
              title="حذف المكون"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {renderContent()}
    </div>
  );
};
