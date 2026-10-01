import React from 'react';
import { 
  FolderGit2, 
  Layers, 
  Eye, 
  Download, 
  Upload, 
  Sparkles, 
  Flame,
  Globe,
  Menu,
  User
} from 'lucide-react';
import { ActiveTab, Project } from '../types/builder';

interface HeaderProps {
  project: Project;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenExportImport: () => void;
  onOpenTemplates: () => void;
  onDownloadZip: () => void;
  onOpenFirebaseHelper: () => void;
  onOpenPageManager?: () => void;
  onOpenMiniMenu: () => void;
  onOpenAboutDev?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  activeTab,
  setActiveTab,
  onOpenExportImport,
  onOpenTemplates,
  onDownloadZip,
  onOpenFirebaseHelper,
  onOpenPageManager,
  onOpenMiniMenu,
  onOpenAboutDev,
}) => {
  return (
    <header className="h-14 border-b border-neutral-800 bg-neutral-900/95 backdrop-blur-md px-2 sm:px-4 flex items-center justify-between z-30 select-none shrink-0">
      {/* Zone 1: Brand & Mini Menu Trigger */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenMiniMenu}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-indigo-500/40 text-neutral-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
          title="فتح القائمة الرئيسية (NoklenWeb V0.1.2)"
        >
          <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-sm shadow-indigo-500/20 shrink-0">
            NW
          </span>
          <div className="hidden sm:flex flex-col text-right leading-tight">
            <span className="text-xs font-black text-white">NoklenWeb</span>
            <span className="text-[9px] text-indigo-400 font-mono font-bold">V0.1.2</span>
          </div>
          <Menu className="w-4 h-4 text-indigo-400 mr-0.5 sm:mr-1" />
        </button>
      </div>

      {/* Zone 2: Navigation Links (Desktop only - Mobile uses bottom nav) */}
      <nav className="hidden lg:flex items-center gap-1 bg-neutral-950/80 p-1 rounded-lg border border-neutral-800">
        <button
          onClick={() => setActiveTab('builder')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
            activeTab === 'builder'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
          title="محرر الصفحات والمكونات المرئي"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>المحرر المرئي</span>
        </button>

        {onOpenPageManager && (
          <button
            onClick={onOpenPageManager}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 transition-all cursor-pointer"
            title="محرر الصفحات (تعديل، استنساخ، حذف)"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            <span>محرر الصفحات</span>
            <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.2 rounded font-mono font-bold">
              {project.pages.length}
            </span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('files')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
            activeTab === 'files'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
          title="ملفات الموقع وكود Firebase"
        >
          <FolderGit2 className="w-3.5 h-3.5 text-amber-400" />
          <span>ملفات الموقع</span>
          <span className="text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.2 rounded font-mono">
            {project.files.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
            activeTab === 'preview'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
          title="معاينة حية تفاعلية للموقع"
        >
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span>المعاينة الحية</span>
        </button>
      </nav>

      {/* Zone 3: Actions - Mobile & Desktop */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {onOpenAboutDev && (
          <button
            onClick={onOpenAboutDev}
            className="flex items-center gap-1 px-2.5 py-1.5 min-h-[40px] text-xs font-medium text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 rounded-xl transition-colors cursor-pointer"
            title="معلومات عن المبرمج (Catdev)"
          >
            <User className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">عن المبرمج</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('preview')}
          className="flex lg:hidden items-center gap-1 px-2.5 py-1.5 min-h-[40px] text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-colors cursor-pointer"
          title="معاينة حية سريعة"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden xs:inline">معاينة</span>
        </button>

        <button
          onClick={onOpenTemplates}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 min-h-[40px] text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 rounded-xl transition-colors cursor-pointer"
          title="اختيار قالب جاهز"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden md:inline">القوالب</span>
        </button>

        <button
          onClick={onOpenExportImport}
          className="flex items-center gap-1.5 px-2.5 py-1.5 min-h-[40px] text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 rounded-xl transition-colors cursor-pointer"
          title="تصدير واستيراد مشروع NoklenWeb"
        >
          <Upload className="w-3.5 h-3.5 rotate-180" />
          <span className="hidden md:inline">حفظ / استيراد</span>
        </button>

        {/* Big Prominent Download ZIP Button */}
        <button
          onClick={onDownloadZip}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 min-h-[40px] text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 rounded-xl shadow-md shadow-emerald-600/20 transition-all whitespace-nowrap cursor-pointer"
          title="تحميل ملفات الموقع كاملة كملف ZIP"
        >
          <Download className="w-4 h-4" />
          <span className="hidden xs:inline">تحميل ZIP</span>
        </button>
      </div>
    </header>
  );
};
