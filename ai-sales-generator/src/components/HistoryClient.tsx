"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

interface Page {
  id: string;
  productName: string;
  targetAudience: string;
  price: string;
  createdAt: string;
}

export default function HistoryClient({ pages }: { pages: Page[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [list, setList] = useState(pages);

  const filtered = list.filter((p) =>
    p.productName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this sales page?")) return;
    setDeleting(id);
    const res = await fetch("/api/pages/" + id, { method: "DELETE" });
    if (res.ok) {
      setList((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("Failed to delete");
    }
    setDeleting(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              My Sales Pages
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {list.length} page{list.length !== 1 ? "s" : ""} generated
            </p>
          </div>
          <input
            type="text"
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
          />
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              {search ? "No pages match your search" : "No pages yet"}
            </h3>
            <p className="text-slate-400 mb-6">
              {search
                ? "Try a different search term"
                : "Generate your first AI sales page!"}
            </p>
            {!search && (
              <a
                href="/generate"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                Generate Now
              </a>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((page) => (
            <div
              key={page.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">
                    {page.productName}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    {new Date(page.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                  {page.price}
                </span>
              </div>

              <p className="text-slate-500 text-sm mb-6">
                {page.targetAudience}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push("/preview/" + page.id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition"
                >
                  View
                </button>
                <button
                  onClick={() => router.push("/edit/" + page.id)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium py-2 rounded-lg transition"
                >
                  Edit
                </button>
                <a
                  href={"/api/export/" + page.id}
                  className="flex-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2 rounded-lg transition"
                >
                  Export
                </a>
                <button
                  onClick={() => handleDelete(page.id)}
                  disabled={deleting === page.id}
                  className="bg-red-50 hover:bg-red-100 text-red-500 text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {deleting === page.id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
