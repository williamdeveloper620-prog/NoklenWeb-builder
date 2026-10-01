import React from 'react';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Plus, 
  Layers, 
  Eye, 
  Download,
  FileJson,
  Sliders,
  CheckCircle2,
  Edit3, 
  Copy, 
  Trash2, 
  FileText, 
  ChevronDown,
  Sparkles,
  MousePointerClick,
  FileDown,
  Image as ImageIcon,
  CheckSquare,
  Split
} from 'lucide-react';
import { 
  Project, 
  Page, 
  BuilderComponent, 
  ViewportMode, 
  ComponentType 
} from '../types/builder';
import { ComponentRenderer } from './ComponentRenderer';

interface CanvasProps {
  project: Project;
  activePage: Page;
  selectedComponentId: string | null;
  viewportMode: ViewportMode;
  onSetViewportMode: (mode: ViewportMode) => void;
  onSelectComponent: (id: string) => void;
  onDeleteComponent: (id: string) => void;
  onDuplicateComponent: (id: string) => void;
  onMoveUpComponent: (index: number) => void;
  onMoveDownComponent: (index: number) => void;
  onAddComponent: (type: ComponentType) => void;
  onNavigatePage: (pageId: string) => void;
  onOpenLivePreview: () => void;
  onOpenInspectorMobile?: () => void;
  onDownloadZip: () => void;
  onDownloadProjectJson: () => void;
  onOpenPageManager?: () => void;
  onDuplicateCurrentPage?: () => void;
  onDeleteCurrentPage?: () => void;
  onRenameCurrentPage?: () => void;
  onOpenComponentLibrary?: () => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  project,
  activePage,
  selectedComponentId,
  viewportMode,
  onSetViewportMode,
  onSelectComponent,
  onDeleteComponent,
  onDuplicateComponent,
  onMoveUpComponent,
  onMoveDownComponent,
  onAddComponent,
  onNavigatePage,
  onOpenLivePreview,
  onOpenInspectorMobile,
  onDownloadZip,
  onDownloadProjectJson,
  onOpenPageManager,
  onDuplicateCurrentPage,
  onDeleteCurrentPage,
  onRenameCurrentPage,
  onOpenComponentLibrary,
}) => {
  const viewportWidthClass = {
    desktop: 'w-full max-w-4xl',
    tablet: 'w-full max-w-[768px]',
    mobile: 'w-full max-w-[390px]',
  }[viewportMode];

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-950 overflow-hidden select-none relative">
      {/* Canvas Toolbar */}
      <div className="h-12 border-b border-neutral-800 bg-neutral-900/80 px-2 sm:px-4 flex items-center justify-between text-xs text-neutral-400 shrink-0 gap-2">
        {/* Active Page Indicator with Page Editor Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
          {onOpenPageManager && (
            <button
              onClick={onOpenPageManager}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 hover:text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="فتح محرر الصفحات بالكامل"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>محرر الصفحات</span>
              <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.2 rounded-full font-mono font-bold">
                {project.pages.length}
              </span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
            <span className="px-2 py-0.5 rounded text-neutral-200 font-bold text-xs truncate max-w-[110px] sm:max-w-[180px]">
              {activePage.title}
            </span>
            {activePage.isHome && (
              <span className="text-[10px] text-amber-400 font-medium hidden sm:inline">★ رئيسية</span>
            )}

            {/* Quick Rename current page */}
            {onRenameCurrentPage && (
              <button
                onClick={onRenameCurrentPage}
                className="p-1 text-neutral-400 hover:text-indigo-400 rounded hover:bg-neutral-900 transition-colors"
                title="تعديل اسم هذه الصفحة"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            )}

            {/* Quick Duplicate current page */}
            {onDuplicateCurrentPage && (
              <button
                onClick={onDuplicateCurrentPage}
                className="p-1 text-neutral-400 hover:text-emerald-400 rounded hover:bg-neutral-900 transition-colors"
                title="استنساخ هذه الصفحة"
              >
                <Copy className="w-3 h-3" />
              </button>
            )}

            {/* Quick Delete current page */}
            {onDeleteCurrentPage && (
              <button
                onClick={onDeleteCurrentPage}
                className="p-1 text-neutral-400 hover:text-rose-400 rounded hover:bg-neutral-900 transition-colors"
                title="حذف هذه الصفحة"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Viewport switchers & Actions */}
        <div className="flex items-center gap-2">
          {/* Main + Add Component Button */}
          <button
            onClick={onOpenComponentLibrary || (() => onAddComponent('button'))}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white font-bold bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-lg shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            title="تصفح وإضافة كافة المكونات المتاحة (+)"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مكون (+)</span>
          </button>

          {/* Viewport switchers */}
          <div className="hidden sm:flex items-center gap-1 bg-neutral-950 p-0.5 rounded-lg border border-neutral-800">
            <button
              onClick={() => onSetViewportMode('desktop')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewportMode === 'desktop'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="شاشة كمبيوتر (Desktop)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSetViewportMode('tablet')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewportMode === 'tablet'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="جهاز لوحي (Tablet)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSetViewportMode('mobile')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewportMode === 'mobile'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="شاشة هاتف (Mobile)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Live Preview quick trigger */}
          <button
            onClick={onOpenLivePreview}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-500/10 border border-emerald-500/20 rounded-lg transition-colors cursor-pointer"
            title="معاينة تفاعلية للموقع"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">معاينة حية</span>
          </button>
        </div>
      </div>

      {/* Floating Mobile Edit Bar if a component is selected */}
      {selectedComponentId && (
        <div className="lg:hidden bg-indigo-950/80 border-b border-indigo-500/30 px-3 py-2 flex items-center justify-between z-20 text-xs">
          <div className="flex items-center gap-1.5 text-indigo-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span>تم تحديد مكون للتحكم به</span>
          </div>
          {onOpenInspectorMobile && (
            <button
              onClick={onOpenInspectorMobile}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>تعديل الخصائص</span>
            </button>
          )}
        </div>
      )}

      {/* Canvas Viewport Scroll Area */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-8 pb-32 lg:pb-12 flex justify-center bg-radial from-neutral-900/40 to-neutral-950 relative">
        <div
          className={`${viewportWidthClass} transition-all duration-300 min-h-full bg-neutral-900/90 border border-neutral-800 rounded-2xl shadow-2xl p-3 sm:p-6 md:p-8 flex flex-col relative`}
        >
          {/* Render Components List */}
          {activePage.components.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-xl my-auto">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-neutral-200 mb-1">الصفحة فارغة حالياً</h3>
              <p className="text-xs text-neutral-400 max-w-sm mb-5 leading-relaxed">
                انقر على زر "إضافة مكون (+)" أو اختر مباشرة من الخيارات السريعة أدناه:
              </p>
              <div className="flex flex-wrap gap-2.5 justify-center max-w-md">
                <button
                  onClick={() => onAddComponent('heading')}
                  className="px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-xl font-bold transition-colors min-h-[44px] flex items-center gap-1.5 border border-neutral-700 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-400" />
                  <span>+ عنوان</span>
                </button>
                <button
                  onClick={() => onAddComponent('button')}
                  className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-xl font-bold transition-colors min-h-[44px] flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  <MousePointerClick className="w-3.5 h-3.5" />
                  <span>+ زر وأمر</span>
                </button>
                <button
                  onClick={() => onAddComponent('choices')}
                  className="px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-xl font-bold transition-colors min-h-[44px] flex items-center gap-1.5 border border-neutral-700 cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-purple-400" />
                  <span>+ اختيارات</span>
                </button>
                <button
                  onClick={() => onAddComponent('image_with_caption')}
                  className="px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-xl font-bold transition-colors min-h-[44px] flex items-center gap-1.5 border border-neutral-700 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ صورة مع وصف</span>
                </button>
                <button
                  onClick={() => onAddComponent('file_attachment')}
                  className="px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-xl font-bold transition-colors min-h-[44px] flex items-center gap-1.5 border border-neutral-700 cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5 text-teal-400" />
                  <span>+ ملف مع وصف</span>
                </button>
                <button
                  onClick={() => onAddComponent('divider')}
                  className="px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-xl font-bold transition-colors min-h-[44px] flex items-center gap-1.5 border border-neutral-700 cursor-pointer"
                >
                  <Split className="w-3.5 h-3.5 text-sky-400" />
                  <span>+ فاصلة</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 flex-1">
              {activePage.components.map((component, index) => (
                <ComponentRenderer
                  key={component.id}
                  component={component}
                  isSelected={component.id === selectedComponentId}
                  isFirst={index === 0}
                  isLast={index === activePage.components.length - 1}
                  onSelect={() => {
                    onSelectComponent(component.id);
                  }}
                  onDelete={() => onDeleteComponent(component.id)}
                  onDuplicate={() => onDuplicateComponent(component.id)}
                  onMoveUp={() => onMoveUpComponent(index)}
                  onMoveDown={() => onMoveDownComponent(index)}
                  pages={project.pages}
                  onNavigatePage={onNavigatePage}
                />
              ))}

              {/* Bottom Quick-Add & Library Bar */}
              <div className="pt-6 mt-6 border-t border-dashed border-neutral-800/80 flex flex-col items-center gap-3">
                <button
                  onClick={onOpenComponentLibrary || (() => onAddComponent('button'))}
                  className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs sm:text-sm rounded-xl font-extrabold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>تصفح كافة المكونات (+)</span>
                </button>

                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <button
                    onClick={() => onAddComponent('divider')}
                    className="px-3 py-1.5 min-h-[36px] bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    + فاصلة
                  </button>
                  <button
                    onClick={() => onAddComponent('button')}
                    className="px-3 py-1.5 min-h-[36px] bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 text-xs rounded-lg font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    + زر
                  </button>
                  <button
                    onClick={() => onAddComponent('choices')}
                    className="px-3 py-1.5 min-h-[36px] bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    + اختيارات
                  </button>
                  <button
                    onClick={() => onAddComponent('file_attachment')}
                    className="px-3 py-1.5 min-h-[36px] bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    + ملف مع وصف
                  </button>
                  <button
                    onClick={() => onAddComponent('image_with_caption')}
                    className="px-3 py-1.5 min-h-[36px] bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    + صورة مع وصف
                  </button>
                </div>
              </div>

              {/* End of Project: Prominent Download Hub Card */}
              <div className="mt-10 p-5 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-emerald-500/30 text-center shadow-xl">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-white mb-1">
                  🎉 هل انتهيت من بناء وتنسيق موقعك؟
                </h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto mb-4 leading-relaxed">
                  يمكنك الآن تحميل ملفات الموقع بالكامل كملف ZIP جاهز للتشغيل والرفع فوراً، أو حفظ ملف المشروع لاستكماله لاحقاً.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto">
                  <button
                    onClick={onDownloadZip}
                    className="w-full sm:flex-1 py-3 px-4 min-h-[48px] bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل الموقع كاملاً (ZIP)</span>
                  </button>

                  <button
                    onClick={onDownloadProjectJson}
                    className="w-full sm:flex-1 py-3 px-4 min-h-[48px] bg-neutral-800 hover:bg-neutral-700 active:scale-98 text-neutral-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 border border-neutral-700 transition-all cursor-pointer"
                  >
                    <FileJson className="w-4 h-4 text-indigo-400" />
                    <span>حفظ ملف المشروع (.noklen)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Action Button (FAB) for Instant Component Addition */}
        <button
          onClick={onOpenComponentLibrary || (() => onAddComponent('button'))}
          className="fixed bottom-20 sm:bottom-8 left-6 z-30 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-indigo-600/50 flex items-center gap-2 font-extrabold text-sm transition-all border border-indigo-400/40 cursor-pointer"
          title="إضافة مكون جديد (+)"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">إضافة مكون (+)</span>
        </button>
      </div>
    </div>
  );
};
