import React, { useEffect, useState } from 'react';
import { getAdminReminders, sendAdminManualNotification } from '../api/admin';
import { Bell, Calendar, CheckCircle2, XCircle, Clock, AlertCircle, Send, Users, AlertTriangle } from 'lucide-react';
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
          <span className="flex items-center gap-1 w-fit bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full text-[12px] font-semibold">
            <CheckCircle2 size={12} />
            Đã xong
          </span>
        );
      case 'canceled':
        return (
          <span className="flex items-center gap-1 w-fit bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-full text-[12px] font-semibold">
            <XCircle size={12} />
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 w-fit bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full text-[12px] font-semibold">
            <Clock size={12} />
            Đang chờ
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Reminders List Table */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.01)] overflow-hidden">
        <div className="p-6 border-b border-black/[0.04]">
          <h3 className="font-bold text-[#1d1d1f] text-[16px]">Danh sách nhắc nhở</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fcfcfd] border-b border-black/[0.03] text-[#86868b] text-[12px] font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Nông dân</th>
                <th className="py-4 px-6">Công việc</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6">Thời gian</th>
                <th className="py-4 px-6 text-center">Gửi tin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.03]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#08A855] mx-auto"></div>
                  </td>
                </tr>
              ) : reminders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <AlertCircle size={28} className="text-[#86868b] mx-auto mb-2" />
                    <p className="text-[#86868b] text-[14px]">Không có nhắc nhở nào trong hệ thống</p>
                  </td>
                </tr>
              ) : (
                reminders.map((reminder) => (
                  <tr key={reminder._id} className="hover:bg-black/[0.01] transition-all text-[#1d1d1f] text-[14px]">
                    <td className="py-4 px-6">
                      {reminder.user_id ? (
                        <div className="flex flex-col">
                          <span className="font-bold">{reminder.user_id.name}</span>
                          <span className="text-[12px] text-[#86868b] font-medium">{reminder.user_id.email}</span>
                        </div>
                      ) : (
                        <span className="text-[#86868b]">Ẩn danh</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold">{reminder.title}</span>
                        <span className="text-[12px] text-[#86868b] font-medium uppercase tracking-wider">{reminder.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(reminder.status)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-[#86868b] text-[13px] font-medium">
                        <Calendar size={14} />
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
                          className="p-2 text-[#08A855] hover:bg-[#e6f7ee] rounded-full active:scale-95 transition-all inline-flex items-center"
                          title="Gửi thông báo đẩy"
                        >
                          <Send size={14} />
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
          <div className="p-5 border-t border-black/[0.03] flex items-center justify-between">
            <span className="text-[13.5px] text-[#86868b] font-medium">
              Hiển thị {reminders.length} trên {total} nhắc nhở
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3.5 py-1.5 border border-black/[0.08] text-[13px] font-bold rounded-xl hover:bg-black/[0.02] disabled:opacity-40 disabled:hover:bg-transparent transition-all"
              >
                Trang trước
              </button>
              <span className="text-[13px] text-[#1d1d1f] font-bold px-2">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3.5 py-1.5 border border-black/[0.08] text-[13px] font-bold rounded-xl hover:bg-black/[0.02] disabled:opacity-40 disabled:hover:bg-transparent transition-all"
              >
                Trang sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Send Manual Notification Form */}
      <div className="bg-white p-6 rounded-2xl border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.01)] h-fit flex flex-col gap-5">
        <div>
          <h3 className="font-bold text-[#1d1d1f] text-[16px] flex items-center gap-1.5">
            <Bell size={18} className="text-[#08A855]" />
            Gửi thông báo đẩy thủ công
          </h3>
          <p className="text-[#86868b] text-[12.5px] mt-1">
            Gửi trực tiếp một cảnh báo/tin nhắn nhắc nhở đến thiết bị nông dân đã đăng ký Push Notification.
          </p>
        </div>

        <form onSubmit={handleSendNotification} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#1d1d1f]">Người nhận</label>
            {targetUserName ? (
              <div className="flex items-center justify-between bg-[#e6f7ee] border border-[#a2e3be] rounded-xl px-4 py-2.5">
                <span className="text-[13.5px] text-[#067a3d] font-bold flex items-center gap-1.5">
                  <Users size={14} />
                  {targetUserName}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setTargetUserId('');
                    setTargetUserName('');
                  }}
                  className="text-[#86868b] hover:text-red-500 font-bold text-[13px]"
                >
                  Đổi
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-[12.5px]">
                <AlertTriangle size={16} className="shrink-0 text-amber-600" />
                <span>Nhấn nút gửi tin (<Send size={10} className="inline" />) ở dòng tương ứng của nông dân trong bảng để chọn.</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#1d1d1f]">Tiêu đề thông báo</label>
            <input
              type="text"
              placeholder="e.g. Cảnh báo thời tiết, Tưới nước cây..."
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              className="bg-[#f5f5f7] border border-black/[0.04] rounded-xl px-4 py-2.5 text-[13.5px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#08A855] focus:ring-1 focus:ring-[#08A855] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#1d1d1f]">Nội dung thông báo</label>
            <textarea
              placeholder="Nhập nội dung tin nhắn gửi tới nông dân..."
              rows={4}
              value={notificationBody}
              onChange={(e) => setNotificationBody(e.target.value)}
              className="bg-[#f5f5f7] border border-black/[0.04] rounded-xl px-4 py-2.5 text-[13.5px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#08A855] focus:ring-1 focus:ring-[#08A855] transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={sending || !targetUserId}
            className="flex items-center justify-center gap-2 bg-[#08A855] text-white py-2.5 rounded-xl text-[14px] font-bold shadow-[0_4px_12px_rgba(8,168,85,0.15)] hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:active:scale-100 transition-all mt-2"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send size={14} />
            )}
            <span>Gửi thông báo</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminReminders;
