import { supabase, isSupabaseConfigured } from './supabaseClient';
import { menuCategories, menuProducts } from '../data/menuData';

/**
 * Admin Products & Categories Service
 * Connects directly to Supabase tables: `categories`, `products`, `product_images`
 * Fallback to mock data when Supabase is not configured
 */
export const adminProductsService = {
  // ================= CATEGORIES =================
  async getCategories() {
    if (!isSupabaseConfigured || !supabase) {
      return [...menuCategories.filter(c => c.id !== 'all')];
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error("Supabase getCategories error:", error);
      return [...menuCategories.filter(c => c.id !== 'all')];
    }
    return data || [];
  },

  async createCategory(categoryData) {
    if (!supabase) throw new Error("Chưa kết nối Supabase.");

    // Tự động tạo slug chuẩn SEO từ tên nếu chưa có hoặc rỗng
    let slug = categoryData.slug?.trim();
    if (!slug && categoryData.name) {
      slug = categoryData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    if (!slug) {
      slug = 'danh-muc-' + Date.now().toString().slice(-4);
    }

    const payload = {
      name: categoryData.name.trim(),
      slug: slug,
      description: categoryData.description || '',
      sort_order: Number(categoryData.sort_order) || 0,
      is_active: categoryData.is_active !== false
    };

    const { data, error } = await supabase
      .from('categories')
      .insert([payload])
      .select()
      .single();

    if (error) {
      // Nếu trùng slug, gắn thêm hậu tố số ngẫu nhiên để tránh lỗi duplicate key
      if (error.code === '23505' || error.message?.includes('duplicate key')) {
        payload.slug = `${slug}-${Date.now().toString().slice(-4)}`;
        const retry = await supabase.from('categories').insert([payload]).select().single();
        if (retry.error) throw retry.error;
        return retry.data;
      }
      throw error;
    }
    return data;
  },

  async updateCategory(id, categoryData) {
    if (!supabase) throw new Error("Chưa kết nối Supabase.");

    const payload = { ...categoryData };
    if (payload.name) payload.name = payload.name.trim();

    if (payload.slug !== undefined) {
      if (!payload.slug || payload.slug.trim() === '') {
        if (payload.name) {
          payload.slug = payload.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        } else {
          delete payload.slug;
        }
      } else {
        payload.slug = payload.slug.trim();
      }
    }
    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('categories')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCategory(id) {
    if (!supabase) throw new Error("Chưa kết nối Supabase.");

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // ================= PRODUCTS =================
  async getProducts({ categoryId = null, search = '', limit = 100 } = {}) {
    if (!isSupabaseConfigured || !supabase) {
      let filtered = [...menuProducts];
      if (categoryId && categoryId !== 'all') {
        filtered = filtered.filter(p => p.categoryId === categoryId);
      }
      if (search) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
      }
      return filtered.map(p => ({
        id: p.id,
        category_id: p.categoryId,
        name: p.name,
        slug: p.id,
        description: p.description,
        price: p.price,
        image_url: p.image,
        is_featured: p.isFeatured,
        is_available: p.isAvailable,
        sort_order: 0
      }));
    }

    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        images:product_images(id, image_url, alt_text, sort_order)
      `)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId);
    }

    if (search && search.trim() !== '') {
      query = query.ilike('name', `%${search.trim()}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Supabase getProducts error:", error);
      throw error;
    }
    return data || [];
  },

  async getProductById(id) {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        images:product_images(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createProduct(productData) {
    if (!supabase) throw new Error("Chưa kết nối Supabase.");

    // Generate slug from name if not provided
    const slug = productData.slug || productData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Sanitize category_id for PostgreSQL UUID type
    const validCategoryId = (productData.category_id && String(productData.category_id).trim() !== '')
      ? String(productData.category_id).trim()
      : null;

    const { data, error } = await supabase
      .from('products')
      .insert([{
        category_id: validCategoryId,
        name: productData.name.trim(),
        slug: slug + '-' + Date.now().toString().slice(-4),
        description: productData.description || '',
        price: Number(productData.price) || 0,
        image_url: productData.image_url || '',
        is_featured: Boolean(productData.is_featured),
        is_available: productData.is_available !== false,
        sort_order: Number(productData.sort_order) || 0
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProduct(id, productData) {
    if (!supabase) throw new Error("Chưa kết nối Supabase.");

    const payload = { ...productData };
    delete payload.category;
    delete payload.images;

    // Sanitize category_id for PostgreSQL UUID type
    if (!payload.category_id || String(payload.category_id).trim() === '') {
      payload.category_id = null;
    } else {
      payload.category_id = String(payload.category_id).trim();
    }

    if (payload.price !== undefined) {
      payload.price = Number(payload.price) || 0;
    }

    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async toggleProductAvailability(id, is_available) {
    return this.updateProduct(id, { is_available });
  },

  async toggleProductFeatured(id, is_featured) {
    return this.updateProduct(id, { is_featured });
  },

  async deleteProduct(id) {
    if (!supabase) throw new Error("Chưa kết nối Supabase.");

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  /**
   * Upload ảnh món ăn từ máy tính:
   * 1. Thử tải lên Supabase Storage bucket 'products'
   * 2. Nếu bucket chưa tạo hoặc gặp lỗi quyền, tự động nén tối ưu sang định dạng Base64 WebP nhẹ nhàng (dưới 80KB)
   *    giúp lưu trữ an toàn ngay vào cột `image_url` mà không bao giờ bị lỗi.
   */
  async uploadProductImage(file) {
    if (!file) return '';

    // Cách 1: Thử tải lên Supabase Storage (nếu đã kết nối và cấu hình bucket)
    if (isSupabaseConfigured && supabase) {
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const cleanName = file.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, '-');
        const fileName = `${Date.now()}-${cleanName.slice(0, 15)}.${fileExt}`;
        const filePath = `items/${fileName}`;

        const { data, error } = await supabase.storage
          .from('products')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (!error && data) {
          const { data: publicData } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

          if (publicData?.publicUrl) {
            return publicData.publicUrl;
          }
        }
      } catch (storageErr) {
        console.warn("Supabase Storage bucket upload fallback:", storageErr);
      }
    }

    // Cách 2: Tự động nén ảnh trên client thành Base64 WebP (max 800px, chất lượng cao nhưng siêu nhẹ)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const maxWidth = 800;
          const maxHeight = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Nén định dạng webp chất lượng 82%
          const compressed = canvas.toDataURL('image/webp', 0.82);
          resolve(compressed);
        };
        img.onerror = () => resolve(event.target.result);
      };
      reader.onerror = (err) => reject(err);
    });
  },

  /**
   * Seed Initial Categories & Products to Supabase Database
   */
  async seedMockDataToSupabase() {
    if (!supabase) throw new Error("Chưa kết nối Supabase.");

    // 1. Seed Categories (filter out 'all')
    const rawCategories = menuCategories.filter(c => c.id !== 'all');
    const categoryMap = {}; // slug -> uuid

    for (let i = 0; i < rawCategories.length; i++) {
      const cat = rawCategories[i];
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .upsert(
          {
            name: cat.name,
            slug: cat.id,
            description: `Nhóm ${cat.name}`,
            sort_order: i + 1,
            is_active: true
          },
          { onConflict: 'slug' }
        )
        .select()
        .single();

      if (catError) {
        console.error("Lỗi khi thêm danh mục:", cat.name, catError);
      } else if (catData) {
        categoryMap[cat.id] = catData.id;
      }
    }

    // Fallback: Fetch existing categories if any were not returned by upsert
    const { data: existingCats } = await supabase.from('categories').select('id, slug');
    existingCats?.forEach(c => {
      categoryMap[c.slug] = c.id;
    });

    // 2. Seed Products
    const productsToInsert = menuProducts.map((p, idx) => ({
      category_id: categoryMap[p.categoryId] || null,
      name: p.name,
      slug: p.id,
      description: p.fullDescription || p.description,
      price: p.price,
      original_price: p.price + 5000,
      image_url: p.image,
      is_available: p.isAvailable,
      is_featured: p.isFeatured,
      sort_order: idx + 1
    }));

    let successCount = 0;
    for (const prod of productsToInsert) {
      const { data: prodData, error: prodError } = await supabase
        .from('products')
        .upsert(prod, { onConflict: 'slug' })
        .select()
        .single();

      if (prodError) {
        console.error("Lỗi khi thêm món:", prod.name, prodError);
      } else if (prodData) {
        successCount++;
      }
    }

    return {
      categoriesCount: Object.keys(categoryMap).length,
      productsCount: successCount
    };
  }
};
