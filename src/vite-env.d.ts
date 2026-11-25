/// <reference types="vite/client" />

declare const __BUILD_DATE__: string;

declare module "country-flag-icons/react/3x2/*" {
  import type { SVGProps, ComponentType } from "react";
  const FlagComponent: ComponentType<SVGProps<SVGSVGElement> & { title?: string }>;
  export default FlagComponent;
}
