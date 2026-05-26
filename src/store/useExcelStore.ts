import { create } from 'zustand';
import { ExcelFileData, MergeConfig, MergedData, AnalysisResult, SheetData } from '../types';

interface ExcelStore {
  files: ExcelFileData[];
  mergedData: MergedData | null;
  analysisResults: AnalysisResult[];
  mergeConfig: MergeConfig;
  selectedChartColumn: string | null; // 新增：当前选择用于图表的列
  addFile: (file: ExcelFileData) => void;
  removeFile: (fileId: string) => void;
  setMergeConfig: (config: Partial<MergeConfig>) => void;
  setSelectedChartColumn: (column: string | null) => void; // 新增
  mergeData: () => void;
  analyzeData: () => void;
  clearAll: () => void;
  getSheetData: (fileId: string, sheetName: string) => SheetData | undefined;
}

export const useExcelStore = create<ExcelStore>((set, get) => ({
  files: [],
  mergedData: null,
  analysisResults: [],
  selectedChartColumn: null,
  mergeConfig: {
    type: 'append',
    selectedSheets: [],
  },

  addFile: (file) => set((state) => ({ 
    files: [...state.files, file] 
  })),

  removeFile: (fileId) => set((state) => ({ 
    files: state.files.filter(f => f.id !== fileId),
    mergedData: null,
    analysisResults: [],
    selectedChartColumn: null,
    mergeConfig: {
      ...state.mergeConfig,
      selectedSheets: state.mergeConfig.selectedSheets.filter(s => s.fileId !== fileId)
    }
  })),

  setMergeConfig: (config) => set((state) => ({
    mergeConfig: { ...state.mergeConfig, ...config }
  })),

  setSelectedChartColumn: (column) => set({ selectedChartColumn: column }),

  getSheetData: (fileId, sheetName) => {
    const state = get();
    const file = state.files.find(f => f.id === fileId);
    return file?.sheets.find(s => s.name === sheetName);
  },

  mergeData: () => {
    const state = get();
    const { selectedSheets, type, joinKey } = state.mergeConfig;

    if (selectedSheets.length === 0) return;

    const sheetsData = selectedSheets.map(sel => state.getSheetData(sel.fileId, sel.sheetName)).filter(Boolean) as SheetData[];

    if (sheetsData.length === 0) return;

    let mergedData: MergedData;

    if (type === 'append') {
      // 合并所有列名，去重
      const allHeaders = Array.from(new Set(sheetsData.flatMap(s => s.headers)));
      
      // 转换数据，缺失列填充为空
      const allRows = sheetsData.flatMap(sheet => 
        sheet.rows.map(row => {
          const newRow: any = {};
          allHeaders.forEach(header => {
            newRow[header] = row[header] ?? '';
          });
          return newRow;
        })
      );

      mergedData = {
        headers: allHeaders,
        rows: allRows
      };
    } else {
      // join 模式
      if (!joinKey) return;

      // 创建键到数据的映射
      const keyMaps = sheetsData.map(sheet => {
        const map = new Map();
        sheet.rows.forEach(row => {
          const key = row[joinKey];
          if (key !== undefined && key !== null && key !== '') {
            map.set(String(key), row);
          }
        });
        return map;
      });

      // 获取所有键
      const allKeys = Array.from(new Set(keyMaps.flatMap(map => Array.from(map.keys()))));

      // 合并所有列名
      const allHeaders = Array.from(new Set(sheetsData.flatMap(s => s.headers)));

      // 合并行
      const mergedRows = allKeys.map(key => {
        const mergedRow: any = {};
        allHeaders.forEach(header => {
          // 从各个表中查找值，找到第一个非空的
          for (const map of keyMaps) {
            const row = map.get(key);
            if (row && row[header] !== undefined && row[header] !== null && row[header] !== '') {
              mergedRow[header] = row[header];
              break;
            }
          }
          if (mergedRow[header] === undefined) {
            mergedRow[header] = '';
          }
        });
        return mergedRow;
      });

      mergedData = {
        headers: allHeaders,
        rows: mergedRows
      };
    }

    set({ mergedData, selectedChartColumn: mergedData.headers[0] || null });
  },

  analyzeData: () => {
    const state = get();
    if (!state.mergedData) return;

    const { headers, rows } = state.mergedData;
    const results: AnalysisResult[] = [];

    headers.forEach(columnName => {
      const values = rows.map(row => row[columnName]).filter(v => v !== null && v !== undefined && v !== '');
      const uniqueValues = new Set(values.map(v => String(v)));

      // 统计每个值的出现次数
      const valueCounts: Record<string, number> = {};
      values.forEach(v => {
        const key = String(v);
        valueCounts[key] = (valueCounts[key] || 0) + 1;
      });

      const result: AnalysisResult = {
        columnName,
        count: values.length,
        uniqueCount: uniqueValues.size,
        valueCounts,
        isNumeric: false,
      };

      // 尝试数值统计
      const numericValues = values
        .map(v => {
          const num = Number(v);
          return isNaN(num) ? null : num;
        })
        .filter((v): v is number => v !== null);

      if (numericValues.length > 0) {
        result.sum = numericValues.reduce((a, b) => a + b, 0);
        result.avg = result.sum / numericValues.length;
        result.min = Math.min(...numericValues);
        result.max = Math.max(...numericValues);
        result.isNumeric = true;
      }

      results.push(result);
    });

    set({ analysisResults: results });
  },

  clearAll: () => set({
    files: [],
    mergedData: null,
    analysisResults: [],
    selectedChartColumn: null,
    mergeConfig: {
      type: 'append',
      selectedSheets: [],
    }
  })
}));
