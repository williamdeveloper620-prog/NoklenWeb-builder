import React, { useState, useEffect } from 'react';
import { 
  X, 
  FolderGit2, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Edit3, 
  Download, 
  Upload, 
  Sparkles, 
  Calendar, 
  Layers, 
  FileText,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Project } from '../types/builder';
import { defaultProject } from '../data/defaultProject';

interface SavedProjectItem {
  id: string;
  name: string;
  updatedAt: number;
  pagesCount: number;
  componentsCount: number;
  projectData: Project;
}

interface ProjectsManagerModalProps {
  currentProject: Project;
  onClose: () => void;
  onLoadProject: (project: Project) => void;
  onStartNewProject: () => void;
  onOpenExportImport: () => void;
}

const SAVED_PROJECTS_STORAGE_KEY = 'noklen_user_projects_vault_v1';

export const ProjectsManagerModal: React.FC<ProjectsManagerModalProps> = ({
  currentProject,
  onClose,
  onLoadProject,
  onStartNewProject,
  onOpenExportImport,
}) => {
  const [savedProjects, setSavedProjects] = useState<SavedProjectItem[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_PROJECTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading saved projects:', e);
    }
    // Default initial project snapshot
    return [
      {
        id: currentProject.id || 'proj_default',
        name: currentProject.name || 'موقعي الأول',
        updatedAt: currentProject.updatedAt || Date.now(),
        pagesCount: currentProject.pages.length,
        componentsCount: currentProject.pages.reduce((acc, p) => acc + p.components.length, 0),
        projectData: currentProject,
      },
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<SavedProjectItem | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Sync to localStorage
  const persistProjects = (projects: SavedProjectItem[]) => {
    setSavedProjects(projects);
    try {
      localStorage.setItem(SAVED_PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to persist projects:', e);
    }
  };

  // Save current project as a new snapshot / update existing
  const handleSaveCurrentProjectSnapshot = () => {
    const existingIndex = savedProjects.findIndex((p) => p.id === currentProject.id);
    const item: SavedProjectItem = {
      id: currentProject.id || 'proj_' + Date.now(),
      name: currentProject.name || 'مشروع بدون عنوان',
      updatedAt: Date.now(),
      pagesCount: currentProject.pages.length,
      componentsCount: currentProject.pages.reduce((acc, p) => acc + p.components.length, 0),
      projectData: currentProject,
    };

    let updated: SavedProjectItem[];
    if (existingIndex >= 0) {
      updated = [...savedProjects];
      updated[existingIndex] = item;
    } else {
      updated = [item, ...savedProjects];
    }

    persistProjects(updated);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2500);
  };

  const handleDeleteProject = (id: string) => {
    const filtered = savedProjects.filter((p) => p.id !== id);
    persistProjects(filtered);
    setProjectToDelete(null);
  };

  const handleDuplicateProject = (proj: SavedProjectItem) => {
    const duplicatedData: Project = {
      ...proj.projectData,
      id: 'proj_' + Date.now(),
      name: proj.name + ' (نسخة)',
      updatedAt: Date.now(),
    };

    const newSavedItem: SavedProjectItem = {
      id: duplicatedData.id,
      name: duplicatedData.name,
      updatedAt: Date.now(),
      pagesCount: duplicatedData.pages.length,
      componentsCount: duplicatedData.pages.reduce((acc, p) => acc + p.components.length, 0),
      projectData: duplicatedData,
    };

    persistProjects([newSavedItem, ...savedProjects]);
  };

  const filteredProjects = savedProjects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-right shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>تصفح وإدارة مشاريعك</span>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono font-bold">
                  {savedProjects.length} مشاريع
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                تنقل بسهولة بين مشاريعك المحفوظة، احفظ نسخاً احتياطية، أو ابدأ مشروعاً جديداً
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-neutral-950/90 border-b border-neutral-800 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onStartNewProject();
                onClose();
              }}
              className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>مشروع جديد (+)</span>
            </button>

            <button
              onClick={handleSaveCurrentProjectSnapshot}
              className="flex-1 sm:flex-none px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-neutral-700 transition-all cursor-pointer"
              title="حفظ المشروع الحالي كنسخة في قائمة المشاريع"
            >
              {saveSuccessNotice ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">تم حفظ النسخة!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-indigo-400" />
                  <span>حفظ المشروع الحالي</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="ابحث في مشاريعك..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 sm:w-48 bg-neutral-900 border border-neutral-700 focus:border-indigo-500 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Projects Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredProjects.map((proj) => {
            const isCurrentlyOpen = proj.id === currentProject.id;

            return (
              <div
                key={proj.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                  isCurrentlyOpen
                    ? 'bg-indigo-950/25 border-indigo-500/50 shadow-md shadow-indigo-950/30'
                    : 'bg-neutral-950/70 hover:bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isCurrentlyOpen
                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                        : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                    }`}>
                      <Layers className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="text-sm font-bold text-white truncate">
                          {proj.name}
                        </h4>
                        {isCurrentlyOpen && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                            المشروع المفتوح حالياً ●
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono flex-wrap">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3 text-indigo-400" />
                          <span>{proj.pagesCount} صفحات</span>
                        </span>
                        <span>•</span>
                        <span>{proj.componentsCount} مكونات</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-neutral-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(proj.updatedAt).toLocaleDateString('ar')}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {!isCurrentlyOpen && (
                      <button
                        onClick={() => {
                          onLoadProject(proj.projectData);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer active:scale-95"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>فتح المشروع</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDuplicateProject(proj)}
                      className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-emerald-400 border border-neutral-800 transition-colors"
                      title="استنساخ المشروع"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {savedProjects.length > 1 && (
                      <button
                        onClick={() => setProjectToDelete(proj)}
                        className="p-2 rounded-xl bg-neutral-900 hover:bg-rose-950/60 text-neutral-400 hover:text-rose-400 border border-neutral-800 transition-colors"
                        title="حذف المشروع"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredProjects.length === 0 && (
            <div className="py-12 text-center text-neutral-500">
              <FolderGit2 className="w-10 h-10 mx-auto mb-2 opacity-30 text-indigo-400" />
              <p className="text-xs">لا توجد مشاريع مطابقة لبحثك</p>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {projectToDelete && (
          <div 
            className="fixed inset-0 z-70 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 select-none"
            onClick={() => setProjectToDelete(null)}
          >
            <div 
              className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm p-5 text-right space-y-3.5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 text-rose-400">
                <Trash2 className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">تأكيد حذف المشروع</h3>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                هل أنت متأكد من رغبتك في حذف مشروع <strong className="text-white font-bold">"{projectToDelete.name}"</strong> من قائمة المشاريع المحفوظة؟
              </p>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setProjectToDelete(null)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteProject(projectToDelete.id)}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 cursor-pointer"
                >
                  نعم، حذف المشروع
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500 shrink-0">
          <span>💡 يمكنك تصدير ملفات أي مشروع بصيغة .noklen أو تنزيل كود ZIP الكامل</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs cursor-pointer font-semibold"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
