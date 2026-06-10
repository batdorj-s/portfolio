/**
 * Image Optimization Utilities for Vite + React
 * Provides helpers for converting, optimizing, and loading images efficiently
 */

/**
 * Configuration for image optimization
 */
export const IMAGE_CONFIG = {
  // Lazy load threshold (px from viewport)
  LAZY_LOAD_MARGIN: 50,
  
  // Fade-in animation duration (ms)
  FADE_DURATION: 600,
  
  // Blur animation duration (ms)
  BLUR_DURATION: 800,
  
  // WebP support check (cache result)
  SUPPORTS_WEBP: (() => {
    const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
    if (canvas) {
      canvas.width = canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
    }
    return false;
  })(),
  
  // Image quality settings
  QUALITY: {
    THUMBNAIL: 40,
    SMALL: 60,
    MEDIUM: 75,
    LARGE: 85,
    ORIGINAL: 95
  },
  
  // Responsive breakpoints
  BREAKPOINTS: {
    MOBILE: 480,
    TABLET: 768,
    DESKTOP: 1024,
    WIDE: 1440
  }
};

/**
 * Convert image path to WebP format
 * @param imagePath Original image path
 * @returns WebP image path
 */
export function convertToWebP(imagePath: string): string {
  if (!imagePath) return '';
  if (imagePath.endsWith('.webp')) return imagePath;
  return imagePath.replace(/\.(png|jpg|jpeg|gif)$/i, '.webp');
}

/**
 * Get optimized image sources for responsive design
 * @param basePath Base image path
 * @param sizes Image sizes for responsive design
 * @returns Picture element compatible sources
 */
export function getOptimizedSources(basePath: string, sizes?: Record<string, string>) {
  const webpPath = convertToWebP(basePath);
  
  return {
    webp: webpPath,
    fallback: basePath,
    srcSet: sizes || {
      mobile: convertToWebP(basePath),
      tablet: convertToWebP(basePath),
      desktop: convertToWebP(basePath)
    }
  };
}

/**
 * Generate a minimal blur placeholder SVG
 * @param color Color of the placeholder
 * @param width SVG width
 * @param height SVG height
 * @returns Data URL of blur placeholder
 */
export function generateBlurPlaceholder(
  color = '#0000FF',
  width = 400,
  height = 300
): string {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <filter id="blur">
      <feGaussian in="SourceGraphic" stdDeviation="40" />
    </filter>
    <rect width="${width}" height="${height}" filter="url(#blur)" fill="${color}" opacity="0.1" />
  </svg>`;
  
  const encoded = btoa(svg);
  return `data:image/svg+xml;base64,${encoded}`;
}

/**
 * Check if image is in viewport or near it
 * @param element DOM element
 * @param margin Margin from viewport (px)
 * @returns true if element is visible or near viewport
 */
export function isElementNearViewport(element: HTMLElement, margin = 50): boolean {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  
  return rect.bottom + margin > 0 && rect.top - margin < viewportHeight;
}

/**
 * Preload image for priority loading
 * @param src Image source
 */
export function preloadImage(src: string): void {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
}

/**
 * Get optimal image format based on browser support
 * @param originalPath Original image path
 * @returns Optimal image path (WebP if supported, otherwise original)
 */
export function getOptimalFormat(originalPath: string): string {
  if (IMAGE_CONFIG.SUPPORTS_WEBP) {
    return convertToWebP(originalPath);
  }
  return originalPath;
}

/**
 * Calculate image aspect ratio
 * @param width Image width
 * @param height Image height
 * @returns Aspect ratio (width / height)
 */
export function getAspectRatio(width: number, height: number): number {
  return width / height;
}

/**
 * Format file size for display
 * @param bytes File size in bytes
 * @returns Formatted size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Performance metrics for image loading
 */
export class ImagePerformanceMetrics {
  private static metrics: Record<string, number> = {};
  
  static recordLoadTime(imageSrc: string, duration: number): void {
    this.metrics[imageSrc] = duration;
  }
  
  static getLoadTime(imageSrc: string): number | undefined {
    return this.metrics[imageSrc];
  }
  
  static getAverageLoadTime(): number {
    const values = Object.values(this.metrics);
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
  
  static clearMetrics(): void {
    this.metrics = {};
  }
}

/**
 * Export utility for creating responsive image sizes
 */
export const ResponsiveImageSizes = {
  small: '(max-width: 480px) 100vw, (max-width: 768px) 100vw, 50vw',
  medium: '(max-width: 480px) 100vw, (max-width: 1024px) 80vw, 60vw',
  large: '(max-width: 480px) 100vw, (max-width: 1024px) 80vw, 100vw'
};
