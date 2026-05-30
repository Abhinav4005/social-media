export default function FeedLayout({ left, center, right }) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] bg-[radial-gradient(circle_at_18%_10%,rgba(99,102,241,0.10),transparent_26%),radial-gradient(circle_at_86%_6%,rgba(20,184,166,0.10),transparent_24%)]">
        <div className="mx-auto grid w-full max-w-[1220px] grid-cols-1 gap-5 px-4 py-6 lg:grid-cols-[230px_minmax(0,620px)_280px] xl:grid-cols-[250px_minmax(0,660px)_300px]">
          {/* Left Sidebar */}
          <aside className="hidden lg:block">{left}</aside>

          {/* Center Feed */}
          <main className="min-w-0">{center}</main>

          {/* Right Sidebar */}
          <aside className="hidden lg:block">{right}</aside>
        </div>
      </div>
    );
  }
