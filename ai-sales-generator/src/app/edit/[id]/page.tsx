"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [id, setId] = useState("");
  const [form, setForm] = useState({
    productName: "",
    description: "",
    features: "",
    targetAudience: "",
    price: "",
    usp: "",
  });

  useEffect(() => {
    const load = async () => {
      const { id } = await params;
      setId(id);
      const res = await fetch("/api/pages/" + id);
      if (res.ok) {
        const data = await res.json();
        setForm({
          productName: data.productName,
          description: data.description,
          features: data.features,
          targetAudience: data.targetAudience,
          price: data.price,
          usp: data.usp || "",
        });
      }
      setFetching(false);
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, editId: id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/preview/" + data.id);
    } catch (err) {
      setError("Failed to regenerate. Please try again.");
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <a href="/history" className="text-blue-600 text-sm hover:underline">
            Back to My Pages
          </a>
          <h2 className="text-2xl font-bold text-slate-800 mt-2">Edit and Regenerate</h2>
          <p className="text-slate-500 mt-1">Update your product details and regenerate the sales page.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Product / Service Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Key Features <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Target Audience <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.targetAudience}
              onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Unique Selling Points{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={form.usp}
              onChange={(e) => setForm({ ...form, usp: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Regenerating...
              </>
            ) : (
              "Regenerate Sales Page"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}