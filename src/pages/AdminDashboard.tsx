import React, { useEffect, useState } from 'react';
import { getAdminStats } from '../api/admin';
import { Users, Sprout, BookOpen, MessageSquare, Database, FileSearch, Bell, AlertTriangle } from 'lucide-react';
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#08A855]"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-black/[0.04] text-center">
        <AlertTriangle size={48} className="text-amber-500 mb-4" />
        <h3 className="text-lg font-bold text-[#1d1d1f] mb-1">Không có dữ liệu</h3>
        <p className="text-[#86868b] text-[14px]">Không thể kết nối hoặc truy xuất dữ liệu từ máy chủ.</p>
      </div>
    );
  }

  const { overview, charts } = data;

  const cards = [
    { label: 'Thành viên', value: overview.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Ô đất', value: overview.totalPlots, icon: Sprout, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Nhật ký trồng', value: overview.totalDiaries, icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Lượt quét sâu', value: overview.totalScans, icon: FileSearch, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Tài liệu RAG', value: overview.totalRAGFiles, icon: Database, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Phiên Chat AI', value: overview.totalSessions, icon: MessageSquare, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Nhắc nhở', value: overview.totalReminders, icon: Bell, color: 'text-teal-500', bg: 'bg-teal-50' },
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
      <div className="w-full relative bg-white p-6 rounded-2xl border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all">
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
                  stroke="#f0f0f2"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
                <text
                  x={padding - 6}
                  y={y + 4}
                  fill="#86868b"
                  fontSize={10}
                  fontWeight={500}
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={fillPath} fill={fillColor} opacity={0.15} />

          {/* Core line */}
          <path d={linePath} fill="none" stroke={lineColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

          {/* Interaction dots */}
          {coords.map((c, i) => (
            <g key={i}>
              <circle cx={c.x} cy={c.y} r={4} fill={lineColor} stroke="#ffffff" strokeWidth={1.5} />
              {/* x-axis labels */}
              <text
                x={c.x}
                y={height - 2}
                fill="#86868b"
                fontSize={10}
                fontWeight={500}
                textAnchor="middle"
              >
                {c.label}
              </text>
              {/* Tooltip value */}
              <text
                x={c.x}
                y={c.y - 8}
                fill={lineColor}
                fontSize={10}
                fontWeight={700}
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
    <div className="flex flex-col gap-8 w-full">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white p-5 rounded-2xl border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:-translate-y-[2px] transition-all flex items-center gap-4"
            >
              <div className={`p-3.5 rounded-xl ${card.bg} ${card.color} flex items-center justify-center shrink-0`}>
                <Icon size={20} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] text-[#86868b] font-medium leading-normal truncate">{card.label}</span>
                <span className="text-xl md:text-2xl font-bold text-[#1d1d1f] tracking-tight">{card.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SVG Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-[16px] font-bold text-[#1d1d1f] px-1">Lượt quét bệnh (7 ngày gần nhất)</h2>
          {renderSVGLineChart(charts.scanTrends, '#9333ea', '#a855f7')}
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-[16px] font-bold text-[#1d1d1f] px-1">Tài khoản đăng ký mới (7 ngày gần nhất)</h2>
          {renderSVGLineChart(charts.userTrends, '#3b82f6', '#60a5fa')}
        </div>
      </div>

      {/* RAG Sessions Trends */}
      <div className="flex flex-col gap-3">
        <h2 className="text-[16px] font-bold text-[#1d1d1f] px-1">Lượt chat với Trợ lý ảo (7 ngày gần nhất)</h2>
        {renderSVGLineChart(charts.chatTrends, '#08A855', '#34d399')}
      </div>
    </div>
  );
};

export default AdminDashboard;
