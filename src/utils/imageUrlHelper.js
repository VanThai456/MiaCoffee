/**
 * Image URL Helper for MIA COFFEE
 * Automatically detects and cleans image URLs from Google Maps, Google Photos,
 * Google Drive, and other external CDN sources to ensure they load reliably without 403 errors.
 */

export function cleanGoogleMapsImageUrl(input) {
  if (!input || typeof input !== 'string') return input || '';
  let url = input.trim();

  // Case 1: Google Drive view link -> direct image embed link
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }

  // Case 2: Full Google Maps URL with embedded photo parameter (!6s...)
  if (url.includes('google.com/maps') || url.includes('maps.google')) {
    const match = url.match(/!6s(https?[%:]+[^\!&]+)/i);
    if (match) {
      let extracted = decodeURIComponent(match[1]);
      // Upgrade size if it has =w...-h... or =w...
      extracted = extracted.replace(/=w\d+.*$/, '=w1600');
      return extracted;
    }
  }

  // Case 3: Google UserContent CDN (from Google Maps photos or Google Photos)
  if (url.includes('googleusercontent.com')) {
    // Replace restrictive thumbnail sizes with high resolution
    if (/=w\d+/.test(url)) {
      return url.replace(/=w\d+.*$/, '=w1600');
    } else if (/=s\d+/.test(url)) {
      return url.replace(/=s\d+.*$/, '=s1600');
    }
    return url;
  }

  return url;
}
