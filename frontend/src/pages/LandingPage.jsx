import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-zinc-800 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-mono font-bold text-sm tracking-tighter group-hover:bg-zinc-200 transition-colors">
              //
            </div>
            <span className="font-semibold text-sm tracking-wide text-zinc-100">
              signal<span className="text-zinc-500">.chat</span>
            </span>
          </Link>

          {/* Navigation & Auth */}
          <div className="flex items-center gap-3">
            <Link 
              to="/login"
              className="px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/signup"
              className="px-3.5 py-1.5 text-xs font-medium text-zinc-950 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        {/* Main Header & Subtext */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-[11px] font-mono text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            v1.0.0 — WebSockets Engine Ready
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-100 leading-tight">
            Real-time messaging built for focus.
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
            Low-latency persistent channels, direct messaging, and clean media sharing without bloat.
          </p>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link to="/signup" className="px-5 py-2.5 text-xs font-medium bg-zinc-100 text-zinc-950 hover:bg-zinc-200 rounded-md transition-colors shadow-sm">
              Create Account
            </Link>
            <button className="px-5 py-2.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-md transition-colors">
              Read Docs
            </button>
          </div>
        </div>

        {/* Product UI Preview Component */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-2 shadow-2xl shadow-black/80 backdrop-blur-sm">
            {/* Window Controls Header */}
            <div className="h-9 px-3 flex items-center justify-between border-b border-zinc-800/60 bg-zinc-950/60 rounded-t-lg">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-800"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-800"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-800"></div>
              </div>
              <span className="font-mono text-[11px] text-zinc-500"># general — signal.chat</span>
              <div className="w-12"></div>
            </div>

            {/* Mock App Interface */}
            <div className="grid grid-cols-12 h-[380px] bg-zinc-950/90 rounded-b-lg overflow-hidden text-xs">
              {/* Mock Sidebar */}
              <div className="col-span-3 border-r border-zinc-800/80 p-3 flex flex-col justify-between bg-zinc-950">
                <div className="space-y-4">
                  <div className="font-semibold text-zinc-300 text-[11px] uppercase tracking-wider px-2">
                    Channels
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-zinc-800/60 text-zinc-100 font-medium">
                      <span className="text-zinc-500">#</span> general
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 text-zinc-500 hover:text-zinc-300 transition-colors">
                      <span className="text-zinc-600">#</span> engineering
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 text-zinc-500 hover:text-zinc-300 transition-colors">
                      <span className="text-zinc-600">#</span> announcements
                    </div>
                  </div>

                  <div className="font-semibold text-zinc-300 text-[11px] uppercase tracking-wider px-2 pt-2">
                    Direct Messages
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between px-2 py-1.5 text-zinc-400">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        alex_dev
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-2 py-1.5 text-zinc-500">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-zinc-700"></span>
                        sarah_m
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Widget */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-2 px-1">
                  <div className="h-6 w-6 rounded bg-zinc-800 flex items-center justify-center font-mono text-[10px] text-zinc-300">
                    ME
                  </div>
                  <div className="truncate">
                    <p className="text-[11px] font-medium text-zinc-200">Affan</p>
                    <p className="text-[10px] text-zinc-500 truncate">Online</p>
                  </div>
                </div>
              </div>

              {/* Mock Chat Area */}
              <div className="col-span-9 flex flex-col justify-between p-4 bg-zinc-900/20">
                {/* Messages Feed */}
                <div className="space-y-3 overflow-y-auto">
                  <div className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded bg-zinc-800 flex items-center justify-center font-mono text-[10px] text-zinc-300">
                      AD
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-zinc-200 text-[11px]">alex_dev</span>
                        <span className="text-[10px] text-zinc-600">10:42 AM</span>
                      </div>
                      <p className="text-zinc-400 mt-0.5 leading-relaxed">
                        WebSocket connection handler is deployed. Message latency under 15ms.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded bg-zinc-800 flex items-center justify-center font-mono text-[10px] text-zinc-300">
                      ME
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-zinc-200 text-[11px]">Affan</span>
                        <span className="text-[10px] text-zinc-600">10:43 AM</span>
                      </div>
                      <p className="text-zinc-400 mt-0.5 leading-relaxed">
                        Nice. I'm finishing up the frontend auth views now.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Input Bar */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80">
                  <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-500">
                    <span>Message #general...</span>
                    <div className="flex items-center gap-2 text-zinc-600">
                      <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-zinc-900 border border-zinc-800 rounded text-zinc-500">
                        Enter
                      </kbd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs / System Info */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto text-left">
          <div className="p-4 rounded-lg border border-zinc-800/80 bg-zinc-950/40">
            <h3 className="font-mono text-xs text-zinc-200 font-semibold mb-1">Raw WebSockets</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Bi-directional, event-driven communication layer built without heavy abstraction overhead.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-zinc-800/80 bg-zinc-950/40">
            <h3 className="font-mono text-xs text-zinc-200 font-semibold mb-1">JWT Auth</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Stateless authentication workflow protecting socket initialization and REST endpoints.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-zinc-800/80 bg-zinc-950/40">
            <h3 className="font-mono text-xs text-zinc-200 font-semibold mb-1">State Sync</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Clean client-side state handling for channels, direct messages, and online presence tracking.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-xs text-zinc-600 font-mono">
        signal.chat // standard edition
      </footer>
    </div>
  );
}