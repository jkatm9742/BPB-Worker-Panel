import React from 'react';
import { FileUpload } from '../components/FileUpload';
import { FileList } from '../components/FileList';
import { MergeConfig } from '../components/MergeConfig';
import { DataPreview } from '../components/DataPreview';
import { AnalysisResults } from '../components/AnalysisResults';
import { useExcelStore } from '../store/useExcelStore';
import { Trash2, Database, BarChart3, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const clearAll = useExcelStore(state => state.clearAll);
  const files = useExcelStore(state => state.files);
  const mergedData = useExcelStore(state => state.mergedData);
  const analysisResults = useExcelStore(state => state.analysisResults);
  const navigate = useNavigate();

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
              
              {/* 数据分析导航按钮 */}
              {analysisResults.length > 0 && (
                <button
                  onClick={() => navigate('/analysis')}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
                >
                  <BarChart3 className="h-5 w-5" />
                  进入数据分析中心
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
              
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

          {/* Preview Section */}
          <DataPreview />

          {/* Analysis Section */}
          <AnalysisResults />
        </div>
      </div>
    </div>
  );
}
