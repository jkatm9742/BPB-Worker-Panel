import React from 'react';
import { FileUpload } from '../components/FileUpload';
import { FileList } from '../components/FileList';
import { MergeConfig } from '../components/MergeConfig';
import { DataPreview } from '../components/DataPreview';
import { AnalysisResults } from '../components/AnalysisResults';
import { DataCharts } from '../components/DataCharts';
import { useExcelStore } from '../store/useExcelStore';
import { Trash2, Database, Sparkles } from 'lucide-react';

export default function Home() {
  const clearAll = useExcelStore(state => state.clearAll);
  const files = useExcelStore(state => state.files);
  const mergedData = useExcelStore(state => state.mergedData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Database className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent">
              Excel 数据分析工具
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            支持单个和多个 Excel 文件的合并、分析和可视化导出
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Upload Section */}
          <section>
            <FileUpload />
          </section>

          {/* Files and Config Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <FileList />
            </div>
            <div className="space-y-6">
              <MergeConfig />
              {files.length > 0 && (
                <button
                  onClick={clearAll}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-xl hover:from-red-100 hover:to-red-200 transition-all border border-red-200 shadow-sm"
                >
                  <Trash2 className="h-5 w-5" />
                  清空所有数据
                </button>
              )}
            </div>
          </div>

          {/* Charts Section - First to show visualizations */}
          {mergedData && (
            <div className="animate-fade-in">
              <DataCharts />
            </div>
          )}

          {/* Preview Section */}
          <DataPreview />

          {/* Analysis Section */}
          <AnalysisResults />
        </div>
      </div>
    </div>
  );
}
