import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Home, 
  Copy, 
  Settings, 
  Edit3,
  Check,
  X,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { Page } from '../types/builder';

interface PagesManagerProps {
  pages: Page[];
  activePageId: string;
  onSelectPage: (pageId: string) => void;
  onAddPage: (title: string) => void;
  onDeletePage: (pageId: string) => void;
  onDuplicatePage: (pageId: string) => void;
  onSetHomePage: (pageId: string) => void;
  onUpdatePageTitle: (pageId: string, title: string) => void;
  onUpdatePageSettings?: (pageId: string, settings: { slug?: string; seoTitle?: string; seoDescription?: string }) => void;
  onCloseMobile?: () => void;
  onOpenFullModal?: () => void;
}

export const PagesManager: React.FC<PagesManagerProps> = ({
  pages,
  activePageId,
  onSelectPage,
  onAddPage,
  onDeletePage,
  onDuplicatePage,
  onSetHomePage,
  onUpdatePageTitle,
  onUpdatePageSettings,
  onCloseMobile,
  onOpenFullModal,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  
  // Quick rename state
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Page settings modal state
  const [settingsPageId, setSettingsPageId] = useState<string | null>(null);
  const [pageSlug, setPageSlug] = useState('');
  const [pageSeoTitle, setPageSeoTitle] = useState('');
  const [pageSeoDesc, setPageSeoDesc] = useState('');

  // Delete page confirmation modal state (replaces broken browser confirm)
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null);

  const activePage = pages.find((p) => p.id === activePageId) || pages[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;
    onAddPage(newPageTitle.trim());
    setNewPageTitle('');
    setIsAdding(false);
  };

  const handleStartRename = (page: Page, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPageId(page.id);
    setEditingTitle(page.title);
  };

  const handleSaveRename = (pageId: string) => {
    if (editingTitle.trim()) {
      onUpdatePageTitle(pageId, editingTitle.trim());
    }
    setEditingPageId(null);
  };

  const handleOpenSettings = (page: Page, e: React.MouseEvent) => {
    e.stopPropagation();
    setSettingsPageId(page.id);
    setPageSlug(page.slug || '');
    setPageSeoTitle(page.seoTitle || page.title);
    setPageSeoDesc(page.seoDescription || '');
  };

  const handleSaveSettings = () => {
    if (!settingsPageId) return;
    if (onUpdatePageSettings) {
      onUpdatePageSettings(settingsPageId, {
        slug: pageSlug.trim().toLowerCase().replace(/[\s\W-]+/g, '-'),
        seoTitle: pageSeoTitle.trim(),
        seoDescription: pageSeoDesc.trim(),
      });
    }
    setSettingsPageId(null);
  };

  return (
    <div className="bg-neutral-900 border-b border-neutral-800 p-3 select-none flex flex-col">
      {/* Mobile drag handle if rendered inside bottom sheet */}
      {onCloseMobile && (
        <div className="pt-1 pb-3 flex flex-col items-center lg:hidden border-b border-neutral-800/80 mb-3">
          <div className="w-10 h-1.5 bg-neutral-700 rounded-full mb-2" />
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white">محرر الصفحات</span>
              <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold">
                {pages.length} صفحات
              </span>
            </div>
            <button
              onClick={onCloseMobile}
              className="text-xs text-neutral-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-neutral-800 font-bold"
            >
              إغلاق ✕
            </button>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-200">
          <FileText className="w-4 h-4 text-indigo-400" />
          <span>محرر الصفحات ({pages.length})</span>
          {onOpenFullModal && (
            <button
              onClick={onOpenFullModal}
              className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
              title="فتح محرر الصفحات في نافذة كاملة"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white transition-all flex items-center gap-1.5 text-xs font-semibold shadow-xs shadow-indigo-600/20 cursor-pointer min-h-[36px]"
          title="إضافة صفحة جديدة للموقع"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>صفحة جديدة</span>
        </button>
      </div>

      {/* Quick Active Page Action Card */}
      <div className="mb-3 p-2.5 rounded-xl bg-neutral-950 border border-indigo-500/30 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="text-[10px] text-neutral-500 block">الصفحة المفتوحة الآن:</span>
          <h4 className="text-xs font-bold text-white truncate flex items-center gap-1">
            {activePage.isHome && <Home className="w-3 h-3 text-amber-400 shrink-0" />}
            <span>{activePage.title}</span>
            <span className="text-[10px] text-neutral-400 font-mono">({activePage.components.length} مكون)</span>
          </h4>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => handleStartRename(activePage, e)}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs flex items-center gap-1 transition-colors"
            title="تعديل اسم الصفحة"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px] hidden sm:inline">تعديل الاسم</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicatePage(activePage.id); }}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs flex items-center gap-1 transition-colors"
            title="استنساخ هذه الصفحة"
          >
            <Copy className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] hidden sm:inline">استنساخ</span>
          </button>
        </div>
      </div>

      {/* New Page Creation Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="mb-3 p-2.5 rounded-xl bg-neutral-950 border border-indigo-500/50 flex flex-col gap-2">
          <span className="text-xs font-semibold text-neutral-300">اسم الصفحة الجديدة:</span>
          <div className="flex gap-1.5">
            <input
              type="text"
              placeholder="مثال: من نحن، خدماتنا، اتصل بنا..."
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
            >
              إضافة
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 rounded-lg text-xs"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}

      {/* Pages List with Actions */}
      <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-0.5">
        {pages.map((page) => {
          const isActive = page.id === activePageId;
          const isRenaming = editingPageId === page.id;

          return (
            <div
              key={page.id}
              onClick={() => {
                onSelectPage(page.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all min-h-[46px] ${
                isActive
                  ? 'bg-indigo-600/20 border border-indigo-500/50 text-white font-semibold shadow-xs'
                  : 'bg-neutral-950/60 hover:bg-neutral-800/80 border border-neutral-800 text-neutral-300'
              }`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {page.isHome ? (
                  <span title="الصفحة الرئيسية" className="flex items-center">
                    <Home className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  </span>
                ) : (
                  <FileText className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                )}

                {isRenaming ? (
                  <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(page.id)}
                      autoFocus
                      className="bg-neutral-900 border border-indigo-500 rounded px-2 py-0.5 text-xs text-white w-full focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveRename(page.id)}
                      className="p-1 text-emerald-400 hover:bg-neutral-800 rounded"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingPageId(null)}
                      className="p-1 text-neutral-400 hover:bg-neutral-800 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 truncate">
                    <span 
                      onDoubleClick={(e) => handleStartRename(page, e)}
                      className="truncate font-medium"
                      title="انقر لتحديد الصفحة، أو استخدم أزرار الإجراءات"
                    >
                      {page.title}
                    </span>
                    {page.isHome && (
                      <span className="text-[10px] text-amber-400 font-mono bg-amber-400/10 px-1 rounded shrink-0">
                        رئيسية
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons on each page item */}
              {!isRenaming && (
                <div className="flex items-center gap-1 shrink-0">
                  {/* Edit Name Button */}
                  <button
                    onClick={(e) => handleStartRename(page, e)}
                    className="p-1 text-neutral-400 hover:text-indigo-400 rounded hover:bg-neutral-800"
                    title="تعديل اسم الصفحة"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Duplicate Page Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onDuplicatePage(page.id); }}
                    className="p-1 text-neutral-400 hover:text-emerald-400 rounded hover:bg-neutral-800"
                    title="استنساخ الصفحة بالكامل"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Set as Homepage */}
                  {!page.isHome && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onSetHomePage(page.id); }}
                      className="p-1 text-neutral-400 hover:text-amber-400 rounded hover:bg-neutral-800"
                      title="تعيين كصفحة رئيسية"
                    >
                      <Home className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Delete Page Button */}
                  {pages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPageToDelete(page);
                      }}
                      className="p-1 text-neutral-400 hover:text-rose-400 rounded hover:bg-neutral-800 transition-colors"
                      title="حذف الصفحة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {pageToDelete && (
        <div 
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm p-4 text-right space-y-3 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400">
              <Trash2 className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm">تأكيد حذف الصفحة</h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف صفحة <strong className="text-white font-bold">"{pageToDelete.title}"</strong>؟ سيتم حذف جميع المكونات بداخلها.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setPageToDelete(null)}
                className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeletePage(pageToDelete.id);
                  setPageToDelete(null);
                }}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/30"
              >
                نعم، حذف الصفحة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Settings Modal */}
      {settingsPageId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm p-4 text-right space-y-3">
            <h3 className="font-bold text-white text-sm">إعدادات الصفحة المتقدمة</h3>
            <div>
              <label className="block text-neutral-400 text-xs mb-1">الرابط المختصر (Slug):</label>
              <input
                type="text"
                value={pageSlug}
                onChange={(e) => setPageSlug(e.target.value)}
                dir="ltr"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-neutral-400 text-xs mb-1">عنوان الصفحة في السيو (SEO Title):</label>
              <input
                type="text"
                value={pageSeoTitle}
                onChange={(e) => setPageSeoTitle(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-400 text-xs mb-1">وصف الصفحة (SEO Description):</label>
              <textarea
                rows={2}
                value={pageSeoDesc}
                onChange={(e) => setPageSeoDesc(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
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
    </div>
  );
};
