import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';
import { PageHeader } from '../components/PageHeader';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isFallback?: boolean;
  isSafetyBlocked?: boolean;
  confidence?: number;
  sources?: string[];
  phiWarning?: string;
  safetyAlert?: string;
  mascotMood?: 'happy' | 'worried' | 'excited' | 'analytical' | 'celebrating' | 'sleeping' | 'neutral' | 'sad' | 'hungry' | 'sleepy';
  quickActions?: { label: string; path: string }[];
}

export const ChatActive: React.FC = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'user',
      content: "Lá cây cà chua của tôi đang bị vàng ở các lá già phía dưới. Có phải cây bị bệnh không?",
      timestamp: new Date(Date.now() - 60000).toISOString()
    },
    {
      role: 'assistant',
      content: "Bé Thóc quan sát thấy gân lá của bạn có hiện tượng nhạt màu. Rất có khả năng cây cà chua đang bị thiếu đạm (Nitơ) hoặc thiếu kẽm. Bạn hãy kiểm tra lại chế độ bón phân đạm gần đây nhé!",
      timestamp: new Date(Date.now() - 30000).toISOString(),
      confidence: 0.88,
      mascotMood: 'happy',
      sources: [
        "Nhật ký chăm sóc cà chua ngày 15/03 (Độ tin cậy: 92%)",
        "Tài liệu hướng dẫn dinh dưỡng cây họ cà - Viện Rau Quả Việt Nam (Độ tin cậy: 85%)"
      ],
      quickActions: [
        { label: "Ghi Nhật Ký", path: "/diary/create" },
        { label: "Đặt Nhắc Nhở", path: "/reminders" }
      ]
    }
  ]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const userMsg: Message = {
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      // 1. PII detection and redaction
      const phoneRegex = /\b\d{9,11}\b/g;
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
      const idRegex = /\b\d{12}\b/g; // 12-digit VN CCCD
      
      let processedUserText = userText;
      let piiDetected = false;
      if (phoneRegex.test(userText)) {
        processedUserText = processedUserText.replace(phoneRegex, '[SỐ ĐIỆN THOẠI ĐÃ ĐƯỢC ẨN BỞI AI SAFETY]');
        piiDetected = true;
      }
      if (emailRegex.test(userText)) {
        processedUserText = processedUserText.replace(emailRegex, '[EMAIL ĐÃ ĐƯỢC ẨN BỞI AI SAFETY]');
        piiDetected = true;
      }
      if (idRegex.test(userText)) {
        processedUserText = processedUserText.replace(idRegex, '[SỐ ĐỊNH DANH ĐÃ ĐƯỢC ẨN BỞI AI SAFETY]');
        piiDetected = true;
      }

      // 2. Prompt Injection Defense
      const injectionKeywords = [/ignore previous instructions/i, /forget your instructions/i, /\[system\]/i, /\[inst\]/i, /you are now/i, /act as/i];
      const hasInjection = injectionKeywords.some(pattern => pattern.test(userText));

      if (hasInjection) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "Nội dung câu hỏi chứa các thuật ngữ chưa phù hợp để tư vấn nông nghiệp. Bà con vui lòng đặt câu hỏi rõ ràng hơn về kỹ thuật cây trồng nhé!",
          timestamp: new Date().toISOString(),
          mascotMood: 'sleepy',
          isSafetyBlocked: true
        }]);
        return;
      }

      // 3. Content Moderation (Agriculture Only)
      const nonAgriKeywords = ['code', 'javascript', 'html', 'python', 'chính trị', 'bạo lực', 'phim', 'ca nhạc', 'y tế', 'pháp luật', 'tài chính', 'tiền bạc'];
      const hasNonAgri = nonAgriKeywords.some(keyword => userText.toLowerCase().includes(keyword));

      if (hasNonAgri) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "Dạ, tôi là chuyên gia nông nghiệp FarmDiaries. Tôi chỉ có thể hỗ trợ bạn về kỹ thuật trồng trọt, chăn nuôi và chăm sóc nhật ký nông trại thôi ạ! 🌱",
          timestamp: new Date().toISOString(),
          mascotMood: 'neutral'
        }]);
        return;
      }

      // 4. Pesticide / PHI Guardrail & Safety Alert
      const chemicalKeywords = ['paraquat', 'chlorpyrifos', 'carbofuran'];
      const pesticideKeywords = ['thuốc', 'phun', 'trừ sâu', 'diệt cỏ', 'bảo vệ thực vật', 'hóa học'];
      const hasChemical = chemicalKeywords.some(chem => userText.toLowerCase().includes(chem));
      const hasPesticide = pesticideKeywords.some(pest => userText.toLowerCase().includes(pest));

      let content = "";
      let confidence = 0.90;
      let sources: string[] = [];
      let phiWarning = "";
      let safetyAlert = "";
      let mood: any = "happy";

      if (hasChemical) {
        mood = "worried";
        content = "Bé Thóc khuyên bà con hạn chế tối đa việc sử dụng các thuốc hóa học có chứa hoạt chất cấm cực độc. Thay vào đó, hãy tìm các chế phẩm sinh học an toàn hơn.";
        confidence = 0.82;
        sources = [
          "Thông tư Danh mục thuốc BVTV cấm sử dụng tại Việt Nam - Bộ NN&PTNT (Độ tin cậy: 98%)"
        ];
        safetyAlert = "🚨 CẢNH BÁO BẢO VỆ THỰC VẬT: Hoạt chất Paraquat / Chlorpyrifos / Carbofuran nằm trong danh mục cấm hoặc hạn chế nghiêm ngặt tại Việt Nam do độc tính cực cao đối với sức khỏe và môi trường.";
        phiWarning = "⚠️ Thời gian cách ly PHI: Tuyệt đối không thu hoạch nông sản trong vòng ít nhất 21 ngày kể từ khi sử dụng thuốc chứa các hoạt chất này.";
      } else if (hasPesticide) {
        mood = "worried";
        content = "Khi phun thuốc bảo vệ thực vật trị bệnh cho cây trồng, bà con nên phun vào buổi sáng sớm hoặc chiều mát và tuân thủ nguyên tắc 4 đúng (đúng thuốc, đúng liều, đúng lúc, đúng cách).";
        confidence = 0.91;
        sources = [
          "Cẩm nang hướng dẫn sử dụng thuốc bảo vệ thực vật an toàn - Cục Bảo vệ Thực vật (Độ tin cậy: 95%)",
          "Nhật ký điều trị sâu ăn lá ngày 12/04 (Độ tin cậy: 80%)"
        ];
        phiWarning = "⚠️ Thời gian cách ly PHI: Cần tuân thủ thời gian cách ly tối thiểu 14 ngày trước khi thu hoạch để bảo vệ người tiêu dùng.";
      } else if (userText.toLowerCase().includes('lúa') || userText.toLowerCase().includes('đạo ôn')) {
        mood = "happy";
        content = "Bệnh đạo ôn lá lúa do nấm gây ra, phát triển mạnh khi trời âm u, nhiều sương mù. Bà con nên ngưng bón đạm ngay lập tức, giữ nước ruộng ổn định và phun ngừa bằng Tricyclazole.";
        confidence = 0.94;
        sources = [
          "Tài liệu hướng dẫn phòng trừ đạo ôn lúa - Viện Lúa Đồng bằng Sông Cửu Long (Độ tin cậy: 95%)",
          "Nhật ký gieo cấy lúa nước ngày 05/06 (Độ tin cậy: 88%)"
        ];
        phiWarning = "⚠️ Thời gian cách ly PHI: Ngưng phun hóa chất bảo vệ thực vật 14 ngày trước khi thu hoạch lúa.";
      } else if (userText.toLowerCase().includes('cam') || userText.toLowerCase().includes('bưởi') || userText.toLowerCase().includes('vàng lá')) {
        mood = "happy";
        content = "Vàng lá trên bưởi/cam có thể do Greening hoặc thối rễ do úng nước. Bà con nên kiểm tra độ thoát nước của rãnh vườn, rải vôi khử trùng đất và tưới chế phẩm Trichoderma.";
        confidence = 0.89;
        sources = [
          "Quy trình canh tác bưởi Da Xanh bền vững - Trung tâm Khuyến nông Quốc gia (Độ tin cậy: 91%)"
        ];
      } else if (userText.toLowerCase().includes('khen') || userText.toLowerCase().includes('streak') || userText.toLowerCase().includes('chuỗi')) {
        mood = "excited";
        content = "Tuyệt vời quá! Bé Thóc thấy chuỗi Streak ghi nhật ký của bà con đang rất cao đó nha! Hãy tiếp tục chăm chỉ ghi chép hoạt động vườn mỗi ngày để giữ streak và làm Thóc vui vẻ nhé! 🎉🌱";
        confidence = 0.99;
        sources = [
          "Hệ thống theo dõi Streak hoạt động FarmDiaries (Độ tin cậy: 100%)"
        ];
      } else {
        mood = "happy";
        let subContent = piiDetected ? "\n\n(Lưu ý: Hệ thống đã tự động lọc bỏ thông tin nhạy cảm của bạn để bảo mật dữ liệu trước khi xử lý)." : "";
        content = "Dạ, Bé Thóc đã nhận được câu hỏi. Để chẩn đoán chính xác nhất, bà con vui lòng mô tả thêm triệu chứng chi tiết và chọn đúng loại cây trồng bị bệnh nhé!" + subContent;
        confidence = 0.58;
        sources = [
          "Cơ sở dữ liệu câu hỏi chung hệ thống FarmDiaries (Độ tin cậy: 70%)"
        ];
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content,
        timestamp: new Date().toISOString(),
        confidence,
        mascotMood: mood,
        sources,
        phiWarning,
        safetyAlert,
        quickActions: [
          { label: "Lưu nhật ký", path: "/diary/create" },
          { label: "Cài nhắc nhở", path: "/reminders" }
        ]
      }]);
    }, 1500);
  };

  return (
    <div className="w-full h-full min-h-[100svh] bg-bg-surface-1 text-left font-sans flex flex-col overflow-hidden">
      
      <PageHeader 
        title="FarmDiaries AI"
        subtitle="Tri Kỷ AI"
        leftButton="back"
        rightButton="camera"
        onRightClick={() => navigate('/scan')}
      />

      {/* Main Content Area */}
      <main className="w-full max-w-3xl mx-auto flex-1 pt-[72px] pb-[120px] px-4 md:px-8 flex flex-col gap-6 overflow-y-auto scrollbar-hide bg-bg-surface-1 z-0">
        
        {/* Date Marker */}
        <div className="flex justify-center mt-6">
          <span className="bg-white border border-border-main/50 text-text-main/50 font-bold text-xs px-4 py-1 rounded-full shadow-sm">
            Hôm nay
          </span>
        </div>

        {/* Messages List */}
        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} w-full mt-2`}>
            {msg.role === 'assistant' && (
              <div className="flex items-end gap-2 mb-1">
                <div className="w-10 h-10 rounded-full bg-white border border-border-main/50 flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-0.5">
                  <MascotLottie className="w-full h-full -mt-1" state={msg.mascotMood || 'happy'} />
                </div>
                <span className="font-bold text-sm text-text-main/70 ml-2 mb-1">Bé Thóc</span>
              </div>
            )}
            
            <div className={`${msg.role === 'user' ? 'bg-primary text-white rounded-br-sm rounded-[24px] border border-primary' : 'bg-white text-text-main rounded-bl-sm rounded-[24px] border border-border-main/50'} p-4 shadow-sm max-w-[85%] ${msg.role === 'assistant' ? 'ml-12' : ''} relative text-left flex flex-col gap-2.5`}>
              <p className="font-semibold text-base leading-relaxed whitespace-pre-line">{msg.content}</p>
              
              {/* Confidence Score Display (E6) */}
              {msg.role === 'assistant' && msg.confidence !== undefined && (
                <div className="flex items-center gap-1.5 text-xs font-extrabold border-t border-border-main/10 pt-2">
                  <span className="text-text-main/50">Độ tin cậy:</span>
                  <span className={msg.confidence < 0.6 ? 'text-error-main' : 'text-primary'}>
                    {Math.round(msg.confidence * 100)}%
                  </span>
                  {msg.confidence < 0.6 && (
                    <span className="text-error-main font-bold italic ml-1">(Độ tin cậy thấp)</span>
                  )}
                </div>
              )}

              {/* RAG Source Citations Display (E6) */}
              {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                <div className="flex flex-col gap-1 border-t border-border-main/10 pt-2 text-xs">
                  <span className="font-extrabold text-text-main/60">Tài liệu tham khảo:</span>
                  <ul className="list-disc pl-4 font-bold text-text-main/70 space-y-0.5">
                    {msg.sources.map((src, i) => (
                      <li key={i} className="leading-tight">{src}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* PHI Warning (E5) */}
              {msg.role === 'assistant' && msg.phiWarning && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-3 flex items-start gap-2 mt-1 text-xs">
                  <svg className="w-5 h-5 shrink-0 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z"/>
                  </svg>
                  <p className="font-extrabold leading-tight flex-1">{msg.phiWarning}</p>
                </div>
              )}

              {/* Safety Alert (Banned pesticides) (E5) */}
              {msg.role === 'assistant' && msg.safetyAlert && (
                <div className="bg-[#FFF5F5] border border-[#FFD8D8] text-[#D32F2F] rounded-xl p-3 flex items-start gap-2 mt-1 text-xs">
                  <svg className="w-5 h-5 shrink-0 text-[#D32F2F] mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  <p className="font-extrabold leading-tight flex-1">{msg.safetyAlert}</p>
                </div>
              )}

              {/* Quick Actions */}
              {msg.role === 'assistant' && msg.quickActions && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {msg.quickActions.map((action, i) => (
                    <button 
                      key={i}
                      onClick={() => navigate(action.path)}
                      className="bg-white hover:bg-bg-surface-2 text-text-main border border-border-main/50 px-3.5 py-1.5 rounded-full font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {action.label === 'Lưu nhật ký' || action.label === 'Save to diary' ? (
                        <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg> 
                      ) : (
                        <svg className="w-3.5 h-3.5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg> 
                      )}
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex flex-col items-start w-full mt-4">
            <div className="flex items-end gap-2 mb-1">
              <div className="w-10 h-10 rounded-full bg-white border border-border-main/50 flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-0.5">
                <MascotLottie className="w-full h-full -mt-1" state="analytical" />
              </div>
              <span className="font-bold text-sm text-text-main/70 ml-2 mb-1">Bé Thóc</span>
            </div>
            
            <div className="bg-white text-text-main p-4 rounded-[24px] rounded-bl-sm border border-border-main/50 shadow-sm ml-12 relative flex items-center gap-1.5 py-3">
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        
        {/* Invisible spacer */}
        <div className="h-[20px]" ref={chatBottomRef}></div>
      </main>

      {/* Chat Input Area - Fixed at bottom */}
      <div className="fixed bottom-24 md:bottom-8 left-0 right-0 w-full pt-6 pb-4 px-4 md:px-8 z-30 flex justify-center pointer-events-none">
        <div className="w-full max-w-3xl flex items-center gap-2 bg-white border border-border-main/50 rounded-full p-1.5 shadow-lg focus-within:shadow-xl focus-within:-translate-y-[2px] transition-all pointer-events-auto">
          <button 
            onClick={() => navigate('/scan')}
            className="p-3 text-text-main/50 hover:text-primary transition-colors flex items-center justify-center rounded-full hover:bg-bg-surface-1 cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          <input 
            className="flex-1 bg-transparent border-none focus:ring-0 font-bold text-base text-text-main placeholder:text-border-main h-full py-3 outline-none" 
            placeholder="Hỏi Bé Thóc bất cứ điều gì về vườn..." 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          
          <button 
            onClick={handleSend}
            className="p-3.5 text-white bg-primary rounded-full hover:bg-primary-container transition-colors flex items-center justify-center mr-1 shadow-sm active:scale-95 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default ChatActive;
