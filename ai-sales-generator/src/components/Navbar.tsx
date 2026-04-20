"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-slate-800">AI Sales Page Generator</h1>
      <div className="flex items-center gap-4">
        <a href="/generate" className="text-slate-600 hover:text-slate-800 text-sm font-medium">
          Generate
        </a>
        <a href="/history" className="text-slate-600 hover:text-slate-800 text-sm font-medium">
          My Pages
        </a>
        <a href="/dashboard" className="text-slate-600 hover:text-slate-800 text-sm font-medium">
          Dashboard
        </a>
        <span className="text-slate-300">|</span>
        {/* <span className="text-slate-400 text-sm">{session?.user?.email}</span> */}
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}