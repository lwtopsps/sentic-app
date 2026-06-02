'use client';

import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import SenticLogo from '../../src/Components/SenticLogo';

type AuthFormProps = {
  mode: 'login' | 'signup';
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
      ),
    []
  );

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) {
        return;
      }

      if (data.session) {
        router.replace('/home');
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/home');
      }
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  const isSignup = mode === 'signup';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isSignup) {
        const normalizedUsername = username.trim();

        if (!normalizedUsername) {
          throw new Error('Username is required.');
        }

        const { data: existingProfile, error: profileLookupError } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', normalizedUsername)
          .maybeSingle();

        if (profileLookupError) {
          throw profileLookupError;
        }

        if (existingProfile) {
          throw new Error('That username is already taken.');
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: normalizedUsername,
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        if (data.user && data.session) {
          const { error: profileInsertError } = await supabase.from('profiles').upsert({
            id: data.user.id,
            username: normalizedUsername,
            theme_preference: 'system',
          });

          if (profileInsertError) {
            throw profileInsertError;
          }

          router.replace('/home');
          router.refresh();
          return;
        }

        setMessage('Check your inbox to confirm your account, then log in.');
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      router.replace('/home');
      router.refresh();
    } catch (authError) {
      console.error('[AuthForm] Authentication error', authError);
      setError(authError instanceof Error ? authError.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-10 text-[#f5f6f7]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col justify-center gap-10 lg:flex-row lg:items-center lg:justify-between">
        <section className="max-w-xl space-y-6">
          <SenticLogo className="text-4xl tracking-[0.28em] text-white" />
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">Minimal social space</p>
            <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Quiet design for fast conversation.
            </h1>
            <p className="max-w-lg text-sm leading-6 text-neutral-400 sm:text-base">
              Sign in to continue to your feed, or create a new account to start posting and messaging from a calm, dark interface.
            </p>
          </div>
        </section>

        <section className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
          <div className="mb-8 space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              {isSignup ? 'Create account' : 'Welcome back'}
            </p>
            <h2 className="text-2xl font-semibold text-white">
              {isSignup ? 'Join Sentic' : 'Log in to Sentic'}
            </h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {isSignup && (
              <label className="block space-y-2">
                <span className="text-sm text-neutral-300">Username</span>
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="sentic"
                  autoComplete="nickname"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-white/25"
                  required
                />
              </label>
            )}

            <label className="block space-y-2">
              <span className="text-sm text-neutral-300">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@domain.com"
                autoComplete="email"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-white/25"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-neutral-300">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-white/25"
                required
                minLength={8}
              />
            </label>

            {(error || message) && (
              <p className={`text-sm ${error ? 'text-red-300' : 'text-emerald-300'}`}>
                {error || message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-neutral-500">
            <span>{isSignup ? 'Already have an account?' : 'Need an account?'}</span>
            <a
              href={isSignup ? '/login' : '/signup'}
              className="font-medium text-white transition hover:text-neutral-300"
            >
              {isSignup ? 'Log in' : 'Sign up'}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}