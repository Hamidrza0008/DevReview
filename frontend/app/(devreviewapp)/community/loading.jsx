export default function CommunityLoading() {
  return (
    <div className="p-6 md:p-8 min-h-screen animate-pulse">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-8 bg-surface-2 rounded w-48" />
        <div className="h-4 bg-surface-2 rounded w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface border border-line rounded-2xl h-48" />
          ))}
        </div>
      </div>
    </div>
  );
}
