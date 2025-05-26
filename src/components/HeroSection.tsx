import React, { ReactNode } from "react";

export default function HeroSection({ children }: { children?: ReactNode }) {
  return (
    <section className="relative w-full max-w-2xl text-center mt-20 mb-12 mx-auto flex flex-col items-center justify-center">
      {/* Animated background blob for dark mode */}
      <div className="absolute -z-10 left-1/2 top-0 -translate-x-1/2 blur-2xl opacity-80 animate-pulse">
        <svg width="480" height="320" viewBox="0 0 480 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="240" cy="160" rx="200" ry="80" fill="url(#paint0_radial_dark)" />
          <defs>
            <radialGradient id="paint0_radial_dark" cx="0" cy="0" r="1" gradientTransform="translate(240 160) scale(200 80)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="0.5" stopColor="#6366f1" stopOpacity="0.8" />
              <stop offset="1" stopColor="#0ea5e9" stopOpacity="0.5" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-blue-200 mb-4 drop-shadow-lg">
        GitIntel
      </h1>
      <p className="text-xl md:text-2xl text-blue-100 mb-8 font-medium drop-shadow">
        Analyze and compare open source projects instantly.
      </p>
      {children}
    </section>
  );
} 