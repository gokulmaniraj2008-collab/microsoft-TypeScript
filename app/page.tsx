"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CarShowcase, { type CameraPreset } from "@/components/CarShowcase";

gsap.registerPlugin(ScrollTrigger);

const paintOptions = [
  { name: "Obsidian Black", value: "#070b10" },
  { name: "Arctic Silver", value: "#c7d0d8" },
  { name: "Crimson Red", value: "#a91327" },
  { name: "Electric Blue", value: "#1b5bd4" },
  { name: "Forest Green", value: "#0d4b3d" },
  { name: "Sunset Orange", value: "#cf6b2f" },
];

const wheelOptions = [
  { id: "performance", label: "Performance" },
  { id: "sport", label: "Sport" },
  { id: "track", label: "Track" },
];

const specs = [
  { label: "Power", value: "670 hp" },
  { label: "0-100 km/h", value: "3.1 s" },
  { label: "Top Speed", value: "250 km/h" },
  { label: "Drive", value: "AWD" },
];

export default function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [paint, setPaint] = useState(paintOptions[0].value);
  const [wheelStyle, setWheelStyle] = useState("performance");
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("front");
  const [doorOpen, setDoorOpen] = useState(0);
  const [bonnetOpen, setBonnetOpen] = useState(0);
  const [bootOpen, setBootOpen] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".headline", { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" });
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element, index) => {
        gsap.fromTo(element, { opacity: 0, y: 32 }, {
          opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: index * 0.1,
          scrollTrigger: { trigger: element, start: "top 85%" },
        });
      });
      gsap.to(".scroll-panel", {
        y: -95, ease: "none",
        scrollTrigger: { trigger: ".section-sequence", start: "top center", end: "bottom bottom", scrub: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const handleFullscreen = async () => {
    const doc = document.documentElement;
    if (!document.fullscreenElement) await doc.requestFullscreen().catch(() => undefined);
    else await document.exitFullscreen().catch(() => undefined);
  };

  const toggleValue = (value: number, setter: (next: number) => void) => setter(value > 0.1 ? 0 : 0.6);

  return (
    <div ref={rootRef} className="min-h-screen bg-[#05080d] text-white selection:bg-white/20">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05080d]/75 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <a href="#experience" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs font-semibold tracking-[0.28em]">A</div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.38em] text-white/50">Apex</p>
              <p className="text-sm font-semibold tracking-[0.2em] text-white/80">MOTORS</p>
            </div>
          </a>
          <div className="hidden items-center gap-10 text-xs uppercase tracking-[0.28em] text-white/60 md:flex">
            <a href="#experience" className="transition hover:text-white">Experience</a>
            <a href="#performance" className="transition hover:text-white">Performance</a>
            <a href="#design" className="transition hover:text-white">Design</a>
            <a href="#specs" className="transition hover:text-white">Specs</a>
          </div>
          <a href="#specs" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.32em] text-white/80 transition hover:border-white/30 hover:bg-white/10">Book a drive</a>
        </nav>
      </header>

      <main>
        <section id="experience" className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(149,165,180,0.18),_transparent_35%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pb-24 pt-10 lg:grid-cols-[1.05fr_1.35fr] lg:px-10 lg:pt-16">
            <div className="headline space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-white/70">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />2026 Apex GT-R
              </div>
              <div className="space-y-5">
                <p className="text-[10px] uppercase tracking-[0.45em] text-white/50">Electric performance</p>
                <h1 className="max-w-xl text-5xl font-semibold leading-[0.9] tracking-[-0.05em] text-white md:text-6xl xl:text-8xl">Sculpted for the next horizon.</h1>
              </div>
              <p className="max-w-lg text-base leading-7 text-white/65">
                Precision-built luxury performance with advanced aerodynamics, a driver-first cockpit, and a cinematic 360° showcase designed to feel as fast as it looks.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => setCameraPreset("interior")} className="rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#0a0d12] transition hover:scale-[1.02]">Explore interior</button>
                <button onClick={handleFullscreen} className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:border-white/30 hover:bg-white/10">Fullscreen</button>
              </div>
              <div className="grid max-w-md grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-white/50">{spec.label}</p>
                    <p className="mt-2 text-lg font-semibold tracking-[-0.05em] text-white">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="scroll-panel rounded-[2rem] border border-white/10 bg-[#0a0d12]/80 p-4 shadow-[0_0_80px_rgba(59,130,246,0.15)]">
                <div className="rounded-[1.5rem] border border-white/10 bg-[#070b10] p-3">
                  <CarShowcase paint={paint} wheelStyle={wheelStyle} cameraPreset={cameraPreset} doorOpen={doorOpen} bonnetOpen={bonnetOpen} bootOpen={bootOpen} />
                </div>
              </div>
              <div className="absolute -bottom-5 left-5 right-5 grid gap-3 rounded-[1.5rem] border border-white/10 bg-black/45 p-4 backdrop-blur-xl md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Camera</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(["front", "rear", "side", "top", "interior"] as const).map((preset) => (
                      <button key={preset} onClick={() => setCameraPreset(preset)}
                        className={["rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] transition", cameraPreset === preset ? "bg-white text-[#081014]" : "border border-white/10 bg-white/5 text-white/75 hover:border-white/20 hover:bg-white/10"].join(" ")}>
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setCameraPreset("front")} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-white/80 transition hover:border-white/30 hover:bg-white/10">Reset view</button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="reveal mb-10 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.38em] text-white/50">Configurator</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">Build your exact dream spec.</h2>
            </div>
            <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white/65 md:block">Live options</div>
          </div>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="reveal rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Exterior finish</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {paintOptions.map((option) => (
                      <button key={option.value} onClick={() => setPaint(option.value)} title={option.name}
                        className={["group flex items-center gap-3 rounded-full border px-3 py-2 transition", paint === option.value ? "border-white/40 bg-white/10" : "border-white/10 bg-transparent hover:border-white/20"].join(" ")}>
                        <span className="h-5 w-5 rounded-full border border-white/20" style={{ background: option.value }} />
                        <span className="text-[10px] uppercase tracking-[0.22em] text-white/80">{option.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Alloy package</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {wheelOptions.map((option) => (
                      <button key={option.id} onClick={() => setWheelStyle(option.id)}
                        className={["rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.25em] transition", wheelStyle === option.id ? "border-white/40 bg-white/10 text-white" : "border-white/10 bg-transparent text-white/75 hover:border-white/20"].join(" ")}>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Mechanical access</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <button onClick={() => toggleValue(doorOpen, setDoorOpen)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-[10px] uppercase tracking-[0.2em] text-white/80 hover:border-white/20">{doorOpen > 0.1 ? "Close doors" : "Open doors"}</button>
                    <button onClick={() => toggleValue(bonnetOpen, setBonnetOpen)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-[10px] uppercase tracking-[0.2em] text-white/80 hover:border-white/20">{bonnetOpen > 0.1 ? "Close bonnet" : "Open bonnet"}</button>
                    <button onClick={() => toggleValue(bootOpen, setBootOpen)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-[10px] uppercase tracking-[0.2em] text-white/80 hover:border-white/20">{bootOpen > 0.1 ? "Close boot" : "Open boot"}</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="reveal grid gap-5 md:grid-cols-3">
              {[
                { title: "Aerodynamic profile", body: "Active airflow channels optimize downforce while preserving a low drag silhouette." },
                { title: "Driver cockpit", body: "A layered dashboard, full-width display, and carbon sports seats create an immersive cabin." },
                { title: "Luxury detail", body: "Ambient light, leather stitching, and brushed metal finishes add a refined performance character." },
              ].map((feature) => (
                <article key={feature.title} className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-5">
                  <div className="mb-4 h-10 w-10 rounded-full border border-white/10 bg-white/5" />
                  <h3 className="text-xl font-medium tracking-[-0.05em] text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/60">{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="performance" className="section-sequence border-y border-white/10 bg-[#091018]">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
            <div className="reveal space-y-6">
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">Performance</p>
              <h3 className="text-4xl font-semibold tracking-[-0.06em] text-white md:text-6xl">Precision in every motion.</h3>
              <p className="max-w-lg text-base leading-7 text-white/65">A dual-motor architecture delivers immediate torque vectoring, a low centre of gravity, and dynamically balanced handling on every road surface.</p>
            </div>
            <div className="reveal grid gap-4 sm:grid-cols-2">
              {[["Battery", "98 kWh"], ["Range", "520 km"], ["Charging", "18 min to 80%"], ["Traction", "Torque vectoring"]].map(([label, value]) => (
                <div key={label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-white/50">{label}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="design" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="reveal mb-6">
            <p className="text-[10px] uppercase tracking-[0.38em] text-white/50">Design language</p>
            <h3 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-white md:text-6xl">Luxury, crafted for speed.</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "Glass canopy", body: "Curved panoramic glass creates an airy, immersive cabin while reducing visual drag." },
              { title: "Carbon aero kit", body: "Front splitter, rear diffuser, and side skirts sharpen the vehicle’s performance stance." },
              { title: "Adaptive LED lighting", body: "Signature light signatures amplify the GT-R silhouette at night and in motion." },
            ].map((chunk) => (
              <div key={chunk.title} className="reveal rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-4 h-14 w-14 rounded-full border border-white/10 bg-[radial-gradient(circle,_rgba(255,255,255,0.18),_rgba(255,255,255,0.02)_70%)]" />
                <h4 className="text-2xl font-medium tracking-[-0.05em] text-white">{chunk.title}</h4>
                <p className="mt-4 text-sm leading-6 text-white/60">{chunk.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="specs" className="border-t border-white/10 bg-[#05080d]">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
            <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.38em] text-white/50">360° showcase</p>
                <h3 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-white md:text-6xl">Tailored for luxury drivers.</h3>
              </div>
              <button onClick={() => setCameraPreset("side")} className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-[10px] uppercase tracking-[0.25em] text-white/80 transition hover:border-white/30 hover:bg-white/10">Start showcase</button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/10 px-6 py-8 text-center text-[10px] uppercase tracking-[0.3em] text-white/35">Apex Motors · Crafted for the next horizon</footer>
    </div>
  );
}
