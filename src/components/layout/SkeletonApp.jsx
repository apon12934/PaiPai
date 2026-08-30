'use client';
import React from 'react';

export default function SkeletonApp() {
  return (
    <>
      {/* DESKTOP SKELETON (≥ 768px Width) */}
      <div className="hidden md:flex w-full max-w-[1600px] h-full max-h-[92vh] glass-prominent rounded-2xl overflow-hidden animate-pulse">
        {/* Left Sidebar Skeleton */}
        <div style={{ width: 320 }} className="flex-shrink-0 flex flex-col h-full bg-transparent light:bg-slate-100 border-r border-white/5 light:border-slate-200">
          <div className="p-4 border-b border-white/5 light:border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-white/50 light:bg-slate-300 rounded-lg"></div>
            </div>
            <div className="w-8 h-8 bg-white/50 light:bg-slate-300 rounded-full"></div>
          </div>
          <div className="p-4">
            <div className="h-16 bg-white/30 light:bg-slate-200 rounded-xl mb-4"></div>
            <div className="h-4 bg-white/40 light:bg-slate-200 w-24 mb-3 rounded"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-white/20 light:bg-slate-100 rounded-xl flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/40 light:bg-slate-200 rounded-full"></div>
                    <div className="h-3 bg-white/40 light:bg-slate-200 w-16 rounded"></div>
                  </div>
                  <div className="h-3 bg-white/40 light:bg-slate-200 w-12 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Main Panel Skeleton */}
        <div className="flex-1 flex flex-col h-full bg-transparent p-6">
          <div className="h-8 bg-white/30 light:bg-slate-200 w-48 rounded mb-6 mx-auto"></div>
          <div className="h-32 bg-white/20 light:bg-slate-100 rounded-2xl mb-8 w-3/4 mx-auto"></div>
          <div className="h-48 bg-white/10 light:bg-slate-50 rounded-2xl w-3/4 mx-auto"></div>
        </div>
        {/* History Panel Skeleton */}
        <div style={{ width: 280 }} className="flex-shrink-0 flex flex-col h-full bg-transparent light:bg-slate-100 border-l border-white/5 light:border-slate-200">
          <div className="p-4 border-b border-white/5 light:border-slate-200">
            <div className="h-5 bg-white/40 light:bg-slate-200 w-24 rounded"></div>
          </div>
          <div className="p-4 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-14 bg-white/20 light:bg-slate-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE SKELETON (< 768px Width) */}
      <div className="flex md:hidden flex-col w-full h-full bg-[#0A0A0A] light:bg-[#F8F9FE] overflow-hidden animate-pulse">
        <div className="p-4 flex items-center justify-between border-b border-white/5 light:border-slate-200">
          <div className="h-7 w-20 bg-white/50 light:bg-slate-300 rounded"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/50 light:bg-slate-300 rounded-lg"></div>
            <div className="w-8 h-8 bg-white/50 light:bg-slate-300 rounded-full"></div>
          </div>
        </div>
        <div className="flex-1 p-4 space-y-6">
          <div className="h-28 bg-white/20 light:bg-slate-100 rounded-2xl"></div>
          <div className="flex gap-3 overflow-x-hidden pt-3 pb-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-[110px] h-[120px] shrink-0 bg-white/20 light:bg-slate-100 rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-3 pt-2">
            <div className="h-3 bg-white/40 light:bg-slate-200 w-24 rounded mb-2"></div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-white/20 light:bg-slate-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
