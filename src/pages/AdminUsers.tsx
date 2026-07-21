/* Hallmark · page: admin-users · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useEffect, useState } from 'react';
import { getAdminUsers, updateAdminUserRole, deleteAdminUser, type UserAdminInfo } from '../api/admin';
import { MagnifyingGlass, Trash, NotePencil, Check, X, Shield, Trophy, Calendar, WarningCircle } from '@phosphor-icons/react';
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
          <span className="flex items-center gap-1 w-fit bg-red-100 text-red-700 border border-red-300 px-2.5 py-0.5 rounded-full text-xs font-black">
            <Shield size={12} weight="bold" />
            Quản trị viên
          </span>
        );
      case 'moderator':
        return (
          <span className="flex items-center gap-1 w-fit bg-blue-100 text-blue-700 border border-blue-300 px-2.5 py-0.5 rounded-full text-xs font-black">
            <Trophy size={12} weight="bold" />
            Điều phối
          </span>
        );
      default:
        return (
          <span className="w-fit bg-bg-surface-2 text-text-secondary border border-border-main px-2.5 py-0.5 rounded-full text-xs font-bold">
            Thành viên
          </span>
        );
    }
  };

  return (
    <div className="card-bubble bg-white rounded-3xl border-2 border-border-main shadow-xs overflow-hidden text-left font-sans">
      {/* Table Header / Filters */}
      <div className="p-6 border-b-2 border-border-main flex flex-col md:flex-row md:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative flex items-center">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email thành viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-surface-1 border-2 border-border-main rounded-2xl py-2.5 pl-10 pr-4 text-sm font-bold text-text-main focus:outline-none focus:bg-white focus:border-[#008A5E] transition-all"
          />
          <MagnifyingGlass size={18} weight="bold" className="absolute left-3.5 text-text-secondary" />
          <button type="submit" className="hidden">Tìm</button>
        </form>

        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="bg-bg-surface-1 border-2 border-border-main text-xs font-black rounded-2xl px-4 py-2.5 outline-none focus:border-[#008A5E] cursor-pointer transition-all"
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
            <tr className="bg-bg-surface-1 border-b-2 border-border-main text-text-secondary text-xs font-black uppercase tracking-wider">
              <th className="py-4 px-6">Tên & Email</th>
              <th className="py-4 px-6">Vai trò</th>
              <th className="py-4 px-6">Onboarding</th>
              <th className="py-4 px-6">Ngày tham gia</th>
              <th className="py-4 px-6 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border-main/40">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-border-main border-t-[#008A5E] mx-auto"></div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <WarningCircle size={32} weight="duotone" className="text-text-secondary mx-auto mb-2" />
                  <p className="text-text-secondary font-bold text-sm">Không tìm thấy người dùng nào phù hợp</p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-bg-surface-1/50 transition-colors text-text-main text-sm font-bold">
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-black text-text-h">{user.name}</span>
                      <span className="text-xs text-text-secondary font-bold">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {editingUserId === user._id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="bg-white border-2 border-border-main text-xs font-black rounded-2xl px-2.5 py-1 outline-none"
                        >
                          <option value="user">User</option>
                          <option value="moderator">Mod</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => handleSaveRole(user._id)}
                          className="p-1.5 text-emerald-700 bg-emerald-100 border border-emerald-300 rounded-2xl hover:bg-emerald-200 active:scale-95 transition-all cursor-pointer"
                          title="Lưu"
                        >
                          <Check size={16} weight="bold" />
                        </button>
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="p-1.5 text-red-700 bg-red-100 border border-red-300 rounded-2xl hover:bg-red-200 active:scale-95 transition-all cursor-pointer"
                          title="Hủy"
                        >
                          <X size={16} weight="bold" />
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
                          className="p-1 text-text-secondary hover:text-text-main hover:bg-bg-surface-2 rounded-2xl active:scale-95 transition-all cursor-pointer"
                          title="Phân lại vai trò"
                        >
                          <NotePencil size={14} weight="bold" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                        user.onboarding_completed
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {user.onboarding_completed ? 'Hoàn thành' : 'Chưa'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5 text-text-secondary text-xs font-bold">
                      <Calendar size={14} weight="bold" />
                      <span>{user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleDeleteUser(user._id, user.name)}
                      className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-2xl border border-red-200 active:scale-95 transition-all inline-flex items-center cursor-pointer"
                      title="Khóa/Xóa tài khoản"
                    >
                      <Trash size={16} weight="bold" />
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
        <div className="p-5 border-t-2 border-border-main flex items-center justify-between">
          <span className="text-xs font-bold text-text-secondary">
            Hiển thị {users.length} trên tổng số {total} thành viên
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
  );
};

export default AdminUsers;
