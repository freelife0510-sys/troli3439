// ═══════════════════════════════════════════════════════════
// TYPES CHO APP EDUAI EXPERT
// Tích hợp QĐ 3439 và CV 5512
// ═══════════════════════════════════════════════════════════

// ============ FILE DATA ============
export interface FileData {
  mimeType: string;
  data: string; // base64 string
  name: string;
}

// ============ LESSON INPUT ============
export interface LessonInput {
  grade: string;
  subject: string;
  topic: string;
  sourceFile?: FileData | null;
  frameworkFile?: FileData | null;
}

// ============ AI COMPETENCY FRAMEWORK (QĐ 3439) ============
export type AIPillar = 'data' | 'algorithm' | 'application' | 'ethics';
export type IntegrationLevel = 'reference' | 'partial' | 'complete';
export type CompetencyLevel = 'basic' | 'intermediate' | 'advanced';

export interface AICompetency {
  pillar: AIPillar;
  pillarName: string; // Vietnamese name
  specific: string;
  level: CompetencyLevel;
}

export interface IntegrationPoint {
  lessonContent: string;
  aiContent: string;
  integrationType: IntegrationLevel;
  integrationTypeName: string; // Liên hệ / Bộ phận / Toàn phần
  suggestedTools: string[];
  competencies: AICompetency[];
  studentActivities: string[];
}

// ============ RESPONSES ============
export interface AnalysisResponse {
  htmlContent: string;
  rawText: string;
  // Optional structured data (for future use)
  integrationPoints?: IntegrationPoint[];
  overallPotential?: 'high' | 'medium' | 'low';
}

export interface LessonPlanResponse {
  htmlContent: string;
}

// ============ APP STATE ============
export enum AppState {
  INPUT = 'INPUT',
  ANALYZING = 'ANALYZING',
  SHOW_ANALYSIS = 'SHOW_ANALYSIS',
  PLANNING = 'PLANNING',
  SHOW_PLAN = 'SHOW_PLAN',
}

// ============ HELPER CONSTANTS ============
export const PILLAR_NAMES: Record<AIPillar, string> = {
  data: 'Dữ liệu (Data Literacy)',
  algorithm: 'Thuật toán & Lập trình',
  application: 'Ứng dụng AI',
  ethics: 'Đạo đức & Xã hội'
};

export const INTEGRATION_LEVEL_NAMES: Record<IntegrationLevel, string> = {
  reference: 'Liên hệ',
  partial: 'Bộ phận',
  complete: 'Toàn phần'
};

export const AI_TOOLS = {
  textGeneration: ['ChatGPT', 'Gemini', 'Microsoft Copilot'],
  imageGeneration: ['Canva AI', 'Bing Image Creator', 'Leonardo.AI'],
  recognition: ['Google Lens', 'Shazam'],
  machineLearning: ['Teachable Machine', 'Quick, Draw!'],
  presentation: ['Canva', 'Gamma.app', 'Beautiful.ai'],
  translation: ['Google Translate', 'DeepL'],
  programming: ['Scratch', 'Blockly', 'Python (Replit)'],
  dataVisualization: ['Google Sheets', 'Canva Infographic']
};
