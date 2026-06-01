import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';
import { PageHeader } from '../components/PageHeader';

export const ChatActive: React.FC = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');

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
            Today
          </span>
        </div>

        {/* User Message */}
        <div className="flex flex-col items-end w-full">
          <div className="bg-primary-container text-white p-4 rounded-[24px] rounded-br-sm shadow-md max-w-[85%] mb-2 border border-primary">
            <p className="font-medium text-base">My tomato plants are looking a bit yellow on the bottom leaves. Any idea what's wrong?</p>
          </div>
          <img 
            alt="Diseased Leaf" 
            className="w-32 h-32 object-cover rounded-[16px] border border-border-main/50 shadow-sm mb-2 mt-2" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyc2CklwPKEgfI6-9b0NNXtw4oq71KYLWnb4bN2-nKPkdmIXkM1bjtRm9oox1uKBm-XZcOXu6blKfXlhR6NVPLsE8SxjtCjfojB_ylJboSonAHMBf4pe5Xo4u_NvPI6XG1lsG9V8CmoJ4k2WjzaQXkyvALVHLoexhc1TkL-g1ZB_tEqB5X2DcZrnDi3LuppgIrAb7ymQasWMs4ujCGQkA8wBI2sVXXO8pfSaO8TVr95Tr6YQBB6Z-9-5sKNENewNkn75rDGzWsYpN0" 
          />
        </div>

        {/* AI Message */}
        <div className="flex flex-col items-start w-full mt-4">
          <div className="flex items-end gap-2 mb-1">
            <div className="w-10 h-10 rounded-full bg-white border border-border-main/50 flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-0.5">
              <MascotLottie className="w-full h-full -mt-1" />
            </div>
            <span className="font-bold text-sm text-text-main/70 ml-2 mb-1">Bé Thóc</span>
          </div>
          
          <div className="bg-white text-text-main p-4 rounded-[24px] rounded-bl-sm border border-border-main/50 max-w-[85%] shadow-sm ml-12 relative">
            
            <p className="font-medium text-base mb-2">I noticed signs of nutrient stress. It looks like it could be a nitrogen deficiency based on the yellowing starting from the older bottom leaves.</p>
            <p className="font-bold text-sm text-primary">Want to save this as a diary note?</p>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button 
                onClick={() => navigate('/diary/create')}
                className="bg-white text-text-main border border-border-main/50 px-4 py-2 rounded-full font-bold text-sm shadow-sm hover:-translate-y-[1px] hover:shadow-md transition-all active:scale-95 flex items-center gap-1"
              >
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg> 
                Save to diary
              </button>
              <button className="bg-white text-text-main border border-border-main/50 px-4 py-2 rounded-full font-bold text-sm shadow-sm hover:-translate-y-[1px] hover:shadow-md transition-all active:scale-95 flex items-center gap-1">
                <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
                Set reminder
              </button>
            </div>
          </div>
        </div>
        
        {/* Invisible spacer */}
        <div className="h-[20px]"></div>
      </main>

      {/* Chat Input Area - Fixed at bottom */}
      <div className="fixed bottom-24 md:bottom-8 left-0 right-0 w-full pt-6 pb-4 px-4 md:px-8 z-30 flex justify-center pointer-events-none">
        <div className="w-full max-w-3xl flex items-center gap-2 bg-white border border-border-main/50 rounded-full p-1 shadow-lg focus-within:shadow-xl focus-within:-translate-y-[2px] transition-all pointer-events-auto">
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
            className="flex-1 bg-transparent border-none focus:ring-0 font-medium text-base text-text-main placeholder:text-border-main h-full py-3 outline-none" 
            placeholder="Ask Bé Thóc anything..." 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          
          <button className="p-3 text-white bg-primary rounded-full hover:bg-primary-container transition-colors flex items-center justify-center mr-1 shadow-sm active:scale-95 cursor-pointer">
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
