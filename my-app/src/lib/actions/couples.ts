'use server'

import { createCoupleInvitation as serverCreateCoupleInvitation, 
         acceptCoupleInvitation as serverAcceptCoupleInvitation } from '../server/couples'
import { revalidatePath } from 'next/cache'

export async function createCoupleInvitation() {
  try {
    const invitationCode = await serverCreateCoupleInvitation()
    revalidatePath('/protected/dashboard')
    return invitationCode
  } catch (error) {
    console.error('Client-side couple invitation error:', error)
    throw error
  }
}

export async function acceptCoupleInvitation(invitationCode: string) {
  try {
    const couple = await serverAcceptCoupleInvitation(invitationCode)
    revalidatePath('/protected/dashboard')
    return couple
  } catch (error) {
    console.error('Client-side couple acceptance error:', error)
    throw error
  }
}