import React from 'react';
import { 
  Layers, 
  PlusCircle, 
  FileText, 
  Download, 
  FolderGit2, 
  Eye, 
  Sliders
} from 'lucide-react';

export type MobileTab = 'canvas' | 'add' | 'inspector' | 'pages' | 'files' | 'download';

interface MobileBottomNavProps {
  currentTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  hasSelectedComponent: boolean;
  pageCount: number;
  onOpenPreview: () => void;
  onDirectDownloadZip: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  hasSelectedComponent,
  pageCount,
  onOpenPreview,
  onDirectDownloadZip,
}) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 pb-safe select-none">
      <div className="grid grid-cols-5 items-center h-16 px-1">
        {/* Tab 1: Canvas (المحرر) */}
        <button
          onClick={() => onSelectTab('canvas')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentTab === 'canvas' ? 'text-indigo-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Layers className="w-5 h-5 mb-1" />
          <span className="text-[10px] tracking-tight">المحرر</span>
        </button>

        {/* Tab 2: Add Component (+ إضافة) */}
        <button
          onClick={() => onSelectTab('add')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative ${
            currentTab === 'add' ? 'text-indigo-400 font-bold' : 'text-neutral-300 hover:text-white'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 -mt-2 mb-0.5">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">إضافة</span>
        </button>

        {/* Tab 3: Pages (الصفحات) */}
        <button
          onClick={() => onSelectTab('pages')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative ${
            currentTab === 'pages' ? 'text-indigo-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <div className="relative">
            <FileText className="w-5 h-5 mb-1" />
            <span className="absolute -top-1 -right-2 text-[9px] bg-indigo-500 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {pageCount}
            </span>
          </div>
          <span className="text-[10px] tracking-tight">الصفحات</span>
        </button>

        {/* Tab 4: Files & Firebase (الملفات) */}
        <button
          onClick={() => onSelectTab('files')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentTab === 'files' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <FolderGit2 className="w-5 h-5 mb-1" />
          <span className="text-[10px] tracking-tight">الملفات</span>
        </button>

        {/* Tab 5: Download Hub (تحميل الموقع) */}
        <button
          onClick={onDirectDownloadZip}
          className="flex flex-col items-center justify-center h-full min-h-[44px] text-emerald-400 hover:text-emerald-300 transition-colors"
          title="تحميل ملفات المشروع ZIP"
        >
          <div className="relative">
            <Download className="w-5 h-5 mb-1" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-0 right-0 animate-ping" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">تحميل ZIP</span>
        </button>
      </div>
    </nav>
  );
};
