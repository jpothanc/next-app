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
  const data = await prisma.post.findMany(
    {
      // where: {
      //   title: {
      //     contains: "start",
      //   },
      // },
      // orderBy: {
      //   createdAt: "desc",
      // },
    }
  );
  const postsCount = await prisma.post.count();
  return (
    <>
      <NavBar />

      <h1 className="text-center text-2xl font-bold mt-10 underline">Posts ({postsCount})</h1>
      <ul className="text-center text-xl mt-10">
        {data.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default page;
