'use client'

import { useState } from 'react'
import { createCoupleInvitation } from '@/lib/actions/couples'
import { useRouter } from 'next/navigation'

export default function AcceptCoupleInvitationPage() {
  const [invitationCode, setInvitationCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAcceptInvitation = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await createCoupleInvitation()
      router.push('/protected/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept invitation')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Accept Couple Invitation
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleAcceptInvitation} className="space-y-6">
            <div>
              <label htmlFor="invitation-code" className="block text-sm font-medium text-gray-700">
                Invitation Code
              </label>
              <input
                id="invitation-code"
                type="text"
                required
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                placeholder="Enter invitation code"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Accept Invitation
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}