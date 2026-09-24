'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';
import FiltersBar from '../components/FiltersBar';
import ProductTable from '../components/ProductTable';
import ProductCards from '../components/ProductCards';
import Pagination from '../components/Pagination';
import ProductModal from '../components/ProductModal';
import DeleteModal from '../components/DeleteModal';
import { productService } from '../services/productService';
import { Plus, Loader2, RefreshCw, AlertTriangle, PackageX } from 'lucide-react';

function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Read state directly from URL Query Parameters
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const searchParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const sortByParam = searchParams.get('sortBy') || 'title';
  const orderParam = searchParams.get('order') || 'asc';
  const limitParam = parseInt(searchParams.get('limit') || '10', 10);

  // Local state
  const [searchInput, setSearchInput] = useState(searchParam);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Helper to update URL query params cleanly
  const updateQueryParams = useCallback(
    (newParams) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === '' || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // 2. Sync input search field with query param updates
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== searchParam) {
        updateQueryParams({ q: searchInput, page: 1 });
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput, searchParam, updateQueryParams]);

  // Sync search input if URL search param changes via back/forward buttons
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Load category options once on mount
  useEffect(() => {
    productService
      .getCategories()
      .then((data) => setCategoriesList(data))
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  // 3. Fetch products whenever relevant URL parameters change
  const fetchProductsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const skip = (pageParam - 1) * limitParam;
      const data = await productService.getProducts({
        limit: limitParam,
        skip,
        search: searchParam,
        category: categoryParam,
        sortBy: sortByParam,
        order: orderParam,
      });
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message || 'Error fetching products');
    } finally {
      setLoading(false);
    }
  }, [pageParam, limitParam, searchParam, categoryParam, sortByParam, orderParam]);

  useEffect(() => {
    fetchProductsData();
  }, [fetchProductsData]);

  // Add, Edit, and Delete action handlers
  const handleAdd = async (formData) => {
    try {
      const newProd = await productService.addProduct(formData);
      setProducts((prev) => [newProd, ...prev]);
      setTotal((prev) => prev + 1);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Failed to add product', err);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const updated = await productService.updateProduct(editingProduct.id, formData);
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...updated } : p))
      );
      setEditingProduct(null);
    } catch (err) {
      console.error('Failed to update product', err);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await productService.deleteProduct(deleteId);
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      setTotal((prev) => Math.max(0, prev - 1));
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete product', err);
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(total / limitParam) || 1;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Products Catalog</h1>
            <p className="text-sm text-slate-400">Manage products with real-time URL state sync</p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <FiltersBar
          search={searchInput}
          setSearch={setSearchInput}
          category={categoryParam}
          onCategoryChange={(cat) => updateQueryParams({ category: cat, page: 1 })}
          categories={categoriesList}
          sortBy={sortByParam}
          order={orderParam}
          onSortChange={(s, o) => updateQueryParams({ sortBy: s, order: o, page: 1 })}
          limit={limitParam}
          onLimitChange={(l) => updateQueryParams({ limit: l, page: 1 })}
        />

        {/* Catalog Table & Mobile Views */}
        {loading ? (
          <div className="py-24 text-center space-y-3 bg-slate-900/50 rounded-2xl border border-slate-800">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
            <p className="text-sm text-slate-400">Loading catalog...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center space-y-4 bg-slate-900/50 rounded-2xl border border-slate-800">
            <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-slate-300 font-medium">{error}</p>
            <button
              onClick={fetchProductsData}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-semibold rounded-xl text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-slate-900/50 rounded-2xl border border-slate-800">
            <PackageX className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-slate-300 font-medium">No products found</p>
            <p className="text-xs text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <>
            <ProductTable
              products={products}
              onEdit={setEditingProduct}
              onDelete={setDeleteId}
            />

            <ProductCards
              products={products}
              onEdit={setEditingProduct}
              onDelete={setDeleteId}
            />

            <Pagination
              currentPage={pageParam}
              totalPages={totalPages}
              totalItems={total}
              limit={limitParam}
              onPageChange={(p) => updateQueryParams({ page: p })}
            />
          </>
        )}
      </main>

      {/* Modals */}
      <ProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAdd}
      />

      <ProductModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSubmit={handleUpdate}
        initialData={editingProduct}
      />

      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <ProductsContent />
    </Suspense>
  );
}