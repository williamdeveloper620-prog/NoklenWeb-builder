import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Plus, 
  Trash2, 
  Copy, 
  Home, 
  Edit3, 
  Check, 
  ArrowUp, 
  ArrowDown, 
  Settings, 
  Globe, 
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Page } from '../types/builder';

interface PageManagerModalProps {
  pages: Page[];
  activePageId: string;
  onClose: () => void;
  onSelectPage: (pageId: string) => void;
  onAddPage: (title: string) => void;
  onDeletePage: (pageId: string) => void;
  onDuplicatePage: (pageId: string) => void;
  onSetHomePage: (pageId: string) => void;
  onUpdatePageTitle: (pageId: string, title: string) => void;
  onReorderPages?: (newPages: Page[]) => void;
  onUpdatePageSettings?: (pageId: string, settings: { slug?: string; seoTitle?: string; seoDescription?: string }) => void;
}

export const PageManagerModal: React.FC<PageManagerModalProps> = ({
  pages,
  activePageId,
  onClose,
  onSelectPage,
  onAddPage,
  onDeletePage,
  onDuplicatePage,
  onSetHomePage,
  onUpdatePageTitle,
  onReorderPages,
  onUpdatePageSettings,
}) => {
  const [newPageTitle, setNewPageTitle] = useState('');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState('');

  // Page advanced settings modal state
  const [settingsPageId, setSettingsPageId] = useState<string | null>(null);
  const [pageSlug, setPageSlug] = useState('');
  const [pageSeoTitle, setPageSeoTitle] = useState('');
  const [pageSeoDesc, setPageSeoDesc] = useState('');

  // Delete page confirmation modal state (in-app modal)
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null);

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;
    onAddPage(newPageTitle.trim());
    setNewPageTitle('');
  };

  const handleStartRename = (page: Page) => {
    setEditingPageId(page.id);
    setEditingTitleText(page.title);
  };

  const handleSaveRename = (pageId: string) => {
    if (editingTitleText.trim()) {
      onUpdatePageTitle(pageId, editingTitleText.trim());
    }
    setEditingPageId(null);
  };

  const handleMovePage = (index: number, direction: 'up' | 'down') => {
    if (!onReorderPages) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;

    const updated = [...pages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onReorderPages(updated);
  };

  const handleOpenSettings = (page: Page) => {
    setSettingsPageId(page.id);
    setPageSlug(page.slug || '');
    setPageSeoTitle(page.seoTitle || page.title);
    setPageSeoDesc(page.seoDescription || '');
  };

  const handleSaveSettings = () => {
    if (!settingsPageId || !onUpdatePageSettings) return;
    onUpdatePageSettings(settingsPageId, {
      slug: pageSlug.trim().toLowerCase().replace(/[\s\W-]+/g, '-'),
      seoTitle: pageSeoTitle.trim(),
      seoDescription: pageSeoDesc.trim(),
    });
    setSettingsPageId(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none">
      <div 
        className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-right shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <span>محرر الصفحات وإدارتها</span>
                <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-mono">
                  {pages.length} صفحات
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                أضف صفحات، عدّل أسماءها، استنسخها، أو احذفها، وتحكم في التنقل بينها
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create New Page Form */}
        <div className="p-4 bg-neutral-950/90 border-b border-neutral-800/80 shrink-0">
          <form onSubmit={handleCreatePage} className="flex gap-2">
            <input
              type="text"
              placeholder="اكتب اسم الصفحة الجديدة (مثال: المدونة، من نحن، الشروط، اتصل بنا...)"
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              className="flex-1 bg-neutral-900 border border-neutral-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newPageTitle.trim()}
              className="px-4 sm:px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة صفحة</span>
            </button>
          </form>
        </div>

        {/* Pages Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {pages.map((page, idx) => {
            const isActive = page.id === activePageId;
            const isEditing = editingPageId === page.id;

            return (
              <div
                key={page.id}
                className={`p-3 sm:p-4 rounded-xl border transition-all ${
                  isActive
                    ? 'bg-indigo-950/30 border-indigo-500/60 shadow-md shadow-indigo-950/50'
                    : 'bg-neutral-950/60 hover:bg-neutral-950 border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left / Info side */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => {
                        onSelectPage(page.id);
                        onClose();
                      }}
                      className="cursor-pointer"
                      title="فتح هذه الصفحة في المحرر"
                    >
                      {page.isHome ? (
                        <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                          <Home className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingTitleText}
                            onChange={(e) => setEditingTitleText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(page.id)}
                            autoFocus
                            className="bg-neutral-900 border border-indigo-500 rounded-lg px-2.5 py-1 text-sm text-white font-bold w-full max-w-xs focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveRename(page.id)}
                            className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
                            title="حفظ الاسم"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingPageId(null)}
                            className="p-1.5 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700"
                            title="إلغاء"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 
                            onClick={() => {
                              onSelectPage(page.id);
                              onClose();
                            }}
                            className="text-sm font-bold text-white hover:text-indigo-400 cursor-pointer transition-colors truncate"
                          >
                            {page.title}
                          </h4>
                          {page.isHome && (
                            <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                              الصفحة الرئيسية
                            </span>
                          )}
                          {isActive && (
                            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                              المفتوحة حالياً
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-3 mt-1 text-[11px] text-neutral-400 font-mono">
                        <span>الرابط: /{page.slug}</span>
                        <span>•</span>
                        <span>{page.components.length} مكونات</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Buttons Group */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    {/* Open / Select Page */}
                    {!isActive && (
                      <button
                        onClick={() => {
                          onSelectPage(page.id);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 bg-neutral-800 hover:bg-indigo-600 text-neutral-300 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        title="فتح الصفحة في المحرر"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>فتح</span>
                      </button>
                    )}

                    {/* Edit Name Button */}
                    <button
                      onClick={() => handleStartRename(page)}
                      className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-indigo-400 border border-neutral-800 transition-colors"
                      title="تعديل اسم الصفحة"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Duplicate Page Button */}
                    <button
                      onClick={() => onDuplicatePage(page.id)}
                      className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-emerald-400 border border-neutral-800 transition-colors"
                      title="استنساخ الصفحة بالكامل (Duplicate)"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Set as Homepage */}
                    {!page.isHome && (
                      <button
                        onClick={() => onSetHomePage(page.id)}
                        className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 border border-neutral-800 transition-colors"
                        title="تعيين هذه الصفحة كصفحة رئيسية"
                      >
                        <Home className="w-4 h-4" />
                      </button>
                    )}

                    {/* Move Up/Down Order */}
                    {onReorderPages && (
                      <div className="flex items-center gap-0.5 bg-neutral-900 p-0.5 rounded-lg border border-neutral-800">
                        <button
                          onClick={() => handleMovePage(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-20"
                          title="تحريك لأعلى"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMovePage(idx, 'down')}
                          disabled={idx === pages.length - 1}
                          className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-20"
                          title="تحريك لأسفل"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Advanced Settings */}
                    <button
                      onClick={() => handleOpenSettings(page)}
                      className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800"
                      title="إعدادات الرابط والسيو (SEO)"
                    >
                      <Settings className="w-4 h-4" />
                    </button>

                    {/* Delete Page Button */}
                    {pages.length > 1 && (
                      <button
                        onClick={() => setPageToDelete(page)}
                        className="p-2 rounded-lg bg-neutral-900 hover:bg-rose-950/60 text-neutral-400 hover:text-rose-400 border border-neutral-800 hover:border-rose-500/40 transition-colors"
                        title="حذف الصفحة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Delete Confirmation Modal */}
        {pageToDelete && (
          <div 
            className="fixed inset-0 z-70 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm p-5 text-right space-y-3.5 shadow-2xl">
              <div className="flex items-center gap-2 text-rose-400">
                <Trash2 className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">تأكيد حذف الصفحة</h3>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                هل أنت متأكد من رغبتك في حذف صفحة <strong className="text-white font-bold">"{pageToDelete.title}"</strong>؟ سيتم حذف جميع المكونات بداخلها ولا يمكن التراجع.
              </p>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setPageToDelete(null)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeletePage(pageToDelete.id);
                    setPageToDelete(null);
                  }}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30"
                >
                  نعم، حذف الصفحة
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Settings Sub-Modal */}
        {settingsPageId && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm p-4 text-right space-y-3 shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <h4 className="font-bold text-white text-sm">إعدادات الصفحة والسيو (SEO)</h4>
                <button onClick={() => setSettingsPageId(null)} className="text-neutral-500 hover:text-white">✕</button>
              </div>

              <div>
                <label className="block text-neutral-400 text-xs mb-1">الرابط المختصر (Slug):</label>
                <input
                  type="text"
                  value={pageSlug}
                  onChange={(e) => setPageSlug(e.target.value)}
                  dir="ltr"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-400 text-xs mb-1">عنوان الصفحة في السيو (SEO Title):</label>
                <input
                  type="text"
                  value={pageSeoTitle}
                  onChange={(e) => setPageSeoTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 text-xs mb-1">وصف الصفحة (SEO Description):</label>
                <textarea
                  rows={2}
                  value={pageSeoDesc}
                  onChange={(e) => setPageSeoDesc(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setSettingsPageId(null)}
                  className="px-3 py-1.5 bg-neutral-800 text-neutral-300 rounded-lg text-xs"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                >
                  حفظ الإعدادات
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 flex items-center justify-between bg-neutral-950/70 text-xs shrink-0">
          <span className="text-neutral-500">
            الصفحة المحددة حالياً: <strong className="text-indigo-400 font-bold">{pages.find(p => p.id === activePageId)?.title}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            إغلاق المحرر
          </button>
        </div>
      </div>
    </div>
  );
};
