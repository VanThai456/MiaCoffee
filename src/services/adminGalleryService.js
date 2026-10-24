import { supabase, isSupabaseConfigured } from './supabaseClient';
import { adminAuditService } from './adminAuditService';
import { spaceGallery } from '../data/spaceData';

const LOCAL_STORAGE_KEY = 'mia_gallery_images';

// Helper to get local gallery cache
function getLocalGallery() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Error reading local gallery cache:", e);
  }
  // Initialize with initial spaceGallery
  return spaceGallery.map(img => ({
    id: img.id,
    title: img.title,
    category: img.category,
    image_url: img.image,
    created_at: new Date().toISOString()
  }));
}

function saveLocalGallery(items) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn("Error saving local gallery cache:", e);
  }
}

export const adminGalleryService = {
  /**
   * Lấy danh sách ảnh thư viện
   */
  async getGalleryImages({ category = 'all' } = {}) {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('gallery_images')
          .select('*')
          .order('created_at', { ascending: false });

        if (category && category !== 'all') {
          query = query.eq('category', category);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(item => ({
            id: item.id,
            title: item.title,
            category: item.category,
            image: item.image_url || item.image,
            image_url: item.image_url || item.image,
            created_at: item.created_at
          }));
        }
      } catch (err) {
        console.warn("Supabase gallery_images fetch error, using local fallback:", err);
      }
    }

    // Fallback: LocalStorage / Initial Data
    const local = getLocalGallery();
    if (category && category !== 'all') {
      return local.filter(item => item.category === category).map(i => ({
        ...i,
        image: i.image_url || i.image
      }));
    }
    return local.map(i => ({
      ...i,
      image: i.image_url || i.image
    }));
  },

  /**
   * Tải ảnh lên Supabase Storage hoặc nén WebP Base64
   */
  async uploadImage(file) {
    if (!file) return '';

    // 1. Thử tải lên Supabase Storage bucket 'gallery'
    if (isSupabaseConfigured && supabase) {
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const cleanName = file.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, '-');
        const fileName = `${Date.now()}-${cleanName.slice(0, 15)}.${fileExt}`;
        const filePath = `space/${fileName}`;

        const { data, error } = await supabase.storage
          .from('gallery')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (!error && data) {
          const { data: publicData } = supabase.storage
            .from('gallery')
            .getPublicUrl(filePath);

          if (publicData?.publicUrl) {
            return publicData.publicUrl;
          }
        }
      } catch (storageErr) {
        console.warn("Supabase Storage bucket upload fallback:", storageErr);
      }
    }

    // 2. Nén client-side WebP Base64 chất lượng cao nhưng nhẹ
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const maxWidth = 1200;
          const maxHeight = 900;
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
          const compressed = canvas.toDataURL('image/webp', 0.85);
          resolve(compressed);
        };
      };
    });
  },

  /**
   * Thêm ảnh mới vào thư viện
   */
  async addImage({ title, category, imageUrl }) {
    if (!title || !imageUrl) {
      throw new Error("Tiêu đề và đường dẫn ảnh không được để trống.");
    }

    const payload = {
      title: title.trim(),
      category: category || 'all',
      image_url: imageUrl.trim(),
      created_at: new Date().toISOString()
    };

    let newImage = null;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .insert([payload])
          .select()
          .single();

        if (!error && data) {
          newImage = {
            id: data.id,
            title: data.title,
            category: data.category,
            image: data.image_url,
            image_url: data.image_url,
            created_at: data.created_at
          };
        }
      } catch (err) {
        console.warn("Supabase insert gallery error, saving to local:", err);
      }
    }

    if (!newImage) {
      newImage = {
        id: `local-gal-${Date.now()}`,
        ...payload,
        image: payload.image_url
      };
      const local = getLocalGallery();
      saveLocalGallery([newImage, ...local]);
    }

    // Ghi nhật ký audit
    try {
      await adminAuditService.logAction('CREATE', 'gallery_images', {
        title: newImage.title,
        category: newImage.category
      });
    } catch {
      // ignore
    }

    return newImage;
  },

  /**
   * Xóa ảnh khỏi thư viện
   */
  async deleteImage(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('gallery_images')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.warn("Supabase delete gallery error:", err);
      }
    }

    // Always update local cache
    const local = getLocalGallery();
    const updated = local.filter(item => String(item.id) !== String(id));
    saveLocalGallery(updated);

    try {
      await adminAuditService.logAction('DELETE', 'gallery_images', { id });
    } catch {
      // ignore
    }

    return true;
  }
};
