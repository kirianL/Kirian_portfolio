import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  blurDataURL?: string;
  priority?: boolean;
}

/**
 * Optimized image component with lazy loading and blur placeholder
 */
export function ImageLoader({
  src,
  alt,
  className,
  blurDataURL,
  priority = false,
}: ImageLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(blurDataURL || src);

  useEffect(() => {
    if (priority) {
      // Load immediately for priority images
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setCurrentSrc(src);
        setIsLoaded(true);
      };
    } else {
      // Lazy load for non-priority images
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = new Image();
              img.src = src;
              img.onload = () => {
                setCurrentSrc(src);
                setIsLoaded(true);
              };
              observer.disconnect();
            }
          });
        },
        { rootMargin: "50px" }
      );

      const imgElement = document.querySelector(`img[alt="${alt}"]`);
      if (imgElement) {
        observer.observe(imgElement);
      }

      return () => observer.disconnect();
    }
  }, [src, alt, priority]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={cn(
        "transition-opacity duration-500",
        isLoaded ? "opacity-100" : "opacity-0",
        className
      )}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
