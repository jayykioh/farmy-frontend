/* Hallmark · page: admin-reminders · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useEffect, useState } from 'react';
import { getAdminReminders, sendAdminManualNotification } from '../api/admin';
import { Bell, Calendar, CheckCircle, XCircle, Clock, WarningCircle, PaperPlaneRight, Users, Warning } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

type Reminder = {
  _id: string;
  user_id: { _id: string; name: string; email: string } | null;
  title: string;
  type: string;
  status: 'pending' | 'completed' | 'canceled';
  remind_at: string;
  created_at: string;
};

export const AdminReminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // States for sending manual notification
  const [targetUserId, setTargetUserId] = useState('');
  const [targetUserName, setTargetUserName] = useState('');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationBody, setNotificationBody] = useState('');
  const [sending, setSending] = useState(false);

  const fetchReminders = () => {
    setLoading(true);
    getAdminReminders({ page, limit: 10 })
      .then((res) => {
        setReminders(res.reminders);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch((err) => {
        toast.error('Lỗi khi tải nhắc nhở: ' + (err.message || err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReminders();
  }, [page]);

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId) {
      toast.error('Vui lòng chọn người nhận!');
      return;
    }
    if (!notificationTitle || !notificationBody) {
      toast.error('Vui lòng nhập đầy đủ tiêu đề và nội dung!');
      return;
    }

    setSending(true);
    sendAdminManualNotification({
      userId: targetUserId,
      title: notificationTitle,
      body: notificationBody,
    })
      .then((res) => {
        toast.success(res.message || 'Gửi thông báo thành công!');
        setNotificationTitle('');
        setNotificationBody('');
        setTargetUserId('');
        setTargetUserName('');
      })
      .catch((err) => {
        toast.error('Lỗi gửi thông báo: ' + (err.message || err));
      })
      .finally(() => {
        setSending(false);
      });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 w-fit bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-black">
            <CheckCircle size={12} weight="bold" />
            Đã xong
          </span>
        );
      case 'canceled':
        return (
          <span className="flex items-center gap-1 w-fit bg-red-100 text-red-800 border border-red-300 px-2.5 py-0.5 rounded-full text-xs font-black">
            <XCircle size={12} weight="bold" />
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 w-fit bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full text-xs font-black">
            <Clock size={12} weight="bold" />
            Đang chờ
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 text-left font-sans">
      {/* Reminders List Table */}
      <div className="lg:col-span-2 card-bubble bg-white rounded-3xl border-2 border-border-main shadow-xs overflow-hidden">
        <div className="p-6 border-b-2 border-border-main">
          <h3 className="font-black text-text-h text-lg">Danh sách nhắc nhở hệ thống</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-surface-1 border-b-2 border-border-main text-text-secondary text-xs font-black uppercase tracking-wider">
                <th className="py-4 px-6">Nông dân</th>
                <th className="py-4 px-6">Công việc</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6">Thời gian</th>
                <th className="py-4 px-6 text-center">Gửi tin</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border-main/40">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-border-main border-t-[#008A5E] mx-auto"></div>
                  </td>
                </tr>
              ) : reminders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <WarningCircle size={32} weight="duotone" className="text-text-secondary mx-auto mb-2" />
                    <p className="text-text-secondary font-bold text-sm">Không có nhắc nhở nào trong hệ thống</p>
                  </td>
                </tr>
              ) : (
                reminders.map((reminder) => (
                  <tr key={reminder._id} className="hover:bg-bg-surface-1/50 transition-colors text-text-main text-sm font-bold">
                    <td className="py-4 px-6">
                      {reminder.user_id ? (
                        <div className="flex flex-col">
                          <span className="font-black text-text-h">{reminder.user_id.name}</span>
                          <span className="text-xs text-text-secondary font-bold">{reminder.user_id.email}</span>
                        </div>
                      ) : (
                        <span className="text-text-secondary italic text-xs font-bold">Khách vãng lai</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-black text-text-h">{reminder.title}</span>
                        <span className="text-xs text-[#008A5E] font-black uppercase">{reminder.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(reminder.status)}</td>
                    <td className="py-4 px-6 text-xs font-bold text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} weight="bold" />
                        <span>{new Date(reminder.remind_at).toLocaleString('vi-VN')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {reminder.user_id && (
                        <button
                          onClick={() => {
                            setTargetUserId(reminder.user_id?._id || '');
                            setTargetUserName(reminder.user_id?.name || '');
                          }}
                          className="p-2 text-[#008A5E] bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-2xl active:scale-95 transition-all inline-flex items-center cursor-pointer"
                          title="Gửi thông báo đẩy"
                        >
                          <PaperPlaneRight size={14} weight="bold" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && totalPages > 1 && (
          <div className="p-5 border-t-2 border-border-main flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary">
              Hiển thị {reminders.length} trên {total} nhắc nhở
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="btn btn--soft active:scale-95 rounded-2xl px-3.5 py-1.5 text-xs font-black border-2 border-border-main cursor-pointer disabled:opacity-40"
              >
                Trang trước
              </button>
              <span className="text-xs text-text-h font-black px-2">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="btn btn--soft active:scale-95 rounded-2xl px-3.5 py-1.5 text-xs font-black border-2 border-border-main cursor-pointer disabled:opacity-40"
              >
                Trang sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Send Manual Notification Form */}
      <div className="card-bubble bg-white p-6 rounded-3xl border-2 border-border-main shadow-xs h-fit flex flex-col gap-5">
        <div>
          <h3 className="font-black text-text-h text-lg flex items-center gap-2">
            <Bell size={20} weight="duotone" className="text-[#008A5E]" />
            Gửi thông báo thủ công
          </h3>
          <p className="text-text-secondary text-xs font-bold mt-1 leading-relaxed">
            Gửi trực tiếp một cảnh báo/tin nhắn nhắc nhở đến thiết bị nông dân đã bật Push Notification.
          </p>
        </div>

        <form onSubmit={handleSendNotification} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black uppercase text-text-secondary">Người nhận</label>
            {targetUserName ? (
              <div className="flex items-center justify-between bg-emerald-50 border-2 border-emerald-300 rounded-2xl px-4 py-2.5">
                <span className="text-xs text-emerald-900 font-black flex items-center gap-2">
                  <Users size={16} weight="bold" />
                  {targetUserName}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setTargetUserId('');
                    setTargetUserName('');
                  }}
                  className="text-red-600 hover:underline font-black text-xs cursor-pointer active:scale-95 transition-transform"
                >
                  Đổi
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl text-amber-900 text-xs font-bold">
                <Warning size={16} weight="bold" className="shrink-0 text-amber-600" />
                <span>Nhấn nút icon máy bay (<PaperPlaneRight size={10} weight="bold" className="inline" />) ở cột Thao tác trong danh sách để chọn nông dân.</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-black uppercase text-text-secondary">Tiêu đề thông báo</label>
            <input
              type="text"
              placeholder="Ví dụ: Cảnh báo sương muối, Tưới vườn lá..."
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              className="bg-bg-surface-1 border-2 border-border-main rounded-2xl px-4 py-2.5 text-sm font-bold text-text-main outline-none focus:bg-white focus:border-[#008A5E] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-black uppercase text-text-secondary">Nội dung thông báo</label>
            <textarea
              placeholder="Nhập chi tiết nội dung tin nhắn cần gửi đến nông dân..."
              rows={4}
              value={notificationBody}
              onChange={(e) => setNotificationBody(e.target.value)}
              className="bg-bg-surface-1 border-2 border-border-main rounded-2xl px-4 py-2.5 text-sm font-bold text-text-main outline-none focus:bg-white focus:border-[#008A5E] transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={sending || !targetUserId}
            className="btn btn--cyan active:scale-95 rounded-2xl w-full py-3.5 text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 mt-2"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
            ) : (
              <PaperPlaneRight size={16} weight="bold" />
            )}
            <span>Bắt đầu gửi thông báo</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminReminders;
