import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  FileJson, 
  FileArchive, 
  Code, 
  Check, 
  AlertCircle,
  FileText 
} from 'lucide-react';
import { Project } from '../types/builder';
import { exportProjectJson, exportProjectZip, importProjectFile } from '../utils/exportImport';
import { generateFullWebsiteHtml } from '../utils/codeGenerator';

interface ExportImportModalProps {
  project: Project;
  onImportProject: (imported: Project) => void;
  onClose: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  project,
  onImportProject,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'code'>('export');
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadNoklen = () => {
    exportProjectJson(project);
  };

  const handleDownloadZip = async () => {
    try {
      setIsExportingZip(true);
      await exportProjectZip(project);
    } catch (err: any) {
      alert('خطأ أثناء إنشاء ملف ZIP: ' + err.message);
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportError(null);
      const imported = await importProjectFile(file);
      onImportProject(imported);
      onClose();
    } catch (err: any) {
      setImportError(err.message || 'فشل استيراد الملف');
    }
  };

  const handleCopyHtml = () => {
    const fullHtml = generateFullWebsiteHtml(project);
    navigator.clipboard.writeText(fullHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col text-right">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">إدارة، استيراد وتصدير المشروع</h3>
              <p className="text-[11px] text-neutral-400">
                احفظ مشروعك على جهازك واستورده في أي وقت لمتابعة تطوير موقعك بكل سهولة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/60 p-1.5 gap-1">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'export'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>تحميل وتصدير</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'import'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>استيراد مشروع سابق</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-amber-400" />
            <span>كود HTML المباشر</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'export' && (
            <div className="space-y-3">
              {/* Option 1: Noklen Project File */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-indigo-500/40 transition-colors flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                    <FileJson className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs mb-0.5">
                      ملف المشروع الكامل (صيغة .noklen)
                    </h4>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      يحفظ كافة الصفحات، المكونات، الملفات، وتكاملات Firebase. يمكنك استيراده لاحقاً
                      في الموقع لمتابعة تطوير موقعك بالضبط من حيث توقفت.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadNoklen}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold rounded-lg text-xs shrink-0 flex items-center gap-1.5 shadow-sm shadow-indigo-600/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل .noklen</span>
                </button>
              </div>

              {/* Option 2: Full ZIP Package */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/40 transition-colors flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                    <FileArchive className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs mb-0.5">
                      حزمة الموقع الكاملة كملف مضغوط (ZIP)
                    </h4>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      تضم ملفات <code>index.html</code> و <code>styles.css</code> و{' '}
                      <code>app.js</code> و <code>firebase-config.js</code> جاهزة للرفع على أي
                      استضافة أو سيرفر.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadZip}
                  disabled={isExportingZip}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-bold rounded-lg text-xs shrink-0 flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExportingZip ? 'جاري الضغط...' : 'تحميل ZIP'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 border-2 border-dashed border-neutral-700 hover:border-indigo-500/80 rounded-2xl bg-neutral-950/70 hover:bg-neutral-950 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 group"
              >
                <div className="p-3 rounded-full bg-neutral-900 border border-neutral-800 group-hover:scale-110 transition-transform text-indigo-400">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-sm">
                  انقر هنا لاختيار ملف المشروع من جهازك
                </h4>
                <p className="text-[11px] text-neutral-400 max-w-xs leading-relaxed">
                  يدعم ملفات <code>.noklen</code> و <code>.json</code> المحفوظة مسبقاً.
                </p>
                <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-400 px-2.5 py-0.5 rounded-full mt-2">
                  تصفح الملفات
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".noklen,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {importError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{importError}</span>
                </div>
              )}

              <p className="text-[11px] text-neutral-400 leading-relaxed text-center">
                عند استيراد الملف، سيتم استرجاع جميع صفحات ومكونات وملفات مشروعك بالكامل لتواصل
                العمل عليه كما كان!
              </p>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-xs">كود HTML المولد لموقعك:</span>
                <button
                  onClick={handleCopyHtml}
                  className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs flex items-center gap-1 font-semibold transition-colors"
                >
                  {copiedHtml ? <Check className="w-3 h-3 text-emerald-400" /> : <Code className="w-3 h-3" />}
                  <span>{copiedHtml ? 'تم النسخ بنجاح' : 'نسخ الكود'}</span>
                </button>
              </div>

              <textarea
                readOnly
                value={generateFullWebsiteHtml(project)}
                rows={10}
                dir="ltr"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 font-mono text-[11px] text-neutral-300 focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
