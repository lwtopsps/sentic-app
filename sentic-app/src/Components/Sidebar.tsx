import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-72 shrink-0 border-r border-white/6 px-4 py-6">
      <nav className="space-y-4">
        <Link href="/home" className="block font-semibold text-white">Home</Link>
        <Link href="/profile" className="block text-neutral-400">Profile</Link>
        <Link href="/messages" className="block text-neutral-400">Messages</Link>
      </nav>
    </aside>
  );
}
