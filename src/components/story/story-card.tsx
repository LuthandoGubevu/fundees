'use client'

import type { Story } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, School } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { toggleLikeStory } from "@/lib/firestore";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export function StoryCard({ story }: { story: Story }) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [likes, setLikes] = useState(story.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, startLiking] = useTransition();

  useEffect(() => {
    // Listen for real-time updates on likes count
    const storyUnsub = onSnapshot(doc(db, "stories", story.id), (doc) => {
      const data = doc.data();
      if (data && typeof data.likes === 'number') {
        setLikes(data.likes);
      }
    });

    // Listen for real-time updates on whether the current user has liked the story
    let likeUnsub = () => {};
    if (user?.id) {
      likeUnsub = onSnapshot(doc(db, "stories", story.id, "likes", user.id), (doc) => {
        setHasLiked(doc.exists());
      });
    } else {
      setHasLiked(false);
    }

    return () => {
      storyUnsub();
      likeUnsub();
    };
  }, [story.id, user?.id]);

  const handleLike = async () => {
    if (!isAuthenticated || !user) {
        toast({
            variant: "destructive",
            title: "Please login",
            description: "You need to be logged in to like a story.",
        });
        return;
    }
    
    startLiking(async () => {
        try {
            await toggleLikeStory(story.id, story.authorId, user.id);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: "Could not update your like. Please try again.",
            });
        }
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden rounded-xl shadow-md bg-white max-w-xs sm:max-w-sm w-full mx-auto transform hover:-translate-y-1 transition-transform duration-300">
      <Link href={`/story/${story.id}`} className="flex flex-col flex-grow no-underline text-current p-4 space-y-2">
        <CardHeader className="p-0">
           <CardTitle className="font-semibold text-lg truncate">{story.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-grow space-y-2">
            <div className="text-sm text-muted-foreground space-y-1">
                <p className="truncate">by {story.author}</p>
                 {story.school && (
                    <p className="flex items-center gap-1.5 truncate">
                        <School className="h-4 w-4 flex-shrink-0"/> {story.school}
                    </p>
                )}
            </div>
          <p className="text-sm text-foreground/80 line-clamp-3">{story.excerpt}</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
              <Badge variant="outline" className="text-xs">{story.age} yrs</Badge>
              <Badge variant="outline" className="text-xs">{story.grade}</Badge>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-2 flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={isLiking || !isAuthenticated}
          className="flex items-center space-x-1 text-red-500 hover:text-red-600 disabled:text-red-300 px-1"
          aria-label={hasLiked ? "Unlike story" : "Like story"}
        >
          <Heart className={cn("h-5 w-5", hasLiked ? "fill-current" : "")} />
          <span className="text-sm font-medium">{likes}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
