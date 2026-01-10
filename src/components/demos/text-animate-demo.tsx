import { TextAnimate } from "@/components/ui/text-animate";

export function TextAnimateDemo() {
  return (
    <div className="flex items-center justify-center p-8 border rounded-lg bg-background">
      <TextAnimate
        animation="blurInUp"
        by="character"
        once
        className="text-4xl font-bold"
      >
        Blur in by character
      </TextAnimate>
    </div>
  );
}
