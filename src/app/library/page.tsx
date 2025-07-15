
'use client';
import { getStories } from "@/lib/firestore";
import { StoryCard } from "@/components/story/story-card";
import { StoryCardSkeleton } from "@/components/story/story-card-skeleton";
import { Suspense, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Story } from "@/lib/types";

export default function LibraryPage() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/fundee-5.jpg')" }}
    >
      <div className="min-h-screen w-full bg-background/60 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-headline text-5xl md:text-6xl font-bold text-accent">Story Library</h1>
            <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
              Explore a universe of wonderful stories created by young authors just like you!
            </p>
          </div>

          <div className="mb-8 p-4 bg-sky-blue/60 rounded-xl shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="relative lg:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Search for stories..." className="pl-10 bg-white/90" />
                </div>
              <FilterSelect placeholder="Filter by Grade" options={["1st Grade", "2nd Grade", "3rd Grade"]} />
              <FilterSelect placeholder="Filter by Subject" options={["Reading", "Folklore", "Science"]} />
              <FilterSelect placeholder="Filter by Language" options={["English", "Swahili", "Yoruba"]} />
            </div>
          </div>
          
          <Suspense fallback={<StoryGridSkeleton />}>
            <StoryList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ placeholder, options }: { placeholder: string, options: string[] }) {
    return (
        <div>
            <Select>
                <SelectTrigger className="bg-white/90">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map(option => (
                        <SelectItem key={option} value={option.toLowerCase()}>{option}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

function StoryList() {
  const [stories, setStories] = useState<Story[]>([]);
  
  useEffect(() => {
    async function fetchStories() {
        const fetchedStories = await getStories();
        setStories(fetchedStories);
    }
    fetchStories();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
}

function StoryGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {Array.from({ length: 8 }).map((_, i) => (
                <StoryCardSkeleton key={i} />
            ))}
        </div>
    );
}
