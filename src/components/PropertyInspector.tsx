import React from 'react';
import { 
  BuilderComponent, 
  Page, 
  ChoiceOption, 
  ListItem, 
  NavbarLink 
} from '../types/builder';
import { 
  Trash2, 
  Plus, 
  ExternalLink, 
  Sliders, 
  MoveRight, 
  Palette, 
  Type, 
  FileText 
} from 'lucide-react';

interface PropertyInspectorProps {
  component: BuilderComponent | null;
  pages: Page[];
  onUpdateComponent: (updated: BuilderComponent) => void;
  onDeleteComponent: (id: string) => void;
  onDeselect: () => void;
  onCloseMobile?: () => void;
}

export const PropertyInspector: React.FC<PropertyInspectorProps> = ({
  component,
  pages,
  onUpdateComponent,
  onDeleteComponent,
  onDeselect,
  onCloseMobile,
}) => {
  if (!component) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center select-none bg-neutral-900 border-r border-neutral-800">
        <Sliders className="w-8 h-8 text-neutral-600 mb-3" />
        <h4 className="text-xs font-bold text-neutral-300 mb-1">لم يتم تحديد مكون</h4>
        <p className="text-[11px] text-neutral-500 max-w-[200px] leading-relaxed mb-4">
          انقر على أي مكون في مساحة العمل لتعديل خصائصه وتنسيقاته هنا.
        </p>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg text-xs"
          >
            العودة للمحرر
          </button>
        )}
      </div>
    );
  }

  const updateProp = (key: string, value: any) => {
    onUpdateComponent({
      ...component,
      [key]: value,
    } as BuilderComponent);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 border-r border-neutral-800 text-right select-none">
      {/* Mobile drag handle if rendered inside bottom sheet */}
      {onCloseMobile && (
        <div className="pt-2 pb-1 flex flex-col items-center border-b border-neutral-800/60 lg:hidden">
          <div className="w-10 h-1.5 bg-neutral-700 rounded-full mb-2" />
        </div>
      )}

      {/* Header */}
      <div className="p-3 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          <h3 className="text-xs font-bold text-neutral-200">
            تخصيص: {getComponentArabicName(component.type)}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onDeleteComponent(component.id);
              if (onCloseMobile) onCloseMobile();
            }}
            className="text-neutral-500 hover:text-rose-400 p-1.5 rounded hover:bg-neutral-800 transition-colors"
            title="حذف هذا المكون"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="text-xs bg-indigo-600 text-white px-2.5 py-1 rounded-md font-bold"
            >
              تم ✓
            </button>
          )}
        </div>
      </div>

      {/* Properties Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 text-xs">
        {/* Specific Properties based on Component Type */}
        {component.type === 'button' && (
          <div className="space-y-3.5">
            {/* Button Unique ID */}
            <div className="p-3 rounded-xl bg-neutral-950 border border-indigo-500/30">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-indigo-400 font-bold text-xs flex items-center gap-1">
                  <span>معرف الزر الفريد (Button ID)</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const idVal = component.buttonId || component.id;
                      navigator.clipboard.writeText(idVal);
                      alert(`📋 تم نسخ معرف الزر: #${idVal}`);
                    }}
                    className="text-[10px] bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 font-mono px-2 py-0.5 rounded cursor-pointer"
                    title="نسخ المعرف لاستخدامه في الاختيارات"
                  >
                    نسخ ID 📋
                  </button>
                  <span className="text-[10px] bg-neutral-800 text-neutral-400 font-mono px-1.5 py-0.5 rounded">
                    مهم للربط
                  </span>
                </div>
              </div>
              <input
                type="text"
                value={component.buttonId || component.id}
                onChange={(e) => updateProp('buttonId', e.target.value.trim().replace(/\s+/g, '_'))}
                placeholder="مثال: btn_download أو btn_action"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-neutral-400 mt-1.5 leading-relaxed">
                💡 اكتب هذا الـ ID في أي خيار من مكون <strong>(اختيارات)</strong> ليقوم الخيار بتغيير أمر هذا الزر ونصّه عند التحديد!
              </p>
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">نص الزر (ما هو مكتوب عليه)</label>
              <input
                type="text"
                value={component.text}
                onChange={(e) => updateProp('text', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 focus:outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            {/* Rich Interactive Actions */}
            <div>
              <label className="block text-neutral-400 font-medium mb-1">نوع الإجراء التفاعلي عند النقر</label>
              <select
                value={component.actionType}
                onChange={(e) => updateProp('actionType', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="navigate_page">الانتقال إلى صفحة في الموقع 📄</option>
                <option value="open_url">فتح رابط خارجي 🔗</option>
                <option value="download_file">تحميل ملف محدد على الجهاز 📥</option>
                <option value="alert_message">إظهار رسالة تنبيه أو إشعار 💬</option>
                <option value="copy_text">نسخ نص إلى الحافظة (Copy) 📋</option>
                <option value="scroll_to">التمرير السلس إلى قسم/عنصر 🎯</option>
                <option value="toggle_element">إظهار أو إخفاء عنصر بالـ ID 👁️</option>
                <option value="firebase_submit">إرسال البيانات لـ Firebase Firestore 🔥</option>
                <option value="custom_js">تشغيل كود جافاسكربت مخصص ⚡</option>
              </select>
            </div>

            {/* 1. Navigate to Page */}
            {component.actionType === 'navigate_page' && (
              <div className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-500/30">
                <label className="block text-indigo-300 font-bold mb-1">
                  اختر الصفحة الهدف:
                </label>
                <select
                  value={component.targetPageId || ''}
                  onChange={(e) => updateProp('targetPageId', e.target.value)}
                  className="w-full bg-neutral-950 border border-indigo-500/50 rounded-lg px-2.5 py-1.5 text-white font-medium focus:outline-none"
                >
                  <option value="">-- اختر صفحة من موقعك --</option>
                  {pages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} {p.isHome ? '(الرئيسية)' : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-indigo-400 mt-1.5">
                  عند النقر، سينتقل الزائر مباشرة للصفحة المحددة دون إعادة تحميل الموقع.
                </p>
              </div>
            )}

            {/* 2. Open URL */}
            {component.actionType === 'open_url' && (
              <div className="space-y-2 p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                <div>
                  <label className="block text-neutral-400 font-medium mb-1">رابط الموقع (URL)</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={component.url || ''}
                    onChange={(e) => updateProp('url', e.target.value)}
                    dir="ltr"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={component.openInNewTab !== false}
                    onChange={(e) => updateProp('openInNewTab', e.target.checked)}
                    className="w-4 h-4 rounded accent-indigo-600"
                  />
                  <span className="text-neutral-300 text-xs">فتح الرابط في تبويب جديد (New Tab)</span>
                </label>
              </div>
            )}

            {/* 3. Download File */}
            {component.actionType === 'download_file' && (
              <div className="space-y-2 p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">اسم الملف المراد تحميله</label>
                  <input
                    type="text"
                    placeholder="مثال: guide.pdf أو package.zip"
                    value={component.downloadFileName || ''}
                    onChange={(e) => updateProp('downloadFileName', e.target.value)}
                    className="w-full bg-neutral-950 border border-emerald-500/40 rounded-lg px-2.5 py-1.5 text-neutral-100 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-medium mb-1">رابط التنزيل المباشر (اختياري)</label>
                  <input
                    type="text"
                    placeholder="رابط الملف السحابي إن وُجد"
                    value={component.downloadFileUrl || ''}
                    onChange={(e) => updateProp('downloadFileUrl', e.target.value)}
                    dir="ltr"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 font-mono text-xs"
                  />
                </div>
              </div>
            )}

            {/* 4. Alert Message */}
            {component.actionType === 'alert_message' && (
              <div>
                <label className="block text-neutral-400 font-medium mb-1">نص رسالة التنبيه</label>
                <input
                  type="text"
                  placeholder="رسالة التنبيه التي ستظهر للمستخدم"
                  value={component.alertText || ''}
                  onChange={(e) => updateProp('alertText', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {/* 5. Copy Text */}
            {component.actionType === 'copy_text' && (
              <div>
                <label className="block text-neutral-400 font-medium mb-1">النص المراد نسخه للحافظة</label>
                <input
                  type="text"
                  placeholder="مثال: كود خصم، بريد إلكتروني، أو رابط"
                  value={component.copyText || ''}
                  onChange={(e) => updateProp('copyText', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {/* 6. Scroll to Section / Element */}
            {component.actionType === 'scroll_to' && (
              <div>
                <label className="block text-neutral-400 font-medium mb-1">معرف العنصر المراد التمرير إليه (ID)</label>
                <input
                  type="text"
                  placeholder="مثال: cmp_file_main أو contact-section"
                  value={component.targetElementId || ''}
                  onChange={(e) => updateProp('targetElementId', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {/* 7. Toggle Element Visibility */}
            {component.actionType === 'toggle_element' && (
              <div>
                <label className="block text-neutral-400 font-medium mb-1">معرف العنصر المراد إظهاره/إخفاؤه (ID)</label>
                <input
                  type="text"
                  placeholder="مثال: secret-box أو download-area"
                  value={component.targetElementId || ''}
                  onChange={(e) => updateProp('targetElementId', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {/* 8. Firebase Submit */}
            {component.actionType === 'firebase_submit' && (
              <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30">
                <label className="block text-amber-300 font-bold mb-1">اسم مجموعة Firestore (Collection)</label>
                <input
                  type="text"
                  placeholder="مثال: messages أو orders"
                  value={component.firebaseCollection || 'messages'}
                  onChange={(e) => updateProp('firebaseCollection', e.target.value)}
                  dir="ltr"
                  className="w-full bg-neutral-950 border border-amber-500/40 rounded-lg px-2.5 py-1.5 text-neutral-100 font-mono text-xs"
                />
              </div>
            )}

            {/* 9. Custom JavaScript */}
            {component.actionType === 'custom_js' && (
              <div>
                <label className="block text-neutral-400 font-medium mb-1">كود JavaScript</label>
                <textarea
                  rows={3}
                  placeholder="alert('تم تفعيل الكود بنجاح!');"
                  value={component.customScript || ''}
                  onChange={(e) => updateProp('customScript', e.target.value)}
                  dir="ltr"
                  className="w-full font-mono bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 text-[11px] focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
              <div>
                <label className="block text-neutral-400 font-medium mb-1">مظهر الزر</label>
                <select
                  value={component.variant}
                  onChange={(e) => updateProp('variant', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-neutral-100"
                >
                  <option value="primary">رئيسي (Indigo)</option>
                  <option value="secondary">ثانوي (Dark)</option>
                  <option value="outline">مفرغ (Outline)</option>
                  <option value="success">نجاح (Green)</option>
                  <option value="danger">خطر (Red)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">المحاذاة</label>
                <select
                  value={component.align}
                  onChange={(e) => updateProp('align', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-neutral-100"
                >
                  <option value="start">يمين</option>
                  <option value="center">وسط</option>
                  <option value="end">يسار</option>
                  <option value="full">عرض كامل</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Divider Component properties */}
        {component.type === 'divider' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-neutral-400 font-medium mb-1">شكل الخط</label>
              <select
                value={component.style}
                onChange={(e) => updateProp('style', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100"
              >
                <option value="solid">خط متصل (Solid)</option>
                <option value="dashed">خط متقطع (Dashed)</option>
                <option value="dotted">نقاط (Dotted)</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">سُمك الخط</label>
              <div className="flex gap-2">
                {(['1px', '2px', '4px'] as const).map((thick) => (
                  <button
                    key={thick}
                    type="button"
                    onClick={() => updateProp('thickness', thick)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-mono ${
                      component.thickness === thick
                        ? 'bg-neutral-800 border-indigo-500 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    {thick}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">لون الفاصلة</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={component.color}
                  onChange={(e) => updateProp('color', e.target.value)}
                  className="w-8 h-8 rounded bg-transparent cursor-pointer border border-neutral-700"
                />
                <input
                  type="text"
                  value={component.color}
                  onChange={(e) => updateProp('color', e.target.value)}
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1 text-neutral-100 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">العرض</label>
              <select
                value={component.width}
                onChange={(e) => updateProp('width', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100"
              >
                <option value="full">عرض كامل (100%)</option>
                <option value="half">نصف العرض (50%)</option>
                <option value="quarter">ربع العرض (25%)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-neutral-800">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={component.hasLabel || false}
                  onChange={(e) => updateProp('hasLabel', e.target.checked)}
                  className="w-4 h-4 rounded accent-indigo-600"
                />
                <span className="text-neutral-300 font-medium">إضافة نص في منتصف الفاصلة</span>
              </label>

              {component.hasLabel && (
                <input
                  type="text"
                  placeholder="نص الفاصلة (مثال: المميزات)"
                  value={component.label || ''}
                  onChange={(e) => updateProp('label', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100"
                />
              )}
            </div>
          </div>
        )}

        {/* Choices Component properties */}
        {component.type === 'choices' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-neutral-400 font-medium mb-1">عنوان / سؤال الاختيارات</label>
              <input
                type="text"
                value={component.title}
                onChange={(e) => updateProp('title', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">وصف توضيحي</label>
              <input
                type="text"
                value={component.description || ''}
                onChange={(e) => updateProp('description', e.target.value)}
                placeholder="توجيهات أو شرح للخيارات"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">نوع الاختيار</label>
              <select
                value={component.choiceType}
                onChange={(e) => updateProp('choiceType', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100"
              >
                <option value="checkbox">مربعات اختيار متعددة (Checkbox)</option>
                <option value="radio">اختيار وحيد (Radio)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-300">قائمة الخيارات:</span>
                <button
                  type="button"
                  onClick={() => {
                    const newOpt: ChoiceOption = {
                      id: 'opt_' + Date.now(),
                      label: `خيار جديد ${component.options.length + 1}`,
                      value: `val_${Date.now()}`,
                      checked: false,
                    };
                    updateProp('options', [...component.options, newOpt]);
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3 h-3" />
                  <span>إضافة خيار</span>
                </button>
              </div>

              <div className="space-y-2">
                {component.options.map((opt, idx) => {
                  const hasButtonMutation = !!opt.targetButtonId;

                  return (
                    <div key={opt.id} className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-neutral-900 text-neutral-400 font-mono text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={opt.label}
                          placeholder="نص الخيار"
                          onChange={(e) => {
                            const updatedOpts = [...component.options];
                            updatedOpts[idx] = { ...opt, label: e.target.value };
                            updateProp('options', updatedOpts);
                          }}
                          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedOpts = component.options.filter((_, i) => i !== idx);
                            updateProp('options', updatedOpts);
                          }}
                          className="text-neutral-500 hover:text-rose-400 p-1 rounded hover:bg-neutral-900"
                          title="حذف الخيار"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Interactive Button Wiring for this choice! */}
                      <div className="pt-1.5 border-t border-neutral-900">
                        <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-indigo-400 font-semibold mb-1">
                          <input
                            type="checkbox"
                            checked={hasButtonMutation}
                            onChange={(e) => {
                              const updatedOpts = [...component.options];
                              if (e.target.checked) {
                                // Default target first button on page if available
                                const firstBtn = pages.flatMap(p => p.components).find(c => c.type === 'button') as any;
                                updatedOpts[idx] = {
                                  ...opt,
                                  targetButtonId: firstBtn ? (firstBtn.buttonId || firstBtn.id) : 'btn_main',
                                  buttonNewText: 'تنفيذ الإجراء الجديد',
                                  buttonNewAction: 'download_file',
                                  buttonNewTarget: 'package.zip',
                                  buttonNewVariant: 'success'
                                };
                              } else {
                                updatedOpts[idx] = {
                                  ...opt,
                                  targetButtonId: undefined,
                                  buttonNewText: undefined,
                                  buttonNewAction: undefined,
                                  buttonNewTarget: undefined,
                                  buttonNewVariant: undefined
                                };
                              }
                              updateProp('options', updatedOpts);
                            }}
                            className="w-3.5 h-3.5 rounded accent-indigo-600"
                          />
                          <span>⚡ تغيير أمر زر بالـ ID عند اختيار هذا الخيار</span>
                        </label>

                        {hasButtonMutation && (
                          <div className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-500/30 space-y-2.5 mt-1">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[11px] text-indigo-300 font-bold">
                                  معرف الزر المطلوب تعديل أمره (Target Button ID):
                                </label>
                              </div>

                              {/* Quick selector from existing buttons */}
                              {(() => {
                                const allButtons = pages.flatMap(p => p.components).filter(c => c.type === 'button') as any[];
                                if (allButtons.length === 0) return null;
                                return (
                                  <div className="mb-2 p-1.5 rounded-lg bg-neutral-900 border border-neutral-800">
                                    <span className="text-[10px] text-neutral-400 block mb-1">انقر لاختيار زر من الصفحة:</span>
                                    <div className="flex flex-wrap gap-1">
                                      {allButtons.map(btn => {
                                        const bId = btn.buttonId || btn.id;
                                        const isSelected = opt.targetButtonId === bId;
                                        return (
                                          <button
                                            key={btn.id}
                                            type="button"
                                            onClick={() => {
                                              const updatedOpts = [...component.options];
                                              updatedOpts[idx] = { 
                                                ...opt, 
                                                targetButtonId: bId,
                                                buttonNewText: opt.buttonNewText || btn.text,
                                              };
                                              updateProp('options', updatedOpts);
                                            }}
                                            className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all flex items-center gap-1 cursor-pointer ${
                                              isSelected
                                                ? 'bg-indigo-600 text-white border-indigo-400 font-bold shadow-xs'
                                                : 'bg-neutral-950 text-neutral-300 border-neutral-700 hover:border-indigo-400'
                                            }`}
                                          >
                                            <span>#{bId}</span>
                                            <span className="opacity-75 truncate max-w-[80px]">({btn.text})</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })()}

                              <input
                                type="text"
                                placeholder="اكتب الـ ID هنا (مثال: btn_1 أو btn_download)"
                                value={opt.targetButtonId || ''}
                                onChange={(e) => {
                                  const updatedOpts = [...component.options];
                                  updatedOpts[idx] = { ...opt, targetButtonId: e.target.value.trim() };
                                  updateProp('options', updatedOpts);
                                }}
                                dir="ltr"
                                className="w-full bg-neutral-900 border border-indigo-500/50 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none"
                              />
                              <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed">
                                💡 اكتب نفس الـ ID الخاص بالزر الذي ترغب بأن يتغير أمره ونصّه عند اختيار هذا الخيار.
                              </p>
                            </div>

                            <div>
                              <label className="block text-[10px] text-neutral-300 font-bold mb-0.5">
                                نص الزر الجديد (ماذا يكتب عليه عند الاختيار):
                              </label>
                              <input
                                type="text"
                                placeholder="مثال: تحميل حزمة الملفات الآن"
                                value={opt.buttonNewText || ''}
                                onChange={(e) => {
                                  const updatedOpts = [...component.options];
                                  updatedOpts[idx] = { ...opt, buttonNewText: e.target.value };
                                  updateProp('options', updatedOpts);
                                }}
                                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none font-semibold"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] text-neutral-300 font-bold mb-0.5">
                                  أمر الزر الجديد:
                                </label>
                                <select
                                  value={opt.buttonNewAction || 'download_file'}
                                  onChange={(e) => {
                                    const updatedOpts = [...component.options];
                                    updatedOpts[idx] = { ...opt, buttonNewAction: e.target.value as any };
                                    updateProp('options', updatedOpts);
                                  }}
                                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-[11px] text-white"
                                >
                                  <option value="download_file">تحميل ملف 📥</option>
                                  <option value="open_url">فتح رابط 🔗</option>
                                  <option value="navigate_page">انتقال لصفحة 📄</option>
                                  <option value="alert_message">إظهار تنبيه 💬</option>
                                  <option value="copy_text">نسخ نص 📋</option>
                                  <option value="toggle_element">إظهار/إخفاء 👁️</option>
                                  <option value="custom_js">كود مخصص ⚡</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[10px] text-neutral-300 font-bold mb-0.5">
                                  المظهر الجديد:
                                </label>
                                <select
                                  value={opt.buttonNewVariant || 'primary'}
                                  onChange={(e) => {
                                    const updatedOpts = [...component.options];
                                    updatedOpts[idx] = { ...opt, buttonNewVariant: e.target.value as any };
                                    updateProp('options', updatedOpts);
                                  }}
                                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-[11px] text-white"
                                >
                                  <option value="success">أخضر (Success)</option>
                                  <option value="primary">بنفسجي (Primary)</option>
                                  <option value="danger">أحمر (Danger)</option>
                                  <option value="secondary">رمادي (Dark)</option>
                                  <option value="outline">مفرغ (Outline)</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] text-neutral-300 font-bold mb-0.5">
                                الهدف الجديد (اسم الملف، الرابط، أو كود التنبيه):
                              </label>
                              <input
                                type="text"
                                placeholder="مثال: guide.pdf أو https://... أو page_contact"
                                value={opt.buttonNewTarget || ''}
                                onChange={(e) => {
                                  const updatedOpts = [...component.options];
                                  updatedOpts[idx] = { ...opt, buttonNewTarget: e.target.value };
                                  updateProp('options', updatedOpts);
                                }}
                                dir="ltr"
                                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* List Component properties */}
        {component.type === 'list' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-neutral-400 font-medium mb-1">عنوان القائمة</label>
              <input
                type="text"
                value={component.title || ''}
                onChange={(e) => updateProp('title', e.target.value)}
                placeholder="عنوان القائمة (اختياري)"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">نوع وشكل القائمة</label>
              <select
                value={component.listType}
                onChange={(e) => updateProp('listType', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100"
              >
                <option value="check">علامات صح (مميزات / Checkmarks)</option>
                <option value="bullet">نقاط عادية (Bullets)</option>
                <option value="numbered">مرقمة (Numbered 1, 2, 3)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-300">عناصر القائمة:</span>
                <button
                  type="button"
                  onClick={() => {
                    const newItem: ListItem = {
                      id: 'li_' + Date.now(),
                      title: `عنصر جديد ${component.items.length + 1}`,
                      description: 'تفاصيل هذا العنصر',
                    };
                    updateProp('items', [...component.items, newItem]);
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3 h-3" />
                  <span>إضافة عنصر</span>
                </button>
              </div>

              <div className="space-y-2">
                {component.items.map((item, idx) => (
                  <div key={item.id} className="p-2 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <input
                        type="text"
                        placeholder="عنوان العنصر"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...component.items];
                          updated[idx] = { ...item, title: e.target.value };
                          updateProp('items', updated);
                        }}
                        className="flex-1 bg-transparent border-b border-neutral-800 pb-0.5 text-xs font-semibold text-neutral-200 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = component.items.filter((_, i) => i !== idx);
                          updateProp('items', updated);
                        }}
                        className="text-neutral-500 hover:text-rose-400 p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="وصف إضافي (اختياري)"
                      value={item.description || ''}
                      onChange={(e) => {
                        const updated = [...component.items];
                        updated[idx] = { ...item, description: e.target.value };
                        updateProp('items', updated);
                      }}
                      className="w-full bg-transparent text-[11px] text-neutral-400 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Image with Caption Component properties */}
        {component.type === 'image_with_caption' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-neutral-400 font-medium mb-1">رابط الصورة (URL)</label>
              <input
                type="text"
                value={component.imageUrl}
                onChange={(e) => updateProp('imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">عنوان الصورة (Caption)</label>
              <input
                type="text"
                value={component.caption}
                onChange={(e) => updateProp('caption', e.target.value)}
                placeholder="عنوان توضيحي للصورة"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">الوصف التفصيلي</label>
              <textarea
                rows={3}
                value={component.description}
                onChange={(e) => updateProp('description', e.target.value)}
                placeholder="وصف تفصيلي يشرح محتوى الصورة وما تعبر عنه..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
              <div>
                <label className="block text-neutral-400 font-medium mb-1">استدارة الحواف</label>
                <select
                  value={component.rounded}
                  onChange={(e) => updateProp('rounded', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-neutral-100"
                >
                  <option value="none">حواف حادة</option>
                  <option value="md">متوسطة</option>
                  <option value="lg">كبيرة</option>
                  <option value="2xl">دائرية واسعة</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">نص بديل (SEO/Alt)</label>
                <input
                  type="text"
                  value={component.alt || ''}
                  onChange={(e) => updateProp('alt', e.target.value)}
                  placeholder="Alt text"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-neutral-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* File Attachment with Description properties */}
        {component.type === 'file_attachment' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-neutral-400 font-medium mb-1">اسم الملف</label>
              <input
                type="text"
                value={component.fileName}
                onChange={(e) => updateProp('fileName', e.target.value)}
                placeholder="مثال: الحقيبة_التعليمية_2026.pdf"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 font-semibold"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">وصف الملف</label>
              <textarea
                rows={2}
                value={component.description}
                onChange={(e) => updateProp('description', e.target.value)}
                placeholder="شرح لمحتوى هذا الملف وماذا يضم للزائر..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-neutral-400 font-medium mb-1">نوع الملف</label>
                <select
                  value={component.fileType}
                  onChange={(e) => updateProp('fileType', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-neutral-100"
                >
                  <option value="pdf">مستند PDF</option>
                  <option value="zip">ملف مضغوط ZIP</option>
                  <option value="code">ملف برمجي Code</option>
                  <option value="doc">مستند Doc</option>
                  <option value="image">صورة Image</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">حجم الملف</label>
                <input
                  type="text"
                  value={component.fileSize}
                  onChange={(e) => updateProp('fileSize', e.target.value)}
                  placeholder="مثال: 5.4 ميغابايت"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-neutral-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">نص زر التحميل</label>
              <input
                type="text"
                value={component.buttonText}
                onChange={(e) => updateProp('buttonText', e.target.value)}
                placeholder="مثال: تنزيل الملف الآن"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100"
              />
            </div>
          </div>
        )}

        {/* Heading properties */}
        {component.type === 'heading' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-neutral-400 font-medium mb-1">نص العنوان</label>
              <input
                type="text"
                value={component.text}
                onChange={(e) => updateProp('text', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">العنوان الفرعي (Subtitle)</label>
              <textarea
                rows={2}
                value={component.subtitle || ''}
                onChange={(e) => updateProp('subtitle', e.target.value)}
                placeholder="نص فرعي يشرح العنوان..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-neutral-400 font-medium mb-1">مستوى العنوان</label>
                <select
                  value={component.level}
                  onChange={(e) => updateProp('level', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-neutral-100 font-mono"
                >
                  <option value="h1">H1 (رئيسي كبير)</option>
                  <option value="h2">H2 (متوسط)</option>
                  <option value="h3">H3 (صغير)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">المحاذاة</label>
                <select
                  value={component.align}
                  onChange={(e) => updateProp('align', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-neutral-100"
                >
                  <option value="right">يمين</option>
                  <option value="center">وسط</option>
                  <option value="left">يسار</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Paragraph properties */}
        {component.type === 'paragraph' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-neutral-400 font-medium mb-1">نص الفقرة</label>
              <textarea
                rows={4}
                value={component.text}
                onChange={(e) => updateProp('text', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-neutral-400 font-medium mb-1">حجم الخط</label>
                <select
                  value={component.size}
                  onChange={(e) => updateProp('size', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-neutral-100"
                >
                  <option value="sm">صغير (Small)</option>
                  <option value="base">عادي (Normal)</option>
                  <option value="lg">كبير (Large)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">المحاذاة</label>
                <select
                  value={component.align}
                  onChange={(e) => updateProp('align', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-neutral-100"
                >
                  <option value="right">يمين</option>
                  <option value="center">وسط</option>
                  <option value="left">يسار</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Navbar properties */}
        {component.type === 'navbar' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-neutral-400 font-medium mb-1">اسم الموقع / الشعار</label>
              <input
                type="text"
                value={component.brandName}
                onChange={(e) => updateProp('brandName', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 font-bold"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">شعار لفظي (Tagline)</label>
              <input
                type="text"
                value={component.brandTagline || ''}
                onChange={(e) => updateProp('brandTagline', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100"
              />
            </div>

            <div className="pt-2 border-t border-neutral-800">
              <span className="font-semibold text-neutral-300 block mb-2">روابط التنقل:</span>
              <div className="space-y-2">
                {component.links.map((link, idx) => (
                  <div key={link.id} className="p-2 bg-neutral-950 rounded-lg border border-neutral-800 flex items-center gap-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => {
                        const updatedLinks = [...component.links];
                        updatedLinks[idx] = { ...link, label: e.target.value };
                        updateProp('links', updatedLinks);
                      }}
                      className="flex-1 bg-transparent text-xs text-neutral-200 focus:outline-none"
                    />
                    <select
                      value={link.pageId || ''}
                      onChange={(e) => {
                        const updatedLinks = [...component.links];
                        updatedLinks[idx] = { ...link, pageId: e.target.value };
                        updateProp('links', updatedLinks);
                      }}
                      className="bg-neutral-900 border border-neutral-700 rounded px-1 py-1 text-[11px] text-neutral-300"
                    >
                      <option value="">اختر صفحة</option>
                      {pages.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Card Component properties */}
        {component.type === 'card' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-neutral-400 font-medium mb-1">عنوان البطاقة</label>
              <input
                type="text"
                value={component.title}
                onChange={(e) => updateProp('title', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 font-bold"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">الوصف</label>
              <textarea
                rows={2}
                value={component.description}
                onChange={(e) => updateProp('description', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">شارة (Badge)</label>
              <input
                type="text"
                value={component.badge || ''}
                onChange={(e) => updateProp('badge', e.target.value)}
                placeholder="مثال: جديد أو مميز"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function getComponentArabicName(type: string): string {
  const map: Record<string, string> = {
    divider: 'فاصلة',
    list: 'قائمة',
    choices: 'اختيارات',
    button: 'زر تفاعلي',
    image_with_caption: 'صورة مع وصف',
    file_attachment: 'ملف مع وصف',
    heading: 'عنوان',
    paragraph: 'فقرة',
    navbar: 'شريط علوي',
    card: 'بطاقة',
    form_input: 'حقل إدخال',
  };
  return map[type] || type;
}
