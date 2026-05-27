import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';
import { PageHeader } from '../components/PageHeader';

export const PlantScan: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full min-h-[100svh] bg-bg-surface-1 relative text-left font-sans flex flex-col">
      
      <PageHeader 
        title="PlantScan"
        leftButton="back"
        rightButton="none"
      />

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-[72px] pb-[120px] md:pb-8 flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8 lg:gap-12 mt-4">
        
        {/* Left Column: Scan Preview Area */}
        <section className="col-span-12 md:col-span-6 lg:col-span-5 h-fit relative w-full aspect-[4/3] md:aspect-[3/4] lg:aspect-square rounded-[24px] md:rounded-[32px] border border-border-main/50 bg-bg-surface-1 overflow-hidden flex items-center justify-center shadow-sm">
          <img 
            alt="Scanned diseased leaf" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQcOeayO00Q7AYN14kkM6h3-DoHx-2cz97ChylDc3KYOZ_srxoqo_h7TaklWIWW4Hpix7NNF0XH5eC2rRCFE7c_YQ5UK3O6DrGFIz9hSn1yyaSOIz7kmdmKKa6vKfObc6sYyfDvufSCtFi0PUr_K_xwiD6Kwx5fbtTm-U6pJ-4lxC3bZ6GyOWpyVd76otH4SeVaV769g1_C-drbIxRDrAoc4QqUlzDjPYFU1sf1BlzHCx_MB8cGe9bsmCy1a-tZqNS3oN9zWeHFLoV" 
          />
          {/* Scanning Overlay Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-[bounce_3s_ease-in-out_infinite] w-full h-1/3 top-0 border-b-2 border-primary"></div>
        </section>

        {/* Right Column: Bé Thóc Dialogue & Result Card & Actions */}
        <div className="col-span-12 md:col-span-6 lg:col-span-7 flex flex-col gap-6">
          
          {/* Bé Thóc Dialogue & Result Card */}
          <section className="relative flex flex-col gap-4">
            
            {/* Mascot Dialogue */}
            <div className="flex items-end gap-3 z-10 md:mt-0 -mt-10 pl-4 relative">
              <div className="w-16 h-16 rounded-full border border-border-main/50 bg-white overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5 shadow-sm">
                <MascotLottie className="w-full h-full -mt-1" />
              </div>
              {/* Speech Bubble */}
              <div className="bg-white border border-border-main/50 rounded-[20px] rounded-bl-sm p-3 shadow-sm relative max-w-[250px] mb-2">
                <p className="font-bold text-sm text-text-main">Oh no! Looks like we found something.</p>
              </div>
            </div>
            
            {/* Result Card */}
            <div className="bg-white border border-border-main/50 rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex flex-col gap-4 md:gap-6 relative shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="font-extrabold text-[11px] md:text-xs text-secondary-dark uppercase tracking-wider bg-secondary-light/30 self-start px-2 py-0.5 rounded-full">Analysis Complete</span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-text-h mt-1 tracking-tight">Possible leaf disease detected</h2>
              </div>
              
              {/* Confidence Bar */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-sm text-text-main/70">Confidence</span>
                  <span className="text-2xl font-extrabold text-primary">92%</span>
                </div>
                {/* Thick Progress Bar */}
                <div className="h-4 md:h-5 bg-bg-surface-1 rounded-full overflow-hidden border border-border-main/30">
                  <div className="h-full bg-primary w-[92%] rounded-full relative transition-all duration-1000"></div>
                </div>
              </div>
              
              {/* Warning Badge */}
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-[16px] p-4 flex items-start gap-3 mt-2 shadow-sm">
                <svg className="w-6 h-6 mt-0.5 flex-shrink-0 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z"/>
                </svg>
                <p className="font-bold text-sm md:text-base leading-tight flex-1">Check pesticide safety interval before applying treatment.</p>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <section className="flex flex-col md:flex-row gap-3 md:gap-4 mt-2">
            {/* Primary Button */}
            <button 
              onClick={() => navigate('/diary/create')}
              className="w-full md:flex-1 bg-primary text-white font-bold text-lg md:text-xl py-4 md:py-5 px-6 rounded-full md:rounded-[20px] active:scale-95 transition-all flex justify-center items-center gap-2 shadow-[0_10px_20px_rgba(8,168,85,0.2)] hover:scale-[1.02]"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Save treatment
            </button>
            
            {/* Secondary Button */}
            <button 
              onClick={() => navigate('/chat/active')}
              className="w-full md:flex-1 bg-white text-text-main font-bold text-lg md:text-xl py-4 md:py-5 px-6 rounded-full md:rounded-[20px] border border-border-main/50 active:scale-95 transition-all flex justify-center items-center gap-2 shadow-sm hover:bg-bg-surface-1 hover:scale-[1.02]"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Ask AI advice
            </button>
          </section>

        </div>
      </main>
      
    </div>
  );
};

export default PlantScan;
