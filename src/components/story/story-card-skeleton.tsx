import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StoryCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden rounded-xl shadow-md bg-white max-w-xs sm:max-w-sm w-full mx-auto p-3 space-y-3">
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>
       <div className="flex gap-2">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-16" />
      </div>
      <div className="flex items-center pt-2">
        <Skeleton className="h-8 w-14" />
      </div>
    </Card>
  );
}
