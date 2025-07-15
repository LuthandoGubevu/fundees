
'use client';

import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Award, BookOpen, Heart, Users, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Story } from '@/lib/types';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { extractIndexCreationLink, transformStoryDoc } from '@/lib/firestore-utils';

function MissingIndexCard({ link }: { link: string }) {
  return (
    <Card className="bg-destructive/10 border-destructive text-destructive">
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
    // Since auth is disabled, we fetch all stories instead of user-specific ones
    setIsStoriesLoading(true);
    setStoriesError(null);
    setIndexLink(null);
    
    const storiesCol = collection(db, 'stories');
    const q = query(storiesCol, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        setMyStories(snapshot.docs.map(transformStoryDoc));
        setIsStoriesLoading(false);
        setStoriesError(null);
        setIndexLink(null);
      },
      (error: any) => {
        if (error.code === 'permission-denied') {
            setStoriesError("Permission Denied: Could not load stories. Please check your Firestore security rules in the Firebase Console to ensure you have 'list' permissions on the 'stories' collection.");
        } else if (error.code === 'failed-precondition' && error.message?.includes('requires an index')) {
            const link = extractIndexCreationLink(error.message);
            if (link) {
                setIndexLink(link);
            } else {
                setStoriesError("A database index is required. Please check the browser console for a link to create it.")
            }
        } else {
            console.error("Dashboard stories error:", error);
            setStoriesError("Could not load stories right now.");
        }
        setIsStoriesLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  if (!user) {
      return null;
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/fundee-2.jpg')" }}
    >
      <div className="min-h-screen w-full bg-background/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex flex-col space-y-8">
            <div className="bg-sky-100/90 rounded-2xl p-4 md:p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-800">Hi, {user.firstName}!</h1>
                    <p className="text-sm text-gray-700 mt-1">Ready for a new adventure today?</p>
                </div>
                <div className="flex items-center gap-x-6 gap-y-2 text-sm font-semibold text-gray-800 self-start md:self-center pt-2 md:pt-0">
                    <span className="flex items-center gap-1.5"><Heart className="w-5 h-5 text-red-500" /> {user.totalLikes || 0} Likes</span>
                    <span className="flex items-center gap-1.5"><Users className="w-5 h-5" /> 0 Followers</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-sky-100/90 rounded-xl p-4 shadow-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Stories</h2>
                        {isStoriesLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Skeleton className="w-full h-24 rounded-lg" />
                                <Skeleton className="w-full h-24 rounded-lg" />
                            </div>
                        ) : indexLink ? (
                            <MissingIndexCard link={indexLink} />
                        ) : storiesError ? (
                            <div className="text-center py-4 px-2 text-destructive bg-destructive/10 rounded-lg">{storiesError}</div>
                        ) : myStories.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {myStories.map(story => (
                                <Link href={`/story/${story.id}`} key={story.id} className="block">
                                    <Card className="bg-sky-100/90 rounded-lg p-4 h-full shadow hover:shadow-xl transition-shadow">
                                        <h3 className="font-bold text-lg text-foreground truncate">{story.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{story.excerpt}</p>
                                        <span className="text-xs bg-yellow-100 text-yellow-800 rounded-full px-2 py-0.5 mt-2 inline-block">Published</span>
                                    </Card>
                                </Link>
                            ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-600 mb-4">No stories have been created yet.</p>
                                <Button asChild>
                                    <Link href="/create-story">Start The First Story</Link>
                                </Button>
                            </div>
                        )}
                    </section>
                </div>
                <div className="space-y-8">
                    <section className="bg-sky-100/90 rounded-xl p-4 shadow-md">
                        <h2 className="text-lg font-bold text-yellow-800 mb-2">Spark Your Imagination</h2>
                        <p className="italic text-sm text-yellow-700">"What if animals could talk? What would they say?"</p>
                        <Button size="sm" className="bg-orange-400 hover:bg-orange-500 text-white rounded-lg mt-3" asChild>
                           <Link href="/create-story?theme=What%20if%20animals%20could%20talk?">Use this prompt</Link>
                        </Button>
                    </section>

                    <section className="bg-sky-100/90 rounded-xl p-4 shadow-md">
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
      </div>
    </div>
  );
}

function AwardBadge({ icon, label, locked=false }: { icon: React.ReactNode, label: string, locked?: boolean}) {
    return (
        <div className={`flex flex-col items-center space-y-1 p-2 rounded-lg ${locked ? 'bg-gray-200/70' : 'bg-purple-200/70'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${locked ? 'bg-gray-400 text-white/50' : 'bg-purple-400 text-white'}`}>
                {icon}
            </div>
            <span className={`text-xs font-medium ${locked ? 'text-gray-500' : 'text-purple-800'}`}>{label}</span>
        </div>
    )
}
