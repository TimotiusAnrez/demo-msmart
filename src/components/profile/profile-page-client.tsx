'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import { ProfileView } from '@/components/frontend/profile/profile-view'
import { ProfileEditForm } from '@/components/frontend/profile/profile-edit-form'
import { ProfileActions } from '@/components/frontend/profile/profile-actions'
import type { User } from '@/payload-types'
import { checkRolePublic } from '@/helper/checkRoleHelper'

interface ProfilePageClientProps {
  initialUser: User
}

interface EditButtonProps {
  role: ('ADMIN_MS' | 'ADMIN_MSAGRI' | 'SUPER_ADMIN' | 'USER_BUSINESS' | 'USER')[]
  setEdit: (edit: boolean) => void
}

function AdminPanelNavButton({
  role,
}: {
  role: ('ADMIN_MS' | 'ADMIN_MSAGRI' | 'SUPER_ADMIN' | 'USER_BUSINESS' | 'USER')[]
}) {
  const adminAvailRole: ('ADMIN_MS' | 'ADMIN_MSAGRI' | 'SUPER_ADMIN' | 'USER_BUSINESS' | 'USER')[] =
    ['ADMIN_MS', 'ADMIN_MSAGRI', 'SUPER_ADMIN']
  const userBusinessRole: (
    | 'ADMIN_MS'
    | 'ADMIN_MSAGRI'
    | 'SUPER_ADMIN'
    | 'USER_BUSINESS'
    | 'USER'
  )[] = ['USER_BUSINESS']

  const router = useRouter()

  if (checkRolePublic(adminAvailRole, role)) {
    return <Button onClick={() => router.push('/admin')}>Admin Panel</Button>
  }

  if (checkRolePublic(userBusinessRole, role)) {
    return <Button onClick={() => router.push('/business')}>Business Panel</Button>
  }

  return null
}

function EditButton({ role, setEdit }: EditButtonProps) {
  const router = useRouter()

  if (checkRolePublic(['USER_BUSINESS', 'USER'], role)) {
    return <Button onClick={() => setEdit(true)}>Edit Profile</Button>
  }

  return null
}

export function ProfilePageClient({ initialUser }: ProfilePageClientProps) {
  const [user, setUser] = useState<User>(initialUser)
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = (updatedUser: Partial<User>) => {
    setUser({ ...user, ...updatedUser })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{user.fullName}</h2>
          <p className="text-muted-foreground">Manage your profile information</p>
        </div>
        <div className="flex gap-2">
          {!isEditing && <EditButton role={user.role} setEdit={setIsEditing} />}
          <AdminPanelNavButton role={user.role} />
          <ProfileActions />
        </div>
      </div>

      {isEditing ? (
        <ProfileEditForm user={user} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <ProfileView user={user} />
      )}
    </>
  )
}
