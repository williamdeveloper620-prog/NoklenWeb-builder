import React, { useState } from 'react';
import { 
  FolderGit2, 
  FileCode, 
  FilePlus, 
  Save, 
  Copy, 
  Check, 
  Trash2, 
  Flame, 
  Download, 
  RefreshCw, 
  Info, 
  Code2, 
  Layers,
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import { VirtualFile, Project } from '../types/builder';
import { generateFullWebsiteHtml } from '../utils/codeGenerator';

interface FilesExplorerProps {
  project: Project;
  files: VirtualFile[];
  onUpdateFile: (fileId: string, newContent: string) => void;
  onCreateFile: (name: string, content?: string) => void;
  onDeleteFile: (fileId: string) => void;
  onSyncGeneratedHtml: () => void;
  initialSelectedFile?: string;
}

export const FilesExplorer: React.FC<FilesExplorerProps> = ({
  project,
  files,
  onUpdateFile,
  onCreateFile,
  onDeleteFile,
  onSyncGeneratedHtml,
  initialSelectedFile,
}) => {
  const [selectedFileId, setSelectedFileId] = useState<string>(
    initialSelectedFile || files[0]?.id || ''
  );
  const [codeContent, setCodeContent] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  
  // New file creation state
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  // Firebase wizard state
  const [showFirebaseWizard, setShowFirebaseWizard] = useState(false);
  const [fbApiKey, setFbApiKey] = useState('AIzaSy_YOUR_API_KEY');
  const [fbAuthDomain, setFbAuthDomain] = useState('my-noklen-site.firebaseapp.com');
  const [fbProjectId, setFbProjectId] = useState('my-noklen-site');
  const [fbStorageBucket, setFbStorageBucket] = useState('my-noklen-site.appspot.com');
  const [fbSenderId, setFbSenderId] = useState('1029384756');
  const [fbAppId, setFbAppId] = useState('1:1029384756:web:89a7bcd65');

  // Delete file confirmation state
  const [fileToDelete, setFileToDelete] = useState<VirtualFile | null>(null);

  // Active file
  const activeFile = files.find((f) => f.id === selectedFileId) || files[0];

  // Sync editor content when switching files
  React.useEffect(() => {
    if (activeFile) {
      setCodeContent(activeFile.content);
    }
  }, [activeFile?.id]);

  const handleSave = () => {
    if (!activeFile) return;
    onUpdateFile(activeFile.id, codeContent);
    setSaveStatus('تم الحفظ بنجاح ✓');
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateNewFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    let cleanName = newFileName.trim();
    if (!cleanName.includes('.')) {
      cleanName += '.js';
    }

    onCreateFile(cleanName, `// ملف جديد: ${cleanName}\nconsole.log("Loaded: ${cleanName}");\n`);
    setNewFileName('');
    setIsCreatingFile(false);
  };

  const handleApplyFirebaseConfig = () => {
    const generatedConfig = `// ========================================================
// NoklenWeb Builder - Firebase Configuration
// تم التوليد تلقائياً عبر المعالج السريع
// ========================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

export const firebaseConfig = {
  apiKey: "${fbApiKey}",
  authDomain: "${fbAuthDomain}",
  projectId: "${fbProjectId}",
  storageBucket: "${fbStorageBucket}",
  messagingSenderId: "${fbSenderId}",
  appId: "${fbAppId}"
};

// تهيئة تطبيق وقاعدة بيانات ومصادقة Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("🔥 تم ربط Firebase بنجاح بمشروعك (${fbProjectId})!");

// حفظ رسالة أو سجل جديد في Firestore
export async function saveDocument(collectionName, data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp()
    });
    console.log("تم الحفظ بالمعرف:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("خطأ أثناء الحفظ:", error);
    return { success: false, error: error.message };
  }
}

// قراءة المستندات من Firestore
export async function fetchCollection(collectionName) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: results };
  } catch (error) {
    console.error("خطأ أثناء القراءة:", error);
    return { success: false, error: error.message };
  }
}
`;

    // Find firebase-config.js file
    const fbFile = files.find((f) => f.name === 'firebase-config.js');
    if (fbFile) {
      onUpdateFile(fbFile.id, generatedConfig);
      setSelectedFileId(fbFile.id);
      setCodeContent(generatedConfig);
    } else {
      onCreateFile('firebase-config.js', generatedConfig);
    }

    setShowFirebaseWizard(false);
    setSaveStatus('تم تحديث إعدادات Firebase وحفظها في firebase-config.js بنجاح ✓');
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const handleDownloadSingleFile = () => {
    if (!activeFile) return;
    const blob = new Blob([codeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const [mobileView, setMobileView] = useState<'list' | 'editor'>('list');

  // Line numbers calculation
  const lineCount = (codeContent || '').split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col lg:flex-row h-full bg-neutral-950 text-neutral-200 select-none overflow-hidden pb-16 lg:pb-0">
      {/* Sidebar: Files List & Firebase Quick Trigger */}
      <div className={`w-full lg:w-64 border-l border-neutral-800 bg-neutral-900/90 flex flex-col shrink-0 ${
        mobileView === 'editor' ? 'hidden lg:flex' : 'flex flex-1 lg:flex-initial'
      }`}>
        <div className="p-3 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-white">ملفات الموقع</span>
          </div>

          <button
            onClick={() => setIsCreatingFile(true)}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-indigo-400 transition-colors flex items-center gap-1 text-xs min-h-[36px]"
            title="إضافة ملف برمجي جديد"
          >
            <FilePlus className="w-4 h-4" />
            <span>ملف جديد</span>
          </button>
        </div>

        {/* Quick Firebase Banner Button */}
        <div className="p-2.5 border-b border-neutral-800 bg-amber-500/5">
          <button
            onClick={() => setShowFirebaseWizard(true)}
            className="w-full text-right p-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition-all flex items-center justify-between text-xs font-semibold group cursor-pointer min-h-[44px]"
          >
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>مساعد تكامل Firebase</span>
            </div>
            <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded font-mono">
              تكوين
            </span>
          </button>
        </div>

        {/* New File Modal / Form */}
        {isCreatingFile && (
          <form
            onSubmit={handleCreateNewFileSubmit}
            className="p-3 border-b border-neutral-800 bg-neutral-950 flex flex-col gap-2"
          >
            <span className="text-xs text-neutral-400 font-semibold">اسم الملف الجديد:</span>
            <input
              type="text"
              placeholder="مثال: custom.js أو database.json"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 min-h-[40px]"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold min-h-[40px]"
              >
                إنشاء الملف
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingFile(false)}
                className="px-3 py-1.5 bg-neutral-800 text-neutral-400 rounded text-xs min-h-[40px]"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}

        {/* Files Tree */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {files.map((file) => {
            const isSelected = file.id === activeFile?.id;
            const isFirebase = file.name.includes('firebase');
            const isHtml = file.name.endsWith('.html');
            const isCss = file.name.endsWith('.css');
            const isJs = file.name.endsWith('.js');

            return (
              <div
                key={file.id}
                onClick={() => {
                  setSelectedFileId(file.id);
                  setMobileView('editor');
                }}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-colors min-h-[48px] ${
                  isSelected
                    ? 'bg-indigo-600/20 text-white border border-indigo-500/40 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 bg-neutral-950/40'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {isFirebase ? (
                    <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <FileCode
                      className={`w-4 h-4 shrink-0 ${
                        isHtml
                          ? 'text-orange-400'
                          : isCss
                          ? 'text-sky-400'
                          : isJs
                          ? 'text-yellow-400'
                          : 'text-neutral-500'
                      }`}
                    />
                  )}
                  <span className="truncate font-mono-code text-xs">{file.name}</span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="lg:hidden text-[10px] text-indigo-400 font-bold">
                    فتح ←
                  </span>
                  {!file.isSystem && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFileToDelete(file);
                      }}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 rounded transition-opacity cursor-pointer"
                      title="حذف الملف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Delete File Confirmation Modal */}
        {fileToDelete && (
          <div 
            className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm p-5 text-right space-y-3.5 shadow-2xl">
              <div className="flex items-center gap-2 text-rose-400">
                <Trash2 className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">تأكيد حذف الملف</h3>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                هل أنت متأكد من رغبتك في حذف ملف <strong className="text-white font-mono">{fileToDelete.name}</strong>؟
              </p>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setFileToDelete(null)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteFile(fileToDelete.id);
                    setFileToDelete(null);
                  }}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 cursor-pointer"
                >
                  نعم، حذف الملف
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sync HTML Notice */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950/60 text-xs text-neutral-400">
          <p className="mb-2 leading-relaxed text-[11px]">
            💡 يمكنك كتابة أي كود أو دمج مكتبات Firebase مباشرة هنا.
          </p>
          <button
            onClick={onSyncGeneratedHtml}
            className="w-full py-2 px-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[40px]"
            title="تحديث كود HTML من تصميم الصفحات الحالي"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>تحديث HTML من المحرر</span>
          </button>
        </div>
      </div>

      {/* Main Area: Code Editor & Actions */}
      <div className={`flex-1 flex flex-col min-w-0 ${
        mobileView === 'list' ? 'hidden lg:flex' : 'flex'
      }`}>
        {/* Editor Top Bar */}
        <div className="h-12 border-b border-neutral-800 bg-neutral-900/60 px-3 sm:px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {/* Back button on mobile */}
            <button
              onClick={() => setMobileView('list')}
              className="lg:hidden px-2 py-1 bg-neutral-800 text-neutral-300 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1"
            >
              ← الملفات
            </button>
            <span className="text-xs font-bold text-white font-mono-code flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-indigo-400" />
              {activeFile?.name || 'ملف'}
            </span>
            {saveStatus && (
              <span className="text-xs text-emerald-400 font-medium px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                {saveStatus}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors flex items-center gap-1 text-xs min-h-[38px]"
              title="نسخ محتوى الملف بالكامل"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'تم النسخ' : 'نسخ الكود'}</span>
            </button>

            <button
              onClick={handleSave}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all flex items-center gap-1.5 text-xs shadow-sm shadow-indigo-600/30 cursor-pointer active:scale-95 min-h-[38px]"
              title="حفظ التعديلات في ملفات الموقع"
            >
              <Save className="w-4 h-4" />
              <span>حفظ</span>
            </button>
          </div>
        </div>

        {/* Editor Body with Line Numbers */}
        <div className="flex-1 flex overflow-hidden bg-neutral-950 font-mono-code text-xs">
          {/* Line Numbers Column */}
          <div className="w-12 py-3 bg-neutral-950/90 text-neutral-600 text-right pr-2 pl-1 select-none border-l border-neutral-900 shrink-0 overflow-hidden leading-5">
            {lineNumbers.map((num) => (
              <div key={num} className="h-5">
                {num}
              </div>
            ))}
          </div>

          {/* Textarea Code Editor */}
          <div className="flex-1 relative overflow-auto">
            <textarea
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              onKeyDown={(e) => {
                // Support tab indentation
                if (e.key === 'Tab') {
                  e.preventDefault();
                  const start = e.currentTarget.selectionStart;
                  const end = e.currentTarget.selectionEnd;
                  const newCode = codeContent.substring(0, start) + '  ' + codeContent.substring(end);
                  setCodeContent(newCode);
                  setTimeout(() => {
                    e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
                  }, 0);
                }
              }}
              spellCheck={false}
              dir="ltr"
              className="w-full h-full p-3 bg-transparent text-neutral-200 resize-none focus:outline-none leading-5 font-mono-code text-[12px] whitespace-pre"
            />
          </div>
        </div>
      </div>

      {/* Firebase Wizard Modal */}
      {showFirebaseWizard && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">مساعد إعداد وتكامل Firebase</h3>
                  <p className="text-[11px] text-neutral-400">
                    أدخل بيانات مشروعك لتوليد كود التوصيل التلقائي مع Firestore وAuth
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFirebaseWizard(false)}
                className="text-neutral-400 hover:text-white text-sm p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-right">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-neutral-300 space-y-1">
                <span className="font-bold text-amber-300 block">كيف تحصل على هذه البيانات؟</span>
                <p className="text-[11px] leading-relaxed text-neutral-300">
                  1. ادخل على لوحة تحكم Firebase:{' '}
                  <a
                    href="https://console.firebase.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 underline"
                  >
                    console.firebase.google.com
                  </a>
                  <br />
                  2. أنشئ مشروعاً جديداً أو اختر مشروعك الحالي.
                  <br />
                  3. أضف تطبيق Web واحصل على كائن <code>firebaseConfig</code> والصقه هنا.
                </p>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">API Key</label>
                <input
                  type="text"
                  value={fbApiKey}
                  onChange={(e) => setFbApiKey(e.target.value)}
                  dir="ltr"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 font-mono text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Project ID</label>
                  <input
                    type="text"
                    value={fbProjectId}
                    onChange={(e) => setFbProjectId(e.target.value)}
                    dir="ltr"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 font-mono text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Auth Domain</label>
                  <input
                    type="text"
                    value={fbAuthDomain}
                    onChange={(e) => setFbAuthDomain(e.target.value)}
                    dir="ltr"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 font-mono text-neutral-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Storage Bucket</label>
                  <input
                    type="text"
                    value={fbStorageBucket}
                    onChange={(e) => setFbStorageBucket(e.target.value)}
                    dir="ltr"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 font-mono text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">App ID</label>
                  <input
                    type="text"
                    value={fbAppId}
                    onChange={(e) => setFbAppId(e.target.value)}
                    dir="ltr"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 font-mono text-neutral-100"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-neutral-800 bg-neutral-950 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowFirebaseWizard(false)}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-medium"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleApplyFirebaseConfig}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-md shadow-amber-500/20"
              >
                تطبيق وحفظ في firebase-config.js ⚡
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
