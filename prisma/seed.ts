import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initialPosts: Prisma.PostCreateInput[] = [
  {
    title: "My first post",
    body: "This is the body of my first post",
    author: {
      connectOrCreate: {
        create: {
          name: "John Doe",
          email: "john.doe@example.com",
        },
        where: {
          email: "john.doe@example.com",
        },
      },
    },
  },
];

async function main() {
    console.log("Seeding database...");
    for (const post of initialPosts) {
        const newPost = await prisma.post.create({
            data: post,
        });
        console.log(`Created post with id: ${newPost.id}`);
    }
    console.log("Database seeded successfully");
}

main()
 .then(() => {
    prisma.$disconnect();
    console.log("Seeding completed");
 })
 .catch((error) => {
    console.error("Error seeding database:", error);
 })
