"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function GeneratePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    productName: "",
    description: "",
    features: "",
    targetAudience: "",
    price: "",
    usp: "",
  });

  if (status === "unauthenticated") {
    redirect("/auth/login");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push(`/preview/${data.id}`);
    } catch (err) {
      setError("Failed to generate. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <Navbar />

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            Tell us about your product
          </h2>
          <p className="text-slate-500 mt-1">
            Fill in the details below and AI will generate a complete sales page for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Product / Service Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. SuperApp Pro"
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe what your product does and the problem it solves..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Key Features <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Real-time analytics, AI-powered insights, 24/7 support (comma separated)"
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-slate-400 mt-1">Separate features with commas</p>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Target Audience <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Small business owners, freelancers, marketers"
              value={form.targetAudience}
              onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. $49/month or $499 one-time"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* USP */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Unique Selling Points{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Only tool with X feature, Trusted by 10,000+ users, Money-back guarantee"
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
                Generating your sales page...
              </>
            ) : (
              "✨ Generate Sales Page"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}