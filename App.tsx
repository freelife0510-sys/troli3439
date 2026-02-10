import React, { useState, useEffect } from 'react';
import { AppState, LessonInput, AnalysisResponse, LessonPlanResponse } from './types';
import { analyzeLessonIntegration, generateLessonPlan } from './geminiService';
import InputForm from './components/InputForm';
import AnalysisResult from './components/AnalysisResult';
import LessonPlanResult from './components/LessonPlanResult';
import ApiKeyModal from './components/ApiKeyModal';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [inputData, setInputData] = useState<LessonInput | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [planResult, setPlanResult] = useState<LessonPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Check if API Key exists on first load
  useEffect(() => {
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Show settings modal after a short delay if no key found
      const timer = setTimeout(() => setIsSettingsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

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
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Cấu hình API Key"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium text-sm">Cài đặt AI</span>
            </button>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100">
              Phiên bản thử nghiệm
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
            {(error.includes("API Key") || error.includes("AI")) && (
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-sm font-medium bg-white border border-red-300 px-3 py-1 rounded hover:bg-red-50 transition whitespace-nowrap"
              >
                Cấu hình ngay
              </button>
            )}
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

      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(key) => {
          localStorage.setItem('GEMINI_API_KEY', key);
          // Optional: Verify key or show success message
          alert('Đã lưu API Key thành công!');
        }}
      />
    </div>
  );
};

export default App;
