import { createBrowserSupabaseClient } from '../client';

type Bucket = 'avatars' | 'post-images' | 'event-images' | 'cv-files' | 'opportunity-files';

export async function uploadFile(bucket: Bucket, path: string, file: File) {
  const supabase = createBrowserSupabaseClient();
  return supabase.storage.from(bucket).upload(path, file, { upsert: true });
}

export async function getPublicUrl(bucket: Bucket, path: string) {
  const supabase = createBrowserSupabaseClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteFile(bucket: Bucket, path: string) {
  const supabase = createBrowserSupabaseClient();
  return supabase.storage.from(bucket).remove([path]);
}
