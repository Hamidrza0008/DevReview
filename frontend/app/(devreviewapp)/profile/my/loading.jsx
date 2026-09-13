export default function ProfileLoading() {
  return (
    <div className="p-6 md:p-8 min-h-screen animate-pulse">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-surface border border-line rounded-3xl p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-surface-2 shrink-0" />
            <div className="space-y-3 flex-1">
              <div className="h-6 bg-surface-2 rounded w-48" />
              <div className="h-4 bg-surface-2 rounded w-32" />
              <div className="h-3 bg-surface-2 rounded w-64" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface border border-line rounded-2xl p-4 text-center">
              <div className="h-8 bg-surface-2 rounded w-12 mx-auto mb-2" />
              <div className="h-3 bg-surface-2 rounded w-16 mx-auto" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-surface border border-line rounded-2xl h-64" />
          ))}
        </div>
      </div>
    </div>
  );
}
