export default function UsersLoading() {
  return (
    <div className="p-6 md:p-8 min-h-screen space-y-6 animate-pulse">
      <div className="space-y-3 max-w-xl">
        <div className="h-8 bg-line rounded w-64" />
        <div className="h-4 bg-line rounded w-96" />
      </div>
      <div className="h-12 bg-surface border border-line rounded-2xl w-full max-w-2xl" />
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 bg-line rounded-lg w-20" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-surface border border-line rounded-[24px] h-80 overflow-hidden">
            <div className="h-20 bg-surface-2 w-full" />
            <div className="px-5 pt-0 space-y-3 -mt-8">
              <div className="w-16 h-16 rounded-full bg-surface border-4 border-surface mx-auto" />
              <div className="h-4 bg-surface-2 rounded w-24 mx-auto" />
              <div className="h-3 bg-surface-2 rounded w-16 mx-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
