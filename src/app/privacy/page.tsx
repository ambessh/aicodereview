export default function Privacy() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <a href="/" className="text-xl font-bold">AICodeReview</a>
      </nav>
      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-white/40 mb-12">Last updated: June 2026</p>

        <h2 className="text-2xl font-bold mb-4">Data We Collect</h2>
        <p className="text-white/60 mb-8">We collect your email address, code snippets submitted for review, and GitHub repository data when connected.</p>

        <h2 className="text-2xl font-bold mb-4">How We Use Your Data</h2>
        <p className="text-white/60 mb-8">Your code is sent to our AI provider for review and stored in our database to show your review history.</p>

        <h2 className="text-2xl font-bold mb-4">Data Storage</h2>
        <p className="text-white/60 mb-8">All data is stored securely on Supabase servers. We do not sell your data to third parties.</p>

        <h2 className="text-2xl font-bold mb-4">Contact</h2>
        <p className="text-white/60">For privacy concerns, email us at ambeshtiwari96@gmail.com</p>
      </div>
    </main>
  );
}