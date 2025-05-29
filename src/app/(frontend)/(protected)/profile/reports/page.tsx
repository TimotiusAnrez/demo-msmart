import { Maintenance } from '@/app/(frontend)/page'
import { ProfileHeader } from '@/components/profile/profile-header'

export default function ReportsPage() {
  return (
    <div className="h-full w-full">
      <ProfileHeader title="Reports" />
      <Maintenance message="User reports list page is still in design" />
    </div>
  )
}
