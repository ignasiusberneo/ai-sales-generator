import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold text-slate-800">
          Welcome, {session.user.name}!
        </h2>
        <p className="text-slate-500 mt-3 text-lg">
          Generate stunning AI-powered sales pages in seconds.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/generate" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition text-lg">
            Generate New Page
          </Link>
          <Link href="/history" className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 py-3 rounded-lg border border-slate-300 transition text-lg">
            My Saved Pages
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: "Generate", desc: "Fill a form, get a full sales page instantly", icon: "1" },
            { label: "Preview", desc: "See your page rendered as a real landing page", icon: "2" },
            { label: "Export", desc: "Download as HTML file", icon: "3" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-6 border border-slate-200 text-left">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 font-bold rounded-xl flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <h3 className="font-semibold text-slate-800">{item.label}</h3>
              <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}