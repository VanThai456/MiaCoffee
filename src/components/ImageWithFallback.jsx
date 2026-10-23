import { useState } from 'react';
import { FALLBACK_PRODUCT_IMAGE } from '../data/menuData';

/**
 * Image component with automatic fallback handling
 * Solves network / broken image errors gracefully
 */
export default function ImageWithFallback({
  src,
  alt = '',
  fallbackSrc = FALLBACK_PRODUCT_IMAGE,
  className = '',
  loading = 'lazy',
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

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
      className={className}
      {...props}
    />
  );
}
