'use client'

import type { Story } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function StoryCard({ story }: { story: Story }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300 bg-card">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
            <Image
                src={story.imageUrl || "https://placehold.co/600x400.png"}
                alt={story.title}
                fill
                className="object-cover"
                data-ai-hint="african story"
            />
        </div>
        <div className="p-4">
            <div className="flex gap-2 mb-2">
                <Badge variant="outline" className="border-orange-400 text-orange-600">{story.age} yrs</Badge>
                <Badge variant="outline" className="border-blue-400 text-blue-600">{story.grade}</Badge>
            </div>
            <CardTitle className="font-headline text-xl h-14 leading-tight">{story.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">by {story.author}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <p className="text-sm text-foreground/80 line-clamp-3">{story.excerpt}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLiked(!isLiked)}
            className="flex items-center gap-1.5"
            aria-label={isLiked ? "Unlike story" : "Like story"}
          >
            <Heart className={cn("h-5 w-5", isLiked ? "text-red-500 fill-current" : "text-muted-foreground")} />
            <span className="text-sm font-medium">{story.likes + (isLiked ? 1 : 0)}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsBookmarked(!isBookmarked)}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark story"}
          >
            <Bookmark className={cn("h-5 w-5", isBookmarked ? "text-yellow-500 fill-current" : "text-muted-foreground")} />
          </Button>
        </div>
        
      </CardFooter>
    </Card>
  );
}
