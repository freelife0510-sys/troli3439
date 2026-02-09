import React from 'react';
import { AnalysisResponse } from '../types';

interface AnalysisResultProps {
  analysis: AnalysisResponse;
  onGeneratePlan: () => void;
  onReset: () => void;
  isGeneratingPlan: boolean;
}

// Tooltip Component
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <div className="group relative inline-block">
    {children}
    <div className="invisible group-hover:visible absolute z-50 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg -top-2 left-full ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
      {text}
      <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -left-1 top-4"></div>
    </div>
  </div>
);

// Info Badge Component
const InfoBadge: React.FC<{ pillar: string; color: string }> = ({ pillar, color }) => (
  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color} mr-1 mb-1`}>
    {pillar}
  </span>
);

const AnalysisResult: React.FC<AnalysisResultProps> = ({
  analysis,
  onGeneratePlan,
  onReset,
  isGeneratingPlan
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            <span className="text-xs font-medium opacity-90">Dữ liệu</span>
          </div>
          <Tooltip text="Thu thập, xử lý, trực quan hóa dữ liệu - Trụ cột 1 của QĐ 3439">
            <div className="text-2xl font-bold cursor-help">📊</div>
          </Tooltip>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span className="text-xs font-medium opacity-90">Thuật toán</span>
          </div>
          <Tooltip text="Tư duy logic, lập trình cơ bản, hiểu cách máy học - Trụ cột 2 của QĐ 3439">
            <div className="text-2xl font-bold cursor-help">🧮</div>
          </Tooltip>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium opacity-90">Ứng dụng AI</span>
          </div>
          <Tooltip text="AI tạo sinh, AI nhận diện, AI trợ giúp học tập - Trụ cột 3 của QĐ 3439">
            <div className="text-2xl font-bold cursor-help">🤖</div>
          </Tooltip>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-xs font-medium opacity-90">Đạo đức AI</span>
          </div>
          <Tooltip text="An toàn trực tuyến, fake news, AI có trách nhiệm - Trụ cột 4 của QĐ 3439">
            <div className="text-2xl font-bold cursor-help">🛡️</div>
          </Tooltip>
        </div>
      </div>

      {/* Info Banner about QĐ 3439 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h4 className="font-semibold text-blue-800 text-sm">Về Quyết định 3439/QĐ-BGDĐT</h4>
          <p className="text-blue-700 text-xs mt-1">
            Khung năng lực AI gồm 4 trụ cột: <strong>Dữ liệu</strong> (thu thập, xử lý, trực quan hóa),
            <strong> Thuật toán & Lập trình</strong> (tư duy logic), <strong>Ứng dụng AI</strong> (tạo sinh, nhận diện),
            và <strong>Đạo đức & Xã hội</strong> (an toàn, trách nhiệm).
          </p>
        </div>
      </div>

      {/* Main Analysis Result */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Kết quả phân tích địa chỉ tích hợp AI
          </h2>
          <button
            onClick={onReset}
            className="text-white/80 hover:text-white text-sm font-medium hover:underline flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Nhập lại
          </button>
        </div>

        {/* Analysis Content */}
        <div className="p-8 prose prose-blue max-w-none 
          prose-table:border-collapse prose-table:w-full 
          prose-th:bg-blue-50 prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:border prose-th:border-gray-300
          prose-td:p-3 prose-td:border prose-td:border-gray-300
          prose-h2:text-blue-800 prose-h2:border-b prose-h2:pb-2 prose-h2:mt-6
          prose-h3:text-blue-700 prose-h3:mt-4
          prose-ul:my-2 prose-li:my-1
          prose-strong:text-blue-900">
          <div dangerouslySetInnerHTML={{ __html: analysis.htmlContent }} />
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="italic">Dữ liệu được tạo bởi AI, giáo viên cần xem xét điều chỉnh phù hợp.</span>
            </div>

            <button
              onClick={onGeneratePlan}
              disabled={isGeneratingPlan}
              className={`px-6 py-3 rounded-lg text-white font-semibold shadow-md transition-all flex items-center gap-2
                ${isGeneratingPlan
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
            >
              {isGeneratingPlan ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang soạn KHBD theo CV 5512...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Tiếp tục: Soạn KHBD (CV 5512)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
