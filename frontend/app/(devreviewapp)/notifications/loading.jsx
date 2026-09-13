export default function NotificationsLoading() {
  return (
    <div className="min-h-screen bg-page p-4 sm:p-6 lg:p-8 animate-pulse">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-2xl bg-surface-2" />
        <div className="space-y-2">
          <div className="h-6 bg-surface-2 rounded w-40" />
          <div className="h-4 bg-surface-2 rounded w-56" />
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 h-64 rounded-2xl bg-surface border border-line" />
        <div className="h-40 rounded-2xl bg-surface border border-line" />
      </div>
    </div>
  );
}
