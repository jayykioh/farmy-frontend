import React, { useEffect, useState } from 'react';
import { getAdminUsers, updateAdminUserRole, deleteAdminUser, type UserAdminInfo } from '../api/admin';
import { Search, Trash2, Edit2, Check, X, Shield, Award, Calendar, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserAdminInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // States for editing user role
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState('');

  // Fetch users when parameters change
  const fetchUsers = () => {
    setLoading(true);
    getAdminUsers({ page, limit: 10, search, role: roleFilter })
      .then((res) => {
        setUsers(res.users);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch((err) => {
        toast.error('Lỗi tải danh sách người dùng: ' + (err.message || err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleSaveRole = (userId: string) => {
    updateAdminUserRole(userId, selectedRole)
      .then(() => {
        toast.success('Cập nhật vai trò người dùng thành công!');
        setEditingUserId(null);
        fetchUsers();
      })
      .catch((err) => {
        toast.error('Lỗi khi cập nhật vai trò: ' + (err.message || err));
      });
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa/khóa tài khoản "${userName}" không?`)) {
      deleteAdminUser(userId)
        .then(() => {
          toast.success('Đã khóa tài khoản thành công!');
          fetchUsers();
        })
        .catch((err) => {
          toast.error('Lỗi khi khóa tài khoản: ' + (err.message || err));
        });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="flex items-center gap-1 w-fit bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-full text-[12px] font-semibold">
            <Shield size={12} />
            Admin
          </span>
        );
      case 'moderator':
        return (
          <span className="flex items-center gap-1 w-fit bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full text-[12px] font-semibold">
            <Award size={12} />
            Mod
          </span>
        );
      default:
        return (
          <span className="w-fit bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[12px] font-semibold">
            User
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.01)] overflow-hidden">
      {/* Table Header / Filters */}
      <div className="p-6 border-b border-black/[0.04] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative flex items-center">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#f5f5f7] border border-black/[0.04] rounded-xl py-2.5 pl-10 pr-4 text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#08A855] focus:ring-1 focus:ring-[#08A855] transition-all"
          />
          <Search size={18} className="absolute left-3.5 text-[#86868b]" />
          <button type="submit" className="hidden">Tìm</button>
        </form>

        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="bg-white border border-black/[0.08] text-[13.5px] font-semibold rounded-xl px-4 py-2.5 outline-none focus:border-[#08A855] transition-all"
          >
            <option value="">Tất cả vai trò</option>
            <option value="user">Người dùng (User)</option>
            <option value="moderator">Điều phối viên (Mod)</option>
            <option value="admin">Quản trị viên (Admin)</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fcfcfd] border-b border-black/[0.03] text-[#86868b] text-[12px] font-bold uppercase tracking-wider">
              <th className="py-4 px-6">Tên & Email</th>
              <th className="py-4 px-6">Vai trò</th>
              <th className="py-4 px-6">Onboarding</th>
              <th className="py-4 px-6">Ngày tham gia</th>
              <th className="py-4 px-6 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.03]">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#08A855] mx-auto"></div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <AlertCircle size={28} className="text-[#86868b] mx-auto mb-2" />
                  <p className="text-[#86868b] text-[14px]">Không tìm thấy người dùng nào phù hợp</p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-black/[0.01] transition-all text-[#1d1d1f] text-[14px]">
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold">{user.name}</span>
                      <span className="text-[12px] text-[#86868b] font-medium">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {editingUserId === user._id ? (
                      <div className="flex items-center gap-1.5">
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="bg-white border border-black/[0.08] text-[12px] font-bold rounded-lg px-2.5 py-1 outline-none"
                        >
                          <option value="user">User</option>
                          <option value="moderator">Mod</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => handleSaveRole(user._id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Lưu"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="Hủy"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {getRoleBadge(user.role)}
                        <button
                          onClick={() => {
                            setEditingUserId(user._id);
                            setSelectedRole(user.role);
                          }}
                          className="p-1 text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04] rounded-md transition-colors"
                          title="Đổi vai trò"
                        >
                          <Edit2 size={12} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${
                        user.onboarding_completed
                          ? 'bg-[#e6f7ee] text-[#08a855]'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {user.onboarding_completed ? 'Hoàn thành' : 'Chưa'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5 text-[#86868b] text-[13px] font-medium">
                      <Calendar size={14} />
                      <span>{user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleDeleteUser(user._id, user.name)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full active:scale-95 transition-all inline-flex items-center"
                      title="Khóa/Xóa tài khoản"
                    >
                      <Trash2 size={16} />
                    </button>
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
            Hiển thị {users.length} trên tổng số {total} thành viên
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
  );
};

export default AdminUsers;
