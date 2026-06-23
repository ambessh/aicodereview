"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

export default function ReviewDetail() {
  const { id } = useParams();
  const [review, setReview] = useState<any>(null);

  useEffect(() => {
    supabase
      .from("reviews")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) setReview(data);
      });
  }, [id]);

  if (!review) return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-white/40">Loading...</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <Link href="/" className="text-xl font-bold">AICodeReview</Link>
        <Link href="/dashboard" className="text-sm text-white/60 hover:text-white">
          ← Dashboard
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-sm bg-white/10 px-3 py-1 rounded-full">{review.language}</span>
          <span className="text-sm text-white/40">{new Date(review.created_at).toLocaleDateString()}</span>
          {review.rating && <span className="text-sm bg-white/10 px-3 py-1 rounded-full">{review.rating}/10</span>}
        </div>

        {/* Code */}
        <div className="border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="text-sm text-white/40 mb-4">Code</h2>
          <pre className="text-sm text-white/70 font-mono overflow-auto">{review.code}</pre>
        </div>

        {/* Review */}
        <div className="border border-white/10 rounded-xl p-6">
          <h2 className="text-sm text-white/40 mb-4">AI Review</h2>
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{review.review}</ReactMarkdown>
          </div>
        </div>
      </div>
    </main>
  );
}