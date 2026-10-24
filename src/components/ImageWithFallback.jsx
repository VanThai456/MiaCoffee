import { useState, useEffect } from 'react';
import { FALLBACK_PRODUCT_IMAGE } from '../data/menuData';
import { cleanGoogleMapsImageUrl } from '../utils/imageUrlHelper';

/**
 * Image component with automatic fallback handling
 * Solves network / broken image errors gracefully and supports Google Maps / Google Photos URLs
 */
export default function ImageWithFallback({
  src,
  alt = '',
  fallbackSrc = FALLBACK_PRODUCT_IMAGE,
  className = '',
  loading = 'lazy',
  ...props
}) {
  const normalizedSrc = cleanGoogleMapsImageUrl(src);
  const [imgSrc, setImgSrc] = useState(normalizedSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const nextSrc = cleanGoogleMapsImageUrl(src);
    setImgSrc(nextSrc);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc || fallbackSrc}
      alt={alt}
      onError={handleError}
      loading={loading}
      referrerPolicy="no-referrer"
      className={className}
      {...props}
    />
  );
}
