import { Project, VirtualFile } from '../types/builder';
import { defaultFirebaseTemplate } from './firebaseTemplate';

export const initialFiles: VirtualFile[] = [
  {
    id: 'file_html',
    name: 'index.html',
    type: 'html',
    isSystem: true,
    description: 'ملف الصفحة الرئيسية وهيكل الموقع',
    content: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>موقعي | NoklenWeb Builder</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <!-- سيتم إدراج مكونات الموقع تلقائياً من المحرر -->
  <div id="noklen-app"></div>

  <!-- سكربت التحكم والتنقل وتكامل Firebase -->
  <script type="module" src="firebase-config.js"></script>
  <script src="app.js"></script>
</body>
</html>`,
    lastModified: Date.now(),
  },
  {
    id: 'file_css',
    name: 'styles.css',
    type: 'css',
    isSystem: true,
    description: 'ملف الأنماط والتنسيقات المرئية',
    content: `/* أنماط موقع NoklenWeb Builder */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Cairo', system-ui, sans-serif;
  background-color: #0b0f19;
  color: #f1f5f9;
  line-height: 1.6;
  direction: rtl;
}

.container {
  max-width: 1080px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.noklen-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.noklen-btn-primary {
  background-color: #4f46e5;
  color: #ffffff;
  border: none;
}

.noklen-btn-primary:hover {
  background-color: #4338ca;
  transform: translateY(-1px);
}

.noklen-card {
  background: #111827;
  border: 1px solid #1f2937;
  border-radius: 0.75rem;
  padding: 1.5rem;
}
`,
    lastModified: Date.now(),
  },
  {
    id: 'file_js',
    name: 'app.js',
    type: 'javascript',
    isSystem: true,
    description: 'ملف التفاعلات والتنقل بين الصفحات',
    content: `// سكربت التفاعل والتنقل بين الصفحات في NoklenWeb
document.addEventListener("DOMContentLoaded", () => {
  console.log("NoklenWeb Site Initialized Successfully!");

  // معالج أزرار التفاعل
  document.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const action = btn.getAttribute("data-action");
      const target = btn.getAttribute("data-target");

      if (action === "navigate") {
        if (window.navigateToPage) {
          window.navigateToPage(target);
        } else {
          console.log("Navigating to page:", target);
        }
      } else if (action === "alert") {
        alert(target || "مرحباً بك!");
      }
    });
  });
});
`,
    lastModified: Date.now(),
  },
  {
    id: 'file_firebase',
    name: 'firebase-config.js',
    type: 'javascript',
    isSystem: false,
    description: 'إعدادات وقواعد Firebase Firestore & Auth جاهزة للتعديل',
    content: defaultFirebaseTemplate,
    lastModified: Date.now(),
  },
  {
    id: 'file_readme',
    name: 'README.md',
    type: 'markdown',
    isSystem: false,
    description: 'دليل استخدام وتشغيل الموقع',
    content: `# موقع NoklenWeb Builder الخاص بك

تم بناء هذا الموقع باستخدام صانع المواقع المتقدم **NoklenWeb Builder**.

## المميزات المدمجة:
- صفحات تفاعلية متعددة مع أزرار تنقل سلسة.
- مكونات متقدمة (فواصل، قوائم، اختيارات، أزرار، صور مع وصف، ملفات مع وصف).
- ملف \`firebase-config.js\` مهيأ للربط المباشر مع قاعدة بيانات Firestore ومصادقة المستخدمين.
- إمكانية التصدير كملف مشروع \`.noklen\` واستيراده في أي وقت لاستكمال التطوير.

## تشغيل الموقع محلياً:
1. قم بفك ضغط الملفات.
2. افتح ملف \`index.html\` في أي متصفح، أو قم برفعه إلى Firebase Hosting أو GitHub Pages أو Vercel.
`,
    lastModified: Date.now(),
  }
];

export const defaultProject: Project = {
  id: 'noklen_project_default',
  name: 'موقعي الذكي',
  description: 'موقع ويب متكامل تم إنشاؤه عبر منصة NoklenWeb Builder مع دعم Firebase وتعدد الصفحات',
  version: '1.0.0',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  activePageId: 'page_home',
  settings: {
    primaryColor: '#4f46e5',
    fontFamily: 'Cairo',
    direction: 'rtl',
    firebaseEnabled: true,
  },
  files: [...initialFiles],
  pages: [
    {
      id: 'page_home',
      title: 'الرئيسية',
      slug: 'home',
      isHome: true,
      seoTitle: 'الرئيسية | موقعي',
      seoDescription: 'الصفحة الرئيسية لموقعي الجديد',
      components: [
        {
          id: 'cmp_nav',
          type: 'navbar',
          brandName: 'NoklenWeb',
          brandTagline: 'صانع المواقع السريع',
          links: [
            { id: 'nl_1', label: 'الرئيسية', pageId: 'page_home' },
            { id: 'nl_2', label: 'مركز التحميل', pageId: 'page_downloads' },
            { id: 'nl_3', label: 'من نحن', pageId: 'page_about' },
          ],
          ctaText: 'ابدأ الآن',
          ctaAction: 'navigate_page',
          ctaTarget: 'page_downloads',
          margin: 'none',
        },
        {
          id: 'cmp_head',
          type: 'heading',
          level: 'h1',
          text: 'مرحباً بك في موقعك الجديد عبر NoklenWeb',
          subtitle: 'صمم صفحات موقعك، أضف الملفات والصور، واربط قاعدة بيانات Firebase بكل سهولة وسرعة.',
          align: 'center',
          margin: 'lg',
        },
        {
          id: 'cmp_btn_main',
          type: 'button',
          buttonId: 'btn_main',
          text: 'تصفح مركز التحميل والملفات ←',
          actionType: 'navigate_page',
          targetPageId: 'page_downloads',
          variant: 'primary',
          size: 'lg',
          align: 'center',
          margin: 'md',
        },
        {
          id: 'cmp_div_1',
          type: 'divider',
          style: 'solid',
          thickness: '1px',
          color: '#334155',
          width: 'full',
          hasLabel: true,
          label: 'معاينة الخدمات والملفات',
          margin: 'lg',
        },
        {
          id: 'cmp_img_desc',
          type: 'image_with_caption',
          imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          alt: 'واجهة المنصة والتحليلات',
          caption: 'لوحة التحكم والتحليلات الذكية',
          description: 'نظام متكامل يتيح لك إدارة محتواك ومراقبة الزيارات والملفات المرفوعة مع مزامنة فورية عبر السحابة.',
          layout: 'card',
          rounded: 'lg',
          aspectRatio: '16/9',
          shadow: true,
          margin: 'md',
        },
        {
          id: 'cmp_file_main',
          type: 'file_attachment',
          fileName: 'دليل_البدء_السريع_2026.pdf',
          description: 'ملف PDF يحتوي على شروحات خطوة بخطوة لربط Firebase وتخصيص الصفحات والأكواد البرمجية.',
          fileSize: '3.4 ميغابايت',
          fileType: 'pdf',
          buttonText: 'تحميل الدليل (PDF)',
          margin: 'md',
        },
        {
          id: 'cmp_choices',
          type: 'choices',
          title: 'ما هو الإجراء الذي ترغب به للزر التفاعلي؟ (جرب التبديل الآن)',
          description: 'عند اختيار أي خيار، سيتغير أمر ونص ومظهر الزر المربوط (#btn_main) فوراً!',
          choiceType: 'radio',
          options: [
            { 
              id: 'opt_1', 
              label: 'تحميل ملف الدليل على جهازي فوراً', 
              value: 'download', 
              checked: false,
              targetButtonId: 'btn_main',
              buttonNewText: 'تحميل الدليل السريع (PDF) الآن 📥',
              buttonNewAction: 'download_file',
              buttonNewTarget: 'دليل_البدء_السريع_2026.pdf',
              buttonNewVariant: 'success'
            },
            { 
              id: 'opt_2', 
              label: 'الانتقال لصفحة مركز التحميل', 
              value: 'nav_downloads', 
              checked: true,
              targetButtonId: 'btn_main',
              buttonNewText: 'تصفح مركز التحميل والملفات ←',
              buttonNewAction: 'navigate_page',
              buttonNewTarget: 'page_downloads',
              buttonNewVariant: 'primary'
            },
            { 
              id: 'opt_3', 
              label: 'فتح رابط المنصة الخارجي', 
              value: 'open_url', 
              checked: false,
              targetButtonId: 'btn_main',
              buttonNewText: 'زيارة موقع المنصة الرسمي 🔗',
              buttonNewAction: 'open_url',
              buttonNewTarget: 'https://example.com',
              buttonNewVariant: 'outline'
            },
          ],
          margin: 'md',
        },
        {
          id: 'cmp_div_2',
          type: 'divider',
          style: 'dashed',
          thickness: '2px',
          color: '#334155',
          width: 'full',
          margin: 'md',
        },
        {
          id: 'cmp_list',
          type: 'list',
          listType: 'check',
          title: 'أهم مزايا موقعك مع NoklenWeb:',
          items: [
            { id: 'li_1', title: 'مكونات جاهزة ومرنة', description: 'فواصل، قوائم، أزرار، صور، ملفات والمزيد' },
            { id: 'li_2', title: 'تعدد الصفحات والتنقل السلس', description: 'انتقل بين الصفحات بضغطة زر دون إعادة تحميل' },
            { id: 'li_3', title: 'إدارة وتعديل الملفات البرمجية', description: 'تحكم مباشر في ملفات HTML و CSS و JS مع Firebase' },
            { id: 'li_4', title: 'تصدير واستيراد بنقرة واحدة', description: 'احفظ مشروعك كملف .noklen وتابعه في أي وقت' },
          ],
          margin: 'md',
        }
      ]
    },
    {
      id: 'page_downloads',
      title: 'مركز التحميل',
      slug: 'downloads',
      isHome: false,
      seoTitle: 'مركز التحميل والملفات | موقعي',
      seoDescription: 'تحميل الملفات والمستندات والبرامج',
      components: [
        {
          id: 'cmp_nav_d',
          type: 'navbar',
          brandName: 'NoklenWeb',
          brandTagline: 'مركز الملفات',
          links: [
            { id: 'nl_d1', label: 'الرئيسية', pageId: 'page_home' },
            { id: 'nl_d2', label: 'مركز التحميل', pageId: 'page_downloads' },
            { id: 'nl_d3', label: 'من نحن', pageId: 'page_about' },
          ],
          ctaText: 'الرئيسية',
          ctaAction: 'navigate_page',
          ctaTarget: 'page_home',
          margin: 'none',
        },
        {
          id: 'cmp_head_d',
          type: 'heading',
          level: 'h1',
          text: 'مركز تحميل الملفات والمستندات',
          subtitle: 'جميع الموارد والملفات جاهزة للتنزيل المباشر بروابط سريعة وآمنة.',
          align: 'center',
          margin: 'lg',
        },
        {
          id: 'cmp_f1',
          type: 'file_attachment',
          fileName: 'الحزمة_البرمجية_الكاملة.zip',
          description: 'ملف مضغوط يضم كافة الأكواد المصدرية والمكتبات ومكونات الواجهة للبدء مباشرة.',
          fileSize: '14.2 ميغابايت',
          fileType: 'zip',
          buttonText: 'تنزيل الحزمة (ZIP)',
          margin: 'md',
        },
        {
          id: 'cmp_f2',
          type: 'file_attachment',
          fileName: 'مستند_التوثيق_والإعداد.pdf',
          description: 'توثيق تقني شامل يوضح طريقة الربط السحابي مع Firebase وإعداد القواعد الأمنية.',
          fileSize: '2.8 ميغابايت',
          fileType: 'pdf',
          buttonText: 'تحميل التوثيق (PDF)',
          margin: 'md',
        },
        {
          id: 'cmp_div_d',
          type: 'divider',
          style: 'solid',
          thickness: '1px',
          color: '#334155',
          width: 'half',
          margin: 'lg',
        },
        {
          id: 'cmp_btn_back',
          type: 'button',
          text: '← العودة إلى الصفحة الرئيسية',
          actionType: 'navigate_page',
          targetPageId: 'page_home',
          variant: 'secondary',
          size: 'md',
          align: 'center',
          margin: 'md',
        }
      ]
    },
    {
      id: 'page_about',
      title: 'من نحن',
      slug: 'about',
      isHome: false,
      seoTitle: 'من نحن | موقعي',
      seoDescription: 'تعرف على رؤيتنا وفريق العمل',
      components: [
        {
          id: 'cmp_nav_a',
          type: 'navbar',
          brandName: 'NoklenWeb',
          brandTagline: 'من نحن',
          links: [
            { id: 'nl_a1', label: 'الرئيسية', pageId: 'page_home' },
            { id: 'nl_a2', label: 'مركز التحميل', pageId: 'page_downloads' },
            { id: 'nl_a3', label: 'من نحن', pageId: 'page_about' },
          ],
          ctaText: 'الرئيسية',
          ctaAction: 'navigate_page',
          ctaTarget: 'page_home',
          margin: 'none',
        },
        {
          id: 'cmp_head_a',
          type: 'heading',
          level: 'h1',
          text: 'رؤيتنا ورسالتنا',
          subtitle: 'نمكن المطورين والمبتدئين من إنشاء مواقع ويب احترافية بمرونة فائقة وتخصيص كود كامل.',
          align: 'center',
          margin: 'lg',
        },
        {
          id: 'cmp_p_a',
          type: 'paragraph',
          text: 'نهدف من خلال منصة NoklenWeb Builder إلى سد الفجوة بين البناء البصري السهل والمرن، وبين حرية كتابة الأكواد والربط مع الخدمات السحابية مثل Firebase. هنا لا توجد قيود على موقعك، فكل سطر كود وكل ملف تحت سيطرتك الكاملة.',
          align: 'center',
          size: 'lg',
          lead: true,
          margin: 'md',
        },
        {
          id: 'cmp_btn_to_home',
          type: 'button',
          text: 'الانتقال إلى الرئيسية',
          actionType: 'navigate_page',
          targetPageId: 'page_home',
          variant: 'primary',
          size: 'md',
          align: 'center',
          margin: 'lg',
        }
      ]
    }
  ]
};
