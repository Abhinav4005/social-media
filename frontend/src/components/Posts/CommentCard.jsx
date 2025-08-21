import Button from "../UI/Button";

export default function CommentCard({ content, user }) {
  return (
    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-md mb-2">
      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      <div className="flex-1">
        <p className="font-semibold">{user?.name}</p>
        <p>{content}</p>
        <div className="flex gap-2 mt-1">
          <Button color="blue" className="text-sm">Like</Button>
          <Button color="gray" className="text-sm">Reply</Button>
        </div>
      </div>
    </div>
  );
}
