import React, { useState } from 'react';
import { LessonPlanResponse } from '../types';

interface LessonPlanResultProps {
  plan: LessonPlanResponse;
  onReset: () => void;
}

// Tooltip Component
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <div className="group relative inline-block">
    {children}
    <div className="invisible group-hover:visible absolute z-50 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
      {text}
      <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
    </div>
  </div>
);

const LessonPlanResult: React.FC<LessonPlanResultProps> = ({ plan, onReset }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(plan.htmlContent);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadWord = () => {
    const styles = `
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.5; }
        h2 { color: #1565C0; font-size: 16pt; margin-top: 20pt; border-bottom: 1px solid #ccc; padding-bottom: 5pt; }
        h3 { color: #1976D2; font-size: 14pt; margin-top: 15pt; }
        h4 { color: #333; font-size: 13pt; margin-top: 10pt; }
        table { width: 100%; border-collapse: collapse; margin: 10pt 0; }
        th, td { border: 1px solid #333; padding: 8pt; text-align: left; }
        th { background-color: #E3F2FD; font-weight: bold; }
        ul, ol { margin: 5pt 0 5pt 20pt; }
        li { margin: 3pt 0; }
        strong { color: #1565C0; }
        code { background: #f5f5f5; padding: 2pt 5pt; border-radius: 3pt; font-family: Consolas, monospace; }
        .ai-block { background: #E3F2FD; padding: 15pt; margin: 10pt 0; border-left: 4pt solid #1565C0; }
      </style>
    `;

    const header = "<!DOCTYPE html><html xmlns:o='urn:schemas-microsoft-com:office:office' " +
      "xmlns:w='urn:schemas-microsoft-com:office:word' " +
      "xmlns='http://www.w3.org/TR/REC-html40'>" +
      "<head><meta charset='utf-8'><title>Kế hoạch bài dạy - Tích hợp AI</title>" + styles + "</head><body>";
    const footer = "</body></html>";
    const contentToExport = isEditMode ? editedContent : plan.htmlContent;
    const sourceHTML = header + contentToExport + footer;

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = 'ke-hoach-bai-day-tich-hop-ai.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const handleSaveEdit = () => {
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(plan.htmlContent);
    setIsEditMode(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Info Banner about CV 5512 */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 print:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <div>
          <h4 className="font-semibold text-green-800 text-sm">Về Công văn 5512/BGDĐT-GDTrH</h4>
          <p className="text-green-700 text-xs mt-1">
            KHBD theo CV 5512 gồm 4 hoạt động: <strong>Mở đầu</strong> (xác định vấn đề),
            <strong> Hình thành kiến thức mới</strong>, <strong>Luyện tập</strong>,
            và <strong>Vận dụng</strong> (áp dụng thực tiễn).
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Quay lại
        </button>

        <div className="flex gap-2 flex-wrap justify-center">
          {/* Edit Mode Toggle */}
          {!isEditMode ? (
            <Tooltip text="Chỉnh sửa nội dung trước khi xuất file">
              <button
                onClick={() => setIsEditMode(true)}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center gap-2 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Chỉnh sửa
              </button>
            </Tooltip>
          ) : (
            <>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Lưu
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex items-center gap-2 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Hủy
              </button>
            </>
          )}

          <Tooltip text="Tải xuống file Word (.doc) với định dạng đẹp">
            <button
              onClick={handleDownloadWord}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Tải về (.doc)
            </button>
          </Tooltip>

          <Tooltip text="In trực tiếp hoặc lưu thành PDF">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition flex items-center gap-2 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              In PDF
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden print:shadow-none print:border-none">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 print:hidden">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Kế hoạch bài dạy (Mẫu CV 5512 - Tích hợp AI)
          </h2>
          <p className="text-green-100 text-sm mt-1">Có thể chỉnh sửa trước khi xuất file</p>
        </div>

        {/* Edit Mode or Preview Mode */}
        {isEditMode ? (
          <div className="p-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span className="text-amber-800 text-sm font-medium">Chế độ chỉnh sửa - Chỉnh sửa HTML trực tiếp</span>
            </div>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-[600px] p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Nội dung HTML..."
            />
          </div>
        ) : (
          <div className="p-10 prose prose-slate max-w-none print:p-0
            prose-table:border-collapse prose-table:w-full 
            prose-th:bg-green-50 prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:border prose-th:border-gray-300
            prose-td:p-3 prose-td:border prose-td:border-gray-300
            prose-h2:text-green-800 prose-h2:border-b prose-h2:pb-2 prose-h2:mt-6
            prose-h3:text-green-700 prose-h3:mt-4
            prose-h4:text-gray-800
            prose-ul:my-2 prose-li:my-1
            prose-strong:text-green-900">

            {/* Print Header */}
            <div className="text-center mb-8 hidden print:block">
              <h1 className="uppercase text-xl font-bold">KẾ HOẠCH BÀI DẠY</h1>
              <p className="italic">Tích hợp Giáo dục Năng lực AI theo Quyết định 3439/QĐ-BGDĐT</p>
            </div>

            <div dangerouslySetInnerHTML={{ __html: isEditMode ? editedContent : plan.htmlContent }} />
          </div>
        )}

        {/* Footer Note */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 print:hidden">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="italic">
              KHBD này được tạo bởi AI. Giáo viên cần xem xét, điều chỉnh phù hợp với điều kiện thực tế của lớp học.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanResult;
