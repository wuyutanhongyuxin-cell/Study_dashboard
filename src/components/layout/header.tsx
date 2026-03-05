'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { SUBJECTS } from '@/lib/constants';

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function Header() {
  const { theme, setTheme } = useTheme();
  const timer = useAppStore((s) => s.timer);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const subjectName = timer.subject
    ? SUBJECTS.find((s) => s.id === timer.subject)?.name
    : null;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:hidden">
          <span className="font-bold">Desheng 考研</span>
        </div>

        <div className="flex-1" />

        {timer.isRunning && (
          <div className="flex items-center gap-2 mr-4 text-sm font-mono bg-primary/10 rounded-lg px-3 py-1">
            <Timer className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-primary font-medium">{subjectName}</span>
            <span>{formatTime(timer.elapsed)}</span>
          </div>
        )}

        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </header>
  );
}
