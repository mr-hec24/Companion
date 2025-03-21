'use client'

import { useState } from 'react'
import { createCoupleInvitation } from '@/lib/actions/couples'
import { useRouter } from 'next/navigation'

export default function CreateCoupleInvitationPage() {
  const [invitationCode, setInvitationCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCreateInvitation = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const code = await createCoupleInvitation()
      setInvitationCode(code)
    } catch (err) {
      console.error('Invitation creation error:', err)
      
      // More specific error handling
      if (err instanceof Error) {
        switch (err.message) {
          case 'You are already in a couple':
            setError('You are already part of a couple. Leave your current couple first.')
            break
          case 'User not authenticated':
            router.push('/auth/login')
            break
          default:
            setError(err.message || 'Failed to create invitation')
        }
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyCode = () => {
    if (invitationCode) {
      navigator.clipboard.writeText(invitationCode)
      alert('Invitation code copied!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create Couple Invitation
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}

          {!invitationCode ? (
            <button
              onClick={handleCreateInvitation}
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Generating...' : 'Generate Invitation Code'}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-md text-center">
                <p className="text-lg font-bold text-gray-800">
                  Invitation Code: {invitationCode}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Share this code with your partner
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleCopyCode}
                  className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Copy Code
                </button>
                <button
                  onClick={() => router.push('/protected/dashboard')}
                  className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}