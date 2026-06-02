import Link from 'next/link';
import { login } from '../../lib/supabase/action';

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050506] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.09),_transparent_34%),radial-gradient(circle_at_80%_20%,_rgba(255,255,255,0.05),_transparent_22%),linear-gradient(180deg,_#090a0c_0%,_#050506_100%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10 sm:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <section className="max-w-xl space-y-5">
            <p className="text-xs uppercase tracking-[0.45em] text-neutral-500">Sentic</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              A quiet space to write, post, and move on.
            </h1>
            <p className="max-w-lg text-sm leading-6 text-neutral-400 sm:text-base">
              Sign in to continue to your feed. The interface stays minimal, fast, and focused on the content.
            </p>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
            <div className="mb-8 space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Welcome back</p>
              <h2 className="text-2xl font-semibold text-white">Log in to Sentic</h2>
            </div>

            <form action={login} className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm text-neutral-300">Email</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@domain.com"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-white/25"
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-neutral-300">Password</span>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-white/25"
                  required
                />
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
              >
                Sign in
              </button>
            </form>

            <p className="mt-6 text-sm text-neutral-500">
              No account yet?{' '}
              <Link href="/signup" className="font-medium text-white transition hover:text-neutral-300">
                Create one
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}