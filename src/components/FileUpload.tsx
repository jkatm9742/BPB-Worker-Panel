import React, { useCallback, useState } from 'react';
import { Upload, X, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useExcelStore } from '../store/useExcelStore';
import { ExcelFileData, SheetData } from '../types';

export const FileUpload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const addFile = useExcelStore(state => state.addFile);

  const parseExcelFile = async (file: File): Promise<ExcelFileData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const sheets: SheetData[] = workbook.SheetNames.map(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            if (jsonData.length === 0) {
              return { name: sheetName, headers: [], rows: [] };
            }

            const headers = jsonData[0] as string[];
            const rows = jsonData.slice(1).map(row => {
              const obj: any = {};
              headers.forEach((header, index) => {
                obj[header] = row[index];
              });
              return obj;
            });

            return { name: sheetName, headers, rows };
          });

          resolve({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            uploadTime: new Date(),
            sheets
          });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const excelFiles = fileArray.filter(file => 
      file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    );

    for (const file of excelFiles) {
      try {
        const parsed = await parseExcelFile(file);
        addFile(parsed);
      } catch (error) {
        console.error('Error parsing file:', file.name, error);
      }
    }
  }, [addFile]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'
          }
        `}
      >
        <input
          type="file"
          multiple
          accept=".xlsx,.xls"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className={`mx-auto h-12 w-12 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          <p className="text-lg font-medium text-gray-700">拖拽Excel文件到这里</p>
          <p className="text-sm text-gray-500 mt-2">或点击选择文件</p>
          <p className="text-xs text-gray-400 mt-1">支持 .xlsx 和 .xls 格式</p>
        </label>
      </div>
    </div>
  );
};
