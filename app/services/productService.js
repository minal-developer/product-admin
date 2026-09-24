import api from './axios';

// Expanded local product collection for offline/demo/extension purposes
const mockAdditionalProducts = [
  {
    id: 101,
    title: 'Wireless Noise-Canceling Headphones',
    category: 'electronics',
    price: 299.99,
    rating: 4.8,
    stock: 45,
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80',
  },
  {
    id: 102,
    title: 'Ergonomic Leather Gaming Chair',
    category: 'furniture',
    price: 189.50,
    rating: 4.6,
    stock: 18,
    thumbnail: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=300&q=80',
  },
  {
    id: 103,
    title: 'Smartwatch Series 7 Waterproof',
    category: 'electronics',
    price: 349.00,
    rating: 4.7,
    stock: 60,
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80',
  },
  {
    id: 104,
    title: 'Minimalist Stainless Steel Water Bottle',
    category: 'accessories',
    price: 24.99,
    rating: 4.9,
    stock: 120,
    thumbnail: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&q=80',
  },
  {
    id: 105,
    title: 'Mechanical RGB Keyboard',
    category: 'electronics',
    price: 119.99,
    rating: 4.5,
    stock: 32,
    thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80',
  },
  {
    id: 106,
    title: 'Organic Espresso Coffee Beans 1kg',
    category: 'groceries',
    price: 29.50,
    rating: 4.9,
    stock: 85,
    thumbnail: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&q=80',
  },
];

export const productService = {
  getProducts: async ({ limit = 10, skip = 0, search = '', category = '', sortBy = 'title', order = 'asc' }) => {
    let url = '/products';
    let isFilteredOrSearched = false;

    if (search.trim()) {
      url = `/products/search?q=${encodeURIComponent(search.trim())}&limit=100`;
      isFilteredOrSearched = true;
    } else if (category) {
      url = `/products/category/${encodeURIComponent(category)}?limit=100`;
      isFilteredOrSearched = true;
    } else {
      url = `/products?limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${order}`;
    }

    try {
      const response = await api.get(url);
      let items = response.data.products || [];
      let totalCount = response.data.total || items.length;

      // Apply sorting manually for custom endpoints
      if (isFilteredOrSearched) {
        items.sort((a, b) => {
          let valA = a[sortBy];
          let valB = b[sortBy];

          if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
          }

          if (valA < valB) return order === 'asc' ? -1 : 1;
          if (valA > valB) return order === 'asc' ? 1 : -1;
          return 0;
        });

        totalCount = items.length;
        items = items.slice(skip, skip + limit);
      }

      return {
        products: items,
        total: totalCount,
      };
    } catch (error) {
      console.warn('API fetch failed, returning mock additional product list.', error);
      
      // Fallback filtering logic on local mock data
      let items = [...mockAdditionalProducts];
      
      if (search.trim()) {
        items = items.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
      }
      if (category) {
        items = items.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }

      return {
        products: items.slice(skip, skip + limit),
        total: items.length,
      };
    }
  },

  getCategories: async () => {
    try {
      const response = await api.get('/products/categories');
      return response.data.map((item) =>
        typeof item === 'string' ? { slug: item, name: item } : item
      );
    } catch (err) {
      return [
        { slug: 'electronics', name: 'Electronics' },
        { slug: 'furniture', name: 'Furniture' },
        { slug: 'accessories', name: 'Accessories' },
        { slug: 'groceries', name: 'Groceries' },
      ];
    }
  },

  addProduct: async (data) => {
    try {
      const response = await api.post('/products/add', data);
      return response.data;
    } catch (err) {
      // Mock creation fallback when offline/unsupported
      return {
        id: Date.now(),
        ...data,
        rating: 5.0,
        thumbnail: 'https://via.placeholder.com/150',
      };
    }
  },

  updateProduct: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};