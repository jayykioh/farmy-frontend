/* Hallmark · page: help-support · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

export const HelpSupport: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqs: FAQItem[] = [
    {
      id: 1,
      category: 'Bắt đầu',
      question: 'FARMY AI là gì?',
      answer: 'FARMY AI là ứng dụng chăm sóc nông trại toàn diện, giúp bạn ghi nhật ký nông trại, chẩn đoán bệnh cây bằng AI, và nhận tư vấn từ Bé Thóc - trợ lý ảo thông minh của bạn.'
    },
    {
      id: 2,
      category: 'Bắt đầu',
      question: 'Làm cách nào để tạo tài khoản?',
      answer: 'Bạn có thể tạo tài khoản bằng cách đăng nhập qua Google hoặc sử dụng email. Sau đó, hoàn thành quá trình onboarding ba bước để thiết lập nông trại của bạn.'
    },
    {
      id: 3,
      category: 'Nhật ký',
      question: 'Tôi nên ghi nhật ký như thế nào?',
      answer: 'Hãy ghi lại những gì bạn làm mỗi ngày: cây trồng, công việc (tưới nước, bón phân), vấn đề phát hiện và ảnh. Điều này giúp bạn theo dõi tiến độ và nhận lời khuyên tốt hơn từ AI.'
    },
    {
      id: 4,
      category: 'PlantScan',
      question: 'Làm cách nào để chụp ảnh bệnh cây?',
      answer: 'Mở tab "AI Pet", nhấp vào biểu tượng camera ở thanh nhập liệu, chụp ảnh cây có dấu hiệu bệnh với ánh sáng tốt, sau đó Bé Thóc sẽ phân tích hình ảnh cho bạn.'
    },
    {
      id: 5,
      category: 'PlantScan',
      question: 'Độ chính xác của PlantScan là bao nhiêu?',
      answer: 'Độ chính xác phụ thuộc vào chất lượng ảnh và rõ ràng của triệu chứng. Chúng tôi khuyên bạn nên chụp ảnh với ánh sáng tự nhiên tốt và tập trung vào vấn đề.'
    },
    {
      id: 6,
      category: 'Huy hiệu & XP',
      question: 'Huy hiệu và XP là gì?',
      answer: 'Huy hiệu là những thành tích bạn mở khóa khi hoàn thành các hành động (ghi nhật ký, quét bệnh, duy trì streak). XP là điểm kinh nghiệm bạn kiếm được - nó giúp bạn cấp độ và mở khóa các vật phẩm phụ kiện cho Bé Thóc.'
    },
    {
      id: 7,
      category: 'Huy hiệu & XP',
      question: 'Streak là gì?',
      answer: 'Streak là số ngày liên tiếp bạn tương tác với ứng dụng (ghi nhật ký hoặc quét bệnh). Duy trì streak cao để nhận thêm huy hiệu và phần thưởng đặc biệt.'
    },
    {
      id: 8,
      category: 'Nhắc nhở',
      question: 'Làm cách nào để đặt nhắc nhở?',
      answer: 'Bạn có thể đặt nhắc nhở từ tab "AI Pet" (Bé Thóc sẽ đề xuất) hoặc từ Settings > Nhắc nhở của tôi > Thêm. Chọn loại công việc, thời gian và tần suất lặp lại.'
    },
    {
      id: 9,
      category: 'Kết nối',
      question: 'Tôi có thể nhận thông báo qua Email không?',
      answer: 'Có! Kết nối Email để nhận nhắc nhở trực tiếp qua hộp thư của bạn. Vào Settings > Thông báo và bật "Kết nối Email".'
    },
    {
      id: 10,
      category: 'Khác',
      question: 'Dữ liệu của tôi có an toàn không?',
      answer: 'Có. FARMY AI sử dụng mã hóa tiêu chuẩn để bảo vệ dữ liệu của bạn. Chúng tôi không bao giờ chia sẻ thông tin cá nhân của bạn với bên thứ ba.'
    }
  ];

  const categories = ['Tất cả', ...new Set(faqs.map(faq => faq.category))];
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const filteredFaqs = faqs.filter(faq => {
    const matchCategory = selectedCategory === 'Tất cả' || faq.category === selectedCategory;
    const matchSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="w-full min-h-[100svh] bg-bg-main text-text-main text-left font-sans pb-24 relative">
      <PageHeader 
        title="Trợ giúp & Hỗ trợ"
        subtitle="Giải đáp thắc mắc & Hướng dẫn nông vụ"
        leftButton="back"
      />
      {/* Main Content */}
      <main className="w-full max-w-3xl mx-auto pt-24 px-4 md:px-8 flex flex-col gap-4">
        
        {/* Search Bar */}
        <div className="relative">
          <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Tìm kiếm câu hỏi..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-border-main rounded-full py-3.5 pl-12 pr-4 font-bold text-base text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:border-[#008A5E] shadow-sm"
          />
        </div>

        {/* Contact Card */}
        <div className="card-bubble bg-white p-6 shadow-sm border-2 border-border-main">
          <h2 className="text-xl font-black text-text-h mb-2 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#008A5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Cần giúp đỡ?
          </h2>
          <p className="text-sm font-bold text-text-secondary mb-4">Không tìm thấy câu trả lời? Liên hệ trực tiếp với kỹ sư nông nghiệp của chúng tôi.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a 
              href="mailto:support@farmy.ai"
              className="btn btn--cyan flex items-center justify-center gap-2 font-bold px-6 py-3 shadow-sm cursor-pointer text-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Gửi Email hỗ trợ
            </a>
            <button className="btn btn--soft flex items-center justify-center gap-2 font-bold px-6 py-3 border-2 border-border-main shadow-sm cursor-pointer text-sm active:scale-95">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.5 1H15.5C18.59 1 21 3.41 21 6.5V16C21 19.59 18.59 22 15.5 22H8.5C5.41 22 3 19.59 3 16V6.5C3 3.41 5.41 1 8.5 1M12 20C13.66 20 15 18.66 15 17H9C9 18.66 10.34 20 12 20M20 5H4V16C4 18.77 6.22 21 9 21H15C17.78 21 20 18.77 20 16V5Z"/>
              </svg>
              Kênh Zalo Nông Dân
            </button>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(category => (
            <button 
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'btn btn--cyan font-extrabold shadow-sm'
                  : 'card-bubble bg-white border-2 border-border-main text-text-secondary hover:text-text-main'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map(faq => (
              <button
                key={faq.id}
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                className="card-bubble bg-white p-5 shadow-sm hover:shadow-md border-2 border-border-main cursor-pointer text-left transition-all w-full"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-extrabold text-base text-text-h">
                      {faq.question}
                    </p>
                    {expandedId === faq.id ? (
                      <p className="text-sm font-semibold text-text-secondary mt-3 pt-3 border-t border-border-main/40 leading-relaxed">
                        {faq.answer}
                      </p>
                    ) : null}
                  </div>
                  <svg 
                    className={`w-5 h-5 text-[#008A5E] shrink-0 transition-transform ${expandedId === faq.id ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-12 card-bubble bg-white border-2 border-border-main">
              <svg className="w-12 h-12 text-text-secondary/40 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-base font-extrabold text-text-h">Không tìm thấy câu hỏi phù hợp</p>
              <p className="text-sm font-bold text-text-secondary mt-1">Vui lòng thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>

        {/* Resources Section */}
        <div className="card-bubble bg-white p-6 shadow-sm border-2 border-border-main mt-4 text-left">
          <h2 className="text-xl font-black text-text-h mb-4">Tài nguyên & Hướng dẫn</h2>
          <div className="space-y-2">
            <a 
              href="#"
              className="block p-3.5 rounded-[16px] bg-bg-surface-1 hover:bg-bg-surface-2 border border-border-main/40 transition-all text-[#008A5E] font-extrabold text-base cursor-pointer"
            >
              → Cẩm nang sử dụng ứng dụng FARMY AI từ A-Z
            </a>
            <a 
              href="#"
              className="block p-3.5 rounded-[16px] bg-bg-surface-1 hover:bg-bg-surface-2 border border-border-main/40 transition-all text-[#008A5E] font-extrabold text-base cursor-pointer"
            >
              → Báo cáo lỗi kỹ thuật hoặc sự cố
            </a>
            <a 
              href="#"
              className="block p-3.5 rounded-[16px] bg-bg-surface-1 hover:bg-bg-surface-2 border border-border-main/40 transition-all text-[#008A5E] font-extrabold text-base cursor-pointer"
            >
              → Đề xuất tính năng mới cho Bé Thóc
            </a>
          </div>
        </div>

      </main>
    </div>
  );
};

export default HelpSupport;
