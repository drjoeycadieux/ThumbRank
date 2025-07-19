import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

interface LoadingSkeletonProps {
  count: number;
}

export function LoadingSkeleton({ count }: LoadingSkeletonProps) {
  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="flex items-center gap-2 text-xl font-semibold text-primary">
        <Sparkles className="animate-spin" />
        <p>AI is analyzing your thumbnails...</p>
      </div>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} className="flex flex-col h-full overflow-hidden">
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4 flex-grow">
              <Skeleton className="aspect-video w-full rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-4 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
