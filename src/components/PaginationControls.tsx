import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  startIndex: number;
  itemsPerPage: number;
  totalItems: number;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  startIndex, 
  itemsPerPage, 
  totalItems 
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center px-6 py-4 border-t border-gray-700/30">
        <span className="text-sm text-gray-400">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
        </span>
        <div className="flex gap-2">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
            >
                <ChevronLeft size={20} />
            </button>
            <span className="px-2 py-1 bg-white/5 rounded text-sm min-w-[30px] text-center">
                {currentPage}
            </span>
            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    </div>
  );
};
