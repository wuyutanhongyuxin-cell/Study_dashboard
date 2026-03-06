'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  Newspaper,
  Search,
  GitBranch,
  FolderOpen,
  GraduationCap,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useEffect, useState } from 'react';

const iconMap = {
  LayoutDashboard,
  MessageSquare,
  Bot,
  Newspaper,
  Search,
  GitBranch,
  FolderOpen,
} as const;

const navItems = [
  { id: 'dashboard', label: '学习看板', icon: 'LayoutDashboard', href: '/dashboard' },
  { id: 'chat', label: 'AI 督学', icon: 'MessageSquare', href: '/chat' },
  { id: 'agents', label: 'Agent 报告', icon: 'Bot', href: '/agents' },
  { id: 'briefs', label: '每日晨报', icon: 'Newspaper', href: '/briefs' },
  { id: 'intel', label: '信息聚合', icon: 'Search', href: '/intel' },
  { id: 'knowledge', label: '知识树', icon: 'GitBranch', href: '/knowledge' },
  { id: 'resources', label: '学习资料', icon: 'FolderOpen', href: '/resources' },
] as const;

function SidebarContent() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <div className="flex h-full flex-col bg-card border-r">
      <div className="flex items-center gap-2 p-4 border-b">
        <GraduationCap className="h-6 w-6 text-primary" />
        {sidebarOpen && (
          <span className="font-bold text-lg">Desheng 考研</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto hidden md:flex"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform', !sidebarOpen && 'rotate-180')} />
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t text-xs text-muted-foreground">
        {sidebarOpen && (
          <div className="space-y-1">
            <p>上海交通大学 → 集成电路学院</p>
            <p>085400 电子信息</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function Sidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-3 left-3 z-50 md:hidden">
            <LayoutDashboard className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className={cn(
      'hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300',
      sidebarOpen ? 'w-56' : 'w-16'
    )}>
      <SidebarContent />
    </aside>
  );
}
