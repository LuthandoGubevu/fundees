'use client';

import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center mb-12">
                <Skeleton className="h-14 w-1/2 mx-auto" />
                <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-4 w-48 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-10 w-3/4" />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48 mt-2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full" />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-4 w-40 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-foreground mt-4">Welcome, {user.firstName}!</h1>
        <p className="mt-4 text-lg text-foreground/80">
          This is your personal dashboard. Let's see what you've been up to!
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>My Stories</CardTitle>
                <CardDescription>View and manage the stories you've created.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>You haven't created any stories yet.</p>
                <Button asChild className="mt-4">
                    <Link href="/create-story">Create Your First Story</Link>
                </Button>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>My Illustrations</CardTitle>
                <CardDescription>A gallery of all your AI-generated images.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>No illustrations yet.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>My Stats</CardTitle>
                <CardDescription>See how many people love your work.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Followers: 0</p>
                <p>Likes: 0</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
