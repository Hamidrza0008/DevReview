export default function DashboardLoading() {
  return (
    <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 animate-pulse">
      <div className="bg-surface border border-line rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5 w-full">
          <div className="w-16 h-16 rounded-2xl bg-surface-2 shrink-0" />
          <div className="space-y-3 w-full max-w-md">
            <div className="h-6 bg-surface-2 rounded-lg w-48" />
            <div className="h-4 bg-surface-2 rounded-lg w-full" />
          </div>
        </div>
        <div className="h-10 bg-surface-2 rounded-xl w-full md:w-36 shrink-0" />
      </div>
      <div className="bg-surface border border-line rounded-2xl px-6 py-5">
        <div className="grid grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-8 bg-surface-2 rounded w-12" />
              <div className="h-3 bg-surface-2 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center gap-6 border-b border-line pb-3">
            <div className="h-4 bg-surface-2 rounded w-24" />
            <div className="h-4 bg-surface-2 rounded w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-surface border border-line rounded-2xl overflow-hidden">
                <div className="aspect-video bg-surface-2 w-full" />
                <div className="p-4 space-y-4">
                  <div className="h-4 bg-surface-2 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
