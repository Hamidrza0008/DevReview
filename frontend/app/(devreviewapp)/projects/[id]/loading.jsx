export default function ProjectDetailLoading() {
  return (
    <div className="w-full py-6 animate-pulse">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="h-5 w-32 bg-line rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="aspect-video bg-surface border-2 border-surface-2 rounded-[28px]" />
          </div>
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <div className="bg-surface border-2 border-surface-2 rounded-[28px] p-6 space-y-6">
              <div className="h-6 w-24 bg-surface-2 rounded-md" />
              <div className="h-10 w-3/4 bg-surface-2 rounded-xl" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-surface-2 rounded" />
                <div className="h-4 w-5/6 bg-surface-2 rounded" />
              </div>
              <div className="pt-4 border-t border-surface-2 grid grid-cols-2 gap-3">
                <div className="h-12 bg-surface-2 rounded-xl" />
                <div className="h-12 bg-surface-2 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
