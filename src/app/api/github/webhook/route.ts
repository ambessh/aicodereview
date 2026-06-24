import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const allowedExtensions = [
  '.ts', '.tsx', '.js', '.jsx',
  '.py', '.go', '.rs', '.java',
  '.cpp', '.c', '.rb', '.php',
  '.css', '.scss', '.html',
  '.sql', '.sh', '.yaml', '.yml',
  'package.json',
];

export async function POST(req: NextRequest) {
  const payload = await req.json();

  if (payload.action !== "opened" && payload.action !== "reopened") {
    return NextResponse.json({ message: "ignored" });
  }

  const pr = payload.pull_request;

  const diffRes = await fetch(pr.diff_url);
  const diff = await diffRes.text();

  // Filter ignored files
 const diffLines = diff.split('\n').filter(line => {
  if (line.startsWith('diff --git')) {
    return allowedExtensions.some(ext => line.includes(ext));
  }
  return true;
}).join('\n');

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
        content: `Review this PR diff:\n${diffLines.substring(0, 3000)}\nProvide: Summary, Issues, Suggestions, RATING: X/10`,
      }],
    }),
  });

  const reviewData = await reviewRes.json();
  const review = reviewData.choices?.[0]?.message?.content || "No review";
  const ratingMatch = review.match(/RATING:\s*(\d+(\.\d+)?)\s*\/\s*10/i);
  const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

  await supabase.from("reviews").insert({
    user_id: `github:${payload.repository.full_name}`,
    code: diffLines.substring(0, 5000),
    language: "diff",
    review,
    rating,
  });

  // GitHub token fetch karo
const { data: userData } = await supabase
  .from("users")
  .select("github_token")
  .eq("id", `github:${payload.repository.full_name}`)
  .single();

const githubToken = userData?.github_token;

if (githubToken && review) {
  // LLM se fixed code maango
  const fixRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2048,
      messages: [{
        role: "user",
        content: `Based on this code review, provide ONLY the fixed code without any explanation:\n\nReview:\n${review}\n\nOriginal diff:\n${diffLines.substring(0, 2000)}`,
      }],
    }),
  });

  const fixData = await fixRes.json();
  const fixedCode = fixData.choices?.[0]?.message?.content || "";

  // GitHub PR pe comment karo
  await fetch(`https://api.github.com/repos/${payload.repository.full_name}/issues/${pr.number}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${githubToken}`,
    },
    body: JSON.stringify({
      body: `## 🤖 AICodeReview Auto-Fix\n\n### Review:\n${review}\n\n### Fixed Code:\n\`\`\`\n${fixedCode}\n\`\`\``,
    }),
  });
}

  return NextResponse.json({ message: "review completed" });
}
