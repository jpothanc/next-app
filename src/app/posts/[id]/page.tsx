import NavBar from "@/components/NavBar";
import prisma from "@/lib/db";
import Link from "next/link";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};
const page = async ({ params }: { params: { id: string } }) => {
  const data = await prisma.post.findUnique({
    where: {
      id: params.id,
    },
  });
  if (!data) {
    return <div>Post not found</div>;
  }
  return (
    <>
      <NavBar />
      <section className="text-center text-2xl font-bold mt-10">
        {data.title}
      </section>
      <ul className="text-center text-xl mt-10">
        <li key={data.id}>{data.body}</li>
      </ul>
    </>
  );
};

export default page;
