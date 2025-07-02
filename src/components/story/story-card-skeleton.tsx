import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StoryCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl shadow-lg">
      <CardHeader className="p-0">
        <Skeleton className="h-48 w-full" />
        <div className="p-4">
            <div className="flex gap-2 mb-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-8" />
        </div>
      </CardFooter>
    </Card>
  );
}
