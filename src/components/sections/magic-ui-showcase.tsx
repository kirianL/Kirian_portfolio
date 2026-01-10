import { LightRaysDemo } from "@/components/demos/light-rays-demo";
import { AnimatedThemeTogglerDemo } from "@/components/demos/animated-theme-toggler-demo";
import { TextAnimateDemo } from "@/components/demos/text-animate-demo";

export function MagicUIShowcase() {
  return (
    <section className="py-20 px-4 md:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Magic UI Components
          </h2>
          <p className="text-muted-foreground">
            Demonstrating the requested components.
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col gap-4 p-6 border rounded-xl bg-card">
            <h3 className="text-xl font-semibold">Animated Theme Toggler</h3>
            <div className="flex items-center justify-center p-8 bg-background/50 rounded-lg">
              <AnimatedThemeTogglerDemo />
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6 border rounded-xl bg-card">
            <h3 className="text-xl font-semibold">Text Animate</h3>
            <TextAnimateDemo />
          </div>

          <div className="flex flex-col gap-4 p-6 border rounded-xl bg-card">
            <h3 className="text-xl font-semibold">Light Rays</h3>
            <LightRaysDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
