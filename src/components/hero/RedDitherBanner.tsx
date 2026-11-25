import * as React from "react";
import { useEffect, useRef } from "react";

const VS = `#version 300 es
in vec2 aPosition;
out vec2 vUV;
void main() {
  vUV = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FS = `#version 300 es
precision highp float;

in vec2 vUV;
out vec4 finalColor;

uniform float uTime;
uniform vec2 uResolution;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.02 + vec2(17.1, 31.7);
    a *= 0.5;
  }
  return v;
}

float bayer4x4(vec2 pos) {
  int x = int(mod(pos.x, 4.0));
  int y = int(mod(pos.y, 4.0));
  int idx = x + y * 4;
  if (idx == 0) return 0.0 / 16.0;
  if (idx == 1) return 8.0 / 16.0;
  if (idx == 2) return 2.0 / 16.0;
  if (idx == 3) return 10.0 / 16.0;
  if (idx == 4) return 12.0 / 16.0;
  if (idx == 5) return 4.0 / 16.0;
  if (idx == 6) return 14.0 / 16.0;
  if (idx == 7) return 6.0 / 16.0;
  if (idx == 8) return 3.0 / 16.0;
  if (idx == 9) return 11.0 / 16.0;
  if (idx == 10) return 1.0 / 16.0;
  if (idx == 11) return 9.0 / 16.0;
  if (idx == 12) return 15.0 / 16.0;
  if (idx == 13) return 7.0 / 16.0;
  if (idx == 14) return 13.0 / 16.0;
  return 5.0 / 16.0;
}

void main() {
  vec2 fragCoord = vUV * uResolution;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float t = uTime * 0.28;
  vec2 p = vec2((vUV.x - 0.5) * aspect, vUV.y) * 2.8 + vec2(t * 0.06, 0.0);

  vec2 q = vec2(
    fbm(p + vec2(0.0, 0.0) + t * 0.4),
    fbm(p + vec2(5.2, 1.3) - t * 0.3)
  );
  vec2 r = vec2(
    fbm(p + 3.2 * q + vec2(1.7, 9.2) + t * 0.25),
    fbm(p + 3.2 * q + vec2(8.3, 2.8) - t * 0.2)
  );
  float f = fbm(p + 2.6 * r);

  // Shape intensity with subtle vertical attenuation near bottom
  float vFade = smoothstep(0.0, 0.55, vUV.y);
  float intensity = clamp(pow(f * 1.25, 1.35) * (0.45 + 0.65 * vFade), 0.0, 1.0);

  // 4px-pitch dithered halftone cell matching reference
  vec2 cellCoord = floor(fragCoord / 3.0);
  float threshold = bayer4x4(cellCoord);
  float quantized = step(threshold, intensity * 0.92);

  // Subtle continuous glow underneath dots + crisp dithered cobalt/electric blue
  vec3 bg = vec3(0.039, 0.039, 0.039);       // #0a0a0a
  vec3 deepBlue = vec3(0.015, 0.065, 0.200); // #041033
  vec3 midBlue = vec3(0.039, 0.220, 0.600);  // #0a3899
  vec3 brightBlue = vec3(0.00, 0.52, 1.00);  // #0085ff

  vec3 glow = mix(bg, deepBlue, intensity * 0.78);
  vec3 dotColor = mix(midBlue, brightBlue, smoothstep(0.45, 0.88, intensity));
  vec3 col = mix(glow, dotColor, quantized * 0.92);

  finalColor = vec4(col, 1.0);
}`;

/**
 * Atmospheric dithered/halftone WebGL2 banner.
 * Renders an organic multi-octave noise field quantized through a 4x4 Bayer matrix
 * fading seamlessly into #0a0a0a.
 */
export default function RedDitherBanner() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, VS);
    const fs = compile(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const posLoc = gl.getAttribLocation(prog, "aPosition");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRes = gl.getUniformLocation(prog, "uResolution");

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let rafId = 0;
    let visible = true;
    const start = performance.now();

    const draw = (now: number) => {
      if (!visible) return;
      resize();
      gl.useProgram(prog);
      gl.uniform1f(uTime, reducedMotion ? 12.0 : (now - start) * 0.001);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reducedMotion) {
        rafId = requestAnimationFrame(draw);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && !reducedMotion && !rafId) {
          rafId = requestAnimationFrame(draw);
        } else if (!visible && rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    if (reducedMotion) {
      draw(start);
    } else {
      rafId = requestAnimationFrame(draw);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div
      className="red-dither-banner pointer-events-none absolute inset-x-0 top-0 z-0 h-[22dvh] min-h-[140px] max-h-[280px] overflow-hidden select-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="js-red-dither-canvas block w-full h-full" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10, 10, 10, 0) 0%, rgba(10, 10, 10, 0.12) 38%, rgba(10, 10, 10, 0.65) 72%, #0a0a0a 100%)",
        }}
      />
    </div>
  );
}
