
export enum QuestionType {
  MCQ = 'MCQ',
  SHORT_ANSWER = 'SHORT_ANSWER',
  TRUE_FALSE = 'TRUE_FALSE',
  ESSAY = 'ESSAY',
  LONG_ANSWER = 'LONG_ANSWER',
  FILL_BLANK = 'FILL_BLANK',
  MATCHING = 'MATCHING'
}

export enum Difficulty {
  SIMPLE = 'Simple',
  MEDIUM = 'Medium',
  HARD = 'Hard',
  CONCEPTUAL = 'Conceptual',
  IMPORTANT = 'Important'
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For MCQ
  answer?: string; // Correct answer
  difficulty: Difficulty;
  notes?: string;
  pairs?: {left: string, right: string}[]; // For matching
}

export interface ExamConfig {
  examName: string;
  subtitle: string;
  studentNamePlaceholder: boolean;
  watermarkText: string;
  watermarkOpacity: number;
  mcqCount: number;
  shortCount: number;
  essayCount: number;
  longAnswerCount: number;
  tfCount: number;
  fillCount: number;
  matchingCount: number;
  difficulty: Difficulty;
  topicFocus: string;
  // PDF Styling Options
  headerFontSize: number;
  showLogo: boolean;
  pdfFontTheme: 'Modern' | 'Classic' | 'Elegant';
}

export interface GeneratedExam {
  questions: Question[];
  timestamp: number;
}

export interface UploadedFile {
  name: string;
  type: string;
  data: string; // Base64 or Text
  mimeType: string;
}

// Global interface for Mammoth
declare global {
  interface Window {
    mammoth: any;
    jspdf: any;
  }
}