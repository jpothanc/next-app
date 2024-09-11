import Link from "next/link";

const NavBar = () => {
  return (
    <>
      <nav
        className="flex gap-2 justify-center items-center top-0 sticky h-14 w-full border-b
       border-teal-300 text-lg"
      >
        <div className="border border-teal-400 p-1 pl-5 pr-5 rounded-lg hover:underline">
          <Link href="/posts">Posts</Link>
        </div>
        <div className="border border-teal-400 p-1 pl-5 pr-5 rounded-lg hover:underline">
          <Link href="/">Home</Link>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
