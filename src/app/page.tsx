export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <span className="text-xl font-bold">AICodeReview</span>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-white/60 hover:text-white">
            Pricing
          </a>
          <a href="#" className="text-sm text-white/60 hover:text-white">
            Docs
          </a>
          <button className="text-sm bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-white/90">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-32">
        <span className="text-sm bg-white/10 text-white/70 px-4 py-1 rounded-full mb-6">
          AI-Powered Code Reviews
        </span>
        <h1 className="text-5xl font-bold max-w-2xl leading-tight mb-6">
          Ship better code, faster
        </h1>
        <p className="text-white/50 text-lg max-w-xl mb-10">
          Instant AI code reviews for dev teams. Paste your code or connect
          GitHub — get actionable feedback in seconds.
        </p>
        <div className="flex gap-4">
          <button className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-white/90">
            Start for free
          </button>
          <button className="border border-white/20 px-6 py-3 rounded-lg text-white/70 hover:border-white/40">
            View demo
          </button>
        </div>
      </section>
      {/* Features */}
      <section className="px-8 py-24 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">
          Everything your team needs
        </h2>
        <div className="grid grid-cols-3 gap-8">
          {[
            {
              title: "Instant Reviews",
              desc: "Get feedback in seconds, not hours. No waiting for teammates.",
            },
            {
              title: "GitHub Integration",
              desc: "Auto-review every PR. Works with your existing workflow.",
            },
            {
              title: "Multi-language",
              desc: "Supports Python, Go, TypeScript, Rust, and 20+ more languages.",
            },
            {
              title: "Security Scan",
              desc: "Catches vulnerabilities, SQL injection, and common exploits.",
            },
            {
              title: "Team Dashboard",
              desc: "Track code quality trends across your entire team.",
            },
            {
              title: "Custom Rules",
              desc: "Set your own coding standards and enforce them automatically.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="border border-white/10 rounded-xl p-6 hover:border-white/20 transition"
            >
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Pricing */}
      <section className="px-8 py-24 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Simple pricing</h2>
        <p className="text-center text-white/50 mb-16">
          Start free, scale when you're ready
        </p>
        <div className="grid grid-cols-3 gap-8">
          {[
            {
              name: "Free",
              price: "$0",
              desc: "For solo devs",
              features: [
                "50 reviews/month",
                "Paste code reviews",
                "3 languages",
                "Community support",
              ],
              cta: "Get started",
              highlight: false,
            },
            {
              name: "Pro",
              price: "$19",
              desc: "For growing teams",
              features: [
                "Unlimited reviews",
                "GitHub PR integration",
                "All languages",
                "Priority support",
                "Team dashboard",
              ],
              cta: "Start free trial",
              highlight: true,
            },
            {
              name: "Enterprise",
              price: "Custom",
              desc: "For large orgs",
              features: [
                "Everything in Pro",
                "SSO / SAML",
                "Custom rules",
                "SLA guarantee",
                "Dedicated support",
              ],
              cta: "Contact us",
              highlight: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-8 border flex flex-col gap-4 ${
                plan.highlight ? "border-white bg-white/5" : "border-white/10"
              }`}
            >
              {plan.highlight && (
                <span className="text-xs bg-white text-black px-3 py-1 rounded-full w-fit font-medium">
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-white/50 text-sm">{plan.desc}</p>
              <div className="text-4xl font-bold">
                {plan.price}
                {plan.price !== "Custom" && (
                  <span className="text-lg text-white/40">/mo</span>
                )}
              </div>
              <ul className="flex flex-col gap-2 mt-2">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="text-sm text-white/60 flex items-center gap-2"
                  >
                    <span className="text-white">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-auto py-3 rounded-lg text-sm font-medium transition ${
                  plan.highlight
                    ? "bg-white text-black hover:bg-white/90"
                    : "border border-white/20 text-white/70 hover:border-white/40"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold">AICodeReview</span>
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="#" className="hover:text-white">
              Docs
            </a>
            <a href="#" className="hover:text-white">
              Contact
            </a>
          </div>
          <span className="text-sm text-white/30">© 2026 AICodeReview</span>
        </div>
      </footer>
    </main>
  );
}
