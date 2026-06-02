import Composer from '@/app/Components/Composer';
import AuthGuard from '@/src/Components/AuthGuard';
import SenticLogo from '@/src/Components/SenticLogo';
import Feed from '@/src/Components/Feed';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (user) {
    const username =
      user.user_metadata?.username ??
      user.email?.split('@')[0] ??
      'sentic-user';

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (!existingProfile) {
      await supabase.from('profiles').insert({
        id: user.id,
        username,
        theme_preference: 'system',
      });
    }
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#050506] px-4 py-6 text-[#f3f5f7] sm:px-6">
        <div className="mx-auto flex w-full max-w-4xl gap-6 lg:flex-row">
          <div className="flex-1">
            <header className="flex items-center justify-between rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-xl mb-6">
              <SenticLogo className="text-3xl tracking-[0.25em] text-white" />
              <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">Home</span>
            </header>

            <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl mb-6">
              <Composer userId={user?.id ?? ''} />
            </section>

            <section>
              {/* Feed is a server component */}
              <Feed />
            </section>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}