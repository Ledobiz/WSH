'use client';

import { Skeleton } from "@/src/components/ui/skeleton";

const CourseCardSkeleton = () => (
  <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
    <Skeleton className="aspect-[4/3] w-full rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-14" />
      </div>
    </div>
  </div>
);

export default CourseCardSkeleton;
