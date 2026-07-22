"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  uResolution;
uniform float uPhase;
uniform float uLevel;
uniform float uAA;  // 1.0 desktop (4x supersample), 0.0 mobile (single sample)

uniform float uShine;
uniform float uSpecW;
uniform float uSaturation;
uniform float uZoom;
uniform vec3  uCol1;
uniform vec3  uCol2;
uniform vec3  uCol3;
uniform vec3  uCol4;

const int   MAX_ITERS = 80;
const float EPSILON   = 1e-2;

float saturate(float x) { return clamp(x, 0.0, 1.0); }

float sphereImplicit(vec3 pt, float radius, vec3 position) {
  return length(pt - position) - radius;
}

float smin(float a, float b, float blendRadius) {
  float c = saturate(0.5 + (b - a) * (0.5 / blendRadius));
  return mix(b, a, c) - blendRadius * c * (1.0 - c);
}

float fieldAt(vec3 p, float rad, vec3 c1, vec3 c2, vec3 c3, vec3 c4) {
  return smin(smin(smin(
      sphereImplicit(p, rad, c1),
      sphereImplicit(p, rad, c2), 1.3),
      sphereImplicit(p, rad, c3), 1.3),
      sphereImplicit(p, rad, c4), 1.3);
}

vec3 orbitCenter(float t, float phase, float y0, float xSide) {
  float xDrift = 0.6 * sin(t + phase * 0.7);
  float x = xSide + 0.15 * sin(t * 0.9 + phase);
  float y = y0 + 0.9 * sin(t * 0.6 + phase);
  float z = 0.25 * cos(t * 0.5 + phase);
  return vec3(x + xDrift * 0.15, y, z);
}

vec4 render(vec2 fragCoord) {
  vec2 uv = (fragCoord - 0.5 * uResolution.xy) / uResolution.y;
  uv *= uZoom;

  float t = uPhase;
  float rad = 0.75 + 0.15 * uLevel;

  vec3 c1 = orbitCenter(t, 0.0, -0.6, -0.7);
  vec3 c2 = orbitCenter(t, 1.6,  0.3,  0.65);
  vec3 c3 = orbitCenter(t, 3.1, -0.2, -0.6);
  vec3 c4 = orbitCenter(t, 4.7,  0.55, 0.7);

  vec3 ro = vec3(0.0, 0.0, -3.5);
  vec3 rd = normalize(vec3(uv, 1.0));

  float dist = 0.0;
  float minD = 1e5;
  float d;
  vec3 p;
  for (int i = 0; i < MAX_ITERS; i++) {
    p = ro + rd * dist;
    d = fieldAt(p, rad, c1, c2, c3, c4);
    minD = min(minD, d);
    if (d < EPSILON) break;
    if (dist > 8.0) break;
    dist += d;
  }

  float edgeW = 0.06;
  float edgeAlpha = 1.0 - smoothstep(0.0, edgeW, minD);
  if (edgeAlpha <= 0.001) return vec4(0.0);

  vec3 hit = ro + rd * dist;
  vec2 e = vec2(0.001, 0.0);
  vec3 normal = normalize(vec3(
      fieldAt(hit + e.xyy, rad, c1, c2, c3, c4) - fieldAt(hit - e.xyy, rad, c1, c2, c3, c4),
      fieldAt(hit + e.yxy, rad, c1, c2, c3, c4) - fieldAt(hit - e.yxy, rad, c1, c2, c3, c4),
      fieldAt(hit + e.yyx, rad, c1, c2, c3, c4) - fieldAt(hit - e.yyx, rad, c1, c2, c3, c4)
  ));

  float w1 = 1.0 / (1.0 + distance(hit, c1));
  float w2 = 1.0 / (1.0 + distance(hit, c2));
  float w3 = 1.0 / (1.0 + distance(hit, c3));
  float w4 = 1.0 / (1.0 + distance(hit, c4));
  float wsum = w1 + w2 + w3 + w4;
  vec3 color = (uCol1 * w1 + uCol2 * w2 + uCol3 * w3 + uCol4 * w4) / wsum;

  vec3 lightDir1 = normalize(vec3(0.4, 0.8, -0.5));
  vec3 lightDir2 = normalize(vec3(-0.6, 0.3, -0.7));
  vec3 lightDir3 = normalize(vec3(0.2, -0.5, -0.9));
  vec3 v = normalize(-rd);
  vec3 h1 = normalize(lightDir1 + v);
  vec3 h2 = normalize(lightDir2 + v);
  vec3 h3 = normalize(lightDir3 + v);
  float spec = 1.0;
  float lit = 0.18 + 0.82 * (
      max(dot(normal, lightDir1), 0.0) + uSpecW*spec*pow(max(dot(normal, h1), 0.0), uShine) +
      max(dot(normal, lightDir2), 0.0) + uSpecW*spec*pow(max(dot(normal, h2), 0.0), uShine) +
      max(dot(normal, lightDir3), 0.0) + uSpecW*spec*pow(max(dot(normal, h3), 0.0), uShine)
  );

  float lum = dot(color, vec3(0.299, 0.587, 0.114));
  color = clamp(lum + (color - lum) * uSaturation, 0.0, 1.0);
  vec3 outc = lit * color;
  outc *= (1.0 + 0.25 * uLevel);
  outc *= 1.6;
  float L = dot(outc, vec3(0.299, 0.587, 0.114));
  float Lt = L / (1.0 + L);
  outc *= (L > 1e-4) ? (Lt / L) : 1.0;
  float lum2 = dot(outc, vec3(0.299, 0.587, 0.114));
  outc = clamp(lum2 + (outc - lum2) * 1.25, 0.0, 1.0);
  outc = pow(clamp(outc, 0.0, 1.0), vec3(1.0/2.2));
  return vec4(outc, edgeAlpha);
}

void main() {
  if (uAA < 0.5) {
    // Mobile: single sample (no supersample, no MSAA feather cost).
    gl_FragColor = render(gl_FragCoord.xy);
    return;
  }
  vec3  rgbAcc = vec3(0.0);
  float aAcc   = 0.0;
  vec4 s;
  s = render(gl_FragCoord.xy + vec2(-0.125, -0.375)); rgbAcc += s.rgb * s.a; aAcc += s.a;
  s = render(gl_FragCoord.xy + vec2( 0.375, -0.125)); rgbAcc += s.rgb * s.a; aAcc += s.a;
  s = render(gl_FragCoord.xy + vec2(-0.375,  0.125)); rgbAcc += s.rgb * s.a; aAcc += s.a;
  s = render(gl_FragCoord.xy + vec2( 0.125,  0.375)); rgbAcc += s.rgb * s.a; aAcc += s.a;
  gl_FragColor = vec4(rgbAcc * 0.25, aAcc * 0.25);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type) as WebGLShader;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s) || "unknown";
    gl.deleteShader(s);
    throw new Error("shader compile failed: " + log);
  }
  return s;
}

export default function LavaLampBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return; // respect prefers-reduced-motion — render static bg
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true });
    if (!gl) {
      console.warn("LavaLampBg: WebGL unavailable");
      return;
    }

    let prog: WebGLProgram | null = null;
    let vs: WebGLShader | null = null;
    let fs: WebGLShader | null = null;
    let buf: WebGLBuffer | null = null;

    try {
      prog = gl.createProgram();
      vs = compile(gl, gl.VERTEX_SHADER, VERT);
      fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      if (!prog) throw new Error("createProgram null");
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error("program link failed: " + gl.getProgramInfoLog(prog));
      }
    } catch (e) {
      console.warn("LavaLampBg:", e instanceof Error ? e.message : String(e));
      return;
    }

    gl.useProgram(prog);

    buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uResolution");
    const uPhase = gl.getUniformLocation(prog, "uPhase");
    const uLevel = gl.getUniformLocation(prog, "uLevel");

    // Static params matching Voxis lavalamp theme defaults
    gl.uniform1f(gl.getUniformLocation(prog, "uShine"), 28);
    gl.uniform1f(gl.getUniformLocation(prog, "uSpecW"), 0.6);
    gl.uniform1f(gl.getUniformLocation(prog, "uSaturation"), 1.7);
    gl.uniform1f(gl.getUniformLocation(prog, "uZoom"), 1.7);
    // Perf gate: mobile viewport ⇒ single-sample + DPR clamped to 1.
    // Cuts fragment work by 4×; visible drop in AA is acceptable at small screens.
    // uAA is set inside resize() so it re-evaluates when the viewport crosses
    // the 768px breakpoint (rotate/resize) without needing a page reload.
    const uAA = gl.getUniformLocation(prog, "uAA");
    // Brand-aligned cool palette: cyan → blue → purple → teal
    // (matches --color-accent: #22d3ee and Architecture stage-1 hue)
    gl.uniform3f(gl.getUniformLocation(prog, "uCol1"), 0.13, 0.827, 0.933); // #22d3ee cyan
    gl.uniform3f(gl.getUniformLocation(prog, "uCol2"), 0.231, 0.510, 0.965); // #3b82f6 blue
    gl.uniform3f(gl.getUniformLocation(prog, "uCol3"), 0.659, 0.333, 0.969); // #a855f7 purple
    gl.uniform3f(gl.getUniformLocation(prog, "uCol4"), 0.204, 0.827, 0.706); // teal

    let phase = 0;
    let prevNow = performance.now();
    let raf = 0;
    let running = true;

    function resize() {
      const isMobileNow =
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 767px)").matches;
      const dpr = isMobileNow ? 1 : Math.min(2, window.devicePixelRatio || 1);
      const w = Math.floor(canvas!.clientWidth * dpr);
      const h = Math.floor(canvas!.clientHeight * dpr);
      gl!.uniform1f(uAA, isMobileNow ? 0.0 : 1.0);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
        gl!.uniform2f(uRes, w, h);
      }
    }
    resize();
    window.addEventListener("resize", resize);

    function frame() {
      if (!running) return;
      const now = performance.now();
      const dt = Math.max(0, Math.min(0.05, (now - prevNow) / 1000));
      prevNow = now;
      // idle-only: gentle constant drift (no audio on the web)
      const speed = 0.55;
      const modeSpeed = 0.8;
      const energy = 0.5 + 0.12;
      phase += 0.5 * energy * speed * modeSpeed * dt;
      gl!.uniform1f(uPhase, phase);
      gl!.uniform1f(uLevel, 0.12);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    }

    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        prevNow = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (gl && buf) gl.deleteBuffer(buf);
      if (gl && prog) gl.deleteProgram(prog);
      if (gl && vs) gl.deleteShader(vs);
      if (gl && fs) gl.deleteShader(fs);
      const ext = gl?.getExtension("WEBGL_lose_context");
      if (ext) ext.loseContext();
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
      style={{ zIndex: -1 }}
    />
  );
}
