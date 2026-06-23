import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { code, language } = await req.json();

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Free tier check
  const { data: userData } = await supabase
    .from("users")
    .select("plan, reviews_this_month")
    .eq("id", userId)
    .single();

  if (userData?.plan === "free" && (userData?.reviews_this_month || 0) >= 50) {
    return NextResponse.json({ error: "Free tier limit reached. Upgrade to Pro." }, { status: 403 });
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
        content: `You are an expert code reviewer. Review the following ${language} code and provide:
1. Summary of what the code does
2. Issues found (bugs, security, performance)
3. Suggestions for improvement
4. Overall rating: RATING: X/10

Code:
\`\`\`${language}
${code}
\`\`\``,
      }],
    }),
  });

  const data = await response.json();
  const review = data.choices?.[0]?.message?.content || "Could not generate review.";
  const ratingMatch = review.match(/RATING:\s*(\d+(\.\d+)?)\s*\/\s*10/i);
  const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

  await supabase.from("reviews").insert({
    user_id: userId,
    code,
    language,
    review,
    rating,
  });

  await supabase.from("users").upsert({
    id: userId,
    reviews_this_month: (userData?.reviews_this_month || 0) + 1,
  });

  return NextResponse.json({ review });
}