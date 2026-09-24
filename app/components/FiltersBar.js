'use client';

import { Search } from 'lucide-react';

export default function FiltersBar({
  search,
  setSearch,
  category,
  onCategoryChange,
  categories = [],
  sortBy,
  order,
  onSortChange,
  limit,
  onLimitChange,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-lg">
      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Category Filter */}
      <select
        value={category || ''}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 capitalize cursor-pointer"
      >
        <option value="">All Categories</option>
        {categories.map((cat, idx) => {
          const slug = typeof cat === 'object' ? cat.slug : cat;
          const name = typeof cat === 'object' ? cat.name : cat;
          return (
            <option key={slug || idx} value={slug}>
              {name}
            </option>
          );
        })}
      </select>

      {/* Sort Filter */}
      <select
        value={`${sortBy}-${order}`}
        onChange={(e) => {
          const [s, o] = e.target.value.split('-');
          onSortChange(s, o);
        }}
        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
      >
        <option value="title-asc">Sort by Title (A-Z)</option>
        <option value="title-desc">Sort by Title (Z-A)</option>
        <option value="price-asc">Sort by Price (Low to High)</option>
        <option value="price-desc">Sort by Price (High to Low)</option>
        <option value="rating-desc">Sort by Rating (High to Low)</option>
      </select>

      {/* Page Size */}
      <select
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
      >
        <option value={10}>10 per page</option>
        <option value={20}>20 per page</option>
        <option value={50}>50 per page</option>
      </select>
    </div>
  );
}