import React from 'react';
import { 
  X, 
  FolderGit2, 
  PlusCircle, 
  User, 
  Sparkles, 
  Download, 
  Upload, 
  Layers, 
  ChevronLeft,
  ExternalLink,
  Code2,
  Gamepad2,
  Globe,
  Info
} from 'lucide-react';
import { Project } from '../types/builder';

interface MiniMenuModalProps {
  project: Project;
  onClose: () => void;
  onOpenProjects: () => void;
  onStartNewProject: () => void;
  onOpenAboutDev: () => void;
  onOpenTemplates?: () => void;
  onOpenExportImport?: () => void;
  onDownloadZip?: () => void;
}

export const MiniMenuModal: React.FC<MiniMenuModalProps> = ({
  project,
  onClose,
  onOpenProjects,
  onStartNewProject,
  onOpenAboutDev,
  onOpenTemplates,
  onOpenExportImport,
  onDownloadZip,
}) => {
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150 pt-16 sm:pt-4"
      onClick={onClose}
    >
      <div 
        className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md overflow-hidden text-right shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: NoklenWeb Builder & V0.1.2 */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-indigo-950/70 via-neutral-900 to-purple-950/50 border-b border-neutral-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors cursor-pointer"
            title="إغلاق القائمة"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-indigo-600/30 shrink-0 border border-indigo-400/30">
              NW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">
                  NoklenWeb Builder
                </h3>
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-mono font-extrabold">
                  V0.1.2
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                محرر وبناء المواقع الإلكترونية السريع
              </p>
            </div>
          </div>
        </div>

        {/* The 3 Core Primary Buttons requested */}
        <div className="p-4 sm:p-5 space-y-2.5">
          {/* Button 1: تصفح مشاريعك */}
          <button
            onClick={() => {
              onClose();
              onOpenProjects();
            }}
            className="w-full p-4 rounded-2xl bg-neutral-950 hover:bg-neutral-800/90 active:bg-neutral-800 border border-neutral-800 hover:border-indigo-500/50 transition-all flex items-center justify-between group cursor-pointer active:scale-[0.98] shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div className="text-right">
                <h4 className="text-sm font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                  تصفح مشاريعك
                </h4>
                <p className="text-xs text-neutral-400">
                  عرض وإدارة كافة المشاريع المحفوظة والتبديل بينها
                </p>
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
          </button>

          {/* Button 2: ابدأ مشروع جديد */}
          <button
            onClick={() => {
              onClose();
              onStartNewProject();
            }}
            className="w-full p-4 rounded-2xl bg-neutral-950 hover:bg-neutral-800/90 active:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group cursor-pointer active:scale-[0.98] shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div className="text-right">
                <h4 className="text-sm font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                  ابدأ مشروع جديد
                </h4>
                <p className="text-xs text-neutral-400">
                  إنشاء موقع جديد فارغ أو البدء من قالب جاهز
                </p>
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
          </button>

          {/* Button 3: معلومات عني */}
          <button
            onClick={() => {
              onClose();
              onOpenAboutDev();
            }}
            className="w-full p-4 rounded-2xl bg-neutral-950 hover:bg-neutral-800/90 active:bg-neutral-800 border border-neutral-800 hover:border-purple-500/50 transition-all flex items-center justify-between group cursor-pointer active:scale-[0.98] shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-extrabold text-white group-hover:text-purple-300 transition-colors">
                    معلومات عني
                  </h4>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.2 rounded-full font-bold">
                    Catdev
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  المطور إبراهيم • مطور ألعاب ومواقع ووردبريس
                </p>
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Quick Additional Tools */}
        <div className="px-5 pb-5">
          <div className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 flex items-center justify-between gap-2">
            {onOpenTemplates && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTemplates();
                }}
                className="flex-1 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>القوالب</span>
              </button>
            )}

            {onOpenExportImport && (
              <button
                onClick={() => {
                  onClose();
                  onOpenExportImport();
                }}
                className="flex-1 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400 rotate-180" />
                <span>تصدير / استيراد</span>
              </button>
            )}

            {onDownloadZip && (
              <button
                onClick={() => {
                  onClose();
                  onDownloadZip();
                }}
                className="flex-1 py-2 text-xs font-bold text-emerald-400 hover:text-white hover:bg-emerald-600 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل ZIP</span>
              </button>
            )}
          </div>
        </div>

        {/* Mini Menu Footer */}
        <div className="p-3.5 bg-neutral-950 border-t border-neutral-800 text-center text-xs text-neutral-500">
          <span>NoklenWeb Builder • إصدار V0.1.2 • صُنع بواسطة Catdev</span>
        </div>
      </div>
    </div>
  );
};
