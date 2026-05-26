import React from 'react';
import { X, FileSpreadsheet, Trash2 } from 'lucide-react';
import { useExcelStore } from '../store/useExcelStore';

export const FileList: React.FC = () => {
  const files = useExcelStore(state => state.files);
  const removeFile = useExcelStore(state => state.removeFile);
  const mergeConfig = useExcelStore(state => state.mergeConfig);
  const setMergeConfig = useExcelStore(state => state.setMergeConfig);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const toggleSheetSelection = (fileId: string, sheetName: string) => {
    const isSelected = mergeConfig.selectedSheets.some(
      s => s.fileId === fileId && s.sheetName === sheetName
    );

    let newSelectedSheets;
    if (isSelected) {
      newSelectedSheets = mergeConfig.selectedSheets.filter(
        s => !(s.fileId === fileId && s.sheetName === sheetName)
      );
    } else {
      newSelectedSheets = [...mergeConfig.selectedSheets, { fileId, sheetName }];
    }

    setMergeConfig({ selectedSheets: newSelectedSheets });
  };

  if (files.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">已上传文件</h3>
      </div>
      {files.map(file => (
        <div key={file.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-6 w-6 text-blue-500" />
              <div>
                <p className="font-medium text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(file.size)} · {file.sheets.length} 个工作表</p>
              </div>
            </div>
            <button
              onClick={() => removeFile(file.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-3">选择要合并的工作表:</p>
            <div className="flex flex-wrap gap-2">
              {file.sheets.map(sheet => {
                const isSelected = mergeConfig.selectedSheets.some(
                  s => s.fileId === file.id && s.sheetName === sheet.name
                );
                return (
                  <button
                    key={sheet.name}
                    onClick={() => toggleSheetSelection(file.id, sheet.name)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${isSelected
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {sheet.name}
                    <span className="ml-2 text-xs opacity-75">
                      ({sheet.rows.length} 行)
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
