/* Hallmark · page: insights · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useEffect } from 'react';
import { InsightList } from '../components/insights/InsightList';
import { usePageHeader } from '../contexts/PageHeaderContext';
import { BookOpen } from '@phosphor-icons/react';

const Insights: React.FC = () => {
  const { setPageHeaderVisible } = usePageHeader();

  useEffect(() => {
    setPageHeaderVisible(true);
    return () => setPageHeaderVisible(false);
  }, [setPageHeaderVisible]);

  return (
    <div className="w-full h-full min-h-[100svh] bg-bg-main text-text-main text-left font-sans pb-24 overflow-x-hidden relative">
      {/* Header */}
      <header className="relative w-full pt-16 md:pt-24 pb-8 md:pb-10 px-6 md:px-10 flex flex-col items-center md:items-start max-w-4xl mx-auto z-10">
        <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full card-bubble bg-white border-2 border-border-main shadow-xs px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#008A5E] w-fit">
            <BookOpen className="h-3.5 w-3.5 text-[#008A5E]" weight="duotone" />
            Báo cáo định kỳ
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-h leading-tight mt-1">
            Tổng hợp thông tin tuần
          </h1>
          <p className="text-sm md:text-base font-bold text-text-secondary max-w-xl">
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
