import * as React from "react";

interface HeroAvatarProps {
  src?: string;
  alt?: string;
}

export default function HeroAvatar({
  src = "/profile.webp",
  alt = "Kirian Luna",
}: HeroAvatarProps) {
  return (
    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#171717] ring-1 ring-white/15 shrink-0 select-none">
      <img
        src={src}
        alt={alt}
        width={48}
        height={48}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className="w-full h-full object-cover object-[center_28%]"
      />
    </div>
  );
}
