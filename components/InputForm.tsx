import React, { useState, useEffect } from 'react';
import { LessonInput, FileData } from '../types';

interface InputFormProps {
  onSubmit: (data: LessonInput) => void;
  isLoading: boolean;
}

// Tooltip Component
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <div className="group relative inline-block">
    {children}
    <div className="invisible group-hover:visible absolute z-50 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
      {text}
      <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
    </div>
  </div>
);

// Help Icon Component
const HelpIcon: React.FC<{ tooltip: string }> = ({ tooltip }) => (
  <Tooltip text={tooltip}>
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold cursor-help ml-1 hover:bg-blue-200 transition">
      ?
    </span>
  </Tooltip>
);

const educationData: any = {
  primary: {
    grades: ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5'],
    subjects: {
      default: [
        'Toán', 'Tiếng Việt', 'Đạo đức', 'Giáo dục thể chất',
        'Âm nhạc', 'Mĩ thuật', 'Hoạt động trải nghiệm'
      ],
      'Lớp 1': ['Tự nhiên và Xã hội', 'Tiếng dân tộc thiểu số (TC)', 'Ngoại ngữ 1 (TC)'],
      'Lớp 2': ['Tự nhiên và Xã hội', 'Tiếng dân tộc thiểu số (TC)', 'Ngoại ngữ 1 (TC)'],
      'Lớp 3': ['Tự nhiên và Xã hội', 'Tin học và Công nghệ', 'Ngoại ngữ 1', 'Tiếng dân tộc thiểu số (TC)'],
      'Lớp 4': ['Lịch sử và Địa lí', 'Khoa học', 'Tin học và Công nghệ', 'Ngoại ngữ 1', 'Tiếng dân tộc thiểu số (TC)'],
      'Lớp 5': ['Lịch sử và Địa lí', 'Khoa học', 'Tin học và Công nghệ', 'Ngoại ngữ 1', 'Tiếng dân tộc thiểu số (TC)']
    }
  },
  secondary: {
    grades: ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'],
    subjects: {
      default: [
        'Ngữ văn', 'Toán', 'Ngoại ngữ 1', 'Giáo dục công dân', 'Khoa học tự nhiên',
        'Lịch sử và Địa lí', 'Công nghệ', 'Tin học', 'Giáo dục thể chất',
        'Âm nhạc', 'Mĩ thuật', 'Hoạt động trải nghiệm, hướng nghiệp',
        'Nội dung giáo dục của địa phương', 'Tiếng dân tộc thiểu số (TC)', 'Ngoại ngữ 2 (TC)'
      ]
    }
  },
  highSchool: {
    grades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    subjects: {
      default: [
        'Ngữ văn', 'Toán', 'Ngoại ngữ 1', 'Lịch sử', 'Giáo dục thể chất',
        'Giáo dục quốc phòng và an ninh', 'Hoạt động trải nghiệm, hướng nghiệp',
        'Nội dung giáo dục của địa phương',
        'Địa lí', 'Giáo dục kinh tế và pháp luật', 'Vật lí', 'Hóa học',
        'Sinh học', 'Công nghệ', 'Tin học', 'Âm nhạc', 'Mĩ thuật'
      ]
    }
  }
};

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [level, setLevel] = useState('highSchool');
  const [grade, setGrade] = useState('Lớp 10');
  const [subject, setSubject] = useState('Ngữ văn');
  const [topic, setTopic] = useState('');

  const [sourceFile, setSourceFile] = useState<FileData | null>(null);
  const [frameworkFile, setFrameworkFile] = useState<FileData | null>(null);

  // Update grade list when level changes
  useEffect(() => {
    const firstGrade = educationData[level].grades[0];
    setGrade(firstGrade);
  }, [level]);

  // Update subject list when grade or level changes
  const getSubjects = () => {
    const levelData = educationData[level];
    const defaultSubjects = levelData.subjects.default || [];
    const specificSubjects = levelData.subjects[grade] || [];
    return [...new Set([...defaultSubjects, ...specificSubjects])];
  };

  useEffect(() => {
    const subjects = getSubjects();
    if (!subjects.includes(subject)) {
      setSubject(subjects[0]);
    }
  }, [grade, level]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, setFile: (f: FileData | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFile(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64String = (event.target.result as string).split(',')[1];
        setFile({
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          data: base64String
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit({ grade, subject, topic, sourceFile, frameworkFile });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500 p-2 rounded-lg flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 text-sm">Quyết định 3439</h4>
              <p className="text-blue-600 text-xs mt-1">
                Khung năng lực AI: Dữ liệu, Thuật toán, Ứng dụng AI, Đạo đức
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-start gap-3">
            <div className="bg-green-500 p-2 rounded-lg flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 text-sm">Công văn 5512</h4>
              <p className="text-green-600 text-xs mt-1">
                KHBD 4 hoạt động: Mở đầu, Hình thành, Luyện tập, Vận dụng
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Thông tin bài dạy & Tài liệu</h2>
          <p className="text-gray-500 mt-2">Nhập thông tin và tải lên tài liệu để AI hỗ trợ tốt nhất</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Cấp học Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cấp học
              <HelpIcon tooltip="Chọn cấp học phù hợp để AI gợi ý các công cụ và hoạt động tích hợp AI phù hợp với lứa tuổi" />
            </label>
            <div className="flex gap-3">
              <label className={`flex-1 cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${level === 'primary' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}>
                <input type="radio" name="level" value="primary" checked={level === 'primary'} onChange={() => setLevel('primary')} className="hidden" />
                <div className="text-2xl mb-1">🎒</div>
                <div className="font-semibold">Tiểu học</div>
                <div className="text-xs text-gray-500">Lớp 1-5</div>
              </label>
              <label className={`flex-1 cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${level === 'secondary' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}>
                <input type="radio" name="level" value="secondary" checked={level === 'secondary'} onChange={() => setLevel('secondary')} className="hidden" />
                <div className="text-2xl mb-1">📚</div>
                <div className="font-semibold">THCS</div>
                <div className="text-xs text-gray-500">Lớp 6-9</div>
              </label>
              <label className={`flex-1 cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${level === 'highSchool' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}>
                <input type="radio" name="level" value="highSchool" checked={level === 'highSchool'} onChange={() => setLevel('highSchool')} className="hidden" />
                <div className="text-2xl mb-1">🎓</div>
                <div className="font-semibold">THPT</div>
                <div className="text-xs text-gray-500">Lớp 10-12</div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                Khối lớp
              </label>
              <select
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
              >
                {educationData[level].grades.map((g: string) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Môn học / Hoạt động
              </label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
              >
                {getSubjects().map((s: string) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
              Tên bài học / Chủ đề
              <HelpIcon tooltip="Nhập tên bài học cụ thể từ SGK hoặc chủ đề muốn dạy. Có thể thêm chi tiết như: số tiết, nội dung chính..." />
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ví dụ: Truyện Kiều - Trao duyên (2 tiết)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg"
              required
            />
          </div>

          {/* File Upload Section */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Tài liệu đính kèm (không bắt buộc)
              <HelpIcon tooltip="Tải lên tài liệu để AI phân tích chính xác hơn. Hỗ trợ: Ảnh chụp SGK, PDF, file Word" />
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  📖 Tài liệu nguồn (SGK, Bài giảng...)
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 hover:bg-gray-50 hover:border-blue-300 transition text-center group">
                  <input
                    type="file"
                    accept="image/*,application/pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, setSourceFile)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-1">
                    {sourceFile ? (
                      <div className="text-green-600 font-medium flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="truncate max-w-[150px]">{sourceFile.name}</span>
                      </div>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-gray-400 group-hover:text-blue-500 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-xs text-gray-500">Ảnh, PDF, Word</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  📋 PPCT / Khung 3439 / Khung AI
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 hover:bg-gray-50 hover:border-green-300 transition text-center group">
                  <input
                    type="file"
                    accept="image/*,application/pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, setFrameworkFile)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-1">
                    {frameworkFile ? (
                      <div className="text-green-600 font-medium flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="truncate max-w-[150px]">{frameworkFile.name}</span>
                      </div>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-gray-400 group-hover:text-green-500 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-xs text-gray-500">Ảnh, PDF, Word</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all flex justify-center items-center gap-3
              ${isLoading || !topic.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 hover:shadow-xl'
              }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang phân tích bằng AI...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>BẮT ĐẦU PHÂN TÍCH & TÍCH HỢP AI</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputForm;
