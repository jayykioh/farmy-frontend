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
      question: 'FarmDiaries AI là gì?',
      answer: 'FarmDiaries AI là ứng dụng chăm sóc nông trại toàn diện, giúp bạn ghi nhật ký nông trại, chẩn đoán bệnh cây bằng AI, và nhận tư vấn từ Bé Thóc - trợ lý ảo thông minh của bạn.'
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
      question: 'Tôi có thể kết nối Zalo không?',
      answer: 'Có! Kết nối Zalo để nhận nhắc nhở trực tiếp qua ứng dụng Zalo. Vào Settings > Thông báo và bật "Kết nối Zalo".'
    },
    {
      id: 10,
      category: 'Khác',
      question: 'Dữ liệu của tôi có an toàn không?',
      answer: 'Có. FarmDiaries AI sử dụng mã hóa tiêu chuẩn để bảo vệ dữ liệu của bạn. Chúng tôi không bao giờ chia sẻ thông tin cá nhân của bạn với bên thứ ba.'
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
    <div className="w-full min-h-[100svh] bg-bg-surface-1 text-left font-sans pb-24 md:pb-8">
      <PageHeader 
        title="Help & Support"
        subtitle="Trợ giúp và hỗ trợ"
        leftButton="back"
      />
      {/* Main Content */}
      <main className="w-full max-w-3xl mx-auto pt-24 md:pt-20 px-4 md:px-8 flex flex-col gap-4">
        
        {/* Search Bar */}
        <div className="relative">
          <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-main/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-border-main/50 rounded-full py-3 pl-12 pr-4 font-medium text-base text-text-main placeholder:text-border-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        {/* Contact Card */}
        <div className="bg-white rounded-[24px] border border-border-main/50 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Cần giúp đỡ?
          </h2>
          <p className="text-base text-text-main/70 mb-4">Không tìm thấy câu trả lời? Liên hệ với chúng tôi qua email hoặc Zalo.</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <a 
              href="mailto:support@farmdiary.ai"
              className="flex items-center justify-center gap-2 bg-primary text-white font-bold rounded-full px-6 py-3 shadow-sm hover:bg-primary-container transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </a>
            <button className="flex items-center justify-center gap-2 bg-white border border-primary text-primary font-bold rounded-full px-6 py-3 shadow-sm hover:bg-bg-surface-1 transition-colors cursor-pointer">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.5 1H15.5C18.59 1 21 3.41 21 6.5V16C21 19.59 18.59 22 15.5 22H8.5C5.41 22 3 19.59 3 16V6.5C3 3.41 5.41 1 8.5 1M12 20C13.66 20 15 18.66 15 17H9C9 18.66 10.34 20 12 20M20 5H4V16C4 18.77 6.22 21 9 21H15C17.78 21 20 18.77 20 16V5Z"/>
              </svg>
              Zalo
            </button>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(category => (
            <button 
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white border border-border-main/50 text-text-main hover:bg-bg-surface-1'
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
                className="w-full text-left bg-white rounded-[24px] border border-border-main/50 p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-base text-text-main group-hover:text-primary transition-colors">
                      {faq.question}
                    </p>
                    {expandedId === faq.id ? (<p className="text-sm text-text-main/70 mt-3">
                      {faq.answer}
                    </p>) : null}
                  </div>
                  <svg 
                    className={`w-5 h-5 text-primary shrink-0 transition-transform ${expandedId === faq.id ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-text-main/30 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-base text-text-main/60">Không tìm thấy câu hỏi phù hợp</p>
              <p className="text-sm text-text-main/40 mt-1">Vui lòng thử tìm kiếm khác</p>
            </div>
          )}
        </div>

        {/* Resources Section */}
        <div className="bg-white rounded-[24px] border border-border-main/50 p-6 shadow-sm mt-6">
          <h2 className="text-lg font-bold text-text-main mb-4">Tài nguyên khác</h2>
          <div className="space-y-2">
            <a 
              href="#"
              className="block p-3 rounded-[12px] bg-bg-surface-1 hover:bg-bg-surface hover:shadow-sm transition-all text-primary font-semibold text-base group cursor-pointer"
            >
              → Xem Hướng dẫn sử dụng đầy đủ
            </a>
            <a 
              href="#"
              className="block p-3 rounded-[12px] bg-bg-surface-1 hover:bg-bg-surface hover:shadow-sm transition-all text-primary font-semibold text-base group cursor-pointer"
            >
              → Báo cáo vấn đề
            </a>
            <a 
              href="#"
              className="block p-3 rounded-[12px] bg-bg-surface-1 hover:bg-bg-surface hover:shadow-sm transition-all text-primary font-semibold text-base group cursor-pointer"
            >
              → Yêu cầu tính năng
            </a>
          </div>
        </div>

      </main>
    </div>
  );
};

export default HelpSupport;
