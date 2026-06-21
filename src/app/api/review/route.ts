import { NextRequest, NextResponse } from "next/server";

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
4. Overall rating out of 10

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

  return NextResponse.json({ review });
}
