import { supabase, isSupabaseConfigured } from './supabaseClient';
import { brandInfo } from '../data/brandData';

/**
 * Admin Site Settings Service
 * Connects directly to Supabase table: `site_settings`
 */
export const adminSettingsService = {
  async getAllSettings() {
    if (!isSupabaseConfigured || !supabase) {
      return {
        brand_name: brandInfo.name,
        tagline: brandInfo.tagline,
        description: brandInfo.description,
        address: brandInfo.contact.address,
        hotline: brandInfo.contact.hotline,
        email: brandInfo.contact.email,
        opening_hours: brandInfo.contact.openingHours,
        maps_url: brandInfo.contact.mapsUrl
      };
    }

    const { data, error } = await supabase
      .from('site_settings')
      .select('*');

    if (error) {
      console.error("Supabase site_settings error:", error);
      return null;
    }

    // Convert array of { setting_key, value } into an object
    const settingsMap = {};
    data?.forEach(item => {
      settingsMap[item.setting_key] = item.value;
    });

    return settingsMap;
  },

  async updateSetting(setting_key, value) {
    if (!supabase) throw new Error("Chưa kết nối Supabase.");

    const { data, error } = await supabase
      .from('site_settings')
      .upsert(
        {
          setting_key,
          value,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'setting_key' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
