'use client';

import { Bell, Search, Menu, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';

export function TopNav() {
  const { openMobile, setOpenMobile } = useSidebar();

  const handleLogout = () => {
    document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background/80 px-4 backdrop-blur-md backdrop-saturate-150">
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="mr-4 md:hidden"
        onClick={() => setOpenMobile(!openMobile)}
        aria-label={openMobile ? 'Close sidebar' : 'Open sidebar'}
      >
        {openMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Desktop Sidebar Trigger - hide since we have the collapse button in sidebar */}
      {/* <SidebarTrigger className="mr-4 hidden md:flex" /> */}

      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-[400px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search or type a command"
              className="pl-8 w-full md:w-[350px] lg:w-[400px]"
            />
            <kbd className="pointer-events-none absolute right-2.5 top-2.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-600" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt="@username" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">username</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    user@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
