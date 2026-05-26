export interface SheetData {
  name: string;
  headers: string[];
  rows: any[];
}

export interface ExcelFileData {
  id: string;
  name: string;
  size: number;
  uploadTime: Date;
  sheets: SheetData[];
}

export interface MergeConfig {
  type: 'append' | 'join';
  joinKey?: string;
  selectedSheets: { fileId: string; sheetName: string }[];
}

export interface AnalysisResult {
  columnName: string;
  count: number;
  uniqueCount: number;
  sum?: number;
  avg?: number;
  min?: number;
  max?: number;
}

export interface MergedData {
  headers: string[];
  rows: any[];
}
