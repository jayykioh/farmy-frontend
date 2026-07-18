import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../components/PageHeader';
import { useAuthStore } from '../store/authStore';
import { deleteAccount, exportUserData } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { uploadSnapPhoto } from '../api/snaps';
import toast from 'react-hot-toast';

const PROVINCES = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu', 'Bắc Ninh',
  'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước', 'Bình Thuận', 'Cà Mau', 'Cần Thơ', 'Cao Bằng',
  'Đà Nẵng', 'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang',
  'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hải Phòng', 'Hậu Giang', 'Hòa Bình', 'Hưng Yên', 'Khánh Hòa',
  'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định',
  'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi',
  'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa',
  'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
];

export const AccountSettings: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(user?.name || 'Nông dân Ẩn danh');
  const [region, setRegion] = useState(user?.region || 'An Giang');
  const [editName, setEditName] = useState(name);
  const [editRegion, setEditRegion] = useState(region);
  
  const [isUploading, setIsUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const { clearSession } = useAuthStore();

  const handleSaveName = async () => {
    try {
      await updateProfile({ name: editName, region: editRegion });
      setName(editName);
      setRegion(editRegion);
      setIsEditingName(false);
      toast.success('Đã cập nhật hồ sơ của bạn thành công!');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi cập nhật hồ sơ!');
    }
  };

  const handleCancel = () => {
    setEditName(name);
    setEditRegion(region);
    setIsEditingName(false);
  };

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const upload = await uploadSnapPhoto(file);
      await updateProfile({ avatarUrl: upload.publicUrl });
      toast.success('Đã thay đổi ảnh đại diện thành công!');
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải ảnh đại diện lên. Vui lòng thử lại!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const blob = await exportUserData();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'farmy_user_data.json');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi xuất dữ liệu. Vui lòng thử lại!');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('CẢNH BÁO: Hành động này sẽ xóa toàn bộ dữ liệu của bạn và không thể hoàn tác. Bạn có chắc chắn muốn XÓA TÀI KHOẢN?')) {
      return;
    }
    
    try {
      await deleteAccount();
      toast.success('Tài khoản của bạn đã được đánh dấu xóa.');
      clearSession();
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Lỗi xóa tài khoản. Vui lòng thử lại!');
    }
  };

  return (
    <div className="w-full min-h-[100svh] bg-[#FBFBFD] text-left font-sans pb-24 md:pb-8">
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        className="hidden"
      />
      
      <PageHeader 
        title="Account Settings"
        subtitle="Thông tin tài khoản"
        leftButton="back"
      />

      {/* Main Content */}
      <main className="w-full max-w-3xl mx-auto pt-24 md:pt-20 px-4 md:px-8 flex flex-col gap-4">
        
        {/* Profile Avatar Section */}
        <div className="bg-white rounded-[24px] border border-black/[0.04] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#F5F5F7] flex items-center justify-center border-2 border-white overflow-hidden relative group shadow-sm">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <p className="text-lg font-bold text-text-main">{name}</p>
          <p className="text-sm text-text-main/60">Nông dân Siêng năng</p>
          <button 
            onClick={handleAvatarClick}
            disabled={isUploading}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-primary-container transition-colors cursor-pointer disabled:opacity-50"
          >
            {isUploading ? 'Đang tải...' : 'Thay đổi ảnh đại diện'}
          </button>
        </div>

        {/* Personal Information */}
        <AnimatePresence mode="wait">
          {isEditingName ? (
            <motion.div 
              key="edit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-[24px] border border-border-main/50 p-6 shadow-sm"
            >
              <h2 className="text-lg font-bold text-text-main mb-4">Chỉnh sửa thông tin</h2>
              
              <div className="bg-bg-surface-1 rounded-[16px] overflow-hidden border border-black/[0.04]">
                {/* Name Field */}
                <div className="p-4 border-b border-black/[0.04]">
                  <label className="block text-xs font-semibold text-text-main/60 uppercase mb-1">Tên</label>
                  <input 
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-transparent text-base font-semibold text-text-main focus:outline-none"
                  />
                </div>

                {/* Region Field */}
                <div className="p-4">
                  <label className="block text-xs font-semibold text-text-main/60 uppercase mb-1">Khu vực</label>
                  <select 
                    value={editRegion}
                    onChange={(e) => setEditRegion(e.target.value)}
                    className="w-full bg-transparent text-base font-semibold text-text-main focus:outline-none appearance-none"
                  >
                    {PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <motion.button 
                  whileTap={{ scale: 0.96 }}
                  onClick={handleSaveName}
                  className="flex-1 bg-primary text-white font-bold rounded-[16px] px-4 py-3 hover:bg-primary-container transition-colors shadow-sm"
                >
                  Lưu
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.96 }}
                  onClick={handleCancel}
                  className="flex-1 bg-white border border-border-main/50 text-text-main font-bold rounded-[16px] px-4 py-3 hover:bg-bg-surface-1 transition-colors shadow-sm"
                >
                  Hủy
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-[24px] border border-border-main/50 p-6 shadow-sm"
            >
              <h2 className="text-lg font-bold text-text-main mb-4">Thông tin cá nhân</h2>
              
              <div className="bg-bg-surface-1 rounded-[16px] overflow-hidden border border-black/[0.04]">
                {/* Name Info */}
                <div className="flex items-center justify-between p-4 border-b border-black/[0.04]">
                  <div>
                    <p className="text-xs text-text-main/60 font-semibold uppercase">Tên</p>
                    <p className="text-base font-semibold text-text-main">{name}</p>
                  </div>
                </div>

                {/* Region Info */}
                <div className="flex items-center justify-between p-4 border-b border-black/[0.04]">
                  <div>
                    <p className="text-xs text-text-main/60 font-semibold uppercase">Khu vực</p>
                    <p className="text-base font-semibold text-text-main">{region}</p>
                  </div>
                </div>

                {/* Email Info */}
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-xs text-text-main/60 font-semibold uppercase">Email</p>
                    <p className="text-base font-semibold text-text-main">{user?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <motion.button 
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setIsEditingName(true);
                  setEditName(name);
                  setEditRegion(region);
                }}
                className="w-full mt-4 bg-primary text-white font-bold rounded-[16px] px-4 py-3 hover:bg-primary-container transition-colors shadow-sm"
              >
                Chỉnh sửa thông tin
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Account Status Section */}
        <div className="bg-white rounded-[24px] border border-border-main/50 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-text-main mb-4">Trạng thái tài khoản</h2>
          
          <div className="bg-bg-surface-1 rounded-[16px] overflow-hidden border border-black/[0.04]">
            {/* Account Created */}
            <div className="p-4 border-b border-black/[0.04]">
              <p className="text-xs text-text-main/60 font-semibold uppercase">Ngày tạo tài khoản</p>
              <p className="text-base font-semibold text-text-main">15 tháng 5 năm 2024</p>
            </div>

            {/* Account Status */}
            <div className="p-4 border-b border-black/[0.04]">
              <p className="text-xs text-text-main/60 font-semibold uppercase">Trạng thái</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-success-main"></div>
                <p className="text-base font-semibold text-text-main">Hoạt động</p>
              </div>
            </div>

            {/* Subscription Plan */}
            <div className="p-4">
              <p className="text-xs text-text-main/60 font-semibold uppercase">Gói</p>
              <p className="text-base font-semibold text-text-main">Miễn phí</p>
            </div>
          </div>
        </div>

        {/* Privacy & Danger Zone */}
        <div className="bg-white rounded-[24px] border border-error-main/20 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-text-main mb-4">Dữ liệu & Quyền riêng tư</h2>
          
          <motion.button 
            whileTap={{ scale: 0.96 }}
            onClick={handleExportData}
            className="w-full bg-bg-surface-1 border border-border-main/50 text-text-main font-bold rounded-[16px] px-4 py-3 hover:bg-bg-surface transition-colors shadow-sm mb-4"
          >
            Xuất dữ liệu của tôi
          </motion.button>

          <h2 className="text-lg font-bold text-error-main mb-4 mt-6">Vùng nguy hiểm</h2>
          <motion.button 
            whileTap={{ scale: 0.96 }}
            onClick={handleDeleteAccount}
            className="w-full bg-error-light text-error-main font-bold rounded-[16px] px-4 py-3 hover:bg-error-light/80 transition-colors shadow-sm"
          >
            Xóa tài khoản
          </motion.button>
          <p className="text-xs text-error-main/70 mt-2 text-center">Hành động này không thể hoàn tác</p>
        </div>

      </main>
    </div>
  );
};

export default AccountSettings;
