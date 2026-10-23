/**
 * Space Service Layer
 * Provides data abstraction for Cafe zones, amenities and photo lookbook
 */

import { spaceZones, spaceAmenities, spaceGallery, spaceHighlights } from '../data/spaceData';

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
    if (category && category !== 'all') {
      return Promise.resolve(spaceGallery.filter(item => item.category === category));
    }
    return Promise.resolve([...spaceGallery]);
  }
};
