
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FullPageLoader } from '@/components/ui/full-page-loader';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Success!', description: `Welcome back!` });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Login failed:", error);
      let description = 'An unknown error occurred. Please try again.';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        description = 'Invalid email or password. Please check your credentials and try again.';
      }
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description,
        duration: 9000
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading || isAuthenticated) {
    return <FullPageLoader />; 
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/fundee-1.jpg')" }}
    >
      <div className="min-h-screen w-full bg-background/60 backdrop-blur-sm flex items-center justify-center py-8 px-4">
        <Card className="w-full max-w-md bg-sky-blue/60 shadow-xl rounded-2xl text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold font-headline">Login</CardTitle>
            <CardDescription className="text-white/80">Enter your credentials to access your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@school.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 text-black"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12 text-black"/>
              </div>
              <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Login'}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="font-bold text-white hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
