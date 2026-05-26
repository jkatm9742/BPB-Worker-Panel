import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useExcelStore } from '../store/useExcelStore';
import {
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  Layers,
  Settings2,
} from 'lucide-react';
import { AnalysisResult, MergedData } from '../types';

// 精美配色方案
const COLORS = [
  '#3B82F6', // 蓝色
  '#10B981', // 绿色
  '#F59E0B', // 橙色
  '#EF4444', // 红色
  '#8B5CF6', // 紫色
  '#EC4899', // 粉色
  '#06B6D4', // 青色
  '#F97316', // 深橙色
];

// 自定义渐变色
const GRADIENT_COLORS = [
  { from: '#3B82F6', to: '#60A5FA' },
  { from: '#10B981', to: '#34D399' },
  { from: '#F59E0B', to: '#FBBF24' },
  { from: '#EF4444', to: '#F87171' },
  { from: '#8B5CF6', to: '#A78BFA' },
  { from: '#EC4899', to: '#F472B6' },
];

// 自定义 Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-100">
        <p className="text-gray-800 font-semibold text-sm mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            <span className="font-medium">{entry.name}:</span> {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// 饼图的自定义标签
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const DataCharts: React.FC = () => {
  const {
    mergedData,
    analysisResults,
    selectedChartColumn,
    setSelectedChartColumn,
  } = useExcelStore();
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line' | 'area'>('bar');

  const currentAnalysis = useMemo(() => {
    if (!selectedChartColumn) return null;
    return analysisResults.find(r => r.columnName === selectedChartColumn);
  }, [analysisResults, selectedChartColumn]);

  const chartData = useMemo(() => {
    if (!currentAnalysis?.valueCounts) return [];
    
    const entries = Object.entries(currentAnalysis.valueCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10); // 取前10个最多的值
    
    return entries.map(([name, value]) => ({ name, value }));
  }, [currentAnalysis]);

  const numericTrendData = useMemo(() => {
    if (!mergedData || !currentAnalysis?.isNumeric) return [];
    return mergedData.rows
      .map((row, index) => ({
        index: index + 1,
        value: Number(row[selectedChartColumn!]) || 0,
      }))
      .slice(0, 50); // 取前50条数据
  }, [mergedData, selectedChartColumn, currentAnalysis]);

  if (!mergedData || analysisResults.length === 0 || !selectedChartColumn) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 图表控制面板 */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-2">
              <Layers className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">数据可视化</h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* 选择列 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">选择数据列:</label>
                <select
                  value={selectedChartColumn}
                  onChange={(e) => setSelectedChartColumn(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                >
                  {mergedData.headers.map(header => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
              </div>

              {/* 图表类型选择 */}
              <div className="flex items-center gap-2 bg-white/70 rounded-xl p-1">
                <button
                  onClick={() => setChartType('bar')}
                  className={`p-2 rounded-lg transition-all ${
                    chartType === 'bar'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  title="柱状图"
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setChartType('pie')}
                  className={`p-2 rounded-lg transition-all ${
                    chartType === 'pie'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  title="饼图"
                >
                  <PieChartIcon className="h-4 w-4" />
                </button>
                {currentAnalysis?.isNumeric && (
                  <>
                    <button
                      onClick={() => setChartType('line')}
                      className={`p-2 rounded-lg transition-all ${
                        chartType === 'line'
                          ? 'bg-green-600 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                      title="折线图"
                    >
                      <TrendingUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setChartType('area')}
                      className={`p-2 rounded-lg transition-all ${
                        chartType === 'area'
                          ? 'bg-orange-600 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                      title="面积图"
                    >
                      <Settings2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        {currentAnalysis && (
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50/50">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl border border-blue-200">
              <p className="text-sm text-blue-600 font-medium mb-1">总数量</p>
              <p className="text-3xl font-bold text-blue-900">{currentAnalysis.count}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-2xl border border-green-200">
              <p className="text-sm text-green-600 font-medium mb-1">唯一值</p>
              <p className="text-3xl font-bold text-green-900">{currentAnalysis.uniqueCount}</p>
            </div>
            {currentAnalysis.isNumeric && (
              <>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-2xl border border-purple-200">
                  <p className="text-sm text-purple-600 font-medium mb-1">平均值</p>
                  <p className="text-3xl font-bold text-purple-900">{currentAnalysis.avg?.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-2xl border border-orange-200">
                  <p className="text-sm text-orange-600 font-medium mb-1">总和</p>
                  <p className="text-3xl font-bold text-orange-900">{currentAnalysis.sum?.toFixed(0)}</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* 图表区域 */}
        <div className="p-6">
          {chartType === 'bar' && (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <defs>
                    {chartData.map((_, index) => (
                      <linearGradient key={`color${index}`} id={`colorBar${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.9} />
                        <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.4} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                    tick={{ fontSize: 12 }} 
                    stroke="#6B7280"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    radius={[8, 8, 0, 0]} 
                    animationDuration={1500}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#colorBar${index})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {chartType === 'pie' && (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={150}
                    innerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={1500}
                    paddingAngle={5}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-gray-700 font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {chartType === 'line' && currentAnalysis?.isNumeric && (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={numericTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="index" 
                    tick={{ fontSize: 12 }} 
                    stroke="#6B7280"
                    label={{ value: '数据点', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {chartType === 'area' && currentAnalysis?.isNumeric && (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={numericTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="index" 
                    tick={{ fontSize: 12 }} 
                    stroke="#6B7280"
                    label={{ value: '数据点', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorArea)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
