import { cn } from "@/lib/utils";

export function LightRays({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden",
        className
      )}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] opacity-30 dark:opacity-20">
        <div
          className="w-full h-full animate-ray"
          style={{
            background: `conic-gradient(from 0deg at 50% 50%, 
              transparent 0deg, 
              rgba(59, 130, 246, 0.1) 10deg, 
              transparent 20deg, 
              transparent 40deg, 
              rgba(59, 130, 246, 0.1) 50deg, 
              transparent 60deg, 
              transparent 80deg, 
              rgba(59, 130, 246, 0.1) 90deg, 
              transparent 100deg, 
              transparent 120deg, 
              rgba(59, 130, 246, 0.1) 130deg, 
              transparent 140deg, 
              transparent 160deg, 
              rgba(59, 130, 246, 0.1) 170deg, 
              transparent 180deg, 
              transparent 200deg, 
              rgba(59, 130, 246, 0.1) 210deg, 
              transparent 220deg, 
              transparent 240deg, 
              rgba(59, 130, 246, 0.1) 250deg, 
              transparent 260deg, 
              transparent 280deg, 
              rgba(59, 130, 246, 0.1) 290deg, 
              transparent 300deg, 
              transparent 320deg, 
              rgba(59, 130, 246, 0.1) 330deg, 
              transparent 340deg, 
              transparent 360deg)`,
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
    </div>
  );
}
