/* Hallmark · page: admin-dashboard · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useEffect, useState } from 'react';
import { getAdminStats } from '../api/admin';
import { Users, Plant, BookOpen, ChatText, Database, FileMagnifyingGlass, Bell, Warning } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

type StatsOverview = {
  totalUsers: number;
  totalPlots: number;
  totalDiaries: number;
  totalScans: number;
  totalRAGFiles: number;
  totalSessions: number;
  totalReminders: number;
};

type TrendPoint = {
  date: string;
  value: number;
};

type StatsData = {
  overview: StatsOverview;
  charts: {
    userTrends: TrendPoint[];
    scanTrends: TrendPoint[];
    chatTrends: TrendPoint[];
  };
};

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        toast.error('Lỗi khi tải số liệu thống kê: ' + (err.message || err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-border-main border-t-[#008A5E]"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center p-8 card-bubble bg-white rounded-3xl border-2 border-border-main text-center shadow-xs">
        <Warning size={48} weight="duotone" className="text-amber-500 mb-4 animate-bounce" />
        <h3 className="text-xl font-black text-text-h mb-1">Không có dữ liệu</h3>
        <p className="text-text-secondary font-bold text-sm">Không thể kết nối hoặc truy xuất dữ liệu từ máy chủ.</p>
      </div>
    );
  }

  const { overview, charts } = data;

  const cards = [
    { label: 'Thành viên', value: overview.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Ô đất nông trại', value: overview.totalPlots, icon: Plant, color: 'text-[#008A5E]', bg: 'bg-emerald-100' },
    { label: 'Nhật ký trồng', value: overview.totalDiaries, icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Lượt quét PlantScan', value: overview.totalScans, icon: FileMagnifyingGlass, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Tài liệu Kĩ thuật RAG', value: overview.totalRAGFiles, icon: Database, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Hội thoại Bé Thóc AI', value: overview.totalSessions, icon: ChatText, color: 'text-rose-600', bg: 'bg-rose-100' },
    { label: 'Lịch nhắc nhở', value: overview.totalReminders, icon: Bell, color: 'text-teal-600', bg: 'bg-teal-100' },
  ];

  // Helper to draw clean SVG charts
  const renderSVGLineChart = (points: TrendPoint[], lineColor: string, fillColor: string) => {
    if (!points || points.length === 0) return null;
    
    const width = 500;
    const height = 180;
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const maxVal = Math.max(...points.map((p) => p.value), 5); // ensure at least y-axis height of 5
    const minVal = 0;
    const range = maxVal - minVal;

    const coords = points.map((p, index) => {
      const x = padding + (index / (points.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((p.value - minVal) / range) * chartHeight;
      return { x, y, label: p.date, value: p.value };
    });

    const linePath = coords.reduce(
      (path, c, i) => (i === 0 ? `M ${c.x} ${c.y}` : `${path} L ${c.x} ${c.y}`),
      ''
    );

    const fillPath = `${linePath} L ${coords[coords.length - 1].x} ${padding + chartHeight} L ${coords[0].x} ${padding + chartHeight} Z`;

    return (
      <div className="w-full relative card-bubble bg-white p-5 rounded-3xl border-2 border-border-main shadow-xs">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = padding + chartHeight * ratio;
            const val = Math.round(maxVal - (maxVal * ratio));
            return (
              <g key={idx}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
                <text
                  x={padding - 6}
                  y={y + 4}
                  fill="#64748b"
                  fontSize={11}
                  fontWeight={800}
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={fillPath} fill={fillColor} opacity={0.2} />

          {/* Core line */}
          <path d={linePath} fill="none" stroke={lineColor} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />

          {/* Interaction dots */}
          {coords.map((c, i) => (
            <g key={i}>
              <circle cx={c.x} cy={c.y} r={5} fill={lineColor} stroke="#ffffff" strokeWidth={2} />
              {/* x-axis labels */}
              <text
                x={c.x}
                y={height - 2}
                fill="#64748b"
                fontSize={11}
                fontWeight={800}
                textAnchor="middle"
              >
                {c.label}
              </text>
              {/* Tooltip value */}
              <text
                x={c.x}
                y={c.y - 10}
                fill={lineColor}
                fontSize={11}
                fontWeight={900}
                textAnchor="middle"
              >
                {c.value > 0 ? c.value : ''}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 w-full text-left font-sans">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="card-bubble bg-white p-5 border-2 border-border-main shadow-xs flex items-center gap-4"
            >
              <div className={`p-3.5 rounded-2xl ${card.bg} ${card.color} border-2 border-border-main flex items-center justify-center shrink-0`}>
                <Icon size={22} weight="duotone" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-black uppercase text-text-secondary truncate">{card.label}</span>
                <span className="text-2xl font-black text-text-h tracking-tight">{card.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SVG Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-black text-text-h px-1">Lượt quét bệnh PlantScan (7 ngày)</h2>
          {renderSVGLineChart(charts.scanTrends, '#9333ea', '#a855f7')}
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-black text-text-h px-1">Đăng ký thành viên mới (7 ngày)</h2>
          {renderSVGLineChart(charts.userTrends, '#2563eb', '#60a5fa')}
        </div>
      </div>

      {/* RAG Sessions Trends */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-black text-text-h px-1">Trò chuyện với Bé Thóc AI (7 ngày)</h2>
        {renderSVGLineChart(charts.chatTrends, '#008A5E', '#34d399')}
      </div>
    </div>
  );
};

export default AdminDashboard;
