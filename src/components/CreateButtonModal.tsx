import React, { useState } from 'react';
import { 
  X, 
  MousePointerClick, 
  Download, 
  ExternalLink, 
  FileText, 
  Bell, 
  Copy, 
  Target, 
  Eye, 
  Flame, 
  Code2,
  Sparkles
} from 'lucide-react';
import { ButtonActionType, Page } from '../types/builder';

interface CreateButtonModalProps {
  pages: Page[];
  activePageId: string;
  existingButtonIds: string[];
  onClose: () => void;
  onCreateButton: (buttonData: {
    buttonId: string;
    text: string;
    actionType: ButtonActionType;
    targetPageId?: string;
    url?: string;
    openInNewTab?: boolean;
    downloadFileName?: string;
    downloadFileUrl?: string;
    alertText?: string;
    copyText?: string;
    targetElementId?: string;
    firebaseCollection?: string;
    customScript?: string;
    variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
    size: 'sm' | 'md' | 'lg';
    align: 'start' | 'center' | 'end' | 'full';
  }) => void;
}

export const CreateButtonModal: React.FC<CreateButtonModalProps> = ({
  pages,
  activePageId,
  existingButtonIds,
  onClose,
  onCreateButton,
}) => {
  // Suggest a unique ID
  const nextNum = existingButtonIds.length + 1;
  const [text, setText] = useState('انقر هنا للمتابعة');
  const [buttonId, setButtonId] = useState(`btn_${nextNum}`);
  const [actionType, setActionType] = useState<ButtonActionType>('download_file');
  const [variant, setVariant] = useState<'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'>('primary');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [align, setAlign] = useState<'start' | 'center' | 'end' | 'full'>('center');

  // Action specific fields
  const [targetPageId, setTargetPageId] = useState(
    pages.find((p) => p.id !== activePageId)?.id || pages[0]?.id || ''
  );
  const [url, setUrl] = useState('https://example.com');
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [downloadFileName, setDownloadFileName] = useState('ملف_البرنامج_2026.zip');
  const [downloadFileUrl, setDownloadFileUrl] = useState('');
  const [alertText, setAlertText] = useState('أهلاً بك! تم النقر على الزر بنجاح 🚀');
  const [copyText, setCopyText] = useState('NOKLEN-2026-VIP');
  const [targetElementId, setTargetElementId] = useState('sec_details');
  const [firebaseCollection, setFirebaseCollection] = useState('messages');
  const [customScript, setCustomScript] = useState("alert('تم تشغيل الكود بنجاح!');");

  // When text changes, offer a smart ID suggestion if user hasn't heavily customized it
  const handleTextChange = (newText: string) => {
    setText(newText);
    const words = newText.trim().toLowerCase();
    if (words.includes('تحميل') || words.includes('تنزيل') || words.includes('download')) {
      if (buttonId.startsWith('btn_') && !buttonId.includes('download')) {
        setButtonId(`btn_download_${nextNum}`);
      }
    } else if (words.includes('رابط') || words.includes('موقع') || words.includes('link')) {
      if (buttonId.startsWith('btn_') && !buttonId.includes('link')) {
        setButtonId(`btn_link_${nextNum}`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const cleanId = (buttonId.trim() || `btn_${Date.now()}`).replace(/\s+/g, '_');

    onCreateButton({
      buttonId: cleanId,
      text: text.trim(),
      actionType,
      targetPageId: actionType === 'navigate_page' ? targetPageId : undefined,
      url: actionType === 'open_url' ? url.trim() : undefined,
      openInNewTab: actionType === 'open_url' ? openInNewTab : undefined,
      downloadFileName: actionType === 'download_file' ? downloadFileName.trim() : undefined,
      downloadFileUrl: actionType === 'download_file' ? downloadFileUrl.trim() : undefined,
      alertText: actionType === 'alert_message' ? alertText.trim() : undefined,
      copyText: actionType === 'copy_text' ? copyText.trim() : undefined,
      targetElementId: ['scroll_to', 'toggle_element'].includes(actionType) ? targetElementId.trim() : undefined,
      firebaseCollection: actionType === 'firebase_submit' ? firebaseCollection.trim() : undefined,
      customScript: actionType === 'custom_js' ? customScript.trim() : undefined,
      variant,
      size,
      align,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      <div 
        className="bg-neutral-900 border border-neutral-800 rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden text-right shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-950/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <MousePointerClick className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">إنشاء زر تفاعلي جديد</h3>
              <p className="text-[11px] text-neutral-400">حدد نص الزر ومعرفه الخاص (ID) وإجراءه</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* 1. What's written on the button */}
          <div className="space-y-1">
            <label className="block text-neutral-300 font-bold">
              1. ماذا يكتب على الزر؟ (نص الزر): <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="مثال: تحميل الملف الآن، تواصل معنا، اشترك..."
              className="w-full bg-neutral-950 border border-neutral-700 focus:border-indigo-500 rounded-xl px-3 py-2 text-white font-semibold text-sm focus:outline-none"
              autoFocus
            />
          </div>

          {/* 2. Button ID */}
          <div className="p-3 rounded-xl bg-neutral-950 border border-indigo-500/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-indigo-300 font-bold flex items-center gap-1.5">
                <span>2. معرف الزر الفريد (Button ID):</span>
                <span className="text-rose-400">*</span>
              </label>
              <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-full font-mono font-bold">
                مهم للربط التفاعلي
              </span>
            </div>
            <input
              type="text"
              required
              value={buttonId}
              onChange={(e) => setButtonId(e.target.value.replace(/\s+/g, '_'))}
              placeholder="مثال: btn_download أو btn_1"
              dir="ltr"
              className="w-full bg-neutral-900 border border-neutral-700 focus:border-indigo-500 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none"
            />
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              💡 يمكنك كتابة هذا الـ ID في مكون <strong>(اختيارات)</strong> لتغيير أمر هذا الزر ونصّه عند اختيار خيار معين!
            </p>
          </div>

          {/* 3. Action Type */}
          <div className="space-y-1.5">
            <label className="block text-neutral-300 font-bold">
              3. الإجراء التفاعلي عند النقر على الزر:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActionType('download_file')}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-start gap-2.5 ${
                  actionType === 'download_file'
                    ? 'bg-emerald-950/30 border-emerald-500 text-white shadow-xs'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Download className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-emerald-300">تحميل ملف 📥</div>
                  <div className="text-[10px] text-neutral-400">تنزيل ملف محدد على الجهاز</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActionType('open_url')}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-start gap-2.5 ${
                  actionType === 'open_url'
                    ? 'bg-indigo-950/30 border-indigo-500 text-white shadow-xs'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <ExternalLink className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-indigo-300">فتح رابط خارجي 🔗</div>
                  <div className="text-[10px] text-neutral-400">فتح موقع أو رابط في تبويب</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActionType('navigate_page')}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-start gap-2.5 ${
                  actionType === 'navigate_page'
                    ? 'bg-purple-950/30 border-purple-500 text-white shadow-xs'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <FileText className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-purple-300">انتقال لصفحة 📄</div>
                  <div className="text-[10px] text-neutral-400">التنقل السلس لصفحة بموقعك</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActionType('alert_message')}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-start gap-2.5 ${
                  actionType === 'alert_message'
                    ? 'bg-amber-950/30 border-amber-500 text-white shadow-xs'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Bell className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-amber-300">رسالة تنبيه 💬</div>
                  <div className="text-[10px] text-neutral-400">إظهار نافذة إشعار منبثقة</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActionType('copy_text')}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-start gap-2.5 ${
                  actionType === 'copy_text'
                    ? 'bg-sky-950/30 border-sky-500 text-white shadow-xs'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Copy className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-sky-300">نسخ للحافظة 📋</div>
                  <div className="text-[10px] text-neutral-400">نسخ كود أو نص أو إيميل</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActionType('scroll_to')}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-start gap-2.5 ${
                  actionType === 'scroll_to'
                    ? 'bg-teal-950/30 border-teal-500 text-white shadow-xs'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Target className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-teal-300">تمرير لعنصر 🎯</div>
                  <div className="text-[10px] text-neutral-400">النزول بسلاسة لقسم بالصفحة</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActionType('toggle_element')}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-start gap-2.5 ${
                  actionType === 'toggle_element'
                    ? 'bg-pink-950/30 border-pink-500 text-white shadow-xs'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Eye className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-pink-300">إظهار / إخفاء 👁️</div>
                  <div className="text-[10px] text-neutral-400">تبديل ظهور عنصر بالـ ID</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActionType('firebase_submit')}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-start gap-2.5 ${
                  actionType === 'firebase_submit'
                    ? 'bg-orange-950/30 border-orange-500 text-white shadow-xs'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Flame className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-orange-300">إرسال لـ Firebase 🔥</div>
                  <div className="text-[10px] text-neutral-400">حفظ بالـ Firestore قاعدة البيانات</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActionType('custom_js')}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-start gap-2.5 sm:col-span-2 ${
                  actionType === 'custom_js'
                    ? 'bg-blue-950/30 border-blue-500 text-white shadow-xs'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Code2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-blue-300">تشغيل كود جافاسكريبت ⚡</div>
                  <div className="text-[10px] text-neutral-400">تنفيذ كود برمجي مخصص بحرية تامة</div>
                </div>
              </button>
            </div>
          </div>

          {/* Action Configuration Sub-panel */}
          <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
            {actionType === 'download_file' && (
              <div>
                <label className="block text-emerald-400 font-bold mb-1">اسم الملف المطلوب تحميله:</label>
                <input
                  type="text"
                  value={downloadFileName}
                  onChange={(e) => setDownloadFileName(e.target.value)}
                  placeholder="مثال: guide.pdf أو package.zip"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                />
              </div>
            )}

            {actionType === 'open_url' && (
              <div>
                <label className="block text-indigo-400 font-bold mb-1">رابط الموقع (URL):</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  dir="ltr"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs mb-2"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={openInNewTab}
                    onChange={(e) => setOpenInNewTab(e.target.checked)}
                    className="w-3.5 h-3.5 rounded accent-indigo-600"
                  />
                  <span className="text-neutral-300 text-xs">فتح في تبويب جديد (New Tab)</span>
                </label>
              </div>
            )}

            {actionType === 'navigate_page' && (
              <div>
                <label className="block text-purple-400 font-bold mb-1">اختر الصفحة الهدف في موقعك:</label>
                <select
                  value={targetPageId}
                  onChange={(e) => setTargetPageId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                >
                  {pages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} {p.isHome ? '(الرئيسية)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {actionType === 'alert_message' && (
              <div>
                <label className="block text-amber-400 font-bold mb-1">نص رسالة التنبيه:</label>
                <input
                  type="text"
                  value={alertText}
                  onChange={(e) => setAlertText(e.target.value)}
                  placeholder="رسالة التنبيه التي ستظهر للمستخدم"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                />
              </div>
            )}

            {actionType === 'copy_text' && (
              <div>
                <label className="block text-sky-400 font-bold mb-1">النص المطلوب نسخه للحافظة:</label>
                <input
                  type="text"
                  value={copyText}
                  onChange={(e) => setCopyText(e.target.value)}
                  placeholder="مثال: كود خصم، إيميل، أو نص"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                />
              </div>
            )}

            {actionType === 'scroll_to' && (
              <div>
                <label className="block text-teal-400 font-bold mb-1">معرف العنصر المراد التمرير إليه (ID):</label>
                <input
                  type="text"
                  value={targetElementId}
                  onChange={(e) => setTargetElementId(e.target.value)}
                  placeholder="مثال: sec_contact أو cmp_file_main"
                  dir="ltr"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                />
              </div>
            )}

            {actionType === 'toggle_element' && (
              <div>
                <label className="block text-pink-400 font-bold mb-1">معرف العنصر المراد إظهاره/إخفاؤه (ID):</label>
                <input
                  type="text"
                  value={targetElementId}
                  onChange={(e) => setTargetElementId(e.target.value)}
                  placeholder="مثال: extra_info أو secret_box"
                  dir="ltr"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                />
              </div>
            )}

            {actionType === 'firebase_submit' && (
              <div>
                <label className="block text-orange-400 font-bold mb-1">اسم مجموعة Firestore (Collection):</label>
                <input
                  type="text"
                  value={firebaseCollection}
                  onChange={(e) => setFirebaseCollection(e.target.value)}
                  placeholder="messages"
                  dir="ltr"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                />
              </div>
            )}

            {actionType === 'custom_js' && (
              <div>
                <label className="block text-blue-400 font-bold mb-1">كود جافاسكريبت المخصص:</label>
                <textarea
                  rows={2}
                  value={customScript}
                  onChange={(e) => setCustomScript(e.target.value)}
                  dir="ltr"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                />
              </div>
            )}
          </div>

          {/* 4. Style & Alignment */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-800">
            <div>
              <label className="block text-neutral-400 mb-1">لون ومظهر الزر:</label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-white text-xs"
              >
                <option value="primary">بنفسجي رئيسي (Primary)</option>
                <option value="success">أخضر نجاح (Success)</option>
                <option value="danger">أحمر خطر (Danger)</option>
                <option value="secondary">رمادي داكن (Secondary)</option>
                <option value="outline">مفرغ بإطار (Outline)</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">المحاذاة:</label>
              <select
                value={align}
                onChange={(e) => setAlign(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-white text-xs"
              >
                <option value="center">وسط</option>
                <option value="start">يمين</option>
                <option value="end">يسار</option>
                <option value="full">عرض كامل (100%)</option>
              </select>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <MousePointerClick className="w-4 h-4" />
              <span>إضافة الزر إلى الصفحة الآن</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
