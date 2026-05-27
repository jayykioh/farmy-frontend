import React, { createContext, useContext, useState } from 'react';

interface PageHeaderContextType {
  isPageHeaderVisible: boolean;
  setPageHeaderVisible: (visible: boolean) => void;
}

const PageHeaderContext = createContext<PageHeaderContextType | undefined>(undefined);

export const PageHeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPageHeaderVisible, setPageHeaderVisible] = useState(false);

  return (
    <PageHeaderContext.Provider value={{ isPageHeaderVisible, setPageHeaderVisible }}>
      {children}
    </PageHeaderContext.Provider>
  );
};

export const usePageHeader = () => {
  const context = useContext(PageHeaderContext);
  if (!context) {
    throw new Error('usePageHeader must be used within PageHeaderProvider');
  }
  return context;
};
