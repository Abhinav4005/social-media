import Button from "../UI/Button";

export default function UserCard({ name, email, onFollow }) {
  const initials = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md rounded-xl mb-3 hover:shadow-lg transition">
      {/* Left side: Avatar + Info */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg shadow-sm">
          {initials}
        </div>

        {/* User Info */}
        <div>
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-gray-500 text-sm">{email}</p>
        </div>
      </div>

      {/* Follow Button */}
      <Button
        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:opacity-90 transition"
        onClick={onFollow}
      >
        Follow
      </Button>
    </div>
  );
}