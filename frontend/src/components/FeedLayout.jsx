export default function FeedLayout({ left, center, right }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] transition-colors duration-200">
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[280px_minmax(0,1fr)_300px]">
        <aside className="hidden lg:block">{left}</aside>
        <main className="min-w-0">{center}</main>
        <aside className="hidden lg:block">{right}</aside>
      </div>
    </div>
  );
}
