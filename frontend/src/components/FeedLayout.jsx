export default function FeedLayout({ left, center, right }) {
    return (
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 px-4">
        {/* Left Sidebar */}
        <div className="hidden md:block">{left}</div>
  
        {/* Center Feed */}
        <div className="md:col-span-2">{center}</div>
  
        {/* Right Sidebar */}
        <div className="hidden md:block">{right}</div>
      </div>
    );
  }  