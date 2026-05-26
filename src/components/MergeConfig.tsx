import React from 'react';
import { Merge, Download, BarChart3 } from 'lucide-react';
import { useExcelStore } from '../store/useExcelStore';
import * as XLSX from 'xlsx';

export const MergeConfig: React.FC = () => {
  const mergeConfig = useExcelStore(state => state.mergeConfig);
  const setMergeConfig = useExcelStore(state => state.setMergeConfig);
  const mergeData = useExcelStore(state => state.mergeData);
  const analyzeData = useExcelStore(state => state.analyzeData);
  const mergedData = useExcelStore(state => state.mergedData);
  const files = useExcelStore(state => state.files);

  // 获取所有可选的列名（用于join模式）
  const getAllHeaders = () => {
    const headers = new Set<string>();
    mergeConfig.selectedSheets.forEach(({ fileId, sheetName }) => {
      const file = files.find(f => f.id === fileId);
      const sheet = file?.sheets.find(s => s.name === sheetName);
      sheet?.headers.forEach(h => headers.add(h));
    });
    return Array.from(headers);
  };

  const handleExport = () => {
    if (!mergedData) return;

    const worksheet = XLSX.utils.json_to_sheet(
      mergedData.rows.map(row => {
        const obj: any = {};
        mergedData.headers.forEach(header => {
          obj[header] = row[header];
        });
        return obj;
      })
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'MergedData');
    XLSX.writeFile(workbook, 'merged_data.xlsx');
  };

  if (files.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">合并配置</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">合并方式</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mergeType"
                value="append"
                checked={mergeConfig.type === 'append'}
                onChange={() => setMergeConfig({ type: 'append' })}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">追加合并（行合并）</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mergeType"
                value="join"
                checked={mergeConfig.type === 'join'}
                onChange={() => setMergeConfig({ type: 'join' })}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">关联合并（键合并）</span>
            </label>
          </div>
        </div>

        {mergeConfig.type === 'join' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">关联键</label>
            <select
              value={mergeConfig.joinKey || ''}
              onChange={(e) => setMergeConfig({ joinKey: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">请选择关联键</option>
              {getAllHeaders().map(header => (
                <option key={header} value={header}>{header}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => {
              mergeData();
            }}
            disabled={mergeConfig.selectedSheets.length === 0 || (mergeConfig.type === 'join' && !mergeConfig.joinKey)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Merge className="h-4 w-4" />
            合并数据
          </button>

          {mergedData && (
            <>
              <button
                onClick={analyzeData}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                数据分析
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="h-4 w-4" />
                导出Excel
              </button>
            </>
          )}
        </div>
      </div>

      {mergedData && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            ✓ 合并完成，共 {mergedData.headers.length} 列，{mergedData.rows.length} 行数据
          </p>
        </div>
      )}
    </div>
  );
};
