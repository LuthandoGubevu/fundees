'use client';

import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Award, BookOpen, Heart, Pencil, Sparkles, Star, Users } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Story } from '@/lib/types';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { extractIndexCreationLink, transformStoryDoc } from '@/lib/firestore-utils';

function MissingIndexCard({ link }: { link: string }) {
  return (
    <Card className="bg-destructive/10 border-destructive text-destructive p-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-6 w-6" />
          Action Required: Missing Database Index
        </CardTitle>
      </CardHeader>
      <CardContent className="text-destructive/90 space-y-4">
        <p>
          To fetch your stories, a specific database index is required. This is a one-time setup step in Firebase.
        </p>
        <p>
          Please click the button below. It will open the Firebase Console with the correct index configuration pre-filled for you. Using the link is the best way to avoid mistakes.
        </p>
        <Button asChild variant="destructive">
          <a href={link} target="_blank" rel="noopener noreferrer">
            Create Firestore Index
          </a>
        </Button>
         <p className="text-xs mt-2">After creating the index, it may take a few minutes to become active. Please refresh this page after a moment.</p>
      </CardContent>
    </Card>
  );
}


export default function DashboardPage() {
  const { user } = useAuth();
  const [myStories, setMyStories] = useState<Story[]>([]);
  const [isStoriesLoading, setIsStoriesLoading] = useState(true);
  const [storiesError, setStoriesError] = useState<string | null>(null);
  const [indexLink, setIndexLink] = useState<string | null>(null);


  useEffect(() => {
    if (user) {
      setIsStoriesLoading(true);
      setStoriesError(null);
      setIndexLink(null);
      
      const storiesCol = collection(db, 'stories');
      const q = query(storiesCol, where('authorId', '==', user.id), orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          setMyStories(snapshot.docs.map(transformStoryDoc));
          setIsStoriesLoading(false);
          setStoriesError(null);
          setIndexLink(null);
        },
        (error: any) => {
          if (error.code === 'permission-denied') {
              setStoriesError("Permission Denied: Could not load your stories. Please check your Firestore security rules in the Firebase Console to ensure you have 'list' permissions on the 'stories' collection.");
          } else if (error.message?.includes('requires an index')) {
              const link = extractIndexCreationLink(error.message);
              if (link) {
                  setIndexLink(link);
              } else {
                  setStoriesError("A database index is required. Please check the browser console for a link to create it.")
              }
          } else {
              console.error("Dashboard stories error:", error);
              setStoriesError("Could not load your stories right now.");
          }
          setIsStoriesLoading(false);
        }
      );

      return () => unsubscribe(); // Cleanup listener on unmount
    } else {
        // If there's no user, there's no need to try and fetch stories.
        setIsStoriesLoading(false);
    }
  }, [user]);

  if (isStoriesLoading && !myStories.length && !storiesError && !indexLink) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        {/* Banner Skeleton */}
        <div className="rounded-2xl p-6 shadow-lg flex items-center space-x-4 bg-gray-200 animate-pulse">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="flex space-x-4 mt-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
        {/* Sections Skeleton */}
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <Skeleton className="h-8 w-1/3 mb-2" />
                <div className="flex space-x-4">
                    <Skeleton className="w-32 h-40 rounded-lg" />
                    <Skeleton className="w-32 h-40 rounded-lg" />
                    <Skeleton className="w-32 h-40 rounded-lg" />
                </div>
            </div>
            <div className="space-y-4">
                <Skeleton className="h-8 w-1/3 mb-2" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-20 rounded-lg" />
                    <Skeleton className="h-20 rounded-lg" />
                </div>
            </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
      return null; // Or a more specific "not logged in" message. The AuthProvider should handle the redirect.
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col space-y-8">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-blue-300 to-cyan-400 rounded-2xl p-4 md:p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Image src="https://placehold.co/100x100.png" alt="User Avatar" width={64} height={64} className="w-16 h-16 rounded-full border-2 border-white flex-shrink-0" data-ai-hint="avatar profile" />
            <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800">Hi, {user.firstName}!</h1>
                <p className="text-sm text-gray-700 mt-1">Ready for a new adventure today?</p>
            </div>
            <div className="flex items-center gap-x-6 gap-y-2 text-sm font-semibold text-gray-800 self-start md:self-center pt-2 md:pt-0">
                <span className="flex items-center gap-1.5"><Heart className="w-5 h-5 text-red-500" /> {user.totalLikes || 0} Likes</span>
                <span className="flex items-center gap-1.5"><Users className="w-5 h-5" /> 0 Followers</span>
            </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {/* Your Story Creations */}
                <section className="bg-blue-50 rounded-xl p-4 shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Your Story Creations</h2>
                    {isStoriesLoading ? (
                        <div className="flex overflow-x-auto space-x-4 pb-2 -mx-4 px-4">
                            <Skeleton className="w-40 h-48 rounded-lg" />
                            <Skeleton className="w-40 h-48 rounded-lg" />
                            <Skeleton className="w-40 h-48 rounded-lg" />
                        </div>
                    ) : indexLink ? (
                        <MissingIndexCard link={indexLink} />
                    ) : storiesError ? (
                         <div className="text-center py-4 px-2 text-destructive bg-destructive/10 rounded-lg">{storiesError}</div>
                    ) : myStories.length > 0 ? (
                        <div className="flex overflow-x-auto space-x-4 pb-2 -mx-4 px-4">
                        {myStories.map(story => (
                            <Link href={`/story/${story.id}`} key={story.id} className="block flex-shrink-0">
                                <Card className="bg-white rounded-lg p-2 w-[160px] text-center shadow hover:shadow-xl transition-shadow">
                                    <Image src={story.imageUrl || 'https://placehold.co/400x300.png'} alt={story.title} width={400} height={300} className="w-full h-24 object-cover rounded-md mb-2" data-ai-hint={story.theme.toLowerCase()} />
                                    <h3 className="text-sm font-medium truncate">{story.title}</h3>
                                    <span className="text-xs bg-yellow-100 text-yellow-800 rounded-full px-2 py-0.5 mt-1 inline-block">Published</span>
                                </Card>
                            </Link>
                        ))}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-gray-600 mb-4">You haven't created any stories yet.</p>
                            <Button asChild>
                                <Link href="/create-story">Start Your First Story</Link>
                            </Button>
                        </div>
                    )}
                </section>
                 {/* Creative Toolbox */}
                <section>
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Creative Toolbox</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <ToolboxButton href="/create-story" icon={<Pencil className="w-8 h-8"/>} label="Write Story" className="from-green-300 to-green-400" />
                        <ToolboxButton href="/ask-ai" icon={<Sparkles className="w-8 h-8"/>} label="Ask AI" className="from-blue-300 to-blue-400" />
                        <ToolboxButton href="/library" icon={<BookOpen className="w-8 h-8"/>} label="Library" className="from-orange-300 to-orange-400" />
                        <ToolboxButton href="#" icon={<Award className="w-8 h-8"/>} label="Goals" className="from-purple-300 to-purple-400" />
                    </div>
                </section>
            </div>
            <div className="space-y-8">
                 {/* Spark Your Imagination */}
                <section className="bg-yellow-100 rounded-xl p-4 shadow-md">
                    <h2 className="text-lg font-bold text-yellow-800 mb-2">Spark Your Imagination</h2>
                    <p className="italic text-sm text-yellow-700">"What if animals could talk? What would they say?"</p>
                    <Button size="sm" className="bg-orange-400 hover:bg-orange-500 text-white rounded-lg mt-3">
                        Use this prompt
                    </Button>
                </section>

                {/* Your Awards */}
                <section className="bg-purple-50 rounded-xl p-4 shadow-md">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-purple-800">Your Awards</h2>
                        <span className="font-bold text-yellow-600">150 Coins</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                        <AwardBadge icon={<Star />} label="First Story" />
                        <AwardBadge icon={<Heart />} label="10 Likes" locked />
                        <AwardBadge icon={<BookOpen />} label="5 Reads" locked />
                    </div>
                </section>
            </div>
        </div>
      </div>
    </div>
  );
}

function ToolboxButton({ href, icon, label, className }: { href: string, icon: React.ReactNode, label: string, className: string }) {
    return (
        <Link href={href} className={`bg-gradient-to-br ${className} rounded-lg p-3 shadow text-center text-sm font-semibold text-white hover:opacity-90 transition-opacity flex flex-col items-center justify-center space-y-2 h-28`}>
            {icon}
            <span>{label}</span>
        </Link>
    )
}

function AwardBadge({ icon, label, locked=false }: { icon: React.ReactNode, label: string, locked?: boolean}) {
    return (
        <div className={`flex flex-col items-center space-y-1 p-2 rounded-lg ${locked ? 'bg-gray-200' : 'bg-purple-200'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${locked ? 'bg-gray-400 text-white/50' : 'bg-purple-400 text-white'}`}>
                {icon}
            </div>
            <span className={`text-xs font-medium ${locked ? 'text-gray-500' : 'text-purple-800'}`}>{label}</span>
        </div>
    )
}
