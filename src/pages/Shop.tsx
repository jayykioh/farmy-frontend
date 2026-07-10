import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';
import { usePetStatus } from '../features/pet/hooks/usePetStatus';
import { PET_STATUS_FALLBACK } from '../features/pet/types/pet.types';

export const Shop: React.FC = () => {
  const navigate = useNavigate();
  const { data: petStatusRaw } = usePetStatus();
  const petStatus = petStatusRaw ?? PET_STATUS_FALLBACK;

  return (
    <div className="w-full h-full min-h-[100svh] relative text-left bg-gradient-to-b from-[#d0e5fa] to-[#79fc9e] bg-fixed overflow-x-hidden font-sans">
      
      {/* Ambient Background Elements */}
      <div className="fixed top-20 left-10 text-primary-container opacity-50 animate-[bounce_4s_ease-in-out_infinite]">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      </div>
      <div className="fixed top-40 right-12 text-secondary-dark opacity-60 animate-[bounce_5s_ease-in-out_infinite] delay-1000">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.69 2 6 4.69 6 8c0 3.31 2.69 6 6 6s6-2.69 6-6c0-3.31-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
        </svg>
      </div>
      <div className="fixed top-1/4 left-1/4 text-primary-container opacity-30 animate-[bounce_4s_ease-in-out_infinite]">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.5.3C13 20 20 15 20 8z" />
        </svg>
      </div>

      {/* Bottom Sheet / Modal Container */}
      <div className="fixed inset-x-0 bottom-0 top-[10%] md:top-auto md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white md:rounded-[40px] rounded-t-[40px] shadow-2xl flex flex-col z-40 overflow-hidden w-full md:max-w-4xl md:w-[90vw] md:h-[80vh] mx-auto border border-border-main/20">
        
        {/* Sheet Handle */}
        <div className="w-full flex justify-center pt-4 pb-2 md:hidden">
          <div className="w-16 h-1.5 rounded-full bg-border-main/50"></div>
        </div>
        
        {/* Header */}
        <div className="px-6 md:px-10 pb-4 pt-2 md:pt-10 flex justify-between items-center relative border-b border-border-main/10 md:border-none">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-bg-surface-1 flex items-center justify-center text-text-main/70 active:scale-95 transition-all hover:bg-border-main/50 border border-border-main/30"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h1 className="text-xl md:text-2xl font-extrabold text-text-h text-center flex-1">Cửa hàng Phụ kiện</h1>
          
          {/* Dynamic Currency / XP Badge */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1.5 md:px-4 md:py-2 flex items-center gap-1.5 shadow-sm hover:scale-105 transition-transform">
            <span className="font-extrabold text-yellow-800 md:text-sm text-xs bg-yellow-100/50 px-2 py-0.5 rounded-full font-mono">Lv.{petStatus.level}</span>
            <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span className="font-extrabold text-yellow-800 md:text-lg font-mono">{petStatus.exp} XP</span>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-32 md:pb-12 flex flex-col lg:flex-row">
          
          {/* Left/Top Section: Preview */}
          <div className="w-full lg:w-1/3 flex flex-col">
            {/* Category Chips (Horizontal Scroll) */}
            <div className="flex lg:flex-wrap gap-2 px-6 md:px-10 py-2 overflow-x-auto scrollbar-hide lg:mb-4">
              <button className="px-5 py-2 rounded-full bg-primary text-white font-bold whitespace-nowrap shadow-sm active:scale-95 transition-transform hover:bg-primary-dark">
                Mũ
              </button>
              <button className="px-5 py-2 rounded-full bg-bg-surface-1 border border-border-main/30 text-text-main/70 font-bold whitespace-nowrap active:scale-95 transition-transform hover:bg-border-main/20 hover:text-text-main">
                Trang phục
              </button>
              <button className="px-5 py-2 rounded-full bg-bg-surface-1 border border-border-main/30 text-text-main/70 font-bold whitespace-nowrap active:scale-95 transition-transform hover:bg-border-main/20 hover:text-text-main">
                Hiệu ứng
              </button>
              <button className="px-5 py-2 rounded-full bg-bg-surface-1 border border-border-main/30 text-text-main/70 font-bold whitespace-nowrap active:scale-95 transition-transform hover:bg-border-main/20 hover:text-text-main">
                Nền
              </button>
            </div>

            {/* Diorama Preview */}
            <div className="mx-6 md:mx-10 mt-4 mb-8 rounded-[32px] h-[280px] lg:h-[350px] bg-bg-surface-1 border border-border-main/30 relative overflow-hidden flex items-center justify-center shadow-inner group">
              {/* Wavy Grass Background for Diorama */}
              <div className="absolute inset-x-0 bottom-0 h-32 opacity-40 group-hover:opacity-60 transition-opacity">
                <svg preserveAspectRatio="none" viewBox="0 0 1440 320" className="w-full h-full">
                  <path fill="#08a855" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
              </div>
              {/* Mascot (Bé Thóc) */}
              <div className="relative z-10 animate-[bounce_4s_ease-in-out_infinite] flex flex-col items-center">
                <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-full shadow-lg bg-white border-4 border-white overflow-hidden p-2">
                  <MascotLottie className="w-full h-full -mt-2 drop-shadow-md" state={petStatus.mood} />
                </div>
                {/* Equipped Accessory Indicator */}
                <div className="absolute -top-4 right-0 lg:-top-2 lg:right-2 bg-secondary rounded-full p-1 lg:p-2 shadow-md border-2 border-white">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Accessory Grid */}
          <div className="w-full lg:w-2/3 px-6 md:px-10 lg:pl-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 pb-12 lg:pb-0 h-fit">
            
            {/* Item Card 1 */}
            <div className="bg-white border border-border-main/50 shadow-sm rounded-[24px] p-4 flex flex-col items-center group hover:shadow-md transition-shadow">
              <div className="w-full aspect-square rounded-2xl bg-bg-surface-1 border border-border-main/30 mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-primary-lightest/20 transition-colors">
                <img alt="Nón Lá Truyền Thống" className="w-3/4 h-3/4 object-contain animate-[bounce_4s_ease-in-out_infinite]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzSmV6cdrTVHzXBG0N7bXXKN3XoZOzRMPXfVSxi0cvLV86eZCvMCQUZfvsIwGmGFQCrdkVZZ0fPQlcFxA7lT7026GIQqk5q37hMvRuTScXcwmvL2MxEFkY_EjgDBSeSHb7xTRqUPbj1MRY_BqwkhLCcAZ36PrGji9H9EPDb67uNr4UmWBqmiirxAhuuidfFZvbiQYTWZytovpLIpFDBOt949vcQkwFPZijhl9qeWhHM_-dZdg6jkw_Rc8N5-0j2r42RYKLnkeCUeC1" />
              </div>
              <h3 className="font-bold text-text-main text-center mb-1 w-full truncate">Nón Lá Truyền Thống</h3>
              <div className="flex items-center gap-1 bg-bg-surface-1 border border-border-main/30 rounded-full px-2 py-0.5 mb-4">
                <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <span className="font-bold text-text-main/70 text-sm font-mono">300</span>
              </div>
              <button className="w-full py-2 bg-primary text-white rounded-full font-bold shadow-sm active:scale-95 transition-transform border-b-[3px] border-primary-container active:border-b-0 active:translate-y-[3px]">
                Đã trang bị
              </button>
            </div>
            
            {/* Item Card 2 */}
            <div className="bg-white border border-border-main/50 shadow-sm rounded-[24px] p-4 flex flex-col items-center group hover:shadow-md transition-shadow">
              <div className="w-full aspect-square rounded-2xl bg-bg-surface-1 border border-border-main/30 mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-primary-lightest/20 transition-colors">
                <img alt="Mũ Rơm Đi Biển" className="w-3/4 h-3/4 object-contain animate-[bounce_5s_ease-in-out_infinite] delay-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARFPmbrP2z0o6zbdd7uP-bPyY-SYnnTKkCOADA4RXRYqu2DrDeYGWguF5cykN1-ipwc2P6p6Cdq96yLVJvgR1oqfJAvNSKCfqQBg_SSujhyLfnD2BgmghulIgXOt3-E7AF3ZQncims2yYMtwOubGUkLpo2UYElzRRbTXkWTIi2CCPypLVhBOKihE9dsp9a2IqHkXPe3bJtg8mF2y3G-fvmq7x0mHfYBvnuEy3WPQy9N0Eg5LVtORi1oHeGPGOIlDBT-CRD8PEElFRL" />
              </div>
              <h3 className="font-bold text-text-main text-center mb-1 w-full truncate">Mũ Rơm Đi Biển</h3>
              <div className="flex items-center gap-1 bg-bg-surface-1 border border-border-main/30 rounded-full px-2 py-0.5 mb-4">
                <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <span className="font-bold text-text-main/70 text-sm font-mono">450</span>
              </div>
              <button className="w-full py-2 bg-white border border-border-main/50 text-text-main rounded-full font-bold active:scale-95 transition-transform hover:bg-bg-surface-1 shadow-sm">
                Mua ngay
              </button>
            </div>
            
            {/* Item Card 3 */}
            <div className="bg-white border border-border-main/50 shadow-sm rounded-[24px] p-4 flex flex-col items-center group hover:shadow-md transition-shadow">
              <div className="w-full aspect-square rounded-2xl bg-bg-surface-1 border border-border-main/30 mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-primary-lightest/20 transition-colors">
                <img alt="Kính Râm Ngầu" className="w-3/4 h-3/4 object-contain animate-[bounce_4s_ease-in-out_infinite]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9cOVVDdur_i-PyVaZ5wgi_eWdCMep-I4DMSFJWI7uVcGdz5kFluH_59odvnj3HLiPOr8nZO2JAQhoVYU_T8hJ1ZPy0aL2Ufn-32LWyqO_inFt5Xk9aP1MUiR-l1odRI2kNKJ0blEaFsLoV6MGeYjhWz0QNUtERuxYcgICpIbiSQdTgCdjb_5N5Ao-tMDNIi23DK2xmSunDTB3D4fvQgPX_QpgYfxiugGxZTJPeTFFA7qBvhkQeo0NVUo4nMaeFLa6r96NpTBGOJaY" />
              </div>
              <h3 className="font-bold text-text-main text-center mb-1 w-full truncate">Kính Râm Ngầu</h3>
              <div className="flex items-center gap-1 bg-bg-surface-1 border border-border-main/30 rounded-full px-2 py-0.5 mb-4">
                <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <span className="font-bold text-text-main/70 text-sm font-mono">200</span>
              </div>
              <button className="w-full py-2 bg-white border border-border-main/50 text-text-main rounded-full font-bold active:scale-95 transition-transform hover:bg-bg-surface-1 shadow-sm">
                Mua ngay
              </button>
            </div>
            
            {/* Item Card 4 (Locked under Level 5) */}
            <div className="bg-white border border-border-main/50 shadow-sm rounded-[24px] p-4 flex flex-col items-center group hover:shadow-md transition-shadow">
              <div className="w-full aspect-square rounded-2xl bg-bg-surface-1 border border-border-main/30 mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-primary-lightest/20 transition-colors">
                {petStatus.level >= 5 ? (
                  <img alt="Mũ Ảo Thuật" className="w-3/4 h-3/4 object-contain animate-[bounce_4s_ease-in-out_infinite]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzSmV6cdrTVHzXBG0N7bXXKN3XoZOzRMPXfVSxi0cvLV86eZCvMCQUZfvsIwGmGFQCrdkVZZ0fPQlcFxA7lT7026GIQqk5q37hMvRuTScXcwmvL2MxEFkY_EjgDBSeSHb7xTRqUPbj1MRY_BqwkhLCcAZ36PrGji9H9EPDb67uNr4UmWBqmiirxAhuuidfFZvbiQYTWZytovpLIpFDBOt949vcQkwFPZijhl9qeWhHM_-dZdg6jkw_Rc8N5-0j2r42RYKLnkeCUeC1" />
                ) : (
                  <div className="text-text-main/30 flex flex-col items-center">
                    <svg className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="font-bold text-xs uppercase tracking-wide">Cấp 5</span>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-text-main text-center mb-1 w-full truncate">Mũ Ảo Thuật</h3>
              <div className="flex items-center gap-1 bg-bg-surface-1 border border-border-main/30 rounded-full px-2 py-0.5 mb-4">
                <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <span className="font-bold text-text-main/70 text-sm font-mono">800</span>
              </div>
              {petStatus.level >= 5 ? (
                <button className="w-full py-2 bg-white border border-border-main/50 text-text-main rounded-full font-bold active:scale-95 transition-transform hover:bg-bg-surface-1 shadow-sm">
                  Mua ngay
                </button>
              ) : (
                <button className="w-full py-2 bg-bg-surface border border-border-main/30 text-text-main/30 rounded-full font-bold cursor-not-allowed">
                  Khóa
                </button>
              )}
            </div>
            
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Shop;
