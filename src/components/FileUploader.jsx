import React, { useCallback } from 'react'; 
// I'll use native input type="file" for simplicity or install react-dropzone.
// Plan only mentioned xlsx. I can use native.
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { clsx } from 'clsx';

export const FileUploader = ({ onDataLoaded }) => {
  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" }); // defval to keep empty cells
      onDataLoaded(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-whatsapp-light transition-colors cursor-pointer bg-surface-card"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => document.getElementById('fileInput').click()}
    >
      <input 
        id="fileInput" 
        type="file" 
        accept=".xlsx, .xls, .csv" 
        className="hidden" 
        onChange={handleChange}
      />
      <div className="flex flex-col items-center gap-2">
        <FileSpreadsheet className="w-12 h-12 text-gray-400" />
        <h3 className="text-lg font-medium text-white">Upload Contacts</h3>
        <p className="text-gray-400 text-sm">Drag & drop your Excel/CSV file here</p>
        <span className="text-xs text-gray-500 mt-2">Supports .xlsx, .xls, .csv</span>
      </div>
    </div>
  );
};
