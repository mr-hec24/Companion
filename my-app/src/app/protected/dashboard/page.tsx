import { getCurrentCouple } from '@/lib/server/couples'
import CoupleSection from './CoupleSection'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  
  // Fetch user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch couple information
  const couple = await getCurrentCouple()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <div className="flex items-center space-x-4">
            {user.user_metadata?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                No Image
              </div>
            )}
            <div>
              <p className="text-lg font-medium">{user.user_metadata?.name || 'User'}</p>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        <CoupleSection initialCouple={couple} />
      </div>
    </div>
  )
}