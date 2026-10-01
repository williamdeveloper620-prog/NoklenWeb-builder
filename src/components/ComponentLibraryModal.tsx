import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Split, 
  ListOrdered, 
  CheckSquare, 
  MousePointerClick, 
  Image as ImageIcon, 
  FileDown, 
  Heading1, 
  AlignLeft, 
  Compass, 
  CreditCard, 
  TextCursorInput,
  Sparkles,
  Plus,
  CheckCircle2,
  HelpCircle,
  BarChart2,
  Video,
  ExternalLink
} from 'lucide-react';
import { ComponentType } from '../types/builder';

interface ComponentLibraryModalProps {
  onClose: () => void;
  onAddComponent: (type: ComponentType) => void;
}

interface ComponentItem {
  type: ComponentType;
  title: string;
  enTitle: string;
  description: string;
  category: 'core' | 'interactive' | 'media' | 'content';
  badge?: string;
  badgeColor?: string;
  icon: React.ReactNode;
  tags: string[];
  previewSample: string;
}

const ALL_COMPONENTS: ComponentItem[] = [
  // Core / Layout
  {
    type: 'heading',
    title: 'عنوان رئيسي / فرعي',
    enTitle: 'Heading H1/H2/H3',
    description: 'عنوان جذاب مع تحكم كامل بالحجم، المحاذاة، واللون',
    category: 'content',
    badge: 'أساسي',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: <Heading1 className="w-5 h-5 text-blue-400" />,
    tags: ['عنوان', 'نص', 'h1', 'h2', 'ترويسة'],
    previewSample: 'أهلاً بكم في موقعنا الإلكتروني',
  },
  {
    type: 'paragraph',
    title: 'فقرة نصية توضيحية',
    enTitle: 'Paragraph / Description',
    description: 'كتلة نصية منسقة للقراءة بوضوح وسلاسة',
    category: 'content',
    badge: 'نصي',
    badgeColor: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
    icon: <AlignLeft className="w-5 h-5 text-neutral-300" />,
    tags: ['فقرة', 'نص', 'وصف', 'مقالة'],
    previewSample: 'نقدم حلولاً برمجية متكاملة تواكب تطلعاتكم وتساعدكم على النمو...',
  },
  {
    type: 'divider',
    title: 'فاصلة ومسافة',
    enTitle: 'Divider & Spacer',
    description: 'خط فاصل أفقي مع تنسيق مخصص ومسافات وعنوان اختياري في المنتصف',
    category: 'core',
    badge: 'تنسيق',
    badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    icon: <Split className="w-5 h-5 text-sky-400" />,
    tags: ['فاصلة', 'خط', 'مسافة', 'spacer', 'divider'],
    previewSample: '─── مميزاتنا الرئيسية ───',
  },
  {
    type: 'navbar',
    title: 'شريط تنقل علوي',
    enTitle: 'Navigation Header Bar',
    description: 'شريط علوي يحتوي على اسم موقعك وشعاره وروابط لجميع الصفحات',
    category: 'core',
    badge: 'هيدر',
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    icon: <Compass className="w-5 h-5 text-orange-400" />,
    tags: ['هيدر', 'تنقل', 'قائمة', 'navbar', 'menu'],
    previewSample: '[ Logo ]  الرئيسية  |  الخدمات  |  من نحن  [ زر تواصل ]',
  },

  // Interactive & Actions
  {
    type: 'button',
    title: 'زر تفاعلي وأوامر (مع معرف ID)',
    enTitle: 'Action Button with ID',
    description: 'زر للتنقل بين الصفحات، تحميل ملفات، فتح روابط خارجية، تشغيل تنبيهات، أو التفاعل بالأوامر',
    category: 'interactive',
    badge: 'تفاعلي',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    icon: <MousePointerClick className="w-5 h-5 text-indigo-400" />,
    tags: ['زر', 'أمر', 'رابط', 'تحميل', 'تنقل', 'button', 'id', 'action'],
    previewSample: '🔘 تصفح العروض الآن ← (ID: btn_action)',
  },
  {
    type: 'choices',
    title: 'اختيارات وخيارات متعددة',
    enTitle: 'Choices / Mutator Options',
    description: 'خيارات متعددة (Checkbox) أو مفردة (Radio) قادرة على تغيير نص وأمر وزر آخر ديناميكياً بمعرفه الفريد',
    category: 'interactive',
    badge: 'ديناميكي',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    icon: <CheckSquare className="w-5 h-5 text-purple-400" />,
    tags: ['اختيارات', 'خيارات', 'تصويت', 'poll', 'radio', 'checkbox', 'mutation'],
    previewSample: '☑ الخيار الأول  ☑ الخيار الثاني  ⚡ يغير زر التحميل تلقائياً',
  },
  {
    type: 'form_input',
    title: 'نموذج إدخال وتواصل',
    enTitle: 'Input Form / Feedback',
    description: 'حقل لجمع النصوص، الأسماء، أو البريد الإلكتروني مع زر إرسال وتنبيه',
    category: 'interactive',
    badge: 'نموذج',
    badgeColor: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
    icon: <TextCursorInput className="w-5 h-5 text-lime-400" />,
    tags: ['نموذج', 'إدخال', 'تواصل', 'form', 'email', 'input'],
    previewSample: '[ أدخل بريدك الإلكتروني... ]  [ اشتراك ]',
  },

  // Media & Attachments
  {
    type: 'image_with_caption',
    title: 'صورة مع وصف توضيحي',
    enTitle: 'Image with Caption Card',
    description: 'عرض صورة عالية الجودة مع عنوان توضيحي ونصوص منسقة وتأثيرات بصرية',
    category: 'media',
    badge: 'ميديا',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: <ImageIcon className="w-5 h-5 text-amber-400" />,
    tags: ['صورة', 'صورة مع وصف', 'معرض', 'تصميم', 'image'],
    previewSample: '🖼️ [صورة مميزة] + العنوان والوصف أسفلها',
  },
  {
    type: 'file_attachment',
    title: 'ملف مع وصف وزر تحميل',
    enTitle: 'File Attachment & Download',
    description: 'بطاقة ملف احترافية توضح اسم الملف، حجمه، نوعه، وزر تحميل مباشر للزائر',
    category: 'media',
    badge: 'تنزيل',
    badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    icon: <FileDown className="w-5 h-5 text-teal-400" />,
    tags: ['ملف', 'ملف مع وصف', 'تحميل', 'pdf', 'zip', 'مستند'],
    previewSample: '📄 دليل_المستخدم.pdf (2.4MB) [⬇ تحميل الآن]',
  },
  {
    type: 'list',
    title: 'قائمة نقطية أو مميزات',
    enTitle: 'Features / Bullet List',
    description: 'قائمة نقطية أو رقمية أو مميزات بعلامات صح خضراء لتعداد النقاط',
    category: 'content',
    badge: 'قائمة',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: <ListOrdered className="w-5 h-5 text-emerald-400" />,
    tags: ['قائمة', 'نقاط', 'مميزات', 'list', 'features'],
    previewSample: '✓ ميزة رقم 1  ✓ ميزة رقم 2  ✓ ميزة رقم 3',
  },
  {
    type: 'card',
    title: 'بطاقة محتوى متكاملة',
    enTitle: 'Content Card Box',
    description: 'صندوق أنيق يحتوي على شارة مميزة، عنوان، نص تفصيلي، وزر تفاعلي',
    category: 'content',
    badge: 'بطاقة',
    badgeColor: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    icon: <CreditCard className="w-5 h-5 text-pink-400" />,
    tags: ['بطاقة', 'صندوق', 'خدمة', 'card', 'box'],
    previewSample: '📦 خدمة البرمجة والتطوير | شارة خاصة | زر التفاصيل',
  },
];

export const ComponentLibraryModal: React.FC<ComponentLibraryModalProps> = ({
  onClose,
  onAddComponent,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'interactive' | 'media' | 'content'>('all');

  const filtered = ALL_COMPONENTS.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.enTitle.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const handleSelect = (type: ComponentType) => {
    onAddComponent(type);
    onClose();
  };

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
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>مكتبة المكونات المتاحة</span>
                <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                  {ALL_COMPONENTS.length} مكون
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                انقر على أي مكون لإضافته فوراً إلى الصفحة المفتوحة
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

        {/* Search & Categories Filter */}
        <div className="p-4 bg-neutral-950/90 border-b border-neutral-800 shrink-0 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-3 text-neutral-500" />
            <input
              type="text"
              placeholder="ابحث عن مكون (مثال: زر، فاصلة، صورة مع وصف، ملف مع وصف، اختيارات...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full bg-neutral-900 border border-neutral-700 focus:border-indigo-500 rounded-xl pr-9 pl-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none"
            />
          </div>

          {/* Categories Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              كافة المكونات ({ALL_COMPONENTS.length})
            </button>
            <button
              onClick={() => setActiveCategory('core')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeCategory === 'core'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              الهيكل والأساسيات
            </button>
            <button
              onClick={() => setActiveCategory('interactive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeCategory === 'interactive'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              التفاعل والأزرار والاختيارات
            </button>
            <button
              onClick={() => setActiveCategory('media')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeCategory === 'media'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              الوسائط والملفات
            </button>
            <button
              onClick={() => setActiveCategory('content')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeCategory === 'content'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              النصوص والقوائم
            </button>
          </div>
        </div>

        {/* Components Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((item) => (
            <div
              key={item.type}
              onClick={() => handleSelect(item.type)}
              className="p-3.5 rounded-xl bg-neutral-950/70 hover:bg-neutral-950 border border-neutral-800/80 hover:border-indigo-500/60 transition-all flex flex-col justify-between group cursor-pointer active:scale-[0.98] shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 group-hover:border-indigo-500/40 group-hover:bg-indigo-950/30 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {item.enTitle}
                      </span>
                    </div>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${item.badgeColor || 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'}`}>
                      {item.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                  {item.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-neutral-900 flex items-center justify-between text-xs">
                <span className="text-[11px] text-neutral-500 font-mono truncate max-w-[200px]">
                  {item.previewSample}
                </span>
                <button
                  type="button"
                  className="px-3 py-1 bg-indigo-600/30 group-hover:bg-indigo-600 text-indigo-300 group-hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة</span>
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-2 py-12 text-center text-neutral-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30 text-indigo-400" />
              <p className="text-xs font-medium">لم نجد مكوناً يطابق بحثك: "{search}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500 shrink-0">
          <span>💡 نصيحة: يمكنك أيضاً تعديل خصائص أي مكون بالضغط عليه في المحرر</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
