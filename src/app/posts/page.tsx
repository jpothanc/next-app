import { createPost } from "@/actions/actions";
import NavBar from "@/components/NavBar";
import prisma from "@/lib/db";
import Link from "next/link";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};
const page = async () => {
  //const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  //const data = await response.json();
  const posts = await prisma.post.findMany({
    //   title: {
    //     contains: "start",
    //   },
    // },
    // orderBy: {
    //   createdAt: "desc",
    // },
  });

  const users = await prisma.user.findUnique({
    where: {
      email: "john.doe@example.com",
    },
    include: {
      posts: true,
    },
  });

  const postsCount = await users?.posts.length;
  return (
    <>
      <NavBar />

      <h1 className="text-center text-2xl font-bold mt-10 underline">
        Posts ({postsCount})
      </h1>
      <ul className="text-center text-xl mt-10">
        {users?.posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>

      <form
        action={createPost}
        className="flex flex-col gap-4 w-[300px]  border p-4 mx-auto mt-10 text-black"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="p-2 rounded-md"
        />
        <textarea
          name="body"
          rows={5}
          placeholder="Body"
          className="p-2 rounded-md"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Create Post
        </button>
      </form>
    </>
  );
};

export default page;
