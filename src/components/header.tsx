'use client';

import { useUser } from '@/firebase';
import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth';
import { Loader2, LogIn, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Logo } from './logo';
import React from 'react';

type CanvasSize = { name: 'Post' | 'Story' | 'Square'; width: number; height: number };

type HeaderProps = {
  canvasSize?: CanvasSize;
  handleCanvasSizeChange?: (size: CanvasSize) => void;
  canvasSizes?: CanvasSize[];
  zoomLevel?: number;
  handleZoom?: (direction: 'in' | 'out') => void;
  resetPanAndZoom?: () => void;
  MIN_ZOOM?: number;
  MAX_ZOOM?: number;
};

export function Header({ 
  canvasSize, handleCanvasSizeChange, canvasSizes, 
  zoomLevel, handleZoom, resetPanAndZoom, 
  MIN_ZOOM, MAX_ZOOM 
}: HeaderProps) {
  const { user, isUserLoading, claims } = useUser();
  const pathname = usePathname();

  const handleLogin = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth);
  };
  
  const isAdmin = claims?.role === 'admin';

  return (
    <header className="w-full text-left p-4 md:px-8 flex items-center justify-between z-20 bg-background/80 backdrop-blur-sm sticky top-0 border-b">
      <Link href={user ? "/dashboard" : "/"} aria-label="Go to homepage">
        <Logo className="text-[1.5rem] text-primary" />
      </Link>
      <div className="flex items-center gap-4">
        {isUserLoading ? (
          <Button variant="outline" size="sm" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        ) : user ? (
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                        <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
               <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          pathname !== '/' && (
            <Button onClick={handleLogin}>
              <LogIn className="mr-2 h-4 w-4" /> Login with Google
            </Button>
          )
        )}
      </div>
    </header>
  );
}
