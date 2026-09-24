'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  limit = 10,
  onPageChange,
}) {
  // Coerce inputs to numbers to prevent string concatenation bugs
  const page = Number(currentPage) || 1;
  const total = Number(totalItems) || 0;
  const pageSize = Number(limit) || 10;
  const maxPages = Math.max(1, Number(totalPages) || 1);

  // Calculate item range dynamically
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/60">
      <span className="text-xs text-slate-400">
        Showing <strong className="text-slate-200">{startItem}–{endItem}</strong> of{' '}
        <strong className="text-slate-200">{total}</strong> products
      </span>

      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900 transition-colors"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Counter */}
        <span className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300">
          Page {page} of {maxPages}
        </span>

        {/* Next Button */}
        <button
          type="button"
          disabled={page >= maxPages}
          onClick={() => onPageChange(page + 1)}
          className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900 transition-colors"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}