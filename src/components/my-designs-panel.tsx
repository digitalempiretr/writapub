
"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Copy, FilePenLine, Check, X, Trash2 } from "lucide-react";
import { DesignTemplate } from "@/lib/design-templates";
import Image from 'next/image';
import { fontOptions } from "@/lib/font-options";

type MyDesignsPanelProps = {
  myDesigns: DesignTemplate[];
  handleSaveDesign: () => void;
  handleDeleteDesign: (id: string) => void;
  handleUpdateDesign: (id: string) => void;
  editingDesignId: string | null;
  handleEditClick: (id: string, name: string) => void;
  handleCancelEdit: () => void;
  editingName: string;
  setEditingName: (name: string) => void;
  designToDelete: string | null;
  setDesignToDelete: (id: string | null) => void;
  handleLogDesign: () => void;
  handleApplyTemplate: (template: DesignTemplate) => void;
};

export function MyDesignsPanel({
  myDesigns,
  handleSaveDesign,
  handleDeleteDesign,
  handleUpdateDesign,
  editingDesignId,
  handleEditClick,
  handleCancelEdit,
  editingName,
  setEditingName,
  designToDelete,
  setDesignToDelete,
  handleLogDesign,
  handleApplyTemplate,
}: MyDesignsPanelProps) {
  return (
    <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4 mobile-tab-content">
      <div className="flex justify-between items-center">
        <Label className="bg-zinc-200 p-2 px-6 rounded-md">MY DESIGNS</Label>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleLogDesign} size="sm" variant="outline">
                <Copy className="mr-2 h-4 w-4" /> Log
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Log current design to console for development.</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleSaveDesign} size="sm">
                <Plus className="mr-2 h-4 w-4" /> Save Current
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save the current settings as a new design.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      {myDesigns.length > 0 ? (
        <AlertDialog open={!!designToDelete} onOpenChange={(open) => !open && setDesignToDelete(null)}>
          <Carousel
            opts={{
              align: "start",
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {myDesigns.map((template) => (
                <CarouselItem key={template.id} className="basis-1/4 pl-2">
                  <div className="relative group">
                    <button onClick={() => editingDesignId !== template.id && handleApplyTemplate(template)} className="w-full" disabled={editingDesignId === template.id}>
                      <Card className="overflow-hidden">
                        <CardContent className="p-0 aspect-[2/3] w-full">
                          {template.previewImage ? (
                            <Image src={template.previewImage} alt={template.name} width={200} height={300} className="object-cover h-full w-full" />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center p-2 text-center"
                              style={{ background: template.background.value }}
                            >
                              <span
                                style={{
                                  fontFamily: fontOptions.find(f => f.value === template.font.value)?.fontFamily || 'sans-serif',
                                  color: template.font.color
                                }}
                                className="text-lg font-bold"
                              >
                                {template.name}
                              </span>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="p-2 justify-center flex-col items-center">
                          {editingDesignId === template.id ? (
                            <div className="flex items-center gap-1 w-full">
                              <Input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="h-7 text-xs"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleUpdateDesign(template.id)}
                              />
                            </div>
                          ) : (
                            <p className="text-xs font-semibold truncate">{template.name}</p>
                          )}
                        </CardFooter>
                      </Card>
                    </button>
                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingDesignId === template.id ? (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" className="h-7 w-7 bg-green-100 hover:bg-green-200" onClick={() => handleUpdateDesign(template.id)}>
                                <Check className="h-4 w-4 text-green-700" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Save Name</p></TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleCancelEdit}>
                                <X className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Cancel</p></TooltipContent>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleEditClick(template.id, template.name)}>
                                <FilePenLine className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Edit Name</p></TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => setDesignToDelete(template.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Design</p></TooltipContent>
                          </Tooltip>
                        </>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your custom design.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => designToDelete && handleDeleteDesign(designToDelete)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          <p>You haven't saved any designs yet.</p>
          <p className="text-xs">Click "Save Current" to add a design.</p>
        </div>
      )}
    </div>
  );
}
