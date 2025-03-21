'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Couple = {
  id: string
  status: string
  partner1: {
    id: string
    name: string
    avatar_url: string | null
  }
  partner2: {
    id: string
    name: string
    avatar_url: string | null
  }
} | null

export default function CoupleSection({ initialCouple }: { initialCouple: Couple }) {
  const [couple, setCouple] = useState<Couple>(initialCouple)
  const router = useRouter()

  if (!couple) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl mb-4">You're not in a couple yet</h2>
        <div className="flex space-x-4">
          <Link 
            href="/protected/couple/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Create Invitation
          </Link>
          <Link 
            href="/protected/couple/accept"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Accept Invitation
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Your Couple</h2>
      <div className="flex items-center space-x-4">
        <div className="flex -space-x-2">
          {/* Partner 1 Avatar */}
          {couple.partner1.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={couple.partner1.avatar_url} 
              alt={couple.partner1.name}
              className="w-12 h-12 rounded-full border-2 border-white"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              1
            </div>
          )}

          {/* Partner 2 Avatar */}
          {couple.partner2.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={couple.partner2.avatar_url} 
              alt={couple.partner2.name}
              className="w-12 h-12 rounded-full border-2 border-white"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              2
            </div>
          )}
        </div>
        <div>
          <p className="text-lg font-medium">
            {couple.partner1.name} & {couple.partner2.name}
          </p>
          <p className="text-gray-500">
            Couple Status: {couple.status}
          </p>
        </div>
      </div>
    </div>
  )
}