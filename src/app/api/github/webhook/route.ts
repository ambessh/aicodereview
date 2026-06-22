import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const payload = await req.json();

  if (payload.action !== "opened" && payload.action !== "reopened") {
    return NextResponse.json({ message: "ignored" });
  }

  // Background mein process karo
  const pr = payload.pull_request;
  
  // Immediately respond karo GitHub ko
  const response = NextResponse.json({ message: "processing" });
  
  // Background task
  (async () => {
    try {
      const diffRes = await fetch(pr.diff_url, {
        headers: { Accept: "application/vnd.github.v3.diff" },
      });
      const diff = await diffRes.text();

      const reviewRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1024,
          messages: [{
            role: "user",
            content: `Review this PR diff:\n${diff.substring(0, 3000)}\nProvide: Summary, Issues, Suggestions, RATING: X/10`,
          }],
        }),
      });

      const reviewData = await reviewRes.json();
      const review = reviewData.choices?.[0]?.message?.content || "No review";
      const ratingMatch = review.match(/RATING:\s*(\d+(\.\d+)?)\s*\/\s*10/i);
      const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

      await supabase.from("reviews").insert({
        user_id: `github:${payload.repository.full_name}`,
        code: diff.substring(0, 5000),
        language: "diff",
        review,
        rating,
      });
    } catch (e) {
      console.error("Webhook processing error:", e);
    }
  })();

  return response;
}