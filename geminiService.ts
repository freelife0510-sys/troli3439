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
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key chưa được cấu hình. Vui lòng kiểm tra biến môi trường.");
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
      model: 'gemini-2.5-flash',
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
      model: 'gemini-2.5-flash',
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
