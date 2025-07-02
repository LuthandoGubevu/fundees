
'use client';

import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, BookOpen, Heart, Pencil, Sparkles, Star, Users } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getStoriesByAuthor } from '@/lib/firestore';
import type { Story } from '@/lib/types';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [myStories, setMyStories] = useState<Story[]>([]);
  const [isStoriesLoading, setIsStoriesLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsStoriesLoading(true);
      getStoriesByAuthor(user.id).then(userStories => {
        setMyStories(userStories);
        setIsStoriesLoading(false);
      });
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        {/* Banner Skeleton */}
        <div className="rounded-2xl p-6 shadow-lg flex items-center space-x-4 bg-gray-200">
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
