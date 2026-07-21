/* Hallmark · page: account-settings · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

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
    <div className="w-full min-h-[100svh] bg-bg-main text-text-main text-left font-sans pb-24 relative">
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        className="hidden"
      />
      
      <PageHeader 
        title="Thông tin tài khoản"
        subtitle="Quản lý hồ sơ cá nhân & vùng canh tác"
        leftButton="back"
      />

      {/* Main Content */}
      <main className="w-full max-w-3xl mx-auto pt-24 px-4 md:px-8 flex flex-col gap-4">
        
        {/* Profile Avatar Section */}
        <div className="card-bubble bg-white p-6 shadow-sm border-2 border-border-main text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-bg-surface-2 flex items-center justify-center border-4 border-border-main overflow-hidden relative shadow-sm">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-12 h-12 text-[#008A5E]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <p className="text-xl font-black text-text-h">{name}</p>
          <p className="text-sm font-bold text-text-secondary">Nông dân Siêng năng</p>
          <button 
            onClick={handleAvatarClick}
            disabled={isUploading}
            className="btn btn--cyan mt-4 px-5 py-2.5 rounded-full font-bold text-sm cursor-pointer disabled:opacity-50 active:scale-95"
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
              className="card-bubble bg-white p-6 shadow-sm border-2 border-border-main"
            >
              <h2 className="text-xl font-black text-text-h mb-4">Chỉnh sửa thông tin</h2>
              
              <div className="bg-bg-surface-1 rounded-[20px] overflow-hidden border-2 border-border-main">
                {/* Name Field */}
                <div className="p-4 border-b border-border-main/50">
                  <label className="block text-xs font-black text-text-secondary uppercase mb-1">Tên</label>
                  <input 
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-transparent text-base font-extrabold text-text-main focus:outline-none"
                  />
                </div>

                {/* Region Field */}
                <div className="p-4">
                  <label className="block text-xs font-black text-text-secondary uppercase mb-1">Khu vực</label>
                  <select 
                    value={editRegion}
                    onChange={(e) => setEditRegion(e.target.value)}
                    className="w-full bg-transparent text-base font-extrabold text-text-main focus:outline-none appearance-none cursor-pointer"
                  >
                    {PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={handleSaveName}
                  className="btn btn--cyan flex-1 py-3 font-extrabold text-sm cursor-pointer active:scale-95"
                >
                  Lưu thay đổi
                </button>
                <button 
                  onClick={handleCancel}
                  className="btn btn--soft flex-1 py-3 font-bold text-sm text-text-secondary cursor-pointer border-2 border-border-main/50 active:scale-95"
                >
                  Hủy
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="card-bubble bg-white p-6 shadow-sm border-2 border-border-main"
            >
              <h2 className="text-xl font-black text-text-h mb-4">Thông tin cá nhân</h2>
              
              <div className="bg-bg-surface-1 rounded-[20px] overflow-hidden border-2 border-border-main">
                {/* Name Info */}
                <div className="flex items-center justify-between p-4 border-b border-border-main/50">
                  <div>
                    <p className="text-xs text-text-secondary font-black uppercase">Tên nông dân</p>
                    <p className="text-base font-extrabold text-text-h">{name}</p>
                  </div>
                </div>

                {/* Region Info */}
                <div className="flex items-center justify-between p-4 border-b border-border-main/50">
                  <div>
                    <p className="text-xs text-text-secondary font-black uppercase">Vùng canh tác</p>
                    <p className="text-base font-extrabold text-text-h">{region}</p>
                  </div>
                </div>

                {/* Email Info */}
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-xs text-text-secondary font-black uppercase">Email liên hệ</p>
                    <p className="text-base font-extrabold text-text-h font-mono">{user?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <button 
                onClick={() => {
                  setIsEditingName(true);
                  setEditName(name);
                  setEditRegion(region);
                }}
                className="btn btn--cyan w-full mt-4 py-3 font-extrabold text-sm cursor-pointer"
              >
                Chỉnh sửa thông tin
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Account Status Section */}
        <div className="card-bubble bg-white p-6 shadow-sm border-2 border-border-main">
          <h2 className="text-xl font-black text-text-h mb-4">Trạng thái tài khoản</h2>
          
          <div className="bg-bg-surface-1 rounded-[20px] overflow-hidden border-2 border-border-main">
            {/* Account Created */}
            <div className="p-4 border-b border-border-main/50">
              <p className="text-xs text-text-secondary font-black uppercase">Ngày tạo tài khoản</p>
              <p className="text-base font-extrabold text-text-h">15 tháng 5 năm 2024</p>
            </div>

            {/* Account Status */}
            <div className="p-4 border-b border-border-main/50">
              <p className="text-xs text-text-secondary font-black uppercase">Trạng thái</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#008A5E]"></div>
                <p className="text-base font-extrabold text-[#008A5E]">Đang hoạt động</p>
              </div>
            </div>

            {/* Subscription Plan */}
            <div className="p-4">
              <p className="text-xs text-text-secondary font-black uppercase">Gói thành viên</p>
              <p className="text-base font-extrabold text-text-h">Miễn phí trọn đời</p>
            </div>
          </div>
        </div>

        {/* Privacy & Danger Zone */}
        <div className="card-bubble bg-white p-6 shadow-sm border-2 border-red-200">
          <h2 className="text-xl font-black text-text-h mb-3">Dữ liệu & Quyền riêng tư</h2>
          
          <button 
            onClick={handleExportData}
            className="btn btn--soft w-full py-3 font-bold text-sm text-text-main cursor-pointer border-2 border-border-main/50 mb-4 active:scale-95"
          >
            Xuất tập dữ liệu cá nhân (JSON)
          </button>

          <h2 className="text-xl font-black text-red-600 mb-3 mt-4">Vùng nguy hiểm</h2>
          <button 
            onClick={handleDeleteAccount}
            className="btn btn--coral w-full py-3 font-extrabold text-sm cursor-pointer active:scale-95"
          >
            Xóa vĩnh viễn tài khoản
          </button>
          <p className="text-xs font-bold text-red-500/80 mt-2 text-center">Lưu ý: Hành động này không thể phục hồi lại dữ liệu cũ</p>
        </div>

      </main>
    </div>
  );
};

export default AccountSettings;
