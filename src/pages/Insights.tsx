import React, { useEffect } from 'react';
import { InsightList } from '../components/insights/InsightList';
import { usePageHeader } from '../contexts/PageHeaderContext';

const Insights: React.FC = () => {
  const { setPageHeaderVisible } = usePageHeader();

  useEffect(() => {
    setPageHeaderVisible(true);
    // Cleanup if needed
    return () => setPageHeaderVisible(false);
  }, [setPageHeaderVisible]);

  return (
    <div className="w-full h-full max-w-2xl mx-auto pb-24 md:pb-8 pt-4">
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-bold text-text-main">Phân Tích Tuần</h1>
        <p className="text-text-secondary text-sm mt-1">Tổng hợp và lời khuyên canh tác từ AI</p>
      </div>
      
      <InsightList />
    </div>
  );
};

export default Insights;
