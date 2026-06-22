import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const payload = await req.json();

  // Sirf PR open/reopen pe trigger karo
  if (payload.action !== "opened" && payload.action !== "reopened") {
    return NextResponse.json({ message: "ignored" });
  }

  const pr = payload.pull_request;
  const repoFullName = payload.repository.full_name;

  // PR diff fetch karo
  const diffRes = await fetch(pr.diff_url, {
    headers: { Accept: "application/vnd.github.v3.diff" },
  });
  const diff = await diffRes.text();

  // Groq se review karo
  const reviewRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are an expert code reviewer. Review this GitHub PR diff and provide:
1. Summary of changes
2. Issues found (bugs, security, performance)
3. Suggestions for improvement
4. RATING: X/10

PR Title: ${pr.title}
Diff:
${diff.substring(0, 3000)}`,
        },
      ],
    }),
  });

  const reviewData = await reviewRes.json();
  const review = reviewData.choices?.[0]?.message?.content || "Could not generate review.";

  const ratingMatch = review.match(/RATING:\s*(\d+(\.\d+)?)\s*\/\s*10/i);
  const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

  // Supabase mein save karo
  await supabase.from("reviews").insert({
    user_id: `github:${repoFullName}`,
    code: diff.substring(0, 5000),
    language: "diff",
    review,
    rating,
  });

  return NextResponse.json({ message: "review completed" });
}