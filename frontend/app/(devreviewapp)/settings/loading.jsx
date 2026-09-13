export default function SettingsLoading() {
  return (
    <div className="p-6 md:p-8 min-h-screen animate-pulse">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="h-8 bg-surface-2 rounded w-32" />
        <div className="bg-surface border border-line rounded-2xl p-6 space-y-4">
          <div className="h-24 bg-surface-2 rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-surface-2 rounded-xl" />
            <div className="h-10 bg-surface-2 rounded-xl" />
          </div>
          <div className="h-10 bg-surface-2 rounded-xl" />
          <div className="h-10 bg-surface-2 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
