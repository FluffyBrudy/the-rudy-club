import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="flex-1 flex flex-col md:flex-row">
        <div
          className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16"
          style={{ backgroundColor: "var(--bg-color)" }}
        >
          <div className="max-w-md">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-lime-600 to-emerald-600 bg-clip-text text-transparent">
              Welcome to RudyClub
            </h1>
            <p
              className="text-lg mb-8"
              style={{ color: "var(--secondary-color)" }}
            >
              Connect with friends, share your thoughts, and discover {"what's"}
              happening in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/login"
                className="px-6 py-3 rounded-lg font-medium text-center transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-white"
                style={{ backgroundColor: "var(--primary-color)" }}
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-3 rounded-lg font-medium text-center transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                style={{
                  backgroundColor: "var(--accent-color)",
                  color: "var(--text-color)",
                  border: "2px solid var(--border-color)",
                }}
              >
                Create Account
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-gradient-to-br from-lime-400 to-emerald-600 flex items-center justify-center p-8 md:p-16">
          <div className="max-w-md text-white">
            <h2 className="text-3xl font-bold mb-6">Why Join RudyClub?</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mr-4 mt-1 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-xl mb-1">Connect</h3>
                  <p className="text-white/80">
                    Find and connect with friends, colleagues, and like-minded
                    individuals.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-4 mt-1 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-xl mb-1">Share</h3>
                  <p className="text-white/80">
                    Share your thoughts, experiences, and media with your
                    network.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-4 mt-1 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-xl mb-1">Discover</h3>
                  <p className="text-white/80">
                    Discover trending topics, events, and new connections.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <footer
        className="py-6 text-center"
        style={{ color: "var(--muted-color)" }}
      >
        <p className="text-sm">© 2025 RudyClub. All rights reserved.</p>
      </footer>
    </div>
  );
}
