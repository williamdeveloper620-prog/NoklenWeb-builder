import React, { useState, useEffect } from 'react';
import { 
  Project, 
  Page, 
  BuilderComponent, 
  ComponentType, 
  ActiveTab, 
  ViewportMode, 
  VirtualFile 
} from './types/builder';
import { defaultProject, initialFiles } from './data/defaultProject';
import { generateFullWebsiteHtml } from './utils/codeGenerator';
import { exportProjectZip, exportProjectJson } from './utils/exportImport';

import { Header } from './components/Header';
import { ComponentPalette } from './components/ComponentPalette';
import { PagesManager } from './components/PagesManager';
import { Canvas } from './components/Canvas';
import { PropertyInspector } from './components/PropertyInspector';
import { FilesExplorer } from './components/FilesExplorer';
import { LivePreviewModal } from './components/LivePreviewModal';
import { ExportImportModal } from './components/ExportImportModal';
import { TemplatesModal } from './components/TemplatesModal';
import { MobileBottomNav, MobileTab } from './components/MobileBottomNav';
import { CreateButtonModal } from './components/CreateButtonModal';
import { PageManagerModal } from './components/PageManagerModal';
import { ComponentLibraryModal } from './components/ComponentLibraryModal';
import { MiniMenuModal } from './components/MiniMenuModal';
import { AboutDeveloperModal } from './components/AboutDeveloperModal';
import { ProjectsManagerModal } from './components/ProjectsManagerModal';
import { Check, Download, AlertCircle, Edit3, X, Trash2 } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'noklen_web_project_v1';

export default function App() {
  // Load initial project from localStorage or default template
  const [project, setProject] = useState<Project>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.pages && parsed.pages.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading saved project:', e);
    }
    return defaultProject;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('builder');
  const [mobileTab, setMobileTab] = useState<MobileTab>('canvas');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');

  // Mobile Bottom Sheet state: 'none' | 'add' | 'inspector' | 'pages'
  const [mobileSheet, setMobileSheet] = useState<'none' | 'add' | 'inspector' | 'pages'>('none');

  // Modals state
  const [showExportImportModal, setShowExportImportModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showLivePreviewModal, setShowLivePreviewModal] = useState(false);
  const [showPageManagerModal, setShowPageManagerModal] = useState(false);
  const [showComponentLibraryModal, setShowComponentLibraryModal] = useState(false);
  const [showCreateButtonModal, setShowCreateButtonModal] = useState(false);
  const [showMiniMenuModal, setShowMiniMenuModal] = useState(false);
  const [showAboutDeveloperModal, setShowAboutDeveloperModal] = useState(false);
  const [showProjectsManagerModal, setShowProjectsManagerModal] = useState(false);
  const [quickRenameModal, setQuickRenameModal] = useState<{ pageId: string; title: string } | null>(null);
  const [pageToDeleteModal, setPageToDeleteModal] = useState<Page | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Auto-save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(project));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [project]);

  // Current active page
  const activePage =
    project.pages.find((p) => p.id === project.activePageId) ||
    project.pages[0] ||
    defaultProject.pages[0];

  // Currently selected component
  const selectedComponent =
    activePage.components.find((c) => c.id === selectedComponentId) || null;

  // --- Page Operations ---
  const handleSelectPage = (pageId: string) => {
    setProject((prev) => ({
      ...prev,
      activePageId: pageId,
      updatedAt: Date.now(),
    }));
    setSelectedComponentId(null);
    setMobileSheet('none');
    setMobileTab('canvas');
  };

  const handleAddPage = (title: string) => {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-');
    const newPage: Page = {
      id: 'page_' + Date.now(),
      title,
      slug: slug || 'page-' + (project.pages.length + 1),
      isHome: project.pages.length === 0,
      components: [
        {
          id: 'c_h_' + Date.now(),
          type: 'heading',
          level: 'h1',
          text: title,
          subtitle: 'مرحباً بك في صفحة ' + title,
          align: 'center',
        },
        {
          id: 'c_btn_' + Date.now(),
          type: 'button',
          text: 'العودة للرئيسية',
          actionType: 'navigate_page',
          targetPageId: project.pages.find((p) => p.isHome)?.id || project.pages[0]?.id,
          variant: 'secondary',
          size: 'md',
          align: 'center',
        }
      ],
    };

    setProject((prev) => ({
      ...prev,
      pages: [...prev.pages, newPage],
      activePageId: newPage.id,
      updatedAt: Date.now(),
    }));
    showToast(`✓ تم إنشاء صفحة "${title}" بنجاح`);
    setMobileSheet('none');
  };

  const handleDeletePage = (pageId: string) => {
    const pageName = project.pages.find((p) => p.id === pageId)?.title || 'الصفحة';

    if (project.pages.length <= 1) {
      // If deleting the only remaining page, reset to a fresh clean home page
      const resetPage: Page = {
        id: 'page_' + Date.now(),
        title: 'الرئيسية',
        slug: 'home',
        isHome: true,
        components: [],
      };
      setProject((prev) => ({
        ...prev,
        pages: [resetPage],
        activePageId: resetPage.id,
        updatedAt: Date.now(),
      }));
      setSelectedComponentId(null);
      showToast(`✓ تم حذف محتوى صفحة "${pageName}" وضبط صفحة جديدة`);
      return;
    }

    setProject((prev) => {
      const filtered = prev.pages.filter((p) => p.id !== pageId);
      const newActive = prev.activePageId === pageId ? (filtered[0]?.id || '') : prev.activePageId;
      if (prev.pages.find((p) => p.id === pageId)?.isHome && filtered[0]) {
        filtered[0].isHome = true;
      }
      return {
        ...prev,
        pages: filtered,
        activePageId: newActive,
        updatedAt: Date.now(),
      };
    });
    setSelectedComponentId(null);
    showToast(`✓ تم حذف صفحة "${pageName}" بنجاح`);
  };

  const handleDuplicatePage = (pageId: string) => {
    const target = project.pages.find((p) => p.id === pageId);
    if (!target) return;

    const duplicated: Page = {
      ...target,
      id: 'page_' + Date.now(),
      title: target.title + ' (نسخة)',
      slug: target.slug + '-copy',
      isHome: false,
      components: target.components.map((c) => ({
        ...c,
        id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      })),
    };

    setProject((prev) => ({
      ...prev,
      pages: [...prev.pages, duplicated],
      activePageId: duplicated.id,
      updatedAt: Date.now(),
    }));
    showToast('تم نسخ الصفحة');
  };

  const handleSetHomePage = (pageId: string) => {
    setProject((prev) => ({
      ...prev,
      pages: prev.pages.map((p) => ({
        ...p,
        isHome: p.id === pageId,
      })),
      updatedAt: Date.now(),
    }));
    showToast('تم تعيين الصفحة كرئيسية');
  };

  const handleUpdatePageTitle = (pageId: string, newTitle: string) => {
    setProject((prev) => ({
      ...prev,
      pages: prev.pages.map((p) =>
        p.id === pageId ? { ...p, title: newTitle } : p
      ),
      updatedAt: Date.now(),
    }));
    showToast(`✓ تم تغيير اسم الصفحة إلى "${newTitle}"`);
  };

  const handleReorderPages = (newPages: Page[]) => {
    setProject((prev) => ({
      ...prev,
      pages: newPages,
      updatedAt: Date.now(),
    }));
  };

  const handleUpdatePageSettings = (
    pageId: string,
    settings: { slug?: string; seoTitle?: string; seoDescription?: string }
  ) => {
    setProject((prev) => ({
      ...prev,
      pages: prev.pages.map((p) =>
        p.id === pageId ? { ...p, ...settings } : p
      ),
      updatedAt: Date.now(),
    }));
    showToast('✓ تم حفظ إعدادات الصفحة');
  };

  const handleCreateCustomButton = (buttonData: {
    buttonId: string;
    text: string;
    actionType: any;
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
  }) => {
    const id = 'cmp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const newButton: BuilderComponent = {
      id,
      type: 'button',
      ...buttonData,
    };

    setProject((prev) => ({
      ...prev,
      pages: prev.pages.map((page) => {
        if (page.id !== activePage.id) return page;
        return {
          ...page,
          components: [...page.components, newButton],
        };
      }),
      updatedAt: Date.now(),
    }));

    setSelectedComponentId(id);
    setShowCreateButtonModal(false);
    showToast(`✓ تم إنشاء الزر "${buttonData.text}" بنجاح بالمعرف #${buttonData.buttonId}`);
    setMobileSheet('none');
  };

  // --- Component Operations ---
  const handleAddComponent = (type: ComponentType) => {
    // When adding a button, open modal to specify what's written on it and its ID!
    if (type === 'button') {
      setShowCreateButtonModal(true);
      return;
    }

    const id = 'cmp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    let newComponent: BuilderComponent;

    switch (type) {
      case 'divider':
        newComponent = {
          id,
          type: 'divider',
          style: 'solid',
          thickness: '1px',
          color: '#334155',
          width: 'full',
          hasLabel: false,
        };
        break;

      case 'list':
        newComponent = {
          id,
          type: 'list',
          title: 'قائمة المميزات',
          listType: 'check',
          items: [
            { id: '1', title: 'ميزة متطورة وسريعة', description: 'وصف تفصيلي يشرح الميزة' },
            { id: '2', title: 'تصميم متوافق مع كافة الشاشات', description: 'يعمل على الهواتف والأجهزة اللوحية' },
          ],
        };
        break;

      case 'choices':
        newComponent = {
          id,
          type: 'choices',
          title: 'ما رأيك في الموقع؟',
          description: 'اختر الإجابة المناسبة',
          choiceType: 'checkbox',
          options: [
            { id: 'o1', label: 'تحميل الدليل المجاني الآن', value: 'opt1', checked: true, targetButtonId: 'btn_1', buttonNewText: 'تنزيل الدليل المجاني', buttonNewAction: 'download_file', buttonNewTarget: 'guide.pdf', buttonNewVariant: 'success' },
            { id: 'o2', label: 'فتح رابط المنصة الخارجية', value: 'opt2', checked: false, targetButtonId: 'btn_1', buttonNewText: 'زيارة موقع المنصة', buttonNewAction: 'open_url', buttonNewTarget: 'https://example.com', buttonNewVariant: 'primary' },
            { id: 'o3', label: 'الانتقال لصفحة التحميلات', value: 'opt3', checked: false, targetButtonId: 'btn_1', buttonNewText: 'مشاهدة الملفات', buttonNewAction: 'navigate_page', buttonNewTarget: project.pages[1]?.id || project.pages[0]?.id, buttonNewVariant: 'secondary' },
          ],
        };
        break;

      case 'image_with_caption':
        newComponent = {
          id,
          type: 'image_with_caption',
          imageUrl:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
          alt: 'صورة توضيحية',
          caption: 'عنوان توضيحي للصورة',
          description: 'شرح تفصيلي لما تعبر عنه هذه الصورة في الموقع لإثراء تجربة الزائر.',
          layout: 'card',
          rounded: 'lg',
          aspectRatio: '16/9',
          shadow: true,
        };
        break;

      case 'file_attachment':
        newComponent = {
          id,
          type: 'file_attachment',
          fileName: 'مستند_المشروع_الرسمي.pdf',
          description: 'تحميل الدليل الشامل والمستندات المصاحبة برابط تنزيل مباشر وآمن.',
          fileSize: '4.5 ميغابايت',
          fileType: 'pdf',
          buttonText: 'تحميل الملف (PDF)',
        };
        break;

      case 'heading':
        newComponent = {
          id,
          type: 'heading',
          level: 'h2',
          text: 'عنوان قسم رئيسي جديد',
          subtitle: 'وصف أو تمهيد لما يتضمنه هذا القسم',
          align: 'center',
        };
        break;

      case 'paragraph':
        newComponent = {
          id,
          type: 'paragraph',
          text: 'هذا النص يمكن تعديله ليعبر عن أهدافك ومحتوى موقعك بطريقة واضحة ومباشرة للمستخدمين.',
          align: 'center',
          size: 'base',
        };
        break;

      case 'navbar':
        newComponent = {
          id,
          type: 'navbar',
          brandName: 'NoklenWeb',
          brandTagline: 'موقعي الذكي',
          links: project.pages.map((p) => ({
            id: 'l_' + p.id,
            label: p.title,
            pageId: p.id,
          })),
          ctaText: 'تواصل معنا',
          ctaAction: 'navigate_page',
        };
        break;

      case 'card':
        newComponent = {
          id,
          type: 'card',
          title: 'بطاقة خدمة مميزة',
          description: 'نقدم حلولاً متكاملة لتطوير المواقع والربط مع الخدمات السحابية وقواعد البيانات.',
          badge: 'مميز',
          buttonText: 'المزيد من التفاصيل',
        };
        break;

      case 'form_input':
        newComponent = {
          id,
          type: 'form_input',
          label: 'انضم لنشرتنا البريدية',
          placeholder: 'أدخل بريدك الإلكتروني...',
          inputType: 'email',
          buttonText: 'اشتراك',
          successMessage: 'شكراً لانضمامك إلينا!',
        };
        break;

      default:
        return;
    }

    setProject((prev) => ({
      ...prev,
      pages: prev.pages.map((p) =>
        p.id === activePage.id
          ? { ...p, components: [...p.components, newComponent] }
          : p
      ),
      updatedAt: Date.now(),
    }));

    setSelectedComponentId(id);
    setMobileSheet('none');
    setMobileTab('canvas');
    showToast('✓ تمت إضافة المكون إلى صفحتك');
  };

  const handleUpdateComponent = (updated: BuilderComponent) => {
    setProject((prev) => ({
      ...prev,
      pages: prev.pages.map((p) =>
        p.id === activePage.id
          ? {
              ...p,
              components: p.components.map((c) => (c.id === updated.id ? updated : c)),
            }
          : p
      ),
      updatedAt: Date.now(),
    }));
  };

  const handleDeleteComponent = (id: string) => {
    setProject((prev) => ({
      ...prev,
      pages: prev.pages.map((p) =>
        p.id === activePage.id
          ? { ...p, components: p.components.filter((c) => c.id !== id) }
          : p
      ),
      updatedAt: Date.now(),
    }));
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
      setMobileSheet('none');
    }
    showToast('تم حذف المكون');
  };

  const handleDuplicateComponent = (id: string) => {
    const original = activePage.components.find((c) => c.id === id);
    if (!original) return;

    const duplicated: BuilderComponent = {
      ...original,
      id: 'cmp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    };

    const index = activePage.components.findIndex((c) => c.id === id);
    const newComponents = [...activePage.components];
    newComponents.splice(index + 1, 0, duplicated);

    setProject((prev) => ({
      ...prev,
      pages: prev.pages.map((p) =>
        p.id === activePage.id ? { ...p, components: newComponents } : p
      ),
      updatedAt: Date.now(),
    }));

    setSelectedComponentId(duplicated.id);
    showToast('تم تكرار المكون');
  };

  const handleMoveUpComponent = (index: number) => {
    if (index <= 0) return;
    const newComponents = [...activePage.components];
    const temp = newComponents[index - 1];
    newComponents[index - 1] = newComponents[index];
    newComponents[index] = temp;

    setProject((prev) => ({
      ...prev,
      pages: prev.pages.map((p) =>
        p.id === activePage.id ? { ...p, components: newComponents } : p
      ),
      updatedAt: Date.now(),
    }));
  };

  const handleMoveDownComponent = (index: number) => {
    if (index >= activePage.components.length - 1) return;
    const newComponents = [...activePage.components];
    const temp = newComponents[index + 1];
    newComponents[index + 1] = newComponents[index];
    newComponents[index] = temp;

    setProject((prev) => ({
      ...prev,
      pages: prev.pages.map((p) =>
        p.id === activePage.id ? { ...p, components: newComponents } : p
      ),
      updatedAt: Date.now(),
    }));
  };

  // --- Virtual Files Operations ---
  const handleUpdateFile = (fileId: string, newContent: string) => {
    setProject((prev) => ({
      ...prev,
      files: prev.files.map((f) =>
        f.id === fileId ? { ...f, content: newContent, lastModified: Date.now() } : f
      ),
      updatedAt: Date.now(),
    }));
    showToast('✓ تم حفظ الملف البرمجي');
  };

  const handleCreateFile = (name: string, content: string = '') => {
    const newFile: VirtualFile = {
      id: 'file_' + Date.now(),
      name,
      type: name.endsWith('.css')
        ? 'css'
        : name.endsWith('.html')
        ? 'html'
        : name.endsWith('.json')
        ? 'json'
        : 'javascript',
      content,
      isSystem: false,
      lastModified: Date.now(),
    };

    setProject((prev) => ({
      ...prev,
      files: [...prev.files, newFile],
      updatedAt: Date.now(),
    }));
    showToast(`✓ تم إنشاء الملف ${name}`);
  };

  const handleDeleteFile = (fileId: string) => {
    setProject((prev) => ({
      ...prev,
      files: prev.files.filter((f) => f.id !== fileId),
      updatedAt: Date.now(),
    }));
    showToast('تم حذف الملف');
  };

  const handleSyncGeneratedHtml = () => {
    const generatedHtml = generateFullWebsiteHtml(project);
    setProject((prev) => ({
      ...prev,
      files: prev.files.map((f) =>
        f.name === 'index.html'
          ? { ...f, content: generatedHtml, lastModified: Date.now() }
          : f
      ),
      updatedAt: Date.now(),
    }));
    showToast('✓ تم تحديث index.html من المحرر');
  };

  // Direct 1-tap ZIP download
  const handleDownloadZipDirect = async () => {
    try {
      showToast('📦 جاري تحزيم وتنزيل ملفات الموقع كـ ZIP...');
      await exportProjectZip(project);
      showToast('🎉 تم تنزيل حزمة الموقع ZIP بنجاح!');
    } catch (e: any) {
      alert('خطأ أثناء التحميل: ' + e.message);
    }
  };

  // Direct 1-tap .noklen download
  const handleDownloadJsonDirect = () => {
    try {
      exportProjectJson(project);
      showToast('💾 تم حفظ ملف المشروع (.noklen) على جهازك!');
    } catch (e: any) {
      alert('خطأ أثناء الحفظ: ' + e.message);
    }
  };

  // Handle Mobile Bottom Nav Tab Click
  const handleSelectMobileTab = (tab: MobileTab) => {
    setMobileTab(tab);
    if (tab === 'canvas') {
      setActiveTab('builder');
      setMobileSheet('none');
    } else if (tab === 'add') {
      setActiveTab('builder');
      setMobileSheet('add');
    } else if (tab === 'pages') {
      setActiveTab('builder');
      setMobileSheet('pages');
    } else if (tab === 'inspector') {
      setActiveTab('builder');
      setMobileSheet('inspector');
    } else if (tab === 'files') {
      setActiveTab('files');
      setMobileSheet('none');
    }
  };

  // Start a fresh new project
  const handleStartNewBlankProject = () => {
    const now = Date.now();
    const newProj: Project = {
      id: 'proj_' + now,
      name: 'مشروعي الجديد',
      description: 'موقع ويب جديد مبني بواسطة NoklenWeb Builder V0.1.2',
      createdAt: now,
      updatedAt: now,
      version: '0.1.2',
      settings: {
        primaryColor: '#4f46e5',
        fontFamily: 'Cairo, sans-serif',
        direction: 'rtl',
      },
      activePageId: 'page_home',
      pages: [
        {
          id: 'page_home',
          title: 'الرئيسية',
          slug: 'home',
          isHome: true,
          components: [
            {
              id: 'c_heading_' + now,
              type: 'heading',
              text: 'أهلاً بكم في موقعنا الجديد',
              level: 'h1',
              align: 'center',
              subtitle: 'تم بناء هذا الموقع باستخدام NoklenWeb Builder V0.1.2',
            },
            {
              id: 'c_btn_' + now,
              type: 'button',
              text: 'تصفح الخدمات والمميزات',
              variant: 'primary',
              size: 'md',
              align: 'center',
              buttonId: 'btn_main',
              actionType: 'alert_message',
              alertText: 'مرحباً بك! يمكنك تخصيص هذا الموقع وتنزيله كملف ZIP بالكامل.',
            },
          ],
        },
      ],
      files: initialFiles,
    };
    setProject(newProj);
    setSelectedComponentId(null);
    showToast('✨ تم بدء مشروع جديد بنجاح!');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans">
      {/* 3-Zone Header */}
      <Header
        project={project}
        activeTab={activeTab}
        setActiveTab={(t) => {
          setActiveTab(t);
          setMobileTab(t === 'files' ? 'files' : 'canvas');
          setMobileSheet('none');
        }}
        onOpenExportImport={() => setShowExportImportModal(true)}
        onOpenTemplates={() => setShowTemplatesModal(true)}
        onDownloadZip={handleDownloadZipDirect}
        onOpenFirebaseHelper={() => {
          setActiveTab('files');
          setMobileTab('files');
          setMobileSheet('none');
        }}
        onOpenPageManager={() => setShowPageManagerModal(true)}
        onOpenMiniMenu={() => setShowMiniMenuModal(true)}
        onOpenAboutDev={() => setShowAboutDeveloperModal(true)}
      />

      {/* Main Content Area based on Active Tab */}
      <div className="flex-1 flex overflow-hidden relative">
        {activeTab === 'builder' && (
          <>
            {/* Desktop Left Sidebar: Pages Manager + Component Palette */}
            <div className="hidden lg:flex w-72 bg-neutral-900 border-l border-neutral-800 flex-col shrink-0">
              <PagesManager
                pages={project.pages}
                activePageId={activePage.id}
                onSelectPage={handleSelectPage}
                onAddPage={handleAddPage}
                onDeletePage={handleDeletePage}
                onDuplicatePage={handleDuplicatePage}
                onSetHomePage={handleSetHomePage}
                onUpdatePageTitle={handleUpdatePageTitle}
                onUpdatePageSettings={handleUpdatePageSettings}
                onOpenFullModal={() => setShowPageManagerModal(true)}
              />
              <div className="flex-1 overflow-hidden">
                <ComponentPalette onAddComponent={handleAddComponent} />
              </div>
            </div>

            {/* Center Canvas (Full-width on mobile!) */}
            <Canvas
              project={project}
              activePage={activePage}
              selectedComponentId={selectedComponentId}
              viewportMode={viewportMode}
              onSetViewportMode={setViewportMode}
              onSelectComponent={(id) => {
                setSelectedComponentId(id);
              }}
              onDeleteComponent={handleDeleteComponent}
              onDuplicateComponent={handleDuplicateComponent}
              onMoveUpComponent={handleMoveUpComponent}
              onMoveDownComponent={handleMoveDownComponent}
              onAddComponent={handleAddComponent}
              onNavigatePage={handleSelectPage}
              onOpenLivePreview={() => setShowLivePreviewModal(true)}
              onOpenInspectorMobile={() => setMobileSheet('inspector')}
              onDownloadZip={handleDownloadZipDirect}
              onDownloadProjectJson={handleDownloadJsonDirect}
              onOpenPageManager={() => setShowPageManagerModal(true)}
              onDuplicateCurrentPage={() => handleDuplicatePage(activePage.id)}
              onDeleteCurrentPage={() => setPageToDeleteModal(activePage)}
              onRenameCurrentPage={() => setQuickRenameModal({ pageId: activePage.id, title: activePage.title })}
              onOpenComponentLibrary={() => setShowComponentLibraryModal(true)}
            />

            {/* Desktop Right Sidebar: Property Inspector */}
            <div className="hidden lg:block w-80 bg-neutral-900 border-r border-neutral-800 shrink-0">
              <PropertyInspector
                component={selectedComponent}
                pages={project.pages}
                onUpdateComponent={handleUpdateComponent}
                onDeleteComponent={handleDeleteComponent}
                onDeselect={() => setSelectedComponentId(null)}
              />
            </div>
          </>
        )}

        {activeTab === 'files' && (
          <div className="flex-1 h-full">
            <FilesExplorer
              project={project}
              files={project.files}
              onUpdateFile={handleUpdateFile}
              onCreateFile={handleCreateFile}
              onDeleteFile={handleDeleteFile}
              onSyncGeneratedHtml={handleSyncGeneratedHtml}
            />
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="flex-1 h-full">
            <LivePreviewModal
              project={project}
              onClose={() => {
                setActiveTab('builder');
                setMobileTab('canvas');
              }}
            />
          </div>
        )}

        {/* Mobile Slide-Up Bottom Sheet for Adding Components */}
        {mobileSheet === 'add' && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end">
            <div className="bg-neutral-900 rounded-t-3xl max-h-[80vh] flex flex-col border-t border-neutral-700 shadow-2xl animate-in slide-in-from-bottom duration-200">
              <ComponentPalette
                onAddComponent={handleAddComponent}
                onCloseMobile={() => setMobileSheet('none')}
              />
            </div>
          </div>
        )}

        {/* Mobile Slide-Up Bottom Sheet for Pages Manager */}
        {mobileSheet === 'pages' && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end">
            <div className="bg-neutral-900 rounded-t-3xl max-h-[75vh] flex flex-col border-t border-neutral-700 shadow-2xl animate-in slide-in-from-bottom duration-200">
              <PagesManager
                pages={project.pages}
                activePageId={activePage.id}
                onSelectPage={handleSelectPage}
                onAddPage={handleAddPage}
                onDeletePage={handleDeletePage}
                onDuplicatePage={handleDuplicatePage}
                onSetHomePage={handleSetHomePage}
                onUpdatePageTitle={handleUpdatePageTitle}
                onUpdatePageSettings={handleUpdatePageSettings}
                onOpenFullModal={() => {
                  setMobileSheet('none');
                  setShowPageManagerModal(true);
                }}
                onCloseMobile={() => setMobileSheet('none')}
              />
            </div>
          </div>
        )}

        {/* Mobile Slide-Up Bottom Sheet for Component Inspector */}
        {mobileSheet === 'inspector' && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end">
            <div className="bg-neutral-900 rounded-t-3xl max-h-[85vh] flex flex-col border-t border-neutral-700 shadow-2xl animate-in slide-in-from-bottom duration-200">
              <PropertyInspector
                component={selectedComponent}
                pages={project.pages}
                onUpdateComponent={handleUpdateComponent}
                onDeleteComponent={handleDeleteComponent}
                onDeselect={() => {
                  setSelectedComponentId(null);
                  setMobileSheet('none');
                }}
                onCloseMobile={() => setMobileSheet('none')}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={mobileTab}
        onSelectTab={handleSelectMobileTab}
        hasSelectedComponent={!!selectedComponentId}
        pageCount={project.pages.length}
        onOpenPreview={() => setShowLivePreviewModal(true)}
        onDirectDownloadZip={handleDownloadZipDirect}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 border border-neutral-700 text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      {showPageManagerModal && (
        <PageManagerModal
          pages={project.pages}
          activePageId={activePage.id}
          onClose={() => setShowPageManagerModal(false)}
          onSelectPage={handleSelectPage}
          onAddPage={handleAddPage}
          onDeletePage={handleDeletePage}
          onDuplicatePage={handleDuplicatePage}
          onSetHomePage={handleSetHomePage}
          onUpdatePageTitle={handleUpdatePageTitle}
          onReorderPages={handleReorderPages}
          onUpdatePageSettings={handleUpdatePageSettings}
        />
      )}

      {showCreateButtonModal && (
        <CreateButtonModal
          pages={project.pages}
          activePageId={activePage.id}
          existingButtonIds={project.pages.flatMap(p => p.components).filter(c => c.type === 'button').map(b => (b as any).buttonId || b.id)}
          onClose={() => setShowCreateButtonModal(false)}
          onCreateButton={handleCreateCustomButton}
        />
      )}

      {quickRenameModal && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 select-none">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm p-4 text-right space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                <span>تعديل اسم الصفحة</span>
              </h4>
              <button onClick={() => setQuickRenameModal(null)} className="text-neutral-500 hover:text-white">✕</button>
            </div>
            <div>
              <label className="block text-neutral-400 text-xs mb-1">اسم الصفحة:</label>
              <input
                type="text"
                value={quickRenameModal.title}
                onChange={(e) => setQuickRenameModal({ ...quickRenameModal, title: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && quickRenameModal.title.trim()) {
                    handleUpdatePageTitle(quickRenameModal.pageId, quickRenameModal.title.trim());
                    setQuickRenameModal(null);
                  }
                }}
                autoFocus
                className="w-full bg-neutral-950 border border-indigo-500 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none"
              />
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button
                onClick={() => setQuickRenameModal(null)}
                className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (quickRenameModal.title.trim()) {
                    handleUpdatePageTitle(quickRenameModal.pageId, quickRenameModal.title.trim());
                    setQuickRenameModal(null);
                  }
                }}
                className="px-5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
              >
                حفظ الاسم
              </button>
            </div>
          </div>
        </div>
      )}

      {pageToDeleteModal && (
        <div 
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 select-none"
          onClick={() => setPageToDeleteModal(null)}
        >
          <div 
            className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm p-5 text-right space-y-3.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-rose-400">
              <Trash2 className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">تأكيد حذف الصفحة</h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف صفحة <strong className="text-white font-bold">"{pageToDeleteModal.title}"</strong>؟ سيتم حذف جميع المكونات بداخلها.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setPageToDeleteModal(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeletePage(pageToDeleteModal.id);
                  setPageToDeleteModal(null);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                نعم، حذف الصفحة
              </button>
            </div>
          </div>
        </div>
      )}

      {showMiniMenuModal && (
        <MiniMenuModal
          project={project}
          onClose={() => setShowMiniMenuModal(false)}
          onOpenProjects={() => setShowProjectsManagerModal(true)}
          onStartNewProject={handleStartNewBlankProject}
          onOpenAboutDev={() => setShowAboutDeveloperModal(true)}
          onOpenTemplates={() => setShowTemplatesModal(true)}
          onOpenExportImport={() => setShowExportImportModal(true)}
          onDownloadZip={handleDownloadZipDirect}
        />
      )}

      {showAboutDeveloperModal && (
        <AboutDeveloperModal
          onClose={() => setShowAboutDeveloperModal(false)}
        />
      )}

      {showProjectsManagerModal && (
        <ProjectsManagerModal
          currentProject={project}
          onClose={() => setShowProjectsManagerModal(false)}
          onLoadProject={(loaded) => {
            setProject(loaded);
            setSelectedComponentId(null);
            showToast(`✓ تم فتح مشروع "${loaded.name}" بنجاح!`);
          }}
          onStartNewProject={handleStartNewBlankProject}
          onOpenExportImport={() => setShowExportImportModal(true)}
        />
      )}

      {showComponentLibraryModal && (
        <ComponentLibraryModal
          onClose={() => setShowComponentLibraryModal(false)}
          onAddComponent={handleAddComponent}
        />
      )}

      {showExportImportModal && (
        <ExportImportModal
          project={project}
          onImportProject={(imported) => {
            setProject(imported);
            setSelectedComponentId(null);
            showToast('✓ تم استيراد المشروع بنجاح!');
          }}
          onClose={() => setShowExportImportModal(false)}
        />
      )}

      {showTemplatesModal && (
        <TemplatesModal
          onSelectTemplate={(templateProject) => {
            setProject(templateProject);
            setSelectedComponentId(null);
            showToast('✓ تم تطبيق القالب بنجاح');
          }}
          onClose={() => setShowTemplatesModal(false)}
        />
      )}

      {showLivePreviewModal && (
        <LivePreviewModal
          project={project}
          onClose={() => setShowLivePreviewModal(false)}
        />
      )}
    </div>
  );
}
