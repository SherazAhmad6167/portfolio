"use client";

// Dotted 3D globe with arcs flying from a home point to client locations.
// three.js loads after first paint; land dots are precomputed by scripts/build-globe.mjs.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { onIntroDone } from "@/lib/intro";
import { cn } from "@/lib/utils";

export type GlobeMarker = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  sub: string;
  href?: string;
  home?: boolean;
};

type Props = {
  markers: GlobeMarker[];
  /** Point the globe faces at rest */
  view: { lat: number; lng: number };
  className?: string;
};

const dotsVertex = /* glsl */ `
uniform float uSize;
uniform float uReveal;
uniform float uPixelRatio;
attribute float aDelay;
varying float vAlpha;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float facing = normalize(normalMatrix * position).z;
  float reveal = smoothstep(aDelay, aDelay + 0.12, uReveal);
  vAlpha = smoothstep(-0.05, 0.45, facing) * reveal;
  gl_PointSize = uSize * uPixelRatio * (0.55 + 0.45 * facing) * (0.4 + 0.6 * reveal) * (4.9 / -mv.z);
}
`;

const dotsFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(uColor, vAlpha * uOpacity * smoothstep(0.5, 0.3, d));
}
`;

const rimVertex = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

const rimFragment = /* glsl */ `
uniform vec3 uRim;
uniform float uFill;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 3.0);
  gl_FragColor = vec4(uRim, rim * 0.38 + uFill);
}
`;

const arcVertex = /* glsl */ `
varying float vT;
void main() {
  vT = uv.x;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const arcFragment = /* glsl */ `
uniform float uDraw;
uniform float uTime;
uniform float uOffset;
varying float vT;
void main() {
  if (vT > uDraw) discard;
  vec3 a = vec3(0.49, 0.83, 0.99);
  vec3 b = vec3(0.65, 0.55, 0.98);
  vec3 c = vec3(0.96, 0.45, 0.71);
  vec3 col = vT < 0.5 ? mix(a, b, vT * 2.0) : mix(b, c, vT * 2.0 - 1.0);
  float p = fract(uTime * 0.32 + uOffset);
  float pulse = smoothstep(0.07, 0.0, abs(vT - p));
  float head = smoothstep(0.05, 0.0, abs(vT - uDraw)) * step(uDraw, 0.999);
  col = mix(col, vec3(1.0), max(pulse, head) * 0.7);
  float alpha = (0.75 + max(pulse, head) * 0.25) * smoothstep(0.0, 0.03, vT);
  gl_FragColor = vec4(col, alpha);
}
`;

function toVec3(THREE: typeof import("three"), lat: number, lng: number, r = 1) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

export default function ClientGlobe({ markers, view, className }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const land: number[] = (await import("@/content/globe-land.json")).default;
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return;
      }
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      const canvas = renderer.domElement;
      canvas.style.cssText = "width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab";
      el.prepend(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 20);
      camera.position.set(0, 0, 4.9);
      const earth = new THREE.Group();
      scene.add(earth);

      const home = markers.find((m) => m.home) ?? markers[0];
      const homeVec = toVec3(THREE, home.lat, home.lng);

      // Depth-only sphere hides arcs and dots on the far side
      const occluder = new THREE.Mesh(new THREE.SphereGeometry(0.985, 48, 48), new THREE.MeshBasicMaterial({ colorWrite: false }));
      occluder.renderOrder = 0;
      earth.add(occluder);

      const dark = () => document.documentElement.dataset.theme === "dark";
      const rimMat = new THREE.ShaderMaterial({
        vertexShader: rimVertex,
        fragmentShader: rimFragment,
        transparent: true,
        depthWrite: false,
        uniforms: { uRim: { value: new THREE.Color(dark() ? "#8b7bff" : "#a78bfa") }, uFill: { value: dark() ? 0.04 : 0.025 } },
      });
      const rim = new THREE.Mesh(new THREE.SphereGeometry(1.0, 64, 64), rimMat);
      rim.renderOrder = 1;
      earth.add(rim);

      // Land dots, revealed in a wave that spreads out from home
      const count = land.length / 2;
      const positions = new Float32Array(count * 3);
      const delays = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const v = toVec3(THREE, land[i * 2] / 10, land[i * 2 + 1] / 10, 1.0);
        positions.set([v.x, v.y, v.z], i * 3);
        delays[i] = Math.acos(Math.min(1, Math.max(-1, v.dot(homeVec)))) / Math.PI;
      }
      const dotsGeo = new THREE.BufferGeometry();
      dotsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      dotsGeo.setAttribute("aDelay", new THREE.BufferAttribute(delays, 1));
      const dotsMat = new THREE.ShaderMaterial({
        vertexShader: dotsVertex,
        fragmentShader: dotsFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uSize: { value: 3.2 },
          uReveal: { value: reduced ? 1.2 : 0 },
          uPixelRatio: { value: renderer.getPixelRatio() },
          uColor: { value: new THREE.Color(dark() ? "#f4f4f1" : "#0a0a0a") },
          uOpacity: { value: dark() ? 0.55 : 0.5 },
        },
      });
      const dots = new THREE.Points(dotsGeo, dotsMat);
      dots.renderOrder = 2;
      earth.add(dots);

      // Arcs from home to each client, drawn one after another
      const slerp = (a: import("three").Vector3, b: import("three").Vector3, t: number) => {
        const omega = Math.acos(Math.min(1, Math.max(-1, a.dot(b))));
        const s = Math.sin(omega);
        return a.clone().multiplyScalar(Math.sin((1 - t) * omega) / s).add(b.clone().multiplyScalar(Math.sin(t * omega) / s));
      };
      const arcs = markers
        .filter((m) => !m.home)
        .map((m, i) => {
          const end = toVec3(THREE, m.lat, m.lng);
          const omega = Math.acos(homeVec.dot(end));
          const lift = 1 + 0.12 + omega * 0.15;
          const curve = new THREE.CubicBezierCurve3(
            homeVec.clone(),
            slerp(homeVec, end, 0.3).multiplyScalar(lift),
            slerp(homeVec, end, 0.7).multiplyScalar(lift),
            end,
          );
          const mat = new THREE.ShaderMaterial({
            vertexShader: arcVertex,
            fragmentShader: arcFragment,
            transparent: true,
            depthWrite: false,
            uniforms: { uDraw: { value: reduced ? 1 : 0 }, uTime: { value: 0 }, uOffset: { value: i * 0.31 } },
          });
          const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 120, 0.006, 8, false), mat);
          mesh.renderOrder = 3;
          earth.add(mesh);
          return { id: m.id, mat, mesh };
        });

      // Face the configured view: turn around Y first, then tilt
      const viewVec = toVec3(THREE, 0, view.lng);
      const baseY = Math.atan2(-viewVec.x, viewVec.z);
      const baseX = (view.lat * Math.PI) / 180;
      earth.rotation.set(baseX, baseY, 0, "XYZ");

      const resize = () => {
        const { width, height } = el.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      // Drag to spin, with a little inertia; drifts back toward the clients when left alone
      const drag = { active: false, x: 0, y: 0, offY: 0, offX: 0, vel: 0 };
      const down = (e: PointerEvent) => {
        drag.active = true;
        drag.x = e.clientX;
        drag.y = e.clientY;
        canvas.setPointerCapture(e.pointerId);
        canvas.style.cursor = "grabbing";
      };
      const move = (e: PointerEvent) => {
        if (!drag.active) return;
        const dx = e.clientX - drag.x;
        const dy = e.clientY - drag.y;
        drag.x = e.clientX;
        drag.y = e.clientY;
        drag.vel = dx * 0.006;
        drag.offY += drag.vel;
        drag.offX = Math.max(-0.5, Math.min(0.5, drag.offX + dy * 0.004));
      };
      const up = () => {
        drag.active = false;
        canvas.style.cursor = "grab";
      };
      canvas.addEventListener("pointerdown", down);
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerup", up);
      canvas.addEventListener("pointercancel", up);

      const onTheme = () => {
        const d = dark();
        dotsMat.uniforms.uColor.value.set(d ? "#f4f4f1" : "#0a0a0a");
        dotsMat.uniforms.uOpacity.value = d ? 0.55 : 0.5;
        rimMat.uniforms.uRim.value.set(d ? "#8b7bff" : "#a78bfa");
        rimMat.uniforms.uFill.value = d ? 0.04 : 0.025;
      };
      window.addEventListener("themechange", onTheme);

      let visible = true;
      const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { rootMargin: "100px" });
      io.observe(el);

      // Intro clock starts once the page intro has finished
      let introAt = -1;
      const offIntro = onIntroDone(() => (introAt = performance.now()));

      const tmp = new THREE.Vector3();
      const camDir = new THREE.Vector3();
      const markerVecs = markers.map((m) => toVec3(THREE, m.lat, m.lng, 1.01));
      const arcDone = markers.map((m) => !!m.home || reduced);
      const timer = new THREE.Timer();
      let raf = 0;
      let first = true;

      const frame = () => {
        raf = requestAnimationFrame(frame);
        if (!visible || document.hidden) return;
        timer.update();
        const t = timer.getElapsed();
        const since = introAt < 0 ? 0 : (performance.now() - introAt) / 1000;

        if (!reduced) {
          dotsMat.uniforms.uReveal.value = Math.min(1.2, since * 0.8);
          arcs.forEach((a, i) => {
            const start = 1.1 + i * 0.5;
            const p = Math.min(1, Math.max(0, (since - start) / 1.1));
            a.mat.uniforms.uDraw.value = 1 - Math.pow(1 - p, 3);
            a.mat.uniforms.uTime.value = t;
            if (p >= 1) arcDone[markers.findIndex((m) => m.id === a.id)] = true;
          });
          if (!drag.active) {
            drag.offY += drag.vel;
            drag.vel *= 0.94;
            drag.offX *= 0.99;
          }
          // A slow sway between the westmost and eastmost clients brings each into view
          earth.rotation.y = baseY + drag.offY + Math.sin(since * 0.14) * 0.95;
          earth.rotation.x = baseX + drag.offX;
        } else {
          earth.rotation.y = baseY + drag.offY;
          earth.rotation.x = baseX + drag.offX;
        }

        renderer.render(scene, camera);

        // Pin the HTML labels to their spots on the globe
        const { width, height } = el.getBoundingClientRect();
        camDir.copy(camera.position).normalize();
        markers.forEach((m, i) => {
          const node = labelRefs.current[i];
          if (!node) return;
          tmp.copy(markerVecs[i]).applyEuler(earth.rotation);
          const facing = tmp.clone().normalize().dot(camDir);
          tmp.project(camera);
          const x = (tmp.x * 0.5 + 0.5) * width;
          const y = (-tmp.y * 0.5 + 0.5) * height;
          node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          node.dataset.side = x > width * 0.5 ? "left" : "right";
          const show = facing > 0.12 && (m.home ? since > 0.8 || reduced : arcDone[i]);
          node.dataset.on = show ? "true" : "false";
        });

        if (first) {
          first = false;
          setReady(true);
        }
      };
      frame();

      cleanup = () => {
        cancelAnimationFrame(raf);
        offIntro();
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("themechange", onTheme);
        canvas.removeEventListener("pointerdown", down);
        canvas.removeEventListener("pointermove", move);
        canvas.removeEventListener("pointerup", up);
        canvas.removeEventListener("pointercancel", up);
        scene.traverse((o) => {
          const mesh = o as import("three").Mesh;
          mesh.geometry?.dispose();
          const mat = mesh.material as import("three").Material | undefined;
          mat?.dispose?.();
        });
        renderer.dispose();
        canvas.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [markers, view.lat, view.lng]);

  return (
    <div ref={host} className={cn("relative select-none", className)}>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-[14%] rounded-full bg-[radial-gradient(closest-side,rgba(167,139,250,0.22),rgba(125,211,252,0.12)_55%,transparent)] blur-2xl transition-opacity duration-1000",
          ready ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="pointer-events-none absolute inset-0">
        {markers.map((m, i) => (
          <div
            key={m.id}
            ref={(n) => {
              labelRefs.current[i] = n;
            }}
            data-on="false"
            className="group/marker absolute left-0 top-0 will-change-transform data-[on=false]:pointer-events-none"
          >
            <span className="absolute -left-[5px] -top-[5px] block h-2.5 w-2.5 rounded-full bg-fg ring-4 ring-bg transition-[opacity,scale] duration-500 group-data-[on=false]/marker:scale-0 group-data-[on=false]/marker:opacity-0">
              <span className={cn("absolute inset-0 animate-ping rounded-full", m.home ? "bg-emerald-400" : "bg-violet-400")} />
            </span>
            <MarkerTag marker={m} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MarkerTag({ marker }: { marker: GlobeMarker }) {
  const body = (
    <>
      <span className="font-medium text-fg">{marker.label}</span>
      <span className="text-muted">{marker.sub}</span>
      {marker.href && <ArrowUpRight size={13} className="text-muted transition-transform duration-300 group-hover/tag:rotate-45 group-hover/tag:text-fg" />}
    </>
  );
  const cls =
    "group/tag pointer-events-auto absolute left-3 top-0 flex -translate-y-1/2 items-center before:absolute before:-inset-x-1 before:-inset-y-2.5 before:content-[''] group-data-[side=left]/marker:left-auto group-data-[side=left]/marker:right-3 gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface/85 px-3 py-1.5 text-xs shadow-[var(--shadow)] backdrop-blur-md transition-[opacity,translate,scale] duration-500 ease-out-expo group-data-[on=false]/marker:pointer-events-none group-data-[on=false]/marker:scale-90 group-data-[on=false]/marker:opacity-0";
  return marker.href ? (
    <Link href={marker.href} transitionTypes={["nav-forward"]} className={cls} data-cursor="Open">
      {body}
    </Link>
  ) : (
    <span className={cls}>{body}</span>
  );
}
