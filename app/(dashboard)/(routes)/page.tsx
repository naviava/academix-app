import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="text-7xl text-blue-600">
      <UserButton afterSignOutUrl="/" />
    </main>
  );
}
