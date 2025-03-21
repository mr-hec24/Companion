import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

async function createServerSupabaseClient() {
    const cookieStore = await cookies()
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${cookieStore.get('sb:token')?.value || ''}`,
          },
        },
      }
    )
  }

export async function updateProfile(profileData: {
  name?: string,
  bio?: string,
  location?: string,
  avatar_url?: string
}) {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', user.id)
    .select()

  if (error) {
    throw error
  }

  return data
}

export async function getProfile() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    throw error
  }

  return data
}