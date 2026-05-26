import React from 'react';
import { useExcelStore } from '../store/useExcelStore';
import { Calculator, Hash, FunctionSquare } from 'lucide-react';

export const AnalysisResults: React.FC = () => {
  const analysisResults = useExcelStore(state => state.analysisResults);

  if (analysisResults.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Calculator className="h-6 w-6 text-indigo-600" />
          <h3 className="text-xl font-bold text-gray-800">详细统计分析</h3>
        </div>
        <p className="text-sm text-gray-600 mt-2">各列数据的完整统计信息</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <FunctionSquare className="h-4 w-4" />
                  列名
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  非空数量
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b border-gray-200">
                唯一值
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-green-700 border-b border-gray-200">
                总和
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 border-b border-gray-200">
                平均值
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-orange-700 border-b border-gray-200">
                最小值
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-purple-700 border-b border-gray-200">
                最大值
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {analysisResults.map((result, index) => (
              <tr 
                key={index} 
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      result.isNumeric ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-sm font-semibold text-gray-900">{result.columnName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">
                    {result.count.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-700 bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
                    {result.uniqueCount.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {result.sum !== undefined ? (
                    <span className="text-sm font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-lg">
                      {result.sum.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {result.avg !== undefined ? (
                    <span className="text-sm font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-lg">
                      {result.avg.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {result.min !== undefined ? (
                    <span className="text-sm font-semibold text-orange-700 bg-orange-100 px-2 py-1 rounded-lg">
                      {result.min.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {result.max !== undefined ? (
                    <span className="text-sm font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded-lg">
                      {result.max.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
