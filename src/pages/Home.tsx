import React from 'react';
import { FileUpload } from '../components/FileUpload';
import { FileList } from '../components/FileList';
import { MergeConfig } from '../components/MergeConfig';
import { DataPreview } from '../components/DataPreview';
import { AnalysisResults } from '../components/AnalysisResults';
import { useExcelStore } from '../store/useExcelStore';
import { Trash2 } from 'lucide-react';

export default function Home() {
  const clearAll = useExcelStore(state => state.clearAll);
  const files = useExcelStore(state => state.files);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Excel 数据分析工具
          </h1>
          <p className="text-gray-600">
            支持单个和多个 Excel 文件的合并、分析和导出
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  清空所有
                </button>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <DataPreview />

          {/* Analysis Section */}
          <AnalysisResults />
        </div>
      </div>
    </div>
  );
}
