import React, { useEffect } from 'react';
import { InsightList } from '../components/insights/InsightList';
import { usePageHeader } from '../contexts/PageHeaderContext';
import { BookOpen } from 'lucide-react';

const Insights: React.FC = () => {
  const { setPageHeaderVisible } = usePageHeader();

  useEffect(() => {
    setPageHeaderVisible(true);
    return () => setPageHeaderVisible(false);
  }, [setPageHeaderVisible]);

  return (
    <div className="w-full h-full min-h-[100svh] bg-[#fbfbfd] text-left font-sans pb-[100px] overflow-x-hidden relative">
      {/* Apple-Style Header */}
      <header className="relative w-full pt-16 md:pt-24 pb-8 md:pb-12 px-6 md:px-10 flex flex-col items-center md:items-start max-w-4xl mx-auto z-10">
        <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#86868b] w-fit">
            <BookOpen className="h-3.5 w-3.5 text-[#34C759]" />
            Báo cáo định kỳ
          </div>
          <h1 className="text-[36px] md:text-[44px] font-bold tracking-tight text-[#1d1d1f] leading-tight">
            Tổng hợp tuần
          </h1>
          <p className="text-[15px] font-medium text-[#86868b] max-w-xl">
            Dựa trên nhật ký chăm sóc của bạn, Bé Thóc đã tổng hợp và đưa ra những khuyến nghị canh tác chuyên sâu cho tuần tới.
          </p>
        </div>
      </header>
      
      <main className="w-full relative z-20">
        <InsightList />
      </main>
    </div>
  );
};

export default Insights;
