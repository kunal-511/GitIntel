import React from "react";

export default function BackgroundEffect() {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none">
      {/* Animated gradient blobs for dark mode */}
      <div className="absolute left-1/4 top-0 w-96 h-96 bg-cyan-700 opacity-30 rounded-full filter blur-3xl animate-blob1" />
      <div className="absolute right-1/4 bottom-0 w-96 h-96 bg-indigo-800 opacity-30 rounded-full filter blur-3xl animate-blob2" />
      <div className="absolute left-1/2 top-1/2 w-80 h-80 bg-blue-900 opacity-20 rounded-full filter blur-2xl animate-blob3" />
      <style jsx global>{`
        @keyframes blob1 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-40px) scale(1.1); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(40px) scale(1.1); }
        }
        @keyframes blob3 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.07); }
        }
        .animate-blob1 { animation: blob1 12s infinite ease-in-out; }
        .animate-blob2 { animation: blob2 14s infinite ease-in-out; }
        .animate-blob3 { animation: blob3 16s infinite ease-in-out; }
      `}</style>
    </div>
  );
} 