import React, { useState, useEffect } from 'react';
import { 
  X, 
  Monitor, 
  Tablet, 
  Smartphone, 
  ExternalLink, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Download,
  Terminal,
  QrCode,
  Share2,
  Layers,
  Sparkles,
  Flame,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Sliders,
  Copy,
  Check,
  Globe
} from 'lucide-react';
import { Project, Page, ViewportMode } from '../types/builder';
import { ComponentRenderer } from './ComponentRenderer';
import { exportProjectZip } from '../utils/exportImport';

interface LivePreviewModalProps {
  project: Project;
  onClose: () => void;
}

interface ActionLogEntry {
  id: string;
  timestamp: string;
  type: 'click' | 'choice' | 'navigation' | 'download' | 'alert' | 'submit';
  message: string;
  details?: string;
}

type DevicePreset = 'iphone' | 'samsung' | 'compact' | 'tablet' | 'desktop' | 'fullscreen';

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({ project, onClose }) => {
  const [currentPageId, setCurrentPageId] = useState<string>(
    project.activePageId || project.pages[0]?.id || ''
  );
  const [devicePreset, setDevicePreset] = useState<DevicePreset>('desktop');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light' | 'oled'>('dark');
  const [navHistory, setNavHistory] = useState<string[]>([currentPageId]);
  const [showLogDrawer, setShowLogDrawer] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [actionLogs, setActionLogs] = useState<ActionLogEntry[]>([
    {
      id: 'init',
      timestamp: new Date().toLocaleTimeString('ar'),
      type: 'navigation',
      message: `تم تشغيل المعاينة الحية لصفحة: "${project.pages.find(p => p.id === currentPageId)?.title || 'الرئيسية'}"`,
    }
  ]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const activePage = project.pages.find((p) => p.id === currentPageId) || project.pages[0];

  const addLog = (type: ActionLogEntry['type'], message: string, details?: string) => {
    const newEntry: ActionLogEntry = {
      id: 'log_' + Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString('ar'),
      type,
      message,
      details,
    };
    setActionLogs((prev) => [newEntry, ...prev.slice(0, 40)]);
  };

  const handleNavigate = (pageId: string) => {
    if (!pageId) return;
    const targetPage = project.pages.find((p) => p.id === pageId || p.slug === pageId);
    if (targetPage) {
      setCurrentPageId(targetPage.id);
      setNavHistory((prev) => [...prev, targetPage.id]);
      addLog('navigation', `📄 الانتقال إلى صفحة "${targetPage.title}" (/${targetPage.slug})`);
    }
  };

  const handleGoBack = () => {
    if (navHistory.length > 1) {
      const newHistory = [...navHistory];
      newHistory.pop();
      const prevId = newHistory[newHistory.length - 1];
      setNavHistory(newHistory);
      setCurrentPageId(prevId);
      const targetPage = project.pages.find(p => p.id === prevId);
      if (targetPage) {
        addLog('navigation', `↩️ الرجوع إلى صفحة "${targetPage.title}"`);
      }
    }
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      addLog('download', '📦 جاري تصدير وتحزيم ملفات الموقع ZIP...');
      await exportProjectZip(project);
      addLog('download', '✓ تم تنزيل ملفات الموقع بنجاح');
    } catch (e: any) {
      addLog('alert', 'خطأ أثناء التحميل: ' + e.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopySimulatorUrl = () => {
    const url = `https://${project.name.toLowerCase().replace(/[\s\W-]+/g, '-')}.noklen.app/${activePage?.slug || ''}`;
    navigator.clipboard?.writeText?.(url);
    setCopiedLink(true);
    addLog('click', `📋 تم نسخ رابط الصفحة: ${url}`);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Compute Device dimensions based on preset and orientation
  const getDeviceStyle = () => {
    if (devicePreset === 'fullscreen') {
      return { width: '100%', maxWidth: '100%', minHeight: '100%' };
    }
    if (devicePreset === 'desktop') {
      return { width: '100%', maxWidth: '1080px', minHeight: '700px' };
    }
    if (devicePreset === 'tablet') {
      return orientation === 'portrait'
        ? { width: '768px', minHeight: '900px' }
        : { width: '1024px', minHeight: '650px' };
    }
    if (devicePreset === 'iphone') {
      return orientation === 'portrait'
        ? { width: '390px', minHeight: '820px' }
        : { width: '820px', minHeight: '390px' };
    }
    if (devicePreset === 'samsung') {
      return orientation === 'portrait'
        ? { width: '412px', minHeight: '860px' }
        : { width: '860px', minHeight: '412px' };
    }
    if (devicePreset === 'compact') {
      return orientation === 'portrait'
        ? { width: '360px', minHeight: '720px' }
        : { width: '720px', minHeight: '360px' };
    }
    return { width: '100%', maxWidth: '960px' };
  };

  const themeClasses = {
    dark: 'bg-neutral-900 text-neutral-100 border-neutral-800',
    light: 'bg-slate-50 text-slate-900 border-slate-300 shadow-xl',
    oled: 'bg-black text-neutral-100 border-neutral-900',
  }[previewTheme];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col select-none overflow-hidden font-sans">
      {/* Top Browser & Preview Controls Bar */}
      <div className="h-14 border-b border-neutral-800 bg-neutral-900 px-3 sm:px-4 flex items-center justify-between text-xs text-neutral-300 shrink-0 gap-2 z-20">
        {/* Left: Navigation & URL simulator */}
        <div className="flex items-center gap-2 flex-1 max-w-lg min-w-0">
          <div className="flex items-center gap-1 text-neutral-400">
            <button
              onClick={handleGoBack}
              disabled={navHistory.length <= 1}
              className="p-1.5 rounded-lg hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="الرجوع للصفحة السابقة"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const home = project.pages.find((p) => p.isHome) || project.pages[0];
                if (home) handleNavigate(home.id);
              }}
              className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="الصفحة الرئيسية"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div 
            onClick={handleCopySimulatorUrl}
            className="flex-1 bg-neutral-950 hover:bg-neutral-900/90 border border-neutral-800 rounded-full px-3 py-1.5 flex items-center justify-between font-mono text-[11px] text-neutral-400 min-w-0 cursor-pointer transition-colors"
            title="انقر لنسخ الرابط"
          >
            <span className="truncate">
              https://{project.name.toLowerCase().replace(/[\s\W-]+/g, '-')}.noklen.app/
              <span className="text-indigo-400 font-bold">{activePage?.slug || ''}</span>
            </span>
            <div className="flex items-center gap-1 shrink-0 ml-1">
              {copiedLink ? (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                  <Check className="w-3 h-3" /> تم
                </span>
              ) : (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded-full font-bold">
                  مباشر ●
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Device Presets, Orientation & Themes */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Device Model Switcher */}
          <div className="flex items-center gap-0.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setDevicePreset('iphone')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                devicePreset === 'iphone' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
              title="iPhone 16 Pro (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>iPhone</span>
            </button>
            <button
              onClick={() => setDevicePreset('samsung')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                devicePreset === 'samsung' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
              title="Samsung Galaxy S24 (412px)"
            >
              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
              <span>Galaxy</span>
            </button>
            <button
              onClick={() => setDevicePreset('tablet')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                devicePreset === 'tablet' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
              title="iPad Pro (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>iPad</span>
            </button>
            <button
              onClick={() => setDevicePreset('desktop')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                devicePreset === 'desktop' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
              title="كمبيوتر مكتبي (Desktop)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDevicePreset(devicePreset === 'fullscreen' ? 'desktop' : 'fullscreen')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                devicePreset === 'fullscreen' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="ملء الشاشة بالكامل"
            >
              {devicePreset === 'fullscreen' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Orientation Switcher */}
          {devicePreset !== 'desktop' && devicePreset !== 'fullscreen' && (
            <button
              onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
              className="p-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 rounded-xl border border-neutral-800 flex items-center gap-1 cursor-pointer transition-colors"
              title="تدوير الشاشة (أفقي / عمودي)"
            >
              <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px]">{orientation === 'portrait' ? 'عمودي' : 'أفقي'}</span>
            </button>
          )}

          {/* Theme switcher */}
          <div className="flex items-center gap-0.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setPreviewTheme('dark')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                previewTheme === 'dark' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="الوضع الداكن Dark"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewTheme('light')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                previewTheme === 'light' ? 'bg-neutral-800 text-amber-300 shadow-xs' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="الوضع الفاتح Light"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewTheme('oled')}
              className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                previewTheme === 'oled' ? 'bg-neutral-800 text-indigo-300 shadow-xs' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="شاشة OLED سوداء"
            >
              OLED
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-neutral-950 px-2 py-1 rounded-xl border border-neutral-800 text-[11px] font-mono">
            <button
              onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
              className="text-neutral-400 hover:text-white p-0.5"
              title="تصغير"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-neutral-300 min-w-[32px] text-center">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
              className="text-neutral-400 hover:text-white p-0.5"
              title="تكبير"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right Actions & EXIT BUTTON */}
        <div className="flex items-center gap-2">
          {/* Action Log Drawer Toggle */}
          <button
            onClick={() => setShowLogDrawer(!showLogDrawer)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              showLogDrawer
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
            title="سجل التفاعلات الحي"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">سجل التفاعلات</span>
            <span className="text-[10px] bg-neutral-800 text-neutral-300 px-1 rounded-full font-mono">
              {actionLogs.length}
            </span>
          </button>

          {/* Quick ZIP download */}
          <button
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="تحميل ملفات الموقع ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">تحميل ZIP</span>
          </button>

          {/* Big Prominent Exit Button */}
          <button
            onClick={onClose}
            className="px-3.5 sm:px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-950/60 min-h-[40px] active:scale-95 border border-rose-400/40"
            title="الخروج من المعاينة والعودة إلى محرر الموقع (اضغط Esc)"
          >
            <X className="w-4 h-4" />
            <span>خروج من المعاينة</span>
          </button>
        </div>
      </div>

      {/* Quick Page Navigation Bar (Tabs) */}
      <div className="bg-neutral-950/95 border-b border-neutral-800 px-3 py-1.5 flex items-center justify-between gap-2 overflow-x-auto text-xs shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="text-neutral-500 text-[11px] ml-1 shrink-0">الصفحات:</span>
          {project.pages.map((p) => (
            <button
              key={p.id}
              onClick={() => handleNavigate(p.id)}
              className={`px-3 py-1 rounded-lg text-xs transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                p.id === currentPageId
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <span>{p.title}</span>
              {p.isHome && <span className="text-[10px] text-amber-300 font-bold">★</span>}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-neutral-500 hidden md:inline font-mono">
            اضغط Esc للخروج
          </span>
          <button
            onClick={onClose}
            className="text-xs text-rose-400 hover:text-rose-300 font-bold px-2 py-0.5 rounded bg-rose-500/10 hover:bg-rose-500/20"
          >
            إغلاق ✕
          </button>
        </div>
      </div>

      {/* Main Interactive Surface */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 flex justify-center items-start bg-radial from-neutral-900/50 to-neutral-950 relative">
        <div
          style={{
            ...getDeviceStyle(),
            transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
            transformOrigin: 'top center',
          }}
          className={`transition-all duration-300 ${themeClasses} border rounded-2xl shadow-2xl min-h-full flex flex-col p-3 sm:p-6 md:p-8 relative mb-12`}
        >
          {activePage ? (
            <div className="space-y-4 flex-1">
              {activePage.components.map((component) => (
                <ComponentRenderer
                  key={component.id}
                  component={component}
                  isInteractivePreview={true}
                  pages={project.pages}
                  onNavigatePage={handleNavigate}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-neutral-500">لا توجد صفحة لعرضها</div>
          )}
        </div>

        {/* Floating Quick Exit Button in bottom-right corner */}
        <button
          onClick={onClose}
          className="fixed bottom-6 right-6 z-40 bg-neutral-900/95 hover:bg-rose-900 text-white border border-neutral-700 hover:border-rose-500 px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          title="العودة للمحرر"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-400" />
          <span>الخروج والعودة للمحرر</span>
        </button>
      </div>

      {/* Live Action Logs Drawer */}
      {showLogDrawer && (
        <div className="h-44 border-t border-neutral-800 bg-neutral-950 p-3 flex flex-col shrink-0 text-xs font-mono text-right select-text animate-in slide-in-from-bottom duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-neutral-400 mb-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-white text-xs">سجل التفاعلات والأحداث الحية (Console Log)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActionLogs([])}
                className="text-[11px] text-neutral-500 hover:text-neutral-300 cursor-pointer"
              >
                مسح السجل
              </button>
              <button
                onClick={() => setShowLogDrawer(false)}
                className="text-neutral-500 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {actionLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-2 text-[11px] py-0.5 border-b border-neutral-900">
                <span className="text-neutral-500 shrink-0">[{log.timestamp}]</span>
                <span className={`font-semibold ${
                  log.type === 'download' ? 'text-emerald-400' :
                  log.type === 'choice' ? 'text-purple-400' :
                  log.type === 'navigation' ? 'text-sky-400' : 'text-neutral-200'
                }`}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
