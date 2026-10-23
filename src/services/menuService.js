/**
 * Menu Service Layer (Repository Pattern)
 * Reads products from Supabase `products` and `categories` tables when connected.
 * Seamlessly falls back to local data when offline or unconfigured.
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { menuCategories, menuProducts } from '../data/menuData';

export const menuService = {
  /**
   * Get all active categories
   * @returns {Promise<Array>}
   */
  async getCategories() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug, image_url, sort_order')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          // Prepend "Tất cả" category tab
          return [
            { id: 'all', name: 'Tất cả', icon: 'restaurant_menu' },
            ...data.map(c => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              icon: c.slug?.includes('coffee') ? 'coffee' : c.slug?.includes('tea') ? 'local_bar' : 'bakery_dining'
            }))
          ];
        }
      } catch (err) {
        console.warn("Supabase categories fallback:", err);
      }
    }

    return Promise.resolve([...menuCategories]);
  },

  /**
   * Get products with optional filtering by category, search keyword, and featured flag
   * @param {Object} options
   */
  async getProducts({ categoryId = 'all', search = '', featuredOnly = false } = {}) {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('products')
          .select(`
            id,
            name,
            slug,
            description,
            price,
            image_url,
            is_featured,
            is_available,
            category_id,
            category:categories(id, name, slug)
          `)
          .order('sort_order', { ascending: true });

        if (featuredOnly) {
          query = query.eq('is_featured', true);
        }

        if (categoryId && categoryId !== 'all') {
          query = query.eq('category_id', categoryId);
        }

        if (search && search.trim() !== '') {
          query = query.ilike('name', `%${search.trim()}%`);
        }

        const { data, error } = await query;

        if (!error && data && data.length > 0) {
          return data.map(p => ({
            id: p.id,
            name: p.name,
            subName: p.category?.name || 'MIA Signature',
            description: p.description,
            fullDescription: p.description,
            price: Number(p.price) || 0,
            categoryId: p.category_id,
            image: p.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvhs2-M692R2XcR4OkUJdoWcMcPBk7jE4vfYj-W_DrQpFY-Q4oxI0losAV5KPusvomMZD2g16c8DmQVaUlANzoKOgYskca_CcOblRwZMzV64zVwjjYUntD2dGBQF3zT3Zr4RGSeD27cavXTBtSO4RkDmfWhUmyO8UvmL6tFTCvuqdpUa9W4wfftgFR1b0QAxTr2iGjl2P7sK8uUcwHi17y5GywgZBkPzjpznkEsgbDBaW3x40DJNMr',
            isFeatured: Boolean(p.is_featured),
            isAvailable: Boolean(p.is_available),
            badge: p.is_featured ? 'Đặc sắc' : null,
            servingType: 'Dùng tại quán / Mang đi',
            ingredients: 'Nguyên liệu tuyển chọn tự nhiên',
            tags: [p.category?.name || 'MIA Coffee']
          }));
        }
      } catch (err) {
        console.warn("Supabase products fallback:", err);
      }
    }

    // Fallback to local structured data
    let filtered = [...menuProducts];

    if (featuredOnly) {
      filtered = filtered.filter(p => p.isFeatured);
    }

    if (categoryId && categoryId !== 'all') {
      filtered = filtered.filter(p => p.categoryId === categoryId);
    }

    if (search && search.trim() !== '') {
      const keyword = search.trim().toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(keyword) ||
        (p.subName && p.subName.toLowerCase().includes(keyword)) ||
        p.description.toLowerCase().includes(keyword) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(keyword)))
      );
    }

    return Promise.resolve(filtered);
  },

  async getProductById(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(id, name, slug)
          `)
          .eq('id', id)
          .single();

        if (!error && data) {
          return {
            id: data.id,
            name: data.name,
            subName: data.category?.name,
            description: data.description,
            fullDescription: data.description,
            price: Number(data.price) || 0,
            categoryId: data.category_id,
            image: data.image_url,
            isFeatured: Boolean(data.is_featured),
            isAvailable: Boolean(data.is_available),
            servingType: 'Dùng tại quán / Mang đi',
            ingredients: 'Nguyên liệu tươi ngon tuyển chọn'
          };
        }
      } catch (err) {
        console.warn("Supabase getProductById fallback:", err);
      }
    }

    const product = menuProducts.find(p => p.id === id);
    return Promise.resolve(product ? { ...product } : null);
  }
};
