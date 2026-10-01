import JSZip from 'jszip';
import { Project } from '../types/builder';
import { generateFullWebsiteHtml } from './codeGenerator';

/**
 * Downloads a project as a .noklen JSON file
 */
export function exportProjectJson(project: Project) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
  const downloadAnchor = document.createElement('a');
  const filename = `${sanitizeFilename(project.name || 'noklen_project')}.noklen`;
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Packs all project files into a .zip archive and triggers download
 */
export async function exportProjectZip(project: Project): Promise<void> {
  const zip = new JSZip();

  // 1. Generate up-to-date index.html
  const htmlContent = generateFullWebsiteHtml(project);
  zip.file('index.html', htmlContent);

  // 2. Include all virtual files in the project
  project.files.forEach(file => {
    // If user edited index.html directly, keep their version unless empty
    if (file.name === 'index.html' && file.content.trim().length > 50) {
      zip.file('index.html', file.content);
    } else {
      zip.file(file.name, file.content);
    }
  });

  // 3. Include .noklen project metadata file inside zip for future re-import!
  zip.file('project.noklen', JSON.stringify(project, null, 2));

  // 4. Generate zip blob and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  const filename = `${sanitizeFilename(project.name || 'noklen_website')}.zip`;
  downloadAnchor.href = url;
  downloadAnchor.download = filename;
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Reads and parses an uploaded .noklen or .json file
 */
export function importProjectFile(file: File): Promise<Project> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        // Basic validation
        if (!parsed.pages || !Array.isArray(parsed.pages)) {
          throw new Error('الملف غير صالح: لا يحتوي على صفحات موقع.');
        }

        // Ensure IDs and fields exist
        const project: Project = {
          id: parsed.id || 'noklen_' + Date.now(),
          name: parsed.name || 'مشروع مستورد',
          description: parsed.description || '',
          pages: parsed.pages,
          activePageId: parsed.activePageId || parsed.pages[0]?.id || 'page_home',
          files: Array.isArray(parsed.files) ? parsed.files : [],
          settings: parsed.settings || {
            primaryColor: '#4f46e5',
            fontFamily: 'Cairo',
            direction: 'rtl',
            firebaseEnabled: true,
          },
          createdAt: parsed.createdAt || Date.now(),
          updatedAt: Date.now(),
          version: parsed.version || '1.0.0',
        };

        resolve(project);
      } catch (err: any) {
        reject(new Error('فشل قراءة ملف المشروع: ' + (err.message || 'تنسيق غير مدعوم')));
      }
    };
    reader.onerror = () => reject(new Error('حدث خطأ أثناء قراءة الملف من الجهاز.'));
    reader.readAsText(file);
  });
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_').substring(0, 50);
}
