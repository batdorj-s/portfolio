import React, { useState, useMemo } from 'react'
import { OptimizedImage } from './OptimizedImage'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  priority?: boolean
  blurDataURL?: string
  onLoad?: () => void
}

// Convert image path to WebP if original doesn't exist
function getOptimizedImagePath(src?: string): string {
  if (!src) return ''
  
  // If already webp, return as is
  if (src.endsWith('.webp')) return src
  
  // Convert to webp path for optimization
  const basePath = src.replace(/\.(png|jpg|jpeg|gif)$/i, '.webp')
  return basePath
}

// Generate a minimal blur placeholder
function generateBlurPlaceholder(): string {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJibHVyIj48ZmVHYXVzc2lhbiBpbj0iU291cmNlR3JhcGhpYyIgc3RkRGV2aWF0aW9uPSI0MCIgLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI2JsdXIpIiBmaWxsPSIjMDAwMEZGIiBvcGFjaXR5PSIwLjEiIC8+PC9zdmc+'
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, priority = false, blurDataURL, onLoad, ...rest } = props
  
  const optimizedSrc = useMemo(() => getOptimizedImagePath(src), [src])
  const blurPlaceholder = useMemo(() => blurDataURL || generateBlurPlaceholder(), [blurDataURL])

  if (didError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
        </div>
      </div>
    )
  }

  return (
    <OptimizedImage
      src={src || ''}
      alt={alt || 'Portfolio image'}
      blurDataURL={blurPlaceholder}
      priority={priority}
      className={className}
      onLoad={onLoad}
    />
  )
}
