'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BrainCircuit, 
  Activity, 
  GitCommit, 
  Database, 
  Compass, 
  Columns, 
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { getHealth } from '@/lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const [hindsightStatus, setHindsightStatus] = useState<string>('Checking...');

  useEffect(() => {
    getHealth()
      .then((data) => setHindsightStatus(data.hindsight))
      .catch(() => setHindsightStatus('Offline Mode'));
  }, []);

  const navItems = [
    { name: 'Overview', href: '/', icon: Activity },
    { name: 'Incidents', href: '/incidents', icon: Zap },
    { name: 'Deployments', href: '/deployments', icon: GitCommit },
    { name: 'Memory Explorer', href: '/memory', icon: Database },
    { name: 'Before vs After', href: '/compare', icon: Columns },
    { name: 'Patterns', href: '/patterns', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-inner">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">DeployLens</span>
              <span className="ml-2 rounded border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-300">
                NovaCart
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800/80 text-indigo-400 border border-slate-700/60'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Status Indicator */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                hindsightStatus.includes('Connected') ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
              <span className={`relative inline-flex h-2 w-2 rounded-full ${
                hindsightStatus.includes('Connected') ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
            </span>
            <span className="font-medium text-slate-300">
              {hindsightStatus}
            </span>
          </div>

          <div className="hidden sm:block text-xs text-slate-500 border-l border-slate-800 pl-3">
            Hindsight Bank: <span className="font-mono text-slate-400">novacart-prod</span>
          </div>
        </div>
      </div>
    </header>
  );
}
