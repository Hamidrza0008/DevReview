export default function MessagesLoading() {
  return (
    <div className="flex h-full animate-pulse">
      <div className="w-80 lg:w-96 border-r border-line bg-surface shrink-0">
        <div className="p-4 border-b border-line">
          <div className="h-5 bg-surface-2 rounded w-24" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-surface-2 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-2 rounded w-24" />
                <div className="h-3 bg-surface-2 rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="h-4 bg-surface-2 rounded w-40" />
      </div>
    </div>
  );
}
