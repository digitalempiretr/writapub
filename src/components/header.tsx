'use client';

import { useUser } from '@/firebase';
import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth';
import { Loader2, LogIn, LogOut, RectangleVertical, Smartphone, Square, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import React from 'react';

// This is a placeholder type. You'll need to pass the actual types from your design page.
type DesignControlsProps = {
  canvasSize: any;
  handleCanvasSizeChange: (size: any) => void;
  canvasSizes: any[];
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
}: Partial<DesignControlsProps>) {
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

  // Do not render the header on the landing page if the user is not logged in.
  if (pathname === '/' && !user) {
    return null;
  }

  return (
    <header className="w-full text-left p-4 md:px-8 flex items-center justify-between z-20 bg-background/80 backdrop-blur-sm sticky top-0 border-b">
      <Link href={user ? "/dashboard" : "/"} aria-label="Go to homepage">
        <Logo className="text-[1.5rem] text-primary" />
      </Link>
      <div className="flex items-center gap-4">
        {pathname === '/design' && canvasSizes && (
          <>
            <div className="bg-card/20 backdrop-blur-sm p-1 flex gap-1 flex-shrink-0 rounded-md">
                {canvasSizes.map(size => (
                <TooltipProvider key={size.name}>
                    <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "h-8 w-8 text-primary",
                            canvasSize.name === size.name && "bg-primary-foreground/20"
                        )}
                        onClick={() => handleCanvasSizeChange?.(size)}
                        >
                        {size.name === 'Post' && <Smartphone className="h-5 w-5" />}
                        {size.name === 'Story' && <RectangleVertical className="h-5 w-5" />}
                        {size.name === 'Square' && <Square className="h-5 w-5" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{size.name} Format</p>
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                ))}
            </div>
              <div className="bg-card/20 backdrop-blur-sm p-1 flex items-center gap-1 rounded-md">
              <TooltipProvider>
                  <Tooltip>
                  <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleZoom?.('out')} disabled={zoomLevel! <= MIN_ZOOM!}>
                          <ZoomOut className="h-5 w-5" />
                      </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Zoom Out (-)</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                  <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={resetPanAndZoom}>
                          <RotateCcw className="h-5 w-5" />
                      </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Reset Zoom</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                  <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleZoom?.('in')} disabled={zoomLevel! >= MAX_ZOOM!}>
                          <ZoomIn className="h-5 w-5" />
                      </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Zoom In (+)</p></TooltipContent>
                  </Tooltip>
              </TooltipProvider>
          </div>
          </>
        )}

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
