import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'
import { Database } from '../database.types'

// Generate a more readable and secure invitation code
function generateInvitationCode(): string {
    // Create a code that's easy to read and hard to guess
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    
    // Generate a 6-character code
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      code += characters[randomIndex]
    }
  
    return code
  }

export async function getCurrentCouple() {
    const supabase = createServerComponentClient<Database>({ cookies })
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return null
    }
  
    const { data, error } = await supabase
      .from('couples')
      .select(`
        *,
        partner1:profiles!inner(id, name, email, avatar_url),
        partner2:profiles!inner(id, name, email, avatar_url)
      `)
      .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
      .single()
  
    if (error) {
      return null
    }
  
    // Determine which partner is the current user
    const isPartner1 = data.partner1.id === user.id
    const currentUserPartner = isPartner1 ? data.partner1 : data.partner2
    const otherPartner = isPartner1 ? data.partner2 : data.partner1
  
    return {
      ...data,
      currentUser: currentUserPartner,
      otherPartner: otherPartner
    }
  }

export async function createCoupleInvitation() {
  const supabase = createServerComponentClient<Database>({ cookies })
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Check if user is already in a couple
  const { data: existingCouple } = await supabase
    .from('couples')
    .select('*')
    .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
    .single()

  if (existingCouple) {
    throw new Error('You are already in a couple')
  }

  // Generate unique invitation code
  const invitationCode = generateInvitationCode();

  const { data, error } = await supabase
    .from('couples')
    .insert({
      partner1_id: user.id,
      status: 'pending',
      invitation_code: invitationCode
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return invitationCode
}

export async function acceptCoupleInvitation(invitationCode: string) {
  const supabase = createServerComponentClient<Database>({ cookies })
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Check if user is already in a couple
  const { data: existingCouple } = await supabase
    .from('couples')
    .select('*')
    .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
    .single()

  if (existingCouple) {
    throw new Error('You are already in a couple')
  }

  // Find the couple with the invitation code
  const { data: coupleToJoin, error: findError } = await supabase
    .from('couples')
    .select('*')
    .eq('invitation_code', invitationCode)
    .eq('status', 'pending')
    .single()

  if (findError || !coupleToJoin) {
    throw new Error('Invalid or expired invitation code')
  }

  // Prevent joining own invitation
  if (coupleToJoin.partner1_id === user.id) {
    throw new Error('You cannot accept your own invitation')
  }

  // Update the couple with the second partner
  const { data, error } = await supabase
    .from('couples')
    .update({ 
      partner2_id: user.id, 
      status: 'active' 
    })
    .eq('invitation_code', invitationCode)
    .eq('status', 'pending')
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}