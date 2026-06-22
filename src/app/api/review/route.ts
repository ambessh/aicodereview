import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
export async function POST(req: NextRequest) {
  const { code, language } = await req.json();
  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
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
            content: `You are an expert code reviewer. Review the following ${language} code and provide:
1. Summary of what the code does
2. Issues found (bugs, security, performance)
3. Suggestions for improvement
4. Overall rating: RATING: X/10

Code:
\`\`\`${language}
${code}
\`\`\``,
          },
        ],
      }),
    },
  );

  const data = await response.json();
  const review =
    data.choices?.[0]?.message?.content || "Could not generate review.";
  const ratingMatch = review.match(/RATING:\s*(\d+(\.\d+)?)\s*\/\s*10/i);
  const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

  console.log("Review text:", review.substring(0, 200));
  console.log("Rating extracted:", rating);
  const { userId } = await auth();

  if (userId) {
    await supabase.from("reviews").insert({
      user_id: userId,
      code,
      language,
      review,
      rating,
    });
  }
  return NextResponse.json({ review });
}
