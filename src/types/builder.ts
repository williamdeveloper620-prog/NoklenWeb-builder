export type ComponentType =
  | 'divider'
  | 'list'
  | 'choices'
  | 'button'
  | 'image_with_caption'
  | 'file_attachment'
  | 'heading'
  | 'paragraph'
  | 'navbar'
  | 'card'
  | 'form_input';

export interface BaseComponentProps {
  id: string;
  type: ComponentType;
  customClass?: string;
  margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface DividerComponent extends BaseComponentProps {
  type: 'divider';
  style: 'solid' | 'dashed' | 'dotted' | 'gradient';
  thickness: '1px' | '2px' | '4px';
  color: string;
  width: 'full' | 'half' | 'quarter';
  hasLabel?: boolean;
  label?: string;
}

export interface ListItem {
  id: string;
  title: string;
  description?: string;
  link?: string;
  icon?: string;
}

export interface ListComponent extends BaseComponentProps {
  type: 'list';
  listType: 'bullet' | 'numbered' | 'check' | 'cards' | 'menu';
  title?: string;
  items: ListItem[];
}

export type ButtonActionType = 
  | 'navigate_page' 
  | 'open_url' 
  | 'download_file' 
  | 'alert_message' 
  | 'copy_text' 
  | 'scroll_to' 
  | 'toggle_element' 
  | 'firebase_submit' 
  | 'custom_js';

export interface ChoiceOption {
  id: string;
  label: string;
  value: string;
  checked?: boolean;
  // Dynamic button mutation when this choice is selected!
  targetButtonId?: string;
  buttonNewText?: string;
  buttonNewAction?: ButtonActionType;
  buttonNewTarget?: string;
  buttonNewVariant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
}

export interface ChoicesComponent extends BaseComponentProps {
  type: 'choices';
  title: string;
  description?: string;
  choiceType: 'radio' | 'checkbox' | 'select' | 'pills';
  options: ChoiceOption[];
  required?: boolean;
}

export interface ButtonComponent extends BaseComponentProps {
  type: 'button';
  buttonId?: string; // Custom identifier for cross-component wiring
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
  icon?: string;
}

export interface ImageWithCaptionComponent extends BaseComponentProps {
  type: 'image_with_caption';
  imageUrl: string;
  alt: string;
  caption: string;
  description: string;
  layout: 'below' | 'overlay' | 'card' | 'side';
  rounded: 'none' | 'md' | 'lg' | '2xl' | 'full';
  aspectRatio: '16/9' | '4/3' | '1/1' | 'auto';
  shadow: boolean;
}

export interface FileAttachmentComponent extends BaseComponentProps {
  type: 'file_attachment';
  fileName: string;
  description: string;
  fileSize: string;
  fileType: 'pdf' | 'zip' | 'code' | 'doc' | 'image' | 'audio';
  downloadUrl?: string;
  buttonText: string;
}

export interface HeadingComponent extends BaseComponentProps {
  type: 'heading';
  level: 'h1' | 'h2' | 'h3';
  text: string;
  subtitle?: string;
  align: 'right' | 'center' | 'left';
}

export interface ParagraphComponent extends BaseComponentProps {
  type: 'paragraph';
  text: string;
  align: 'right' | 'center' | 'left';
  size: 'sm' | 'base' | 'lg';
  lead?: boolean;
}

export interface NavbarLink {
  id: string;
  label: string;
  pageId?: string;
  url?: string;
}

export interface NavbarComponent extends BaseComponentProps {
  type: 'navbar';
  brandName: string;
  brandTagline?: string;
  links: NavbarLink[];
  ctaText?: string;
  ctaAction?: 'navigate_page' | 'open_url';
  ctaTarget?: string;
}

export interface CardComponent extends BaseComponentProps {
  type: 'card';
  title: string;
  description: string;
  badge?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonPageId?: string;
}

export interface FormInputComponent extends BaseComponentProps {
  type: 'form_input';
  label: string;
  placeholder: string;
  inputType: 'text' | 'email' | 'tel' | 'textarea';
  buttonText: string;
  successMessage: string;
}

export type BuilderComponent =
  | DividerComponent
  | ListComponent
  | ChoicesComponent
  | ButtonComponent
  | ImageWithCaptionComponent
  | FileAttachmentComponent
  | HeadingComponent
  | ParagraphComponent
  | NavbarComponent
  | CardComponent
  | FormInputComponent;

export interface Page {
  id: string;
  title: string;
  slug: string;
  isHome: boolean;
  components: BuilderComponent[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface VirtualFile {
  id: string;
  name: string;
  type: 'html' | 'css' | 'javascript' | 'json' | 'markdown';
  content: string;
  isSystem?: boolean;
  description?: string;
  lastModified: number;
}

export interface ProjectSettings {
  primaryColor: string;
  fontFamily: string;
  direction: 'rtl' | 'ltr';
  customHeaderScript?: string;
  firebaseEnabled?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  pages: Page[];
  activePageId: string;
  files: VirtualFile[];
  settings: ProjectSettings;
  createdAt: number;
  updatedAt: number;
  version: string;
}

export type ActiveTab = 'builder' | 'files' | 'preview';
export type ViewportMode = 'desktop' | 'tablet' | 'mobile';
