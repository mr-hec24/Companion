'use client'

import { useState, useEffect } from 'react'
import { updateProfile, getProfile } from '@/lib/actions/profile'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profileData = await getProfile()
        setProfile(profileData)
        setName(profileData.name || '')
        setBio(profileData.bio || '')
        setLocation(profileData.location || '')
      } catch (err) {
        setError('Failed to load profile')
        router.push('/auth/login')
      }
    }

    fetchProfile()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await updateProfile({
        name,
        bio,
        location
      })
      
      // Optionally show success message or redirect
      router.push('/protected/dashboard')
    } catch (err) {
      setError('Failed to update profile')
    }
  }

  if (!profile) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  )
}