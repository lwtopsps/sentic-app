'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  console.info('[auth.login] env loaded', {
    hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasSupabaseAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    email,
  });

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('[auth.login] Supabase signInWithPassword failed', {
      name: error.name,
      message: error.message,
      status: (error as { status?: number }).status,
      code: (error as { code?: string }).code,
    });
    return;
  }

  redirect('/home');
}

// Add this to your action.ts
export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const username = String(formData.get('username') ?? '').trim();

  // 1. Validation Logic (The "No Special Signs" & "Length" rules)
  if (!username) return { error: "Username cannot be blank." };
  if (username.length < 3 || username.length > 20) return { error: "Username must be 3-20 characters." };
  if (!/^[a-zA-Z0-9*]+$/.test(username)) return { error: "Username can only contain letters, numbers, and *." };

  // 2. Check for duplicate username in database
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single();

  if (existingUser) return { error: "This username is already taken." };

  // 3. Create Auth User
  const { data: authData, error: signUpError } = await supabase.auth.signUp({ 
    email, 
    password,
    options: { data: { username } } 
  });

  if (signUpError) return { error: signUpError.message };

  // 4. Save to profiles table
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: authData.user.id, username });
      
    if (profileError) return { error: "Account created, but profile could not be saved." };
  }

  return { message: 'Check your email to verify your account!' };
}

// Server action: upload media to 'media' bucket
export async function uploadMedia(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get('file') as File | null;

  if (!file) {
    console.error('[uploadMedia] no file provided');
    return { error: 'No file provided' };
  }

  const ext = file.name.split('.').pop() ?? 'bin';
  const key = `media/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  try {
    const { error: uploadError } = await supabase.storage.from('media').upload(key, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

    if (uploadError) {
      console.error('[uploadMedia] uploadError', uploadError);
      return { error: uploadError.message };
    }

    const { data } = supabase.storage.from('media').getPublicUrl(key);
    return { url: data.publicUrl };
  } catch (err) {
    console.error('[uploadMedia] unexpected error', err);
    return { error: String(err) };
  }
}

// Server action: like a post
export async function likePost(postId: string, userId: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('likes').insert({ post_id: postId, user_id: userId });
    if (error) {
      console.error('[likePost] error', error);
      return { error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error('[likePost] unexpected', err);
    return { error: String(err) };
  }
}

// Server action: share a post
export async function sharePost(postId: string, userId: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('shares').insert({ post_id: postId, user_id: userId });
    if (error) {
      console.error('[sharePost] error', error);
      return { error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error('[sharePost] unexpected', err);
    return { error: String(err) };
  }
}

// Server action: save a post
export async function savePost(postId: string, userId: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('saves').insert({ post_id: postId, user_id: userId });
    if (error) {
      console.error('[savePost] error', error);
      return { error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error('[savePost] unexpected', err);
    return { error: String(err) };

    
  }
}

