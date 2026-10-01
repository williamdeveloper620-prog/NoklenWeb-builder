import React, { useState } from 'react';
import { 
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
  Search,
  Plus
} from 'lucide-react';
import { ComponentType } from '../types/builder';

interface PaletteItem {
  type: ComponentType;
  label: string;
  enLabel: string;
  description: string;
  icon: React.ReactNode;
  category: 'core' | 'content' | 'interactive';
  badge?: string;
}

const PALETTE_ITEMS: PaletteItem[] = [
  // The explicitly requested 6 components
  {
    type: 'divider',
    label: 'فاصلة',
    enLabel: 'Divider / Spacer',
    description: 'خط فاصل أفقي مع تنسيق مخصص ومسافات وعنوان اختياري',
    icon: <Split className="w-4 h-4 text-sky-400" />,
    category: 'core',
    badge: 'أساسي',
  },
  {
    type: 'list',
    label: 'قائمة',
    enLabel: 'List / Features',
    description: 'قائمة نقطية، مرقمة، أو قائمة مميزات بعلامات صح',
    icon: <ListOrdered className="w-4 h-4 text-emerald-400" />,
    category: 'core',
    badge: 'أساسي',
  },
  {
    type: 'choices',
    label: 'اختيارات',
    enLabel: 'Choices / Poll',
    description: 'مجموعة خيارات متعددة (Checkbox)، اختيار وحيد (Radio)، أو استبيان',
    icon: <CheckSquare className="w-4 h-4 text-purple-400" />,
    category: 'interactive',
    badge: 'تفاعلي',
  },
  {
    type: 'button',
    label: 'زر',
    enLabel: 'Button / Action',
    description: 'زر تفاعلي للتنقل بين الصفحات، فتح روابط، أو تشغيل أوامر',
    icon: <MousePointerClick className="w-4 h-4 text-indigo-400" />,
    category: 'interactive',
    badge: 'تنقل',
  },
  {
    type: 'image_with_caption',
    label: 'صورة مع وصف',
    enLabel: 'Image with Caption',
    description: 'عرض صورة عالية الدقة مع عنوان ووصف توضيحي جذاب',
    icon: <ImageIcon className="w-4 h-4 text-amber-400" />,
    category: 'content',
    badge: 'ميديا',
  },
  {
    type: 'file_attachment',
    label: 'ملف مع وصف',
    enLabel: 'File Download Card',
    description: 'بطاقة ملف للتحميل تشمل اسم الملف وحجمه ووصفه وزر التنزيل',
    icon: <FileDown className="w-4 h-4 text-teal-400" />,
    category: 'content',
    badge: 'تحميل',
  },

  // Additional rich blocks
  {
    type: 'heading',
    label: 'عنوان رئيسي',
    enLabel: 'Heading',
    description: 'عنوان H1 أو H2 أو H3 مع نص فرعي ومحاذاة مرنة',
    icon: <Heading1 className="w-4 h-4 text-blue-400" />,
    category: 'content',
  },
  {
    type: 'paragraph',
    label: 'فقرة نصية',
    enLabel: 'Paragraph',
    description: 'كتلة نصية منسقة للقراءة مع دعم لأحجام وأوزان مختلفة',
    icon: <AlignLeft className="w-4 h-4 text-neutral-400" />,
    category: 'content',
  },
  {
    type: 'navbar',
    label: 'شريط تنقل علوي',
    enLabel: 'Navigation Bar',
    description: 'شريط ترويسة يحتوي على اسم الموقع وروابط للتنقل بين صفحاتك',
    icon: <Compass className="w-4 h-4 text-orange-400" />,
    category: 'core',
  },
  {
    type: 'card',
    label: 'بطاقة محتوى',
    enLabel: 'Content Card',
    description: 'صندوق يحتوي على عنوان ووصف وشارة وزر إجراء',
    icon: <CreditCard className="w-4 h-4 text-pink-400" />,
    category: 'content',
  },
  {
    type: 'form_input',
    label: 'حقل إدخال ونموذج',
    enLabel: 'Input Form',
    description: 'حقل لجمع النصوص أو البريد الإلكتروني مع زر إرسال',
    icon: <TextCursorInput className="w-4 h-4 text-lime-400" />,
    category: 'interactive',
  },
];

interface ComponentPaletteProps {
  onAddComponent: (type: ComponentType) => void;
  onCloseMobile?: () => void;
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({ onAddComponent, onCloseMobile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'content' | 'interactive'>('all');

  const filteredItems = PALETTE_ITEMS.filter((item) => {
    const matchesSearch =
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.enLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full bg-neutral-900 border-l border-neutral-800 select-none">
      {/* Mobile drag handle if rendered inside bottom sheet */}
      {onCloseMobile && (
        <div className="pt-2 pb-1 flex flex-col items-center border-b border-neutral-800/60 lg:hidden">
          <div className="w-10 h-1.5 bg-neutral-700 rounded-full mb-2" />
          <div className="w-full px-4 flex items-center justify-between">
            <span className="text-sm font-bold text-white">إضافة مكون جديد</span>
            <button
              onClick={onCloseMobile}
              className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-800"
            >
              إغلاق ✕
            </button>
          </div>
        </div>
      )}

      {/* Search Header */}
      <div className="p-3 border-b border-neutral-800">
        <div className="text-xs font-bold text-neutral-300 mb-2 flex items-center justify-between">
          <span>مكتبة المكونات</span>
          <span className="text-[11px] text-neutral-500 font-normal">انقر للإضافة الفورية</span>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute right-2.5 top-2.5 text-neutral-500" />
          <input
            type="text"
            placeholder="ابحث عن مكون (زر، فاصلة، ملف...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pr-9 pl-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Categories Segmented Control */}
        <div className="flex items-center gap-1 mt-2.5 bg-neutral-950 p-1 rounded-lg border border-neutral-800/80">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors min-h-[36px] flex items-center justify-center ${
              activeCategory === 'all' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setActiveCategory('core')}
            className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors min-h-[36px] flex items-center justify-center ${
              activeCategory === 'core' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            أساسي
          </button>
          <button
            onClick={() => setActiveCategory('content')}
            className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors min-h-[36px] flex items-center justify-center ${
              activeCategory === 'content' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            محتوى
          </button>
          <button
            onClick={() => setActiveCategory('interactive')}
            className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors min-h-[36px] flex items-center justify-center ${
              activeCategory === 'interactive' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            تفاعلي
          </button>
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-24 lg:pb-3">
        {filteredItems.map((item) => (
          <button
            key={item.type}
            onClick={() => {
              onAddComponent(item.type);
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full text-right p-3 rounded-xl bg-neutral-950/70 hover:bg-neutral-800/80 active:bg-neutral-800 border border-neutral-800/70 hover:border-indigo-500/50 transition-all flex items-start gap-3 group active:scale-[0.98] min-h-[56px] cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 group-hover:border-indigo-500/30 shrink-0 mt-0.5">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="text-xs font-bold text-neutral-100 group-hover:text-indigo-300 transition-colors">
                  {item.label}
                </span>
                {item.badge && (
                  <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded font-mono">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 leading-snug">
                {item.description}
              </p>
            </div>
            <div className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 group-hover:text-white group-hover:bg-indigo-600 shrink-0 self-center transition-colors">
              <Plus className="w-4 h-4" />
            </div>
          </button>
        ))}

        {filteredItems.length === 0 && (
          <div className="p-6 text-center text-xs text-neutral-500">
            لا توجد مكونات مطابقة لبحثك
          </div>
        )}
      </div>
    </div>
  );
};
