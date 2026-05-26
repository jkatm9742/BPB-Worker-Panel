import React from 'react';
import { useExcelStore } from '../store/useExcelStore';
import { BarChart3 } from 'lucide-react';

export const AnalysisResults: React.FC = () => {
  const analysisResults = useExcelStore(state => state.analysisResults);

  if (analysisResults.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-purple-50 border-b border-purple-200">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-purple-800">数据分析结果</h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                列名
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                非空数量
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                唯一值
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                总和
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                平均值
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                最小值
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                最大值
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {analysisResults.map((result, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {result.columnName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {result.count}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {result.uniqueCount}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {result.sum !== undefined ? result.sum.toFixed(2) : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {result.avg !== undefined ? result.avg.toFixed(2) : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {result.min !== undefined ? result.min.toFixed(2) : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {result.max !== undefined ? result.max.toFixed(2) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
