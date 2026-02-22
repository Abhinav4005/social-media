import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.commentLike.deleteMany()
  await prisma.postLike.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.follower.deleteMany()
  await prisma.user.deleteMany()

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      name: "Ahom",
      email: "ahom@example.com",
      password: "password123",
      bio: "Full-stack dev",
      location: "India",
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      bio: "Frontend dev",
      location: "USA",
    },
  })

  // Create a Post by user1
  const post1 = await prisma.post.create({
    data: {
      title: "My First Post",
      description: "This is my first post description",
      image: "https://via.placeholder.com/300",
      video: "",
      userId: user1.id,
    },
  })

  // Add a top-level comment by user2
  const comment1 = await prisma.comment.create({
    data: {
      content: "Nice post Ahom!",
      postId: post1.id,
      userId: user2.id,
    },
  })

  // Reply to the first comment (nested comment)
  const reply1 = await prisma.comment.create({
    data: {
      content: "Thanks John!",
      postId: post1.id,
      userId: user1.id,
      parentId: comment1.id,
    },
  })

  // Add a second top-level comment
  const comment2 = await prisma.comment.create({
    data: {
      content: "Great work!",
      postId: post1.id,
      userId: user2.id,
    },
  })

  // Likes for the post
  await prisma.postLike.createMany({
    data: [
      { postId: post1.id, userId: user2.id },
      { postId: post1.id, userId: user1.id },
    ],
  })

  // Likes for comments
  await prisma.commentLike.createMany({
    data: [
      { commentId: comment1.id, userId: user1.id },
      { commentId: reply1.id, userId: user2.id },
    ],
  })

  console.log("Seed data inserted successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
