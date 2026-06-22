"use client";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
export default function Dashboard() {
  const { user } = useUser();
  const [githubConnected, setGithubConnected] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("github") === "connected") {
      setGithubConnected(true);
    }
  }, []);

  function connectGitHub() {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=repo`;
  }
  const [reviews, setReviews] = useState<any[]>([]);
  const totalReviews = reviews.length;
  const thisMonth = reviews.filter((r) => {
    const date = new Date(r.created_at);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  const ratedReviews = reviews.filter((r) => r.rating);
  const avgRating =
    ratedReviews.length > 0
      ? (
          ratedReviews.reduce((sum, r) => sum + r.rating, 0) /
          ratedReviews.length
        ).toFixed(1)
      : "N/A";

  useEffect(() => {
    if (user) {
      supabase
        .from("reviews")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          if (data) setReviews(data);
        });
    }
  }, [user]);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <Link href="/" className="text-xl font-bold">
          AICodeReview
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/review"
            className="text-sm text-white/60 hover:text-white"
          >
            New Review
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {user?.firstName || "Developer"} 👋
        </h1>
        <p className="text-white/50 mb-12">
          Here are your recent code reviews.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Total Reviews", value: totalReviews.toString() },
            {
              label: "Avg Rating",
              value: avgRating === "N/A" ? "N/A" : `${avgRating}/10`,
            },
            { label: "This Month", value: thisMonth.toString() },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-white/10 rounded-xl p-6"
            >
              <p className="text-white/40 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* GitHub Connect */}
        <div className="border border-white/10 rounded-xl p-6 mb-8 flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">GitHub Integration</h3>
            <p className="text-sm text-white/40">
              Connect GitHub to auto-review your PRs
            </p>
          </div>
          {githubConnected ? (
            <span className="text-sm text-green-400 border border-green-400/30 px-4 py-2 rounded-lg">
              ✓ Connected
            </span>
          ) : (
            <button
              onClick={connectGitHub}
              className="text-sm bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-white/90"
            >
              Connect GitHub
            </button>
          )}
        </div>

        {/* Review History */}
        <div className="flex flex-col">
          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-white/30">
              <p className="text-lg mb-2">No reviews yet</p>
              <Link
                href="/review"
                className="text-sm text-white/50 hover:text-white underline"
              >
                Start your first review →
              </Link>
            </div>
          ) : (
            reviews.map((r) => (
              <div
                key={r.id}
                className="px-6 py-4 border-b border-white/10 hover:bg-white/5"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{r.language}</span>
                  <span className="text-xs text-white/30">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-white/40 font-mono truncate">
                  {r.code}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
