/**
 * Space Service Layer
 * Provides data abstraction for Cafe zones, amenities and photo lookbook
 */

import { spaceZones, spaceAmenities, spaceHighlights } from '../data/spaceData';
import { adminGalleryService } from './adminGalleryService';

export const spaceService = {
  async getHighlights() {
    return Promise.resolve({ ...spaceHighlights });
  },

  async getZones() {
    return Promise.resolve([...spaceZones]);
  },

  async getAmenities() {
    return Promise.resolve([...spaceAmenities]);
  },

  async getGallery({ category = 'all' } = {}) {
    return adminGalleryService.getGalleryImages({ category });
  }
};

