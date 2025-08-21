export default function NotificationCard({ type, senderName, message }) {
  return (
    <div className="p-3 bg-white shadow rounded-md mb-2 flex items-center gap-2">
      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      <div>
        <p className="text-gray-700 text-sm"><strong>{senderName}</strong> {message}</p>
        <span className="text-gray-400 text-xs">2h ago</span>
      </div>
    </div>
  );
}
