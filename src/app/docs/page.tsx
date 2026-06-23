export default function Docs() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <a href="/" className="text-xl font-bold">AICodeReview</a>
      </nav>
      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold mb-4">Documentation</h1>
        <p className="text-white/50 mb-12">Learn how to use AICodeReview.</p>

        <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
        <p className="text-white/60 mb-8">Sign up for free and paste your code to get an instant AI review.</p>

        <h2 className="text-2xl font-bold mb-4">Paste Code Review</h2>
        <p className="text-white/60 mb-8">Go to the Review page, select your language, paste your code and click Review.</p>

        <h2 className="text-2xl font-bold mb-4">GitHub Integration</h2>
        <p className="text-white/60 mb-8">Connect your GitHub account from the Dashboard. Once connected, every new PR will be automatically reviewed.</p>

        <h2 className="text-2xl font-bold mb-4">Supported Languages</h2>
        <p className="text-white/60">JavaScript, TypeScript, Python, Go, Rust, Java, C++, Ruby, PHP and more.</p>
      </div>
    </main>
  );
}