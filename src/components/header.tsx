'use client';

import { useUser } from '@/firebase';
import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth';
import { Loader2, LogIn, LogOut, LayoutDashboard, ZoomIn, ZoomOut, RotateCcw, Minus, Plus, Instagram, Image } from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Slider } from './ui/slider';


type CanvasSize = { name: 'Post' | 'Story' | 'Square'; width: number; height: number };

interface HeaderProps {
    canvasSize: CanvasSize;
    handleCanvasSizeChange: (size: CanvasSize) => void;
    canvasSizes: CanvasSize[];
    zoomLevel: number;
    handleZoom: (direction: 'in' | 'out') => void;
    resetPanAndZoom: () => void;
    MIN_ZOOM: number;
    MAX_ZOOM: number;
}

export function Header({ 
    canvasSize, 
    handleCanvasSizeChange, 
    canvasSizes, 
    zoomLevel, 
    handleZoom, 
    resetPanAndZoom,
    MIN_ZOOM,
    MAX_ZOOM
}: HeaderProps) {
  const { user, isUserLoading } = useUser();
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

  return (
    <header className="w-full text-left p-4 md:px-8 flex items-center justify-between z-20 bg-background/80 backdrop-blur-sm sticky top-0 border-b">
      <Link href={user ? "/home" : "/"} aria-label="Go to homepage">
        <Logo className="text-[1.5rem] text-primary" />
      </Link>

      {pathname.startsWith("/design") && (
        <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-32">
                {canvasSize.name}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              {canvasSizes.map((size) => (
                <Button
                  key={size.name}
                  variant={canvasSize.name === size.name ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleCanvasSizeChange(size)}
                >
                  {size.name === 'Post' && <Instagram className="w-4 h-4 mr-2" />}
                  {size.name === 'Story' && <Image className="w-4 h-4 mr-2" />}
                  {size.name === 'Square' && <div className="w-4 h-4 mr-2" />}
                  {size.name}
                </Button>
              ))}
            </PopoverContent>
          </Popover>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => handleZoom('out')} disabled={zoomLevel <= MIN_ZOOM}>
                  <ZoomOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom Out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="w-24 text-center text-sm font-medium">{(zoomLevel * 100).toFixed(0)}%</div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => handleZoom('in')} disabled={zoomLevel >= MAX_ZOOM}>
                  <ZoomIn className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom In</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                 <Button variant="ghost" size="icon" onClick={resetPanAndZoom}>
                    <RotateCcw className="h-5 w-5" />
                  </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset View</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

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
                  <Link href="/home">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </Link>
              </DropdownMenuItem>
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
