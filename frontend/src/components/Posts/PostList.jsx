import PostCard from "./PostCard";

export default function PostList({ posts }) {
  // console.log("PostList - posts:", posts);
  return (
    <div className="flex flex-col">
      {posts?.length > 0 ? posts.map((post) => (
        <PostCard key={post.id} title={post.title} description={post.description} image={post.image} />
      )) : (
        <p className="text-gray-500 text-center mt-4">No posts found.</p>
      )}
    </div>
  );
}
