export default function ProjectsLoading() {
  return (
    <div className="p-6 md:p-8 min-h-screen space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="h-7 bg-line rounded-xl w-48" />
          <div className="h-3 bg-line rounded w-32" />
        </div>
        <div className="h-10 bg-line rounded-xl w-32" />
      </div>
      <div className="h-px bg-line w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface border border-line rounded-2xl overflow-hidden">
            <div className="aspect-video bg-surface-2 w-full" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-surface-2 rounded w-3/4" />
              <div className="h-3 bg-surface-2 rounded w-full" />
              <div className="h-3 bg-surface-2 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
