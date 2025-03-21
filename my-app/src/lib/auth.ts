import { supabase } from './supabase'

export async function signUp(email: string, password: string, name: string) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data : {
        name: name || '',
      }
    }
  })
}

export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function resetPassword(email: string) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/update-password`
  })
}

export async function signOut() {
  return await supabase.auth.signOut()
}