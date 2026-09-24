'use client';

import Link from 'next/link';
import { Eye, Edit, Trash2, Star } from 'lucide-react';

export default function ProductTable({ products = [], onEdit, onDelete }) {
  return (
    <div className="hidden md:block bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
          <tr>
            <th className="px-6 py-4">Product</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4">Rating</th>
            <th className="px-6 py-4">Stock</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
              <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                <img
                  src={p.thumbnail || p.images?.[0] || 'https://via.placeholder.com/150'}
                  alt={p.title}
                  className="w-10 h-10 rounded-xl object-cover bg-slate-950 border border-slate-800"
                />
                <span className="truncate max-w-xs">{p.title}</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full text-xs font-medium capitalize">
                  {p.category}
                </span>
              </td>
              <td className="px-6 py-4 font-semibold text-indigo-400">${p.price}</td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-1 text-amber-400 font-medium">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{p.rating || 'N/A'}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-400">{p.stock} units</td>
              <td className="px-6 py-4 text-right space-x-1">
                <Link
                  href={`/products/${p.id}`}
                  className="p-2 inline-block text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => onEdit(p)}
                  className="p-2 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}