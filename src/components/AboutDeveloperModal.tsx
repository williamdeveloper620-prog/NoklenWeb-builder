import React from 'react';
import { 
  X, 
  Gamepad2, 
  Globe, 
  Code2, 
  Sparkles, 
  Heart, 
  Award, 
  Layers, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  Coffee, 
  User, 
  FolderGit2, 
  Smartphone, 
  FileCode2,
  Terminal
} from 'lucide-react';

interface AboutDeveloperModalProps {
  onClose: () => void;
}

export const AboutDeveloperModal: React.FC<AboutDeveloperModalProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-right shadow-2xl relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner with Gradient */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-indigo-950 via-neutral-900 to-purple-950 border-b border-neutral-800 shrink-0 overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-10 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700/50 transition-colors cursor-pointer z-10"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Developer Identity Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 relative z-10 text-center sm:text-right">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-xl shadow-indigo-600/30 shrink-0">
              <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center text-white text-3xl font-black">
                🐱
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Catdev / إبراهيم
                </h2>
                <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-mono font-bold">
                  NoklenWeb Builder V0.1.2
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-indigo-400 mb-2.5 flex-wrap">
                <span className="flex items-center gap-1 bg-neutral-950/70 px-2.5 py-1 rounded-lg border border-neutral-800">
                  <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>مطور ألعاب</span>
                </span>
                <span className="flex items-center gap-1 bg-neutral-950/70 px-2.5 py-1 rounded-lg border border-neutral-800">
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  <span>مطور مواقع ووردبريس (WordPress)</span>
                </span>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed max-w-lg">
                شغوف بابتكار الحلول البرمجية الذكية وصناعة تجارب رقمية فائقة السرعة تجمع بين متعة الألعاب ومرونة مواقع الويب الحديثة.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Main Motivation Box: سبب صناعة هذا الموقع */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-purple-950/40 border border-indigo-500/40 relative overflow-hidden shadow-lg">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0 mt-0.5">
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-extrabold text-white mb-1.5 flex items-center gap-1.5">
                  <span>🎯 سبب صناعة هذا الموقع</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    الرؤية والهدف
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
                  "لتسهيل صناعة المواقع لأقصى درجة مع الحفاظ على جميع الميزات في برمجة المواقع."
                </p>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  تم تصميم NoklenWeb Builder ليمنحك الحرية الكاملة لإنشاء صفحات ويب متعددة، وربط الأزرار بالأوامر التفاعلية، وتنزيل ملفات كود HTML/CSS/JS جاهزة للتشغيل الفوري بدون تعقيدات استضافة أو قيود أدوات الـ No-Code التقليدية.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Skillsets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Game Dev Details */}
            <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/90 hover:border-purple-500/40 transition-colors">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">تطوير وبرمجة الألعاب</h4>
                  <span className="text-[10px] text-neutral-500 font-mono">Game Mechanics & Logic</span>
                </div>
              </div>
              <ul className="text-xs text-neutral-400 space-y-1.5 list-disc list-inside">
                <li>بناء أنظمة تفاعل وميكانيكيات لعب متقدمة.</li>
                <li>تحسين الأداء وسلاسة الإطارات (60+ FPS).</li>
                <li>تكامل المؤثرات الصوتية والبصرية التفاعلية.</li>
              </ul>
            </div>

            {/* WordPress Details */}
            <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/90 hover:border-sky-500/40 transition-colors">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">مواقع ووردبريس ومتاجر</h4>
                  <span className="text-[10px] text-neutral-500 font-mono">Custom WordPress & WooCommerce</span>
                </div>
              </div>
              <ul className="text-xs text-neutral-400 space-y-1.5 list-disc list-inside">
                <li>تخصيص قوالب وإضافات ووردبريس احترافية.</li>
                <li>متاجر إلكترونية متكاملة سريعة وآمنة.</li>
                <li>تحسين محركات البحث (SEO) وتجربة المستخدم.</li>
              </ul>
            </div>
          </div>

          {/* NoklenWeb Builder Features in V0.1.2 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950/90 border border-neutral-800">
            <h4 className="text-xs sm:text-sm font-extrabold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>ما يقدمه لك NoklenWeb Builder (الإصدار V0.1.2)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-900/60 border border-neutral-800/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>تحكم كامل بالجوال 100% وشاشات اللمس</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-900/60 border border-neutral-800/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>مكتبة مكونات (+) ذكية بنقرة واحدة</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-900/60 border border-neutral-800/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>معاينة حية تفاعلية تحاكي أجهزة حقيقية</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-900/60 border border-neutral-800/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>ربط الأزرار والخيارات الديناميكية بالمعرفات (IDs)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-900/60 border border-neutral-800/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>تصدير ملفات الموقع كاملة كملف ZIP جاهز للرفع</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-900/60 border border-neutral-800/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>حفظ محلي تلقائي مستمر لمشاريعك</span>
              </div>
            </div>
          </div>

          {/* Appreciation Message */}
          <div className="p-4 rounded-2xl bg-neutral-950/50 border border-neutral-800/60 flex items-center justify-between gap-3 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
              <span>صُنع بشغف وإتقان لجميع المطورين والمبدعين.</span>
            </div>
            <span className="font-mono text-indigo-400 font-bold">Catdev © 2026</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-neutral-500 font-mono">
            NoklenWeb Builder • V0.1.2
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer active:scale-95"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
