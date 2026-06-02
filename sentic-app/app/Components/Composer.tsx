'use client';

import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useMemo, useRef, useState } from 'react';

type ComposerProps = {
  userId: string;
};

export default function Composer({ userId }: ComposerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
      ),
    []
  );
  const [files, setFiles] = useState<File[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState('');

  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[40px]',
      },
    },
  });

  if (!editor) return null;

  async function handlePost() {
    if (isPosting) {
      return;
    }

    const trimmedText = editor.getText().trim();
    const hasContent = trimmedText.length > 0 || files.length > 0;

    if (!hasContent) {
      setError('Write something or attach media before posting.');
      return;
    }

    setIsPosting(true);
    setError('');

    try {
      const mediaUrls: string[] = [];

      for (const file of files) {
        const fileExtension = file.name.split('.').pop() ?? 'bin';
        const safeName = `${userId}/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
        const { error: uploadError } = await supabase.storage
          .from('post-media')
          .upload(safeName, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage.from('post-media').getPublicUrl(safeName);
        mediaUrls.push(publicUrlData.publicUrl);
      }

      const content = {
        html: editor.getHTML(),
        json: editor.getJSON(),
        text: trimmedText,
      };

      const { error: insertError } = await supabase.from('posts').insert({
        user_id: userId,
        content,
        media_urls: mediaUrls,
      });

      if (insertError) {
        throw insertError;
      }

      editor.commands.clearContent();
      setFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (postError) {
      setError(postError instanceof Error ? postError.message : 'Failed to publish post.');
    } finally {
      setIsPosting(false);
    }
  }

  function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    setError('');
    setFiles(selectedFiles);
  }

  // The Toolbar only shows if the editor is focused
  return (
    <div className="mb-2 flex w-full pt-2 pb-2">
      <div className="w-9 h-9 rounded-full bg-neutral-700 shrink-0 mr-3"></div>
      
      <div className="flex-1">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelection}
          className="mb-3 block w-full text-xs text-neutral-400 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-neutral-200"
        />

        <EditorContent 
          editor={editor} 
          placeholder="Start a thread..." 
          className="w-full text-[15px] font-light placeholder-neutral-500"
        />

        {files.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-400">
            {files.map((file) => (
              <span key={`${file.name}-${file.size}`} className="rounded-full border border-white/10 px-3 py-1">
                {file.name}
              </span>
            ))}
          </div>
        )}

        {editor.isFocused && (
          <div className="flex items-center justify-between mt-3 animate-in fade-in duration-200">
            <div className="flex items-center space-x-4 text-neutral-400">
              <button 
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1 hover:text-white ${editor.isActive('bold') ? 'text-white' : ''}`}
              >
                <span className="font-bold text-xs">B</span>
              </button>
              <button 
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1 hover:text-white ${editor.isActive('italic') ? 'text-white' : ''}`}
              >
                <span className="italic font-serif text-xs">I</span>
              </button>
              <button 
                onClick={() => {
                  const url = window.prompt('URL');
                  if (url) editor.chain().focus().setLink({ href: url }).run();
                }}
                className={`p-1 hover:text-white ${editor.isActive('link') ? 'text-white' : ''}`}
              >
                <span className="text-xs underline">Link</span>
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              {error && <span className="max-w-[220px] text-right text-xs text-red-300">{error}</span>}

              <button 
                onClick={handlePost}
                disabled={isPosting}
                className="px-4 py-1 bg-white text-black text-sm font-semibold rounded-full hover:bg-neutral-200 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPosting ? 'Posting…' : 'Post'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}