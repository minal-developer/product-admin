'use client';

import Link from 'next/link';
import { Eye, Edit, Trash2, Star } from 'lucide-react';

export default function ProductCards({ products = [], onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {products.map((p) => (
        <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
          <div className="flex items-center space-x-3">
            <img
              src={p.thumbnail || p.images?.[0] || 'https://via.placeholder.com/150'}
              alt={p.title}
              className="w-14 h-14 rounded-xl object-cover bg-slate-950 border border-slate-800"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate">{p.title}</h3>
              <span className="text-xs text-purple-400 capitalize">{p.category}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm border-t border-b border-slate-800/80 py-2">
            <span className="font-bold text-indigo-400 text-lg">${p.price}</span>
            <div className="flex items-center space-x-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="font-semibold">{p.rating || 'N/A'}</span>
            </div>
            <span className="text-slate-400 text-xs">Stock: {p.stock}</span>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-1">
            <Link
              href={`/products/${p.id}`}
              className="p-2 text-slate-400 hover:text-indigo-400 bg-slate-950 rounded-lg border border-slate-800"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              onClick={() => onEdit(p)}
              className="p-2 text-slate-400 hover:text-amber-400 bg-slate-950 rounded-lg border border-slate-800"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(p.id)}
              className="p-2 text-slate-400 hover:text-rose-400 bg-slate-950 rounded-lg border border-slate-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}