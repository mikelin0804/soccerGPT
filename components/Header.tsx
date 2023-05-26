import Link from "next/link";

export default function Header() {
  return (
    <header className="flex flex-col relative xs:flex-row w-full border-b border-gray-500 ">
      <div className="flex space-x-2 ">
        <Link href="/"> <img alt="header text" src="/robot.png" className="w-24 h-15"/></Link>

        <h1 className="self-center sm:text-3xl text-xl font-bold ">
          soccerGPT.io
        </h1>
        <Link href="/about"  className="self-center absolute right-3 ">About</Link>
      </div>
    </header>
  );
}
