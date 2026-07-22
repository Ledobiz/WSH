import { Skeleton } from "@/src/components/ui/skeleton";

export const DashboardSkeleton = () => (
  <div className="space-y-6 md:space-y-8">
    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-background rounded-2xl border border-border p-4 md:p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
    {/* Continue Learning */}
    <div className="space-y-3">
      <Skeleton className="h-6 w-48" />
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex gap-3 md:gap-4 bg-background rounded-2xl border border-border p-3 md:p-4">
          <Skeleton className="w-16 h-16 md:w-20 md:h-16 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-2 w-full" />
          </div>
        </div>
      ))}
    </div>
    {/* All Courses */}
    <div className="space-y-4">
      <Skeleton className="h-6 w-36" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-background rounded-2xl border border-border overflow-hidden">
            <Skeleton className="w-full h-36 rounded-none" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-1.5 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const CourseListSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bg-background rounded-2xl border border-border overflow-hidden">
        <Skeleton className="w-full h-36 rounded-none" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-1.5 w-full" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    ))}
  </div>
);

export const CertificatesSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {Array.from({ length: 2 }).map((_, i) => (
      <div key={i} className="bg-background rounded-2xl border border-border p-5 flex gap-4">
        <Skeleton className="w-14 h-14 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-8 w-40 mt-2" />
        </div>
      </div>
    ))}
  </div>
);

export const NoteListSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-background rounded-2xl border border-border p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-24" />
      </div>
    ))}
  </div>
);

export const ReviewListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 2 }).map((_, i) => (
      <div key={i} className="bg-background rounded-2xl border border-border p-4 space-y-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-16 w-full" />
      </div>
    ))}
  </div>
);

export const CoursePlayerSkeleton = () => (
  <div className="min-h-screen bg-background flex flex-col md:flex-row">
    {/* Sidebar skeleton - desktop */}
    <aside className="hidden md:block md:w-80 md:shrink-0 md:border-r md:border-border md:h-screen">
      <div className="p-4 border-b border-border space-y-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-1.5 w-full" />
      </div>
      <div className="space-y-1 p-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    </aside>
    {/* Content skeleton */}
    <main className="flex-1 min-w-0">
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <div className="flex gap-3 pt-4 border-t border-border">
          <Skeleton className="h-10 w-40" />
          <div className="flex gap-2 ml-auto">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    </main>
  </div>
);

export const SettingsSkeleton = () => (
  <div className="p-4 md:p-8">
    <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="bg-background rounded-2xl border border-border p-5 md:p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-9 w-32" />
        </div>
      ))}
    </div>
  </div>
);
