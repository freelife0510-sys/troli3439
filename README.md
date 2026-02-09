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

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

GEMINI_API_KEY=PLACEHOLDER_API_KEY

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

import React, { useState } from 'react';
import { AppState, LessonInput, AnalysisResponse, LessonPlanResponse } from './types';
import { analyzeLessonIntegration, generateLessonPlan } from './geminiService';
import InputForm from './components/InputForm';
import AnalysisResult from './components/AnalysisResult';
import LessonPlanResult from './components/LessonPlanResult';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [inputData, setInputData] = useState<LessonInput | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [planResult, setPlanResult] = useState<LessonPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputSubmit = async (data: LessonInput) => {
    setInputData(data);
    setAppState(AppState.ANALYZING);
    setError(null);
    try {
      const result = await analyzeLessonIntegration(data);
      setAnalysisResult(result);
      setAppState(AppState.SHOW_ANALYSIS);
    } catch (err) {
      setError("Không thể kết nối với AI. Vui lòng thử lại sau.");
      setAppState(AppState.INPUT);
    }
  };

  const handleGeneratePlan = async () => {
    if (!inputData || !analysisResult) return;
    
    setAppState(AppState.PLANNING);
    setError(null);
    try {
      // Pass the raw text of analysis as context for the next step
      const result = await generateLessonPlan(inputData, analysisResult.rawText);
      setPlanResult(result);
      setAppState(AppState.SHOW_PLAN);
    } catch (err) {
      setError("Có lỗi khi tạo giáo án. Vui lòng thử lại.");
      setAppState(AppState.SHOW_ANALYSIS);
    }
  };

  const handleReset = () => {
    setAppState(AppState.INPUT);
    setInputData(null);
    setAnalysisResult(null);
    setPlanResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
             </div>
             <div>
               <h1 className="text-xl font-bold text-gray-900 leading-none">EduAI Expert</h1>
               <span className="text-xs text-gray-500 font-medium">Hỗ trợ dạy học 3439 & 5512</span>
             </div>
          </div>
          <div className="hidden sm:block">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100">
              Phiên bản thử nghiệm
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Step Indicator */}
        <div className="max-w-3xl mx-auto mb-8 print:hidden">
          <div className="flex items-center justify-between relative">
             <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
             
             {/* Step 1 */}
             <div className={`flex flex-col items-center bg-gray-50 px-2 transition-all ${appState === AppState.INPUT || appState === AppState.ANALYZING ? 'scale-105' : ''}`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${appState !== AppState.INPUT && appState !== AppState.ANALYZING ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}>
                 1
               </div>
               <span className="text-xs font-medium text-gray-600 mt-1">Thông tin</span>
             </div>

             {/* Step 2 */}
             <div className={`flex flex-col items-center bg-gray-50 px-2 transition-all ${appState === AppState.SHOW_ANALYSIS ? 'scale-105' : ''}`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300
                 ${appState === AppState.INPUT || appState === AppState.ANALYZING ? 'bg-gray-300 text-gray-600' : ''}
                 ${appState === AppState.SHOW_ANALYSIS || appState === AppState.PLANNING ? 'bg-blue-600 text-white' : ''}
                 ${appState === AppState.SHOW_PLAN ? 'bg-green-500 text-white' : ''}
               `}>
                 2
               </div>
               <span className="text-xs font-medium text-gray-600 mt-1">Phân tích</span>
             </div>

             {/* Step 3 */}
             <div className={`flex flex-col items-center bg-gray-50 px-2 transition-all ${appState === AppState.SHOW_PLAN ? 'scale-105' : ''}`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300
                  ${appState === AppState.SHOW_PLAN ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}
               `}>
                 3
               </div>
               <span className="text-xs font-medium text-gray-600 mt-1">KHBD 5512</span>
             </div>
          </div>
        </div>

        {/* Views */}
        {(appState === AppState.INPUT || appState === AppState.ANALYZING) && (
          <InputForm onSubmit={handleInputSubmit} isLoading={appState === AppState.ANALYZING} />
        )}

        {(appState === AppState.SHOW_ANALYSIS || appState === AppState.PLANNING) && analysisResult && (
          <AnalysisResult 
            analysis={analysisResult} 
            onGeneratePlan={handleGeneratePlan} 
            onReset={handleReset}
            isGeneratingPlan={appState === AppState.PLANNING}
          />
        )}

        {appState === AppState.SHOW_PLAN && planResult && (
          <LessonPlanResult plan={planResult} onReset={handleReset} />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 EduAI Assistant. Phát triển cho cộng đồng giáo viên Việt Nam.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;

import { GoogleGenAI } from "@google/genai";
import { LessonInput, AnalysisResponse, LessonPlanResponse } from "./types";

const SYSTEM_INSTRUCTION = `
Bạn là "Trợ lý Chuyên gia Giáo dục & Công nghệ AI" (EduAI Expert). Nhiệm vụ của bạn là hỗ trợ giáo viên Việt Nam thực hiện tích hợp kiến thức AI theo Quyết định 3439/QĐ-BGDĐT và soạn Kế hoạch bài dạy (KHBD) theo Công văn 5512/BGDĐT-GDTrH.

═══════════════════════════════════════════════════════════
I. KHUNG NĂNG LỰC AI THEO QUYẾT ĐỊNH 3439/QĐ-BGDĐT
═══════════════════════════════════════════════════════════

1. TRỤ CỘT 1: DỮ LIỆU (Data Literacy)
   a) Thu thập dữ liệu:
      - Nhận biết các nguồn dữ liệu (text, hình ảnh, âm thanh, video)
      - Hiểu cách dữ liệu được thu thập và lưu trữ
      - Ví dụ hoạt động: Cho HS thu thập dữ liệu thời tiết của lớp trong 1 tuần
   
   b) Xử lý dữ liệu:
      - Phân loại, sắp xếp, lọc dữ liệu
      - Làm sạch dữ liệu (xử lý thiếu, sai)
      - Ví dụ hoạt động: Dùng Google Sheets để lọc và phân loại dữ liệu khảo sát
   
   c) Trực quan hóa dữ liệu:
      - Biểu đồ cột, đường, tròn, bản đồ nhiệt
      - Sử dụng công cụ: Google Charts, Canva Infographic
      - Ví dụ hoạt động: Tạo infographic về thống kê môi trường địa phương

2. TRỤ CỘT 2: THUẬT TOÁN & LẬP TRÌNH (Algorithmic & Computational Thinking)
   a) Tư duy logic:
      - Phân tích bài toán thành các bước nhỏ
      - Nhận diện pattern và quy luật
      - Ví dụ hoạt động: Viết thuật toán giải quyết vấn đề thực tế bằng flowchart
   
   b) Lập trình cơ bản:
      - Scratch, Blockly cho học sinh nhỏ
      - Python cơ bản cho THCS-THPT
      - Ví dụ hoạt động: Lập trình chatbot đơn giản với Scratch
   
   c) Hiểu cách máy tính "học":
      - Khái niệm huấn luyện mô hình
      - Input → Process → Output
      - Ví dụ hoạt động: Dùng Teachable Machine để huấn luyện mô hình phân loại ảnh

3. TRỤ CỘT 3: ỨNG DỤNG AI (AI Applications)
   a) AI tạo sinh (Generative AI):
      - Tạo văn bản: ChatGPT, Gemini, Copilot
      - Tạo hình ảnh: Canva AI, Bing Image Creator, Leonardo.AI
      - Ví dụ hoạt động: Dùng AI viết outline bài thuyết trình, HS biên tập lại
   
   b) AI nhận diện (Recognition AI):
      - Nhận diện hình ảnh: Google Lens
      - Nhận diện giọng nói: Dictation, Speech-to-Text
      - Ví dụ hoạt động: Dùng Google Lens để nhận diện loài thực vật
   
   c) AI trợ giúp học tập:
      - Dịch thuật: Google Translate
      - Tóm tắt: AI summary tools
      - Ví dụ hoạt động: So sánh bản dịch AI với bản dịch của HS

4. TRỤ CỘT 4: ĐẠO ĐỨC & XÃ HỘI (Ethics & Social Impact)
   a) An toàn trực tuyến:
      - Bảo vệ thông tin cá nhân
      - Nhận diện lừa đảo trực tuyến
      - Ví dụ hoạt động: Thảo luận case study về rò rỉ dữ liệu
   
   b) Fake news & Deepfake:
      - Kiểm chứng thông tin (fact-checking)
      - Nhận diện nội dung giả mạo
      - Ví dụ hoạt động: Phân tích một tin fake news và cách xác minh
   
   c) AI có trách nhiệm:
      - Thiên kiến (bias) trong AI
      - Tác động của AI đến việc làm, xã hội
      - Ví dụ hoạt động: Debate về "AI sẽ thay thế con người?"

═══════════════════════════════════════════════════════════
II. CẤU TRÚC KHBD THEO CÔNG VĂN 5512/BGDĐT-GDTrH
═══════════════════════════════════════════════════════════

Mẫu KHBD phải gồm các phần:

1. THÔNG TIN CHUNG:
   - Tên bài dạy, Môn học, Lớp
   - Thời gian thực hiện (số tiết)
   
2. MỤC TIÊU:
   a) Kiến thức: Nội dung HS cần nắm được
   b) Năng lực:
      - Năng lực đặc thù của môn học
      - Năng lực chung (tự chủ, giao tiếp, hợp tác...)
      - ⭐ NĂNG LỰC AI/KỸ NĂNG SỐ (theo QĐ 3439)
   c) Phẩm chất: Chăm chỉ, trung thực, trách nhiệm...

3. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU:
   - Giáo viên chuẩn bị: SGK, tài liệu, công cụ AI...
   - Học sinh chuẩn bị: Thiết bị, tài khoản AI (nếu cần)

4. TIẾN TRÌNH DẠY HỌC (4 hoạt động):

   📌 HOẠT ĐỘNG 1: MỞ ĐẦU (Xác định vấn đề/nhiệm vụ học tập)
   - Mục tiêu: Tạo hứng thú, kết nối kiến thức
   - Nội dung: Tình huống/câu hỏi khởi động
   - Sản phẩm: Câu trả lời/dự đoán của HS
   - Tổ chức: Cách GV hướng dẫn
   
   📌 HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI
   - Mục tiêu: HS chiếm lĩnh kiến thức mới
   - Nội dung: Các đơn vị kiến thức cần hình thành
   - Sản phẩm: Ghi chép, bài tập, sản phẩm nhóm...
   - Tổ chức: Phương pháp dạy học (⭐ TÍCH HỢP AI Ở ĐÂY)
   
   📌 HOẠT ĐỘNG 3: LUYỆN TẬP
   - Mục tiêu: Củng cố, rèn luyện kỹ năng
   - Nội dung: Bài tập/câu hỏi luyện tập
   - Sản phẩm: Bài làm của HS
   - Tổ chức: Hình thức luyện tập (⭐ CÓ THỂ DÙNG AI HỖ TRỢ)
   
   📌 HOẠT ĐỘNG 4: VẬN DỤNG
   - Mục tiêu: HS áp dụng vào thực tiễn
   - Nội dung: Bài tập/dự án liên hệ thực tế
   - Sản phẩm: Sản phẩm sáng tạo của HS
   - Tổ chức: Hướng dẫn thực hiện (⭐ ƯU TIÊN DÙNG AI GIẢI QUYẾT VẤN ĐỀ)

═══════════════════════════════════════════════════════════
III. MỨC ĐỘ TÍCH HỢP AI
═══════════════════════════════════════════════════════════

1. LIÊN HỆ (Thấp): Đề cập AI như ví dụ minh họa, không thực hành
   Ví dụ: "ChatGPT cũng có thể viết thơ như chúng ta đang học"

2. BỘ PHẬN (Trung bình): 1 phần của bài học sử dụng AI
   Ví dụ: Dùng Google Translate hỗ trợ dịch 1 đoạn văn trong bài đọc hiểu

3. TOÀN PHẦN (Cao): AI là công cụ chính xuyên suốt bài học
   Ví dụ: Dự án tạo chatbot hỏi đáp kiến thức môn học bằng AI

═══════════════════════════════════════════════════════════
IV. CÔNG CỤ AI KHUYẾN NGHỊ (Miễn phí/Phổ biến tại VN)
═══════════════════════════════════════════════════════════

🔹 AI Tạo văn bản: ChatGPT (free), Gemini, Microsoft Copilot
🔹 AI Tạo hình ảnh: Canva AI, Bing Image Creator, Leonardo.AI
🔹 AI Nhận diện: Google Lens, Shazam (âm nhạc)
🔹 AI Học máy: Teachable Machine, Quick, Draw!
🔹 AI Trình bày: Canva, Gamma.app, Beautiful.ai
🔹 AI Dịch thuật: Google Translate, DeepL
🔹 Lập trình: Scratch, Blockly, Python (Replit)
🔹 Trực quan dữ liệu: Google Sheets, Canva Infographic

═══════════════════════════════════════════════════════════
V. QUY TẮC TRẢ LỜI
═══════════════════════════════════════════════════════════

1. Sử dụng giọng văn sư phạm, chuẩn mực tiếng Việt
2. Luôn đưa ra gợi ý CỤ THỂ, KHẢ THI trong điều kiện Việt Nam
3. Công cụ AI gợi ý phải AN TOÀN, MIỄN PHÍ hoặc phổ biến
4. Mô tả chi tiết CÁCH HƯỚNG DẪN HS sử dụng AI (prompt mẫu, các bước)
5. Kết quả trả về dạng HTML (không cần <html>, <body>, chỉ nội dung)
6. Sử dụng <table>, <th>, <td>, <ul>, <li>, <strong>, <h2>, <h3> hợp lý
7. Dùng emoji và màu sắc để highlight phần tích hợp AI
8. Luôn nhắc nhở đây là GỢI Ý, GV cần điều chỉnh phù hợp thực tế
`;

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key chưa được cấu hình. Vui lòng kiểm tra biến môi trường GEMINI_API_KEY.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeLessonIntegration = async (input: LessonInput): Promise<AnalysisResponse> => {
  const ai = getClient();

  let promptText = `
═══════════════════════════════════════════════════════════
PHÂN TÍCH ĐỊA CHỈ TÍCH HỢP AI TRONG BÀI HỌC
═══════════════════════════════════════════════════════════

📚 THÔNG TIN BÀI HỌC:
- Cấp học/Khối lớp: ${input.grade}
- Môn học: ${input.subject}
- Bài học/Chủ đề: ${input.topic}
`;

  if (input.sourceFile) {
    promptText += `\n📎 Có đính kèm tài liệu nguồn: ${input.sourceFile.name}. Hãy phân tích kỹ nội dung này.`;
  }
  if (input.frameworkFile) {
    promptText += `\n📎 Có đính kèm PPCT/Khung 3439: ${input.frameworkFile.name}. Tuân thủ chặt chẽ hướng dẫn này.`;
  }

  promptText += `

═══════════════════════════════════════════════════════════
YÊU CẦU PHÂN TÍCH (Trả về định dạng HTML):
═══════════════════════════════════════════════════════════

1️⃣ BẢNG PHÂN TÍCH ĐỊA CHỈ TÍCH HỢP
Tạo bảng <table> với các cột:
| STT | Nội dung bài học | Nội dung AI tích hợp | Năng lực AI (theo 4 trụ cột 3439) | Mức độ (Liên hệ/Bộ phận/Toàn phần) | Công cụ AI gợi ý | Hoạt động của HS |

Lưu ý:
- Cột "Năng lực AI" phải ghi rõ thuộc trụ cột nào (Dữ liệu/Thuật toán/Ứng dụng AI/Đạo đức)
- Cột "Hoạt động của HS" mô tả CỤ THỂ học sinh sẽ làm gì với công cụ AI
- Mỗi bài nên có ít nhất 2-3 điểm tích hợp

2️⃣ TÓM TẮT NĂNG LỰC AI ĐƯỢC PHÁT TRIỂN
Tạo danh sách các năng lực AI cụ thể mà bài học này sẽ giúp HS phát triển, nhóm theo 4 trụ cột.

3️⃣ GỢI Ý PROMPT/CÁCH HƯỚNG DẪN HS
Với mỗi công cụ AI được gợi ý, đưa ra:
- Prompt mẫu (nếu là AI tạo sinh)
- Các bước thực hiện cụ thể
- Lưu ý khi sử dụng

4️⃣ ĐÁNH GIÁ TIỀM NĂNG TÍCH HỢP
- Điểm tiềm năng: Cao/Trung bình/Thấp
- Nhận xét ngắn gọn về khả năng ứng dụng AI trong bài này
- Khuyến nghị cho giáo viên

5️⃣ LƯU Ý VỀ ĐẠO ĐỨC AI
Nêu các lưu ý về an toàn, đạo đức khi học sinh sử dụng AI trong bài học này.
`;

  const parts: any[] = [{ text: promptText }];

  if (input.sourceFile) {
    parts.push({
      inlineData: {
        mimeType: input.sourceFile.mimeType,
        data: input.sourceFile.data
      }
    });
  }
  if (input.frameworkFile) {
    parts.push({
      inlineData: {
        mimeType: input.frameworkFile.mimeType,
        data: input.frameworkFile.data
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.0-pro',
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    const text = response.text || "";
    // Remove markdown code blocks if present to get clean HTML
    const cleanHtml = text.replace(/```html/g, '').replace(/```/g, '');

    return {
      htmlContent: cleanHtml,
      rawText: text
    };
  } catch (error) {
    console.error("Lỗi khi phân tích bài học:", error);
    throw error;
  }
};

export const generateLessonPlan = async (input: LessonInput, analysisContext: string): Promise<LessonPlanResponse> => {
  const ai = getClient();

  let promptText = `
═══════════════════════════════════════════════════════════
SOẠN KẾ HOẠCH BÀI DẠY THEO CÔNG VĂN 5512
(Tích hợp Giáo dục Năng lực AI theo Quyết định 3439)
═══════════════════════════════════════════════════════════

📚 THÔNG TIN BÀI DẠY:
- Cấp học/Khối lớp: ${input.grade}
- Môn học: ${input.subject}
- Bài học/Chủ đề: ${input.topic}

📊 KẾT QUẢ PHÂN TÍCH TÍCH HỢP AI TRƯỚC ĐÓ:
${analysisContext}

═══════════════════════════════════════════════════════════
YÊU CẦU SOẠN KHBD (Trả về định dạng HTML đầy đủ, chi tiết):
═══════════════════════════════════════════════════════════
`;

  if (input.sourceFile) {
    promptText += `\n📎 Lưu ý: Sử dụng tài liệu nguồn đính kèm để trích xuất nội dung chính xác.`;
  }

  promptText += `

Hãy soạn KHBD với cấu trúc HTML như sau:

<h2>KẾ HOẠCH BÀI DẠY</h2>
<p><strong>Môn học:</strong> ... | <strong>Lớp:</strong> ... | <strong>Thời gian:</strong> ... tiết</p>
<p><strong>Tên bài dạy:</strong> ...</p>

<h2>I. MỤC TIÊU</h2>

<h3>1. Kiến thức</h3>
<ul>
  <li>Liệt kê kiến thức cần đạt...</li>
</ul>

<h3>2. Năng lực</h3>
<h4>a) Năng lực đặc thù môn học:</h4>
<ul><li>...</li></ul>

<h4>b) Năng lực chung:</h4>
<ul><li>Tự chủ và tự học, Giao tiếp và hợp tác...</li></ul>

<h4 style="color: #1565C0;">c) ⭐ Năng lực AI/Kỹ năng số (theo QĐ 3439):</h4>
<ul style="background: #E3F2FD; padding: 15px; border-radius: 8px;">
  <li><strong>Trụ cột [X]:</strong> Mô tả năng lực cụ thể...</li>
</ul>

<h3>3. Phẩm chất</h3>
<ul><li>Chăm chỉ, trung thực, trách nhiệm...</li></ul>

<h2>II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</h2>

<h3>1. Giáo viên chuẩn bị:</h3>
<ul>
  <li>SGK, tài liệu tham khảo</li>
  <li>⭐ Công cụ AI: [Liệt kê cụ thể]</li>
  <li>Máy tính/máy chiếu, kết nối internet</li>
</ul>

<h3>2. Học sinh chuẩn bị:</h3>
<ul>
  <li>SGK, vở ghi</li>
  <li>⭐ Thiết bị: Điện thoại/máy tính (nếu cần)</li>
  <li>⭐ Tài khoản: [Nếu cần đăng ký trước]</li>
</ul>

<h2>III. TIẾN TRÌNH DẠY HỌC</h2>

<!-- HOẠT ĐỘNG 1 -->
<div style="border: 2px solid #4CAF50; border-radius: 10px; margin: 15px 0; overflow: hidden;">
  <div style="background: #4CAF50; color: white; padding: 10px 15px;">
    <strong>HOẠT ĐỘNG 1: MỞ ĐẦU</strong> (... phút)
  </div>
  <div style="padding: 15px;">
    <p><strong>a) Mục tiêu:</strong> ...</p>
    <p><strong>b) Nội dung:</strong> Tình huống/câu hỏi khởi động...</p>
    <p><strong>c) Sản phẩm:</strong> Câu trả lời/dự đoán của HS</p>
    <p><strong>d) Tổ chức thực hiện:</strong></p>
    <ul>
      <li><strong>Bước 1:</strong> GV nêu tình huống/câu hỏi...</li>
      <li><strong>Bước 2:</strong> HS suy nghĩ/thảo luận...</li>
      <li><strong>Bước 3:</strong> Chuyển giao vào bài mới...</li>
    </ul>
  </div>
</div>

<!-- HOẠT ĐỘNG 2 - PHẦN QUAN TRỌNG NHẤT -->
<div style="border: 2px solid #2196F3; border-radius: 10px; margin: 15px 0; overflow: hidden;">
  <div style="background: #2196F3; color: white; padding: 10px 15px;">
    <strong>HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI</strong> (... phút)
  </div>
  <div style="padding: 15px;">
    
    <!-- Mỗi đơn vị kiến thức là 1 block -->
    <div style="background: #FAFAFA; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
      <h4>📖 Nội dung 2.1: [Tên nội dung]</h4>
      <p><strong>a) Mục tiêu:</strong> ...</p>
      <p><strong>b) Nội dung:</strong> ...</p>
      <p><strong>c) Sản phẩm:</strong> ...</p>
      <p><strong>d) Tổ chức thực hiện:</strong></p>
      <ul>
        <li><strong>Bước 1:</strong> ...</li>
        <li><strong>Bước 2:</strong> ...</li>
      </ul>
    </div>
    
    <!-- BLOCK TÍCH HỢP AI - HIGHLIGHT -->
    <div style="background: linear-gradient(135deg, #E3F2FD, #BBDEFB); padding: 20px; border-radius: 10px; border-left: 5px solid #1565C0; margin: 15px 0;">
      <h4 style="color: #1565C0;">🤖 TÍCH HỢP NĂNG LỰC AI</h4>
      <p><strong>📌 Năng lực AI phát triển:</strong> [Ghi rõ trụ cột + năng lực cụ thể]</p>
      <p><strong>🔧 Công cụ sử dụng:</strong> [Tên công cụ]</p>
      <p><strong>📝 Hướng dẫn chi tiết:</strong></p>
      <ol>
        <li>GV giới thiệu công cụ AI và mục đích sử dụng</li>
        <li>GV demo cách sử dụng (chiếu màn hình hoặc hướng dẫn step-by-step)</li>
        <li>HS thực hành với prompt mẫu: <code style="background: #FFF; padding: 5px; border-radius: 4px;">[Viết prompt cụ thể]</code></li>
        <li>HS đánh giá, chỉnh sửa kết quả AI</li>
        <li>Thảo luận: AI làm được gì? Hạn chế gì? Con người cần bổ sung gì?</li>
      </ol>
      <p><strong>⚠️ Lưu ý đạo đức AI:</strong> [Ghi lưu ý về an toàn, bảo mật, không lạm dụng...]</p>
    </div>
    
  </div>
</div>

<!-- HOẠT ĐỘNG 3 -->
<div style="border: 2px solid #FF9800; border-radius: 10px; margin: 15px 0; overflow: hidden;">
  <div style="background: #FF9800; color: white; padding: 10px 15px;">
    <strong>HOẠT ĐỘNG 3: LUYỆN TẬP</strong> (... phút)
  </div>
  <div style="padding: 15px;">
    <p><strong>a) Mục tiêu:</strong> Củng cố kiến thức, rèn luyện kỹ năng</p>
    <p><strong>b) Nội dung:</strong> Bài tập/câu hỏi...</p>
    <p><strong>c) Sản phẩm:</strong> Bài làm của HS</p>
    <p><strong>d) Tổ chức thực hiện:</strong></p>
    <ul>
      <li>HS làm bài tập cá nhân/nhóm</li>
      <li>⭐ <em>(Nếu có)</em> Sử dụng AI để kiểm tra/so sánh đáp án</li>
    </ul>
  </div>
</div>

<!-- HOẠT ĐỘNG 4 -->
<div style="border: 2px solid #9C27B0; border-radius: 10px; margin: 15px 0; overflow: hidden;">
  <div style="background: #9C27B0; color: white; padding: 10px 15px;">
    <strong>HOẠT ĐỘNG 4: VẬN DỤNG</strong> (... phút hoặc về nhà)
  </div>
  <div style="padding: 15px;">
    <p><strong>a) Mục tiêu:</strong> Áp dụng kiến thức vào thực tiễn</p>
    <p><strong>b) Nội dung:</strong> Bài tập/dự án liên hệ thực tế...</p>
    <p><strong>c) Sản phẩm:</strong> Sản phẩm sáng tạo của HS</p>
    <p><strong>d) Tổ chức thực hiện:</strong></p>
    
    <!-- BLOCK VẬN DỤNG AI -->
    <div style="background: linear-gradient(135deg, #F3E5F5, #E1BEE7); padding: 15px; border-radius: 10px; border-left: 5px solid #7B1FA2;">
      <h4 style="color: #7B1FA2;">🚀 VẬN DỤNG AI GIẢI QUYẾT VẤN ĐỀ THỰC TẾ</h4>
      <p><strong>Nhiệm vụ:</strong> [Mô tả nhiệm vụ cụ thể]</p>
      <p><strong>Công cụ AI hỗ trợ:</strong> [Tên công cụ]</p>
      <p><strong>Hướng dẫn:</strong></p>
      <ol>
        <li>HS xác định vấn đề cần giải quyết</li>
        <li>HS sử dụng AI với prompt: <code>[Viết prompt]</code></li>
        <li>HS đánh giá và hoàn thiện sản phẩm</li>
        <li>Chia sẻ sản phẩm và phản ánh về quá trình sử dụng AI</li>
      </ol>
    </div>
  </div>
</div>

<h2>IV. ĐÁNH GIÁ NĂNG LỰC AI</h2>
<table border="1" style="width: 100%; border-collapse: collapse;">
  <tr style="background: #E3F2FD;">
    <th>Tiêu chí</th>
    <th>Mức độ đạt được</th>
    <th>Minh chứng</th>
  </tr>
  <tr>
    <td>Sử dụng thành thạo công cụ AI</td>
    <td>Tốt / Khá / Trung bình / Cần cố gắng</td>
    <td>Sản phẩm, quan sát</td>
  </tr>
  <tr>
    <td>Đánh giá được kết quả AI</td>
    <td>...</td>
    <td>...</td>
  </tr>
  <tr>
    <td>Sử dụng AI có trách nhiệm</td>
    <td>...</td>
    <td>...</td>
  </tr>
</table>

<hr>
<p style="font-style: italic; color: #666;">
  📌 <strong>Lưu ý:</strong> Đây là KHBD gợi ý được tạo bởi AI. Giáo viên cần xem xét, điều chỉnh phù hợp với điều kiện thực tế của lớp học, cơ sở vật chất và đối tượng học sinh.
</p>
`;

  const parts: any[] = [{ text: promptText }];

  // Re-attach source file for context during Plan generation if available
  if (input.sourceFile) {
    parts.push({
      inlineData: {
        mimeType: input.sourceFile.mimeType,
        data: input.sourceFile.data
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.0-pro',
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    const text = response.text || "";
    const cleanHtml = text.replace(/```html/g, '').replace(/```/g, '');

    return {
      htmlContent: cleanHtml
    };
  } catch (error) {
    console.error("Lỗi khi soạn giáo án:", error);
    throw error;
  }
};

<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Trợ lý EduAI 4.0 - Hỗ trợ Giáo viên Việt Nam</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Inter', sans-serif;
        background-color: #f3f4f6;
      }
      /* Custom scrollbar for better UX */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: #f1f1f1; 
      }
      ::-webkit-scrollbar-thumb {
        background: #cbd5e1; 
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #94a3b8; 
      }
      .prose h1 { @apply text-2xl font-bold text-gray-800 mb-4 mt-6; }
      .prose h2 { @apply text-xl font-bold text-gray-800 mb-3 mt-5; }
      .prose h3 { @apply text-lg font-semibold text-gray-800 mb-2 mt-4; }
      .prose p { @apply text-gray-700 leading-relaxed mb-4; }
      .prose ul { @apply list-disc list-outside ml-6 mb-4 text-gray-700; }
      .prose ol { @apply list-decimal list-outside ml-6 mb-4 text-gray-700; }
      .prose li { @apply mb-1; }
      .prose table { @apply w-full border-collapse border border-gray-300 mb-6; }
      .prose th { @apply border border-gray-300 bg-blue-50 px-4 py-2 text-left font-semibold text-gray-700; }
      .prose td { @apply border border-gray-300 px-4 py-2 text-gray-700 align-top; }
      .prose strong { @apply font-bold text-gray-900; }
      .prose em { @apply italic; }
    </style>
  <script type="importmap">
{
  "imports": {
    "@google/genai": "https://esm.sh/@google/genai@^1.40.0",
    "react-dom/": "https://esm.sh/react-dom@^19.2.4/",
    "react/": "https://esm.sh/react@^19.2.4/",
    "react": "https://esm.sh/react@^19.2.4"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

{
  "name": "Trợ lý EduAI 4.0",
  "description": "Ứng dụng hỗ trợ giáo viên tích hợp AI vào giảng dạy theo QĐ 3439/QĐ-BGDĐT và soạn giáo án theo CV 5512.",
  "requestFramePermissions": []
}
{
  "name": "trợ-lý-eduai-4.0",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@google/genai": "^1.40.0",
    "react-dom": "^19.2.4",
    "react": "^19.2.4"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1f_NfkpnYRdSK8eAp3LS-hmo47P6rnMhg

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "types": [
      "node"
    ],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
