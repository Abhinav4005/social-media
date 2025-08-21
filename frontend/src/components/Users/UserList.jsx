import UserCard from "./UserCard";

export default function UserList({ users, onFollow }) {
  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-sm rounded-xl">
      {users?.length > 0 ? (
        <div className="flex flex-col gap-3">
          {users.map((user) => (
            <UserCard
              key={user.id}
              {...user}
              onFollow={() => onFollow(user.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <p className="text-lg font-medium">No users found</p>
          <p className="text-sm">Try searching with a different keyword.</p>
        </div>
      )}
    </div>
  );
}