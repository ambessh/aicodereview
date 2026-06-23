"use client";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { UserButton, SignInButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
export default function ReviewPage() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const { isSignedIn } = useAuth();
  async function handleReview() {
    if (!code.trim()) return;
    setLoading(true);
    setReview("");

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
     const data = await res.json();

if (res.status === 403) {
  setReview("⚠️ Free tier limit reached. Upgrade to Pro from your dashboard.");
  return;
}

setReview(data.review || "No review generated.");
    } catch (err) {
      setReview("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <a href="/" className="text-xl font-bold">
          AICodeReview
        </a>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm text-white/60 hover:text-white"
          >
            Dashboard
          </Link>
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <button className="text-sm bg-white text-black px-4 py-2 rounded-lg font-medium">
                Sign in
              </button>
            </SignInButton>
          )}
        </div>
      </nav>
      {/* Editor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-[calc(100vh-65px)]">
        {/* Left - Code Input */}
        <div className="flex flex-col border-r border-white/10 bg-black min-h-[50vh] md:min-h-0">
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/50">Language</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm bg-white/5 text-white border border-white/10 rounded-lg px-3 py-1 outline-none hover:border-white/20"
              >
                {[
                  "javascript",
                  "typescript",
                  "python",
                  "go",
                  "rust",
                  "java",
                  "cpp",
                  "ruby",
                  "php",
                ].map((lang) => (
                  <option key={lang} value={lang} className="bg-black">
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleReview}
              disabled={loading}
              className="text-sm bg-white text-black px-4 py-1.5 rounded-lg font-medium hover:bg-white/90 disabled:opacity-50"
            >
              {loading ? "Reviewing..." : "Review →"}
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="flex-1 bg-transparent text-sm text-white/80 p-6 resize-none outline-none font-mono placeholder:text-white/20"
          />
        </div>

        {/* Right - AI Review */}
        <div className="flex flex-col bg-black">
          <div className="px-6 py-3 border-b border-white/10">
            <span className="text-sm text-white/50">AI Review</span>
          </div>
          <div className="flex-1 p-6 text-sm text-white/70 font-mono overflow-auto">
            {loading && (
              <span className="text-white/30 animate-pulse">
                Analyzing your code...
              </span>
            )}
            {!loading && review && (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{review}</ReactMarkdown>
              </div>
            )}
            {!loading && !review && (
              <span className="text-white/20">Review will appear here...</span>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
