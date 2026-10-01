import React from 'react';
import { 
  X, 
  Sparkles, 
  FileDown, 
  Briefcase, 
  FolderPlus, 
  FileCode,
  Check 
} from 'lucide-react';
import { Project } from '../types/builder';
import { defaultProject, initialFiles } from '../data/defaultProject';

interface TemplatesModalProps {
  onSelectTemplate: (project: Project) => void;
  onClose: () => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({ onSelectTemplate, onClose }) => {
  const handleLoadFullTemplate = () => {
    onSelectTemplate({
      ...defaultProject,
      id: 'noklen_' + Date.now(),
      updatedAt: Date.now(),
    });
    onClose();
  };

  const handleLoadDownloadsPortal = () => {
    const downloadsProject: Project = {
      ...defaultProject,
      id: 'noklen_downloads_' + Date.now(),
      name: 'بوابة تحميل الموارد والملفات',
      description: 'موقع مخصص لتوزيع وتحميل الملفات والمستندات والبرامج',
      activePageId: 'page_dl_main',
      pages: [
        {
          id: 'page_dl_main',
          title: 'الرئيسية',
          slug: 'home',
          isHome: true,
          components: [
            {
              id: 'c_nav',
              type: 'navbar',
              brandName: 'NoklenFiles',
              brandTagline: 'مركز التنزيل السحابي',
              links: [
                { id: 'l1', label: 'الرئيسية', pageId: 'page_dl_main' },
                { id: 'l2', label: 'البرمجيات', pageId: 'page_apps' },
              ],
              ctaText: 'حمل التطبيق',
              ctaAction: 'navigate_page',
              ctaTarget: 'page_apps',
            },
            {
              id: 'c_h1',
              type: 'heading',
              level: 'h1',
              text: 'مركز التحميل والملفات المباشر',
              subtitle: 'حمل أحدث الملفات الرقمية، الكتب، والحزم البرمجية مجاناً وبروابط مباشرة.',
              align: 'center',
            },
            {
              id: 'c_f1',
              type: 'file_attachment',
              fileName: 'حزمة_أدوات_التطوير_2026.zip',
              description: 'تتضمن مكتبات React، إعدادات Tailwind، ونماذج تكامل Firebase جاهزة للتشغيل.',
              fileSize: '32.4 ميغابايت',
              fileType: 'zip',
              buttonText: 'تحميل الملف (ZIP)',
            },
            {
              id: 'c_f2',
              type: 'file_attachment',
              fileName: 'كتيب_البرمجة_والقواعد.pdf',
              description: 'دليل مرجعي مكتمل باللغة العربية لشرح كيفية التعامل مع قواعد بيانات Firestore.',
              fileSize: '4.8 ميغابايت',
              fileType: 'pdf',
              buttonText: 'تحميل الكتاب (PDF)',
            },
            {
              id: 'c_div1',
              type: 'divider',
              style: 'solid',
              thickness: '1px',
              color: '#334155',
              width: 'full',
              hasLabel: true,
              label: 'استبيان الزوار',
            },
            {
              id: 'c_ch',
              type: 'choices',
              title: 'أي نوع من الملفات تفضل إضافته لاحقاً؟',
              choiceType: 'checkbox',
              options: [
                { id: 'o1', label: 'أكواد ومشاريع مفتوحة المصدر', value: 'code', checked: true },
                { id: 'o2', label: 'ملفات تصميم وقوالب جاهزة', value: 'design', checked: true },
                { id: 'o3', label: 'كتب وشروحات تقنية PDF', value: 'books', checked: false },
              ],
            },
            {
              id: 'c_btn',
              type: 'button',
              text: 'تصفح قسم البرمجيات والتطبيقات ←',
              actionType: 'navigate_page',
              targetPageId: 'page_apps',
              variant: 'primary',
              size: 'lg',
              align: 'center',
            }
          ]
        },
        {
          id: 'page_apps',
          title: 'البرمجيات',
          slug: 'apps',
          isHome: false,
          components: [
            {
              id: 'c_nav2',
              type: 'navbar',
              brandName: 'NoklenFiles',
              links: [
                { id: 'l1', label: 'الرئيسية', pageId: 'page_dl_main' },
                { id: 'l2', label: 'البرمجيات', pageId: 'page_apps' },
              ],
              ctaText: 'الرئيسية',
              ctaAction: 'navigate_page',
              ctaTarget: 'page_dl_main',
            },
            {
              id: 'c_h_app',
              type: 'heading',
              level: 'h1',
              text: 'قسم البرمجيات والتطبيقات',
              subtitle: 'برامج وأدوات مساعدة لتسريع إنتاجيتك.',
              align: 'center',
            },
            {
              id: 'c_f_app1',
              type: 'file_attachment',
              fileName: 'تطبيق_سطح_المكتب_Noklen.exe',
              description: 'برنامج خفيف لإدارة ومزامنة مشاريعك المحلية مع السحابة مباشرة.',
              fileSize: '65 ميغابايت',
              fileType: 'code',
              buttonText: 'تنزيل لـ Windows',
            },
            {
              id: 'c_btn_back',
              type: 'button',
              text: '← العودة للرئيسية',
              actionType: 'navigate_page',
              targetPageId: 'page_dl_main',
              variant: 'secondary',
              size: 'md',
              align: 'center',
            }
          ]
        }
      ]
    };
    onSelectTemplate(downloadsProject);
    onClose();
  };

  const handleLoadBlank = () => {
    const blankProject: Project = {
      id: 'noklen_blank_' + Date.now(),
      name: 'مشروع جديد فارغ',
      description: 'مشروع خالي يمكنك بناؤه بمكوناتك الخاصة',
      version: '1.0.0',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      activePageId: 'page_1',
      settings: {
        primaryColor: '#4f46e5',
        fontFamily: 'Cairo',
        direction: 'rtl',
        firebaseEnabled: true,
      },
      files: [...initialFiles],
      pages: [
        {
          id: 'page_1',
          title: 'الرئيسية',
          slug: 'home',
          isHome: true,
          components: [
            {
              id: 'c_init_head',
              type: 'heading',
              level: 'h1',
              text: 'عنوان موقعك الجديد',
              subtitle: 'ابدأ بإضافة الأزرار والقوائم والملفات والفواصل من القائمة الجانبية.',
              align: 'center',
            },
            {
              id: 'c_init_div',
              type: 'divider',
              style: 'solid',
              thickness: '1px',
              color: '#334155',
              width: 'half',
            }
          ]
        }
      ]
    };
    onSelectTemplate(blankProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col text-right">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">القوالب الجاهزة لموقعك</h3>
              <p className="text-[11px] text-neutral-400">
                اختر قالباً جاهزاً للبدء فوراً وتوفير الوقت
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

        {/* Templates List */}
        <div className="p-5 space-y-3 overflow-y-auto max-h-[70vh]">
          {/* Template 1 */}
          <div
            onClick={handleLoadFullTemplate}
            className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-indigo-500/60 cursor-pointer transition-all flex items-start justify-between gap-3 group"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs mb-1 group-hover:text-indigo-300 transition-colors">
                  موقع متكامل مع Firebase وتعدد الصفحات (افتراضي)
                </h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  يضم 3 صفحات (الرئيسية، مركز التحميل، من نحن) مع فواصل، أزرار تنقل، صور مع وصف،
                  اختيارات، وملف جاهز للتحميل.
                </p>
              </div>
            </div>
            <span className="text-xs text-indigo-400 font-bold shrink-0 self-center">
              اختيار ←
            </span>
          </div>

          {/* Template 2 */}
          <div
            onClick={handleLoadDownloadsPortal}
            className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/60 cursor-pointer transition-all flex items-start justify-between gap-3 group"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                <FileDown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs mb-1 group-hover:text-emerald-300 transition-colors">
                  بوابة تحميل ومشاركة الملفات والمستندات
                </h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  موقع مصمم لمشاركة ملفات الـ PDF وحزم الـ ZIP والبرامج مع بطاقات وصف وأحجام الملفات
                  وأزرار تنزيل.
                </p>
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-bold shrink-0 self-center">
              اختيار ←
            </span>
          </div>

          {/* Template 3 */}
          <div
            onClick={handleLoadBlank}
            className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-all flex items-start justify-between gap-3 group"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-neutral-800 text-neutral-400 shrink-0">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs mb-1 group-hover:text-neutral-200 transition-colors">
                  مشروع فارغ (ابدأ من الصفر)
                </h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  صفحة بيضاء نظيفة تماماً تمنحك حرية إضافة وبناء كل عنصر بنفسك خطوة بخطوة.
                </p>
              </div>
            </div>
            <span className="text-xs text-neutral-400 font-bold shrink-0 self-center">
              اختيار ←
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
